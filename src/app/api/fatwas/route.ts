import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getEmbedding } from "@/lib/api-clients/ragService";
import { z } from "zod";

const createSchema = z.object({
  title: z.string().min(3).max(300),
  category: z.string().min(2),
  summary: z.string().min(10),
  content: z.string().min(10),
  source: z.string().optional(),
  scholarName: z.string().optional(),
  citationLink: z.string().url().optional().or(z.literal("")),
  date: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const category = searchParams.get("category") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (category) where.category = { equals: category, mode: "insensitive" };
    if (q) {
      where.OR = [
        { title: { contains: q, mode: "insensitive" } },
        { summary: { contains: q, mode: "insensitive" } },
        { content: { contains: q, mode: "insensitive" } },
        { scholarName: { contains: q, mode: "insensitive" } },
      ];
    }

    const [fatwas, total] = await Promise.all([
      db.fatwa.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        select: {
          id: true,
          title: true,
          category: true,
          summary: true,
          source: true,
          scholarName: true,
          citationLink: true,
          date: true,
          createdAt: true,
        },
      }),
      db.fatwa.count({ where }),
    ]);

    // Get distinct categories for filters
    const categories = await db.fatwa.findMany({
      distinct: ["category"],
      select: { category: true },
    });

    return NextResponse.json({
      fatwas,
      total,
      page,
      pages: Math.ceil(total / limit),
      categories: categories.map((c) => c.category),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: "Validation failed", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { title, category, summary, content, source, scholarName, citationLink, date } =
      parsed.data;

    // Generate embedding for semantic search
    const embeddingText = `${title} ${category} ${summary}`;
    const embedding = await getEmbedding(embeddingText);

    // Store fatwa with embedding via raw SQL (Prisma doesn't support vector writes directly)
    const vectorStr = `[${embedding.join(",")}]`;
    const id = crypto.randomUUID();

    await db.$executeRawUnsafe(`
      INSERT INTO "Fatwa" (id, title, category, summary, content, source, "scholarName", "citationLink", date, embedding, "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10::vector, NOW())
    `, id, title, category, summary, content, source || null, scholarName || null,
      citationLink || null, date ? new Date(date) : null, vectorStr);

    const fatwa = await db.fatwa.findUnique({ where: { id } });
    return NextResponse.json({ fatwa }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

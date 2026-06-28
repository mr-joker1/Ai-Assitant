import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const methodology = searchParams.get("methodology") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "20");
    const skip = (page - 1) * limit;

    const where: any = {};
    if (methodology) where.methodology = { equals: methodology, mode: "insensitive" };
    if (q) {
      where.OR = [
        { name: { contains: q, mode: "insensitive" } },
        { title: { contains: q, mode: "insensitive" } },
        { bio: { contains: q, mode: "insensitive" } },
      ];
    }

    const [scholars, total] = await Promise.all([
      db.scholar.findMany({
        where,
        orderBy: { rating: "desc" },
        skip,
        take: limit,
        include: {
          opinions: {
            take: 3,
            orderBy: { createdAt: "desc" },
          },
        },
      }),
      db.scholar.count({ where }),
    ]);

    return NextResponse.json({
      scholars,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

const createSchema = z.object({
  name: z.string().min(2),
  title: z.string().optional(),
  methodology: z.string().optional(),
  bio: z.string().optional(),
  publications: z.string().optional(),
  profileImageUrl: z.string().url().optional().or(z.literal("")),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Validation failed" }, { status: 400 });
    }

    const scholar = await db.scholar.create({ data: parsed.data });
    return NextResponse.json({ scholar }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

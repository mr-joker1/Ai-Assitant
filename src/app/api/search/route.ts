import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getEmbedding } from "@/lib/api-clients/ragService";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  type: z.enum(["ALL", "STOCKS", "CRYPTO", "FATWAS", "SCHOLARS", "NEWS"]).optional().default("ALL"),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("q") || "";
    const type = (searchParams.get("type") || "ALL") as any;

    const parsed = searchSchema.safeParse({ query, type });
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid search query" }, { status: 400 });
    }

    const { query: q, type: searchType } = parsed.data;
    const results: {
      companies: any[];
      cryptos: any[];
      fatwas: any[];
      scholars: any[];
      news: any[];
    } = {
      companies: [],
      cryptos: [],
      fatwas: [],
      scholars: [],
      news: [],
    };

    // Generate embedding for semantic search
    const embedding = await getEmbedding(q);
    const vectorStr = `[${embedding.join(",")}]`;

    // Parallel searches
    const searches: Promise<any>[] = [];

    if (searchType === "ALL" || searchType === "STOCKS") {
      searches.push(
        db.company.findMany({
          where: {
            OR: [
              { symbol: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
              { sector: { contains: q, mode: "insensitive" } },
              { industry: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: {
            id: true,
            symbol: true,
            name: true,
            sector: true,
            isHalal: true,
            complianceScore: true,
            currentPrice: true,
            logoUrl: true,
          },
        }).then((r) => { results.companies = r; })
      );
    }

    if (searchType === "ALL" || searchType === "CRYPTO") {
      searches.push(
        db.cryptoToken.findMany({
          where: {
            OR: [
              { symbol: { contains: q, mode: "insensitive" } },
              { name: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: {
            id: true,
            symbol: true,
            name: true,
            complianceStatus: true,
            price: true,
            logoUrl: true,
            consensusType: true,
          },
        }).then((r) => { results.cryptos = r; })
      );
    }

    if (searchType === "ALL" || searchType === "FATWAS") {
      // Try vector search first, fall back to keyword
      searches.push(
        (async () => {
          try {
            const fatwas: any[] = await db.$queryRawUnsafe(`
              SELECT id, title, category, summary, source, "citationLink",
                     (embedding <=> '${vectorStr}'::vector) as distance
              FROM "Fatwa"
              WHERE embedding IS NOT NULL
              ORDER BY distance ASC
              LIMIT 5
            `);
            if (fatwas.length > 0) {
              results.fatwas = fatwas;
              return;
            }
          } catch (_) {}

          results.fatwas = await db.fatwa.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 5,
            select: { id: true, title: true, category: true, summary: true, source: true },
          });
        })()
      );
    }

    if (searchType === "ALL" || searchType === "SCHOLARS") {
      searches.push(
        db.scholar.findMany({
          where: {
            OR: [
              { name: { contains: q, mode: "insensitive" } },
              { methodology: { contains: q, mode: "insensitive" } },
              { bio: { contains: q, mode: "insensitive" } },
            ],
          },
          take: 5,
          select: {
            id: true,
            name: true,
            title: true,
            methodology: true,
            profileImageUrl: true,
            rating: true,
          },
        }).then((r) => { results.scholars = r; })
      );
    }

    if (searchType === "ALL" || searchType === "NEWS") {
      searches.push(
        db.newsArticle.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
            ],
          },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true,
            title: true,
            description: true,
            source: true,
            url: true,
            publishedAt: true,
            imageUrl: true,
            category: true,
            isIslamicFinance: true,
          },
        }).then((r) => { results.news = r; })
      );
    }

    await Promise.allSettled(searches);

    const totalResults =
      results.companies.length +
      results.cryptos.length +
      results.fatwas.length +
      results.scholars.length +
      results.news.length;

    return NextResponse.json({ results, totalResults, query: q });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Search failed" }, { status: 500 });
  }
}

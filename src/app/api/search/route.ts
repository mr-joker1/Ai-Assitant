import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { z } from "zod";

const searchSchema = z.object({
  query: z.string().min(1).max(500),
  type: z.enum(["ALL", "STOCKS", "CRYPTO", "FATWAS", "SCHOLARS", "NEWS"]).optional().default("ALL"),
});

const FMP_KEY = process.env.FMP_API_KEY;
const CG_KEY = process.env.COINGECKO_API_KEY;

async function fetchWithTimeout(url: string, timeout = 7000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (e) {
    clearTimeout(id);
    throw e;
  }
}

/** Live FMP company search – returns up to 10 results */
async function searchStocksLive(q: string): Promise<any[]> {
  if (!FMP_KEY) return [];
  try {
    const url = `https://financialmodelingprep.com/api/v3/search?query=${encodeURIComponent(q)}&limit=10&apikey=${FMP_KEY}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return [];
    const data: any[] = await res.json();
    return (data || []).map((c) => ({
      id: c.symbol,
      symbol: c.symbol,
      name: c.name,
      sector: c.stockExchange || c.exchangeShortName || "Unknown",
      industry: null,
      isHalal: null,          // not yet screened
      complianceScore: null,
      currentPrice: null,
      logoUrl: `https://financialmodelingprep.com/image-placeholder/${c.symbol}.png`,
      isLive: true,           // flag to show "Screen now" CTA
    }));
  } catch {
    return [];
  }
}

/** CoinGecko search – returns up to 10 results */
async function searchCryptoLive(q: string): Promise<any[]> {
  try {
    const url = CG_KEY
      ? `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}&x_cg_demo_api_key=${CG_KEY}`
      : `https://api.coingecko.com/api/v3/search?query=${encodeURIComponent(q)}`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) return [];
    const data = await res.json();
    const coins: any[] = data?.coins || [];
    return coins.slice(0, 10).map((c) => ({
      id: c.id,
      symbol: c.symbol?.toUpperCase(),
      name: c.name,
      complianceStatus: null,   // not yet screened
      price: null,
      logoUrl: c.large || c.thumb || "",
      consensusType: null,
      isLive: true,
    }));
  } catch {
    return [];
  }
}

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

    const searches: Promise<any>[] = [];

    // ── STOCKS ──────────────────────────────────────────────────────────────
    if (searchType === "ALL" || searchType === "STOCKS") {
      searches.push(
        (async () => {
          // 1. DB cache (already screened companies)
          const dbResults = await db.company.findMany({
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
              id: true, symbol: true, name: true, sector: true,
              isHalal: true, complianceScore: true, currentPrice: true, logoUrl: true,
            },
          });

          // 2. Live FMP search
          const liveResults = await searchStocksLive(q);

          // Merge: prefer DB results, fill with live ones not already in DB
          const dbSymbols = new Set(dbResults.map((c) => c.symbol));
          const merged = [
            ...dbResults,
            ...liveResults.filter((c) => !dbSymbols.has(c.symbol)),
          ].slice(0, 10);

          results.companies = merged;
        })()
      );
    }

    // ── CRYPTO ──────────────────────────────────────────────────────────────
    if (searchType === "ALL" || searchType === "CRYPTO") {
      searches.push(
        (async () => {
          const dbResults = await db.cryptoToken.findMany({
            where: {
              OR: [
                { symbol: { contains: q, mode: "insensitive" } },
                { name: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 5,
            select: {
              id: true, symbol: true, name: true,
              complianceStatus: true, price: true, logoUrl: true, consensusType: true,
            },
          });

          const liveResults = await searchCryptoLive(q);

          const dbSymbols = new Set(dbResults.map((c) => c.symbol));
          const merged = [
            ...dbResults,
            ...liveResults.filter((c) => !dbSymbols.has(c.symbol)),
          ].slice(0, 10);

          results.cryptos = merged;
        })()
      );
    }

    // ── FATWAS (vector + keyword) ────────────────────────────────────────────
    if (searchType === "ALL" || searchType === "FATWAS") {
      searches.push(
        (async () => {
          // Try keyword search (vector search needs embeddings seeded)
          results.fatwas = await db.fatwa.findMany({
            where: {
              OR: [
                { title: { contains: q, mode: "insensitive" } },
                { summary: { contains: q, mode: "insensitive" } },
                { category: { contains: q, mode: "insensitive" } },
                { content: { contains: q, mode: "insensitive" } },
              ],
            },
            take: 5,
            select: { id: true, title: true, category: true, summary: true, source: true },
          });
        })()
      );
    }

    // ── SCHOLARS ─────────────────────────────────────────────────────────────
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
            id: true, name: true, title: true,
            methodology: true, profileImageUrl: true, rating: true,
          },
        }).then((r) => { results.scholars = r; })
      );
    }

    // ── NEWS ─────────────────────────────────────────────────────────────────
    if (searchType === "ALL" || searchType === "NEWS") {
      searches.push(
        db.newsArticle.findMany({
          where: {
            OR: [
              { title: { contains: q, mode: "insensitive" } },
              { description: { contains: q, mode: "insensitive" } },
              { symbolTags: { contains: q, mode: "insensitive" } },
            ],
          },
          orderBy: { publishedAt: "desc" },
          take: 5,
          select: {
            id: true, title: true, description: true, source: true,
            url: true, publishedAt: true, imageUrl: true,
            category: true, isIslamicFinance: true,
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

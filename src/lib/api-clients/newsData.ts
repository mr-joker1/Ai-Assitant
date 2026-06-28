import { db } from "../db";

const GNEWS_KEY = process.env.GNEWS_API_KEY;
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

export interface NewsItem {
  id?: string;
  title: string;
  description: string;
  content?: string;
  source: string;
  url: string;
  publishedAt: Date;
  imageUrl?: string;
  category: string;
  symbolTags?: string;
  isIslamicFinance: boolean;
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = 6000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeout);
  try {
    const response = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return response;
  } catch (error) {
    clearTimeout(id);
    throw error;
  }
}

/**
 * Check if the title/content relates to Islamic Finance, AAOIFI, Sukuk, etc.
 */
export function detectIslamicFinanceRelation(title: string, description: string): boolean {
  const text = `${title} ${description}`.toLowerCase();
  const islamicFinanceKeywords = [
    "shariah", "halal", "haram", "islamic finance", "islamic banking", "sukuk", 
    "aaoifi", "takaful", "riba", "interest-free", "ethical finance", "islamic investment",
    "sharia-compliant", "islamic bond"
  ];
  return islamicFinanceKeywords.some(keyword => text.includes(keyword));
}

/**
 * Fetch and Cache News Articles
 */
export async function getNewsFeed(options: {
  query?: string;
  category?: string;
  forceRefresh?: boolean;
} = {}): Promise<NewsItem[]> {
  const { query = "Islamic finance", category = "GENERAL", forceRefresh = false } = options;

  // 1. Check local DB cache first (valid for 1 hour)
  if (!forceRefresh) {
    try {
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
      const cached = await db.newsArticle.findMany({
        where: {
          category,
          publishedAt: { gte: oneHourAgo }
        },
        orderBy: { publishedAt: "desc" },
        take: 20
      });
      if (cached.length > 0) {
        return cached.map(a => ({
          id: a.id,
          title: a.title,
          description: a.description || "",
          content: a.content || "",
          source: a.source,
          url: a.url,
          publishedAt: a.publishedAt,
          imageUrl: a.imageUrl || undefined,
          category: a.category,
          symbolTags: a.symbolTags || undefined,
          isIslamicFinance: a.isIslamicFinance
        }));
      }
    } catch (e) {
      console.error("Failed to read news from cache database", e);
    }
  }

  // 2. Cache is empty or stale - fetch from external APIs
  let fetched: NewsItem[] = [];
  
  if (GNEWS_KEY) {
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&token=${GNEWS_KEY}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const data = await res.json();
        const articles = data.articles || [];
        fetched = articles.map((art: any) => ({
          title: art.title || "",
          description: art.description || "",
          content: art.content || "",
          source: art.source?.name || "GNews",
          url: art.url,
          publishedAt: new Date(art.publishedAt || Date.now()),
          imageUrl: art.image || null,
          category,
          isIslamicFinance: detectIslamicFinanceRelation(art.title, art.description)
        }));
      }
    } catch (e) {
      console.error("GNews API fetch failed, trying NewsAPI fallback", e);
    }
  }

  // NewsAPI fallback if GNews key is absent or failed
  if (fetched.length === 0 && (NEWSAPI_KEY || process.env.NEWSAPI_KEY)) {
    const key = NEWSAPI_KEY || process.env.NEWSAPI_KEY;
    try {
      const url = `https://newsapi.org/v2/everything?q=${encodeURIComponent(query)}&language=en&sortBy=publishedAt&apiKey=${key}`;
      const res = await fetchWithTimeout(url);
      if (res.ok) {
        const data = await res.json();
        const articles = data.articles || [];
        fetched = articles.slice(0, 15).map((art: any) => ({
          title: art.title || "",
          description: art.description || "",
          content: art.content || "",
          source: art.source?.name || "NewsAPI",
          url: art.url,
          publishedAt: new Date(art.publishedAt || Date.now()),
          imageUrl: art.urlToImage || null,
          category,
          isIslamicFinance: detectIslamicFinanceRelation(art.title, art.description)
        }));
      }
    } catch (e) {
      console.error("NewsAPI fetch failed, falling back to simulated news feed", e);
    }
  }

  // Final fallback: simulated news feed if no keys or all down
  if (fetched.length === 0) {
    fetched = getSimulatedNews(query, category);
  }

  // 3. Store news in database asynchronously
  for (const item of fetched) {
    try {
      await db.newsArticle.upsert({
        where: { url: item.url },
        update: {
          title: item.title,
          description: item.description,
          content: item.content,
          imageUrl: item.imageUrl,
          isIslamicFinance: item.isIslamicFinance,
          category: item.category
        },
        create: {
          title: item.title,
          description: item.description,
          content: item.content,
          source: item.source,
          url: item.url,
          publishedAt: item.publishedAt,
          imageUrl: item.imageUrl,
          category: item.category,
          isIslamicFinance: item.isIslamicFinance
        }
      });
    } catch (err) {
      // Ignore duplicate insertion warnings
    }
  }

  return fetched;
}

/**
 * Simulated News Feed for stable mock fallback
 */
function getSimulatedNews(query: string, category: string): NewsItem[] {
  const timestamp = new Date();
  return [
    {
      title: "AAOIFI Publishes Draft Standard on Sukuk Compliance Audits",
      description: "The Accounting and Auditing Organization for Islamic Financial Institutions (AAOIFI) released its new framework targeting Sukuk purification rules...",
      source: "Islamic Finance News",
      url: "https://example.com/islamic-news/aaoifi-sukuk-audit-2026",
      publishedAt: new Date(timestamp.getTime() - 2 * 3600 * 1000), // 2h ago
      category: "SHARIAH",
      isIslamicFinance: true,
    },
    {
      title: "Shariah Compliant Tech Stocks Surge Amid Digital Transformation Wave",
      description: "Ethical investors gain exposure as major semiconductor and cloud software companies pass financial screening under Dow Jones methodology...",
      source: "Ethical Investor Daily",
      url: "https://example.com/islamic-news/shariah-compliant-tech-stocks-2026",
      publishedAt: new Date(timestamp.getTime() - 5 * 3600 * 1000), // 5h ago
      category: "STOCK",
      isIslamicFinance: true,
    },
    {
      title: "Scholars Debate Decentralized Finance (DeFi) Staking Compliance",
      description: "Leading Islamic jurists hold a roundtable discussing liquidity pools, yield farming, and the purification of staking rewards in PoS chains...",
      source: "Shariah Finance Bulletin",
      url: "https://example.com/islamic-news/scholars-debate-defi-staking-2026",
      publishedAt: new Date(timestamp.getTime() - 12 * 3600 * 1000), // 12h ago
      category: "CRYPTO",
      isIslamicFinance: true,
    }
  ];
}

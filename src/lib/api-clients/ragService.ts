import { db } from "../db";
import OpenAI from "openai";
import { getCompanyProfile, getCompanyFinancials, getRevenueSegments } from "./marketData";
import { screenCompany } from "../screening/screeningEngine";

const openaiApiKey = process.env.OPENAI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

// Primary: OpenAI client if key present
const openai = openaiApiKey ? new OpenAI({ apiKey: openaiApiKey }) : null;

// Fallback: Groq via OpenAI-compatible SDK (same API surface, different base URL + model)
const groq = groqApiKey
  ? new OpenAI({ apiKey: groqApiKey, baseURL: "https://api.groq.com/openai/v1" })
  : null;

export interface Citation {
  title: string;
  source: string;
  url?: string;
  type: "FATWA" | "SCHOLAR_OPINION" | "FINANCIAL_SCREEN";
}

export interface RagResult {
  answer: string;
  citations: Citation[];
}

/**
 * Generate embedding using text-embedding-3-small.
 * Falls back to zero-vector gracefully on quota / auth errors so the
 * rest of the pipeline (keyword search) still works.
 */
export async function getEmbedding(text: string): Promise<number[]> {
  if (!openai || !openaiApiKey) {
    return new Array(1536).fill(0);
  }
  try {
    const response = await openai.embeddings.create({
      model: "text-embedding-3-small",
      input: text,
    });
    return response.data[0].embedding;
  } catch (e: any) {
    // Quota exceeded or auth failure — fall back silently to keyword-only search
    if (
      e?.status === 429 ||
      e?.status === 401 ||
      e?.code === "insufficient_quota"
    ) {
      console.warn(
        "OpenAI embedding quota exceeded or key invalid — using keyword-only search"
      );
    } else {
      console.error("Embedding generation failed, returning mock zeros", e);
    }
    return new Array(1536).fill(0);
  }
}

/**
 * Perform hybrid keyword and semantic vector search on Fatwas
 */
export async function searchFatwas(
  query: string,
  embedding: number[],
  limit = 3
): Promise<any[]> {
  // Only attempt pgvector search if we have a real embedding (not all zeros)
  const hasRealEmbedding = embedding.some((v) => v !== 0);

  if (hasRealEmbedding) {
    try {
      const vectorStr = `[${embedding.join(",")}]`;
      const fatwas: any[] = await db.$queryRawUnsafe(`
        SELECT id, title, category, summary, content, source, "citationLink",
               (embedding <=> '${vectorStr}'::vector) as distance
        FROM "Fatwa"
        ORDER BY distance ASC
        LIMIT ${limit}
      `);

      if (fatwas && fatwas.length > 0) {
        return fatwas;
      }
    } catch (err) {
      console.warn("pgvector query failed, falling back to keyword search", err);
    }
  }

  // Keyword search fallback (always works, even without OpenAI)
  try {
    const keywords = query.split(" ").filter((w) => w.length > 3);
    const clauses = keywords.map((kw) => ({
      OR: [
        { title: { contains: kw, mode: "insensitive" as any } },
        { summary: { contains: kw, mode: "insensitive" as any } },
        { content: { contains: kw, mode: "insensitive" as any } },
      ],
    }));

    return await db.fatwa.findMany({
      where: clauses.length > 0 ? { AND: clauses } : {},
      take: limit,
    });
  } catch (fallbackErr) {
    console.error("Keyword fatwa search failed", fallbackErr);
    return [];
  }
}

/**
 * Call Groq via OpenAI-compatible SDK.
 * Used as the AI summariser when OpenAI is unavailable / over quota.
 */
async function callGroqSDK(prompt: string): Promise<string> {
  if (!groq) throw new Error("Groq client not initialised — GROQ_API_KEY missing");
  const response = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.2,
  });
  return response.choices[0].message.content || "No response";
}

/**
 * Run complete RAG execution pipeline.
 * AI priority: OpenAI (if key + quota ok) → Claude (if ANTHROPIC_API_KEY set) → offline summary
 */
export async function executeRagPipeline(
  query: string,
  userId = "anonymous-user"
): Promise<RagResult> {
  const citations: Citation[] = [];
  let retrievedContext = "";

  // 1. Generate Query Vector Embedding (gracefully falls back to zeros)
  const embedding = await getEmbedding(query);

  // 2. Fetch Relevant Fatwas
  const fatwas = await searchFatwas(query, embedding, 3);
  if (fatwas.length > 0) {
    retrievedContext += "\n--- RELEVANT SHARIAH FATWAS AND GUIDELINES ---\n";
    fatwas.forEach((f, idx) => {
      retrievedContext += `[Fatwa #${idx + 1}] Title: ${f.title}\nCategory: ${f.category}\nContent Summary: ${f.summary}\n`;
      citations.push({
        title: f.title,
        source: f.source || "Fatwa Database",
        url: f.citationLink || undefined,
        type: "FATWA",
      });
    });
  }

  // 3. Detect Stock Ticker / Crypto mentions in query and fetch financial screenings
  const words = query
    .toUpperCase()
    .replace(/[^A-Z\s]/g, "")
    .split(/\s+/);
  let screenedStockInfo = "";

  for (const word of words) {
    if (word.length >= 2 && word.length <= 5) {
      try {
        const company = await db.company.findUnique({
          where: { symbol: word },
          include: {
            ratios: { orderBy: { date: "desc" }, take: 1 },
          },
        });

        if (company) {
          const isHalal = company.isHalal;
          screenedStockInfo += `\nStock Mentioned: ${company.name} (${company.symbol})\nStatus: ${isHalal ? "HALAL" : "HARAM"
            }\nExplanation: ${company.explanation}\n`;
          citations.push({
            title: `Screening Profile: ${company.symbol}`,
            source: company.methodology,
            type: "FINANCIAL_SCREEN",
          });

          const opinions = await db.scholarOpinion.findMany({
            where: { companySymbol: company.symbol },
          });
          if (opinions.length > 0) {
            retrievedContext += "\n--- SCHOLAR OPINIONS ON DETECTED ASSETS ---\n";
            opinions.forEach((op) => {
              retrievedContext += `Scholar: ${op.scholarName}\nOpinion: ${op.opinion}\nReasoning: ${op.reasoning}\nEvidence: ${op.evidence}\n`;
              citations.push({
                title: `${op.scholarName} on ${company.symbol}`,
                source: op.source || "Scholar Hub",
                type: "SCHOLAR_OPINION",
              });
            });
          }
        }
      } catch (e) {
        // Ignore single word lookup errors
      }
    }
  }

  // 4. Build shared prompt
  const prompt = `You are the Lead Shariah Wealth Advisor for Islamic Investment Intelligence Platform.
Answer the user's question accurately based ONLY on facts and retrieved Shariah contexts. Do not hallucinate or fabricate certainty.
User Question: "${query}"

Retrieved Context Data:
${retrievedContext}
${screenedStockInfo}

Strict Rule Engine Compliance:
- If your answer mentions a company or cryptocurrency screening status, you MUST STRICTLY conform to the status provided in the Context: ${screenedStockInfo || "No asset screening provided."
    }.
- AI Safety Rule: If you think an asset is Halal but the rule engine states it is Haram, the rule engine wins. Write your explanation explaining the failure based on the rule engine ratios.
- Always prefer factual evidence. Cite standard references (Quran, Sunnah, Fiqh Councils, AAOIFI Standards).
- Cite citations matching the numbering like [Fatwa #1] or [Scholar Opinion on AAPL].

Provide a premium structured, detailed response in markdown.`;

  // 5. Try OpenAI first, then Claude, then offline fallback
  let answer =
    "I apologize, but AI capabilities are currently offline. No AI API key was found or all quotas are exhausted.";

  // --- Try OpenAI ---
  if (openai) {
    try {
      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // gpt-4-turbo replaced — widely available and cheaper
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      });
      answer = response.choices[0].message.content || answer;
      return { answer, citations };
    } catch (aiErr: any) {
      // If quota exceeded or model not found, fall through to Claude
      if (
        aiErr?.status === 429 ||
        aiErr?.status === 404 ||
        aiErr?.code === "insufficient_quota" ||
        aiErr?.code === "model_not_found"
      ) {
        console.warn(
          "OpenAI unavailable (quota/model error) — falling back to Claude"
        );
      } else {
        console.error("OpenAI call failed", aiErr);
      }
    }
  }

  // --- Try Groq (llama-3.3-70b) ---
  if (groq) {
    try {
      answer = await callGroqSDK(prompt);
      return { answer, citations };
    } catch (groqErr: any) {
      console.error("Groq call failed", groqErr);
      answer = `Error generating AI summary: ${groqErr.message}`;
    }
  }

  // --- Offline keyword-based fallback ---
  if (!openai && !groq) {
    answer = `Based on our offline Shariah Database:
${retrievedContext
        ? retrievedContext
        : "No direct matches found for your query. Try searching for specific fatwas or asset ticker symbols."
      }
Please note that you should consult with a qualified Shariah board advisor before making financial decisions.`;
  }

  return { answer, citations };
}
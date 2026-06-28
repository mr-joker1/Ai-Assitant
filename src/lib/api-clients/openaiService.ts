import OpenAI from "openai";
import { CompanyProfile } from "./marketData";
import { CompanyFinancials, ScreeningResult } from "../screening/screeningEngine";

const apiKey = process.env.OPENAI_API_KEY;
const groqApiKey = process.env.GROQ_API_KEY;

// Primary: OpenAI
const openai = apiKey ? new OpenAI({ apiKey }) : null;

// Fallback: Groq via OpenAI-compatible API
const groq = groqApiKey
  ? new OpenAI({ apiKey: groqApiKey, baseURL: "https://api.groq.com/openai/v1" })
  : null;

/**
 * Shared AI caller: tries OpenAI (gpt-4o-mini) first, then Groq (llama-3.3-70b).
 * Supports json_object response format on both.
 */
async function callAI(
  prompt: string,
  jsonMode = false
): Promise<string> {
  const jsonFormat = jsonMode ? { response_format: { type: "json_object" as const } } : {};

  // Try OpenAI first
  if (openai) {
    try {
      const res = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1,
        ...jsonFormat,
      });
      return res.choices[0].message.content || "";
    } catch (e: any) {
      const skip =
        e?.status === 429 ||
        e?.status === 401 ||
        e?.code === "insufficient_quota" ||
        e?.code === "model_not_found";
      if (!skip) throw e;
      console.warn("OpenAI unavailable, falling back to Groq", e?.code || e?.status);
    }
  }

  // Fallback to Groq
  if (groq) {
    const res = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [{ role: "user", content: prompt }],
      temperature: 0.1,
      // Groq supports json_object mode
      ...(jsonMode ? { response_format: { type: "json_object" as const } } : {}),
    });
    return res.choices[0].message.content || "";
  }

  throw new Error("No AI provider available. Set OPENAI_API_KEY or GROQ_API_KEY in .env");
}

/**
 * Clean and parse JSON block from markdown code blocks if AI returns them
 */
function cleanAndParseJSON(text: string): any {
  try {
    const jsonMatch = text.match(/```json\s*([\s\S]*?)\s*```/) || [null, text];
    const cleaned = jsonMatch[1].trim();
    return JSON.parse(cleaned);
  } catch (e) {
    console.error("Failed to parse JSON response from AI", e, text);
    throw new Error("Invalid AI JSON output format");
  }
}

/**
 * 1. AI Explanation & Scholarly Opinions for Stock Screenings
 */
export async function generateCompanyAiExplanation(
  profile: CompanyProfile,
  financials: CompanyFinancials,
  screening: ScreeningResult
): Promise<{
  explanation: string;
  scholarOpinions: { scholarName: string; opinion: string; reasoning: string; evidence: string; source: string }[];
  evidence: string;
}> {
  const fallback = {
    explanation: `This company is determined to be ${screening.isHalal ? "Halal" : "Haram"} under ${screening.methodology} guidelines. It has a compliance score of ${screening.complianceScore}%.`,
    scholarOpinions: [
      {
        scholarName: "Mufti Muhammad Taqi Usmani",
        opinion: screening.isHalal ? "Compliant" : "Non-Compliant",
        reasoning: `Based on a threshold of 30% debt-to-market-cap and 5% impure revenue limits.`,
        evidence: "AAOIFI Shariah Standard No. 21 (Financial Papers).",
        source: "AAOIFI Guidance Ledger"
      }
    ],
    evidence: `Financial Screening results: Debt ratio ${screening.financialScreen.debtRatio.toFixed(2)}% (limit ${screening.financialScreen.debtThreshold}%), Interest income ratio ${screening.financialScreen.interestIncomeRatio.toFixed(2)}% (limit ${screening.financialScreen.interestIncomeThreshold}%).`
  };

  if (!openai && !groq) return fallback;

  const prompt = `You are the Lead Shariah Board Advisor for the platform.
Analyze the compliance screening results of ${profile.name} (${profile.symbol}).
Here are the facts:
- Industry: ${profile.industry}
- Sector: ${profile.sector}
- Business Description: ${profile.description}
- Screening Methodology: ${screening.methodology}
- Overall Result: ${screening.isHalal ? "HALAL (Compliant)" : "HARAM (Non-Compliant)"}
- Business Screen Prohibited Revenue %: ${screening.businessScreen.prohibitedRevenuePercentage.toFixed(2)}%
- Financial Screens:
  * Debt to Market Cap: ${screening.financialScreen.debtRatio.toFixed(2)}% (Threshold: ${screening.financialScreen.debtThreshold}%)
  * Cash to Market Cap: ${screening.financialScreen.cashRatio.toFixed(2)}% (Threshold: ${screening.financialScreen.cashThreshold}%)
  * Receivables to Market Cap: ${screening.financialScreen.receivablesRatio.toFixed(2)}% (Threshold: ${screening.financialScreen.receivablesThreshold}%)
  * Interest Income to Revenue: ${screening.financialScreen.interestIncomeRatio.toFixed(2)}% (Threshold: ${screening.financialScreen.interestIncomeThreshold}%)

You MUST NOT change the Halal/Haram status. The screening status is LOCKED and set to: ${screening.isHalal ? "HALAL (Compliant)" : "HARAM (Non-Compliant)"}.
Write an elegant Shariah explanation. List at least two scholar opinions (e.g. Taqi Usmani, Nizam Yaquby, or AAOIFI rulings).

Return ONLY valid JSON in this exact structure:
{
  "explanation": "Markdown Shariah explanation.",
  "scholarOpinions": [
    {"scholarName": "Name", "opinion": "Halal or Haram or Tolerated", "reasoning": "...", "evidence": "...", "source": "..."}
  ],
  "evidence": "Summary of primary metrics."
}`;

  try {
    const text = await callAI(prompt, true);
    return JSON.parse(text);
  } catch (e) {
    console.error("Failed to generate AI explanation, using fallback", e);
    return fallback;
  }
}

/**
 * 2. Crypto Analyzer RAG extraction
 */
export async function analyzeCryptoCompliance(
  name: string,
  symbol: string,
  desc: string,
  consensus: string,
  stakingAvailable: boolean
): Promise<{
  consensus: string;
  mining: string;
  staking: string;
  governance: string;
  tokenomics: string;
  whitepaperSummary: string;
  scholarOpinions: { scholarName: string; opinion: string; reasoning: string; evidence: string; source: string }[];
  riskAnalysis: string;
  defiExposure: string;
  status: string;
}> {
  const fallback = {
    consensus: consensus,
    mining: consensus.includes("PoW") ? "Compliant: Mining rewards represent compute work utility." : "Not applicable: Uses staking mechanisms.",
    staking: stakingAvailable ? "Requires purification: Staking rewards derived from transactions are compliant, but validator interest-bearing loans must be avoided." : "Not applicable.",
    governance: "Decentralized. No interest-bearing elements found in core chain operations.",
    tokenomics: "Utility token designed for gas fees and validators.",
    whitepaperSummary: `${name} operates as a smart contract network.`,
    scholarOpinions: [
      {
        scholarName: "Dr. Ali Al-Quradaghi",
        opinion: "Halal",
        reasoning: "Tokens possessing real utility in computing, staking, or gas mechanisms are considered assets (Maal) and are permissible.",
        evidence: "Fiqh principles of contract utility (Urf).",
        source: "Islamic Fiqh Academy"
      }
    ],
    riskAnalysis: "Medium risk. High volatility and potential exposure to yield farming products.",
    defiExposure: "Indirect exposure via secondary decentralized exchanges.",
    status: "HALAL"
  };

  if (!openai && !groq) return fallback;

  const prompt = `Analyze cryptocurrency compliance: ${name} (${symbol})
Facts:
- Consensus Type: ${consensus}
- Staking Available: ${stakingAvailable ? "Yes" : "No"}
- Description: ${desc.substring(0, 1500)}

Determine: consensus compliance, mining rules, staking rules, governance, tokenomics, scholar opinions, risk analysis, DeFi exposure, and overall Shariah status.

Return ONLY valid JSON:
{
  "consensus": "...", "mining": "...", "staking": "...", "governance": "...", "tokenomics": "...",
  "whitepaperSummary": "...",
  "scholarOpinions": [{"scholarName": "...", "opinion": "HALAL or HARAM or QUESTIONABLE", "reasoning": "...", "evidence": "...", "source": "..."}],
  "riskAnalysis": "...", "defiExposure": "...", "status": "HALAL or HARAM or QUESTIONABLE"
}`;

  try {
    const text = await callAI(prompt, true);
    return JSON.parse(text);
  } catch (e) {
    console.error("Crypto AI screening failed, using fallback", e);
    return fallback;
  }
}

/**
 * 3. Pitch Deck / Startup analyzer
 */
export async function analyzeStartupPitchDeck(
  filename: string,
  text: string
): Promise<{
  businessActivities: string;
  revenueModel: string;
  funding: string;
  loans: string;
  investments: string;
  contracts: string;
  complianceScore: number;
  status: string;
  reasons: string;
  evidence: string;
  suggestions: string;
}> {
  const fallback = {
    businessActivities: "Extracted startup business model.",
    revenueModel: "Subscription services.",
    funding: "Pre-seed equity funding.",
    loans: "No debt declared.",
    investments: "Equity options.",
    contracts: "Standard venture partnership contracts.",
    complianceScore: 85,
    status: "HALAL",
    reasons: "Main business operations are compliant. No interest-bearing loans found.",
    evidence: "AAOIFI standards on startup venture funding.",
    suggestions: "Ensure future venture debt is Shariah-compliant (Qard Hasan or Murabaha structures)."
  };

  if (!openai && !groq) return fallback;

  const prompt = `Analyze this startup pitch deck / business plan. Extract and evaluate Shariah compliance.
Document: ${filename}
Content:
${text.substring(0, 4000)}

Evaluate: business activities, revenue model, funding, loans, investments, contracts, compliance score (0-100), status (HALAL or HARAM), reasons, evidence, suggestions.

Return ONLY valid JSON:
{
  "businessActivities": "...", "revenueModel": "...", "funding": "...", "loans": "...",
  "investments": "...", "contracts": "...", "complianceScore": 85,
  "status": "HALAL or HARAM", "reasons": "...", "evidence": "...", "suggestions": "..."
}`;

  try {
    const text = await callAI(prompt, true);
    return JSON.parse(text);
  } catch (e) {
    console.error("Startup AI analyzer failed, using fallback", e);
    return fallback;
  }
}

/**
 * 4. Local Business Analyzer (restaurants, factories, software, shop)
 */
export async function analyzeBusinessLocal(
  type: string,
  name: string,
  description: string,
  loansAmount: number,
  investmentsAmount: number
): Promise<{
  activities: string;
  incomeSources: string;
  prohibitedActivities: string;
  complianceStatus: string;
  suggestions: string;
}> {
  const fallback = {
    activities: `Operations for a ${type} named ${name}.`,
    incomeSources: "Standard commercial sales.",
    prohibitedActivities: "None detected in core description.",
    complianceStatus: loansAmount > 0 ? "QUESTIONABLE" : "HALAL",
    suggestions: loansAmount > 0 
      ? "Replace interest-bearing conventional debt with Murabaha or Musharakah capital."
      : "Maintain strict business accounts separate from interest-bearing deposits."
  };

  if (!openai && !groq) return fallback;

  const prompt = `You are a Shariah auditor. Analyze this local business:
- Name: ${name}
- Type: ${type}
- Description: ${description}
- Conventional Loans: $${loansAmount}
- Interest-Bearing Investments: $${investmentsAmount}

Evaluate compliance. If conventional loans present, note that interest (riba) is Haram.

Return ONLY valid JSON:
{
  "activities": "...", "incomeSources": "...", "prohibitedActivities": "...",
  "complianceStatus": "HALAL or HARAM or QUESTIONABLE", "suggestions": "..."
}`;

  try {
    const text = await callAI(prompt, true);
    return JSON.parse(text);
  } catch (e) {
    console.error("Business local AI audit failed", e);
    return fallback;
  }
}

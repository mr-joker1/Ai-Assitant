import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { auth } from "@/auth";
import OpenAI from "openai";

const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;

const groq = process.env.GROQ_API_KEY
  ? new OpenAI({ apiKey: process.env.GROQ_API_KEY, baseURL: "https://api.groq.com/openai/v1" })
  : null;

// Fixed gold and silver prices per gram for calculation (or fetch live mock)
const GOLD_PRICE_PER_GRAM = 75.0; // USD
const SILVER_PRICE_PER_GRAM = 1.0; // USD

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const body = await req.json();
    const {
      cashAmount = 0,
      goldWeight = 0,
      silverWeight = 0,
      stocksValue = 0,
      cryptoValue = 0,
      businessAssets = 0,
      receivables = 0,
      liabilities = 0,
      nisabMethodology = "SILVER" // GOLD or SILVER
    } = body;

    // 1. Math calculations
    const goldNisabThreshold = 85; // grams
    const silverNisabThreshold = 595; // grams

    const goldNisabValue = goldNisabThreshold * GOLD_PRICE_PER_GRAM; // ~$6375
    const silverNisabValue = silverNisabThreshold * SILVER_PRICE_PER_GRAM; // ~$595

    const selectedNisab = nisabMethodology === "GOLD" ? goldNisabValue : silverNisabValue;

    const goldValue = goldWeight * GOLD_PRICE_PER_GRAM;
    const silverValue = silverWeight * SILVER_PRICE_PER_GRAM;

    // Net Zakatatable wealth
    const grossAssets = cashAmount + goldValue + silverValue + stocksValue + cryptoValue + businessAssets + receivables;
    const netAssets = Math.max(0, grossAssets - liabilities);

    const isEligible = netAssets >= selectedNisab;
    const totalZakat = isEligible ? netAssets * 0.025 : 0; // 2.5% rate

    // 2. Generate AI Explanation of results
    let aiExplanation = `Your net assets ($${netAssets.toLocaleString()}) are ${isEligible ? "above" : "below"} the Nisab threshold ($${selectedNisab.toLocaleString()} based on ${nisabMethodology}). Therefore, your Zakat due is $${totalZakat.toLocaleString()}.`;

    const aiProvider = openai || groq;
    const aiModel = openai ? "gpt-4o-mini" : "llama-3.3-70b-versatile";

    if (aiProvider) {
      try {
        const prompt = `Explain this Zakat calculation results as an expert Islamic Wealth Advisor:
- Gross Assets: $${grossAssets.toLocaleString()}
- Cash: $${cashAmount.toLocaleString()}
- Gold Value: $${goldValue.toLocaleString()} (${goldWeight}g)
- Silver Value: $${silverValue.toLocaleString()} (${silverWeight}g)
- Stocks: $${stocksValue.toLocaleString()}
- Crypto: $${cryptoValue.toLocaleString()}
- Business Assets: $${businessAssets.toLocaleString()}
- Receivables: $${receivables.toLocaleString()}
- Liabilities Deducted: $${liabilities.toLocaleString()}
- Net Zakatatable Assets: $${netAssets.toLocaleString()}
- Selected Nisab Threshold: $${selectedNisab.toLocaleString()} (${nisabMethodology} standard)
- Zakat Due (2.5%): $${totalZakat.toLocaleString()}

Provide:
1. Verification of the calculation steps.
2. A brief guide on whom to pay Zakat to (the 8 categories mentioned in Surah At-Tawbah, Verse 60).
3. Suggestions on purification (if any stock dividends included).
Keep it premium, clear, structured in markdown, and supportive.`;

        const response = await aiProvider.chat.completions.create({
          model: aiModel,
          messages: [{ role: "user", content: prompt }],
          temperature: 0.1,
        });
        aiExplanation = response.choices[0].message.content || aiExplanation;
      } catch (aiErr) {
        console.error("Zakat AI prompt generation failed", aiErr);
      }
    }

    // 3. Save calculations
    const zakatCalculation = await db.zakatCalculation.create({
      data: {
        userId,
        cashAmount,
        goldWeight,
        silverWeight,
        stocksValue,
        cryptoValue,
        businessAssets,
        receivables,
        liabilities,
        totalZakat,
      }
    });

    return NextResponse.json({
      zakatCalculation,
      goldPrice: GOLD_PRICE_PER_GRAM,
      silverPrice: SILVER_PRICE_PER_GRAM,
      goldNisabValue,
      silverNisabValue,
      netAssets,
      isEligible,
      totalZakat,
      explanation: aiExplanation
    });
  } catch (error: any) {
    console.error("Zakat calculation failed:", error);
    return NextResponse.json({ error: error.message || "Failed to calculate Zakat" }, { status: 500 });
  }
}

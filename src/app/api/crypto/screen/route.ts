import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCryptoProfile } from "@/lib/api-clients/cryptoData";
import { analyzeCryptoCompliance } from "@/lib/api-clients/openaiService";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, forceRefresh = false } = body;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const cleanSymbol = symbol.toUpperCase().trim();

    // 1. Check DB Cache (refresh limit is 10 minutes for crypto prices, but screen can be cached longer, e.g., 24 hours for audit details)
    if (!forceRefresh) {
      const cachedToken = await db.cryptoToken.findUnique({
        where: { symbol: cleanSymbol },
        include: {
          opinions: true,
        }
      });

      if (cachedToken) {
        const cacheAge = Date.now() - cachedToken.lastScreenedAt.getTime();
        const cacheLimit = 24 * 60 * 60 * 1000; // 24 hours for full audit text
        
        if (cacheAge < cacheLimit) {
          return NextResponse.json({
            token: cachedToken,
            isCached: true
          });
        }
      }
    }

    // 2. Fetch live crypto details from CoinGecko
    const profile = await getCryptoProfile(cleanSymbol);

    // 3. Analyze Shariah compliance using GPT model (tokenomics, staking yield, gas utility)
    const analysis = await analyzeCryptoCompliance(
      profile.name,
      profile.symbol,
      profile.description,
      profile.consensusType,
      profile.stakingAvailable
    );

    const getStatus = (val: string): "HALAL" | "HARAM" | "TOLERATED" | "QUESTIONABLE" => {
      const u = (val || "").toUpperCase();
      if (u.includes("HALAL") || (u.includes("COMPLIANT") && !u.includes("NON"))) return "HALAL";
      if (u.includes("HARAM") || u.includes("NON")) return "HARAM";
      if (u.includes("TOLERATED")) return "TOLERATED";
      return "QUESTIONABLE";
    };

    const statusValue = getStatus(analysis.status);

    // 4. Save to Database
    const savedToken = await db.cryptoToken.upsert({
      where: { symbol: cleanSymbol },
      update: {
        name: profile.name,
        coingeckoId: profile.id,
        price: profile.price,
        lastPriceUpdate: new Date(),
        logoUrl: profile.logoUrl,
        consensusType: profile.consensusType,
        miningCompliance: analysis.mining.toLowerCase().includes("compliant"),
        stakingCompliance: analysis.staking.toLowerCase().includes("compliant") || !profile.stakingAvailable,
        governanceCompliance: !analysis.governance.toLowerCase().includes("non-compliant"),
        tokenomicsCompliance: !analysis.tokenomics.toLowerCase().includes("non-compliant"),
        whitepaperSummary: analysis.whitepaperSummary,
        complianceStatus: statusValue,
        riskScore: analysis.riskAnalysis.toLowerCase().includes("high") ? 80 : analysis.riskAnalysis.toLowerCase().includes("medium") ? 50 : 20,
        defiExposure: analysis.defiExposure,
        lastScreenedAt: new Date()
      },
      create: {
        symbol: cleanSymbol,
        name: profile.name,
        coingeckoId: profile.id,
        price: profile.price,
        lastPriceUpdate: new Date(),
        logoUrl: profile.logoUrl,
        consensusType: profile.consensusType,
        miningCompliance: analysis.mining.toLowerCase().includes("compliant"),
        stakingCompliance: analysis.staking.toLowerCase().includes("compliant") || !profile.stakingAvailable,
        governanceCompliance: !analysis.governance.toLowerCase().includes("non-compliant"),
        tokenomicsCompliance: !analysis.tokenomics.toLowerCase().includes("non-compliant"),
        whitepaperSummary: analysis.whitepaperSummary,
        complianceStatus: statusValue,
        riskScore: analysis.riskAnalysis.toLowerCase().includes("high") ? 80 : analysis.riskAnalysis.toLowerCase().includes("medium") ? 50 : 20,
        defiExposure: analysis.defiExposure,
        lastScreenedAt: new Date()
      }
    });

    // Save Scholar opinions on crypto
    if (analysis.scholarOpinions && analysis.scholarOpinions.length > 0) {
      for (const op of analysis.scholarOpinions) {
        let scholar = await db.scholar.findFirst({
          where: { name: op.scholarName }
        });
        if (!scholar) {
          scholar = await db.scholar.create({
            data: {
              name: op.scholarName,
              title: "Islamic Finance Scholar",
              methodology: "AAOIFI",
              bio: `Contemporary Shariah scholar specializing in digital assets compliance.`,
            }
          });
        }

        await db.scholarOpinion.create({
          data: {
            scholarId: scholar.id,
            scholarName: scholar.name,
            cryptoSymbol: cleanSymbol,
            opinion: getStatus(op.opinion),
            reasoning: op.reasoning,
            evidence: op.evidence,
            source: op.source
          }
        });
      }
    }

    return NextResponse.json({
      token: savedToken,
      analysis,
      isCached: false
    });
  } catch (error: any) {
    console.error("Crypto screen route failed:", error);
    await db.auditLog.create({
      data: {
        action: "CRYPTO_SCREEN_FAILURE",
        details: error.message || "Unknown error inside crypto screen route",
      }
    }).catch(() => {});

    return NextResponse.json({ error: error.message || "Failed to analyze crypto currency" }, { status: 500 });
  }
}

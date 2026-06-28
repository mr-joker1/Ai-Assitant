import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCompanyProfile, getCompanyFinancials, getRevenueSegments } from "@/lib/api-clients/marketData";
import { screenCompany, ScreeningMethodology } from "@/lib/screening/screeningEngine";
import { generateCompanyAiExplanation } from "@/lib/api-clients/openaiService";
import { getNewsFeed } from "@/lib/api-clients/newsData";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { symbol, methodology = "AAOIFI", forceRefresh = false } = body;

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const cleanSymbol = symbol.toUpperCase().trim();

    // 1. Check database cache (refresh limit is 24 hours)
    if (!forceRefresh) {
      const cachedCompany = await db.company.findUnique({
        where: { symbol: cleanSymbol },
        include: {
          segments: true,
          ratios: {
            orderBy: { date: "desc" },
            take: 1
          },
          opinions: true,
        }
      });

      if (cachedCompany) {
        const cacheAge = Date.now() - cachedCompany.lastScreenedAt.getTime();
        const cacheLimit = 24 * 60 * 60 * 1000; // 24 hours
        
        if (cacheAge < cacheLimit) {
          // Fetch cached news
          const companyNews = await getNewsFeed({ query: cleanSymbol, category: "STOCK" });

          return NextResponse.json({
            company: cachedCompany,
            screening: {
              isHalal: cachedCompany.isHalal,
              complianceScore: cachedCompany.complianceScore,
              confidenceScore: cachedCompany.confidenceScore,
              explanation: cachedCompany.explanation,
              methodology: cachedCompany.methodology,
              purificationRatio: cachedCompany.ratios[0]?.complianceResult ? cachedCompany.complianceScore / 10000 : 0.05, // fallback if missing
              businessScreen: {
                isCompliant: cachedCompany.isHalal,
                prohibitedRevenuePercentage: cachedCompany.segments.filter(s => !s.isHalal).reduce((sum, s) => sum + s.percentage, 0),
                prohibitedSegments: cachedCompany.segments.filter(s => !s.isHalal)
              },
              financialScreen: {
                isCompliant: cachedCompany.ratios[0]?.complianceResult || false,
                debtRatio: cachedCompany.ratios[0]?.debtToMarketCap || 0,
                cashRatio: cachedCompany.ratios[0]?.cashToMarketCap || 0,
                receivablesRatio: cachedCompany.ratios[0]?.receivablesToMarketCap || 0,
                interestIncomeRatio: cachedCompany.ratios[0]?.interestIncomeToRevenue || 0,
              }
            },
            news: companyNews,
            isCached: true
          });
        }
      }
    }

    // 2. Cache is stale or forced - fetch live financial data
    const profile = await getCompanyProfile(cleanSymbol);
    const financials = await getCompanyFinancials(cleanSymbol);
    const segments = await getRevenueSegments(cleanSymbol, profile.description);

    // 3. Calculate screening results using rule engine
    const screening = await screenCompany(financials, segments, methodology as ScreeningMethodology);

    // 4. Generate AI explanations and scholar opinions (OpenAI integration)
    const aiAnalysis = await generateCompanyAiExplanation(profile, financials, screening);

    // 5. Fetch recent news
    const companyNews = await getNewsFeed({ query: cleanSymbol, category: "STOCK", forceRefresh: true });

    // 6. Save results to the database (Upsert company details & add to historical log)
    const savedCompany = await db.company.upsert({
      where: { symbol: cleanSymbol },
      update: {
        name: profile.name,
        sector: profile.sector,
        industry: profile.industry,
        exchange: profile.exchange,
        currency: profile.currency,
        logoUrl: profile.logoUrl,
        currentPrice: profile.price,
        lastPriceUpdate: new Date(),
        isHalal: screening.isHalal,
        confidenceScore: screening.confidenceScore,
        complianceScore: screening.complianceScore,
        methodology: screening.methodology,
        explanation: aiAnalysis.explanation,
        businessSummary: profile.description,
        lastScreenedAt: new Date(),
        isCached: true
      },
      create: {
        symbol: cleanSymbol,
        name: profile.name,
        sector: profile.sector,
        industry: profile.industry,
        exchange: profile.exchange,
        currency: profile.currency,
        logoUrl: profile.logoUrl,
        currentPrice: profile.price,
        lastPriceUpdate: new Date(),
        isHalal: screening.isHalal,
        confidenceScore: screening.confidenceScore,
        complianceScore: screening.complianceScore,
        methodology: screening.methodology,
        explanation: aiAnalysis.explanation,
        businessSummary: profile.description,
        lastScreenedAt: new Date(),
        isCached: true
      }
    });

    // Save business segments
    await db.businessSegment.deleteMany({ where: { companyId: savedCompany.id } });
    await db.businessSegment.createMany({
      data: segments.map(seg => ({
        companyId: savedCompany.id,
        name: seg.name,
        revenue: seg.revenue,
        percentage: seg.percentage,
        isHalal: !screening.businessScreen.prohibitedSegments.some(ps => ps.name === seg.name),
        reason: screening.businessScreen.prohibitedSegments.find(ps => ps.name === seg.name)?.name ? "Prohibited sector match" : null
      }))
    });

    // Save financial ratios
    const savedRatio = await db.financialRatio.create({
      data: {
        companyId: savedCompany.id,
        debtToMarketCap: screening.financialScreen.debtRatio,
        liquidAssetsToTotalAssets: (financials.liquidAssets / (financials.totalAssets || 1)) * 100,
        cashToMarketCap: screening.financialScreen.cashRatio,
        receivablesToMarketCap: screening.financialScreen.receivablesRatio,
        interestIncomeToRevenue: screening.financialScreen.interestIncomeRatio,
        complianceResult: screening.financialScreen.isCompliant
      }
    });

    // Append to Compliance History Log (Immutable Ledger)
    await db.complianceHistory.create({
      data: {
        companyId: savedCompany.id,
        symbol: cleanSymbol,
        methodology: screening.methodology,
        debtRatio: screening.financialScreen.debtRatio,
        cashRatio: screening.financialScreen.cashRatio,
        receivablesRatio: screening.financialScreen.receivablesRatio,
        interestIncomeRatio: screening.financialScreen.interestIncomeRatio,
        result: screening.isHalal,
        purificationAmount: screening.purificationRatio,
        reason: aiAnalysis.evidence,
      }
    });

    // Save Scholar Opinions
    if (aiAnalysis.scholarOpinions && aiAnalysis.scholarOpinions.length > 0) {
      // Find or create scholar profiles and map opinions
      for (const op of aiAnalysis.scholarOpinions) {
        let scholar = await db.scholar.findFirst({
          where: { name: op.scholarName }
        });
        if (!scholar) {
          scholar = await db.scholar.create({
            data: {
              name: op.scholarName,
              title: "Islamic Finance Jurist",
              methodology: screening.methodology,
              bio: `Contemporary Shariah scholar specializing in Islamic economics.`,
            }
          });
        }

        await db.scholarOpinion.create({
          data: {
            scholarId: scholar.id,
            scholarName: scholar.name,
            companySymbol: cleanSymbol,
            opinion: op.opinion.toUpperCase() === "HALAL" ? "HALAL" : op.opinion.toUpperCase() === "HARAM" ? "HARAM" : "QUESTIONABLE",
            reasoning: op.reasoning,
            evidence: op.evidence,
            source: op.source
          }
        });
      }
    }

    // Return live response
    return NextResponse.json({
      company: savedCompany,
      screening,
      news: companyNews,
      isCached: false
    });
  } catch (error: any) {
    console.error("Company screen route failed:", error);
    // Write an error audit log
    await db.auditLog.create({
      data: {
        action: "COMPANY_SCREEN_FAILURE",
        details: error.message || "Unknown error inside company screen route",
      }
    }).catch(() => {});

    return NextResponse.json({ error: error.message || "Failed to analyze company" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const symbol = searchParams.get("symbol");

    if (!symbol) {
      return NextResponse.json({ error: "Symbol is required" }, { status: 400 });
    }

    const cleanSymbol = symbol.toUpperCase().trim();
    
    // Fetch historical data for chart
    const history = await db.complianceHistory.findMany({
      where: { symbol: cleanSymbol },
      orderBy: { timestamp: "asc" },
      take: 30
    });

    return NextResponse.json({ history });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

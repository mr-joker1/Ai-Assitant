import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getCompanyProfile, getCompanyFinancials, getRevenueSegments } from "@/lib/api-clients/marketData";
import { screenCompany } from "@/lib/screening/screeningEngine";
import { getCryptoProfile } from "@/lib/api-clients/cryptoData";
import { auth } from "@/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const userId = session?.user?.id || "anonymous-user";

    const body = await req.json();
    const { holdings = [], name = "My Shariah Portfolio", portfolioId } = body;

    let items = holdings;

    // If a portfolioId is specified, fetch the holdings from the database
    if (portfolioId) {
      const dbPortfolio = await db.portfolio.findUnique({
        where: { id: portfolioId },
        include: { holdings: true }
      });
      if (dbPortfolio) {
        items = dbPortfolio.holdings;
      }
    }

    if (items.length === 0) {
      return NextResponse.json({ error: "No holdings found to analyze" }, { status: 400 });
    }

    let totalValue = 0;
    let compliantValue = 0;
    let totalPurificationDue = 0;
    const processedHoldings: any[] = [];
    const sectorAllocationMap: Record<string, number> = {};
    const assetAllocationMap: Record<string, number> = { STOCK: 0, CRYPTO: 0, ETF: 0 };

    // Process each holding
    for (const item of items) {
      let price = item.avgPrice || 10;
      let holdingName = item.name || item.symbol;
      let isHalal = false;
      let sector = "Unknown";
      let purificationRatio = 0;
      let complianceStatus: "HALAL" | "HARAM" | "QUESTIONABLE" = "QUESTIONABLE";

      try {
        if (item.assetType === "STOCK" || item.assetType === "ETF") {
          const profile = await getCompanyProfile(item.symbol);
          const financials = await getCompanyFinancials(item.symbol);
          const segments = await getRevenueSegments(item.symbol, profile.description);
          const screening = await screenCompany(financials, segments, "AAOIFI");

          price = profile.price || price;
          holdingName = profile.name || holdingName;
          isHalal = screening.isHalal;
          sector = profile.sector || "Other";
          purificationRatio = screening.purificationRatio;
          complianceStatus = screening.isHalal ? "HALAL" : "HARAM";
        } else if (item.assetType === "CRYPTO") {
          const cryptoProfile = await getCryptoProfile(item.symbol);
          
          const cachedToken = await db.cryptoToken.findUnique({
            where: { symbol: item.symbol.toUpperCase() }
          });
          
          let tokenStatus = cachedToken?.complianceStatus || "QUESTIONABLE";
          if (!cachedToken) {
            const sym = item.symbol.toUpperCase();
            if (["BTC", "ETH", "SOL", "ADA", "DOT", "AVAX"].includes(sym)) {
              tokenStatus = "HALAL";
            } else if (["USDT", "USDC", "DAI"].includes(sym)) {
              tokenStatus = "HARAM";
            }
          }
          
          price = cryptoProfile.price || price;
          holdingName = cryptoProfile.name || holdingName;
          isHalal = tokenStatus === "HALAL";
          sector = "Cryptocurrency";
          complianceStatus = tokenStatus as any;
          purificationRatio = isHalal ? 0.0 : 0.05;
        }
      } catch (err) {
        // Fallback checks
        console.error(`Error processing portfolio holding ${item.symbol}`, err);
        isHalal = !["JPM", "BAC", "MS", "USDT"].includes(item.symbol.toUpperCase());
        complianceStatus = isHalal ? "HALAL" : "HARAM";
      }

      const quantity = parseFloat(item.quantity || "0");
      const value = quantity * price;
      totalValue += value;

      if (isHalal) {
        compliantValue += value;
      }

      // Calculate dividend purification. Assuming standard 2% dividend yield if real dividends are not loaded
      const estimatedDividend = value * 0.02;
      const purificationDue = estimatedDividend * purificationRatio;
      totalPurificationDue += purificationDue;

      // Track allocations
      sectorAllocationMap[sector] = (sectorAllocationMap[sector] || 0) + value;
      assetAllocationMap[item.assetType] = (assetAllocationMap[item.assetType] || 0) + value;

      processedHoldings.push({
        symbol: item.symbol,
        name: holdingName,
        assetType: item.assetType,
        quantity,
        avgPrice: price,
        totalValue: value,
        complianceStatus,
        purificationDue,
      });
    }

    // Normalized calculations
    const compliancePercent = totalValue > 0 ? (compliantValue / totalValue) * 100 : 100;
    
    // Convert maps to standard allocation array percentages
    const sectorAllocation = Object.entries(sectorAllocationMap).map(([name, val]) => ({
      name,
      value: totalValue > 0 ? parseFloat(((val / totalValue) * 100).toFixed(2)) : 0
    }));

    const assetAllocation = Object.entries(assetAllocationMap).map(([name, val]) => ({
      name,
      value: totalValue > 0 ? parseFloat(((val / totalValue) * 100).toFixed(2)) : 0
    }));

    // Suggest alternatives for Haram assets
    const suggestions: string[] = [];
    processedHoldings.forEach(h => {
      if (h.complianceStatus === "HARAM") {
        if (h.assetType === "STOCK") {
          suggestions.push(`Haram Stock Detected: ${h.symbol} is non-compliant. Consider replacing with Shariah-compliant alternatives like MSFT or AAPL in the Technology sector, or SPUS / HLAL (Shariah ETFs).`);
        } else if (h.assetType === "CRYPTO") {
          suggestions.push(`Haram Crypto/Stablecoin: ${h.symbol} has conventional lending risk or compliance issues. Consider replacing with gold-backed tokens like PAXG or native PoW/PoS tokens like BTC or ETH.`);
        }
      }
    });

    // Save Portfolio
    let portfolio: any;
    if (portfolioId) {
      portfolio = await db.portfolio.update({
        where: { id: portfolioId },
        data: {
          name,
          totalValue,
          compliancePercent,
          purificationDue: totalPurificationDue,
          sectorAllocation: JSON.stringify(sectorAllocation),
          assetAllocation: JSON.stringify(assetAllocation),
        }
      });
    } else {
      portfolio = await db.portfolio.create({
        data: {
          userId,
          name,
          totalValue,
          compliancePercent,
          purificationDue: totalPurificationDue,
          sectorAllocation: JSON.stringify(sectorAllocation),
          assetAllocation: JSON.stringify(assetAllocation),
        }
      });

      // Write holdings to DB
      await db.portfolioHolding.createMany({
        data: processedHoldings.map(h => ({
          portfolioId: portfolio.id,
          symbol: h.symbol,
          name: h.name,
          assetType: h.assetType,
          quantity: h.quantity,
          avgPrice: h.avgPrice,
          totalValue: h.totalValue,
          complianceStatus: h.complianceStatus,
          purificationDue: h.purificationDue,
        }))
      });
    }

    return NextResponse.json({
      portfolio,
      holdings: processedHoldings,
      compliancePercent,
      purificationDue: totalPurificationDue,
      sectorAllocation,
      assetAllocation,
      suggestions
    });
  } catch (error: any) {
    console.error("Portfolio analysis route failed:", error);
    return NextResponse.json({ error: error.message || "Failed to analyze portfolio" }, { status: 500 });
  }
}

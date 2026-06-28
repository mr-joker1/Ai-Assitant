import { db } from "../db";

export type ScreeningMethodology = "AAOIFI" | "DOW_JONES" | "SP_SHARIAH";

export interface CompanyFinancials {
  symbol: string;
  totalRevenue: number;
  interestIncome: number;
  totalDebt: number;
  marketCap: number;
  cashAndShortTermInvestments: number;
  accountsReceivable: number;
  totalAssets: number;
  liquidAssets: number; // Cash + short term investments + marketable securities
}

export interface RevenueSegment {
  name: string;
  revenue: number;
  isHalal: boolean;
  reason?: string;
  percentage: number;
}

export interface ScreeningResult {
  isHalal: boolean;
  complianceScore: number; // 0 to 100
  confidenceScore: number; // 0 to 100
  methodology: ScreeningMethodology;
  businessScreen: {
    isCompliant: boolean;
    prohibitedRevenue: number; // amount
    prohibitedRevenuePercentage: number; // %
    prohibitedSegments: { name: string; percentage: number; revenue: number }[];
  };
  financialScreen: {
    isCompliant: boolean;
    debtRatio: number;
    debtThreshold: number;
    cashRatio: number;
    cashThreshold: number;
    receivablesRatio: number;
    receivablesThreshold: number;
    interestIncomeRatio: number;
    interestIncomeThreshold: number;
  };
  purificationRatio: number; // percentage of dividend to purify (e.g. 0.04 for 4%)
  purificationExplanation: string;
}

// Prohibited sectors keywords for auto-flagging business segments
export const PROHIBITED_KEYWORDS = [
  "alcohol", "beer", "wine", "distillery", "liquor",
  "pork", "bacon", "ham", "swine",
  "gambling", "casino", "lottery", "betting",
  "tobacco", "cigarette", "cigar",
  "conventional finance", "banking", "bank", "lending", "interest-bearing", "insurance", "conventional insurance",
  "adult entertainment", "pornography", "porn",
  "defense", "weapons", "firearms", "ammunition", "military hardware"
];

export function isSegmentProhibited(name: string): { prohibited: boolean; reason?: string } {
  const normalized = name.toLowerCase();
  for (const keyword of PROHIBITED_KEYWORDS) {
    if (normalized.includes(keyword)) {
      return { prohibited: true, reason: `Matches prohibited category: ${keyword}` };
    }
  }
  return { prohibited: false };
}

// Default thresholds as fallback if database configurations are missing
export const DEFAULT_THRESHOLDS = {
  AAOIFI: {
    debtToMarketCap: 30.0,
    cashToMarketCap: 30.0,
    liquidAssetsToTotalAssets: 30.0,
    interestIncomeToRevenue: 5.0,
    prohibitedRevenueTolerance: 5.0,
  },
  DOW_JONES: {
    debtToMarketCap: 33.0,
    cashToMarketCap: 33.0,
    receivablesToMarketCap: 33.0,
    interestIncomeToRevenue: 5.0,
    prohibitedRevenueTolerance: 5.0,
  },
  SP_SHARIAH: {
    debtToMarketCap: 33.0,
    cashToMarketCap: 33.0,
    receivablesToMarketCap: 33.0, // In S&P, Cash + Accounts Receivables is often checked together, or standard 33% limit
    interestIncomeToRevenue: 5.0,
    prohibitedRevenueTolerance: 5.0,
  }
};

/**
 * Screen a company based on financials and business segments
 */
export async function screenCompany(
  financials: CompanyFinancials,
  segments: RevenueSegment[],
  methodology: ScreeningMethodology = "AAOIFI"
): Promise<ScreeningResult> {
  // 1. Fetch thresholds from DB, fallback to hardcoded defaults
  const thresholds = { ...DEFAULT_THRESHOLDS[methodology] };
  try {
    const dbThresholds = await db.configThreshold.findMany();
    for (const t of dbThresholds) {
      if (t.name.startsWith(methodology)) {
        const key = t.name.replace(`${methodology}_`, "") as keyof typeof thresholds;
        if (key in thresholds) {
          thresholds[key] = t.value as any;
        }
      }
    }
  } catch (e) {
    // DB might not be initialized or accessible, proceed with defaults
  }

  // 2. Perform Business Screening
  let prohibitedRevenue = 0;
  const prohibitedSegmentsList: { name: string; percentage: number; revenue: number }[] = [];

  for (const seg of segments) {
    const isProhibited = !seg.isHalal || isSegmentProhibited(seg.name).prohibited;
    if (isProhibited) {
      prohibitedRevenue += seg.revenue;
      prohibitedSegmentsList.push({
        name: seg.name,
        percentage: seg.percentage,
        revenue: seg.revenue,
      });
    }
  }

  const prohibitedRevenuePercentage = financials.totalRevenue > 0
    ? (prohibitedRevenue / financials.totalRevenue) * 100
    : 0;

  const businessCompliant = prohibitedRevenuePercentage < thresholds.prohibitedRevenueTolerance;

  // 3. Perform Financial Screening based on methodology
  let financialCompliant = false;
  let debtRatio = 0;
  let cashRatio = 0;
  let receivablesRatio = 0;
  let interestRatio = 0;

  const denomMarketCap = financials.marketCap > 0 ? financials.marketCap : 1;
  const denomTotalAssets = financials.totalAssets > 0 ? financials.totalAssets : 1;
  const denomRevenue = financials.totalRevenue > 0 ? financials.totalRevenue : 1;

  // Interest Income screening is common to all
  interestRatio = (financials.interestIncome / denomRevenue) * 100;
  const interestCompliant = interestRatio < thresholds.interestIncomeToRevenue;

  if (methodology === "AAOIFI") {
    debtRatio = (financials.totalDebt / denomMarketCap) * 100;
    cashRatio = (financials.cashAndShortTermInvestments / denomMarketCap) * 100;
    const liquidAssetsRatio = (financials.liquidAssets / denomTotalAssets) * 100;

    const debtCompliant = debtRatio < thresholds.debtToMarketCap;
    const cashCompliant = cashRatio < thresholds.cashToMarketCap;
    const liquidCompliant = liquidAssetsRatio < (thresholds as any).liquidAssetsToTotalAssets;

    financialCompliant = debtCompliant && cashCompliant && liquidCompliant && interestCompliant;
  } else if (methodology === "DOW_JONES") {
    debtRatio = (financials.totalDebt / denomMarketCap) * 100;
    cashRatio = (financials.cashAndShortTermInvestments / denomMarketCap) * 100;
    receivablesRatio = (financials.accountsReceivable / denomMarketCap) * 100;

    const debtCompliant = debtRatio < thresholds.debtToMarketCap;
    const cashCompliant = cashRatio < thresholds.cashToMarketCap;
    const receivablesCompliant = receivablesRatio < (thresholds as any).receivablesToMarketCap;

    financialCompliant = debtCompliant && cashCompliant && receivablesCompliant && interestCompliant;
  } else if (methodology === "SP_SHARIAH") {
    // S&P Shariah uses Debt/MarketCap and Cash+Receivables/MarketCap
    debtRatio = (financials.totalDebt / denomMarketCap) * 100;
    cashRatio = ((financials.cashAndShortTermInvestments + financials.accountsReceivable) / denomMarketCap) * 100;

    const debtCompliant = debtRatio < thresholds.debtToMarketCap;
    const cashReceivablesCompliant = cashRatio < thresholds.cashToMarketCap;

    financialCompliant = debtCompliant && cashReceivablesCompliant && interestCompliant;
  }

  // 4. Overall Halal Status
  const isHalal = businessCompliant && financialCompliant;

  // 5. Compute compliance score and confidence score
  // Business screening score contribution (50% max)
  const businessScorePart = Math.max(0, 50 - (prohibitedRevenuePercentage * 10)); // drops to 0 if prohibited revenue >= 5%
  // Financial screening score contribution (50% max)
  let financialScorePart = 0;
  if (financialCompliant) {
    financialScorePart = 50;
  } else {
    // partial compliance score if it fails slightly
    const failDegree = Math.max(0, (interestRatio / thresholds.interestIncomeToRevenue));
    financialScorePart = Math.max(0, 50 - (failDegree * 10));
  }

  const complianceScore = Math.round(businessScorePart + financialScorePart);
  const confidenceScore = financials.marketCap > 0 && financials.totalRevenue > 0 ? 95 : 60; // Higher confidence if financials are complete

  // 6. Purification Calculation (AAOIFI Standard: dividend purification)
  // Purification Ratio = (Interest Income + Prohibited Revenue) / Total Revenue
  const totalImpureIncome = financials.interestIncome + prohibitedRevenue;
  const purificationRatio = financials.totalRevenue > 0
    ? totalImpureIncome / financials.totalRevenue
    : 0;

  const purificationExplanation = purificationRatio > 0
    ? `Purification factor of ${(purificationRatio * 100).toFixed(4)}% determined based on total interest income ($${financials.interestIncome.toLocaleString()}) and non-compliant segment revenues ($${prohibitedRevenue.toLocaleString()}) divided by total revenues ($${financials.totalRevenue.toLocaleString()}).`
    : `No purification required. No interest income or non-halal revenues were detected.`;

  return {
    isHalal,
    complianceScore,
    confidenceScore,
    methodology,
    businessScreen: {
      isCompliant: businessCompliant,
      prohibitedRevenue,
      prohibitedRevenuePercentage,
      prohibitedSegments: prohibitedSegmentsList,
    },
    financialScreen: {
      isCompliant: financialCompliant,
      debtRatio,
      debtThreshold: thresholds.debtToMarketCap,
      cashRatio,
      cashThreshold: thresholds.cashToMarketCap,
      receivablesRatio,
      receivablesThreshold: (thresholds as any).receivablesToMarketCap || 0,
      interestIncomeRatio: interestRatio,
      interestIncomeThreshold: thresholds.interestIncomeToRevenue,
    },
    purificationRatio,
    purificationExplanation,
  };
}

"use client";

import { useState } from "react";
import { 
  Search, ShieldCheck, ShieldAlert, BookOpen, 
  HelpCircle, ChevronDown, RefreshCw, BarChart2, Radio, Newspaper
} from "lucide-react";
import { motion } from "framer-motion";

export default function CompanyAnalyzer() {
  const [symbol, setSymbol] = useState("");
  const [methodology, setMethodology] = useState<"AAOIFI" | "DOW_JONES" | "SP_SHARIAH">("AAOIFI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent, force = false) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/company/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, methodology, forceRefresh: force }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze stock");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred while screening.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Stock Shariah Analyzer</h2>
        <p className="text-muted-foreground text-sm">
          Run automated business operations audits and debt-to-equity leverage screenings on public equities.
        </p>
      </div>

      {/* Control Panel Form */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <form onSubmit={(e) => handleSearch(e)} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter Stock Ticker (e.g. MSFT, TSLA, AAPL, JPM)..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <div className="flex gap-4">
            <select
              value={methodology}
              onChange={(e) => setMethodology(e.target.value as any)}
              className="bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            >
              <option value="AAOIFI">AAOIFI Screen</option>
              <option value="DOW_JONES">Dow Jones Islamic</option>
              <option value="SP_SHARIAH">S&P Shariah Standard</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Screen Asset"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Screening Output Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Verdict Card */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border ${result.screening?.isHalal || result.company?.isHalal ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} flex items-center justify-between shadow-sm`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Audit Verdict</span>
                <h3 className="text-2xl font-bold text-foreground">{result.company?.name || symbol.toUpperCase()}</h3>
                <p className="text-xs text-muted-foreground">Currency: {result.company?.currency || "USD"} | Exchange: {result.company?.exchange || "NASDAQ"}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm ${
                  result.screening?.isHalal || result.company?.isHalal
                    ? "bg-primary/25 text-primary" 
                    : "bg-destructive/25 text-destructive"
                }`}>
                  {result.screening?.isHalal || result.company?.isHalal ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      SHARIAH COMPLIANT
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      NON-COMPLIANT
                    </>
                  )}
                </span>
                <span className="text-xs text-muted-foreground mt-1">Compliance Score: {result.screening?.complianceScore || result.company?.complianceScore}%</span>
              </div>
            </div>

            {/* Ratio Screening Details */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-primary" />
                Financial Ratios Checklist
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Debt Ratio */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Debt to Market Cap Ratio</span>
                    <span className="font-bold text-foreground">Limit: &lt; {result.screening?.financialScreen?.debtThreshold || 30}%</span>
                  </div>
                  <div className="text-lg font-bold mt-1 text-foreground">
                    {result.screening?.financialScreen?.debtRatio?.toFixed(2) || 0}%
                  </div>
                </div>

                {/* Interest Ratio */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Interest Income Ratio</span>
                    <span className="font-bold text-foreground">Limit: &lt; {result.screening?.financialScreen?.interestIncomeThreshold || 5}%</span>
                  </div>
                  <div className="text-lg font-bold mt-1 text-foreground">
                    {result.screening?.financialScreen?.interestIncomeRatio?.toFixed(2) || 0}%
                  </div>
                </div>

                {/* Cash Ratio */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Cash to Market Cap Ratio</span>
                    <span className="font-bold text-foreground">Limit: &lt; {result.screening?.financialScreen?.cashThreshold || 30}%</span>
                  </div>
                  <div className="text-lg font-bold mt-1 text-foreground">
                    {result.screening?.financialScreen?.cashRatio?.toFixed(2) || 0}%
                  </div>
                </div>

                {/* Receivables Ratio */}
                <div className="p-4 rounded-xl bg-secondary/50 border border-border">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-muted-foreground font-medium">Receivables to Market Cap</span>
                    <span className="font-bold text-foreground">Limit: &lt; {result.screening?.financialScreen?.receivablesThreshold || 33}%</span>
                  </div>
                  <div className="text-lg font-bold mt-1 text-foreground">
                    {result.screening?.financialScreen?.receivablesRatio?.toFixed(2) || 0}%
                  </div>
                </div>
              </div>
            </div>

            {/* AI Explanation Summary */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Shariah Advisor explainer
              </h4>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line prose max-w-none">
                {result.screening?.explanation || result.company?.explanation || "No explainer generated."}
              </div>
            </div>
          </div>

          {/* Scholar Opinions and News Right Panel */}
          <div className="space-y-6">
            {/* Purification card */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground">Purification Directive</h4>
              <div className="text-center p-4 rounded-xl bg-accent/15 border border-accent/20">
                <p className="text-xs text-muted-foreground">Purification Ratio Required</p>
                <div className="text-2xl font-black mt-1 text-foreground">
                  {((result.screening?.purificationRatio || 0) * 100).toFixed(4)}%
                </div>
                <p className="text-[10px] text-muted-foreground mt-1">Purification Amount = Dividend Received × Ratio</p>
              </div>
            </div>

            {/* Scholar opinions */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                Scholarly Opinions
              </h4>

              <div className="space-y-4 divide-y divide-border">
                {result.analysis?.scholarOpinions?.map((op: any, idx: number) => (
                  <div key={idx} className={`pt-4 ${idx === 0 ? "pt-0 border-t-0" : ""} space-y-2`}>
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-sm text-foreground">{op.scholarName}</span>
                      <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                        op.opinion.toUpperCase() === "HALAL" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                      }`}>
                        {op.opinion}
                      </span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{op.reasoning}</p>
                    <div className="text-[10px] text-muted-foreground flex gap-2">
                      <span className="font-medium">Evidence: {op.evidence}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-xs text-muted-foreground text-center py-4">No specific scholar consensus logs.</div>
                )}
              </div>
            </div>

            {/* Company news */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Newspaper className="w-4 h-4 text-primary" />
                Equities News Feed
              </h4>

              <div className="space-y-4">
                {result.news?.slice(0, 3).map((n: any, idx: number) => (
                  <a key={idx} href={n.url} target="_blank" rel="noreferrer" className="block p-3 rounded-lg hover:bg-secondary/40 transition-all border border-transparent hover:border-border">
                    <span className="text-[10px] text-muted-foreground font-semibold uppercase">{n.source}</span>
                    <span className="font-medium text-xs text-foreground block truncate mt-0.5">{n.title}</span>
                  </a>
                )) || (
                  <div className="text-xs text-muted-foreground text-center py-4">No recent company specific news found.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

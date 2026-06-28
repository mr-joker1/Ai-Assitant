"use client";

import { useState } from "react";
import { Search, Briefcase, RefreshCw, ShieldCheck, ShieldAlert, PieChart, Info } from "lucide-react";
import { motion } from "framer-motion";

export default function EtfAnalyzer() {
  const [symbol, setSymbol] = useState("");
  const [methodology, setMethodology] = useState<"AAOIFI" | "DOW_JONES" | "SP_SHARIAH">("AAOIFI");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/etf/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, methodology }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze ETF");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during ETF analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">ETF Shariah Compliance Analyzer</h2>
        <p className="text-muted-foreground text-sm">
          Run automated asset auditing on constituent holdings weight distributions for Exchange Traded Funds.
        </p>
      </div>

      {/* Control Panel Form */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter ETF Symbol (e.g. SPUS, HLAL, QQQ, SPY)..."
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
              <option value="AAOIFI">AAOIFI standards</option>
              <option value="DOW_JONES">Dow Jones Islamic</option>
              <option value="SP_SHARIAH">S&P Shariah</option>
            </select>

            <button
              type="submit"
              disabled={loading}
              className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Fund"}
            </button>
          </div>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* ETF Screen Output */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main Constituents list */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <PieChart className="w-4 h-4 text-primary" />
                Constituent Holdings Breakdown
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold">
                      <th className="py-3 px-2">Asset Symbol</th>
                      <th className="py-3 px-2">Weight</th>
                      <th className="py-3 px-2">Compliance Status</th>
                      <th className="py-3 px-2 text-right">Verification Reason</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.holdings?.map((h: any, idx: number) => (
                      <tr key={idx} className="hover:bg-secondary/20 transition-all">
                        <td className="py-3.5 px-2 font-semibold text-foreground">{h.symbol}</td>
                        <td className="py-3.5 px-2 text-muted-foreground">{h.weight?.toFixed(2)}%</td>
                        <td className="py-3.5 px-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.isHalal ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                          }`}>
                            {h.isHalal ? "COMPLIANT" : "NON-COMPLIANT"}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-right text-xs text-muted-foreground">{h.reason}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Aggregate metrics right column */}
          <div className="space-y-6">
            <div className={`p-6 rounded-2xl border ${result.isHalal ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} space-y-4 shadow-sm`}>
              <div>
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Total Fund Score</span>
                <h3 className="text-3xl font-extrabold text-foreground mt-1">{result.compliancePercent}%</h3>
                <p className="text-xs text-muted-foreground mt-1">Weighted compliant holdings ratio</p>
              </div>

              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full font-bold text-xs ${
                  result.isHalal ? "bg-primary/25 text-primary" : "bg-destructive/25 text-destructive"
                }`}>
                  {result.isHalal ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      COMPLIANT ETF
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      NON-COMPLIANT
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Methodology Details */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-1.5 text-sm">
                <Info className="w-4 h-4 text-primary" />
                ETF Compliance Threshold
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">
                Exchange Traded Funds (ETFs) are considered Halal if the aggregate weighted compliant holdings represent 90% or higher of the fund's total assets, and all cash balances are purified of conventional banking interests.
              </p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

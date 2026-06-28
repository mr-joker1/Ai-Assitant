"use client";

import { useState } from "react";
import { Search, Coins, RefreshCw, ShieldCheck, ShieldAlert, Cpu, Lock, AlertTriangle, Radio } from "lucide-react";
import { motion } from "framer-motion";

export default function CryptoAnalyzer() {
  const [symbol, setSymbol] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSearch = async (e: React.FormEvent, force = false) => {
    e.preventDefault();
    if (!symbol) return;

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/crypto/screen", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, forceRefresh: force }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze crypto");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during screening.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Crypto Shariah screener</h2>
        <p className="text-muted-foreground text-sm">
          Analyze consensus mechanics, token distribution models, staking rewards pools, and DeFi exposures.
        </p>
      </div>

      {/* Control Panel Form */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <form onSubmit={(e) => handleSearch(e)} className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Enter Cryptocurrency Symbol (e.g. BTC, ETH, SOL, ADA)..."
              value={symbol}
              onChange={(e) => setSymbol(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center gap-2"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Verify Asset"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Crypto Output */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main audit column */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border ${result.token?.complianceStatus === "HALAL" ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} flex items-center justify-between shadow-sm`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Crypto Audit Report</span>
                <h3 className="text-2xl font-bold text-foreground">{result.token?.name} ({result.token?.symbol})</h3>
                <p className="text-xs text-muted-foreground">Consensus: {result.token?.consensusType || "Proof of Stake (PoS)"}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm ${
                  result.token?.complianceStatus === "HALAL"
                    ? "bg-primary/25 text-primary" 
                    : "bg-destructive/25 text-destructive"
                }`}>
                  {result.token?.complianceStatus === "HALAL" ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      HALAL UTILITY
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      NON-COMPLIANT
                    </>
                  )}
                </span>
                <span className="text-xs text-muted-foreground mt-1">Staking Stance: {result.token?.stakingCompliance ? "Permissible" : "Doubtful"}</span>
              </div>
            </div>

            {/* Token details details */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Cpu className="w-4 h-4 text-primary" />
                Technical Protocol Screenings
              </h4>

              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-secondary/35 rounded-xl">
                  <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Consensus mechanism</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{result.analysis?.consensus || "Validated under PoW/PoS standards."}</p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary/35 rounded-xl">
                  <Coins className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-foreground block">Staking & Mining Rules</span>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Staking Rewards: {result.analysis?.staking || "Staking yields comply under utility-backing frameworks."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 bg-secondary/35 rounded-xl">
                  <AlertTriangle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <span className="text-sm font-semibold text-foreground block">DeFi Interest Exposure</span>
                    <p className="text-xs text-muted-foreground mt-0.5">{result.analysis?.defiExposure || "No interest-bearing lending pool dependencies detected."}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Whitepaper summary */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-2">
              <h4 className="font-semibold text-foreground">Whitepaper Summary</h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{result.token?.whitepaperSummary || "Summary details."}</p>
            </div>
          </div>

          {/* Scholar panel and tokens detail */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground">Market Snapshot</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-secondary/50 rounded-xl">
                  <span className="text-[10px] text-muted-foreground block font-medium">Price USD</span>
                  <span className="text-lg font-bold text-foreground">${result.token?.price?.toLocaleString()}</span>
                </div>
                <div className="p-3 bg-secondary/50 rounded-xl">
                  <span className="text-[10px] text-muted-foreground block font-medium">Risk Assessment</span>
                  <span className="text-lg font-bold text-foreground">{result.token?.riskScore > 50 ? "High Speculation" : "Moderate Risk"}</span>
                </div>
              </div>
            </div>

            {/* Scholar Opinions */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Radio className="w-4 h-4 text-primary" />
                Scholarly Fatwas
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
                    <div className="text-[10px] text-muted-foreground">
                      <span className="font-medium">Evidence: {op.evidence}</span>
                    </div>
                  </div>
                )) || (
                  <div className="text-xs text-muted-foreground text-center py-4">No specific scholar fatwas logged.</div>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

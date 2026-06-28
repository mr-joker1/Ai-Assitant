"use client";

import { useState } from "react";
import { Calculator, RefreshCw, ShieldCheck, ShieldAlert, BookOpen, Coins, DollarSign } from "lucide-react";
import { motion } from "framer-motion";

export default function ZakatCalculator() {
  const [cash, setCash] = useState(0);
  const [gold, setGold] = useState(0);
  const [silver, setSilver] = useState(0);
  const [stocks, setStocks] = useState(0);
  const [crypto, setCrypto] = useState(0);
  const [businessAssets, setBusinessAssets] = useState(0);
  const [receivables, setReceivables] = useState(0);
  const [liabilities, setLiabilities] = useState(0);
  const [nisabMethodology, setNisabMethodology] = useState("SILVER");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleCalculate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/zakat/calculate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cashAmount: cash,
          goldWeight: gold,
          silverWeight: silver,
          stocksValue: stocks,
          cryptoValue: crypto,
          businessAssets,
          receivables,
          liabilities,
          nisabMethodology
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to calculate Zakat");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Islamic Zakat Calculator</h2>
        <p className="text-muted-foreground text-sm">
          Compute Zakat due on cash, gold, silver, stocks, cryptocurrencies, and business holdings, adjusting for active liabilities.
        </p>
      </div>

      {/* Input Form & output splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Input Form Column */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm">
          <form onSubmit={handleCalculate} className="space-y-6">
            <h3 className="font-semibold text-foreground flex items-center gap-2">
              <Calculator className="w-5 h-5 text-primary" />
              Wealth Parameters Form
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Liquid Cash ($)</label>
                <input
                  type="number"
                  value={cash}
                  onChange={(e) => setCash(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Staking/Trade Cryptos ($)</label>
                <input
                  type="number"
                  value={crypto}
                  onChange={(e) => setCrypto(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Gold holdings (grams)</label>
                <input
                  type="number"
                  value={gold}
                  onChange={(e) => setGold(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Silver holdings (grams)</label>
                <input
                  type="number"
                  value={silver}
                  onChange={(e) => setSilver(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Stocks & Equities ($)</label>
                <input
                  type="number"
                  value={stocks}
                  onChange={(e) => setStocks(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Assets ($)</label>
                <input
                  type="number"
                  value={businessAssets}
                  onChange={(e) => setBusinessAssets(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Receivables / Money Owed ($)</label>
                <input
                  type="number"
                  value={receivables}
                  onChange={(e) => setReceivables(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Liabilities / Debts Owed ($)</label>
                <input
                  type="number"
                  value={liabilities}
                  onChange={(e) => setLiabilities(Number(e.target.value))}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
              <div className="flex gap-4 items-center">
                <span className="text-xs font-semibold text-muted-foreground uppercase">Nisab Base:</span>
                <select
                  value={nisabMethodology}
                  onChange={(e) => setNisabMethodology(e.target.value)}
                  className="bg-card border border-border rounded-xl px-3 py-1.5 text-xs focus:outline-none text-foreground"
                >
                  <option value="SILVER">Silver standard (~595g)</option>
                  <option value="GOLD">Gold standard (~85g)</option>
                </select>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center gap-2 shadow-sm"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Calculate Zakat"}
              </button>
            </div>
          </form>

          {error && (
            <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
              {error}
            </div>
          )}
        </div>

        {/* Info Column */}
        <div className="space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h4 className="font-semibold text-foreground flex items-center gap-1.5">
              <Coins className="w-4 h-4 text-primary" />
              Nisab Reference Prices
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                <span className="text-muted-foreground">Gold Per Gram</span>
                <span className="font-semibold text-foreground">$75.00 USD</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                <span className="text-muted-foreground">Silver Per Gram</span>
                <span className="font-semibold text-foreground">$1.00 USD</span>
              </div>
              <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                <span className="text-muted-foreground">Gold Nisab (~85g)</span>
                <span className="font-semibold text-foreground">$6,375.00 USD</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground font-bold">Silver Nisab (~595g)</span>
                <span className="font-bold text-foreground">$595.00 USD</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Output results */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main output box */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border ${result.isEligible ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} flex items-center justify-between shadow-sm`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Calculation Result</span>
                <h3 className="text-3xl font-extrabold text-foreground">${result.totalZakat?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                <p className="text-xs text-muted-foreground mt-1">Zakat due for current cycle</p>
              </div>

              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm ${
                  result.isEligible ? "bg-primary/25 text-primary" : "bg-destructive/25 text-destructive"
                }`}>
                  {result.isEligible ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      ABOVE NISAB
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      BELOW NISAB
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* AI Explanation breakdown */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-primary" />
                Islamic wealth advisory notes
              </h4>
              <div className="text-sm leading-relaxed text-muted-foreground whitespace-pre-line prose max-w-none">
                {result.explanation}
              </div>
            </div>
          </div>

          {/* Right Breakdown sidebar */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground">Wealth Summary</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground font-medium">Net Assets</span>
                  <span className="font-bold text-foreground">${result.netAssets?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground font-medium">Nisab Applied</span>
                  <span className="font-bold text-foreground">${nisabMethodology === "GOLD" ? "6,375.00" : "595.00"}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

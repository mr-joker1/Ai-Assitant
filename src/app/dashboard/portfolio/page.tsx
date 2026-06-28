"use client";

import { useState } from "react";
import { 
  Plus, Trash2, ShieldCheck, ShieldAlert, 
  RefreshCw, PieChart, Info, CheckCircle2, AlertTriangle, Lightbulb
} from "lucide-react";
import { motion } from "framer-motion";

interface HoldingInput {
  symbol: string;
  quantity: number;
  avgPrice: number;
  assetType: "STOCK" | "CRYPTO" | "ETF";
}

export default function PortfolioChecker() {
  const [holdings, setHoldings] = useState<HoldingInput[]>([
    { symbol: "MSFT", quantity: 10, avgPrice: 420, assetType: "STOCK" },
    { symbol: "JPM", quantity: 5, avgPrice: 195, assetType: "STOCK" },
    { symbol: "ETH", quantity: 2, avgPrice: 3500, assetType: "CRYPTO" }
  ]);

  const [symbol, setSymbol] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [price, setPrice] = useState(10);
  const [assetType, setAssetType] = useState<"STOCK" | "CRYPTO" | "ETF">("STOCK");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const addHolding = (e: React.FormEvent) => {
    e.preventDefault();
    if (!symbol) return;
    setHoldings([...holdings, { symbol: symbol.toUpperCase(), quantity, avgPrice: price, assetType }]);
    setSymbol("");
    setQuantity(1);
    setPrice(10);
  };

  const removeHolding = (idx: number) => {
    setHoldings(holdings.filter((_, i) => i !== idx));
  };

  const handleAnalyze = async () => {
    if (holdings.length === 0) {
      setError("Please add at least one holding to analyze.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/portfolio/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ holdings }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze portfolio");
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
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Shariah Portfolio Auditor</h2>
        <p className="text-muted-foreground text-sm">
          Audits aggregated holdings portfolios, calculates purification targets, and checks asset weight compliance.
        </p>
      </div>

      {/* Input layout split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left holdings input */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h4 className="font-semibold text-foreground">Add Asset Holding</h4>

            <form onSubmit={addHolding} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Symbol</label>
                <input
                  type="text"
                  placeholder="e.g. AAPL, BTC"
                  value={symbol}
                  onChange={(e) => setSymbol(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Quantity</label>
                  <input
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Avg Price ($)</label>
                  <input
                    type="number"
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Asset Type</label>
                <select
                  value={assetType}
                  onChange={(e) => setAssetType(e.target.value as any)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                >
                  <option value="STOCK">Stock Equities</option>
                  <option value="CRYPTO">Cryptocurrency</option>
                  <option value="ETF">Exchange Traded Fund</option>
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-secondary hover:bg-muted text-foreground border border-border font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                Add Asset
              </button>
            </form>
          </div>
        </div>

        {/* Right holdings ledger */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="font-semibold text-foreground">Current Holdings Ledger</h4>
            
            {holdings.length === 0 ? (
              <p className="text-xs text-muted-foreground py-8 text-center">No holdings added yet. Use the add panel to build your portfolio.</p>
            ) : (
              <div className="divide-y divide-border max-h-60 overflow-y-auto pr-2">
                {holdings.map((h, idx) => (
                  <div key={idx} className="py-3 flex items-center justify-between text-sm">
                    <div>
                      <span className="font-semibold text-foreground">{h.symbol}</span>
                      <span className="text-xs text-muted-foreground ml-2">Qty: {h.quantity} | Type: {h.assetType}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="font-semibold text-foreground">${(h.quantity * h.avgPrice).toLocaleString()}</span>
                      <button onClick={() => removeHolding(idx)} className="p-1 rounded text-destructive hover:bg-destructive/10">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-border mt-4">
            <button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-all text-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Run Portfolio Analysis"}
            </button>
          </div>
        </div>
      </div>

      {/* Analysis Results Display */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main output breakdown */}
          <div className="lg:col-span-2 space-y-6">
            {/* Holdings ledger status checks */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" />
                Asset Auditing Checklist
              </h4>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-border text-xs text-muted-foreground uppercase font-bold">
                      <th className="py-2.5 px-2">Asset</th>
                      <th className="py-2.5 px-2">Value</th>
                      <th className="py-2.5 px-2">Status</th>
                      <th className="py-2.5 px-2 text-right">Purification Due</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {result.holdings?.map((h: any, idx: number) => (
                      <tr key={idx} className="hover:bg-secondary/25 transition-all">
                        <td className="py-3 px-2">
                          <span className="font-semibold text-foreground">{h.symbol}</span>
                          <span className="text-[10px] text-muted-foreground ml-1.5 uppercase font-medium">{h.assetType}</span>
                        </td>
                        <td className="py-3 px-2 text-muted-foreground">${h.totalValue?.toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
                        <td className="py-3 px-2">
                          <span className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            h.complianceStatus === "HALAL" ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive"
                          }`}>
                            {h.complianceStatus}
                          </span>
                        </td>
                        <td className="py-3 px-2 text-right text-destructive font-semibold">${h.purificationDue?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Smart suggestions */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                Alternative Shariah Recommendations
              </h4>
              <div className="space-y-2">
                {result.suggestions?.map((s: string, idx: number) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <span className="w-1.5 h-1.5 rounded-full bg-accent mt-1.5 flex-shrink-0" />
                    <p>{s}</p>
                  </div>
                )) || (
                  <p className="text-xs text-muted-foreground">Portfolio is 100% compliant. No restructuring needed!</p>
                )}
              </div>
            </div>
          </div>

          {/* Allocation column */}
          <div className="space-y-6">
            {/* Total cards */}
            <div className="p-6 rounded-2xl bg-card border border-border space-y-4 shadow-sm">
              <div>
                <span className="text-xs text-muted-foreground font-semibold uppercase">Portfolio Compliance</span>
                <h3 className={`text-3xl font-extrabold mt-1 ${result.compliancePercent > 90 ? "text-primary" : "text-destructive"}`}>
                  {result.compliancePercent?.toFixed(2)}%
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase">Portfolio Value</span>
                  <span className="text-base font-bold text-foreground block">${result.portfolio?.totalValue?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
                </div>
                <div>
                  <span className="text-[10px] text-muted-foreground font-medium uppercase font-semibold text-destructive block">Total Purifying Due</span>
                  <span className="text-base font-bold text-destructive block">${result.purificationDue?.toFixed(2)}</span>
                </div>
              </div>
            </div>

            {/* Allocation breakdown */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-1.5">
                <PieChart className="w-4 h-4 text-primary" />
                Sector Allocation
              </h4>
              <div className="space-y-3">
                {result.sectorAllocation?.map((sec: any, idx: number) => (
                  <div key={idx} className="space-y-1.5 text-xs">
                    <div className="flex justify-between items-center text-muted-foreground">
                      <span>{sec.name}</span>
                      <span className="font-bold text-foreground">{sec.value}%</span>
                    </div>
                    <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                      <div className="bg-primary h-full rounded-full" style={{ width: `${sec.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

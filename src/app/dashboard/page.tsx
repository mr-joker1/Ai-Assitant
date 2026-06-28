"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, ArrowRight, ShieldCheck, 
  BookOpen, HelpCircle, Activity, Globe, Compass
} from "lucide-react";
import { motion } from "framer-motion";

interface MarketTick {
  symbol: string;
  name: string;
  price: number;
  change: number;
  isHalal: boolean;
}

export default function DashboardOverview() {
  const [marketTicks, setMarketTicks] = useState<MarketTick[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulated live feed of major stocks & cryptos
    setTimeout(() => {
      setMarketTicks([
        { symbol: "MSFT", name: "Microsoft Corp.", price: 420.55, change: 1.25, isHalal: true },
        { symbol: "AAPL", name: "Apple Inc.", price: 210.45, change: -0.45, isHalal: true },
        { symbol: "NVDA", name: "NVIDIA Corp.", price: 125.80, change: 3.40, isHalal: true },
        { symbol: "JPM", name: "JPMorgan Chase", price: 195.20, change: 0.15, isHalal: false },
        { symbol: "BTC", name: "Bitcoin", price: 68420.00, change: 2.10, isHalal: true },
        { symbol: "ETH", name: "Ethereum", price: 3540.25, change: 1.15, isHalal: true },
        { symbol: "USDT", name: "Tether", price: 1.00, change: 0.00, isHalal: false },
      ]);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-8">
      {/* Top Banner Hero Widget */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-8 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-premium"
      >
        <div className="space-y-3 flex-1">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            AAOIFI Standards Audited
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Ethical Shariah-Compliant Investment Intelligence
          </h2>
          <p className="text-muted-foreground text-sm max-w-2xl">
            Empowering modern Muslim investors with advanced financial data analytics, vector-based RAG search on fatwas, AI explainers, and local business screening.
          </p>
        </div>
        <div className="flex gap-3 w-full md:w-auto">
          <Link href="/dashboard/search" className="flex items-center justify-center gap-2 bg-primary text-primary-foreground font-semibold px-5 py-3 rounded-xl hover:opacity-90 transition-all text-sm w-full md:w-auto shadow-sm">
            AI Search
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/ai-chat" className="flex items-center justify-center gap-2 bg-secondary text-foreground border border-border font-semibold px-5 py-3 rounded-xl hover:bg-muted transition-all text-sm w-full md:w-auto">
            Ask Advisor
          </Link>
        </div>
      </motion.div>

      {/* Main Stats Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-40">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">My Portfolio Compliance</p>
            <h3 className="text-3xl font-bold mt-2 text-foreground">94.2%</h3>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>$48,450 Zakatatable Value</span>
            <Link href="/dashboard/portfolio" className="text-primary hover:underline font-medium flex items-center gap-1">
              Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-40">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Pending Purification</p>
            <h3 className="text-3xl font-bold mt-2 text-destructive">$125.40</h3>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>Interest & Impure Dividends</span>
            <Link href="/dashboard/purification" className="text-primary hover:underline font-medium flex items-center gap-1">
              Purify Now <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex flex-col justify-between h-40">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Learning Level</p>
            <h3 className="text-3xl font-bold mt-2 text-accent">Lvl 3 <span className="text-sm font-normal text-muted-foreground">(450 XP)</span></h3>
          </div>
          <div className="flex justify-between items-center text-xs text-muted-foreground">
            <span>1 Certificate Earned</span>
            <Link href="/dashboard/learning" className="text-primary hover:underline font-medium flex items-center gap-1">
              Study Fiqh <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* Market Watch Widget */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Market Watch Overview
            </h3>
            <span className="text-xs text-muted-foreground">Prices updated hourly</span>
          </div>

          <div className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">
            {loading ? (
              <div className="p-8 text-center text-muted-foreground">Loading markets...</div>
            ) : (
              <div className="divide-y divide-border">
                {marketTicks.map((tick) => (
                  <div key={tick.symbol} className="p-4 flex items-center justify-between hover:bg-secondary/40 transition-all">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                        {tick.symbol[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="font-semibold text-foreground text-sm">{tick.symbol}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                            tick.isHalal 
                              ? "bg-primary/10 text-primary" 
                              : "bg-destructive/10 text-destructive"
                          }`}>
                            {tick.isHalal ? "HALAL" : "HARAM"}
                          </span>
                        </div>
                        <span className="text-xs text-muted-foreground">{tick.name}</span>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className="font-semibold text-foreground text-sm">${tick.price.toLocaleString(undefined, { minimumFractionDigits: 2 })}</div>
                      <div className={`text-xs font-semibold ${tick.change >= 0 ? "text-primary" : "text-destructive"}`}>
                        {tick.change >= 0 ? "+" : ""}{tick.change}%
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Shariah Standards Summary */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
            <Compass className="w-5 h-5 text-primary" />
            Methodologies
          </h3>
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="space-y-2 pb-3 border-b border-border">
              <span className="font-semibold text-sm text-foreground block">AAOIFI Guidelines</span>
              <p className="text-xs text-muted-foreground">Debt & Interest-bearing liquidity limits capped at 30% of Market Capitalization. Impure revenue tolerance under 5%.</p>
            </div>
            <div className="space-y-2 pb-3 border-b border-border">
              <span className="font-semibold text-sm text-foreground block">Dow Jones Islamic Market</span>
              <p className="text-xs text-muted-foreground">Accounts Receivables, Cash, and Debt individually capped at 33% of Market Capitalization averages.</p>
            </div>
            <div className="space-y-2">
              <span className="font-semibold text-sm text-foreground block">S&P Shariah Standards</span>
              <p className="text-xs text-muted-foreground">Aggregated liquid asset leverage metrics mapped dynamically against equity values over trailing 36-month windows.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

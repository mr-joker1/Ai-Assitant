"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { 
  TrendingUp, TrendingDown, ArrowRight, ShieldCheck, 
  BookOpen, HelpCircle, Activity, Globe, Compass, Cpu, 
  Coins, Scale, Award, Calendar, MessageSquare, AlertCircle, 
  CheckCircle, Plus, Search, HelpCircle as HelpIcon, Sparkles, Clock, Star
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
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [zakatWealth, setZakatWealth] = useState(148250.20);
  const [chatMessage, setChatMessage] = useState("");
  const [chatLog, setChatLog] = useState<Array<{ sender: "user" | "ai", text: string }>>([
    { sender: "ai", text: "Assalamu Alaikum! I am your Shariah compliance advisor. Ask me anything about stock purification, Zakat rules, or specific asset consensus." }
  ]);

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

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userText = chatMessage;
    setChatLog(prev => [...prev, { sender: "user", text: userText }]);
    setChatMessage("");

    setTimeout(() => {
      let reply = "I am parsing our Shariah rule engine guidelines. Apple (AAPL) currently requires a 2.1% dividend purification rate. Let me know if you would like me to process this calculation.";
      if (userText.toLowerCase().includes("zakat")) {
        reply = "Zakat is calculated at 2.5% on Zakat-eligible assets that meet the Nisab threshold. Your current eligible asset value is $148,250.20, resulting in a Zakat liability of $3,706.25.";
      } else if (userText.toLowerCase().includes("bitcoin")) {
        reply = "Bitcoin (BTC) is classified as Shariah-compliant by modern consensus, representing digital peer-to-peer utility without interest mechanics.";
      }
      setChatLog(prev => [...prev, { sender: "ai", text: reply }]);
    }, 800);
  };

  // Sparklines points helper
  const getSparkline = (change: number) => {
    return change >= 0 
      ? "M 0,20 Q 15,5 30,15 T 60,5 T 90,10" 
      : "M 0,5 Q 15,20 30,10 T 60,25 T 90,20";
  };

  return (
    <div className="space-y-8 pb-12">
      
      {/* Top Banner Workspace Hero */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="glass-panel p-8 rounded-2xl flex flex-col lg:flex-row items-center justify-between gap-6 shadow-premium relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full radial-light opacity-30 pointer-events-none filter blur-3xl" />
        
        <div className="space-y-3 flex-1 relative z-10">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5" />
            AAOIFI Standards Audited
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight font-jakarta">
            Financial Intelligence Workspace
          </h2>
          <p className="text-muted-foreground text-xs md:text-sm max-w-2xl font-light">
            Deploying multi-layered juristic screening algorithms, automated dividend purification ledgers, and direct scholar consensus board audits.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 w-full lg:w-auto relative z-10">
          <Link href="/dashboard/search" className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-primary hover:opacity-90 text-primary-foreground font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl transition-all scale-100 hover:scale-[1.02] shadow-md shadow-primary/20">
            AI Search
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/dashboard/ai-chat" className="flex-1 lg:flex-none flex items-center justify-center gap-2 bg-card border border-border text-foreground font-bold text-xs uppercase tracking-widest px-6 py-3.5 rounded-xl hover:bg-secondary transition-all">
            Ask Advisor
          </Link>
        </div>
      </motion.div>

      {/* ZONE 1: Portfolio Command Center */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Large Summary Area Chart Card (8-columns) */}
        <div className="lg:col-span-8 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-premium relative overflow-hidden group">
          <div className="flex justify-between items-center mb-6">
            <div>
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Consolidated Wealth Growth</span>
              <h3 className="text-2xl font-extrabold font-jakarta mt-1 text-foreground">$148,250.20</h3>
              <p className="text-xs text-primary font-semibold mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> +12.4% vs Benchmark YTD
              </p>
            </div>
            
            <div className="flex items-center gap-4 text-xs font-semibold">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                <span className="text-muted-foreground">Compliant Yield</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30" />
                <span className="text-muted-foreground">S&P Shariah Index</span>
              </div>
            </div>
          </div>

          {/* SVG Area Chart */}
          <div className="w-full h-48 mt-4 relative">
            <svg viewBox="0 0 600 180" className="w-full h-full">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="10" y1="35" x2="590" y2="35" stroke="var(--border)" strokeOpacity="0.3" />
              <line x1="10" y1="90" x2="590" y2="90" stroke="var(--border)" strokeOpacity="0.3" />
              <line x1="10" y1="145" x2="590" y2="145" stroke="var(--border)" strokeOpacity="0.3" />

              {/* S&P Path */}
              <path 
                d="M 10,150 L 100,135 L 200,140 L 300,110 L 400,105 L 500,90 L 590,80" 
                fill="none" 
                stroke="var(--border)" 
                strokeWidth="1.5" 
                strokeDasharray="4 4"
              />
              
              {/* Compliant Path */}
              <path 
                d="M 10,150 Q 100,110 200,125 T 300,75 T 400,60 T 500,40 T 590,25" 
                fill="none" 
                stroke="var(--primary)" 
                strokeWidth="3" 
                strokeLinecap="round"
              />

              {/* Shade */}
              <path 
                d="M 10,150 Q 100,110 200,125 T 300,75 T 400,60 T 500,40 T 590,25 L 590,180 L 10,180 Z" 
                fill="url(#chartGrad)" 
              />
            </svg>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-4 border-t border-border">
            <div>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Today's Gain</span>
              <p className="text-sm font-bold text-primary mt-0.5">+$1,450.80 (+0.98%)</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Monthly Change</span>
              <p className="text-sm font-bold text-primary mt-0.5">+$6,820.00 (+4.82%)</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Risk Profile</span>
              <p className="text-sm font-bold text-foreground mt-0.5 uppercase">Low (Consensus)</p>
            </div>
            <div>
              <span className="text-[9px] text-muted-foreground uppercase font-bold tracking-wider">Overall compliance</span>
              <p className="text-sm font-bold text-primary mt-0.5">98.2% (Vetted)</p>
            </div>
          </div>
        </div>

        {/* Portfolio Donut Ring / Asset allocation (4-columns) */}
        <div className="lg:col-span-4 bg-card border border-border rounded-2xl p-6 flex flex-col justify-between shadow-premium">
          <div>
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Asset Allocations</span>
            <h3 className="text-lg font-bold font-jakarta text-foreground mt-1">Diversification Ring</h3>
          </div>

          {/* SVG Circular Donut Chart */}
          <div className="relative w-36 h-36 mx-auto my-6 flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
              {/* Equities (50%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--primary)" strokeWidth="12" strokeDasharray="125.6 251.2" strokeDashoffset="0" />
              {/* Crypto (25%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--accent)" strokeWidth="12" strokeDasharray="62.8 251.2" strokeDashoffset="-125.6" />
              {/* Cash (15%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--border)" strokeWidth="12" strokeDasharray="37.6 251.2" strokeDashoffset="-188.4" />
              {/* Gold/Alts (10%) */}
              <circle cx="50" cy="50" r="40" fill="transparent" stroke="var(--muted-foreground)" strokeWidth="12" strokeDasharray="25.2 251.2" strokeDashoffset="-226" />
            </svg>
            <div className="absolute flex flex-col items-center justify-center">
              <span className="text-xs text-muted-foreground uppercase font-semibold">Equities</span>
              <span className="text-lg font-bold text-foreground font-grotesk mt-0.5">50%</span>
            </div>
          </div>

          {/* Allocation Legend */}
          <div className="space-y-2 text-xs">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-primary" />
                <span className="text-muted-foreground">Equities (Passed)</span>
              </div>
              <span className="font-bold text-foreground font-mono">$74,125</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-accent" />
                <span className="text-muted-foreground">Crypto Assets</span>
              </div>
              <span className="font-bold text-foreground font-mono">$37,062</span>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded bg-border" />
                <span className="text-muted-foreground">Liquid Cash</span>
              </div>
              <span className="font-bold text-foreground font-mono">$22,237</span>
            </div>
          </div>
        </div>

      </div>

      {/* ZONE 2: Shariah Compliance Operations & Zakat Ledger */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Zakat Widget */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-48 shadow-premium relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Islamic Wealth Tax</span>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground font-jakarta">Zakat Due</h3>
              <Coins className="w-5 h-5 text-primary" />
            </div>
            <p className="text-3xl font-extrabold text-foreground font-grotesk mt-2">
              ${(zakatWealth * 0.025).toLocaleString(undefined, {maximumFractionDigits:2})}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center text-[10px] text-muted-foreground">
              <span>Wealth Threshold (Nisab)</span>
              <span className="font-semibold text-[#0CCB8E]">Exceeded (Passed)</span>
            </div>
            <div className="h-1.5 w-full bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary" style={{ width: "82%" }} />
            </div>
          </div>
        </div>

        {/* Purification Ledger Widget */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-48 shadow-premium relative group overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/5 rounded-full filter blur-xl pointer-events-none" />
          
          <div className="space-y-1">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Dividend Cleansing</span>
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-foreground font-jakarta">Purification Ledger</h3>
              <Scale className="w-5 h-5 text-red-400" />
            </div>
            <p className="text-3xl font-extrabold text-red-500 font-grotesk mt-2">$680.70</p>
          </div>

          <div className="flex justify-between items-center text-xs pt-2 border-t border-border">
            <span className="text-muted-foreground text-[10px]">AAPL 2.1% & TSLA 4.5% Impure ratio</span>
            <Link href="/dashboard/purification" className="text-primary hover:opacity-85 font-bold text-[10px] uppercase tracking-wider flex items-center gap-1">
              Cleanse Ledger <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* Scholar Board audits */}
        <div className="bg-card border border-border p-6 rounded-2xl flex flex-col justify-between h-48 shadow-premium">
          <div className="space-y-2">
            <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Consensus Certification</span>
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-foreground font-jakarta">Scholarly Audit</h3>
              <Award className="w-5 h-5 text-primary" />
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed font-light">
              Algorithm filters validated and certified under standard Dow Jones Islamic Market & S&P methodologies.
            </p>
          </div>

          <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border font-mono">
            <span>Signed: Dr. Tariq Al-Mansoor</span>
            <span className="text-primary font-semibold">Active Consensus</span>
          </div>
        </div>

      </div>

      {/* ZONE 3: Market Ticks Feed & Watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Live Ticker Feed (8-columns) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary" /> Live Shariah Market Feed
            </h3>
            <span className="text-[10px] text-muted-foreground">Updated in Real-Time</span>
          </div>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-premium divide-y divide-border">
            {loading ? (
              <div className="p-12 text-center text-xs text-muted-foreground">Loading market feeds...</div>
            ) : (
              marketTicks.map((tick) => (
                <div key={tick.symbol} className="p-4 flex items-center justify-between hover:bg-secondary/40 transition-all duration-150">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-secondary border border-border flex items-center justify-center font-extrabold text-xs text-foreground">
                      {tick.symbol[0]}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground text-xs">{tick.symbol}</span>
                        <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full ${tick.isHalal ? "bg-primary/10 text-primary" : "bg-red-500/10 text-red-400"}`}>
                          {tick.isHalal ? "HALAL" : "HARAM"}
                        </span>
                      </div>
                      <span className="text-[10px] text-muted-foreground">{tick.name}</span>
                    </div>
                  </div>

                  {/* Sparkline chart SVG */}
                  <div className="hidden sm:block w-24 h-8">
                    <svg viewBox="0 0 100 30" className="w-full h-full">
                      <path 
                        d={getSparkline(tick.change)} 
                        fill="none" 
                        stroke={tick.change >= 0 ? "var(--primary)" : "var(--destructive)"} 
                        strokeWidth="1.5" 
                      />
                    </svg>
                  </div>

                  <div className="text-right">
                    <span className="text-xs font-bold text-foreground font-mono">${tick.price.toLocaleString(undefined, {minimumFractionDigits: 2})}</span>
                    <div className={`text-[10px] font-bold mt-0.5 flex items-center justify-end gap-0.5 ${tick.change >= 0 ? "text-primary" : "text-destructive"}`}>
                      {tick.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                      <span>{tick.change >= 0 ? "+" : ""}{tick.change}%</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Watchlist Cards (4-columns) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
              <Star className="w-4 h-4 text-primary" /> AI Watchlist
            </h3>
            <span className="text-[10px] text-muted-foreground">Alerts Active</span>
          </div>

          <div className="space-y-4">
            <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground">BTC (Bitcoin)</span>
                <p className="text-xs text-muted-foreground">Consensus verified halal asset.</p>
              </div>
              <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded">Passed</span>
            </div>

            <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground">USDT (Tether)</span>
                <p className="text-xs text-muted-foreground">DeFi interest bearing mechanisms.</p>
              </div>
              <span className="text-xs font-bold text-red-400 bg-red-500/10 px-2 py-1 rounded">Non-Compliant</span>
            </div>

            <div className="bg-card border border-border p-4 rounded-2xl flex items-center justify-between shadow-sm">
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-foreground">TSLA (Tesla)</span>
                <p className="text-xs text-muted-foreground">Purification threshold: 4.5% due.</p>
              </div>
              <span className="text-xs font-bold text-amber-400 bg-amber-500/10 px-2 py-1 rounded">Purification</span>
            </div>
          </div>
        </div>

      </div>

      {/* ZONE 4: Sector Heatmap / Treemap */}
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4 text-primary" /> Shariah Sector Heatmap
          </h3>
          <span className="text-[10px] text-muted-foreground">Click sectors to inspect ratio averages</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          
          <div 
            onClick={() => setSelectedSector("technology")}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between ${selectedSector === "technology" ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/40"}`}
          >
            <span className="text-xs font-bold text-foreground">Technology</span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-primary font-semibold">98% Halal</span>
              <span className="text-[9px] font-mono text-muted-foreground">AAPL, MSFT</span>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSector("energy")}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between ${selectedSector === "energy" ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/40"}`}
          >
            <span className="text-xs font-bold text-foreground">Energy</span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-primary font-semibold">92% Halal</span>
              <span className="text-[9px] font-mono text-muted-foreground">XOM, CVX</span>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSector("finance")}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between ${selectedSector === "finance" ? "bg-red-500/5 border-red-500/30" : "bg-card border-border hover:border-red-500/30"}`}
          >
            <span className="text-xs font-bold text-foreground">Finance</span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-red-400">12% Halal</span>
              <span className="text-[9px] font-mono text-muted-foreground">JPM, BAC</span>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSector("healthcare")}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between ${selectedSector === "healthcare" ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/40"}`}
          >
            <span className="text-xs font-bold text-foreground">Healthcare</span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-primary font-semibold">88% Halal</span>
              <span className="text-[9px] font-mono text-muted-foreground">PFE, JNJ</span>
            </div>
          </div>

          <div 
            onClick={() => setSelectedSector("consumer")}
            className={`p-4 rounded-xl border transition-all duration-200 cursor-pointer h-24 flex flex-col justify-between ${selectedSector === "consumer" ? "bg-primary/10 border-primary" : "bg-card border-border hover:border-primary/40"}`}
          >
            <span className="text-xs font-bold text-foreground">Consumer</span>
            <div className="flex justify-between items-end">
              <span className="text-[10px] text-primary font-semibold">94% Halal</span>
              <span className="text-[9px] font-mono text-muted-foreground">AMZN, TSLA</span>
            </div>
          </div>

        </div>
      </div>

      {/* ZONE 5: Opportunities & AI Insight Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Halal Opportunities */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-primary" /> Hot Halal Opportunities
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between h-44 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">NVIDIA Corp (NVDA)</span>
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Passed</span>
              </div>
              <div className="py-2">
                <span className="text-[10px] text-muted-foreground">Expected Return</span>
                <p className="text-lg font-bold text-foreground mt-0.5">+18.5% Y/Y</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border">
                <span>AI Score: 96/100</span>
                <span className="text-primary font-semibold">Low Leverage</span>
              </div>
            </div>

            <div className="bg-card border border-border p-5 rounded-2xl flex flex-col justify-between h-44 hover:border-primary/30 transition-all">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-foreground">Apple Inc (AAPL)</span>
                <span className="text-[9px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded">Passed</span>
              </div>
              <div className="py-2">
                <span className="text-[10px] text-muted-foreground">Expected Return</span>
                <p className="text-lg font-bold text-foreground mt-0.5">+14.2% Y/Y</p>
              </div>
              <div className="flex justify-between items-center text-[10px] text-muted-foreground pt-2 border-t border-border">
                <span>AI Score: 94/100</span>
                <span className="text-primary font-semibold">Purify 2.1%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI Insight Timeline */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Cpu className="w-4 h-4 text-primary" /> Recent Compliance Logs
          </h3>

          <div className="bg-card border border-border rounded-2xl p-5 space-y-4 shadow-sm">
            <div className="flex gap-4 items-start relative pb-4 border-b border-border">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-primary flex-shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground">Apple Inc. consensus passed</span>
                <p className="text-[11px] text-muted-foreground">Debt ratios verified at 12.4%, well below the 33% AAOIFI threshold limits.</p>
                <span className="text-[9px] font-mono text-muted-foreground block">12 mins ago &bull; AI Scanner</span>
              </div>
            </div>

            <div className="flex gap-4 items-start relative">
              <div className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center text-amber-500 flex-shrink-0">
                <AlertCircle className="w-4 h-4" />
              </div>
              <div className="space-y-1">
                <span className="text-xs font-bold text-foreground">Tesla Inc. purification shift</span>
                <p className="text-[11px] text-muted-foreground">Purification rate adjusted to 4.5% due to minor changes in cash account interests.</p>
                <span className="text-[9px] font-mono text-muted-foreground block">2 hours ago &bull; Scholar Hub</span>
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* ZONE 6: Calendar & AI Chat Preview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Economic Calendar */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" /> Financial & Shariah Calendar
          </h3>

          <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-sm divide-y divide-border">
            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase font-bold">Jul</span>
                  <span className="text-base font-extrabold font-grotesk mt-0.5">15</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Microsoft (MSFT) Earnings call</h4>
                  <p className="text-[10px] text-muted-foreground">AI review of debt ratios will execute instantly post-earnings filings.</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">Equities</span>
            </div>

            <div className="p-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary w-12 h-12 rounded-xl flex flex-col items-center justify-center flex-shrink-0">
                  <span className="text-[9px] uppercase font-bold">Jul</span>
                  <span className="text-base font-extrabold font-grotesk mt-0.5">24</span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-foreground">Quarterly Zakat Adjustment</h4>
                  <p className="text-[10px] text-muted-foreground">Auto-valuation of gold reserves and corporate holdings will run.</p>
                </div>
              </div>
              <span className="text-[10px] text-muted-foreground">Portfolio</span>
            </div>
          </div>
        </div>

        {/* AI Chat widget */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-primary" /> IslamInvest AI Advisor Chat
          </h3>

          <div className="bg-card border border-border rounded-2xl p-4 flex flex-col justify-between h-64 shadow-premium">
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[140px]">
              {chatLog.map((chat, idx) => (
                <div key={idx} className={`flex ${chat.sender === "user" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[85%] rounded-xl p-2.5 text-xs ${chat.sender === "user" ? "bg-primary text-primary-foreground font-semibold" : "bg-secondary text-foreground font-light leading-relaxed"}`}>
                    {chat.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Form */}
            <form onSubmit={handleSendChat} className="flex gap-2 pt-3 border-t border-border mt-2">
              <input 
                type="text" 
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask about Zakat, BTC or Apple purification..."
                className="flex-grow bg-secondary/60 border border-border rounded-xl px-3 py-2 text-xs text-foreground focus:outline-none focus:border-[#0CCB8E]/40"
              />
              <button 
                type="submit"
                className="bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] font-bold px-3 py-2 rounded-xl text-xs uppercase transition-colors"
              >
                Send
              </button>
            </form>
          </div>
        </div>

      </div>

    </div>
  );
}

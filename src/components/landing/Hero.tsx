"use client";

import Link from "next/link";
import { ArrowRight, ShieldCheck, Cpu, Check, Activity, Search, Sparkles } from "lucide-react";
import { useState, useEffect } from "react";

export default function Hero() {
  const [activeTab, setActiveTab] = useState<"apple" | "tesla" | "bitcoin">("apple");
  const [complianceScore, setComplianceScore] = useState(94);

  useEffect(() => {
    if (activeTab === "apple") setComplianceScore(94);
    else if (activeTab === "tesla") setComplianceScore(88);
    else setComplianceScore(100); // Bitcoin
  }, [activeTab]);

  return (
    <section className="relative min-h-[90vh] flex flex-col justify-center items-center pt-24 pb-16 px-6 overflow-hidden bg-[#050505]">
      {/* Background Decorative Gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full radial-light opacity-60 pointer-events-none filter blur-[80px] animate-pulse-glow" />
      <div className="absolute top-1/3 right-10 w-[300px] h-[300px] rounded-full radial-light-accent opacity-30 pointer-events-none filter blur-[60px]" />

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-16 items-center relative z-10">
        
        {/* Left Side: Headline & Text */}
        <div className="lg:col-span-7 space-y-8 text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#0B0F0D] text-[#0CCB8E] text-xs font-semibold tracking-wide hover:border-[#0CCB8E]/30 transition-colors cursor-pointer">
            <Sparkles className="w-3.5 h-3.5 text-[#14F195] animate-pulse" />
            <span className="font-jakarta">Next-Gen Shariah-Compliant Investment Intelligence</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] font-jakarta">
            The Future of <br />
            <span className="gradient-text-green font-grotesk font-black uppercase tracking-wide">Ethical Wealth</span> <br />
            Powered by AI
          </h1>

          <p className="text-[#A4A4A4] text-lg md:text-xl max-w-xl leading-relaxed font-sans font-light">
            Deploy advanced juristic screening algorithms, automate zakat ledgers, and purification audits on global equities, cryptos, and startups.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
            <Link
              href="/register"
              className="group bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 scale-100 hover:scale-[1.03] shadow-lg shadow-[#0CCB8E]/20"
            >
              Launch Dashboard 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
            <Link
              href="/login"
              className="border border-white/10 bg-white/5 hover:bg-white/10 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center transition-all duration-300 scale-100 hover:scale-[1.03] backdrop-blur-md"
            >
              Explore Platform
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="pt-8 border-t border-white/5 grid grid-cols-2 sm:grid-cols-4 gap-6">
            <div>
              <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">Audited By</div>
              <div className="text-sm font-bold text-white mt-1 font-jakarta">Global Shariah Board</div>
            </div>
            <div>
              <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">Security</div>
              <div className="text-sm font-bold text-[#0CCB8E] mt-1 font-jakarta">Institutional-Grade</div>
            </div>
            <div>
              <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">Database</div>
              <div className="text-sm font-bold text-white mt-1 font-jakarta">10k+ Screener Assets</div>
            </div>
            <div>
              <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">Compliance</div>
              <div className="text-sm font-bold text-white mt-1 font-jakarta">AAOIFI Compliant</div>
            </div>
          </div>
        </div>

        {/* Right Side: Recreated Premium Dashboard Mockup */}
        <div className="lg:col-span-5 relative">
          <div className="absolute inset-0 bg-[#0CCB8E]/10 rounded-[24px] filter blur-3xl opacity-20 pointer-events-none" />
          
          <div className="relative glass-panel rounded-[24px] p-6 border border-white/10 shadow-2xl flex flex-col gap-6 w-full max-w-md mx-auto">
            {/* Header of Mockup */}
            <div className="flex justify-between items-center pb-4 border-b border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0CCB8E] animate-ping" />
                <span className="text-xs text-[#A4A4A4] font-medium font-jakarta">Live Portfolio Auditing</span>
              </div>
              <div className="flex gap-1.5">
                <button 
                  onClick={() => setActiveTab("apple")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === "apple" ? "bg-[#0CCB8E] text-[#050505]" : "text-[#A4A4A4] hover:text-white bg-white/5"}`}
                >
                  AAPL
                </button>
                <button 
                  onClick={() => setActiveTab("tesla")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === "tesla" ? "bg-[#0CCB8E] text-[#050505]" : "text-[#A4A4A4] hover:text-white bg-white/5"}`}
                >
                  TSLA
                </button>
                <button 
                  onClick={() => setActiveTab("bitcoin")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${activeTab === "bitcoin" ? "bg-[#0CCB8E] text-[#050505]" : "text-[#A4A4A4] hover:text-white bg-white/5"}`}
                >
                  BTC
                </button>
              </div>
            </div>

            {/* Asset Performance card */}
            <div className="bg-[#111111] p-4 rounded-xl border border-white/5 flex justify-between items-center">
              <div>
                <span className="text-xs text-[#A4A4A4]">Asset Type</span>
                <p className="text-sm font-bold mt-0.5 capitalize">{activeTab === "bitcoin" ? "Crypto Asset" : "Equity Shares"}</p>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#A4A4A4]">Juristic Decision</span>
                <div className="flex items-center gap-1 mt-0.5 text-[#0CCB8E]">
                  <ShieldCheck className="w-4 h-4" />
                  <span className="text-sm font-semibold">Halal</span>
                </div>
              </div>
            </div>

            {/* Screening Details */}
            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A4A4A4]">Compliance Threshold</span>
                <span className="font-semibold text-white">98% Strict Consensus</span>
              </div>
              
              {/* Compliance score widget */}
              <div className="relative h-2.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div 
                  className="absolute top-0 left-0 h-full bg-[#0CCB8E] rounded-full transition-all duration-700 ease-out" 
                  style={{ width: `${complianceScore}%` }}
                />
              </div>

              <div className="flex justify-between items-center text-xs text-[#A4A4A4]">
                <span>Financial Debt Ratio</span>
                <span className="text-white font-semibold">{activeTab === "apple" ? "12.4% (Passed)" : activeTab === "tesla" ? "21.8% (Passed)" : "0% (Passed)"}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-[#A4A4A4]">
                <span>Impermissible Revenue</span>
                <span className="text-white font-semibold">{activeTab === "apple" ? "2.1% (Purification Required)" : activeTab === "tesla" ? "4.5% (Purification Required)" : "0% (Passed)"}</span>
              </div>
            </div>

            {/* AI Advisor Chat snippet */}
            <div className="bg-[#0B0F0D] border border-[#0CCB8E]/10 rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-2 text-[10px] text-[#0CCB8E] font-semibold tracking-wider uppercase">
                <Cpu className="w-3.5 h-3.5 text-[#14F195]" />
                <span>IslamInvest AI Advisor</span>
              </div>
              <p className="text-xs text-white/95 leading-relaxed font-sans">
                {activeTab === "apple" 
                  ? "Apple Inc. passes AAOIFI requirements. 2.1% of dividend payout must be purified (given to charity) due to interest-bearing deposits."
                  : activeTab === "tesla"
                  ? "Tesla is Shariah-compliant. High asset valuation ratios fall within standard thresholds. Dividend purification rate is 4.5%."
                  : "Bitcoin is verified Shariah-compliant by modern consensus, representing decentralized peer-to-peer digital utility."}
              </p>
            </div>

            {/* Live Analytics Widget */}
            <div className="flex justify-between items-center pt-2 text-xs">
              <div className="flex items-center gap-1 text-[#A4A4A4]">
                <Activity className="w-3.5 h-3.5 text-[#14F195]" />
                <span>Compliance Verified</span>
              </div>
              <span className="text-[10px] font-mono text-white/40">ID: SCR-8921-IQ</span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

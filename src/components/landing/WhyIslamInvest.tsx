"use client";

import { Cpu, Scale, BarChart2 } from "lucide-react";

export default function WhyIslamInvest() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Foundational Pillars
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-jakarta leading-tight">
            Designed for Ethical Scale
          </h2>
          <p className="text-[#A4A4A4] text-lg max-w-xl font-light">
            We merge sophisticated machine intelligence with centuries of Islamic financial jurisprudence.
          </p>
        </div>

        {/* Three Columns */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: AI Intelligence */}
          <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group relative overflow-hidden h-[450px]">
            {/* Abstract Graphic Illustration (Pure CSS) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0CCB8E]/5 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="relative w-full h-40 bg-[#050505] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
              {/* CSS Abstract Graphic */}
              <div className="absolute w-24 h-24 border border-[#0CCB8E]/20 rounded-full animate-pulse flex items-center justify-center">
                <div className="w-16 h-16 border border-[#14F195]/40 rounded-full flex items-center justify-center">
                  <div className="w-8 h-8 bg-[#0CCB8E] rounded-full flex items-center justify-center">
                    <Cpu className="w-4 h-4 text-black" />
                  </div>
                </div>
              </div>
              <div className="absolute top-4 left-6 text-[8px] font-mono text-[#A4A4A4]/40">AGENTIC SCANNERS ACTIVE</div>
              <div className="absolute bottom-4 right-6 text-[8px] font-mono text-[#0CCB8E]/55">MODEL: IQ-RAG-V4</div>
            </div>

            <div className="space-y-3 mt-6">
              <h3 className="text-xl font-bold font-jakarta text-white group-hover:text-[#0CCB8E] transition-colors">
                AI Financial Intelligence
              </h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Our proprietary Large Language Model scrapes filings, notes, and transcripts in real-time, executing multi-step queries to cross-verify corporate cash reservoirs.
              </p>
            </div>
          </div>

          {/* Column 2: Shariah Compliance */}
          <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group relative overflow-hidden h-[450px]">
            {/* Abstract Graphic Illustration (Pure CSS) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#14F195]/5 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="relative w-full h-40 bg-[#050505] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
              {/* CSS Abstract Graphic */}
              <div className="relative w-32 h-20 flex justify-between items-end px-4 gap-2">
                <div className="w-6 bg-[#0CCB8E]/20 h-10 border border-[#0CCB8E]/30 rounded-t" />
                <div className="w-6 bg-[#0CCB8E]/40 h-16 border border-[#0CCB8E]/50 rounded-t flex items-center justify-center">
                  <Scale className="w-3.5 h-3.5 text-[#14F195]" />
                </div>
                <div className="w-6 bg-[#0CCB8E]/20 h-8 border border-[#0CCB8E]/30 rounded-t" />
              </div>
              <div className="absolute top-4 left-6 text-[8px] font-mono text-[#A4A4A4]/40">AUDITING METRIC: AAOIFI</div>
              <div className="absolute bottom-4 right-6 text-[8px] font-mono text-[#0CCB8E]/55">CONSENSUS VERIFIED</div>
            </div>

            <div className="space-y-3 mt-6">
              <h3 className="text-xl font-bold font-jakarta text-white group-hover:text-[#0CCB8E] transition-colors">
                Juristic Compliance Rigor
              </h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Screens assets across diverse Islamic jurisprudence frameworks (AAOIFI, DFM, Dow Jones). Our audits are certified by a globally recognized advisory board.
              </p>
            </div>
          </div>

          {/* Column 3: Institutional Grade Research */}
          <div className="bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group relative overflow-hidden h-[450px]">
            {/* Abstract Graphic Illustration (Pure CSS) */}
            <div className="absolute top-0 right-0 w-48 h-48 bg-[#0CCB8E]/5 rounded-full filter blur-2xl pointer-events-none" />
            
            <div className="relative w-full h-40 bg-[#050505] border border-white/5 rounded-xl flex items-center justify-center overflow-hidden">
              {/* CSS Abstract Graphic */}
              <div className="relative w-32 h-20 border-b border-white/10 flex items-end justify-between px-2 pb-1">
                <div className="w-2 h-10 bg-white/5 rounded-full" />
                <div className="w-2 h-16 bg-white/10 rounded-full" />
                <div className="w-2 h-20 bg-[#0CCB8E]/70 rounded-full" />
                <div className="w-2 h-12 bg-white/10 rounded-full" />
                <div className="w-2 h-24 bg-[#14F195] rounded-full" />
              </div>
              <div className="absolute top-4 left-6 text-[8px] font-mono text-[#A4A4A4]/40">DATAFEED: S&P / BLOOMBERG</div>
              <div className="absolute bottom-4 right-6 text-[8px] font-mono text-[#0CCB8E]/55">LATENCY: 5MS</div>
            </div>

            <div className="space-y-3 mt-6">
              <h3 className="text-xl font-bold font-jakarta text-white group-hover:text-[#0CCB8E] transition-colors">
                Institutional-Grade Data
              </h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Gain access to institutional wealth management tools, real-time dividend announcement scans, and direct market data streams without premium costs.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

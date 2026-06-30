"use client";

import { useState } from "react";
import { ShieldCheck, Compass, Sparkles, BookOpen, GraduationCap } from "lucide-react";

export default function AboutUs() {
  const [activeTab, setActiveTab] = useState<"mission" | "vision" | "scholars" | "tech">("mission");

  const content = {
    mission: {
      title: "Our Mission",
      subtitle: "Ethical alignment for global Muslim wealth.",
      body: "We strive to dismantle the barriers separating modern finance from Shariah compliance. By building high-fidelity automated screening engines, we empower Muslim investors to confidently grow their capital without compromising on spiritual and ethical integrity.",
      points: ["100% Transparent calculations", "Universal AAOIFI standard alignment", "Open-source juristic audits"],
    },
    vision: {
      title: "Our Vision",
      subtitle: "The infrastructure for ethical investments.",
      body: "We envision a world where Shariah-compliant asset validation is instant, reliable, and accessible to everyone. From pre-seed startups to multi-million dollar funds, IslamInvest IQ acts as the universal standard engine for halal wealth verification.",
      points: ["Real-time blockchain screening", "Universal compliance API models", "Inclusive global wealth distribution"],
    },
    scholars: {
      title: "Scholarly Oversight",
      subtitle: "Rigorous certification by renowned jurists.",
      body: "Our models do not work in isolation. We partner with the world's leading minds in Islamic commercial law. Our Shariah Advisory Board meets quarterly to check screening algorithms, reviewing liquidity bounds and revenue parameters.",
      points: ["Consensus audit certificates", "Direct fatwa inquiries", "Jurisprudence compliance consensus"],
    },
    tech: {
      title: "Advanced Technology",
      subtitle: "AI agents auditing millions of files daily.",
      body: "We deploy state-of-the-art semantic models and financial scrapers capable of reading thousands of pages of quarterly filings, corporate notes, and transcripts in milliseconds. We ensure data latency doesn't compromise screening accuracy.",
      points: ["Agentic RAG intelligence", "Under-5ms screening latency", "End-to-end data encryption"],
    },
  };

  return (
    <section id="about" className="py-24 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left panel: Interactive sidebar selectors */}
          <div className="lg:col-span-4 space-y-6">
            <div>
              <span className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">Our Story</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 font-jakarta tracking-tight">Who We Are</h2>
            </div>
            
            <div className="flex flex-col gap-2 pt-4">
              {Object.keys(content).map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setActiveTab(tabKey as any)}
                  className={`w-full text-left px-5 py-4 rounded-xl text-xs font-bold uppercase tracking-wider transition-all border ${activeTab === tabKey ? "bg-[#111111] border-[#0CCB8E] text-[#0CCB8E]" : "bg-transparent border-transparent text-[#A4A4A4] hover:text-white"}`}
                >
                  {tabKey === "tech" ? "Technology" : tabKey}
                </button>
              ))}
            </div>
          </div>

          {/* Right panel: Displays selected tab details */}
          <div className="lg:col-span-8 bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-12 relative min-h-[380px] flex flex-col justify-between">
            <div className="space-y-6">
              <div>
                <span className="text-xs text-[#0CCB8E] font-semibold uppercase tracking-wider">{content[activeTab].subtitle}</span>
                <h3 className="text-2xl md:text-3xl font-extrabold text-white mt-1 font-jakarta">{content[activeTab].title}</h3>
              </div>

              <p className="text-sm md:text-base text-[#A4A4A4] leading-relaxed font-light">
                {content[activeTab].body}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-white/5">
                {content[activeTab].points.map((pt, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-[#14F195] flex-shrink-0" />
                    <span className="text-xs text-white/90 font-medium">{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

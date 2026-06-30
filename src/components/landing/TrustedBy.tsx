"use client";

import { Award, Globe, Shield, Coins, Scale } from "lucide-react";

export default function TrustedBy() {
  const partners = [
    { name: "Crescent Ventures", icon: Coins, label: "Ethical Funds" },
    { name: "Amanah Advisory", icon: Scale, label: "Juristic Auditing" },
    { name: "Crenshaw Capital", icon: Shield, label: "Institutional Asset Management" },
    { name: "Taqwa Fund", icon: Award, label: "Wealth Screening" },
    { name: "Medina Invest", icon: Globe, label: "Global Shariah Equity" },
    { name: "Qadir Partners", icon: Coins, label: "Halal Seed Funding" },
  ];

  return (
    <section className="py-12 border-y border-white/5 bg-[#0B0F0D] overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <p className="text-center text-xs font-semibold text-[#A4A4A4] uppercase tracking-widest mb-8">
          Trusted by Elite Investors and Certified Institutions
        </p>

        {/* Marquee Wrapper */}
        <div className="relative w-full flex overflow-x-hidden">
          <div className="flex gap-16 py-4 animate-marquee whitespace-nowrap">
            {/* First Set */}
            {partners.map((partner, index) => (
              <div 
                key={index} 
                className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <partner.icon className="w-5 h-5 text-[#0CCB8E]" />
                <span className="text-lg font-black font-jakarta tracking-tight text-white">{partner.name}</span>
                <span className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-[#A4A4A4] font-medium">{partner.label}</span>
              </div>
            ))}
            {/* Duplicate Set for Seamless Loop */}
            {partners.map((partner, index) => (
              <div 
                key={`dup-${index}`} 
                className="flex items-center gap-3 grayscale opacity-45 hover:grayscale-0 hover:opacity-100 transition-all duration-300 cursor-pointer"
              >
                <partner.icon className="w-5 h-5 text-[#0CCB8E]" />
                <span className="text-lg font-black font-jakarta tracking-tight text-white">{partner.name}</span>
                <span className="text-[10px] border border-white/10 px-2 py-0.5 rounded text-[#A4A4A4] font-medium">{partner.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

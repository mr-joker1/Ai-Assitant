"use client";

import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";

export default function CTABanner() {
  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] rounded-full radial-light opacity-50 pointer-events-none filter blur-[80px]" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Glass Box */}
        <div className="glass-panel border-2 border-[#0CCB8E]/20 rounded-[32px] p-8 md:p-16 text-center space-y-8 relative overflow-hidden">
          {/* Subtle accent border top */}
          <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-[#0CCB8E] to-transparent" />
          
          <div className="flex justify-center">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[rgba(255,255,255,0.08)] bg-[#050505] text-[#0CCB8E] text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-[#14F195]" />
              <span>Get Started Within Minutes</span>
            </div>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-jakarta max-w-3xl mx-auto leading-tight">
            Ready to Build <br />
            <span className="gradient-text-accent font-grotesk font-black uppercase tracking-wide">Ethical Wealth?</span>
          </h2>

          <p className="text-[#A4A4A4] text-sm md:text-base max-w-xl mx-auto font-light leading-relaxed">
            Join thousands of global investors, family offices, and scholars auditing portfolios under strict Shariah parameters.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 scale-100 hover:scale-[1.03] shadow-lg shadow-[#0CCB8E]/20 text-sm"
            >
              Start Free Trial <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-white/10 bg-white/5 hover:bg-white/10 text-white font-bold px-8 py-4 rounded-xl flex items-center justify-center transition-all duration-300 scale-100 hover:scale-[1.03] backdrop-blur-md text-sm"
            >
              Book Advisory Call
            </Link>
          </div>

        </div>

      </div>
    </section>
  );
}

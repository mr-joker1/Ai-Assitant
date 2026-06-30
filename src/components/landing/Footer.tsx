"use client";

import Link from "next/link";
import { Send, Globe, Shield, Heart } from "lucide-react";
import { useState } from "react";

export default function Footer() {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setSubscribed(true);
    setTimeout(() => {
      setSubscribed(false);
      setEmail("");
    }, 3500);
  };

  return (
    <footer className="bg-[#050505] border-t border-white/5 pt-20 pb-8 text-xs text-[#A4A4A4] relative overflow-hidden">
      
      {/* Grid container */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-6 gap-12 pb-16 border-b border-white/5">
        
        {/* Brand details and newsletter */}
        <div className="col-span-2 space-y-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0CCB8E] flex items-center justify-center font-bold text-[#050505] text-lg">
              I
            </div>
            <span className="font-extrabold text-sm tracking-tight text-white">IslamInvest <span className="text-[#0CCB8E]">IQ</span></span>
          </div>

          <p className="text-xs text-[#A4A4A4] leading-relaxed max-w-xs font-light">
            Deploying AI-powered screening mechanisms and juristic consensus audits for next-generation halal wealth management.
          </p>

          {/* Newsletter form */}
          <div className="space-y-2 max-w-xs">
            <span className="text-[10px] text-white uppercase tracking-wider font-semibold">Join Intel newsletter</span>
            {subscribed ? (
              <p className="text-[#0CCB8E] font-medium text-[11px]">Subscribed successfully!</p>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input 
                  type="email" 
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="bg-[#111111] border border-white/5 rounded-lg px-3 py-2 text-xs text-white focus:outline-none focus:border-[#0CCB8E]/30 flex-grow"
                  placeholder="name@email.com"
                />
                <button 
                  type="submit"
                  className="bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] font-bold px-3 py-2 rounded-lg transition-colors flex items-center justify-center"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Column 2: Products */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Products</h4>
          <ul className="space-y-2.5 font-light">
            <li><Link href="/register" className="hover:text-white transition-colors">Equity Screener</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">DeFi Audit Engine</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Zakat Ledger</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">AI Advisor Advisor</Link></li>
          </ul>
        </div>

        {/* Column 3: Resources */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Resources</h4>
          <ul className="space-y-2.5 font-light">
            <li><Link href="/register" className="hover:text-white transition-colors">Scholar Consensus</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Fatwa Database</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Learning Hub</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">API Docs</Link></li>
          </ul>
        </div>

        {/* Column 4: Company */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Company</h4>
          <ul className="space-y-2.5 font-light">
            <li><Link href="/register" className="hover:text-white transition-colors">About Us</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Our Scholars</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Contact advisory</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Media Kit</Link></li>
          </ul>
        </div>

        {/* Column 5: Legal */}
        <div className="space-y-4">
          <h4 className="text-[10px] font-bold text-white uppercase tracking-wider">Legal</h4>
          <ul className="space-y-2.5 font-light">
            <li><Link href="/register" className="hover:text-white transition-colors">Terms of Service</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Privacy Policy</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Audit Disclaimers</Link></li>
            <li><Link href="/register" className="hover:text-white transition-colors">Advisory Board Bylaws</Link></li>
          </ul>
        </div>

      </div>

      {/* Bottom info */}
      <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] text-[#A4A4A4]/60">
        <p>&copy; {new Date().getFullYear()} IslamInvest IQ. All rights reserved.</p>
        
        <div className="flex gap-4 items-center">
          <span className="hover:text-white transition-colors flex items-center gap-1">
            <Shield className="w-3.5 h-3.5 text-[#0CCB8E]" /> Juristic Consensus Audited
          </span>
          <span>&bull;</span>
          <span className="hover:text-white transition-colors">Immutable Shariah Ledgers</span>
        </div>
      </div>
    </footer>
  );
}

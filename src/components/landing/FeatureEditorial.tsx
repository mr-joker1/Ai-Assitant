"use client";

import { 
  Search, Cpu, Scale, Compass, CheckCircle, AlertTriangle, 
  Coins, BookOpen, GraduationCap, Newspaper, Shield, FileText, ChevronRight
} from "lucide-react";
import { useState } from "react";

export default function FeatureEditorial() {
  const [searchTerm, setSearchTerm] = useState("Micro");
  const [zakatAssets, setZakatAssets] = useState(150000);

  const mockSearchResults = [
    { name: "Microsoft Corp (MSFT)", status: "Compliant", score: 96, category: "Equities" },
    { name: "MicroStrategy (MSTR)", status: "Non-Compliant", score: 42, category: "Equities" },
  ];

  return (
    <section id="features" className="py-24 bg-[#050505] relative overflow-hidden">
      {/* Decorative background light */}
      <div className="absolute top-1/2 left-0 w-[400px] h-[400px] rounded-full radial-light opacity-30 pointer-events-none filter blur-[80px]" />
      <div className="absolute bottom-12 right-0 w-[400px] h-[400px] rounded-full radial-light opacity-30 pointer-events-none filter blur-[80px]" />

      <div className="max-w-7xl mx-auto px-6">
        
        {/* Editorial Heading */}
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Platform Capabilities
          </div>
          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight font-jakarta leading-tight">
            Compliance Intelligence <br />
            Redefined for Modern Finance
          </h2>
          <p className="text-[#A4A4A4] text-lg max-w-xl font-light">
            An comprehensive ecosystem of AI engines, calculation ledgers, and academic repositories built to enforce absolute financial alignment.
          </p>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Card 1: AI Search & Chat Advisor (Large 8-columns) */}
          <div className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover relative overflow-hidden group">
            <div className="absolute -top-12 -right-12 w-64 h-64 rounded-full bg-[#0CCB8E]/5 filter blur-3xl opacity-50 group-hover:bg-[#0CCB8E]/10 transition-colors" />
            
            <div className="space-y-4 max-w-lg z-10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#0CCB8E] bg-[#0CCB8E]/10 px-3 py-1 rounded-full">
                Interactive AI Search & Chat
              </span>
              <h3 className="text-2xl font-bold font-jakarta text-white">Instant Global Compliance Screening</h3>
              <p className="text-sm text-[#A4A4A4] leading-relaxed">
                Scan stocks, cryptos, and ETFs using semantic search. Get real-time compliance verdicts instantly backed by academic Shariah reviews.
              </p>
            </div>

            {/* In-Card Interactive Mockup */}
            <div className="mt-8 bg-[#050505] rounded-xl border border-white/5 p-5 space-y-4">
              <div className="relative">
                <Search className="absolute left-3.5 top-3.5 w-4 h-4 text-[#A4A4A4]" />
                <input 
                  type="text" 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-[#111111] border border-white/5 rounded-lg py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#0CCB8E]/30"
                  placeholder="Search assets (e.g. MSFT, BTC)..."
                />
              </div>
              
              {/* Recent searches */}
              <div className="flex flex-wrap gap-2 items-center text-[10px] text-[#A4A4A4]">
                <span className="font-semibold">Recent:</span>
                {["Micro", "AAPL", "MSTR", "BTC"].map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setSearchTerm(item)}
                    className="px-2 py-0.5 rounded bg-[#111111] border border-white/5 hover:border-[#0CCB8E]/30 hover:text-white transition-all cursor-pointer"
                  >
                    {item}
                  </button>
                ))}
              </div>
              <div className="space-y-2">
                {mockSearchResults
                  .filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center bg-[#111111] p-3 rounded-lg border border-white/5">
                      <div>
                        <p className="text-xs font-bold text-white">{item.name}</p>
                        <span className="text-[10px] text-[#A4A4A4]">{item.category}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${item.status === "Compliant" ? "bg-[#0CCB8E]/10 text-[#0CCB8E]" : "bg-red-500/10 text-red-400"}`}>
                          {item.status}
                        </span>
                        <span className="text-xs font-mono text-[#A4A4A4]">{item.score}% Compliance</span>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>

          {/* Card 2: Company & Startup Analyzer (4-columns) */}
          <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                <Cpu className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-jakarta text-white">Company & Startup Analyzer</h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Analyze private companies and pre-seed startups. Upload term sheets and pitch decks for automatic Shariah structure verification.
              </p>
            </div>
            
            {/* Visual widget */}
            <div className="mt-8 p-4 bg-[#050505] rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between text-[10px] text-[#A4A4A4]">
                <span>Financial Ratios</span>
                <span className="text-[#0CCB8E] font-semibold">Passed</span>
              </div>
              <div className="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
                <div className="h-full bg-[#0CCB8E] w-[88%]" />
              </div>
              <div className="flex justify-between text-[10px] text-[#A4A4A4]">
                <span>Liquidity Ratio</span>
                <span className="text-[#0CCB8E] font-semibold">Passed (32.4%)</span>
              </div>
            </div>
          </div>

          {/* Card 3: Crypto & ETF Analyzer (4-columns) */}
          <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                <Scale className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-jakarta text-white">Crypto & ETF Screeners</h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Scan liquidity pools, DeFi interest mechanics, and ETF basket allocations against strict jurisprudential models.
              </p>
            </div>

            {/* Visual widget */}
            <div className="mt-8 space-y-2">
              <div className="bg-[#050505] p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#A4A4A4]">BTC (Bitcoin)</span>
                <span className="text-[#0CCB8E] font-semibold">Halal Utility</span>
              </div>
              <div className="bg-[#050505] p-3 rounded-lg border border-white/5 flex items-center justify-between text-xs">
                <span className="text-[#A4A4A4]">USDT (Tether)</span>
                <span className="text-amber-500 font-semibold">Interest Risks</span>
              </div>
            </div>
          </div>

          {/* Card 4: Portfolio Checker & Purification Ledger (Large 8-columns) */}
          <div className="md:col-span-8 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover relative overflow-hidden group">
            <div className="absolute -bottom-12 -left-12 w-64 h-64 rounded-full bg-[#14F195]/5 filter blur-3xl opacity-50 group-hover:bg-[#14F195]/10 transition-colors" />

            <div className="space-y-4 max-w-lg z-10">
              <span className="text-[10px] uppercase tracking-wider font-semibold text-[#14F195] bg-[#14F195]/10 px-3 py-1 rounded-full">
                Dividend Purification
              </span>
              <h3 className="text-2xl font-bold font-jakarta text-white">Automated Purification Ledger</h3>
              <p className="text-sm text-[#A4A4A4] leading-relaxed">
                Cleanse impure earnings. Our purification engine audits stock holdings quarterly, indicating precisely how much interest-based revenue must be donated to charity.
              </p>
            </div>

            {/* Visual Ledger table mockup */}
            <div className="mt-8 bg-[#050505] rounded-xl border border-white/5 p-4 overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-[#A4A4A4] border-b border-white/5">
                    <th className="pb-2 font-semibold">Security</th>
                    <th className="pb-2 font-semibold">Impure Revenue %</th>
                    <th className="pb-2 font-semibold">Total Holding</th>
                    <th className="pb-2 font-semibold text-right">Purification Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <tr>
                    <td className="py-2.5 font-medium text-white">Apple (AAPL)</td>
                    <td className="py-2.5 text-[#A4A4A4]">2.1%</td>
                    <td className="py-2.5 text-white">$14,200</td>
                    <td className="py-2.5 text-right text-[#0CCB8E] font-bold font-mono">$298.20</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 font-medium text-white">Tesla (TSLA)</td>
                    <td className="py-2.5 text-[#A4A4A4]">4.5%</td>
                    <td className="py-2.5 text-white">$8,500</td>
                    <td className="py-2.5 text-right text-[#0CCB8E] font-bold font-mono">$382.50</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Card 5: Zakat Calculator (4-columns) */}
          <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                <Coins className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-jakarta text-white">Zakat Engine</h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Evaluate liquid cash, gold, real estate, and stock holdings against current Nisab thresholds to generate complete annual Zakat liability reports.
              </p>
            </div>

            {/* Interactive Zakat slide */}
            <div className="mt-8 bg-[#050505] p-4 rounded-xl border border-white/5 space-y-3">
              <div className="flex justify-between text-[10px] text-[#A4A4A4]">
                <span>Vested Assets</span>
                <span className="text-white font-mono">${zakatAssets.toLocaleString()}</span>
              </div>
              <input 
                type="range" 
                min="5000" 
                max="500000" 
                step="5000"
                value={zakatAssets} 
                onChange={(e) => setZakatAssets(Number(e.target.value))}
                className="w-full accent-[#0CCB8E]"
              />
              <div className="flex justify-between text-[10px] text-[#A4A4A4] pt-1">
                <span>Calculated Zakat (2.5%)</span>
                <span className="text-[#0CCB8E] font-bold font-mono">${(zakatAssets * 0.025).toLocaleString(undefined, {maximumFractionDigits:0})}</span>
              </div>
            </div>
          </div>

          {/* Card 6: Scholar Hub & Fatwa Library (4-columns) */}
          <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                <Shield className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-jakarta text-white">Scholar Hub & Fatwa</h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Connect with leading global jurists in Islamic finance and search hundreds of vetted Fatwas regarding complex decentralized tokens and investments.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-[#0CCB8E] font-semibold cursor-pointer group-hover:text-white transition-colors">
              <span>Access Scholar Board</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

          {/* Card 7: Learning Academy & News (4-columns) */}
          <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between glow-hover group">
            <div className="space-y-4">
              <div className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold font-jakarta text-white">Learning Academy</h3>
              <p className="text-xs text-[#A4A4A4] leading-relaxed">
                Understand the basics of Riba (interest), Gharar (uncertainty), and halal finance structures. Keep updated on global ethical investing news.
              </p>
            </div>

            <div className="mt-8 pt-4 border-t border-white/5 flex justify-between items-center text-xs text-[#0CCB8E] font-semibold cursor-pointer group-hover:text-white transition-colors">
              <span>View Articles & Academy</span>
              <ChevronRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

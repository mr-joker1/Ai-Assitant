"use client";

import { 
  ShieldCheck, PieChart, TrendingUp, AlertCircle, HelpCircle, 
  ArrowUpRight, Heart, Star, UserCheck, RefreshCw, BarChart2
} from "lucide-react";
import { useState } from "react";

export default function InteractiveShowcase() {
  const [selectedAsset, setSelectedAsset] = useState<number>(0);
  const [hoveredPoint, setHoveredPoint] = useState<{ x: number, y: number, value: string, date: string } | null>(null);

  const assets = [
    { ticker: "MSFT", name: "Microsoft Corp.", ratio: "12.4%", status: "Compliant", purification: "0%", color: "#0CCB8E", allocation: "35%" },
    { ticker: "AAPL", name: "Apple Inc.", ratio: "15.1%", status: "Purification Req.", purification: "2.1%", color: "#14F195", allocation: "28%" },
    { ticker: "TSLA", name: "Tesla Inc.", ratio: "22.3%", status: "Purification Req.", purification: "4.5%", color: "#0CCB8E", allocation: "20%" },
    { ticker: "NVIDIA", name: "NVIDIA Corp.", ratio: "9.2%", status: "Compliant", purification: "0%", color: "#14F195", allocation: "17%" },
  ];

  // SVG Chart points
  const points = [
    { x: 30, y: 150, val: "$85,000", date: "Jan 2026" },
    { x: 120, y: 130, val: "$92,400", date: "Feb 2026" },
    { x: 210, y: 140, val: "$91,000", date: "Mar 2026" },
    { x: 300, y: 90, val: "$114,800", date: "Apr 2026" },
    { x: 390, y: 80, val: "$122,000", date: "May 2026" },
    { x: 480, y: 50, val: "$142,000", date: "Jun 2026" },
    { x: 570, y: 35, val: "$148,250", date: "Today" },
  ];

  return (
    <section id="showcase" className="py-24 bg-[#0B0F0D] relative overflow-hidden border-y border-white/5">
      <div className="absolute inset-0 radial-light-accent opacity-20 pointer-events-none filter blur-[100px]" />
      
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Platform Demo
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta">
            Your Premium Wealth Portal
          </h2>
          <p className="text-[#A4A4A4] text-sm md:text-base font-light">
            Hover over elements in our mockup dashboard to explore real-time tracking, compliance scoring, and growth analytics.
          </p>
        </div>

        {/* Dashboard Mockup (Desktop first layout) */}
        <div className="glass-panel border border-white/10 rounded-[32px] overflow-hidden shadow-2xl bg-[#050505] p-2 md:p-6 w-full max-w-6xl mx-auto">
          
          {/* Main Layout Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Sidebar Mockup (2-columns) */}
            <div className="lg:col-span-3 hidden lg:flex flex-col justify-between border-r border-white/5 pr-6 py-2">
              <div className="space-y-8">
                {/* Brand Info */}
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-[#0CCB8E] flex items-center justify-center font-bold text-[#050505] text-lg">
                    I
                  </div>
                  <span className="font-extrabold text-sm tracking-tight text-white">IslamInvest IQ</span>
                </div>

                {/* Nav Items */}
                <nav className="space-y-1.5">
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl bg-white/5 text-[#0CCB8E] font-medium text-xs">
                    <PieChart className="w-4 h-4" />
                    <span>Portfolio Audit</span>
                  </div>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#A4A4A4] hover:text-white transition-colors font-medium text-xs cursor-pointer">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Halal Screener</span>
                  </div>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#A4A4A4] hover:text-white transition-colors font-medium text-xs cursor-pointer">
                    <TrendingUp className="w-4 h-4" />
                    <span>Purification Ledger</span>
                  </div>
                  <div className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[#A4A4A4] hover:text-white transition-colors font-medium text-xs cursor-pointer">
                    <UserCheck className="w-4 h-4" />
                    <span>Scholar Advisory</span>
                  </div>
                </nav>
              </div>

              {/* Status footer */}
              <div className="bg-[#111111] p-3 rounded-xl border border-white/5 flex items-center gap-2.5">
                <div className="w-2 h-2 rounded-full bg-[#0CCB8E]" />
                <div>
                  <p className="text-[10px] text-white font-bold">Consensus Approved</p>
                  <span className="text-[9px] text-[#A4A4A4]">Juristic Advisory Board</span>
                </div>
              </div>
            </div>

            {/* Main Content Area (9-columns) */}
            <div className="lg:col-span-9 space-y-6">
              
              {/* Header stats bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Total Portfolio</span>
                  <div className="text-xl font-bold text-white mt-1 font-jakarta">$148,250.20</div>
                  <span className="text-[10px] text-[#0CCB8E] font-medium">+12.4% YTD</span>
                </div>

                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl relative group cursor-pointer">
                  <span className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold flex items-center gap-1">
                    Compliance Score <HelpCircle className="w-3 h-3" />
                  </span>
                  <div className="text-xl font-bold text-[#0CCB8E] mt-1 font-jakarta">98.2%</div>
                  <span className="text-[10px] text-[#A4A4A4]">AAOIFI Standard</span>
                </div>

                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Purification Est.</span>
                  <div className="text-xl font-bold text-[#14F195] mt-1 font-jakarta">$680.70</div>
                  <span className="text-[10px] text-[#A4A4A4] font-medium">Pending Payout</span>
                </div>

                <div className="bg-[#111111] border border-white/5 p-4 rounded-2xl">
                  <span className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Accrued Zakat</span>
                  <div className="text-xl font-bold text-white mt-1 font-jakarta">$3,706.25</div>
                  <span className="text-[10px] text-[#A4A4A4] font-medium">Auto-Calculated</span>
                </div>
              </div>

              {/* Middle Row: Chart & Allocations */}
              <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                
                {/* SVG Chart (8-columns) */}
                <div className="md:col-span-8 bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div className="flex justify-between items-center mb-4">
                    <div>
                      <h4 className="text-xs font-bold text-white">Growth Analytics</h4>
                      <span className="text-[10px] text-[#A4A4A4]">IslamInvest Shariah Yield vs Benchmark</span>
                    </div>
                    <div className="flex gap-1">
                      <span className="w-2.5 h-2.5 rounded-full bg-[#0CCB8E]" />
                      <span className="text-[9px] text-[#A4A4A4] mr-2">Halal Yield</span>
                      <span className="w-2.5 h-2.5 rounded-full bg-[#A4A4A4]/40" />
                      <span className="text-[9px] text-[#A4A4A4]">S&P 500</span>
                    </div>
                  </div>

                  {/* SVG Chart Component */}
                  <div className="relative w-full h-[180px] mt-2">
                    <svg viewBox="0 0 600 180" className="w-full h-full">
                      {/* Grid Lines */}
                      <line x1="30" y1="35" x2="570" y2="35" stroke="rgba(255,255,255,0.03)" />
                      <line x1="30" y1="80" x2="570" y2="80" stroke="rgba(255,255,255,0.03)" />
                      <line x1="30" y1="130" x2="570" y2="130" stroke="rgba(255,255,255,0.03)" />

                      {/* S&P 500 Path */}
                      <path 
                        d="M 30,150 L 120,140 L 210,145 L 300,115 L 390,110 L 480,95 L 570,85"
                        fill="none" 
                        stroke="rgba(255,255,255,0.15)" 
                        strokeWidth="1.5" 
                      />

                      {/* Compliant Yield Path */}
                      <path 
                        d="M 30,150 Q 120,120 210,135 T 300,85 T 390,75 T 480,45 T 570,30" 
                        fill="none" 
                        stroke="url(#chartGrad)" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                      />

                      {/* Shading below path */}
                      <path
                        d="M 30,150 Q 120,120 210,135 T 300,85 T 390,75 T 480,45 T 570,30 L 570,180 L 30,180 Z"
                        fill="url(#chartFill)"
                        opacity="0.2"
                      />

                      {/* Interactive Points */}
                      {points.map((p, idx) => (
                        <circle
                          key={idx}
                          cx={p.x}
                          cy={p.y}
                          r="5"
                          className="fill-[#0CCB8E] stroke-[#050505] stroke-[2px] cursor-pointer hover:r-7 transition-all"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredPoint({ x: p.x, y: p.y, value: p.val, date: p.date });
                          }}
                          onMouseLeave={() => setHoveredPoint(null)}
                        />
                      ))}

                      {/* Gradients */}
                      <defs>
                        <linearGradient id="chartGrad" x1="0" y1="0" x2="1" y2="0">
                          <stop offset="0%" stopColor="#0CCB8E" />
                          <stop offset="100%" stopColor="#14F195" />
                        </linearGradient>
                        <linearGradient id="chartFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0CCB8E" stopOpacity="0.4" />
                          <stop offset="100%" stopColor="#050505" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                    </svg>

                    {/* Chart tooltip */}
                    {hoveredPoint && (
                      <div 
                        className="absolute bg-[#111111] border border-white/10 px-3 py-1.5 rounded-lg shadow-xl text-[10px] pointer-events-none transition-all duration-150 z-20"
                        style={{ 
                          left: `${(hoveredPoint.x / 600) * 100}%`, 
                          top: `${(hoveredPoint.y / 180) * 100 - 30}%`,
                          transform: 'translateX(-50%)'
                        }}
                      >
                        <p className="font-bold text-white">{hoveredPoint.value}</p>
                        <span className="text-[#A4A4A4] font-mono">{hoveredPoint.date}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Asset Weight Allocations (4-columns) */}
                <div className="md:col-span-4 bg-[#111111] border border-white/5 rounded-2xl p-4 flex flex-col justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-white mb-3">Portfolio Allocations</h4>
                    
                    {/* Allocation Bars */}
                    <div className="space-y-3">
                      {assets.map((asset, idx) => (
                        <div 
                          key={idx}
                          onClick={() => setSelectedAsset(idx)}
                          className={`p-2.5 rounded-lg border cursor-pointer transition-all duration-200 ${selectedAsset === idx ? "bg-white/5 border-[#0CCB8E]/40" : "bg-transparent border-transparent hover:bg-white/5"}`}
                        >
                          <div className="flex justify-between items-center text-xs">
                            <div className="flex items-center gap-1.5">
                              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: asset.color }} />
                              <span className="font-bold text-white">{asset.ticker}</span>
                            </div>
                            <span className="font-semibold text-white/90">{asset.allocation}</span>
                          </div>
                          
                          {/* Mini Progress */}
                          <div className="w-full bg-white/5 h-1 rounded-full mt-1.5 overflow-hidden">
                            <div className="h-full bg-[#0CCB8E] transition-all" style={{ width: asset.allocation }} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <span className="text-[9px] text-[#A4A4A4] text-center pt-2">Click assets to inspect audit profile</span>
                </div>

              </div>

              {/* Bottom Row: Detailed Compliance Audit */}
              <div className="bg-[#111111] border border-white/5 rounded-2xl p-5">
                <h4 className="text-xs font-bold text-white mb-3">Compliance Screening Audit: {assets[selectedAsset].name}</h4>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                  <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#A4A4A4]">Juristic Verdict</span>
                    <div className="text-xs font-bold text-white mt-1 flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-[#0CCB8E]" />
                      <span>Shariah Compliant (AAOIFI)</span>
                    </div>
                  </div>

                  <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#A4A4A4]">Debt-to-Asset Ratio</span>
                    <p className="text-xs font-bold text-white mt-1">{assets[selectedAsset].ratio} <span className="text-[10px] text-[#0CCB8E] font-medium">(Threshold &lt;33%)</span></p>
                  </div>

                  <div className="bg-[#050505] p-3 rounded-lg border border-white/5">
                    <span className="text-[10px] text-[#A4A4A4]">Purification Rate</span>
                    <p className="text-xs font-bold text-[#14F195] mt-1">{assets[selectedAsset].purification} <span className="text-[10px] text-[#A4A4A4] font-medium">(Requires Payout)</span></p>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

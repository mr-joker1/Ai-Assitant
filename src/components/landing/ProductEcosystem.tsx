"use client";

import { 
  Search, Cpu, PieChart, Coins, FileText, Users, ArrowDown, ArrowRight 
} from "lucide-react";
import { useState } from "react";

export default function ProductEcosystem() {
  const [activeNode, setActiveNode] = useState<string | null>("search");

  const nodes = [
    { id: "search", title: "AI Search", icon: Search, desc: "Entry point for asset semantic scan", position: "top-left" },
    { id: "analyzer", title: "Company Analyzer", icon: Cpu, desc: "Algorithmic audit of cash and revenues", position: "top-center" },
    { id: "portfolio", title: "Portfolio Tracker", icon: PieChart, desc: "Aggregated holdings watch & alerts", position: "center" },
    { id: "zakat", title: "Zakat Engine", icon: Coins, desc: "Accrued calculation based on holdings", position: "bottom-left" },
    { id: "reports", title: "Audit Reports", icon: FileText, desc: "Downloadable juristic files for tax & records", position: "bottom-center" },
    { id: "scholars", title: "Scholar Hub", icon: Users, desc: "Direct legal consensus board reviews", position: "bottom-right" }
  ];

  return (
    <section id="ecosystem" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-16 space-y-6">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Ecosystem Integration
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-jakarta leading-tight">
            An Interconnected Network
          </h2>
          <p className="text-[#A4A4A4] text-lg max-w-xl font-light">
            Every analytical result seamlessly propagates to your ledger, purification ledger, and scholar audits.
          </p>
        </div>

        {/* Ecosystem Nodes Diagram */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          
          {/* Left panel: Info display */}
          <div className="lg:col-span-1 bg-[#111111] border border-white/5 rounded-[24px] p-8 flex flex-col justify-between">
            <div>
              <div className="text-[10px] text-[#0CCB8E] uppercase tracking-widest font-semibold mb-3">Node Details</div>
              
              {activeNode ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E]">
                      {(() => {
                        const IconNode = nodes.find(n => n.id === activeNode)?.icon || Search;
                        return <IconNode className="w-5 h-5" />;
                      })()}
                    </div>
                    <h3 className="text-xl font-bold font-jakarta text-white">
                      {nodes.find(n => n.id === activeNode)?.title}
                    </h3>
                  </div>
                  <p className="text-sm text-[#A4A4A4] leading-relaxed font-light">
                    {nodes.find(n => n.id === activeNode)?.desc}
                  </p>
                  
                  <div className="pt-4 border-t border-white/5 space-y-2">
                    <span className="text-[10px] text-[#A4A4A4] uppercase tracking-widest font-semibold block">Connected Streams</span>
                    <div className="flex gap-2">
                      <span className="text-xs border border-white/10 px-2.5 py-1 rounded bg-[#050505] text-white">Data Input</span>
                      <span className="text-xs border border-white/10 px-2.5 py-1 rounded bg-[#050505] text-[#0CCB8E]">Purification Ledger</span>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-[#A4A4A4]">Hover over any ecosystem node to view integration pathways and data streams.</p>
              )}
            </div>

            <div className="pt-6 border-t border-white/5 text-xs text-[#A4A4A4] font-light">
              Our microservices are unified under a private secure API, allowing real-time cross-service data feeds.
            </div>
          </div>

          {/* Right panel: Nodes Layout */}
          <div className="lg:col-span-2 bg-[#111111]/40 border border-white/5 rounded-[24px] p-8 flex flex-col justify-center min-h-[400px] relative">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6 relative">
              
              {nodes.map((node, index) => {
                const IconComponent = node.icon;
                const isSelected = activeNode === node.id;
                
                return (
                  <div 
                    key={node.id}
                    onMouseEnter={() => setActiveNode(node.id)}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 cursor-pointer flex flex-col items-center justify-center text-center gap-3 ${isSelected ? "bg-[#050505] border-[#0CCB8E] shadow-lg shadow-[#0CCB8E]/10" : "bg-[#111111] border-white/5 hover:border-white/10"}`}
                  >
                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${isSelected ? "bg-[#0CCB8E] text-[#050505]" : "bg-[#050505] text-[#A4A4A4]"}`}>
                      <IconComponent className="w-5 h-5" />
                    </div>
                    
                    <div>
                      <h4 className="text-xs font-bold text-white">{node.title}</h4>
                      <span className="text-[9px] text-[#A4A4A4] mt-1 block">Click to audit</span>
                    </div>

                    {/* Connector dots/arrows decorations */}
                    {index < nodes.length - 1 && (
                      <div className="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex text-[#0CCB8E]/30 pointer-events-none">
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    )}
                  </div>
                );
              })}

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

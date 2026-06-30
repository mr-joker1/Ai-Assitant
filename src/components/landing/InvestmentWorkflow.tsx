"use client";

import { 
  Search, Cpu, Scale, CheckSquare, LineChart, Coins, ChevronRight 
} from "lucide-react";
import { useState } from "react";

export default function InvestmentWorkflow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      title: "Search Asset",
      description: "Query equities, startup term sheets, or digital currencies.",
      icon: Search,
    },
    {
      title: "AI Analysis",
      description: "Extract debt records and core revenue streams.",
      icon: Cpu,
    },
    {
      title: "Shariah Screen",
      description: "Run mathematical checks against juristic thresholds.",
      icon: Scale,
    },
    {
      title: "Decide",
      description: "Make informed transactions with consensus certificates.",
      icon: CheckSquare,
    },
    {
      title: "Track Portfolio",
      description: "Monitor real-time compliance swings and impure income.",
      icon: LineChart,
    },
    {
      title: "Cleanse & Purify",
      description: "Calculate Zakat and auto-purify interest-based dividends.",
      icon: Coins,
    },
  ];

  return (
    <section className="py-24 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Seamless Execution
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta">
            The Ethical Investment Lifecycle
          </h2>
          <p className="text-[#A4A4A4] text-sm md:text-base font-light">
            An automated loop safeguarding your wealth from compliance drift at every stage.
          </p>
        </div>

        {/* Timeline Grid */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 relative">
          
          {/* Connector Line (Desktop Only) */}
          <div className="absolute top-1/2 left-[8%] right-[8%] h-0.5 bg-white/5 -translate-y-12 hidden md:block z-0" />

          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isCompleted = idx <= activeStep;
            
            return (
              <div 
                key={idx} 
                className="relative flex flex-col items-center text-center group cursor-pointer z-10"
                onMouseEnter={() => setActiveStep(idx)}
              >
                {/* Step Circle */}
                <div className={`w-16 h-16 rounded-full flex items-center justify-center border transition-all duration-300 ${isCompleted ? "bg-[#0CCB8E] border-[#0CCB8E] text-[#050505] shadow-lg shadow-[#0CCB8E]/25 scale-110" : "bg-[#111111] border-white/10 text-[#A4A4A4] group-hover:border-white/30"}`}>
                  <Icon className="w-6 h-6" />
                </div>

                {/* Index Counter */}
                <span className="text-[10px] font-mono text-[#0CCB8E] mt-4 font-bold">0{idx + 1}</span>

                {/* Title */}
                <h4 className="text-sm font-bold text-white mt-2 font-jakarta">{step.title}</h4>
                
                {/* Description */}
                <p className="text-xs text-[#A4A4A4] mt-2 leading-relaxed max-w-[150px] font-light">
                  {step.description}
                </p>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

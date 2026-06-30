"use client";

import { useState } from "react";
import { ChevronDown, HelpCircle } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does the AI determine Shariah compliance?",
      a: "Our AI model monitors global equity filings, quarterly balance sheets, and dividend declarations. It parses the debt-to-asset ratios and impermissible revenue percentages using formulas validated by our Shariah scholars under AAOIFI guidelines.",
    },
    {
      q: "What is dividend purification, and how is it processed?",
      a: "If a company passes the compliance threshold but has minor interest-bearing deposits (up to 5% permissible under standard rules), that portion of your dividend is 'impure'. Our purification ledger calculates this exact percentage, directing you on the sum to cleanse by donating to charity.",
    },
    {
      q: "Does IslamInvest IQ calculate Zakat on my holdings?",
      a: "Yes. Our Zakat engine automatically monitors your liquid assets, gold, properties, and stock values. It applies the 2.5% lunar calendar (or 2.577% solar calendar) rate on assets exceeding the Nisab threshold.",
    },
    {
      q: "Who is on the Shariah Advisory board?",
      a: "Our board comprises world-renowned Islamic finance jurists who audit our screening formulas, models, and advisory RAG databases quarterly, signing off on consensus certificates.",
    },
    {
      q: "Can I connect my brokerage account directly?",
      a: "Yes. Using read-only bank-grade APIs, you can sync your accounts to track automated compliance updates and purification alerts dynamically as you purchase assets.",
    },
  ];

  return (
    <section id="faq" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center mb-16 space-y-4">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Support Desk
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta">
            Frequently Asked Questions
          </h2>
          <p className="text-[#A4A4A4] text-sm md:text-base font-light">
            Answers to key operational, technical, and juristic inquiries.
          </p>
        </div>

        {/* Accordions */}
        <div className="space-y-4">
          {faqs.map((faq, index) => {
            const isOpen = openIndex === index;
            
            return (
              <div 
                key={index}
                className="bg-[#111111] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="w-full flex justify-between items-center p-6 text-left hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="w-4 h-4 text-[#0CCB8E] flex-shrink-0" />
                    <span className="font-bold text-white text-sm md:text-base font-jakarta">{faq.q}</span>
                  </div>
                  <ChevronDown className={`w-5 h-5 text-[#A4A4A4] transition-transform duration-300 ${isOpen ? "transform rotate-180 text-white" : ""}`} />
                </button>

                {/* Animated collapse container */}
                <div 
                  className={`transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "max-h-[200px] border-t border-white/5" : "max-h-0"}`}
                >
                  <p className="p-6 text-xs md:text-sm text-[#A4A4A4] leading-relaxed font-light font-sans bg-[#0B0F0D]">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

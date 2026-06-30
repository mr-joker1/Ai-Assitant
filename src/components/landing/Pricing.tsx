"use client";

import { useState } from "react";
import { Check, Info, ShieldAlert } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "yearly">("monthly");

  const plans = [
    {
      name: "Starter",
      description: "Essential Shariah screening for personal retail investors.",
      priceMonthly: 19,
      priceYearly: 14,
      features: [
        "150 Asset searches per month",
        "Equity and ETF compliance screener",
        "Basic Zakat calculator dashboard",
        "Community forum consensus access",
        "Email support",
      ],
      highlight: false,
      cta: "Start Free Trial",
    },
    {
      name: "Professional",
      description: "Our core compliance suite for active traders and family offices.",
      priceMonthly: 59,
      priceYearly: 44,
      features: [
        "Unlimited asset screening",
        "AI Chat Advisor consensus scans",
        "Automated purification ledger",
        "Crypto & DeFi liquidity checks",
        "Portfolio tracker integration",
        "Priority support",
      ],
      highlight: true,
      cta: "Access Professional",
    },
    {
      name: "Enterprise",
      description: "Bespoke compliance services for funds and asset managers.",
      priceMonthly: 199,
      priceYearly: 149,
      features: [
        "Institutional screening APIs",
        "Dedicated jurist board consults",
        "Custom compliance rule templates",
        "Multi-user team workspaces",
        "Under-5ms query latency feeds",
        "Dedicated Account Director",
      ],
      highlight: false,
      cta: "Contact Sales",
    },
  ];

  return (
    <section id="pricing" className="py-24 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Subscription Tiers
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta">
            Transparent Pricing Models
          </h2>
          <p className="text-[#A4A4A4] text-sm md:text-base font-light">
            Choose a plan that fits your ethical wealth allocation criteria. Save 25% on yearly billing.
          </p>

          {/* Toggle */}
          <div className="pt-8 flex justify-center">
            <div className="bg-[#050505] p-1.5 rounded-xl border border-white/5 flex gap-1">
              <button 
                onClick={() => setBillingCycle("monthly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billingCycle === "monthly" ? "bg-[#0CCB8E] text-[#050505]" : "text-[#A4A4A4] hover:text-white"}`}
              >
                Monthly Billing
              </button>
              <button 
                onClick={() => setBillingCycle("yearly")}
                className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all ${billingCycle === "yearly" ? "bg-[#0CCB8E] text-[#050505]" : "text-[#A4A4A4] hover:text-white"}`}
              >
                Yearly Billing
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch max-w-5xl mx-auto">
          {plans.map((plan, index) => {
            const price = billingCycle === "monthly" ? plan.priceMonthly : plan.priceYearly;
            
            return (
              <div 
                key={index}
                className={`rounded-[24px] p-8 flex flex-col justify-between transition-all duration-300 relative ${plan.highlight ? "bg-[#111111] border-2 border-[#0CCB8E] shadow-2xl scale-[1.03]" : "bg-[#111111]/60 border border-white/5 hover:border-white/10"}`}
              >
                {/* Popularity Badge */}
                {plan.highlight && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#0CCB8E] text-[#050505] text-[10px] uppercase font-bold tracking-widest px-3 py-1 rounded-full">
                    Recommended
                  </span>
                )}

                <div>
                  {/* Plan Name */}
                  <h3 className="text-xl font-bold text-white font-jakarta">{plan.name}</h3>
                  <p className="text-xs text-[#A4A4A4] mt-2 leading-relaxed">{plan.description}</p>
                  
                  {/* Price */}
                  <div className="mt-6 flex items-baseline">
                    <span className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-white">${price}</span>
                    <span className="text-xs text-[#A4A4A4] ml-2">/ month</span>
                  </div>

                  {/* Feature checklist */}
                  <ul className="mt-8 space-y-4">
                    {plan.features.map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <Check className="w-4 h-4 text-[#0CCB8E] mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-white/95 leading-normal">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Call to action */}
                <div className="mt-8">
                  <Link
                    href="/register"
                    className={`w-full py-3.5 rounded-xl text-xs font-bold font-jakarta transition-all duration-300 flex items-center justify-center ${plan.highlight ? "bg-[#0CCB8E] text-[#050505] hover:bg-[#14F195] shadow-lg shadow-[#0CCB8E]/10" : "bg-[#050505] border border-white/10 hover:bg-white/5 text-white"}`}
                  >
                    {plan.cta}
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Star, Quote } from "lucide-react";

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);

  const reviews = [
    {
      quote: "IslamInvest IQ represents a major leap in Islamic wealth management. The accuracy of their cash-cleansing ledger is remarkable, ensuring compliance without compromising on portfolio yield returns.",
      name: "Dr. Tariq Al-Mansoor",
      role: "Chairman, Shariah Council Board",
      tag: "Academic Advisory",
      stars: 5,
    },
    {
      quote: "Before discovering this platform, tracking dividend purification for our mutual fund assets was a tedious manual process. IslamInvest IQ has fully automated this pipeline, saving our team hundreds of hours quarterly.",
      name: "Sophia Ibrahim",
      role: "Managing Director, Oasis Ethical Capital",
      tag: "Institutional Investor",
      stars: 5,
    },
    {
      quote: "The combination of real-time AI screening and direct scholar fatwas makes this tool an essential asset for my portfolio. I finally feel completely secure in the compliance structure of my digital investments.",
      name: "Farhan Siddiqui",
      role: "Founder, HalalTech Venture Lab",
      tag: "Tech Entrepreneur",
      stars: 5,
    },
  ];

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % reviews.length);
  };

  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
  };

  return (
    <section id="testimonials" className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="max-w-3xl mb-20 space-y-6">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            User Success
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight font-jakarta">
            Endorsed by Scholars, <br />
            Built for Global Capital
          </h2>
        </div>

        {/* Carousel Card */}
        <div className="relative max-w-4xl mx-auto">
          <div className="bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative">
            <Quote className="absolute top-8 right-8 w-16 h-16 text-white/5 pointer-events-none" />

            <div className="space-y-8">
              {/* Badge & Stars */}
              <div className="flex justify-between items-center">
                <span className="text-xs font-semibold text-[#0CCB8E] bg-[#0CCB8E]/10 px-3 py-1 rounded-full">
                  {reviews[activeIndex].tag}
                </span>
                <div className="flex gap-1">
                  {[...Array(reviews[activeIndex].stars)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-[#14F195] text-[#14F195]" />
                  ))}
                </div>
              </div>

              {/* Quote text */}
              <p className="text-xl md:text-2xl text-white/90 font-sans font-light leading-relaxed">
                &ldquo;{reviews[activeIndex].quote}&rdquo;
              </p>

              {/* Profile details */}
              <div className="flex justify-between items-end pt-4 border-t border-white/5">
                <div>
                  <h4 className="text-lg font-bold text-white font-jakarta">{reviews[activeIndex].name}</h4>
                  <p className="text-xs text-[#A4A4A4] mt-0.5">{reviews[activeIndex].role}</p>
                </div>

                {/* Slider Nav Controls */}
                <div className="flex gap-2">
                  <button 
                    onClick={handlePrev}
                    className="w-10 h-10 rounded-lg bg-[#050505] border border-white/5 hover:border-white/10 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={handleNext}
                    className="w-10 h-10 rounded-lg bg-[#050505] border border-white/5 hover:border-white/10 text-white flex items-center justify-center transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

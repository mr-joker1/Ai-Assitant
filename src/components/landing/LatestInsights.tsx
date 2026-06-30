"use client";

import { ArrowUpRight, BookOpen, Clock } from "lucide-react";
import Link from "next/link";

export default function LatestInsights() {
  const posts = [
    {
      title: "Understanding Shariah Criteria in Digital Assets and Liquidity Pools",
      excerpt: "An in-depth review of AAOIFI guidelines regarding smart contracts, automated market makers (AMMs), and token staking consensus.",
      category: "DeFi Research",
      readTime: "8 min read",
      date: "June 25, 2026",
    },
    {
      title: "How High Interest Rates Impact Equity Purification Calculations",
      excerpt: "An analysis of interest-based cash pools in global equities and calculations of quarterly purification obligations under high yield conditions.",
      category: "Juristic Math",
      readTime: "5 min read",
      date: "June 18, 2026",
    },
    {
      title: "Deploying AI Scrapers for Real-Time Balance Sheet Audits",
      excerpt: "Tracing our technology pipeline: how AI agents scrape SEC filings and financial footnotes to detect non-compliant corporate shifts.",
      category: "AI Technology",
      readTime: "6 min read",
      date: "June 12, 2026",
    },
  ];

  return (
    <section id="insights" className="py-24 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-6">
          <div className="space-y-4">
            <span className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">Intellectual Capital</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white font-jakarta tracking-tight">Latest Insights & Reports</h2>
          </div>
          
          <button className="text-xs font-bold text-[#0CCB8E] hover:text-white transition-colors flex items-center gap-1">
            <span>Access Learning Academy</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Blog Post Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post, idx) => (
            <div 
              key={idx}
              className="bg-[#111111] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between hover:border-white/10 transition-all duration-300 group cursor-pointer"
            >
              <div className="space-y-4">
                {/* Meta row */}
                <div className="flex justify-between items-center text-[10px] text-[#A4A4A4]">
                  <span className="font-semibold text-[#0CCB8E] uppercase tracking-wider">{post.category}</span>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5" />
                    <span>{post.readTime}</span>
                  </div>
                </div>

                {/* Title */}
                <h3 className="text-lg font-bold text-white group-hover:text-[#0CCB8E] transition-colors duration-300 font-jakarta line-clamp-2">
                  {post.title}
                </h3>

                {/* Excerpt */}
                <p className="text-xs text-[#A4A4A4] leading-relaxed font-light line-clamp-3">
                  {post.excerpt}
                </p>
              </div>

              {/* Date & Trigger */}
              <div className="pt-6 mt-6 border-t border-white/5 flex justify-between items-center text-xs">
                <span className="text-[#A4A4A4] font-mono">{post.date}</span>
                <span className="font-semibold text-white flex items-center gap-1 group-hover:text-[#0CCB8E] transition-colors">
                  Read Article <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

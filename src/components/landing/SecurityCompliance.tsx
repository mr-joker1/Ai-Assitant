"use client";

import { ShieldCheck, Lock, Eye, CheckCircle, Award } from "lucide-react";

export default function SecurityCompliance() {
  const vectors = [
    {
      title: "Bank-Grade Encryption",
      desc: "All portfolio connections, API keys, and personal financial data are secured under AES-256 GCM encryption, ensuring absolute client privacy.",
      icon: Lock,
    },
    {
      title: "Consensus Verification",
      desc: "Our financial screener algorithms are fully validated under AAOIFI, DFM, and Dow Jones metrics, with quarterly juristic signature approvals.",
      icon: Award,
    },
    {
      title: "AI Model Transparency",
      desc: "No black-box decisions. Our AI Advisor references raw corporate filing segments and PDFs, allowing you to trace each Shariah compliance audit verdict.",
      icon: Eye,
    },
    {
      title: "Immutable Audits",
      desc: "Compliance checks are compiled in tamper-proof files, generating cryptographic verification hashes representing corporate record-keeping trust.",
      icon: ShieldCheck,
    },
  ];

  return (
    <section className="py-24 bg-[#050505] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-20 space-y-4">
          <div className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">
            Institutional Trust
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold font-jakarta">
            Uncompromising Security & Compliance
          </h2>
          <p className="text-[#A4A4A4] text-sm md:text-base font-light">
            We adhere to strict global security regulations and authentic Islamic financial standards.
          </p>
        </div>

        {/* Vectors Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {vectors.map((v, idx) => {
            const Icon = v.icon;
            
            return (
              <div 
                key={idx}
                className="bg-[#111111] border border-white/5 rounded-[24px] p-6 flex flex-col justify-between glow-hover group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center text-[#0CCB8E] group-hover:scale-110 transition-transform">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-white font-jakarta">{v.title}</h3>
                  <p className="text-xs text-[#A4A4A4] leading-relaxed font-light">{v.desc}</p>
                </div>

                <div className="pt-6 mt-6 border-t border-white/5 flex items-center gap-2 text-[10px] text-[#0CCB8E] font-semibold">
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Verified Standard</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Certifications row */}
        <div className="mt-16 bg-[#0B0F0D] border border-white/5 rounded-[24px] p-8 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h4 className="text-base font-bold text-white font-jakarta">Looking for consensus audits?</h4>
            <p className="text-xs text-[#A4A4A4] mt-1 font-light">Download our latest Shariah Advisory certificate signed off by Dr. Tariq Al-Mansoor.</p>
          </div>
          
          <button className="bg-white/5 border border-white/10 text-white font-semibold text-xs px-6 py-3 rounded-xl hover:bg-white/10 transition-colors">
            Download Certificate (PDF)
          </button>
        </div>

      </div>
    </section>
  );
}

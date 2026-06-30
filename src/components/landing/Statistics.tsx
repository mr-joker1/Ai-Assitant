"use client";

import { useEffect, useState } from "react";
import { CheckCircle, Globe, Cpu, Database, Activity } from "lucide-react";

export default function Statistics() {
  const [companies, setCompanies] = useState(0);
  const [cryptos, setCryptos] = useState(0);
  const [accuracy, setAccuracy] = useState(0);
  const [countries, setCountries] = useState(0);

  useEffect(() => {
    // Simple duration counters
    const interval = setInterval(() => {
      setCompanies(prev => (prev < 10000 ? prev + 250 : 10000));
      setCryptos(prev => (prev < 500 ? prev + 15 : 500));
      setAccuracy(prev => (prev < 98 ? prev + 2 : 98));
      setCountries(prev => (prev < 120 ? prev + 4 : 120));
    }, 30);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 text-center md:text-left">
          
          {/* Stat 1 */}
          <div className="space-y-2">
            <div className="flex justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E] mb-2">
                <Database className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-white">
              {companies.toLocaleString()}+
            </div>
            <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">
              Companies Screened
            </div>
          </div>

          {/* Stat 2 */}
          <div className="space-y-2">
            <div className="flex justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E] mb-2">
                <Activity className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-[#14F195]">
              {cryptos}+
            </div>
            <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">
              Crypto Assets Audited
            </div>
          </div>

          {/* Stat 3 */}
          <div className="space-y-2">
            <div className="flex justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E] mb-2">
                <CheckCircle className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-white">
              {accuracy}%
            </div>
            <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">
              Accuracy Rating
            </div>
          </div>

          {/* Stat 4 */}
          <div className="space-y-2">
            <div className="flex justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E] mb-2">
                <Cpu className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-white">
              24/7
            </div>
            <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">
              AI Research Scans
            </div>
          </div>

          {/* Stat 5 */}
          <div className="space-y-2">
            <div className="flex justify-center md:justify-start">
              <div className="w-8 h-8 rounded-lg bg-[#0CCB8E]/10 flex items-center justify-center text-[#0CCB8E] mb-2">
                <Globe className="w-4 h-4" />
              </div>
            </div>
            <div className="text-4xl md:text-5xl font-extrabold font-grotesk tracking-tight text-white">
              {countries}+
            </div>
            <div className="text-xs text-[#A4A4A4] uppercase tracking-wider font-semibold">
              Countries Active
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

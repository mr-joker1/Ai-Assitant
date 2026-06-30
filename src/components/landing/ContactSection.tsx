"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, Globe } from "lucide-react";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setEmail("");
      setName("");
      setMessage("");
    }, 3000);
  };

  return (
    <section id="contact" className="py-24 bg-[#0B0F0D] border-y border-white/5 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
          
          {/* Left panel: Form */}
          <div className="lg:col-span-7 bg-[#111111] border border-white/5 rounded-[32px] p-8 md:p-12">
            <span className="text-xs font-bold text-[#0CCB8E] tracking-widest uppercase font-grotesk">Inquiries</span>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white mt-3 mb-8 font-jakarta tracking-tight">Connect With Our Team</h2>

            {submitted ? (
              <div className="bg-[#050505] border border-[#0CCB8E]/30 p-6 rounded-2xl text-center space-y-3">
                <span className="text-xs text-[#0CCB8E] font-bold uppercase tracking-widest">Message Dispatched</span>
                <p className="text-sm text-white">Thank you. An advisory officer will contact you shortly.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#050505] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#0CCB8E]/30"
                      placeholder="e.g. Tariq Ahmad"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Email Address</label>
                    <input 
                      type="email" 
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-[#050505] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#0CCB8E]/30"
                      placeholder="tariq@company.com"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] text-[#A4A4A4] uppercase tracking-wider font-semibold">Message</label>
                  <textarea 
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full bg-[#050505] border border-white/5 rounded-xl py-3.5 px-4 text-xs text-white focus:outline-none focus:border-[#0CCB8E]/30 resize-none"
                    placeholder="Brief details about your portfolio audit inquiries..."
                  />
                </div>

                <button 
                  type="submit"
                  className="w-full bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] font-bold py-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 scale-100 hover:scale-[1.02] shadow-lg shadow-[#0CCB8E]/20 text-xs uppercase tracking-wider"
                >
                  Transmit Message <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>

          {/* Right panel: Coordinates, Hours, Map Mock */}
          <div className="lg:col-span-5 space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-white font-jakarta">Headquarters</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0CCB8E] flex-shrink-0">
                    <MapPin className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-jakarta">DIFC Towers</h4>
                    <p className="text-xs text-[#A4A4A4] mt-0.5 font-light">Level 18, Tower 2, Dubai, UAE</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0CCB8E] flex-shrink-0">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-jakarta">Electronic Mail</h4>
                    <p className="text-xs text-[#A4A4A4] mt-0.5 font-light">advisory@islaminvest.iq</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#0CCB8E] flex-shrink-0">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white font-jakarta">Advisory Hours</h4>
                    <p className="text-xs text-[#A4A4A4] mt-0.5 font-light">Mon - Fri: 9:00 AM - 6:00 PM (GST)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Geographical Map Vector Mockup */}
            <div className="bg-[#111111] border border-white/5 rounded-[24px] p-6 h-56 flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-24 h-24 bg-[#0CCB8E]/5 rounded-full filter blur-xl pointer-events-none" />

              <div className="flex justify-between items-center text-xs">
                <span className="text-[#A4A4A4]">Interactive Location</span>
                <span className="text-[10px] text-[#0CCB8E] font-semibold flex items-center gap-1">
                  <Globe className="w-3.5 h-3.5" />
                  <span>DIFC Node Active</span>
                </span>
              </div>

              {/* Styled Mock map grids */}
              <div className="relative w-full h-24 border border-white/5 rounded-xl bg-[#050505] flex items-center justify-center">
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:16px_16px]" />
                
                {/* Visual coordinate node */}
                <div className="w-8 h-8 rounded-full bg-[#0CCB8E]/10 flex items-center justify-center relative">
                  <div className="w-4 h-4 bg-[#0CCB8E] rounded-full animate-ping absolute" />
                  <div className="w-3 h-3 bg-[#0CCB8E] rounded-full z-10" />
                </div>
              </div>

              <span className="text-[9px] text-[#A4A4A4]/40 font-mono text-center">COORD: 25.2048° N, 55.2708° E</span>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

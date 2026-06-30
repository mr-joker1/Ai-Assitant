"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ArrowRight, ShieldCheck } from "lucide-react";
import Hero from "@/components/landing/Hero";
import TrustedBy from "@/components/landing/TrustedBy";
import FeatureEditorial from "@/components/landing/FeatureEditorial";
import InteractiveShowcase from "@/components/landing/InteractiveShowcase";
import WhyIslamInvest from "@/components/landing/WhyIslamInvest";
import InvestmentWorkflow from "@/components/landing/InvestmentWorkflow";
import ProductEcosystem from "@/components/landing/ProductEcosystem";
import Statistics from "@/components/landing/Statistics";
import Testimonials from "@/components/landing/Testimonials";
import Pricing from "@/components/landing/Pricing";
import FAQ from "@/components/landing/FAQ";
import AboutUs from "@/components/landing/AboutUs";
import SecurityCompliance from "@/components/landing/SecurityCompliance";
import LatestInsights from "@/components/landing/LatestInsights";
import CTABanner from "@/components/landing/CTABanner";
import ContactSection from "@/components/landing/ContactSection";
import Footer from "@/components/landing/Footer";

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Features", href: "#features" },
    { label: "Showcase", href: "#showcase" },
    { label: "Ecosystem", href: "#ecosystem" },
    { label: "Pricing", href: "#pricing" },
    { label: "About", href: "#about" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <div className="min-h-screen bg-[#050505] text-white selection:bg-[#0CCB8E]/30 selection:text-white flex flex-col justify-between overflow-x-hidden">
      
      {/* Premium Header / Navbar */}
      <header className="border-b border-white/5 bg-[#050505]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo Mark */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#0CCB8E] flex items-center justify-center text-[#050505] font-extrabold text-xl font-jakarta shadow-lg shadow-[#0CCB8E]/20">
              I
            </div>
            <span className="font-extrabold text-lg tracking-tight font-jakarta text-white">
              IslamInvest <span className="text-[#0CCB8E] text-xs font-semibold px-2 py-0.5 rounded-md border border-[#0CCB8E]/20 bg-[#0B0F0D] ml-1">IQ</span>
            </span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.href}
                className="text-xs font-semibold uppercase tracking-wider text-[#A4A4A4] hover:text-white hover:text-[#0CCB8E] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop CTA actions */}
          <div className="hidden md:flex items-center gap-5">
            <Link
              href="/login"
              className="text-xs font-bold uppercase tracking-wider text-[#A4A4A4] hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] text-xs font-bold uppercase tracking-widest px-5 py-3 rounded-xl transition-all scale-100 hover:scale-[1.03] shadow-lg shadow-[#0CCB8E]/25"
            >
              Get Started
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden w-10 h-10 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-white"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-[#050505] border-b border-white/5 py-6 px-6 space-y-4">
            <nav className="flex flex-col gap-4">
              {navLinks.map((link, idx) => (
                <a
                  key={idx}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="text-sm font-semibold text-[#A4A4A4] hover:text-white transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>
            <div className="pt-4 border-t border-white/5 flex flex-col gap-3">
              <Link
                href="/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 rounded-xl text-sm font-semibold text-[#A4A4A4] hover:text-white"
              >
                Sign In
              </Link>
              <Link
                href="/register"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center py-3 bg-[#0CCB8E] hover:bg-[#14F195] text-[#050505] text-sm font-bold rounded-xl"
              >
                Get Started
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main page composition */}
      <main className="flex-grow">
        <Hero />
        <TrustedBy />
        <FeatureEditorial />
        <InteractiveShowcase />
        <WhyIslamInvest />
        <InvestmentWorkflow />
        <ProductEcosystem />
        <Statistics />
        <Testimonials />
        <Pricing />
        <FAQ />
        <AboutUs />
        <SecurityCompliance />
        <LatestInsights />
        <CTABanner />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

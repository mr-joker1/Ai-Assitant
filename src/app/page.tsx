import Link from "next/link";
import { ArrowRight, ShieldCheck, PieChart, MessageSquare, HeartHandshake, Calculator, ShieldAlert, Cpu } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-primary selection:text-primary-foreground flex flex-col justify-between overflow-x-hidden">
      {/* Header / Navbar */}
      <header className="border-b border-zinc-800 bg-black/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-extrabold text-xl">
              I
            </div>
            <span className="font-semibold text-lg tracking-tight">
              IslamInvest <span className="text-emerald-500 text-xs font-normal">IQ</span>
            </span>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-zinc-400 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold px-4 py-2 rounded-xl transition-all shadow-lg shadow-emerald-900/30"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-6 py-20 md:py-32 relative">
        {/* Subtle Background Glow */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(16,185,129,0.08)_0%,transparent_60%)] pointer-events-none" />

        <div className="max-w-4xl mx-auto space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-emerald-400 text-xs font-semibold tracking-wider uppercase mb-2">
            <ShieldCheck className="w-3.5 h-3.5" /> Shariah-Compliant Investment Intelligence
          </div>

          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight leading-tight">
            The Ethical Investment Platform for <span className="text-emerald-500">Halal Wealth</span>
          </h1>

          <p className="text-zinc-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
            Combine premium financial screening, automated zakat calculation, Shariah purification, and AI-powered advisory built on strict juristic criteria.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link
              href="/register"
              className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-500 text-white font-semibold px-8 py-4 rounded-xl flex items-center justify-center gap-2 transition-all text-base shadow-xl shadow-emerald-900/30"
            >
              Launch Dashboard <ArrowRight className="w-5 h-5" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto border border-zinc-800 bg-zinc-950/50 hover:bg-zinc-900 text-zinc-300 font-semibold px-8 py-4 rounded-xl transition-all text-base"
            >
              Access Account
            </Link>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-24 md:mt-36">
          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Cpu className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Stock & Crypto Screener</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Verify compliance under AAOIFI, Dow Jones, and S&P methodology checkmarks.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <PieChart className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Portfolio Compliance</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scan full portfolios to identify non-compliant weights and impure income distributions.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <Calculator className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">Zakat & Purification</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Execute precise purification ledgers and calculate total Zakat obligations on asset allocations.
            </p>
          </div>

          <div className="bg-zinc-950 border border-zinc-800 p-6 rounded-2xl text-left space-y-4">
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-white">AI Shariah Advisory</h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consult our advanced RAG advisor validated against the platform&apos;s Shariah rule engine.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-900 bg-zinc-950/40 py-8 text-center text-xs text-zinc-500">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>&copy; {new Date().getFullYear()} IslamInvest IQ. All rights reserved.</p>
          <div className="flex gap-4">
            <span className="hover:text-zinc-300 transition-colors">Juristic Consensus Audits</span>
            <span>&bull;</span>
            <span className="hover:text-zinc-300 transition-colors">Immutable Shariah Ledgers</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

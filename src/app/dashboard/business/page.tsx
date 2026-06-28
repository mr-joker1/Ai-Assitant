"use client";

import { useState } from "react";
import { ShieldCheck, ShieldAlert, RefreshCw, Briefcase, HelpCircle, FileText, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

export default function BusinessAnalyzer() {
  const [name, setName] = useState("");
  const [type, setType] = useState("SOFTWARE");
  const [description, setDescription] = useState("");
  const [loansAmount, setLoansAmount] = useState(0);
  const [investmentsAmount, setInvestmentsAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !description) {
      setError("Please fill out name and description fields.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/business/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, type, description, loansAmount, investmentsAmount }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze business");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Local Business Compliance Auditor</h2>
        <p className="text-muted-foreground text-sm">
          Run custom audits on restaurants, manufacturing factories, agencies, e-commerce stores, and software companies.
        </p>
      </div>

      {/* Inputs Form */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Name</label>
              <input
                type="text"
                placeholder="e.g. Al-Madinah Grill, ByteCode Softwares"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Business Type</label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              >
                <option value="RESTAURANT">Restaurant / Food Service</option>
                <option value="FACTORY">Factory / Manufacturing</option>
                <option value="AGENCY">Agency / Consulting</option>
                <option value="SOFTWARE">Software / SaaS Company</option>
                <option value="SERVICES">General Services</option>
                <option value="SHOP">Retail / Wholesale Shop</option>
                <option value="ECOMMERCE">E-commerce Store</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Conventional Interest-Bearing Loans ($)</label>
              <input
                type="number"
                placeholder="e.g. 50000"
                value={loansAmount}
                onChange={(e) => setLoansAmount(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Conventional Interest Investments ($)</label>
              <input
                type="number"
                placeholder="e.g. 10000"
                value={investmentsAmount}
                onChange={(e) => setInvestmentsAmount(Number(e.target.value))}
                className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Describe Business Activities & Income Streams</label>
            <textarea
              placeholder="Provide a detailed business summary including primary products sold, raw material sourcing, and secondary income generation details..."
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center justify-center gap-2 shadow-sm"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Run Business Audit"}
          </button>
        </form>

        {error && (
          <div className="mt-4 p-4 rounded-xl bg-destructive/10 text-destructive text-sm font-medium">
            {error}
          </div>
        )}
      </div>

      {/* Results output */}
      {result && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
          {/* Main output */}
          <div className="lg:col-span-2 space-y-6">
            <div className={`p-6 rounded-2xl border ${result.business?.complianceStatus ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} flex items-center justify-between shadow-sm`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Audit Verdict</span>
                <h3 className="text-2xl font-bold text-foreground">{result.business?.name}</h3>
                <p className="text-xs text-muted-foreground">Type: {result.business?.type}</p>
              </div>

              <div className="flex gap-2">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm ${
                  result.business?.complianceStatus
                    ? "bg-primary/25 text-primary" 
                    : "bg-destructive/25 text-destructive"
                }`}>
                  {result.business?.complianceStatus ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      HALAL
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      QUESTIONABLE
                    </>
                  )}
                </span>
              </div>
            </div>

            {/* Audit Details */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Briefcase className="w-4 h-4 text-primary" />
                Operational Auditing Report
              </h4>

              <div className="space-y-4">
                <div className="pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground block">Income Sources Evaluation</span>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.audit?.incomeSources}</p>
                </div>

                <div className="pb-3 border-b border-border">
                  <span className="text-xs font-bold text-foreground block">Prohibited Activities Audits</span>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.audit?.prohibitedActivities}</p>
                </div>

                <div>
                  <span className="text-xs font-bold text-foreground block">Suggestions & Restructuring</span>
                  <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{result.audit?.suggestions}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground">Financing Snapshot</h4>
              <div className="space-y-3">
                <div className="flex justify-between items-center text-xs pb-2 border-b border-border">
                  <span className="text-muted-foreground">Conventional Loans</span>
                  <span className="font-semibold text-foreground">${result.business?.loansAmount?.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span className="text-muted-foreground">Interest Investments</span>
                  <span className="font-semibold text-foreground">${result.business?.investmentsAmount?.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

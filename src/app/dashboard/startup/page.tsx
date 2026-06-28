"use client";

import { useState } from "react";
import { 
  Upload, FileText, RefreshCw, ShieldCheck, ShieldAlert, 
  HelpCircle, AlertTriangle, Lightbulb, CheckCircle2 
} from "lucide-react";
import { motion } from "framer-motion";

export default function StartupAnalyzer() {
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<any>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file && !description) {
      setError("Please upload a pitch deck file or enter a business description.");
      return;
    }

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      if (file) formData.append("file", file);
      formData.append("name", name);
      formData.append("website", website);
      formData.append("description", description);

      const res = await fetch("/api/startup/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to analyze pitch deck");
      }

      setResult(data);
    } catch (err: any) {
      setError(err.message || "An error occurred during pitch deck analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Startup Pitch Deck Analyzer</h2>
        <p className="text-muted-foreground text-sm">
          Upload venture pitch decks or business plans to evaluate financing agreements, revenue streams, and contract compliance.
        </p>
      </div>

      {/* Upload area */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm">
        <form onSubmit={handleUpload} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Startup Name</label>
                <input
                  type="text"
                  placeholder="e.g. HalalPay, CleanTech Inc."
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Website URL (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. https://my-startup.com"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                />
              </div>
            </div>

            {/* Pitch Deck File Drag Area */}
            <div className="flex flex-col justify-center items-center border-2 border-dashed border-border rounded-2xl p-6 hover:bg-secondary/40 transition-all cursor-pointer relative">
              <input
                type="file"
                accept=".pdf,.docx,.txt"
                onChange={handleFileChange}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <Upload className="w-8 h-8 text-primary mb-2" />
              <span className="text-sm font-semibold text-foreground">
                {file ? file.name : "Upload Pitch Deck File (PDF, DOCX, TXT)"}
              </span>
              <span className="text-xs text-muted-foreground mt-1">Maximum file size: 10MB</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Manual Business Overview / Description</label>
            <textarea
              placeholder="Paste startup business plan details, terms, funding rounds, or revenue activities here..."
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
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Initiate Audit"}
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
          {/* Main analysis block */}
          <div className="lg:col-span-2 space-y-6">
            {/* Verdict */}
            <div className={`p-6 rounded-2xl border ${result.analysis?.status === "HALAL" ? "bg-primary/5 border-primary/20" : "bg-destructive/5 border-destructive/20"} flex items-center justify-between shadow-sm`}>
              <div className="space-y-1">
                <span className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">Startup Compliance Score</span>
                <h3 className="text-2xl font-bold text-foreground">{result.startup?.name}</h3>
                <p className="text-xs text-muted-foreground">Website: {result.startup?.website || "N/A"}</p>
              </div>

              <div className="flex flex-col items-end gap-1">
                <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full font-bold text-sm ${
                  result.analysis?.status === "HALAL"
                    ? "bg-primary/25 text-primary" 
                    : "bg-destructive/25 text-destructive"
                }`}>
                  {result.analysis?.status === "HALAL" ? (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      HALAL
                    </>
                  ) : (
                    <>
                      <ShieldAlert className="w-4 h-4" />
                      NON-COMPLIANT
                    </>
                  )}
                </span>
                <span className="text-xs text-muted-foreground mt-1">Audit Score: {result.analysis?.complianceScore}%</span>
              </div>
            </div>

            {/* Extracted Sections */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <FileText className="w-4 h-4 text-primary" />
                Venture Audit Details
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-secondary/35 rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground block">Business Activities</span>
                  <p className="text-xs text-muted-foreground mt-1">{result.analysis?.businessActivities}</p>
                </div>

                <div className="p-4 bg-secondary/35 rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground block">Revenue Model</span>
                  <p className="text-xs text-muted-foreground mt-1">{result.analysis?.revenueModel}</p>
                </div>

                <div className="p-4 bg-secondary/35 rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground block">Conventional Debt / Loans</span>
                  <p className="text-xs text-muted-foreground mt-1">{result.analysis?.loans}</p>
                </div>

                <div className="p-4 bg-secondary/35 rounded-xl border border-border">
                  <span className="text-xs font-bold text-foreground block">Funding & Equity Structure</span>
                  <p className="text-xs text-muted-foreground mt-1">{result.analysis?.funding}</p>
                </div>
              </div>
            </div>

            {/* suggestions */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-3">
              <h4 className="font-semibold text-foreground flex items-center gap-2">
                <Lightbulb className="w-4 h-4 text-accent" />
                Shariah restructuring suggestions
              </h4>
              <p className="text-xs leading-relaxed text-muted-foreground">{result.analysis?.suggestions}</p>
            </div>
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {/* Audit evidence log */}
            <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
              <h4 className="font-semibold text-foreground">Shariah Evidence Findings</h4>
              <div className="space-y-3">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">{result.analysis?.evidence || "No severe interest debt found."}</p>
                </div>
                <div className="flex items-start gap-2.5">
                  <AlertTriangle className="w-4 h-4 text-accent mt-0.5 flex-shrink-0" />
                  <p className="text-xs text-muted-foreground leading-relaxed">Ensure any SAFEs or convertible notes exclude premium interest conversions.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

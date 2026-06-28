"use client";

import { useEffect, useState } from "react";
import { HeartHandshake, Plus, Check, RefreshCw, AlertCircle, Compass, HelpCircle } from "lucide-react";
import { motion } from "framer-motion";

interface RecordItem {
  id: string;
  source: string;
  type: string;
  amount: number;
  status: "PENDING" | "PURIFIED";
  donationRecipient?: string;
  createdAt: string;
}

export default function PurificationLedger() {
  const [records, setRecords] = useState<RecordItem[]>([]);
  const [source, setSource] = useState("");
  const [type, setType] = useState("DIVIDEND");
  const [amount, setAmount] = useState(0);
  const [recipient, setRecipient] = useState("");

  const [loading, setLoading] = useState(false);
  const [adding, setAdding] = useState(false);
  const [purifyingId, setPurifyingId] = useState<string | null>(null);
  
  const [totals, setTotals] = useState({ purified: 0, pending: 0 });

  const fetchRecords = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/purification");
      if (res.ok) {
        const data = await res.json();
        setRecords(data.records || []);
        setTotals({ purified: data.totalPurified || 0, pending: data.totalPending || 0 });
      }
    } catch (err) {
      console.error("Failed to load records", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!source || amount <= 0) return;

    setAdding(true);
    try {
      const res = await fetch("/api/purification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source, type, amount }),
      });

      if (res.ok) {
        setSource("");
        setAmount(0);
        fetchRecords();
      }
    } catch (err) {
      console.error("Failed to add purification record", err);
    } finally {
      setAdding(false);
    }
  };

  const handlePurify = async (id: string) => {
    if (!recipient) {
      alert("Please specify a donation recipient organization.");
      return;
    }

    setPurifyingId(id);
    try {
      const res = await fetch("/api/purification", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, status: "PURIFIED", donationRecipient: recipient }),
      });

      if (res.ok) {
        setRecipient("");
        setPurifyingId(null);
        fetchRecords();
      }
    } catch (err) {
      console.error("Failed to complete purification", err);
    } finally {
      setPurifyingId(null);
    }
  };

  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Income Purification Ledger</h2>
        <p className="text-muted-foreground text-sm">
          Track impure dividend portions or conventional interest accrued, and log donation distributions.
        </p>
      </div>

      {/* Stats header */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Pending Purification</p>
            <h3 className="text-3xl font-extrabold text-destructive mt-1">${totals.pending.toFixed(2)}</h3>
          </div>
          <AlertCircle className="w-8 h-8 text-destructive/40" />
        </div>

        <div className="bg-card p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs text-muted-foreground font-semibold uppercase">Purified & Donated</p>
            <h3 className="text-3xl font-extrabold text-primary mt-1">${totals.purified.toFixed(2)}</h3>
          </div>
          <HeartHandshake className="w-8 h-8 text-primary/40" />
        </div>
      </div>

      {/* Input panel split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Add Record panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h4 className="font-semibold text-foreground">Log Impure Income</h4>

            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Source / Asset</label>
                <input
                  type="text"
                  placeholder="e.g. Apple Dividend, Bank Cash Interest"
                  value={source}
                  onChange={(e) => setSource(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Amount ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-muted-foreground uppercase mb-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full bg-secondary/50 border border-border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                  >
                    <option value="DIVIDEND">Dividend Portion</option>
                    <option value="INTEREST">Conventional Interest</option>
                    <option value="OTHER">Other Impure</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                disabled={adding}
                className="w-full bg-primary text-primary-foreground font-semibold py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 transition-all shadow-sm"
              >
                {adding ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : "Log Entry"}
              </button>
            </form>
          </div>
        </div>

        {/* Records list */}
        <div className="lg:col-span-2 bg-card p-6 rounded-2xl border border-border shadow-sm space-y-4">
          <h4 className="font-semibold text-foreground">Purification Registry Log</h4>
          
          {loading ? (
            <div className="text-center py-8 text-muted-foreground">Loading registry...</div>
          ) : records.length === 0 ? (
            <p className="text-xs text-muted-foreground py-8 text-center">No impure income records logged. Your income is currently 100% clean.</p>
          ) : (
            <div className="divide-y divide-border">
              {records.map((r) => (
                <div key={r.id} className="py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-foreground">{r.source}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary font-semibold text-muted-foreground uppercase">{r.type}</span>
                    </div>
                    <span className="text-xs text-muted-foreground mt-0.5 block">Logged on {new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-foreground">${r.amount.toFixed(2)}</span>
                    
                    {r.status === "PURIFIED" ? (
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-semibold bg-primary/20 text-primary">
                        <Check className="w-3.5 h-3.5" />
                        Purified
                      </span>
                    ) : (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          placeholder="Charity Organization Name..."
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          className="bg-secondary/50 border border-border rounded-xl px-3 py-1.5 text-xs text-foreground focus:outline-none"
                        />
                        <button
                          onClick={() => handlePurify(r.id)}
                          disabled={purifyingId === r.id}
                          className="bg-primary text-primary-foreground font-semibold px-3 py-1.5 rounded-xl text-xs hover:opacity-90 transition-all flex items-center gap-1"
                        >
                          Purify
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

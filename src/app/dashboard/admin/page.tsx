"use client";

import { useEffect, useState } from "react";
import {
  Shield, Users, Building2, Coins, BookOpen, ClipboardList,
  Settings, RefreshCw, Check, X, AlertTriangle
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface Stats {
  userCount: number;
  companyCount: number;
  cryptoCount: number;
  fatwaCount: number;
  scholarCount: number;
  auditCount: number;
}

interface User {
  id: string;
  name?: string;
  email?: string;
  role: string;
  createdAt: string;
}

interface Threshold {
  id: string;
  name: string;
  value: number;
  description?: string;
}

interface AuditLog {
  id: string;
  userEmail?: string;
  action: string;
  details?: string;
  ipAddress?: string;
  createdAt: string;
}

type TabType = "overview" | "users" | "thresholds" | "audit";

export default function AdminPanel() {
  const [tab, setTab] = useState<TabType>("overview");
  const [stats, setStats] = useState<Stats | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [editThreshold, setEditThreshold] = useState<Threshold | null>(null);
  const [savingThreshold, setSavingThreshold] = useState(false);
  const [error, setError] = useState("");

  const fetchData = async (t: TabType) => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin?action=${t}`, { cache: "no-store" });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Access denied");
      }
      const data = await res.json();
      if (t === "overview") setStats(data.stats);
      if (t === "users") setUsers(data.users || []);
      if (t === "thresholds") setThresholds(data.thresholds || []);
      if (t === "audit") setAuditLogs(data.logs || []);
    } catch (err: any) {
      setError(err.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(tab); }, [tab]);

  const updateUserRole = async (userId: string, role: "USER" | "ADMIN") => {
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "update_user_role", data: { userId, role } }),
      });
      if (res.ok) fetchData("users");
    } catch (err) {}
  };

  const saveThreshold = async () => {
    if (!editThreshold) return;
    setSavingThreshold(true);
    try {
      const res = await fetch("/api/admin", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "update_threshold",
          data: { name: editThreshold.name, value: editThreshold.value, description: editThreshold.description },
        }),
      });
      if (res.ok) {
        setEditThreshold(null);
        fetchData("thresholds");
      }
    } catch (err) {
    } finally {
      setSavingThreshold(false);
    }
  };

  const TABS: { value: TabType; label: string; icon: any }[] = [
    { value: "overview", label: "Overview", icon: Shield },
    { value: "users", label: "Users", icon: Users },
    { value: "thresholds", label: "Screening Thresholds", icon: Settings },
    { value: "audit", label: "Audit Logs", icon: ClipboardList },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
          <Shield className="w-6 h-6 text-primary" /> Admin Control Panel
        </h2>
        <p className="text-muted-foreground text-sm">
          Manage platform users, screening thresholds, and audit activity.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-xl bg-destructive/10 text-destructive text-sm flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 flex-shrink-0" />
          {error}
        </div>
      )}

      {/* Tab Nav */}
      <div className="flex gap-2 border-b border-border pb-0">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 -mb-px transition-all",
                tab === t.value
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {t.label}
            </button>
          );
        })}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading...
        </div>
      ) : (
        <>
          {/* Overview */}
          {tab === "overview" && stats && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-5">
              {[
                { label: "Total Users", value: stats.userCount, icon: Users, color: "text-primary" },
                { label: "Screened Companies", value: stats.companyCount, icon: Building2, color: "text-accent" },
                { label: "Crypto Tokens", value: stats.cryptoCount, icon: Coins, color: "text-primary" },
                { label: "Fatwas Indexed", value: stats.fatwaCount, icon: BookOpen, color: "text-accent" },
                { label: "Scholar Profiles", value: stats.scholarCount, icon: Users, color: "text-primary" },
                { label: "Audit Events", value: stats.auditCount, icon: ClipboardList, color: "text-muted-foreground" },
              ].map((stat) => {
                const Icon = stat.icon;
                return (
                  <div key={stat.label} className="bg-card p-6 rounded-2xl border border-border shadow-sm">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">{stat.label}</span>
                      <Icon className={cn("w-4 h-4", stat.color)} />
                    </div>
                    <p className="text-3xl font-extrabold text-foreground">{stat.value.toLocaleString()}</p>
                  </div>
                );
              })}
            </div>
          )}

          {/* Users */}
          {tab === "users" && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <table className="w-full text-sm">
                <thead className="border-b border-border">
                  <tr className="text-xs text-muted-foreground uppercase font-bold">
                    <th className="text-left px-5 py-3">Name</th>
                    <th className="text-left px-5 py-3">Email</th>
                    <th className="text-left px-5 py-3">Role</th>
                    <th className="text-left px-5 py-3">Joined</th>
                    <th className="text-right px-5 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {users.map((u) => (
                    <tr key={u.id} className="hover:bg-secondary/20">
                      <td className="px-5 py-3.5 font-medium text-foreground">{u.name || "—"}</td>
                      <td className="px-5 py-3.5 text-muted-foreground">{u.email}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn("text-[10px] font-bold px-2 py-0.5 rounded-full",
                          u.role === "ADMIN" ? "bg-primary/10 text-primary" : "bg-secondary text-muted-foreground"
                        )}>
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-muted-foreground text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                      <td className="px-5 py-3.5 text-right">
                        {u.role === "USER" ? (
                          <button
                            onClick={() => updateUserRole(u.id, "ADMIN")}
                            className="text-xs font-semibold text-primary hover:underline"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => updateUserRole(u.id, "USER")}
                            className="text-xs font-semibold text-muted-foreground hover:text-destructive hover:underline"
                          >
                            Revoke Admin
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Thresholds */}
          {tab === "thresholds" && (
            <div className="space-y-4">
              <p className="text-xs text-muted-foreground">
                These values control the financial screening ratios used in the Rule Engine. Changes apply immediately to new screenings.
              </p>
              {thresholds.length === 0 && (
                <div className="text-center py-12 bg-card rounded-2xl border border-border">
                  <p className="text-muted-foreground text-sm">No custom thresholds set. The engine uses built-in AAOIFI/Dow Jones defaults.</p>
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {thresholds.map((t) => (
                  <div key={t.id} className="bg-card p-5 rounded-xl border border-border space-y-3">
                    {editThreshold?.id === t.id ? (
                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase">Name</label>
                          <p className="text-sm font-semibold text-foreground mt-1">{t.name}</p>
                        </div>
                        <div>
                          <label className="text-xs font-bold text-muted-foreground uppercase">Value (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editThreshold.value}
                            onChange={(e) => setEditThreshold({ ...editThreshold, value: Number(e.target.value) })}
                            className="w-full bg-secondary/50 border border-border rounded-lg px-3 py-2 text-sm mt-1 focus:outline-none focus:ring-1 focus:ring-primary text-foreground"
                          />
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={saveThreshold}
                            disabled={savingThreshold}
                            className="flex-1 bg-primary text-primary-foreground text-xs font-semibold py-2 rounded-lg hover:opacity-90 flex items-center justify-center gap-1"
                          >
                            {savingThreshold ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Check className="w-3 h-3" />}
                            Save
                          </button>
                          <button onClick={() => setEditThreshold(null)} className="px-3 py-2 rounded-lg bg-secondary text-muted-foreground text-xs hover:bg-muted">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground text-sm">{t.name}</p>
                            {t.description && <p className="text-xs text-muted-foreground mt-0.5">{t.description}</p>}
                          </div>
                          <span className="text-2xl font-black text-foreground">{t.value}%</span>
                        </div>
                        <button onClick={() => setEditThreshold(t)} className="text-xs font-semibold text-primary hover:underline">
                          Edit Threshold
                        </button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Audit Logs */}
          {tab === "audit" && (
            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr className="text-xs text-muted-foreground uppercase font-bold">
                      <th className="text-left px-5 py-3">Action</th>
                      <th className="text-left px-5 py-3">User</th>
                      <th className="text-left px-5 py-3">Details</th>
                      <th className="text-left px-5 py-3">Timestamp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {auditLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-secondary/20">
                        <td className="px-5 py-3 font-mono text-xs text-primary">{log.action}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground">{log.userEmail || "System"}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground max-w-xs truncate">{log.details || "—"}</td>
                        <td className="px-5 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

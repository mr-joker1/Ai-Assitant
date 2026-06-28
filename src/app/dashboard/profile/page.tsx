"use client";

import { useEffect, useState } from "react";
import {
  User, Mail, Lock, Award, BookOpen, TrendingUp, Calculator,
  RefreshCw, Check, AlertCircle, Camera
} from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ProfileData {
  user: {
    id: string;
    name?: string;
    email?: string;
    image?: string;
    role: string;
    createdAt: string;
    progress: { xpEarned: number }[];
    zakatCalculations: { date: string; totalZakat: number; nisabCurrency: string }[];
    portfolios: { name: string }[];
  };
  totalXP: number;
  level: number;
}

export default function ProfileSettings() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [name, setName] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    fetch("/api/profile")
      .then((r) => r.json())
      .then((data) => {
        setProfile(data);
        setName(data.user?.name || "");
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const saveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    setSaving(true);
    try {
      const body: any = { name };
      if (newPassword && currentPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Update failed");

      setSuccess("Profile updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-muted-foreground">
        <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading profile...
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">Profile & Settings</h2>
        <p className="text-muted-foreground text-sm">Manage your account information and security settings.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left - Profile Summary */}
        <div className="space-y-5">
          {/* Avatar Card */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-6 text-center space-y-4">
            <div className="relative mx-auto w-20 h-20">
              {profile?.user.image ? (
                <img
                  src={profile.user.image}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover border-2 border-border"
                />
              ) : (
                <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center text-3xl font-bold text-primary">
                  {profile?.user.name?.[0] || profile?.user.email?.[0] || "U"}
                </div>
              )}
            </div>
            <div>
              <p className="font-bold text-foreground text-lg">{profile?.user.name || "Anonymous"}</p>
              <p className="text-xs text-muted-foreground">{profile?.user.email}</p>
              <span className={cn(
                "text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 inline-block",
                profile?.user.role === "ADMIN"
                  ? "bg-primary/10 text-primary"
                  : "bg-secondary text-muted-foreground"
              )}>
                {profile?.user.role}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Activity</h4>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Award className="w-4 h-4 text-accent" /> Level
                </div>
                <span className="font-bold text-foreground">{profile?.level}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <BookOpen className="w-4 h-4 text-primary" /> Total XP
                </div>
                <span className="font-bold text-foreground">{profile?.totalXP}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <TrendingUp className="w-4 h-4 text-primary" /> Portfolios
                </div>
                <span className="font-bold text-foreground">{profile?.user.portfolios.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calculator className="w-4 h-4 text-accent" /> Zakat Calcs
                </div>
                <span className="font-bold text-foreground">{profile?.user.zakatCalculations.length}</span>
              </div>
            </div>
            <div>
              <p className="text-[10px] text-muted-foreground mb-1.5">XP to next level: {200 - ((profile?.totalXP || 0) % 200)} / 200</p>
              <div className="w-full bg-secondary h-1.5 rounded-full overflow-hidden">
                <motion.div
                  className="bg-primary h-full rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${(((profile?.totalXP || 0) % 200) / 200) * 100}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
            </div>
          </div>

          {/* Recent Zakat */}
          {profile?.user.zakatCalculations.length ? (
            <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
              <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recent Zakat</h4>
              {profile.user.zakatCalculations.slice(0, 3).map((z, i) => (
                <div key={i} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{new Date(z.date).getFullYear()}</span>
                  <span className="font-semibold text-foreground">
                    {z.nisabCurrency} {z.totalZakat.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Right - Edit Form */}
        <div className="lg:col-span-2 space-y-5">
          <form onSubmit={saveProfile} className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6">
            <h3 className="font-bold text-foreground text-base flex items-center gap-2">
              <User className="w-4 h-4 text-primary" /> Personal Information
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Your full name"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  value={profile?.user.email || ""}
                  disabled
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm text-muted-foreground cursor-not-allowed"
                />
                <p className="text-[10px] text-muted-foreground mt-1">Email cannot be changed after registration.</p>
              </div>
            </div>

            <div className="border-t border-border pt-5 space-y-4">
              <h4 className="font-bold text-foreground text-sm flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" /> Change Password
              </h4>
              <div>
                <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Current Password</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  placeholder="Enter current password"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">New Password</label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                    placeholder="Min. 8 characters"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1.5">Confirm</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className={cn(
                      "w-full bg-secondary/50 border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 text-foreground",
                      confirmPassword && newPassword !== confirmPassword
                        ? "border-destructive focus:ring-destructive"
                        : "border-border focus:ring-primary"
                    )}
                    placeholder="Repeat password"
                  />
                </div>
              </div>
            </div>

            {/* Alerts */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-destructive/10 text-destructive rounded-xl text-sm">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                {error}
              </div>
            )}
            {success && (
              <div className="flex items-center gap-2 p-3 bg-primary/10 text-primary rounded-xl text-sm">
                <Check className="w-4 h-4 flex-shrink-0" />
                {success}
              </div>
            )}

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-primary text-primary-foreground font-semibold py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {saving ? (
                <><RefreshCw className="w-4 h-4 animate-spin" /> Saving...</>
              ) : (
                <><Check className="w-4 h-4" /> Save Changes</>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

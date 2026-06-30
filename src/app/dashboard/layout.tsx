"use client";

import { useState, useEffect } from "react";
import Sidebar from "@/components/shared/Sidebar";
import { 
  Menu, X, Bell, Moon, Sun, User, LogOut, Search, ChevronDown, 
  Layers, Briefcase, TrendingUp, Sparkles 
} from "lucide-react";
import Link from "next/link";
import { signOut } from "next-auth/react";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(true); // Default dark mode for premium fintech feel
  const [showWorkspaceMenu, setShowWorkspaceMenu] = useState(false);
  const [selectedWorkspace, setSelectedWorkspace] = useState("Personal Account");

  // Sync theme class
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [darkMode]);

  return (
    <div className={`min-h-screen flex bg-background text-foreground transition-colors duration-300 ${darkMode ? "dark" : ""}`}>
      
      {/* Desktop Sidebar (Floating panel aesthetic) */}
      <div className="hidden lg:block w-72 p-5 flex-shrink-0">
        <Sidebar className="h-full rounded-2xl border border-border glass-panel" />
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden bg-black/60 backdrop-blur-sm">
          <div className="relative flex-grow flex flex-col max-w-xs w-full bg-background border-r border-border p-5">
            <button
              type="button"
              className="absolute top-5 right-5 w-10 h-10 rounded-xl bg-card border border-border flex items-center justify-center text-foreground hover:bg-secondary transition-colors"
              onClick={() => setMobileMenuOpen(false)}
            >
              <X className="w-5 h-5" />
            </button>
            <Sidebar onLinkClick={() => setMobileMenuOpen(false)} className="border-none shadow-none bg-transparent p-0" />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden py-5 pr-5 pl-5 lg:pl-0">
        
        {/* Header (Top Navigation) */}
        <header className="glass-panel border border-border rounded-2xl h-20 flex items-center justify-between px-6 shadow-premium mb-6 transition-all">
          
          <div className="flex items-center gap-4">
            <button
              type="button"
              className="lg:hidden p-2.5 rounded-xl bg-card border border-border hover:bg-secondary text-muted-foreground transition-colors"
              onClick={() => setMobileMenuOpen(true)}
            >
              <Menu className="w-5 h-5" />
            </button>

            {/* Workspace Switcher */}
            <div className="relative">
              <button 
                onClick={() => setShowWorkspaceMenu(!showWorkspaceMenu)}
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-secondary/60 hover:bg-secondary border border-border text-xs font-bold font-jakarta text-foreground transition-all"
              >
                <Layers className="w-3.5 h-3.5 text-primary" />
                <span>{selectedWorkspace}</span>
                <ChevronDown className="w-3 h-3 text-muted-foreground" />
              </button>

              {showWorkspaceMenu && (
                <div className="absolute left-0 mt-2 w-56 rounded-xl bg-card border border-border shadow-2xl p-2 z-50">
                  <button 
                    onClick={() => {
                      setSelectedWorkspace("Personal Account");
                      setShowWorkspaceMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-secondary flex items-center gap-2"
                  >
                    <User className="w-3.5 h-3.5" />
                    Personal Account
                  </button>
                  <button 
                    onClick={() => {
                      setSelectedWorkspace("Oasis Capital LLC");
                      setShowWorkspaceMenu(false);
                    }}
                    className="w-full text-left px-3 py-2.5 rounded-lg text-xs font-semibold hover:bg-secondary flex items-center gap-2"
                  >
                    <Briefcase className="w-3.5 h-3.5 text-primary" />
                    Oasis Capital LLC
                  </button>
                </div>
              )}
            </div>

            {/* Search command bar */}
            <div className="relative hidden md:block w-64 lg:w-80">
              <Search className="absolute left-3.5 top-3 w-4 h-4 text-muted-foreground" />
              <input 
                type="text" 
                className="w-full bg-secondary/40 border border-border rounded-xl py-2 pl-10 pr-12 text-xs text-foreground focus:outline-none focus:border-primary/40"
                placeholder="Search assets, fatwas, calculations..."
              />
              <span className="absolute right-3.5 top-2.5 text-[9px] border border-border bg-card px-1.5 py-0.5 rounded text-muted-foreground font-mono">⌘K</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            
            {/* Live Portfolio Valuation Quick Preview */}
            <div className="hidden sm:flex flex-col items-end border-r border-border pr-4">
              <span className="text-[10px] text-muted-foreground uppercase tracking-widest font-bold">Live Wealth Value</span>
              <span className="text-sm font-extrabold text-primary font-grotesk mt-0.5 flex items-center gap-1">
                <TrendingUp className="w-3.5 h-3.5" /> $148,250.20
              </span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-secondary text-muted-foreground transition-colors"
              aria-label="Toggle theme mode"
              title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
            >
              {darkMode ? <Sun className="w-4.5 h-4.5" /> : <Moon className="w-4.5 h-4.5" />}
            </button>

            {/* Notifications */}
            <Link
              href="/dashboard/notifications"
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-secondary text-muted-foreground relative transition-colors"
            >
              <Bell className="w-4.5 h-4.5" />
              <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-destructive animate-pulse" />
            </Link>

            {/* Logout */}
            <button
              onClick={async () => {
                await signOut({ redirect: false });
                window.location.href = "/login";
              }}
              className="p-2.5 rounded-xl bg-card border border-border hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
              aria-label="Logout"
              title="Logout"
            >
              <LogOut className="w-4.5 h-4.5" />
            </button>
          </div>
        </header>

        {/* Content Viewport */}
        <main className="flex-1 overflow-y-auto pr-1">
          <div className="max-w-7xl mx-auto space-y-6">
            {children}
          </div>
        </main>
      </div>

    </div>
  );
}

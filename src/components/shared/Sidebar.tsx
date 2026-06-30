"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, Coins, Briefcase, FileText, PieChart, 
  Calculator, HeartHandshake, MessageSquare, BookOpen, 
  Users, Settings, Shield, Newspaper, LayoutDashboard, Search, FileCode
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export default function Sidebar({ className, onLinkClick }: SidebarProps) {
  const pathname = usePathname();

  const menuItems = [
    { name: "Overview", href: "/dashboard", icon: LayoutDashboard },
    { name: "AI Search", href: "/dashboard/search", icon: Search },
    { name: "Company Analyzer", href: "/dashboard/company", icon: TrendingUp },
    { name: "Crypto Analyzer", href: "/dashboard/crypto", icon: Coins },
    { name: "ETF Analyzer", href: "/dashboard/etf", icon: Briefcase },
    { name: "Business Analyzer", href: "/dashboard/business", icon: FileCode },
    { name: "Startup Analyzer", href: "/dashboard/startup", icon: FileText },
    { name: "Portfolio Checker", href: "/dashboard/portfolio", icon: PieChart },
    { name: "Zakat Calculator", href: "/dashboard/zakat", icon: Calculator },
    { name: "Purification Ledger", href: "/dashboard/purification", icon: HeartHandshake },
    { name: "AI Advisor", href: "/dashboard/ai-chat", icon: MessageSquare },
    { name: "Fatwa Library", href: "/dashboard/fatwas", icon: BookOpen },
    { name: "Scholar Hub", href: "/dashboard/scholars", icon: Users },
    { name: "Learning Academy", href: "/dashboard/learning", icon: BookOpen },
    { name: "Islamic News", href: "/dashboard/news", icon: Newspaper },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Admin Panel", href: "/dashboard/admin", icon: Shield },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border py-6 px-4 shadow-premium relative z-10", className)}>
      
      {/* Brand Logo */}
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-9 h-9 rounded-xl bg-primary flex items-center justify-center text-primary-foreground font-extrabold text-lg shadow-md shadow-primary/20">
          I
        </div>
        <span className="font-extrabold text-sm tracking-tight text-foreground font-jakarta uppercase">
          IslamInvest <span className="text-primary font-medium text-[10px] border border-primary/20 bg-secondary/80 px-1.5 py-0.5 rounded ml-1">IQ</span>
        </span>
      </div>

      {/* Navigation List */}
      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href + "/"));
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 border border-transparent",
                isActive
                  ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10 font-bold"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-border"
              )}
            >
              <Icon className="w-4 h-4 flex-shrink-0" />
              <span className="truncate">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Profile Section */}
      <div className="pt-4 border-t border-border mt-4">
        <div className="flex items-center gap-3 px-2 bg-secondary/30 p-2.5 rounded-xl border border-border">
          <div className="w-8 h-8 rounded-lg bg-primary text-primary-foreground flex items-center justify-center font-extrabold text-xs">
            UA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-foreground truncate font-jakarta">User Account</p>
            <p className="text-[10px] text-muted-foreground truncate font-mono">investor@islaminvest.com</p>
          </div>
        </div>
      </div>

    </div>
  );
}

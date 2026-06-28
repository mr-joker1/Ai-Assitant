"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  TrendingUp, Coins, Briefcase, FileText, PieChart, 
  Calculator, HeartHandshake, MessageSquare, BookOpen, 
  Users, Settings, Shield, Newspaper, Bell, LayoutDashboard, Search, FileCode
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
    { name: "Startup Analyzer", href: "/dashboard/startup", icon: FileText },
    { name: "Business Analyzer", href: "/dashboard/business", icon: FileCode },
    { name: "Portfolio Checker", href: "/dashboard/portfolio", icon: PieChart },
    { name: "Zakat Calculator", href: "/dashboard/zakat", icon: Calculator },
    { name: "Purification Ledger", href: "/dashboard/purification", icon: HeartHandshake },
    { name: "AI Chat Advisor", href: "/dashboard/ai-chat", icon: MessageSquare },
    { name: "Fatwa Library", href: "/dashboard/fatwas", icon: BookOpen },
    { name: "Scholar Hub", href: "/dashboard/scholars", icon: Users },
    { name: "Learning Academy", href: "/dashboard/learning", icon: BookOpen },
    { name: "Islamic News", href: "/dashboard/news", icon: Newspaper },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Admin Panel", href: "/dashboard/admin", icon: Shield },
  ];

  return (
    <div className={cn("flex flex-col h-full bg-card border-r border-border py-6 px-4 shadow-premium", className)}>
      <div className="flex items-center gap-3 px-3 mb-8">
        <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground font-bold text-lg">
          I
        </div>
        <span className="font-semibold text-lg tracking-tight text-foreground">
          IslamInvest <span className="text-accent text-xs font-normal">IQ</span>
        </span>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto pr-1">
        {menuItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                isActive
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
              )}
            >
              <Icon className="w-4 h-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="pt-4 border-t border-border mt-4">
        <div className="flex items-center gap-3 px-3">
          <div className="w-9 h-9 rounded-full bg-accent flex items-center justify-center text-accent-foreground font-semibold text-sm">
            UA
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">User Account</p>
            <p className="text-xs text-muted-foreground truncate">investor@islaminvest.com</p>
          </div>
        </div>
      </div>
    </div>
  );
}

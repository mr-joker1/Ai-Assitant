"use client";

import { useEffect, useState } from "react";
import { Newspaper, RefreshCw, ExternalLink, Filter, Globe, TrendingUp, Coins, BookOpen, Shield } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface NewsItem {
  id?: string;
  title: string;
  description: string;
  source: string;
  url: string;
  publishedAt: string;
  imageUrl?: string;
  category: string;
  isIslamicFinance: boolean;
}

const CATEGORIES = [
  { value: "GENERAL", label: "All News", icon: Globe },
  { value: "STOCK", label: "Equities", icon: TrendingUp },
  { value: "CRYPTO", label: "Crypto", icon: Coins },
  { value: "SHARIAH", label: "Shariah", icon: Shield },
];

const QUERIES: Record<string, string> = {
  GENERAL: "Islamic finance investing halal",
  STOCK: "halal stocks Shariah equities",
  CRYPTO: "Islamic cryptocurrency Bitcoin halal",
  SHARIAH: "AAOIFI Shariah Islamic banking sukuk",
};

export default function IslamicNews() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("GENERAL");
  const [refreshing, setRefreshing] = useState(false);

  const fetchNews = async (cat = category, force = false) => {
    setLoading(!force);
    if (force) setRefreshing(true);
    try {
      const q = QUERIES[cat] || QUERIES.GENERAL;
      const res = await fetch(`/api/news?q=${encodeURIComponent(q)}&category=${cat}&refresh=${force}`);
      const data = await res.json();
      setNews(data.news || []);
    } catch (err) {
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchNews();
  }, [category]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Islamic Finance News</h2>
          <p className="text-muted-foreground text-sm">
            Live news on Shariah compliance changes, company updates, crypto rulings, and scholar opinions.
          </p>
        </div>
        <button
          onClick={() => fetchNews(category, true)}
          disabled={refreshing}
          className="flex items-center gap-2 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-lg transition-all disabled:opacity-50"
        >
          <RefreshCw className={cn("w-3.5 h-3.5", refreshing && "animate-spin")} />
          Refresh
        </button>
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((cat) => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={cn(
                "flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all",
                category === cat.value
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "bg-card border border-border text-muted-foreground hover:text-foreground hover:border-primary/20"
              )}
            >
              <Icon className="w-4 h-4" />
              {cat.label}
            </button>
          );
        })}
      </div>

      {/* News Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading news...
        </div>
      ) : news.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <Newspaper className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="font-semibold text-foreground">No news found</h3>
          <p className="text-sm text-muted-foreground mt-1">Try refreshing or switching category</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
          {news.map((item, idx) => (
            <motion.a
              key={item.id || idx}
              href={item.url}
              target="_blank"
              rel="noreferrer"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.04 }}
              className="bg-card rounded-2xl border border-border hover:border-primary/30 hover:shadow-sm transition-all group overflow-hidden flex flex-col"
            >
              {item.imageUrl && (
                <div className="h-40 bg-secondary overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }}
                  />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-muted-foreground uppercase">{item.source}</span>
                    {item.isIslamicFinance && (
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-full">
                        Islamic Finance
                      </span>
                    )}
                  </div>
                  <ExternalLink className="w-3.5 h-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
                </div>
                <h3 className="font-semibold text-foreground text-sm leading-snug line-clamp-3 flex-1">
                  {item.title}
                </h3>
                {item.description && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                )}
                <p className="text-[10px] text-muted-foreground mt-3">
                  {new Date(item.publishedAt).toLocaleDateString("en-US", {
                    year: "numeric", month: "short", day: "numeric"
                  })}
                </p>
              </div>
            </motion.a>
          ))}
        </div>
      )}
    </div>
  );
}

"use client";

import { useState, useCallback } from "react";
import { Search, TrendingUp, Coins, BookOpen, Users, Newspaper, X, RefreshCw, ShieldCheck, ShieldAlert, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";

type SearchType = "ALL" | "STOCKS" | "CRYPTO" | "FATWAS" | "SCHOLARS" | "NEWS";

interface SearchResults {
  companies: any[];
  cryptos: any[];
  fatwas: any[];
  scholars: any[];
  news: any[];
}

const TYPE_TABS: { value: SearchType; label: string; icon: any }[] = [
  { value: "ALL", label: "All", icon: Search },
  { value: "STOCKS", label: "Stocks", icon: TrendingUp },
  { value: "CRYPTO", label: "Crypto", icon: Coins },
  { value: "FATWAS", label: "Fatwas", icon: BookOpen },
  { value: "SCHOLARS", label: "Scholars", icon: Users },
  { value: "NEWS", label: "News", icon: Newspaper },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [type, setType] = useState<SearchType>("ALL");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<SearchResults | null>(null);
  const [totalResults, setTotalResults] = useState(0);

  const doSearch = useCallback(async (q: string, t: SearchType) => {
    if (!q.trim()) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&type=${t}`);
      const data = await res.json();
      if (res.ok) {
        setResults(data.results);
        setTotalResults(data.totalResults);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    doSearch(query, type);
  };

  const handleTypeChange = (t: SearchType) => {
    setType(t);
    if (query) doSearch(query, t);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-foreground">AI-Powered Shariah Search</h2>
        <p className="text-muted-foreground text-sm">
          Semantic + keyword hybrid search across stocks, crypto, fatwas, scholars, and news.
        </p>
      </div>

      {/* Search Bar */}
      <div className="glass-panel p-6 rounded-2xl shadow-sm space-y-4">
        <form onSubmit={handleSubmit} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-5 h-5 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              autoFocus
              type="text"
              placeholder="Search for stocks, crypto, fatwas, scholars, or news..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-12 pr-10 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
            {query && (
              <button
                type="button"
                onClick={() => { setQuery(""); setResults(null); }}
                className="absolute right-3 top-3.5 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
          <button
            type="submit"
            disabled={loading || !query.trim()}
            className="bg-primary text-primary-foreground font-semibold px-6 py-3 rounded-xl hover:opacity-90 transition-all text-sm disabled:opacity-50 flex items-center gap-2 min-w-[120px] justify-center"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : "Search"}
          </button>
        </form>

        {/* Recent Searches */}
        <div className="flex flex-wrap gap-2 items-center text-xs text-muted-foreground pt-1">
          <span className="font-bold text-[10px] uppercase tracking-wider">Recent:</span>
          {["MSFT", "AAPL", "BTC", "riba", "purification", "zakat"].map((term) => (
            <button
              key={term}
              type="button"
              onClick={() => {
                setQuery(term);
                doSearch(term, type);
              }}
              className="px-2.5 py-1 rounded-lg bg-secondary text-foreground hover:bg-[#00C282] hover:text-white transition-all cursor-pointer text-[11px] font-medium"
            >
              {term}
            </button>
          ))}
        </div>

        {/* Type Tabs */}
        <div className="flex gap-2 flex-wrap">
          {TYPE_TABS.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.value}
                onClick={() => handleTypeChange(tab.value)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all",
                  type === tab.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                <Icon className="w-3.5 h-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Results */}
      <AnimatePresence>
        {results && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            <p className="text-sm text-muted-foreground">
              Found <span className="font-semibold text-foreground">{totalResults}</span> results for &quot;{query}&quot;
            </p>

            {/* Stocks */}
            {results.companies.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-primary" /> Stocks &amp; Equities
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.companies.map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/company?symbol=${c.symbol}`}
                      className="bg-card p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-3"
                    >
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.symbol} className="w-10 h-10 rounded-lg object-contain bg-secondary p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                          {c.symbol?.[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{c.symbol}</span>
                          {c.isLive ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-secondary text-muted-foreground">
                              Screen Now →
                            </span>
                          ) : (
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold", c.isHalal ? "bg-primary/10 text-primary" : "bg-destructive/10 text-destructive")}>
                              {c.isHalal ? "HALAL" : "HARAM"}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.sector}</p>
                      </div>
                      {!c.isLive && c.currentPrice != null && (
                        <span className="text-sm font-semibold text-foreground">${c.currentPrice?.toFixed(2)}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Cryptos */}
            {results.cryptos.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Coins className="w-4 h-4 text-primary" /> Cryptocurrencies
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {results.cryptos.map((c) => (
                    <Link
                      key={c.id}
                      href={`/dashboard/crypto?symbol=${c.symbol}`}
                      className="bg-card p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-3"
                    >
                      {c.logoUrl ? (
                        <img src={c.logoUrl} alt={c.symbol} className="w-10 h-10 rounded-lg object-contain bg-secondary p-1" onError={(e) => { (e.target as HTMLImageElement).style.display = "none"; }} />
                      ) : (
                        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center font-bold text-sm text-foreground">
                          {c.symbol?.[0]}
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground text-sm">{c.symbol}</span>
                          {c.isLive ? (
                            <span className="text-[10px] px-1.5 py-0.5 rounded-full font-bold bg-secondary text-muted-foreground">
                              Screen Now →
                            </span>
                          ) : (
                            <span className={cn("text-[10px] px-1.5 py-0.5 rounded-full font-bold",
                              c.complianceStatus === "HALAL" ? "bg-primary/10 text-primary" :
                              c.complianceStatus === "HARAM" ? "bg-destructive/10 text-destructive" :
                              "bg-accent/10 text-accent"
                            )}>
                              {c.complianceStatus}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground truncate">{c.name}</p>
                        <p className="text-xs text-muted-foreground">{c.consensusType}</p>
                      </div>
                      {!c.isLive && c.price != null && (
                        <span className="text-sm font-semibold text-foreground">${c.price?.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
                      )}
                    </Link>
                  ))}
                </div>
              </section>
            )}


            {/* Fatwas */}
            {results.fatwas.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-primary" /> Fatwas & Rulings
                </h3>
                <div className="space-y-3">
                  {results.fatwas.map((f) => (
                    <Link
                      key={f.id}
                      href={`/dashboard/fatwas?id=${f.id}`}
                      className="bg-card p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all block"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">{f.category}</span>
                          <h4 className="font-semibold text-foreground text-sm mt-1">{f.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{f.summary}</p>
                          {f.source && <p className="text-[10px] text-muted-foreground mt-1">Source: {f.source}</p>}
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* Scholars */}
            {results.scholars.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Users className="w-4 h-4 text-primary" /> Scholars
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {results.scholars.map((s) => (
                    <Link
                      key={s.id}
                      href={`/dashboard/scholars?id=${s.id}`}
                      className="bg-card p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all flex items-center gap-3"
                    >
                      <div className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-sm">
                        {s.name[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-foreground text-sm">{s.name}</p>
                        <p className="text-xs text-muted-foreground">{s.title}</p>
                        <p className="text-[10px] text-primary mt-0.5">{s.methodology}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* News */}
            {results.news.length > 0 && (
              <section className="space-y-3">
                <h3 className="font-semibold text-foreground flex items-center gap-2">
                  <Newspaper className="w-4 h-4 text-primary" /> News
                </h3>
                <div className="space-y-3">
                  {results.news.map((n) => (
                    <a
                      key={n.id}
                      href={n.url}
                      target="_blank"
                      rel="noreferrer"
                      className="bg-card p-4 rounded-xl border border-border hover:border-primary/30 hover:shadow-sm transition-all block"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          {n.isIslamicFinance && (
                            <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">Islamic Finance</span>
                          )}
                          <h4 className="font-semibold text-foreground text-sm mt-1 line-clamp-2">{n.title}</h4>
                          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{n.description}</p>
                          <p className="text-[10px] text-muted-foreground mt-1">{n.source} · {new Date(n.publishedAt).toLocaleDateString()}</p>
                        </div>
                        <ArrowRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}

            {totalResults === 0 && (
              <div className="text-center py-16 text-muted-foreground">
                <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold text-foreground">No results found</p>
                <p className="text-sm mt-1">Try searching for a stock ticker like &quot;MSFT&quot;, a crypto like &quot;BTC&quot;, or a topic like &quot;riba&quot;</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

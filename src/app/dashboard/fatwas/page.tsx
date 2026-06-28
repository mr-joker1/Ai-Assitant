"use client";

import { useEffect, useState, useCallback } from "react";
import { BookOpen, Search, Filter, X, ChevronRight, RefreshCw, Plus, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Fatwa {
  id: string;
  title: string;
  category: string;
  summary: string;
  source?: string;
  scholarName?: string;
  citationLink?: string;
  date?: string;
  createdAt: string;
}

export default function FatwaLibrary() {
  const [fatwas, setFatwas] = useState<Fatwa[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selected, setSelected] = useState<Fatwa | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchFatwas = useCallback(async (q = query, cat = selectedCategory, p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, category: cat, page: String(p), limit: "15" });
      const res = await fetch(`/api/fatwas?${params}`);
      const data = await res.json();
      setFatwas(data.fatwas || []);
      setCategories(data.categories || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [query, selectedCategory, page]);

  useEffect(() => {
    fetchFatwas();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchFatwas(query, selectedCategory, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Fatwa Library</h2>
          <p className="text-muted-foreground text-sm">
            Searchable database of Shariah rulings on investments, crypto, stocks, and Islamic finance.
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          {total.toLocaleString()} Rulings
        </span>
      </div>

      {/* Search & Filters */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search fatwas by title, content, scholar, or topic..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <button type="submit" className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            Search
          </button>
        </form>

        {/* Category filters */}
        {categories.length > 0 && (
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => { setSelectedCategory(""); setPage(1); fetchFatwas(query, "", 1); }}
              className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-all",
                !selectedCategory ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
              )}
            >
              All Categories
            </button>
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setPage(1); fetchFatwas(query, cat, 1); }}
                className={cn("px-3 py-1 rounded-full text-xs font-semibold transition-all",
                  selectedCategory === cat ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground hover:text-foreground"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Fatwa List */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading fatwas...
            </div>
          ) : fatwas.length === 0 ? (
            <div className="text-center py-16">
              <BookOpen className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">No fatwas found. Try a different search.</p>
            </div>
          ) : (
            <>
              {fatwas.map((f) => (
                <button
                  key={f.id}
                  onClick={() => setSelected(f)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all",
                    selected?.id === f.id
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                  )}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                        {f.category}
                      </span>
                      <p className="font-semibold text-foreground text-sm mt-1.5 line-clamp-2">{f.title}</p>
                      {f.scholarName && (
                        <p className="text-xs text-muted-foreground mt-1">{f.scholarName}</p>
                      )}
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-1" />
                  </div>
                </button>
              ))}

              {/* Pagination */}
              <div className="flex justify-center gap-2 pt-2">
                <button
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1.5 rounded-lg text-xs bg-secondary disabled:opacity-40 hover:bg-muted"
                >
                  Previous
                </button>
                <span className="px-3 py-1.5 text-xs text-muted-foreground">
                  {page} / {totalPages}
                </span>
                <button
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1.5 rounded-lg text-xs bg-secondary disabled:opacity-40 hover:bg-muted"
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        {/* Fatwa Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-primary uppercase bg-primary/10 px-2 py-0.5 rounded-full">
                      {selected.category}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mt-2">{selected.title}</h3>
                    {selected.scholarName && (
                      <p className="text-sm text-muted-foreground">by {selected.scholarName}</p>
                    )}
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="border-t border-border pt-5 space-y-4">
                  <div>
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Summary</h4>
                    <p className="text-sm text-foreground leading-relaxed">{selected.summary}</p>
                  </div>

                  {selected.source && (
                    <div className="flex items-center gap-2 text-xs text-muted-foreground border-t border-border pt-4">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Source: <span className="text-foreground font-medium">{selected.source}</span></span>
                    </div>
                  )}

                  {selected.citationLink && (
                    <a
                      href={selected.citationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 text-xs text-primary hover:underline"
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      View Original Source
                    </a>
                  )}

                  {selected.date && (
                    <p className="text-xs text-muted-foreground">
                      Date issued: {new Date(selected.date).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" })}
                    </p>
                  )}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
              >
                <BookOpen className="w-12 h-12 text-primary/30 mb-4" />
                <h3 className="font-semibold text-foreground">Select a Fatwa</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  Choose a ruling from the list to view its full content, evidence, and scholar attribution.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

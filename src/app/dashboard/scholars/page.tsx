"use client";

import { useEffect, useState, useCallback } from "react";
import { Users, Search, RefreshCw, Star, BookOpen, ChevronRight, X, Globe } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Scholar {
  id: string;
  name: string;
  title?: string;
  methodology: string;
  bio?: string;
  profileImageUrl?: string;
  publications?: string;
  rating: number;
  opinions: {
    id: string;
    companySymbol?: string;
    cryptoSymbol?: string;
    opinion: string;
    reasoning: string;
    evidence: string;
    source?: string;
  }[];
}

const METHODOLOGIES = ["AAOIFI", "DOW_JONES", "SP_SHARIAH"];

export default function ScholarHub() {
  const [scholars, setScholars] = useState<Scholar[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [methodology, setMethodology] = useState("");
  const [selected, setSelected] = useState<Scholar | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  const fetchScholars = useCallback(async (q = query, m = methodology, p = page) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ q, methodology: m, page: String(p), limit: "12" });
      const res = await fetch(`/api/scholars?${params}`);
      const data = await res.json();
      setScholars(data.scholars || []);
      setTotalPages(data.pages || 1);
      setTotal(data.total || 0);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  }, [query, methodology, page]);

  useEffect(() => {
    fetchScholars();
  }, [page]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchScholars(query, methodology, 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground">Scholar Hub</h2>
          <p className="text-muted-foreground text-sm">
            Profiles, methodologies, publications, and opinions from contemporary Islamic finance scholars.
          </p>
        </div>
        <span className="text-xs text-muted-foreground bg-secondary px-3 py-1.5 rounded-full">
          {total} Scholars
        </span>
      </div>

      {/* Search & Methodology Filter */}
      <div className="glass-panel p-5 rounded-2xl shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="w-4 h-4 absolute left-4 top-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by scholar name or specialization..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full bg-card border border-border rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
            />
          </div>
          <select
            value={methodology}
            onChange={(e) => { setMethodology(e.target.value); fetchScholars(query, e.target.value, 1); }}
            className="bg-card border border-border rounded-xl px-4 py-3 text-sm focus:outline-none text-foreground"
          >
            <option value="">All Methodologies</option>
            {METHODOLOGIES.map((m) => <option key={m} value={m}>{m.replace("_", " ")}</option>)}
          </select>
          <button type="submit" className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-semibold hover:opacity-90 transition-all">
            Search
          </button>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scholar Grid */}
        <div className="lg:col-span-1 space-y-3">
          {loading ? (
            <div className="flex items-center justify-center py-16 text-muted-foreground">
              <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading scholars...
            </div>
          ) : scholars.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
              <p className="text-sm text-muted-foreground">No scholars found.</p>
            </div>
          ) : (
            <>
              {scholars.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setSelected(s)}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border transition-all flex items-center gap-3",
                    selected?.id === s.id
                      ? "bg-primary/5 border-primary/30"
                      : "bg-card border-border hover:border-primary/20 hover:shadow-sm"
                  )}
                >
                  <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-lg flex-shrink-0">
                    {s.name[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground text-sm truncate">{s.name}</p>
                    <p className="text-xs text-muted-foreground truncate">{s.title || "Islamic Finance Scholar"}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded">{s.methodology}</span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-3 h-3 text-accent fill-current" />
                        <span className="text-[10px] text-muted-foreground">{s.rating.toFixed(1)}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                </button>
              ))}
              <div className="flex justify-center gap-2 pt-2">
                <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-1.5 rounded-lg text-xs bg-secondary disabled:opacity-40">Previous</button>
                <span className="px-3 py-1.5 text-xs text-muted-foreground">{page} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages} className="px-3 py-1.5 rounded-lg text-xs bg-secondary disabled:opacity-40">Next</button>
              </div>
            </>
          )}
        </div>

        {/* Scholar Detail */}
        <div className="lg:col-span-2">
          <AnimatePresence mode="wait">
            {selected ? (
              <motion.div
                key={selected.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-6 space-y-6"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-full bg-accent/20 flex items-center justify-center font-bold text-accent text-2xl">
                      {selected.name[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-foreground">{selected.name}</h3>
                      <p className="text-sm text-muted-foreground">{selected.title || "Islamic Finance Scholar"}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">{selected.methodology}</span>
                        <div className="flex items-center gap-1">
                          {[1,2,3,4,5].map((s) => (
                            <Star key={s} className={cn("w-3.5 h-3.5", s <= Math.round(selected.rating) ? "text-accent fill-current" : "text-muted")} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <button onClick={() => setSelected(null)} className="p-1 rounded-lg hover:bg-secondary text-muted-foreground">
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {selected.bio && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Biography</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.bio}</p>
                  </div>
                )}

                {selected.publications && (
                  <div className="border-t border-border pt-4">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2">Key Publications</h4>
                    <p className="text-sm text-muted-foreground leading-relaxed">{selected.publications}</p>
                  </div>
                )}

                {selected.opinions.length > 0 && (
                  <div className="border-t border-border pt-4 space-y-3">
                    <h4 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Recorded Opinions</h4>
                    <div className="space-y-3">
                      {selected.opinions.map((op) => (
                        <div key={op.id} className="p-3 bg-secondary/40 rounded-xl border border-border space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-foreground text-sm">
                              {op.companySymbol || op.cryptoSymbol || "General"}
                            </span>
                            <span className={cn("text-[10px] px-2 py-0.5 rounded-full font-bold",
                              op.opinion === "HALAL" ? "bg-primary/10 text-primary" :
                              op.opinion === "HARAM" ? "bg-destructive/10 text-destructive" :
                              "bg-accent/10 text-accent"
                            )}>
                              {op.opinion}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">{op.reasoning}</p>
                          <p className="text-[10px] text-muted-foreground">Evidence: {op.evidence}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-card rounded-2xl border border-border shadow-sm p-12 flex flex-col items-center justify-center text-center h-full min-h-[300px]"
              >
                <Users className="w-12 h-12 text-primary/30 mb-4" />
                <h3 className="font-semibold text-foreground">Select a Scholar</h3>
                <p className="text-sm text-muted-foreground mt-1 max-w-xs">
                  View methodologies, opinions, and publications from leading Islamic finance scholars.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

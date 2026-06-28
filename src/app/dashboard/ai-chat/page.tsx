"use client";

import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, BookOpen, ShieldCheck, RefreshCw, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  citations?: { title: string; source: string; url?: string; type: string }[];
  loading?: boolean;
}

const SUGGESTED_QUESTIONS = [
  "Is Apple (AAPL) Shariah compliant?",
  "What is the ruling on staking Ethereum?",
  "How do I calculate Zakat on stocks?",
  "What is the AAOIFI standard for debt screening?",
  "Is Bitcoin halal according to scholars?",
  "How do I purify non-compliant dividends?",
];

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "Assalamu Alaikum. I am your AI-powered Shariah Investment Advisor, powered by our rule engine, fatwa knowledge base, and scholar opinions. Ask me anything about Islamic investing, stock compliance, Zakat, crypto, or business screening.",
      citations: [],
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const messageText = text || input.trim();
    if (!messageText || loading) return;

    setInput("");

    const userMsg: Message = {
      id: crypto.randomUUID(),
      role: "user",
      content: messageText,
    };

    const loadingMsg: Message = {
      id: "loading",
      role: "assistant",
      content: "",
      loading: true,
    };

    setMessages((prev) => [...prev, userMsg, loadingMsg]);
    setLoading(true);

    try {
      const res = await fetch("/api/ai-chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: messageText }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "AI request failed");

      const assistantMsg: Message = {
        id: crypto.randomUUID(),
        role: "assistant",
        content: data.answer,
        citations: data.citations || [],
      };

      setMessages((prev) => prev.filter((m) => m.id !== "loading").concat(assistantMsg));
    } catch (err: any) {
      setMessages((prev) =>
        prev
          .filter((m) => m.id !== "loading")
          .concat({
            id: crypto.randomUUID(),
            role: "assistant",
            content: `Error: ${err.message}. Please try again or check your connection.`,
          })
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[800px]">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">AI Shariah Advisor</h2>
        <p className="text-muted-foreground text-sm">
          Powered by RAG retrieval from our fatwa database, scholar opinions, and financial screening engine.
        </p>
      </div>

      {/* Chat Window */}
      <div className="flex flex-1 gap-6 min-h-0">
        {/* Messages Column */}
        <div className="flex-1 flex flex-col bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            <AnimatePresence initial={false}>
              {messages.map((msg) => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
                >
                  {/* Avatar */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-1",
                      msg.role === "user"
                        ? "bg-primary text-primary-foreground"
                        : "bg-accent/20 text-accent"
                    )}
                  >
                    {msg.role === "user" ? (
                      <User className="w-4 h-4" />
                    ) : (
                      <Bot className="w-4 h-4" />
                    )}
                  </div>

                  {/* Bubble */}
                  <div
                    className={cn(
                      "max-w-[80%] space-y-3",
                      msg.role === "user" ? "items-end" : "items-start"
                    )}
                  >
                    <div
                      className={cn(
                        "px-4 py-3 rounded-2xl text-sm leading-relaxed",
                        msg.role === "user"
                          ? "bg-primary text-primary-foreground rounded-tr-sm"
                          : "bg-secondary text-foreground rounded-tl-sm"
                      )}
                    >
                      {msg.loading ? (
                        <div className="flex gap-1 items-center py-1">
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:0ms]" />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:150ms]" />
                          <span className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce [animation-delay:300ms]" />
                        </div>
                      ) : (
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      )}
                    </div>

                    {/* Citations */}
                    {msg.citations && msg.citations.length > 0 && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider px-1">
                          Sources & Citations
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {msg.citations.map((c, i) => (
                            <div
                              key={i}
                              className={cn(
                                "inline-flex items-center gap-1.5 px-2 py-1 rounded-lg text-[10px] font-semibold border",
                                c.type === "FATWA"
                                  ? "bg-primary/10 text-primary border-primary/20"
                                  : c.type === "SCHOLAR_OPINION"
                                  ? "bg-accent/10 text-accent border-accent/20"
                                  : "bg-secondary text-muted-foreground border-border"
                              )}
                            >
                              <BookOpen className="w-3 h-3" />
                              {c.title}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            <div ref={bottomRef} />
          </div>

          {/* Input Bar */}
          <div className="border-t border-border p-4">
            <div className="flex gap-3">
              <input
                type="text"
                placeholder="Ask about stocks, crypto, Zakat, fatwas, or business compliance..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={loading}
                className="flex-1 bg-secondary/50 border border-border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground placeholder:text-muted-foreground"
              />
              <button
                onClick={() => sendMessage()}
                disabled={loading || !input.trim()}
                className="bg-primary text-primary-foreground px-4 py-3 rounded-xl hover:opacity-90 transition-all disabled:opacity-40 flex items-center gap-2"
              >
                {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>

        {/* Suggested Questions Sidebar */}
        <div className="hidden lg:flex flex-col w-72 space-y-4">
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-4">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              Suggested Questions
            </h4>
            <div className="space-y-2">
              {SUGGESTED_QUESTIONS.map((q, i) => (
                <button
                  key={i}
                  onClick={() => sendMessage(q)}
                  disabled={loading}
                  className="w-full text-left text-xs px-3 py-2.5 rounded-lg bg-secondary/50 hover:bg-secondary text-foreground border border-transparent hover:border-border transition-all leading-relaxed"
                >
                  {q}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-border shadow-sm p-5 space-y-3">
            <h4 className="font-semibold text-foreground text-sm flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-accent" />
              AI Safety Notice
            </h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              The Rule Engine always overrides AI opinions. If a stock is marked Haram by our financial
              screening ratios, the AI will explain that ruling — not override it. Always consult a
              qualified Shariah scholar for final rulings.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { Bell, Check, CheckCheck, RefreshCw, ShieldCheck, AlertCircle, BookOpen, Coins } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const TYPE_CONFIG: Record<string, { icon: any; color: string }> = {
  COMPLIANCE_CHANGE: { icon: ShieldCheck, color: "text-primary" },
  PRICE_ALERT: { icon: Coins, color: "text-accent" },
  SYSTEM: { icon: Bell, color: "text-muted-foreground" },
  ZAKAT: { icon: BookOpen, color: "text-primary" },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchNotifications(); }, []);

  const markRead = async (id?: string) => {
    setMarking(true);
    try {
      await fetch("/api/notifications", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(id ? { id } : { markAllRead: true }),
      });
      fetchNotifications();
    } catch (err) {
    } finally {
      setMarking(false);
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Bell className="w-6 h-6 text-primary" />
            Notifications
            {unreadCount > 0 && (
              <span className="text-sm font-bold bg-destructive text-destructive-foreground px-2 py-0.5 rounded-full">
                {unreadCount}
              </span>
            )}
          </h2>
          <p className="text-muted-foreground text-sm mt-1">
            Compliance changes, Zakat reminders, and system alerts.
          </p>
        </div>
        {unreadCount > 0 && (
          <button
            onClick={() => markRead()}
            disabled={marking}
            className="flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 bg-primary/10 px-3 py-1.5 rounded-lg transition-all"
          >
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          <RefreshCw className="w-5 h-5 animate-spin mr-2" /> Loading...
        </div>
      ) : notifications.length === 0 ? (
        <div className="text-center py-24 bg-card rounded-2xl border border-border">
          <Bell className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-30" />
          <h3 className="font-semibold text-foreground">All caught up</h3>
          <p className="text-sm text-muted-foreground mt-1">No notifications yet.</p>
        </div>
      ) : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifications.map((n) => {
              const config = TYPE_CONFIG[n.type] || TYPE_CONFIG.SYSTEM;
              const Icon = config.icon;
              return (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={cn(
                    "flex items-start gap-4 p-4 rounded-xl border transition-all",
                    n.read ? "bg-card border-border" : "bg-primary/5 border-primary/20"
                  )}
                >
                  <div className={cn("w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                    n.read ? "bg-secondary" : "bg-primary/10"
                  )}>
                    <Icon className={cn("w-4 h-4", n.read ? "text-muted-foreground" : config.color)} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={cn("text-sm font-semibold", n.read ? "text-muted-foreground" : "text-foreground")}>
                      {n.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-muted-foreground mt-2">
                      {new Date(n.createdAt).toLocaleString("en-US", {
                        month: "short", day: "numeric", hour: "numeric", minute: "2-digit"
                      })}
                    </p>
                  </div>
                  {!n.read && (
                    <button
                      onClick={() => markRead(n.id)}
                      className="p-1.5 rounded-lg hover:bg-secondary text-primary transition-all flex-shrink-0"
                      title="Mark as read"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  )}
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}

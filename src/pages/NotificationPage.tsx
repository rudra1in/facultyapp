import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  Calendar,
  Clock,
  CheckCircle,
  Sparkles,
  Zap,
  ShieldCheck,
  LayoutGrid,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  notificationService,
  Notification,
} from "../services/notification.service";

/* ===============================
   AESTHETIC HELPERS
================================ */

const formatTime = (date: string) =>
  new Date(date).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

const AestheticSparkle = ({ delay = 0 }: { delay?: number }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute pointer-events-none text-yellow-400"
  >
    <Sparkles size={12} fill="currentColor" />
  </motion.div>
);

/* ===============================
   OPTIONS DROPDOWN
================================ */

const NotificationOptionsDropdown = ({
  onMarkAsRead,
  onRemove,
}: {
  onMarkAsRead: () => void;
  onRemove: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const close = (e: MouseEvent) =>
      ref.current && !ref.current.contains(e.target as Node) && setOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={(e) => {
          e.stopPropagation();
          setOpen(!open);
        }}
        className="p-1.5 rounded-lg hover:bg-[var(--bg-main)] transition-colors"
      >
        <MoreHorizontal className="h-4 w-4 text-[var(--text-muted)]" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-48 bg-[var(--bg-card)] rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden z-30 border border-[var(--border-main)] backdrop-blur-xl"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-xs font-bold hover:bg-[var(--bg-main)] text-[var(--text-main)] transition-colors uppercase tracking-widest"
            >
              <CheckCircle className="h-4 w-4 mr-3 text-green-500" />
              Mark Read
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-500/10 transition-colors uppercase tracking-widest"
            >
              <Trash2 className="h-4 w-4 mr-3" />
              Purge Node
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ===============================
   MAIN PAGE
================================ */

const NotificationPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<Notification["category"] | "All">(
    "All"
  );
  const [selected, setSelected] = useState<Notification | null>(null);

  useEffect(() => {
    notificationService.getMyNotifications().then(setNotifications);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filtered = notifications.filter(
    (n) => activeTab === "All" || n.category === activeTab
  );

  const markAsRead = async (id: number) => {
    await notificationService.markAsRead(id);
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const removeNotification = async (id: number) => {
    await notificationService.deleteNotification(id);
    setNotifications((prev) => prev.filter((n) => n.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  return (
    <div className="flex h-[calc(100vh-64px)] bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-500 overflow-hidden relative">
      {/* GLOBAL BACKGROUND ELEMENTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40rem] h-[40rem] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

      {/* LEFT: Notification List Node */}
      <div className="w-full lg:w-[450px] bg-[var(--bg-card)] border-r border-[var(--border-main)] flex flex-col transition-all duration-500 z-10 relative">
        <div className="p-8 pb-6 border-b border-[var(--border-main)] bg-[var(--bg-card)]/50 backdrop-blur-md sticky top-0">
          <div className="flex items-center justify-between mb-8">
            <div className="relative">
              <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                Alerts
              </h2>
              <div className="absolute -top-1 -right-4">
                <AestheticSparkle />
              </div>
            </div>
            {unreadCount > 0 && (
              <motion.span
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                className="px-4 py-1.5 bg-[var(--accent)] text-white text-[10px] font-black rounded-full uppercase tracking-[0.2em] shadow-xl shadow-indigo-500/30"
              >
                {unreadCount} Syncs
              </motion.span>
            )}
          </div>

          {/* Scrolling Tabs */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
            {["All", "Classes", "Meetings", "Submissions", "Admin"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all shrink-0 border-2 ${
                    activeTab === tab
                      ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-lg shadow-indigo-500/20"
                      : "bg-[var(--bg-main)] border-transparent text-[var(--text-muted)] hover:border-[var(--border-main)]"
                  }`}
                >
                  {tab}
                </button>
              )
            )}
          </div>
        </div>

        {/* List Content */}
        <div className="overflow-y-auto flex-1 no-scrollbar p-4 space-y-3">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="p-20 text-center space-y-4"
              >
                <div className="p-4 bg-[var(--bg-main)] w-fit mx-auto rounded-full opacity-20 border border-[var(--border-main)]">
                  <ShieldCheck size={32} />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)]">
                  Clearance: No Logs
                </p>
              </motion.div>
            ) : (
              filtered.map((n, idx) => (
                <motion.div
                  key={n.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  onClick={() => {
                    setSelected(n);
                    if (!n.read) markAsRead(n.id);
                  }}
                  className={`p-6 rounded-[2rem] cursor-pointer transition-all border-2 relative group overflow-hidden ${
                    selected?.id === n.id
                      ? "bg-[var(--bg-main)] border-[var(--accent)] shadow-xl"
                      : "bg-transparent border-transparent hover:bg-[var(--bg-main)]"
                  }`}
                >
                  <div className="flex justify-between items-start gap-4 relative z-10">
                    <div className="flex gap-4">
                      <div
                        className={`p-3 rounded-2xl shadow-inner ${
                          !n.read
                            ? "bg-[var(--accent)] text-white"
                            : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                        }`}
                      >
                        <Zap
                          size={16}
                          fill={!n.read ? "currentColor" : "none"}
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <div
                          dangerouslySetInnerHTML={{ __html: n.message }}
                          className={`text-sm leading-relaxed ${
                            !n.read
                              ? "font-black text-[var(--text-main)]"
                              : "font-medium text-[var(--text-muted)]"
                          }`}
                        />
                        <div className="flex items-center gap-3 mt-2">
                          <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)] opacity-50 flex items-center gap-1.5">
                            <Clock size={10} /> {formatTime(n.createdAt)}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      {!n.read && (
                        <motion.div
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ repeat: Infinity, duration: 2 }}
                          className="w-2 h-2 rounded-full bg-[var(--accent)] shadow-[0_0_10px_var(--accent)]"
                        />
                      )}
                      <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                        <NotificationOptionsDropdown
                          onMarkAsRead={() => markAsRead(n.id)}
                          onRemove={() => removeNotification(n.id)}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Glass Background for active state */}
                  {selected?.id === n.id && (
                    <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/5 to-transparent pointer-events-none" />
                  )}
                </motion.div>
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* RIGHT: High-End Preview Terminal */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--bg-main)] relative overflow-hidden transition-all duration-500">
        {/* Animated Grid Background */}
        <div
          className="absolute inset-0 opacity-[0.03] pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(var(--text-muted) 1px, transparent 0)",
            backgroundSize: "40px 40px",
          }}
        />

        <AnimatePresence mode="wait">
          {selected ? (
            <motion.div
              key={selected.id}
              initial={{ opacity: 0, y: 30, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="max-w-2xl w-full mx-12 relative"
            >
              {/* Floating Sparkles around preview */}
              <AestheticSparkle delay={0} />
              <div className="absolute -bottom-8 -right-8">
                <AestheticSparkle delay={1} />
              </div>

              <div className="bg-[var(--bg-card)] p-12 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-[var(--border-main)] relative overflow-hidden">
                <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 text-[var(--accent)]">
                  <Bell size={200} />
                </div>

                <div className="relative z-10">
                  <div className="flex items-center gap-4 mb-10">
                    <div className="p-4 bg-[var(--accent)]/10 rounded-[1.5rem] border border-[var(--accent)]/20 shadow-inner">
                      <Bell
                        className="text-[var(--accent)] w-8 h-8"
                        strokeWidth={2.5}
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-50">
                        Transmission Node
                      </p>
                      <h3 className="font-black text-3xl tracking-tighter text-[var(--text-main)] uppercase italic">
                        {selected.category || "Log Entry"}
                      </h3>
                    </div>
                  </div>

                  <div
                    dangerouslySetInnerHTML={{ __html: selected.message }}
                    className="text-[var(--text-main)] font-bold leading-relaxed text-xl mb-12"
                  />

                  <div className="flex items-center justify-between pt-8 border-t border-[var(--border-main)]/50">
                    <div className="flex items-center gap-3 text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
                      <Calendar size={14} className="text-[var(--accent)]" />
                      {formatTime(selected.createdAt)}
                    </div>
                    <div className="flex items-center gap-2 px-4 py-1.5 bg-[var(--bg-main)] rounded-full border border-[var(--border-main)]">
                      <LayoutGrid size={12} className="text-[var(--accent)]" />
                      <span className="text-[9px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                        Verified Log
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center relative"
            >
              <div className="w-32 h-32 bg-[var(--bg-card)] border-2 border-[var(--border-main)] rounded-[3rem] shadow-2xl flex items-center justify-center mx-auto mb-8 relative z-10 overflow-hidden group hover:border-[var(--accent)] transition-all duration-500">
                <Search
                  className="text-[var(--text-muted)] w-10 h-10 group-hover:scale-110 group-hover:text-[var(--accent)] transition-all"
                  strokeWidth={2.5}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-[var(--accent)]/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
              <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.4em] text-[10px] max-w-xs mx-auto leading-loose">
                Select a protocol notification <br /> from the node uplink to
                decrypt
              </p>

              {/* Static Background Sparkle for Empty State */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-[var(--accent)] opacity-[0.05] rounded-full blur-[80px]" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default NotificationPage;

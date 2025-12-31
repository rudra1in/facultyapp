import React, { useEffect, useRef, useState } from "react";
import {
  Bell,
  Search,
  MoreHorizontal,
  Mail,
  Trash2,
  VolumeX,
  Reply,
  Calendar,
  FileText,
  Clock,
  Users,
  X,
  CheckCircle,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  notificationService,
  Notification,
} from "../services/notification.service";

/* ===============================
   HELPERS
================================ */

const formatTime = (date: string) =>
  new Date(date).toLocaleString([], {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

/* ===============================
   OPTIONS DROPDOWN
================================ */

const NotificationOptionsDropdown = ({
  notif,
  onMarkAsRead,
  onRemove,
}: {
  notif: Notification;
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
      >
        <MoreHorizontal className="h-5 w-5 text-[var(--text-muted)] opacity-60 hover:opacity-100" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-44 bg-[var(--bg-card)] rounded-xl shadow-2xl overflow-hidden z-30 border border-[var(--border-main)]"
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                onMarkAsRead();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm hover:bg-[var(--bg-main)] text-[var(--text-main)] transition-colors"
            >
              <Mail className="h-4 w-4 mr-2 text-[var(--accent)]" />
              Mark as read
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
                setOpen(false);
              }}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-500/10 transition-colors"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
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
    <div className="flex h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      {/* LEFT */}
      <div className="w-full lg:w-2/5 bg-[var(--bg-card)] border-r border-[var(--border-main)] flex flex-col transition-colors duration-300">
        <div className="p-5 border-b border-[var(--border-main)] flex items-center gap-3">
          <Bell className="text-[var(--accent)]" />
          <h2 className="text-xl font-black tracking-tight">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-auto px-2.5 py-0.5 bg-[var(--accent)] text-white text-[10px] font-black rounded-full uppercase tracking-widest shadow-lg shadow-indigo-500/20">
              {unreadCount} New
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-main)] bg-[var(--bg-card)] overflow-x-auto no-scrollbar">
          {["All", "Classes", "Meetings", "Submissions", "Admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 min-w-fit px-4 py-4 text-xs font-black uppercase tracking-widest transition-all relative ${
                activeTab === tab
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] opacity-60 hover:opacity-100"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabUnderlineNotif"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                />
              )}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 no-scrollbar">
          {filtered.length === 0 ? (
            <div className="p-10 text-center text-[var(--text-muted)] opacity-50 uppercase tracking-widest text-[10px] font-black">
              No notifications found
            </div>
          ) : (
            filtered.map((n) => (
              <div
                key={n.id}
                onClick={() => {
                  setSelected(n);
                  if (!n.read) markAsRead(n.id);
                }}
                className={`p-5 border-b border-[var(--border-main)] cursor-pointer transition-all hover:bg-[var(--bg-main)] group ${
                  n.read ? "bg-[var(--bg-card)]" : "bg-[var(--accent)]/5"
                }`}
              >
                <div className="flex justify-between items-start gap-4">
                  <div
                    dangerouslySetInnerHTML={{ __html: n.message }}
                    className={`text-sm leading-relaxed ${
                      !n.read
                        ? "font-bold text-[var(--text-main)]"
                        : "text-[var(--text-muted)]"
                    }`}
                  />
                  {!n.read && (
                    <div className="w-2 h-2 rounded-full bg-[var(--accent)] mt-1.5 shrink-0" />
                  )}
                </div>

                <div className="flex justify-between mt-3 text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)] opacity-60">
                  {formatTime(n.createdAt)}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <NotificationOptionsDropdown
                      notif={n}
                      onMarkAsRead={() => markAsRead(n.id)}
                      onRemove={() => removeNotification(n.id)}
                    />
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* RIGHT - Preview Pane */}
      <div className="hidden lg:flex flex-1 items-center justify-center bg-[var(--bg-main)] transition-colors duration-300">
        {selected ? (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            key={selected.id}
            className="max-w-xl w-full mx-10 bg-[var(--bg-card)] p-10 rounded-[2.5rem] shadow-2xl border border-[var(--border-main)]"
          >
            <div className="p-3 bg-[var(--accent)]/10 w-fit rounded-2xl mb-6">
              <Bell className="text-[var(--accent)] w-6 h-6" />
            </div>
            <h3 className="font-black text-2xl mb-4 tracking-tight text-[var(--text-main)]">
              {selected.context || "Notification Details"}
            </h3>
            <div
              dangerouslySetInnerHTML={{ __html: selected.message }}
              className="text-[var(--text-main)] opacity-80 leading-relaxed text-lg mb-8"
            />
            <div className="flex items-center gap-2 text-xs font-black text-[var(--text-muted)] uppercase tracking-[0.2em]">
              <Clock size={14} className="text-[var(--accent)]" />
              {formatTime(selected.createdAt)}
            </div>
          </motion.div>
        ) : (
          <div className="text-center">
            <div className="w-20 h-20 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-full flex items-center justify-center mx-auto mb-4 opacity-40">
              <Search className="text-[var(--text-muted)] w-8 h-8" />
            </div>
            <p className="text-[var(--text-muted)] font-black uppercase tracking-[0.2em] text-[10px]">
              Select a notification to view content
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

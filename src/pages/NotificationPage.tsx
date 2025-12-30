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
      <button onClick={() => setOpen(!open)}>
        <MoreHorizontal className="h-5 w-5 text-gray-400" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-44 bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden z-30"
          >
            <button
              onClick={onMarkAsRead}
              className="flex items-center w-full px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <Mail className="h-4 w-4 mr-2" />
              Mark as read
            </button>

            <button
              onClick={onRemove}
              className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
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
    <div className="flex h-screen bg-gray-100 dark:bg-gray-950">
      {/* LEFT */}
      <div className="w-full lg:w-2/5 bg-white dark:bg-gray-900 border-r">
        <div className="p-5 border-b flex items-center gap-3">
          <Bell className="text-blue-500" />
          <h2 className="text-xl font-bold">Notifications</h2>
          {unreadCount > 0 && (
            <span className="ml-auto px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
              {unreadCount}
            </span>
          )}
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          {["All", "Classes", "Meetings", "Submissions", "Admin"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-3 text-sm font-bold ${
                activeTab === tab
                  ? "text-blue-600 border-b-2 border-blue-600"
                  : "text-gray-400"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* List */}
        <div className="overflow-y-auto">
          {filtered.map((n) => (
            <div
              key={n.id}
              onClick={() => {
                setSelected(n);
                if (!n.read) markAsRead(n.id);
              }}
              className={`p-4 border-b cursor-pointer ${
                n.read ? "bg-white" : "bg-blue-50 dark:bg-blue-900/20"
              }`}
            >
              <div
                dangerouslySetInnerHTML={{ __html: n.message }}
                className="text-sm"
              />
              <div className="flex justify-between mt-2 text-xs text-gray-400">
                {formatTime(n.createdAt)}
                <NotificationOptionsDropdown
                  notif={n}
                  onMarkAsRead={() => markAsRead(n.id)}
                  onRemove={() => removeNotification(n.id)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT */}
      <div className="hidden lg:flex flex-1 items-center justify-center text-gray-400">
        {selected ? (
          <div className="max-w-xl bg-white dark:bg-gray-900 p-6 rounded-xl shadow">
            <h3 className="font-bold text-lg mb-3">{selected.context}</h3>
            <div
              dangerouslySetInnerHTML={{ __html: selected.message }}
              className="text-gray-600 dark:text-gray-300"
            />
          </div>
        ) : (
          <p>Select a notification</p>
        )}
      </div>
    </div>
  );
};

export default NotificationPage;

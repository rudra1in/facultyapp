import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  ChevronDown,
  X,
  Trash2,
  Calendar as CalendarIcon,
  Clock,
  Sparkles,
  Zap,
  Target,
  Star,
  ShieldCheck,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { calendarService } from "../services/calendar.service";

/* ================= TYPES ================= */

interface AcademicEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  courseId: string | null;
  color: string;
  isUserEvent: boolean;
  startTime?: string;
  endTime?: string;
}

const categoryColorMap: Record<string, string> = {
  Quiz: "bg-orange-500/10 text-orange-500 border-orange-500/20 shadow-[0_0_15px_rgba(249,115,22,0.1)]",
  Assignment:
    "bg-yellow-500/10 text-yellow-600 border-yellow-500/20 shadow-[0_0_15px_rgba(234,179,8,0.1)]",
  Exam: "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.1)]",
  Meeting:
    "bg-red-500/10 text-red-500 border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]",
  "Office Hour":
    "bg-green-500/10 text-green-500 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
  Other: "bg-gray-500/10 text-gray-400 border-gray-500/20",
};

const allCategories = [
  "All Categories",
  "Quiz",
  "Assignment",
  "Exam",
  "Meeting",
  "Office Hour",
  "Other",
];

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
const AestheticSparkle = ({
  delay = 0,
  size = 12,
}: {
  delay?: number;
  size?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 2, repeat: Infinity, delay, ease: "easeInOut" }}
    className="absolute pointer-events-none text-yellow-400"
  >
    <Sparkles size={size} fill="currentColor" />
  </motion.div>
);

/* ================= EVENT DETAILS MODAL ================= */
const EventDetailsModal = ({ isOpen, event, onClose, onDelete }: any) => {
  if (!isOpen || !event) return null;
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xl flex items-center justify-center z-[110] p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.8, opacity: 0, y: 40 }}
        className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.5)] p-12 w-full max-w-md border border-[var(--border-main)] relative overflow-hidden"
      >
        <div className="absolute -top-10 -right-10 p-8 opacity-[0.05] text-[var(--accent)]">
          <CalendarIcon size={200} />
        </div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-10">
            <span
              className={`px-5 py-2 rounded-full text-[9px] font-black uppercase tracking-[0.2em] border shadow-lg ${event.color}`}
            >
              {event.category}
            </span>
            <button
              onClick={onClose}
              className="p-3 bg-[var(--bg-main)] rounded-2xl text-[var(--text-muted)] hover:text-red-500 hover:scale-110 transition-all border border-[var(--border-main)]"
            >
              <X size={20} strokeWidth={3} />
            </button>
          </div>
          <h3 className="text-5xl font-black tracking-tighter text-[var(--text-main)] mb-8 leading-none italic uppercase">
            {event.title}
          </h3>
          <div className="space-y-4 mb-10">
            <div className="flex items-center gap-4 p-5 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-main)] transition-colors group hover:border-[var(--accent)]">
              <CalendarIcon size={20} className="text-[var(--accent)]" />
              <span className="font-bold text-[var(--text-main)]">
                {new Date(event.date).toLocaleDateString("en-IN", {
                  dateStyle: "full",
                })}
              </span>
            </div>
            {(event.startTime || event.endTime) && (
              <div className="flex items-center gap-4 p-5 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-main)]">
                <Clock size={20} className="text-orange-500" />
                <span className="font-bold text-[var(--text-main)] uppercase tracking-tighter">
                  {event.startTime} — {event.endTime}
                </span>
              </div>
            )}
          </div>
          <div className="flex gap-4">
            {event.isUserEvent && (
              <button
                onClick={() => {
                  onDelete(event.id);
                  onClose();
                }}
                className="flex-1 bg-red-500 text-white px-6 py-5 rounded-[1.8rem] flex items-center justify-center gap-3 font-black uppercase text-[10px] tracking-[0.2em] shadow-xl shadow-red-500/20 active:scale-95 transition-all"
              >
                <Trash2 size={16} /> Purge Task
              </button>
            )}
            <button
              onClick={onClose}
              className="flex-1 bg-[var(--bg-main)] text-[var(--text-main)] px-6 py-5 rounded-[1.8rem] font-black uppercase text-[10px] tracking-[0.2em] border border-[var(--border-main)] hover:bg-[var(--bg-card)] transition-all"
            >
              Dismiss
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ================= MAIN COMPONENT ================= */
const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<AcademicEvent[]>([]);
  const [currentDate, setCurrentDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
  );
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    null
  );
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [modalCategory, setModalCategory] = useState("All Categories");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");

  useEffect(() => {
    calendarService.getUpcomingEvents().then((data) => {
      const mapped = data.map((e: any) => ({
        ...e,
        isUserEvent: e.userEvent,
        color: categoryColorMap[e.category] || categoryColorMap.Other,
      }));
      setEvents(mapped);
    });
  }, []);

  const toLocalDateString = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const calendarDays = useMemo(() => {
    const days: (Date | null)[] = [];
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    for (let i = 0; i < firstDayOfMonth(year, month); i++) days.push(null);
    for (let d = 1; d <= daysInMonth(year, month); d++)
      days.push(new Date(year, month, d));
    return days;
  }, [currentDate]);

  const filteredEvents = useMemo(() => {
    return events.filter(
      (e) =>
        selectedCategory === "All Categories" || e.category === selectedCategory
    );
  }, [events, selectedCategory]);

  const getEventsForDay = (day: Date | null) => {
    if (!day) return [];
    return filteredEvents.filter((e) => e.date === toLocalDateString(day));
  };

  const saveEvent = async () => {
    if (!selectedDate || modalCategory === "All Categories") return;
    const saved = await calendarService.createEvent({
      title: modalCategory,
      category: modalCategory,
      date: selectedDate,
      startTime,
      endTime,
    });
    setEvents((prev) => [
      ...prev,
      { ...saved, isUserEvent: true, color: categoryColorMap[saved.category] },
    ]);
    setIsCenterOpen(false);
  };

  const handleDeleteEvent = async (id: number) => {
    await calendarService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-500 font-sans relative overflow-hidden">
      {/* BACKGROUND SPARKLE SYSTEM */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        {[...Array(20)].map((_, i) => (
          <AestheticSparkle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 15}
          />
        ))}
      </div>

      <div className="p-4 md:p-10 max-w-7xl mx-auto relative z-10">
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          event={selectedEvent}
          onClose={() => setIsDetailsModalOpen(false)}
          onDelete={handleDeleteEvent}
        />

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[var(--bg-card)] p-10 rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.2)] border border-[var(--border-main)] mb-12 gap-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12 text-[var(--accent)]">
            <CalendarIcon size={160} />
          </div>

          <div className="flex items-center gap-8 relative">
            <motion.div
              whileHover={{ rotate: 15 }}
              className="p-6 bg-[var(--accent)] rounded-[2rem] text-white shadow-2xl shadow-indigo-500/40"
            >
              <CalendarIcon size={40} strokeWidth={2.5} />
            </motion.div>
            <div>
              <h1 className="text-6xl font-black tracking-tighter uppercase italic leading-none">
                Academic <span className="text-[var(--accent)]">Sync.</span>
              </h1>
              <div className="flex items-center gap-3 mt-3">
                <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50">
                  Operational Scheduler Uplink v4.2
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 relative">
            <div className="flex items-center bg-[var(--bg-main)] border-2 border-[var(--border-main)] rounded-[1.8rem] p-2 shadow-inner">
              <button
                className="p-3 bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white rounded-2xl transition-all shadow-sm"
                onClick={() =>
                  setCurrentDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft size={22} strokeWidth={3} />
              </button>
              <span className="font-black w-48 text-center text-sm uppercase tracking-widest text-[var(--text-main)]">
                {currentDate.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                className="p-3 bg-[var(--bg-card)] hover:bg-[var(--accent)] hover:text-white rounded-2xl transition-all shadow-sm"
                onClick={() =>
                  setCurrentDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
                  )
                }
              >
                <ChevronRight size={22} strokeWidth={3} />
              </button>
            </div>

            <motion.button
              whileHover={{ y: -4 }}
              onClick={() =>
                setCurrentDate(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                )
              }
              className="px-8 py-4 bg-[var(--bg-card)] border-2 border-[var(--border-main)] text-[var(--text-main)] font-black rounded-2xl text-[10px] uppercase tracking-widest hover:border-[var(--accent)] transition-all"
            >
              Today
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, y: -4 }}
              onClick={() => {
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setIsCenterOpen(true);
              }}
              className="bg-[var(--accent)] text-white px-10 py-4 rounded-[1.5rem] flex items-center gap-3 shadow-[0_20px_40px_rgba(0,0,0,0.2)] font-black uppercase tracking-widest text-[10px]"
            >
              <Plus size={18} strokeWidth={4} /> Initialize Node
            </motion.button>
          </div>
        </div>

        {/* CALENDAR CORE GRID */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-[var(--bg-card)] p-12 rounded-[4rem] shadow-2xl border border-[var(--border-main)] relative"
        >
          <div className="grid grid-cols-7 mb-12 border-b border-[var(--border-main)] pb-8">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-[11px] font-black text-[var(--text-muted)] uppercase tracking-[0.5em]"
              >
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-5">
            {calendarDays.map((day, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.01 }}
                whileHover={day ? { scale: 1.02, zIndex: 10 } : {}}
                className={`min-h-[160px] border-2 rounded-[2.5rem] p-5 transition-all group relative overflow-hidden ${
                  !day
                    ? "bg-[var(--bg-main)]/20 border-transparent opacity-20"
                    : "cursor-pointer bg-[var(--bg-main)]/30 border-[var(--border-main)] hover:border-[var(--accent)] shadow-sm hover:shadow-2xl"
                }`}
                onClick={() => {
                  if (day) {
                    setSelectedDate(toLocalDateString(day));
                    setIsCenterOpen(true);
                  }
                }}
              >
                {day && (
                  <div
                    className={`text-[12px] font-black mb-5 flex items-center justify-center w-10 h-10 rounded-2xl transition-all ${
                      toLocalDateString(day) === toLocalDateString(new Date())
                        ? "bg-[var(--accent)] text-white shadow-xl shadow-indigo-500/30 scale-125"
                        : "text-[var(--text-muted)] group-hover:text-[var(--accent)]"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                )}

                <div className="space-y-3">
                  {getEventsForDay(day).map((event) => (
                    <motion.div
                      key={event.id}
                      whileHover={{ x: 5 }}
                      className={`text-[9px] px-4 py-2.5 rounded-[1.2rem] border border-white/5 font-black uppercase tracking-widest shadow-xl truncate flex items-center gap-2 ${event.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      <motion.div
                        animate={{ opacity: [1, 0.4, 1] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"
                      />
                      {event.title}
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* MODAL GALAXY: REGISTER TASK */}
        <AnimatePresence>
          {isCenterOpen && (
            <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-[120] p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0, rotateX: 20 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--bg-card)] p-16 rounded-[4.5rem] w-full max-w-xl border-2 border-[var(--border-main)] shadow-[0_60px_120px_-20px_rgba(0,0,0,0.5)] relative"
              >
                <div className="absolute top-0 left-0 w-full h-full opacity-[0.02] pointer-events-none grayscale">
                  <Zap size={400} />
                </div>

                <div className="flex justify-between items-center mb-12">
                  <div>
                    <h2 className="text-5xl font-black tracking-tighter text-[var(--text-main)] uppercase italic">
                      Register{" "}
                      <span className="text-[var(--accent)]">Task.</span>
                    </h2>
                    <p className="text-[9px] font-black uppercase tracking-[0.4em] opacity-40 mt-2">
                      Initialize temporal node
                    </p>
                  </div>
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="p-4 bg-[var(--bg-main)] rounded-[1.5rem] text-[var(--text-muted)] hover:text-red-500 hover:rotate-90 transition-all border border-[var(--border-main)]"
                  >
                    <X size={24} strokeWidth={4} />
                  </button>
                </div>

                <div className="space-y-8 relative z-10">
                  <div className="group">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mb-4 ml-4 block opacity-50">
                      Protocol Selection
                    </label>
                    <div className="relative">
                      <select
                        value={modalCategory}
                        onChange={(e) => setModalCategory(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[2rem] px-10 py-6 outline-none focus:border-[var(--accent)] font-black text-xs transition-all uppercase tracking-widest appearance-none shadow-inner"
                      >
                        {allCategories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-10 top-1/2 -translate-y-1/2 pointer-events-none opacity-40"
                        size={18}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] mb-4 ml-4 block opacity-50">
                        Timeline
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[1.8rem] px-8 py-6 outline-none focus:border-[var(--accent)] font-black text-xs transition-all shadow-inner"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="flex flex-col">
                        <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 ml-2 opacity-50">
                          Start
                        </label>
                        <input
                          type="time"
                          value={startTime}
                          onChange={(e) => setStartTime(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[1.5rem] px-4 py-5 outline-none font-black text-xs uppercase"
                        />
                      </div>
                      <div className="flex flex-col">
                        <label className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-4 ml-2 opacity-50">
                          End
                        </label>
                        <input
                          type="time"
                          value={endTime}
                          onChange={(e) => setEndTime(e.target.value)}
                          className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[1.5rem] px-4 py-5 outline-none font-black text-xs uppercase"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-5 mt-16 relative">
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex gap-4">
                    <AestheticSparkle delay={0.2} />
                    <AestheticSparkle delay={0.8} />
                  </div>
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="flex-1 px-8 py-6 bg-[var(--bg-main)] text-[var(--text-main)] border-2 border-[var(--border-main)] rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[10px] hover:bg-red-500/10 transition-colors"
                  >
                    Abourt
                  </button>
                  <button
                    onClick={saveEvent}
                    className="flex-1 px-8 py-6 bg-[var(--accent)] text-white rounded-[2.2rem] font-black uppercase tracking-[0.2em] text-[10px] shadow-2xl shadow-indigo-500/40 active:scale-95 hover:scale-105 transition-all"
                  >
                    Establish Uplink
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CalendarPage;

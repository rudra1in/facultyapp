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

/* ================= CATEGORY COLORS ================= */
// Updated to use semantic mapping that works across all 4 themes
const categoryColorMap: Record<string, string> = {
  Quiz: "bg-orange-500/10 text-orange-600 border-orange-500/20",
  Assignment:
    "bg-yellow-500/10 text-yellow-700 dark:text-yellow-500 border-yellow-500/20",
  Exam: "bg-blue-500/10 text-blue-600 border-blue-500/20",
  Meeting: "bg-red-500/10 text-red-600 border-red-500/20",
  "Office Hour": "bg-green-500/10 text-green-600 border-green-500/20",
  Other: "bg-gray-500/10 text-gray-600 border-gray-500/20",
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

/* ================= EVENT DETAILS MODAL ================= */

const EventDetailsModal = ({ isOpen, event, onClose, onDelete }: any) => {
  if (!isOpen || !event) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-[var(--bg-card)] rounded-[2rem] shadow-2xl p-8 w-full max-w-sm border border-[var(--border-main)]"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl font-black tracking-tight text-[var(--text-main)]">
            {event.title}
          </h3>
          <button
            onClick={onClose}
            className="text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-3 text-[var(--text-muted)] font-medium">
            <CalendarIcon size={18} className="text-[var(--accent)]" />
            <span>
              {new Date(event.date).toLocaleDateString("en-IN", {
                dateStyle: "full",
              })}
            </span>
          </div>

          {(event.startTime || event.endTime) && (
            <div className="flex items-center gap-3 text-[var(--text-muted)] font-medium">
              <Clock size={18} className="text-[var(--accent)]" />
              <span>
                {event.startTime || "Start"} — {event.endTime || "End"}
              </span>
            </div>
          )}
        </div>

        <div className="mt-6">
          <span
            className={`inline-block px-4 py-1.5 text-[10px] font-black uppercase tracking-widest rounded-full border ${event.color}`}
          >
            {event.category}
          </span>
        </div>

        <div className="mt-8 flex gap-3">
          {event.isUserEvent && (
            <button
              onClick={() => {
                onDelete(event.id);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-3 rounded-xl flex items-center justify-center gap-2 font-bold transition-all"
            >
              <Trash2 size={16} /> Delete
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-[var(--bg-main)] text-[var(--text-main)] px-4 py-3 rounded-xl font-bold border border-[var(--border-main)]"
          >
            Close
          </button>
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
        id: e.id,
        title: e.title,
        date: e.date,
        category: e.category,
        courseId: null,
        isUserEvent: e.userEvent,
        startTime: e.startTime,
        endTime: e.endTime,
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
    if (!selectedDate || modalCategory === "All Categories") {
      alert("Please select date and category");
      return;
    }

    const saved = await calendarService.createEvent({
      title: modalCategory,
      category: modalCategory,
      date: selectedDate,
      startTime,
      endTime,
    });

    setEvents((prev) => [
      ...prev,
      {
        id: saved.id,
        title: saved.title,
        date: saved.date,
        category: saved.category,
        courseId: null,
        isUserEvent: true,
        color: categoryColorMap[saved.category],
      },
    ]);

    setIsCenterOpen(false);
    setModalCategory("All Categories");
    setStartTime("");
    setEndTime("");
  };

  const handleDeleteEvent = async (id: number) => {
    await calendarService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          event={selectedEvent}
          onClose={() => setIsDetailsModalOpen(false)}
          onDelete={handleDeleteEvent}
        />

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-[var(--bg-card)] p-6 rounded-3xl shadow-xl border border-[var(--border-main)] mb-8 gap-4 transition-all">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-[var(--accent)]/10 rounded-2xl">
              <CalendarIcon className="text-[var(--accent)]" size={28} />
            </div>
            <div>
              <h1 className="text-2xl md:text-4xl font-black tracking-tight">
                Academic Calendar
              </h1>
              <p className="text-[var(--text-muted)] text-sm font-medium">
                Stay synced with your faculty schedule
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-[var(--bg-main)] border border-[var(--border-main)] rounded-2xl p-1 shadow-inner">
              <button
                className="p-2.5 hover:bg-[var(--bg-card)] rounded-xl transition-all"
                onClick={() =>
                  setCurrentDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-black w-40 text-center text-sm md:text-base uppercase tracking-tighter">
                {currentDate.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                className="p-2.5 hover:bg-[var(--bg-card)] rounded-xl transition-all"
                onClick={() =>
                  setCurrentDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
                  )
                }
              >
                <ChevronRight size={20} />
              </button>
            </div>

            <button
              onClick={() =>
                setCurrentDate(
                  new Date(new Date().getFullYear(), new Date().getMonth(), 1)
                )
              }
              className="px-6 py-2.5 bg-[var(--accent)]/10 text-[var(--accent)] font-black rounded-2xl text-xs uppercase tracking-widest hover:bg-[var(--accent)] hover:text-white transition-all"
            >
              Today
            </button>

            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setIsCenterOpen(true);
              }}
              className="bg-[var(--accent)] hover:opacity-90 text-white px-6 py-2.5 rounded-2xl flex items-center gap-2 shadow-lg transition-all text-xs font-black uppercase tracking-widest"
            >
              <Plus size={16} strokeWidth={3} /> New Task
            </button>

            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-3 px-5 py-2.5 border border-[var(--border-main)] rounded-2xl bg-[var(--bg-main)] shadow-sm text-xs font-black uppercase tracking-widest outline-none transition-all hover:border-[var(--accent)]"
              >
                <Filter size={16} className="text-[var(--text-muted)]" />
                <span>{selectedCategory}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute right-0 mt-3 w-56 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl shadow-2xl z-50 py-2 overflow-hidden backdrop-blur-md"
                  >
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left px-5 py-3 text-xs font-bold hover:bg-[var(--accent)] hover:text-white transition-colors uppercase tracking-widest"
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* CALENDAR GRID */}
        <div className="bg-[var(--bg-card)] p-8 rounded-[2.5rem] shadow-xl border border-[var(--border-main)] transition-all">
          <div className="grid grid-cols-7 mb-6">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em]"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-3">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-[110px] md:min-h-[140px] border border-[var(--border-main)] rounded-3xl p-3 transition-all group relative ${
                  !day
                    ? "bg-[var(--bg-main)] opacity-30"
                    : "cursor-pointer hover:bg-[var(--bg-main)] hover:border-[var(--accent)]/50"
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
                    className={`text-xs font-black mb-3 flex items-center justify-center w-8 h-8 rounded-xl transition-all ${
                      toLocalDateString(day) === toLocalDateString(new Date())
                        ? "bg-[var(--accent)] text-white shadow-lg shadow-indigo-500/30 scale-110"
                        : "text-[var(--text-muted)] group-hover:text-[var(--text-main)]"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                )}

                <div className="space-y-1.5">
                  {getEventsForDay(day).map((event) => (
                    <div
                      key={event.id}
                      className={`text-[9px] px-3 py-1.5 rounded-xl border-l-[3px] font-black uppercase tracking-tighter shadow-sm transition-transform hover:scale-105 truncate ${event.color}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedEvent(event);
                        setIsDetailsModalOpen(true);
                      }}
                    >
                      {event.title}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ADD EVENT MODAL */}
        <AnimatePresence>
          {isCenterOpen && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[100] p-4 transition-all">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[var(--bg-card)] p-8 rounded-[2.5rem] w-full max-w-md border border-[var(--border-main)] shadow-2xl"
              >
                <div className="flex justify-between items-center mb-8">
                  <h2 className="text-3xl font-black tracking-tight text-[var(--text-main)]">
                    Create Task
                  </h2>
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="p-2 rounded-full hover:bg-[var(--bg-main)] transition-colors"
                  >
                    <X className="text-[var(--text-muted)]" />
                  </button>
                </div>

                <div className="space-y-5">
                  <div>
                    <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                      Task Category
                    </label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold transition-all"
                    >
                      {allCategories.map((c) => (
                        <option key={c} className="bg-[var(--bg-card)]">
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                      Event Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-3.5 outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                        Start
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-3.5 outline-none font-bold"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                        End
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-3.5 outline-none font-bold"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 mt-10">
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="flex-1 px-4 py-4 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl font-black uppercase tracking-widest text-xs transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEvent}
                    className="flex-1 px-4 py-4 bg-[var(--accent)] hover:opacity-90 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg shadow-indigo-500/20 transition-all"
                  >
                    Save Task
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

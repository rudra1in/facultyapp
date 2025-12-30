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

const categoryColorMap: Record<string, string> = {
  Quiz: "bg-orange-200 dark:bg-orange-900/40 text-orange-800 dark:text-orange-300 border-orange-500",
  Assignment:
    "bg-yellow-200 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 border-yellow-500",
  Exam: "bg-blue-200 dark:bg-blue-900/40 text-blue-800 dark:text-blue-300 border-blue-500",
  Meeting:
    "bg-red-200 dark:bg-red-900/40 text-red-800 dark:text-red-300 border-red-500",
  "Office Hour":
    "bg-green-200 dark:bg-green-900/40 text-green-800 dark:text-green-300 border-green-500",
  Other:
    "bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-300 border-gray-500",
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 w-full max-w-sm border dark:border-gray-700"
      >
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold dark:text-white">{event.title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            <X size={20} />
          </button>
        </div>

        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Scheduled for:{" "}
          <span className="font-semibold">
            {new Date(event.date).toLocaleDateString("en-IN")}
          </span>
        </p>

        <span
          className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${event.color}`}
        >
          {event.category}
        </span>

        <div className="mt-6 flex gap-3">
          {event.isUserEvent && (
            <button
              onClick={() => {
                onDelete(event.id);
                onClose();
              }}
              className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              <Trash2 size={16} /> Delete Task
            </button>
          )}
          <button
            onClick={onClose}
            className="flex-1 bg-gray-100 dark:bg-gray-700 dark:text-white px-4 py-2 rounded-xl"
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-4 md:p-8 max-w-7xl mx-auto font-sans">
        <EventDetailsModal
          isOpen={isDetailsModalOpen}
          event={selectedEvent}
          onClose={() => setIsDetailsModalOpen(false)}
          onDelete={handleDeleteEvent}
        />

        {/* HEADER */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700 mb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="p-2 bg-indigo-100 dark:bg-indigo-900/40 rounded-lg">
              <CalendarIcon className="text-indigo-600 dark:text-indigo-400" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Faculty Scheduler
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
            <div className="flex items-center bg-gray-100 dark:bg-gray-700 rounded-xl p-1">
              <button
                className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all"
                onClick={() =>
                  setCurrentDate(
                    (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
                  )
                }
              >
                <ChevronLeft size={20} />
              </button>
              <span className="font-bold w-32 text-center text-sm md:text-base">
                {currentDate.toLocaleString("en-US", {
                  month: "long",
                  year: "numeric",
                })}
              </span>
              <button
                className="p-2 hover:bg-white dark:hover:bg-gray-600 rounded-lg transition-all"
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
              className="px-4 py-2 bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-semibold rounded-xl text-sm"
            >
              Today
            </button>

            <button
              onClick={() => {
                setSelectedDate(new Date().toISOString().split("T")[0]);
                setIsCenterOpen(true);
              }}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl flex items-center gap-2 shadow-lg transition-all text-sm"
            >
              <Plus size={16} /> New Task
            </button>

            <div className="relative">
              <button
                onClick={() => setIsCategoryOpen(!isCategoryOpen)}
                className="flex items-center gap-2 px-4 py-2 border dark:border-gray-600 rounded-xl bg-white dark:bg-gray-700 shadow-sm text-sm outline-none"
              >
                <Filter size={16} className="text-gray-400" />
                <span>{selectedCategory}</span>
                <ChevronDown size={16} />
              </button>

              <AnimatePresence>
                {isCategoryOpen && (
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-xl shadow-xl z-20 py-1 overflow-hidden"
                  >
                    {allCategories.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => {
                          setSelectedCategory(cat);
                          setIsCategoryOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50 dark:hover:bg-indigo-900/40 transition-colors"
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
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border dark:border-gray-700">
          <div className="grid grid-cols-7 mb-4">
            {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
              <div
                key={day}
                className="text-center text-xs font-bold text-gray-400 uppercase tracking-wider"
              >
                {day}
              </div>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-2">
            {calendarDays.map((day, idx) => (
              <div
                key={idx}
                className={`min-h-[100px] md:min-h-[130px] border dark:border-gray-700 rounded-xl p-2 transition-all hover:border-indigo-300 dark:hover:border-indigo-500 group relative ${
                  !day ? "bg-gray-50/50 dark:bg-gray-900/30" : "cursor-pointer"
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
                    className={`text-xs font-bold mb-2 flex items-center justify-center w-6 h-6 rounded-full transition-colors ${
                      toLocalDateString(day) === toLocalDateString(new Date())
                        ? "bg-indigo-600 text-white"
                        : "text-gray-600 dark:text-gray-400 group-hover:bg-gray-100 dark:group-hover:bg-gray-700"
                    }`}
                  >
                    {day.getDate()}
                  </div>
                )}

                <div className="space-y-1">
                  {getEventsForDay(day).map((event) => (
                    <div
                      key={event.id}
                      className={`text-[10px] px-2 py-1 rounded-md border-l-4 font-medium shadow-sm transition-transform hover:scale-105 truncate ${event.color}`}
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
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white dark:bg-gray-800 p-6 rounded-2xl w-full max-w-md border dark:border-gray-700 shadow-2xl"
              >
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold dark:text-white">
                    New Task
                  </h2>
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Category
                    </label>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {allCategories.map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        Start Time
                      </label>
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase mb-1">
                        End Time
                      </label>
                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-xl px-4 py-2.5 outline-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 mt-8">
                  <button
                    onClick={() => setIsCenterOpen(false)}
                    className="flex-1 px-4 py-3 bg-gray-100 dark:bg-gray-700 dark:text-white rounded-xl font-bold"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEvent}
                    className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 dark:shadow-none"
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

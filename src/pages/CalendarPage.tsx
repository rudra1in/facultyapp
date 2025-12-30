import React, { useState, useMemo, useEffect } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Filter,
  ChevronDown,
  CheckCircle,
  Clock,
  Calendar as CalendarIcon,
  UploadCloud,
  X,
  Trash2,
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
  meetingType?: "inhouse" | "outhouse";
  collegeName?: string;
  batch?: string;
  comments?: string;
}

/* ================= CATEGORY COLORS ================= */

const categoryColorMap: Record<string, string> = {
  Quiz: "bg-orange-200 text-orange-800 border-orange-500",
  Assignment: "bg-yellow-200 text-yellow-800 border-yellow-500",
  Exam: "bg-blue-200 text-blue-800 border-blue-500",
  Meeting: "bg-red-200 text-red-800 border-red-500",
  "Office Hour": "bg-green-200 text-green-800 border-green-500",
  Other: "bg-gray-200 text-gray-800 border-gray-500",
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
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-xl font-bold">{event.title}</h3>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <p className="text-sm mb-2">
          {new Date(event.date).toLocaleDateString("en-IN")}
        </p>

        <span
          className={`inline-block px-2 py-1 text-xs rounded ${event.color}`}
        >
          {event.category}
        </span>

        {event.isUserEvent && (
          <button
            onClick={() => {
              onDelete(event.id);
              onClose();
            }}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete
          </button>
        )}
      </div>
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

  /* ================= LOAD EVENTS ================= */

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

  /* ================= DATE UTILS ================= */

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

  /* ================= FILTER ================= */

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

  /* ================= SAVE EVENT ================= */

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

  /* ================= DELETE ================= */

  const handleDeleteEvent = async (id: number) => {
    await calendarService.deleteEvent(id);
    setEvents((prev) => prev.filter((e) => e.id !== id));
  };

  /* ================= UI ================= */

  return (
    <div className="p-4 md:p-8 font-sans bg-gray-50 min-h-screen">
      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        event={selectedEvent}
        onClose={() => setIsDetailsModalOpen(false)}
        onDelete={handleDeleteEvent}
      />

      {/* HEADER */}
      <div className="flex justify-between items-center bg-white p-6 rounded-xl shadow mb-6">
        <div className="flex items-center gap-4">
          <CalendarIcon className="text-indigo-600" />
          <h1 className="text-3xl font-bold">Faculty Scheduler</h1>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() =>
              setCurrentDate(
                (p) => new Date(p.getFullYear(), p.getMonth() - 1, 1)
              )
            }
          >
            <ChevronLeft />
          </button>

          <span className="font-bold w-32 text-center">
            {currentDate.toLocaleString("en-US", {
              month: "long",
              year: "numeric",
            })}
          </span>

          <button
            onClick={() =>
              setCurrentDate(
                (p) => new Date(p.getFullYear(), p.getMonth() + 1, 1)
              )
            }
          >
            <ChevronRight />
          </button>

          <button
            onClick={() =>
              setCurrentDate(
                new Date(new Date().getFullYear(), new Date().getMonth(), 1)
              )
            }
            className="ml-4 bg-indigo-100 px-3 py-1 rounded"
          >
            Today
          </button>

          <button
            onClick={() => {
              setSelectedDate(new Date().toISOString().split("T")[0]);
              setIsCenterOpen(true);
            }}
            className="ml-4 bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <Plus size={16} /> New Task
          </button>

          {/* CATEGORY FILTER */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center gap-2 px-4 py-2 border rounded-lg bg-white shadow text-sm"
            >
              <Filter size={16} />
              <span>{selectedCategory}</span>
              <ChevronDown size={16} />
            </button>

            {isCategoryOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white border rounded-lg shadow z-20">
                {allCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryOpen(false);
                    }}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-indigo-50"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* CALENDAR GRID */}
      <div className="grid grid-cols-7 gap-2 bg-white p-6 rounded-xl shadow">
        {calendarDays.map((day, idx) => (
          <div
            key={idx}
            className="min-h-[120px] border rounded-lg p-2 cursor-pointer"
            onClick={() => {
              if (day) {
                setSelectedDate(toLocalDateString(day));
                setIsCenterOpen(true);
              }
            }}
          >
            {day && (
              <div className="text-xs font-bold mb-1">{day.getDate()}</div>
            )}

            {getEventsForDay(day).map((event) => (
              <div
                key={event.id}
                className={`text-[10px] px-2 py-1 rounded mb-1 border-l-4 ${event.color}`}
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
        ))}
      </div>

      {/* ADD EVENT MODAL */}
      {isCenterOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Add Task</h2>

            <select
              value={modalCategory}
              onChange={(e) => setModalCategory(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            >
              {allCategories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>

            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full border rounded px-3 py-2 mb-3"
            />

            <div className="flex gap-2 mb-3">
              <input
                type="time"
                value={startTime}
                onChange={(e) => setStartTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
              <input
                type="time"
                value={endTime}
                onChange={(e) => setEndTime(e.target.value)}
                className="w-full border rounded px-3 py-2"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsCenterOpen(false)}
                className="px-4 py-2 bg-gray-200 rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveEvent}
                className="px-4 py-2 bg-indigo-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalendarPage;

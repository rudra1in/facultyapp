import React, { useState, useMemo, useCallback } from "react";
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

// --- Type Definitions for Academic Events ---
interface AcademicEvent {
  id: number;
  title: string;
  date: string;
  category: string;
  courseId: string | null;
  color: string;
  isUserEvent: boolean;

  startTime?: string; // "10:00"
  endTime?: string; // "12:30"
  meetingType?: "inhouse" | "outhouse";
  collegeName?: string;
  batch?: string;
  comments?: string;
}

// --- Mock Data ---
const mockEvents: AcademicEvent[] = [
  {
    id: 101,
    title: "CS 301 Quiz Grading Due",
    date: "2025-09-10",
    category: "Assignment",
    courseId: "CS 301",
    color: "bg-yellow-200 text-yellow-800 border-yellow-500",
    isUserEvent: true,
  },
  {
    id: 102,
    title: "Faculty Meeting: Curriculum",
    date: "2025-09-12",
    category: "Meeting",
    courseId: null,
    color: "bg-red-200 text-red-800 border-red-500",
    isUserEvent: false,
  },
  {
    id: 103,
    title: "EE 205 Lab Report Deadline",
    date: "2025-09-15",
    category: "Assignment",
    courseId: "EE 205",
    color: "bg-yellow-200 text-yellow-800 border-yellow-500",
    isUserEvent: true,
  },
  {
    id: 104,
    title: "Office Hours: 10:00 AM",
    date: "2025-09-20",
    category: "Office Hour",
    courseId: null,
    color: "bg-green-200 text-green-800 border-green-500",
    isUserEvent: true,
  },
  {
    id: 105,
    title: "Final Exam Start: CS 301",
    date: "2025-09-24",
    category: "Exam",
    courseId: "CS 301",
    color: "bg-blue-200 text-blue-800 border-blue-500",
    isUserEvent: false,
  },
  {
    id: 107,
    title: "New Seminar Planning",
    date: "2025-09-25",
    category: "Meeting",
    courseId: "CS 301",
    color: "bg-purple-200 text-purple-800 border-purple-500",
    isUserEvent: true,
  },
];

const allCategories = [
  "All Categories",
  "Quiz",
  "Assignment",
  "Exam",
  "Meeting",
  "Office Hour",
  "Other",
];

// --- Event Details and Delete Modal Component ---
interface EventDetailsModalProps {
  isOpen: boolean;
  event: AcademicEvent | null;
  onClose: () => void;
  onDelete: (id: number) => void;
}

const EventDetailsModal: React.FC<EventDetailsModalProps> = ({
  isOpen,
  event,
  onClose,
  onDelete,
}) => {
  if (!isOpen || !event) return null;

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete the event: ${event.title}?`
      )
    ) {
      onDelete(event.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-2xl font-bold text-gray-900">{event.title}</h3>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="space-y-3 p-4 border border-gray-200 rounded-lg">
          <div className="flex items-center text-sm font-medium text-gray-700">
            <CalendarIcon size={16} className="mr-2 text-indigo-500" />
            Date:{" "}
            <span className="ml-2 font-bold">
              {new Date(event.date).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </span>
          </div>
          <div className="flex items-center text-sm font-medium text-gray-700">
            <Clock size={16} className="mr-2 text-indigo-500" />
            Type:{" "}
            <span
              className={`ml-2 font-bold px-2 py-0.5 rounded-full text-xs ${event.color}`}
            >
              {event.category}
            </span>
          </div>
          {event.courseId && (
            <div className="flex items-center text-sm font-medium text-gray-700">
              <span className="w-4 mr-2"></span>
              Course:{" "}
              <span className="ml-2 font-bold text-indigo-600">
                {event.courseId}
              </span>
            </div>
          )}
          <div className="text-sm text-gray-600 border-t pt-3 mt-3">
            <span className="font-semibold">Source:</span>{" "}
            {event.isUserEvent
              ? "Your Personal Schedule"
              : "Official University Calendar"}
          </div>
        </div>

        {event.isUserEvent && (
          <div className="flex justify-end pt-4">
            <button
              onClick={handleDelete}
              className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 text-sm font-medium transition shadow-md"
            >
              <Trash2 size={16} />
              <span>Delete Schedule</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// --- Main Calendar Page Component ---
export const CalendarPage: React.FC = () => {
  const [view, setView] = useState<"month" | "week" | "day">("month");
  const [currentDate, setCurrentDate] = useState(() => {
    const now = new Date();
    return new Date(now.getFullYear(), now.getMonth(), 1);
  });

  const [selectedCategory, setSelectedCategory] = useState("All Categories");

  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const [focusedEvents, setFocusedEvents] = useState<AcademicEvent[] | null>(
    null
  );
  const [focusedLabel, setFocusedLabel] =
    useState<string>("Next Hard Deadline");
  const [isCenterOpen, setIsCenterOpen] = useState(false);
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [meetingType, setMeetingType] = useState<"inhouse" | "outhouse" | "">(
    ""
  );
  const [collegeName, setCollegeName] = useState("");
  const [batch, setBatch] = useState("");
  const [comments, setComments] = useState("");
  const [selectedDate, setSelectedDate] = useState<string>(""); // IMPORTANT
  // const [taskTitle, setTaskTitle] = useState("");
  const [modalCategory, setModalCategory] = useState("All Categories");

  // State for events and modals
  const [events, setEvents] = useState<AcademicEvent[]>(mockEvents);
  // const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  // const [modalDefaultDate, setModalDefaultDate] = useState(new Date());
  const [selectedEvent, setSelectedEvent] = useState<AcademicEvent | null>(
    null
  );

  // --- Core Calendar Logic ---
  const currentMonthYear = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate);
  const daysInMonth = (year: number, month: number) =>
    new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) =>
    new Date(year, month, 1).getDay();

  const getCalendarDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < startDay; i++) days.push(null);
    for (let i = 1; i <= numDays; i++) days.push(new Date(year, month, i));
    return days;
  };

  const calendarDays = useMemo(
    () => getCalendarDays(currentDate),
    [currentDate]
  );

  const goToPreviousMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1)
    );
  const goToNextMonth = () =>
    setCurrentDate(
      (prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1)
    );
  const goToToday = () => setCurrentDate(new Date());
  const toLocalDateString = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");
    return `${y}-${m}-${d}`;
  };

  // --- Filtering Logic ---
  const filteredEvents = useMemo(() => {
    return events
      .filter((event) => {
        const categoryMatch =
          selectedCategory === "All Categories" ||
          event.category === selectedCategory;
        // const courseMatch =
        //   selectedCourse === "All Courses" || event.courseId === selectedCourse;
        return categoryMatch;
      })
      .sort((a, b) => a.date.localeCompare(b.date));
  }, [selectedCategory, events]);

  const getEventsForDay = (day: Date | null) => {
    if (!day) return [];
    const dayString = toLocalDateString(day);

    return filteredEvents.filter((event) => event.date === dayString);
  };

  // --- CRUD Event Handlers ---
  // const handleAddEvent = useCallback(
  //   (
  //     eventData: Omit<AcademicEvent, "id" | "color" | "isUserEvent"> & {
  //       color: string;
  //     }
  //   ) => {
  //     const newEvent: AcademicEvent = {
  //       ...eventData,
  //       id: Date.now(),
  //       isUserEvent: true,
  //     };
  //     // API CALL: POST /api/v1/schedules
  //     setEvents((prev) => [...prev, newEvent]);
  //     // setIsAddModalOpen(false); // Close the modal upon successful save
  //   },
  //   []
  // );

  const handleDeleteEvent = useCallback((id: number) => {
    // API CALL: DELETE /api/v1/schedules/{id}
    setEvents((prev) => prev.filter((event) => event.id !== id));
  }, []);

  // --- UI Interaction Handlers ---

  const handleDayClick = (day: Date | null) => {
    if (!day) return;

    const clickedDateStr = toLocalDateString(day);

    setSelectedDate(clickedDateStr);

    const clickedMonth = day.getMonth();
    const clickedYear = day.getFullYear();

    // 🔥 EVENTS FROM CLICKED DATE → END OF THAT MONTH
    const monthUpcomingEvents = events
      .filter((event) => {
        const eventDate = new Date(event.date);
        return (
          eventDate.getFullYear() === clickedYear &&
          eventDate.getMonth() === clickedMonth &&
          event.date >= clickedDateStr
        );
      })
      .sort((a, b) => a.date.localeCompare(b.date));

    setFocusedEvents(monthUpcomingEvents);

    setFocusedLabel(
      `Upcoming events from ${day.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })}`
    );

    setIsCenterOpen(true);
  };

  {
    /* Total Time */
  }

  const handleEventClick = (event: AcademicEvent) => {
    setSelectedEvent(event);
    setIsDetailsModalOpen(true);
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    setIsCategoryOpen(false);
  };

  // const handleCourseSelect = (course: string) => {
  //   setSelectedCourse(course);
  //   setIsCourseOpen(false);
  // };

  // --- Next Task Widget Logic ---
  const nextTask = useMemo(() => {
    const todayString = toLocalDateString(new Date());

    const upcomingEvents = events.filter((e) => e.date >= todayString);
    return upcomingEvents.length > 0
      ? upcomingEvents.sort((a, b) => a.date.localeCompare(b.date))[0]
      : null;
  }, [events]);

  function setTaskTitle(_arg0: string) {
    throw new Error("Function not implemented.");
  }

  // --- UI Structure ---
  return (
    <div className="p-4 md:p-8 font-sans bg-gray-50 min-h-screen">
      {/* Modals */}
      {/* <AddEventModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddEvent}
        defaultDate={modalDefaultDate}
      /> */}

      <EventDetailsModal
        isOpen={isDetailsModalOpen}
        event={selectedEvent}
        onClose={() => setIsDetailsModalOpen(false)}
        onDelete={handleDeleteEvent}
      />

      {/* Header and Controls */}
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center bg-white p-6 rounded-xl shadow-xl border-t-4 border-400 mb-6">
        {/* Title and Navigation */}
        <div className="flex items-center space-x-6 mb-4 lg:mb-0">
          <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
            <CalendarIcon size={28} className="mr-3 text-indigo-600" />
            Faculty Scheduler
          </h1>
          <div className="flex items-center space-x-1 border border-gray-300 rounded-lg p-1 bg-gray-50">
            <button
              onClick={goToPreviousMonth}
              className="p-1 hover:bg-gray-200 rounded-md transition"
            >
              <ChevronLeft size={20} className="text-gray-600" />
            </button>
            <span className="font-bold text-gray-800 mx-2 w-32 text-center">
              {currentMonthYear}
            </span>
            <button
              onClick={goToNextMonth}
              className="p-1 hover:bg-gray-200 rounded-md transition"
            >
              <ChevronRight size={20} className="text-gray-600" />
            </button>
          </div>
          <button
            onClick={goToToday}
            className="hidden sm:block px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm font-medium hover:bg-indigo-100 transition"
          >
            Today
          </button>
        </div>

        {/* Filters and Actions */}
        <div className="flex flex-wrap gap-3 items-center mt-4 lg:mt-0">
          {/* View Toggle (New Addition) */}
          <div className="flex border border-gray-300 rounded-lg overflow-hidden text-sm font-medium shadow-sm">
            <button
              onClick={() => setView("month")}
              className={`px-3 py-2 transition ${
                view === "month"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Month
            </button>
            <button
              onClick={() => setView("week")}
              className={`px-3 py-2 transition border-l border-r border-gray-300 ${
                view === "week"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setView("day")}
              className={`px-3 py-2 transition ${
                view === "day"
                  ? "bg-indigo-600 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Day
            </button>
          </div>

          {/* Filter Dropdowns */}
          <div className="relative">
            <button
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="flex items-center space-x-2 bg-white px-4 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-100 transition w-full"
            >
              <Filter size={16} />
              <span>{selectedCategory}</span>
              <ChevronDown
                size={16}
                className={`transform transition-transform ${
                  isCategoryOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isCategoryOpen && (
              <div className="absolute top-12 right-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-10">
                {allCategories.map((category) => (
                  <button
                    key={category}
                    onClick={() => handleCategorySelect(category)}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50 hover:text-indigo-700 transition"
                  >
                    {category}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* New Task Button */}
          <button
            onClick={() => {
              const today = new Date().toISOString().split("T")[0];
              setSelectedDate(today); // date auto-filled

              setIsCenterOpen(true); // OPEN detailed modal
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm font-medium transition shadow-md"
          >
            <Plus size={16} />
            <span>New Task</span>
          </button>
        </div>
      </div>

      {/* Main Content: Calendar and Next Task Widget */}
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Calendar Grid (Main Content) */}
        <div className="lg:w-3/4 bg-white rounded-xl shadow-lg p-6">
          {view === "month" && (
            <div>
              {/* Day Labels */}
              <div className="grid grid-cols-7 text-center text-sm font-bold text-indigo-600 border-b-2 border-indigo-100 pb-3 mb-3">
                <div>Sun</div>
                <div>Mon</div>
                <div>Tue</div>
                <div>Wed</div>
                <div>Thu</div>
                <div>Fri</div>
                <div>Sat</div>
              </div>
              {/* Days Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((day, index) => {
                  const dayEvents = getEventsForDay(day);
                  const isCurrentDay =
                    day && day.toDateString() === new Date().toDateString();

                  return (
                    <div
                      key={index}
                      className={`min-h-[120px] p-2 border border-gray-200 rounded-lg relative transition-shadow duration-150 ease-in-out cursor-pointer ${
                        day
                          ? "bg-white hover:shadow-lg"
                          : "bg-gray-50 text-gray-400"
                      }`}
                      onClick={() => handleDayClick(day)}
                    >
                      {day && (
                        <span
                          className={`absolute top-2 right-2 text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full ${
                            isCurrentDay
                              ? "bg-indigo-600 text-white shadow-lg border-2 border-white"
                              : "text-gray-800"
                          }`}
                        >
                          {day.getDate()}
                        </span>
                      )}
                      <div className="mt-8 space-y-1">
                        {dayEvents.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-[10px] px-2 py-1 rounded-md border-l-4 truncate font-medium cursor-pointer transition-transform hover:scale-[1.02] ${event.color}`}
                            title={`${event.title} (${event.category})`}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEventClick(event);

                              setFocusedEvents([event]);
                              setFocusedLabel(
                                new Date(event.date).toLocaleDateString(
                                  "en-IN",
                                  {
                                    day: "numeric",
                                    month: "long",
                                    year: "numeric",
                                  }
                                )
                              );
                            }}
                          >
                            {event.courseId && (
                              <span className="font-bold mr-1">
                                [{event.courseId}]
                              </span>
                            )}
                            {event.title}
                          </div>
                        ))}
                        {dayEvents.length > 2 && (
                          <div
                            className="text-xs text-gray-500 mt-1 pl-2 hover:text-indigo-600"
                            onClick={(e) => {
                              e.stopPropagation();
                              alert(
                                `Viewing all ${
                                  dayEvents.length
                                } events for ${day?.toDateString()}`
                              );
                            }}
                          >
                            +{dayEvents.length - 2} more events...
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
          {/* No Events Placeholder */}
          {view === "month" && filteredEvents.length === 0 && (
            <div className="text-center text-gray-500 mt-4 p-12 border-t border-dashed">
              <UploadCloud className="h-10 w-10 mx-auto mb-4 text-indigo-300" />
              <p className="text-lg font-medium">
                No events match the current filter(s).
              </p>
              <p className="text-sm">
                Try selecting **"All Categories"** and **"All Courses"** to view
                the full university schedule.
              </p>
            </div>
          )}
          {/* Week/Day View Placeholder */}
          {(view === "week" || view === "day") && (
            <div className="text-center text-xl font-semibold text-gray-700 min-h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-lg">
              <p className="mb-4">
                The detailed **{view} view** is coming soon!
              </p>
              <p className="text-sm text-gray-500">
                Currently showing a filtered list of upcoming events for{" "}
                {currentMonthYear}.
              </p>
            </div>
          )}
        </div>
        {/* Right Sidebar: Next Task Widget (Sticky) */}
        <div className="lg:w-1/4">
          <div className="bg-indigo-700 text-white rounded-xl shadow-xl p-5 sticky lg:top-8">
            <div className="bg-indigo-700 text-white rounded-xl shadow-xl p-5 sticky lg:top-8">
              <h3 className="text-lg font-bold mb-3 flex items-center">
                <Clock size={20} className="mr-2" />
                {focusedLabel}
              </h3>

              {/* CLICKED DATE / EVENT VIEW */}
              {/* CENTER DATE CONTAINER */}
              {/* CENTER TASK CONTAINER */}
              {isCenterOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
                    {/* HEADER */}
                    <div className="flex justify-between items-center mb-4">
                      <h2 className="text-xl font-bold text-indigo-700">
                        Task / Meeting Details
                      </h2>
                      <button
                        onClick={() => setIsCenterOpen(false)}
                        className="text-gray-500 hover:text-gray-700 text-xl"
                      >
                        ✕
                      </button>
                    </div>
                    <select
                      value={modalCategory}
                      onChange={(e) => setModalCategory(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg bg-gray-50
  text-gray-800 px-3 py-2 mb-3
  focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      {allCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>

                    {/* TIME */}
                    <div className="flex items-center gap-2 mb-3">
                      <input
                        type="time"
                        value={startTime}
                        onChange={(e) => setStartTime(e.target.value)}
                        className="w-full rounded-lg border border-gray-300
             bg-gray-50 text-gray-800
             px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />

                      <span className="font-bold text-gray-700">-</span>

                      <input
                        type="time"
                        value={endTime}
                        onChange={(e) => setEndTime(e.target.value)}
                        className="w-full rounded-lg border border-gray-300
             bg-gray-50 text-gray-800
             px-3 py-2
             focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                    <div>
                      <p
                        className="w-full rounded-lg border border-gray-300 bg-gray-50 text-gray-800
             px-3 py-2 "
                      >
                        Total Time: {calculateTotalTime(startTime, endTime)}
                      </p>
                      <br />
                    </div>
                    {/* DATE */}
                    <div className="mb-3">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) => setSelectedDate(e.target.value)}
                        className="w-full rounded-lg border border-gray-300
      bg-gray-50 text-gray-800
      px-3 py-2
      focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>

                    {/* CATEGORY */}
                    <select
                      value={meetingType}
                      onChange={(e) => setMeetingType(e.target.value as any)}
                      className="w-full border border-gray-300 rounded-lg bg-grey-50 text-gray-800 px-3 py-2 mb-3"
                    >
                      <option value="">Select Category</option>
                      <option value="inhouse">Inhouse</option>
                      <option value="outhouse">Outhouse</option>
                    </select>

                    {/* COLLEGE */}
                    <input
                      type="text"
                      value={collegeName}
                      onChange={(e) => setCollegeName(e.target.value)}
                      placeholder="College Name"
                      className="w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-800 px-3 py-2 mb-3"
                    />

                    {/* BATCH */}
                    <input
                      type="text"
                      value={batch}
                      onChange={(e) => setBatch(e.target.value)}
                      placeholder="Batch"
                      className="w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-800 px-3 py-2 mb-3"
                    />

                    {/* COMMENTS */}
                    <textarea
                      value={comments}
                      onChange={(e) => setComments(e.target.value)}
                      placeholder="Comments"
                      className="w-full border border-gray-300 rounded-lg bg-gray-50 text-gray-800 px-3 py-2"
                      rows={3}
                    />

                    {/* SAVE & CANCEL BUTTONS */}
                    <div className="flex justify-end gap-3 mt-6">
                      {/* Cancel */}
                      <button
                        onClick={() => {
                          setModalCategory("All Categories"); // ✅ STEP-6
                          setStartTime("");
                          setEndTime("");
                          setIsCenterOpen(false);
                        }}
                        className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg
               hover:bg-gray-300 transition"
                      >
                        Cancel
                      </button>

                      {/* Save */}
                      <button
                        onClick={() => {
                          if (!startTime || !endTime || !selectedDate) {
                            alert("Please fill time and date");
                            return;
                          }
                          if (modalCategory === "All Categories") {
                            alert("Please select a specific category");
                            return;
                          }

                          // const generatedTitle =
                          //   taskTitle.trim() ||
                          //   collegeName.trim() ||
                          //   (batch ? `Batch ${batch}` : "Task / Meeting");

                          const newEvent: AcademicEvent = {
                            id: Date.now(),

                            // ✅ STEP-4 (HERE)
                            title: modalCategory,
                            category: modalCategory,

                            date: selectedDate,
                            courseId: null,
                            color:
                              modalCategory === "Quiz"
                                ? "bg-orange-200 text-orange-800 border-orange-500"
                                : modalCategory === "Assignment"
                                ? "bg-yellow-200 text-yellow-800 border-yellow-500"
                                : modalCategory === "Exam"
                                ? "bg-blue-200 text-blue-800 border-blue-500"
                                : modalCategory === "Meeting"
                                ? "bg-red-200 text-red-800 border-red-500"
                                : modalCategory === "Office Hour"
                                ? "bg-green-200 text-green-800 border-green-500"
                                : "bg-gray-200 text-gray-800 border-gray-500",

                            isUserEvent: true,
                            startTime,
                            endTime,
                            meetingType: meetingType || undefined,
                            collegeName,
                            batch,
                            comments,
                          };

                          setEvents((prev) => [...prev, newEvent]); // ✅ SAVE TO CALENDAR

                          // Reset
                          // ✅ STEP-5 RESET (HERE)
                          setModalCategory("All Categories");
                          setStartTime("");
                          setEndTime("");
                          setMeetingType("");
                          setCollegeName("");
                          setBatch("");
                          setComments("");
                          setIsCenterOpen(false);
                        }}
                        className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 flex items-center gap-2"
                      >
                        <CheckCircle size={18} />
                        Save Task
                      </button>
                    </div>
                  </div>
                </div>
              )}

              <AnimatePresence mode="wait">
                {focusedEvents ? (
                  focusedEvents.length > 0 ? (
                    focusedEvents.map((event) => (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, y: 15 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -15 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-2 mb-3"
                        onClick={() => handleEventClick(event)}
                      >
                        <p className="text-xl font-bold">{event.title}</p>
                        <p className="text-sm opacity-80">
                          {event.category}
                          {event.courseId ? ` • ${event.courseId}` : ""}
                        </p>
                        <p className="text-sm text-yellow-300 font-semibold">
                          {new Date(event.date).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          })}
                        </p>
                      </motion.div>
                    ))
                  ) : (
                    <motion.p
                      key="no-events"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-sm opacity-80"
                    >
                      No events on this date.
                    </motion.p>
                  )
                ) : nextTask ? (
                  <motion.div
                    key="next-deadline"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.3 }}
                    className="space-y-2"
                  >
                    <p className="text-2xl font-extrabold">{nextTask.title}</p>
                    <p className="text-sm opacity-80">
                      {nextTask.category}
                      {nextTask.courseId ? ` • ${nextTask.courseId}` : ""}
                    </p>
                    <div className="pt-3 border-t border-indigo-500">
                      <p className="text-sm font-bold text-yellow-300">
                        Due Date:
                      </p>
                      <p className="text-xl font-bold">
                        {new Date(nextTask.date).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </motion.div>
                ) : (
                  <motion.p
                    key="clear"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-sm opacity-80"
                  >
                    No upcoming deadlines 🎉
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
const calculateTotalTime = (start: string = "", end: string = ""): string => {
  if (!start || !end) return "—";

  const [sh, sm] = start.split(":").map(Number);
  const [eh, em] = end.split(":").map(Number);

  const startMinutes = sh * 60 + sm;
  const endMinutes = eh * 60 + em;

  const diff = endMinutes - startMinutes;
  if (diff <= 0) return "—";

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;

  return `${hours}h ${minutes}m`;
};

export default CalendarPage;

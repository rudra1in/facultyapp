import React, { useState, useEffect } from "react";
import {
  Calendar,
  Clock,
  Users,
  TrendingUp,
  TrendingDown,
  Plus,
  Filter,
  MoreHorizontal,
  Search,
  Star,
  CalendarCheck,
  CheckCircle,
  Clock as ClockIcon,
} from "lucide-react";
import { motion } from "framer-motion";

// Helper type for sessions
interface Session {
  id: number;
  name: string;
  faculty: string;
  category: string;
  type: "In-house" | "Out-house";
  duration: string;
  date: string; // YYYY-MM-DD
  status: "Completed" | "Scheduled" | "In progress";
  participants: number;
  rating: number;
}

// Helper for date comparison
const isDateWithinPeriod = (dateStr: string, period: string): boolean => {
  const sessionDate = new Date(dateStr);
  const today = new Date();
  let comparisonDate = new Date(today);

  switch (period) {
    case "last7Days":
      comparisonDate.setDate(today.getDate() - 7);
      break;
    case "thisMonth":
      comparisonDate = new Date(today.getFullYear(), today.getMonth(), 1);
      break;
    case "lastMonth":
      comparisonDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      break;
    default:
      return true;
  }
  return sessionDate >= comparisonDate;
};

const handleViewSessionDetails = (sessionId: number) =>
  console.log(`Navigating to session details for ID: ${sessionId}`);

const OverviewPage = () => {
  const initialSessions: Session[] = [
    {
      id: 101,
      name: "Advanced Mathematics",
      faculty: "Dr. Sarah Johnson",
      category: "Mathematics",
      type: "In-house",
      duration: "2h 30m",
      date: "2025-10-01",
      status: "Completed",
      participants: 25,
      rating: 4.5,
    },
    {
      id: 102,
      name: "Introduction to Physics",
      faculty: "Prof. Michael Chen",
      category: "Physics",
      type: "Out-house",
      duration: "1h 45m",
      date: "2025-10-04",
      status: "Scheduled",
      participants: 18,
      rating: 0,
    },
    {
      id: 103,
      name: "Data Structures",
      faculty: "Dr. Emily Davis",
      category: "Computer Science",
      type: "In-house",
      duration: "3h 00m",
      date: "2025-09-28",
      status: "In progress",
      participants: 32,
      rating: 0,
    },
    {
      id: 104,
      name: "Organic Chemistry Lab",
      faculty: "Dr. Robert Wilson",
      category: "Chemistry",
      type: "In-house",
      duration: "4h 00m",
      date: "2025-09-15",
      status: "Completed",
      participants: 15,
      rating: 4.8,
    },
    {
      id: 105,
      name: "Literature Analysis",
      faculty: "Prof. Amanda Brown",
      category: "English",
      type: "Out-house",
      duration: "2h 00m",
      date: "2025-10-03",
      status: "Completed",
      participants: 22,
      rating: 4.2,
    },
  ];

  const [sessions, setSessions] = useState<Session[]>(initialSessions);
  const [filteredSessions, setFilteredSessions] =
    useState<Session[]>(initialSessions);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedTimePeriod, setSelectedTimePeriod] = useState("allTime");
  const [quickFilterStatus, setQuickFilterStatus] = useState<string>("All");

  const completedSessions = sessions.filter(
    (s) => s.status === "Completed" && s.rating > 0
  );
  const totalRating = completedSessions.reduce((sum, s) => sum + s.rating, 0);
  const averageRating =
    completedSessions.length > 0
      ? (totalRating / completedSessions.length).toFixed(1)
      : "N/A";
  const ratingTrend = averageRating > "4.0" ? "up" : "down";

  const metrics = [
    {
      id: 1,
      title: "Sessions This Month",
      value: sessions
        .filter((s) => isDateWithinPeriod(s.date, "thisMonth"))
        .length.toString(),
      change: "+12%",
      changeText: "vs last month",
      icon: CalendarCheck,
      iconBg: "bg-purple-100 dark:bg-purple-900/30",
      iconColor: "text-purple-600 dark:text-purple-400",
      trend: "up",
    },
    {
      id: 2,
      title: "Total Hours",
      value: "1,248",
      change: "+8%",
      changeText: "vs last month",
      icon: Clock,
      iconBg: "bg-blue-100 dark:bg-blue-900/30",
      iconColor: "text-blue-600 dark:text-blue-400",
      trend: "up",
    },
    {
      id: 3,
      title: "Active Faculty",
      value: "89",
      change: "+5%",
      changeText: "vs last month",
      icon: Users,
      iconBg: "bg-green-100 dark:bg-green-900/30",
      iconColor: "text-green-600 dark:text-green-400",
      trend: "up",
    },
    {
      id: 4,
      title: "Avg. Session Rating",
      value: averageRating,
      change: ratingTrend === "up" ? "+0.2" : "-0.1",
      changeText: "vs last month",
      icon: Star,
      iconBg: "bg-orange-100 dark:bg-orange-900/30",
      iconColor: "text-orange-600 dark:text-orange-400",
      trend: ratingTrend,
    },
  ];

  useEffect(() => {
    let tempSessions = [...sessions];
    if (selectedTimePeriod !== "allTime") {
      tempSessions = tempSessions.filter((session) =>
        isDateWithinPeriod(session.date, selectedTimePeriod)
      );
    }
    if (selectedCategory) {
      tempSessions = tempSessions.filter(
        (session) => session.category === selectedCategory
      );
    }
    if (quickFilterStatus !== "All") {
      tempSessions = tempSessions.filter(
        (session) => session.status === quickFilterStatus
      );
    }
    if (searchTerm) {
      tempSessions = tempSessions.filter(
        (session) =>
          session.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          session.faculty.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    setFilteredSessions(tempSessions);
  }, [
    sessions,
    searchTerm,
    selectedCategory,
    selectedTimePeriod,
    quickFilterStatus,
  ]);

  const handleNewSession = () => {
    const newSession: Session = {
      id: Date.now(),
      name: "New Scheduled Session",
      faculty: "New Faculty",
      category: "General",
      type: "In-house",
      duration: "1h 00m",
      date: new Date().toISOString().slice(0, 10),
      status: "Scheduled",
      participants: Math.floor(Math.random() * 50) + 5,
      rating: 0,
    };
    setSessions((prevSessions) => [newSession, ...prevSessions]);
  };

  const getStatusColor = (status: Session["status"]) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400";
      case "In progress":
        return "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400";
      case "Scheduled":
        return "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400";
      default:
        return "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: { [key: string]: string } = {
      Mathematics:
        "bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400",
      Physics:
        "bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400",
      "Computer Science":
        "bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-400",
      Chemistry:
        "bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-400",
      English: "bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400",
    };
    return (
      colors[category] ||
      "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300"
    );
  };

  const allCategories = [
    ...new Set(sessions.map((session) => session.category)),
  ];

  const statusQuickFilters = [
    { label: "All", value: "All", icon: Filter },
    { label: "Scheduled", value: "Scheduled", icon: Calendar },
    { label: "In Progress", value: "In progress", icon: ClockIcon },
    { label: "Completed", value: "Completed", icon: CheckCircle },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Dashboard Overview 📊
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Monitor your faculty sessions, performance, and key quality
              metrics.
            </p>
          </div>
          <motion.button
            onClick={handleNewSession}
            className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-4 h-4 mr-2" />
            New Session
          </motion.button>
        </div>

        {/* Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {metrics.map((metric) => (
            <motion.div
              key={metric.id}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 flex flex-col justify-between"
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 ${metric.iconBg} rounded-xl flex items-center justify-center`}
                >
                  <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                  {metric.title}
                </p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  {metric.value}
                </p>
                <div className="flex items-center text-sm font-medium">
                  {metric.trend === "up" ? (
                    <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  ) : (
                    <TrendingDown className="w-4 h-4 text-red-500 mr-1" />
                  )}
                  <span
                    className={
                      metric.trend === "up" ? "text-green-600" : "text-red-600"
                    }
                  >
                    {metric.change}
                  </span>
                  <span className="text-gray-500 dark:text-gray-500 ml-1">
                    {metric.changeText}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Sessions Table Container */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between space-y-4 lg:space-y-0">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Recent Sessions Activity
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <select
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={selectedTimePeriod}
                  onChange={(e) => setSelectedTimePeriod(e.target.value)}
                >
                  <option value="allTime">All Time</option>
                  <option value="last7Days">Last 7 Days</option>
                  <option value="thisMonth">This Month</option>
                  <option value="lastMonth">Last Month</option>
                </select>

                <div className="relative">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search..."
                    className="bg-white dark:bg-gray-700 pl-9 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-indigo-500 outline-none text-gray-700 dark:text-gray-200"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <select
                  className="bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 text-sm text-gray-700 dark:text-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  <option value="">All Categories</option>
                  {allCategories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Quick Filter Status Tabs */}
          <div className="p-4 border-b border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 flex flex-wrap gap-2">
            {statusQuickFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setQuickFilterStatus(filter.value)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full flex items-center transition-all ${
                  quickFilterStatus === filter.value
                    ? "bg-indigo-600 text-white shadow-md"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600"
                }`}
              >
                <filter.icon className="w-4 h-4 mr-1.5" />
                {filter.label}
              </button>
            ))}
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-900/50">
                <tr>
                  {[
                    "Session",
                    "Faculty",
                    "Category",
                    "Type",
                    "Duration",
                    "Date",
                    "Status",
                    "Rating",
                    "Actions",
                  ].map((header) => (
                    <th
                      key={header}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider"
                    >
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredSessions.map((session) => (
                  <tr
                    key={session.id}
                    className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900 dark:text-white">
                      {session.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {session.faculty}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getCategoryColor(
                          session.category
                        )}`}
                      >
                        {session.category}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {session.type}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {session.duration}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-700 dark:text-gray-300">
                      {session.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                          session.status
                        )}`}
                      >
                        {session.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-900 dark:text-gray-200">
                        {session.rating > 0 ? (
                          <>
                            <Star className="w-4 h-4 text-yellow-400 mr-1 fill-yellow-400" />
                            {session.rating.toFixed(1)}
                          </>
                        ) : (
                          <span className="text-gray-400">N/A</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
                        <MoreHorizontal className="w-5 h-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

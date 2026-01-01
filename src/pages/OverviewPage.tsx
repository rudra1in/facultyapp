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
  Sparkles,
  Zap,
  LayoutGrid,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- TYPES (UNCHANGED) ---
interface Session {
  id: number;
  name: string;
  faculty: string;
  category: string;
  type: "In-house" | "Out-house";
  duration: string;
  date: string;
  status: "Completed" | "Scheduled" | "In progress";
  participants: number;
  rating: number;
}

// --- AESTHETIC SPARKLE COMPONENT ---
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
    className="absolute pointer-events-none text-yellow-400 z-20"
  >
    <Sparkles size={size} fill="currentColor" />
  </motion.div>
);

// --- HELPERS (UNCHANGED) ---
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

const OverviewPage = () => {
  const statusQuickFilters = [
    {
      label: "All",
      value: "All",
      icon: LayoutGrid,
    },
    {
      label: "Completed",
      value: "Completed",
      icon: CheckCircle,
    },
    {
      label: "In Progress",
      value: "In progress",
      icon: ClockIcon,
    },
    {
      label: "Scheduled",
      value: "Scheduled",
      icon: Calendar,
    },
  ];
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
      title: "Monthly Load",
      value: sessions
        .filter((s) => isDateWithinPeriod(s.date, "thisMonth"))
        .length.toString(),
      change: "+12%",
      icon: CalendarCheck,
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-600",
      trend: "up",
    },
    {
      id: 2,
      title: "Total Effort",
      value: "1,248h",
      change: "+8%",
      icon: Clock,
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-600",
      trend: "up",
    },
    {
      id: 3,
      title: "Active Nodes",
      value: "89",
      change: "+5%",
      icon: Users,
      iconBg: "bg-green-500/10",
      iconColor: "text-green-600",
      trend: "up",
    },
    {
      id: 4,
      title: "Quality Index",
      value: averageRating,
      change: ratingTrend === "up" ? "+0.2" : "-0.1",
      icon: Star,
      iconBg: "bg-orange-500/10",
      iconColor: "text-orange-600",
      trend: ratingTrend,
    },
  ];

  useEffect(() => {
    let temp = [...sessions];
    if (selectedTimePeriod !== "allTime")
      temp = temp.filter((s) => isDateWithinPeriod(s.date, selectedTimePeriod));
    if (selectedCategory)
      temp = temp.filter((s) => s.category === selectedCategory);
    if (quickFilterStatus !== "All")
      temp = temp.filter((s) => s.status === quickFilterStatus);
    if (searchTerm) {
      const q = searchTerm.toLowerCase();
      temp = temp.filter(
        (s) =>
          s.name.toLowerCase().includes(q) ||
          s.faculty.toLowerCase().includes(q)
      );
    }
    setFilteredSessions(temp);
  }, [
    sessions,
    searchTerm,
    selectedCategory,
    selectedTimePeriod,
    quickFilterStatus,
  ]);

  const allCategories = ["Faculty", "Students", "Reports", "Attendance"];

  const handleNewSession = () => {
    const newSession: Session = {
      id: Date.now(),
      name: "Strategic Sync Session",
      faculty: "Lead Node",
      category: "General",
      type: "In-house",
      duration: "1h 00m",
      date: new Date().toISOString().slice(0, 10),
      status: "Scheduled",
      participants: 10,
      rating: 0,
    };
    setSessions((prev) => [newSession, ...prev]);
  };

  const statusMap = {
    Completed: "bg-green-500/10 text-green-500 border-green-500/20",
    "In progress":
      "bg-blue-500/10 text-blue-500 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    Scheduled: "bg-orange-500/10 text-orange-500 border-orange-500/20",
  };

  const catColors: any = {
    Mathematics: "text-blue-500 bg-blue-500/5",
    Physics: "text-emerald-500 bg-emerald-500/5",
    "Computer Science": "text-purple-500 bg-purple-500/5",
    Chemistry: "text-orange-500 bg-orange-500/5",
    English: "text-rose-500 bg-rose-500/5",
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-500 overflow-hidden font-sans">
      <div className="p-4 md:p-10 max-w-7xl mx-auto relative">
        {/* Background Decorative Sparkles */}
        <div className="absolute inset-0 pointer-events-none opacity-20">
          {[...Array(10)].map((_, i) => (
            <AestheticSparkle
              key={i}
              delay={Math.random() * 5}
              size={Math.random() * 20}
            />
          ))}
        </div>

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-12 gap-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)] shadow-inner">
                <LayoutGrid size={20} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-60">
                System Intelligence
              </span>
            </div>
            <h1 className="text-5xl font-black tracking-tighter leading-[0.9] uppercase italic">
              Node <span className="text-[var(--accent)]">Overview.</span>
            </h1>
            <p className="text-[var(--text-muted)] font-medium mt-3 max-w-md">
              Real-time analytical readout of faculty protocols and session
              efficiency.
            </p>
          </motion.div>

          <div className="relative group">
            <AestheticSparkle delay={0.5} size={24} />
            <motion.button
              onClick={handleNewSession}
              whileHover={{ scale: 1.05, y: -4 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[var(--accent)] text-white px-10 py-5 rounded-[2rem] font-black uppercase tracking-widest text-xs shadow-[0_20px_40px_rgba(0,0,0,0.2)] flex items-center gap-3 border border-white/20 transition-all"
            >
              <Plus className="w-5 h-5 stroke-[4]" /> Initialize Sync
            </motion.button>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {metrics.map((metric, index) => (
            <motion.div
              key={metric.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, borderColor: "var(--accent)" }}
              className="bg-[var(--bg-card)] rounded-[3rem] p-8 border border-[var(--border-main)] group shadow-xl relative overflow-hidden transition-all"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <metric.icon size={100} />
              </div>
              <div
                className={`w-14 h-14 ${metric.iconBg} rounded-[1.5rem] flex items-center justify-center mb-10 shadow-inner group-hover:scale-110 transition-transform`}
              >
                <metric.icon
                  className={`w-7 h-7 ${metric.iconColor}`}
                  strokeWidth={2.5}
                />
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] mb-2 opacity-50">
                  {metric.title}
                </p>
                <p className="text-4xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                  {metric.value}
                </p>
                <div className="flex items-center mt-5 text-[10px] font-black uppercase tracking-widest">
                  <div
                    className={`flex items-center px-2 py-1 rounded-full ${
                      metric.trend === "up"
                        ? "bg-green-500/10 text-green-500"
                        : "bg-red-500/10 text-red-500"
                    }`}
                  >
                    {metric.trend === "up" ? (
                      <TrendingUp size={12} className="mr-1" strokeWidth={3} />
                    ) : (
                      <TrendingDown
                        size={12}
                        className="mr-1"
                        strokeWidth={3}
                      />
                    )}
                    {metric.change}
                  </div>
                  <span className="text-[var(--text-muted)] ml-2 opacity-40 italic">
                    Differential
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* DATA TERMINAL CONTAINER */}
        <div className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_40px_100px_rgba(0,0,0,0.2)] border border-[var(--border-main)] overflow-hidden relative">
          {/* Internal Ghost Backdrop */}
          <div className="absolute top-0 right-0 p-10 opacity-[0.02] rotate-12">
            <Zap size={300} />
          </div>

          {/* TABLE HEADER/CONTROLS */}
          <div className="p-10 border-b border-[var(--border-main)] backdrop-blur-xl relative z-10">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-8">
              <div>
                <h2 className="text-2xl font-black text-[var(--text-main)] tracking-tighter uppercase italic flex items-center gap-3">
                  <ShieldCheck className="text-[var(--accent)]" /> Protocol Log
                </h2>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mt-2 opacity-40">
                  System Core Correspondence
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-4 w-full xl:w-auto">
                <div className="relative group flex-1 min-w-[240px]">
                  <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors" />
                  <input
                    type="text"
                    placeholder="IDENTIFY NODE..."
                    className="w-full bg-[var(--bg-main)] border-2 border-transparent pl-12 pr-6 py-4 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-main)] placeholder:opacity-30 focus:border-[var(--accent)] transition-all shadow-inner outline-none"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <select
                    className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-lg cursor-pointer"
                    value={selectedTimePeriod}
                    onChange={(e) => setSelectedTimePeriod(e.target.value)}
                  >
                    <option value="allTime">Full Cycle</option>
                    <option value="last7Days">Last 7D</option>
                    <option value="thisMonth">Current MO</option>
                  </select>

                  <select
                    className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl px-6 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all shadow-lg cursor-pointer"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Spheres</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat.toUpperCase()}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* QUICK FILTER NAVIGATION */}
          <div className="px-10 py-5 bg-[var(--bg-main)]/40 flex flex-wrap gap-4 border-b border-[var(--border-main)]">
            {statusQuickFilters.map((f) => (
              <motion.button
                key={f.value}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setQuickFilterStatus(f.value)}
                className={`px-6 py-2.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full flex items-center transition-all border-2 ${
                  quickFilterStatus === f.value
                    ? "bg-[var(--accent)] border-[var(--accent)] text-white shadow-xl shadow-indigo-500/20"
                    : "bg-transparent border-[var(--border-main)] text-[var(--text-muted)] hover:border-[var(--accent)]"
                }`}
              >
                <f.icon className="w-3 h-3 mr-2" />
                {f.label}
              </motion.button>
            ))}
          </div>

          {/* QUANTUM TABLE */}
          <div className="overflow-x-auto no-scrollbar relative z-10 bg-[var(--bg-card)]">
            <table className="min-w-full">
              <thead>
                <tr className="text-left border-b border-[var(--border-main)] bg-[var(--bg-main)]/20">
                  {[
                    "Protocol Node",
                    "Neural Faculty",
                    "Sphere",
                    "Timeline",
                    "Status",
                    "Index",
                    "Access",
                  ].map((h) => (
                    <th
                      key={h}
                      className="px-10 py-6 text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] opacity-50"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]/50">
                <AnimatePresence mode="popLayout">
                  {filteredSessions.map((session, idx) => (
                    <motion.tr
                      key={session.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ delay: idx * 0.03 }}
                      className="hover:bg-[var(--bg-main)]/30 transition-all group cursor-default"
                    >
                      <td className="px-10 py-8 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="font-black text-sm text-[var(--text-main)] uppercase tracking-tighter">
                            {session.name}
                          </span>
                          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-50">
                            NODE_REF_{session.id}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap text-xs font-black text-[var(--text-main)] uppercase tracking-tight">
                        {session.faculty}
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap">
                        <span
                          className={`px-4 py-1.5 text-[9px] font-black uppercase tracking-widest rounded-xl border ${
                            catColors[session.category] ||
                            "bg-gray-500/10 text-gray-500 border-gray-500/20"
                          }`}
                        >
                          {session.category}
                        </span>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap">
                        <div className="flex flex-col">
                          <span className="text-xs font-black text-[var(--text-main)] tracking-tighter uppercase">
                            {session.date}
                          </span>
                          <span className="text-[9px] font-bold text-[var(--text-muted)] uppercase opacity-50 mt-1">
                            {session.duration}
                          </span>
                        </div>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-4 py-1.5 text-[9px] font-black uppercase tracking-[0.2em] rounded-full border-2 ${
                            statusMap[session.status] ||
                            "bg-gray-500/10 text-gray-400 border-gray-500/20"
                          }`}
                        >
                          <div
                            className={`w-1.5 h-1.5 rounded-full mr-2 ${
                              session.status === "In progress"
                                ? "bg-blue-500 animate-pulse shadow-[0_0_8px_blue]"
                                : "bg-current opacity-40"
                            }`}
                          />
                          {session.status}
                        </span>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap">
                        <div className="flex items-center font-black text-xs text-[var(--text-main)]">
                          {session.rating > 0 ? (
                            <div className="flex items-center gap-1.5 bg-yellow-500/10 text-yellow-600 px-3 py-1 rounded-lg border border-yellow-500/20 shadow-sm">
                              <Star className="w-3 h-3 fill-current" />{" "}
                              {session.rating.toFixed(1)}
                            </div>
                          ) : (
                            <span className="text-[9px] opacity-20 italic uppercase tracking-widest">
                              Pending
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-10 py-8 whitespace-nowrap text-right">
                        <button className="p-3 bg-[var(--bg-main)] rounded-2xl text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] hover:shadow-xl transition-all group-hover:scale-110">
                          <ArrowUpRight size={20} strokeWidth={3} />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OverviewPage;

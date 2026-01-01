import React, { useState, useEffect, useRef } from "react";
import {
  Download,
  Calendar,
  TrendingUp,
  TrendingDown,
  Users,
  Clock,
  BarChart3,
  PieChart,
  FileText,
  Filter,
  Eye,
  X,
  ChevronDown,
  FileText as FileTextIcon,
  FileSpreadsheet,
  Sparkles,
  Zap,
  ShieldCheck,
  ChevronUp,
  Star,
} from "lucide-react";
import { motion, AnimatePresence, useInView } from "framer-motion";

// --- Data Definitions (Unchanged) ---
const reportMetricsData = [
  {
    title: "Total Sessions",
    value: "1,248",
    change: "+12.5%",
    trend: "up",
    icon: Calendar,
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-600",
  },
  {
    title: "Faculty Utilization",
    value: "87.3%",
    change: "+3.2%",
    trend: "up",
    icon: Users,
    iconBg: "bg-green-500/10",
    iconColor: "text-green-600",
  },
  {
    title: "Avg. Session Duration",
    value: "2h 15m",
    change: "-5.1%",
    trend: "down",
    icon: Clock,
    iconBg: "bg-purple-500/10",
    iconColor: "text-purple-600",
  },
  {
    title: "Completion Rate",
    value: "94.7%",
    change: "+2.8%",
    trend: "up",
    icon: TrendingUp,
    iconBg: "bg-orange-500/10",
    iconColor: "text-orange-600",
  },
];

const categoryPerformanceData = [
  {
    category: "Computer Science",
    sessions: 128,
    hours: 384,
    completion: 96.2,
    avgRating: 4.8,
    color: "bg-purple-500",
    id: "cs",
  },
  {
    category: "Mathematics",
    sessions: 85,
    hours: 255,
    completion: 94.1,
    avgRating: 4.6,
    color: "bg-blue-500",
    id: "math",
  },
  {
    category: "Chemistry",
    sessions: 72,
    hours: 216,
    completion: 93.8,
    avgRating: 4.7,
    color: "bg-orange-500",
    id: "chemistry",
  },
  {
    category: "Physics",
    sessions: 64,
    hours: 192,
    completion: 92.5,
    avgRating: 4.5,
    color: "bg-green-500",
    id: "physics",
  },
  {
    category: "Biology",
    sessions: 58,
    hours: 174,
    completion: 95.1,
    avgRating: 4.9,
    color: "bg-teal-500",
    id: "biology",
  },
  {
    category: "English Literature",
    sessions: 45,
    hours: 135,
    completion: 89.3,
    avgRating: 4.4,
    color: "bg-red-500",
    id: "english",
  },
];

const facultyPerformanceData = [
  {
    name: "Dr. Emily Davis",
    sessions: 28,
    hours: 84,
    completion: 98.2,
    rating: 4.9,
    category: "Computer Science",
  },
  {
    name: "Dr. Sarah Johnson",
    sessions: 25,
    hours: 75,
    completion: 96.8,
    rating: 4.8,
    category: "Mathematics",
  },
  {
    name: "Prof. Amanda Brown",
    sessions: 22,
    hours: 66,
    completion: 94.5,
    rating: 4.7,
    category: "English Literature",
  },
  {
    name: "Prof. Michael Chen",
    sessions: 18,
    hours: 54,
    completion: 95.6,
    rating: 4.6,
    category: "Physics",
  },
  {
    name: "Dr. Robert Wilson",
    sessions: 15,
    hours: 45,
    completion: 93.3,
    rating: 4.7,
    category: "Chemistry",
  },
];

const sessionTrendsData = [
  { month: "Jan", sessions: 95, completion: 91.2 },
  { month: "Feb", sessions: 108, completion: 92.5 },
  { month: "Mar", sessions: 124, completion: 94.1 },
  { month: "Apr", sessions: 132, completion: 93.8 },
  { month: "May", sessions: 145, completion: 95.2 },
  { month: "Jun", sessions: 156, completion: 94.7 },
];

const reportTemplatesData = [
  {
    name: "Monthly Faculty Report",
    description: "Comprehensive monthly overview of statistics",
    lastGenerated: "2024-01-15",
    size: "2.4 MB",
    icon: FileText,
  },
  {
    name: "Category Analysis",
    description: "Detailed breakdown by subject category",
    lastGenerated: "2024-01-10",
    size: "1.8 MB",
    icon: PieChart,
  },
  {
    name: "Resource Utilization",
    description: "Analysis of scheduling efficiency",
    lastGenerated: "2024-01-08",
    size: "3.1 MB",
    icon: BarChart3,
  },
  {
    name: "Individual Reports",
    description: "Personal performance for individuals",
    lastGenerated: "2024-01-05",
    size: "5.2 MB",
    icon: Users,
  },
];

// --- Export Functions (Unchanged) ---
const exportToCSV = (metrics, categories, period) => {
  let csvContent =
    "Key Metrics for " +
    period.charAt(0).toUpperCase() +
    period.slice(1) +
    " Period\nMetric,Value,Change\n";
  metrics.forEach((metric) => {
    csvContent += `"${metric.title.replace(/"/g, '""')}",${metric.value},${
      metric.change
    }\n`;
  });
  csvContent +=
    "\n\nCategory Performance Overview\nCategory,Sessions,Hours,Completion (%),Avg. Rating\n";
  categories.forEach((category) => {
    csvContent += `"${category.category.replace(/"/g, '""')}",${
      category.sessions
    },${category.hours},${category.completion},${category.avgRating}\n`;
  });
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute(
    "download",
    `Faculty_Report_${period}_${new Date().toISOString().slice(0, 10)}.csv`
  );
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
const AestheticSparkle = () => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{ opacity: [0, 1, 0], scale: [0, 1.2, 0], rotate: [0, 90, 180] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -top-1 -right-1 text-yellow-400 pointer-events-none"
  >
    <Sparkles size={16} fill="currentColor" />
  </motion.div>
);

/* ---------------- PREVIEW MODAL (UPGRADED UI) ---------------- */
const ReportViewModal = ({ isOpen, onClose, reportName, description }) => {
  if (!isOpen) return null;
  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-main)]"
          initial={{ y: 100, opacity: 0, scale: 0.9 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.9 }}
        >
          <div className="p-10 border-b border-[var(--border-main)] flex justify-between items-center bg-[var(--bg-card)]">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-[var(--accent)]/10 rounded-2xl text-[var(--accent)]">
                <Zap size={24} fill="currentColor" />
              </div>
              <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">
                Preview: {reportName}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-3 rounded-full hover:bg-[var(--bg-main)] text-[var(--text-muted)] transition-all"
            >
              <X size={24} strokeWidth={3} />
            </button>
          </div>

          <div className="p-10 overflow-y-auto flex-grow bg-[var(--bg-main)]/30">
            <div className="bg-[var(--bg-card)] p-12 rounded-[3rem] border border-dashed border-[var(--border-main)] relative overflow-hidden">
              <div className="absolute top-0 right-0 p-10 opacity-[0.03] rotate-12">
                <FileText size={200} />
              </div>
              <h3 className="text-[10px] font-black mb-8 text-[var(--text-muted)] uppercase tracking-[0.4em]">
                System Narrative
              </h3>
              <p className="text-lg text-[var(--text-main)] font-medium mb-12 leading-relaxed italic">
                "{description}"
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 mb-12">
                {reportMetricsData.slice(0, 3).map((m, i) => (
                  <div
                    key={i}
                    className="p-8 bg-[var(--bg-main)] rounded-[2rem] border border-[var(--border-main)] text-center shadow-inner"
                  >
                    <p className={`text-4xl font-black ${m.iconColor}`}>
                      {m.value}
                    </p>
                    <p className="text-[9px] font-black uppercase tracking-widest mt-2 opacity-60">
                      {m.title}
                    </p>
                  </div>
                ))}
              </div>

              <div className="space-y-4">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-[var(--accent)] mb-4">
                  Core Performance Nodes
                </h4>
                {categoryPerformanceData.slice(0, 3).map((cat, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-4 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-main)]"
                  >
                    <span className="font-bold text-sm text-[var(--text-main)]">
                      {cat.category}
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-32 h-1.5 bg-black/5 rounded-full overflow-hidden">
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: `${cat.completion}%` }}
                          className="h-full bg-green-500"
                        />
                      </div>
                      <span className="text-[10px] font-black text-green-600">
                        {cat.completion}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="p-8 flex justify-end gap-4 bg-[var(--bg-card)] border-t border-[var(--border-main)]">
            <button
              onClick={onClose}
              className="px-8 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] hover:text-[var(--text-main)] transition-all"
            >
              Close Terminal
            </button>
            <button className="px-10 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white bg-[var(--accent)] rounded-2xl shadow-xl shadow-indigo-500/20 active:scale-95 flex items-center gap-3">
              <Download size={16} strokeWidth={3} /> Download Uplink
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- Main ReportsPage (UPGRADED) ---
const ReportsPage = () => {
  const [selectedPeriod, setSelectedPeriod] = useState("month");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [modalState, setModalState] = useState({
    isOpen: false,
    name: "",
    description: "",
  });

  const filteredCategoryPerformanceData =
    selectedCategory === "all"
      ? categoryPerformanceData
      : categoryPerformanceData.filter((item) => item.id === selectedCategory);

  const handleExportClick = (format) => {
    setIsExportDropdownOpen(false);
    if (format === "csv")
      exportToCSV(
        reportMetricsData,
        filteredCategoryPerformanceData,
        selectedPeriod
      );
    else alert(`Generating ${format.toUpperCase()} Report...`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-10 transition-all duration-500 overflow-hidden font-sans">
      <div className="max-w-7xl mx-auto relative">
        <ReportViewModal
          {...modalState}
          onClose={() =>
            setModalState({ isOpen: false, name: "", description: "" })
          }
        />

        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                <BarChart3 size={20} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-60">
                Operations Intelligence
              </span>
            </div>
            <h1 className="text-6xl font-black tracking-tighter text-[var(--text-main)] leading-[0.85]">
              Analytics <br />{" "}
              <span className="text-[var(--accent)] italic">Terminal.</span>
            </h1>
          </motion.div>

          <div className="flex gap-4 relative">
            <motion.button
              whileHover={{ y: -4 }}
              className="bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center shadow-xl"
            >
              <Filter className="w-4 h-4 mr-3 stroke-[3]" /> Node Filters
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                whileHover={{ y: -4 }}
                className="bg-[var(--accent)] text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] flex items-center shadow-[0_20px_40px_rgba(0,0,0,0.2)]"
              >
                <Download className="w-4 h-4 mr-3 stroke-[3]" /> Transmit Data
                <ChevronDown
                  className={`w-4 h-4 ml-3 transition-transform ${
                    isExportDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isExportDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    className="absolute right-0 top-full mt-4 w-60 bg-[var(--bg-card)] rounded-3xl shadow-[0_30px_60px_rgba(0,0,0,0.3)] z-[60] border border-[var(--border-main)] p-3 backdrop-blur-xl"
                  >
                    {[
                      {
                        id: "csv",
                        label: "CSV Dataset",
                        icon: FileSpreadsheet,
                        color: "text-green-500",
                      },
                      {
                        id: "pdf",
                        label: "Print PDF",
                        icon: FileTextIcon,
                        color: "text-red-500",
                      },
                      {
                        id: "word",
                        label: "Doc Record",
                        icon: FileTextIcon,
                        color: "text-blue-500",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleExportClick(item.id)}
                        className="flex items-center w-full px-5 py-4 text-[10px] font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--bg-main)] rounded-2xl transition-all"
                      >
                        <item.icon
                          className={`w-4 h-4 mr-4 ${item.color}`}
                          strokeWidth={3}
                        />{" "}
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* METRICS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {reportMetricsData.map((metric, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8, borderColor: "var(--accent)" }}
              className="bg-[var(--bg-card)] rounded-[2.5rem] p-10 border border-[var(--border-main)] group shadow-xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:rotate-12 transition-transform duration-700">
                <metric.icon size={100} />
              </div>
              <div
                className={`w-14 h-14 ${metric.iconBg} rounded-2xl flex items-center justify-center mb-10 transition-transform group-hover:scale-110`}
              >
                <metric.icon
                  className={`w-6 h-6 ${metric.iconColor}`}
                  strokeWidth={2.5}
                />
              </div>
              <p className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-[0.3em] mb-3 leading-none">
                {metric.title}
              </p>
              <p className="text-4xl font-black text-[var(--text-main)] mb-4 tracking-tighter leading-none">
                {metric.value}
              </p>
              <div
                className={`inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                  metric.trend === "up"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-red-500/10 text-red-500"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp size={12} className="mr-1.5" />
                ) : (
                  <TrendingDown size={12} className="mr-1.5" />
                )}
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {/* TRENDS CARD */}
          <div className="lg:col-span-2 bg-[var(--bg-card)] rounded-[3rem] shadow-2xl border border-[var(--border-main)] p-12 overflow-hidden relative">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-[var(--text-muted)] flex items-center gap-4">
              <div className="h-1 w-8 bg-[var(--accent)] rounded-full" />{" "}
              Frequency Analysis
            </h2>
            <div className="space-y-8">
              {sessionTrendsData.map((trend, index) => (
                <div key={index} className="group flex items-center gap-6">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase w-10 tracking-widest">
                    {trend.month}
                  </span>
                  <div className="flex-1 h-3 bg-[var(--bg-main)] rounded-full overflow-hidden border border-[var(--border-main)] p-0.5">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 to-[var(--accent)] rounded-full shadow-[0_0_10px_var(--accent)]"
                      initial={{ width: 0 }}
                      whileInView={{
                        width: `${(trend.sessions / 156) * 100}%`,
                      }}
                      transition={{ duration: 1.5, ease: "circOut" }}
                    />
                  </div>
                  <span className="text-[10px] font-black text-green-500 w-12 text-right tracking-tighter">
                    {trend.completion}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FACULTY RANKING CARD */}
          <div className="bg-[var(--bg-card)] rounded-[3rem] shadow-2xl border border-[var(--border-main)] p-12 relative">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-[var(--text-muted)] flex items-center gap-4">
              <div className="h-1 w-8 bg-purple-500 rounded-full" /> Node
              Efficiency
            </h2>
            <div className="space-y-5">
              {facultyPerformanceData.map((f, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center justify-between p-5 bg-[var(--bg-main)]/40 rounded-[2rem] border border-[var(--border-main)] transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-xs font-black text-[var(--text-main)] uppercase tracking-tight">
                        {f.name}
                      </p>
                      <p className="text-[8px] font-black text-[var(--text-muted)] uppercase tracking-widest mt-1 opacity-60">
                        {f.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-black text-[var(--accent)]">
                      {f.rating}{" "}
                      <Star
                        size={8}
                        fill="currentColor"
                        className="inline mb-1"
                      />
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>

        {/* PERFORMANCE MATRIX TABLE */}
        <div className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-2xl border border-[var(--border-main)] p-12 mb-16 overflow-hidden relative">
          <div className="absolute top-0 right-0 p-12 opacity-5 scale-150">
            <LayoutGrid size={200} />
          </div>
          <h2 className="text-xs font-black uppercase tracking-[0.4em] mb-12 text-[var(--text-muted)]">
            Discipline Performance Matrix
          </h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full">
              <thead>
                <tr className="text-left text-[9px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50 border-b border-[var(--border-main)]">
                  <th className="pb-8 px-4">Subject Node</th>
                  <th className="pb-8 px-4 text-center">Sessions</th>
                  <th className="pb-8 px-4 text-center">Hours</th>
                  <th className="pb-8 px-4 text-center">Completion</th>
                  <th className="pb-8 px-4 text-right">Avg Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]/50">
                {filteredCategoryPerformanceData.map((cat, i) => (
                  <tr
                    key={i}
                    className="group hover:bg-[var(--bg-main)]/40 transition-all duration-500"
                  >
                    <td className="py-8 px-4 flex items-center gap-5">
                      <div
                        className={`w-3 h-3 ${cat.color} rounded-full shadow-[0_0_10px_currentColor] group-hover:scale-150 transition-transform`}
                      />
                      <span className="font-black text-xs text-[var(--text-main)] uppercase tracking-widest">
                        {cat.category}
                      </span>
                    </td>
                    <td className="py-8 px-4 text-center text-xs font-bold text-[var(--text-main)]">
                      {cat.sessions}
                    </td>
                    <td className="py-8 px-4 text-center text-xs font-bold text-[var(--text-main)]">
                      {cat.hours}
                    </td>
                    <td className="py-8 px-4 text-center text-xs font-black text-green-500">
                      {cat.completion}%
                    </td>
                    <td className="py-8 px-4 text-right text-xs font-black text-yellow-500 tracking-tighter">
                      {cat.avgRating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* TEMPLATES SECTION */}
        <div className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-2xl border border-[var(--border-main)] p-12 mb-20 relative">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-16 gap-6">
            <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)]">
              Encrypted Report Blueprints
            </h2>
            <button className="px-8 py-3 bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-2xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--accent)] transition-all">
              Initialize Template
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reportTemplatesData.map((t, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -10 }}
                className="p-8 border-2 border-[var(--border-main)] rounded-[2.5rem] bg-[var(--bg-main)]/20 relative group overflow-hidden"
              >
                <div className="flex justify-between items-start relative z-10">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-[1.5rem] flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      <t.icon
                        className="text-[var(--accent)] opacity-80"
                        size={28}
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-[var(--text-main)] uppercase tracking-tighter mb-2">
                        {t.name}
                      </h3>
                      <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase leading-relaxed max-w-[200px] opacity-60">
                        {t.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          name: t.name,
                          description: t.description,
                        })
                      }
                      className="p-3 bg-[var(--bg-card)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent)] transition-all border border-[var(--border-main)] shadow-sm"
                    >
                      <Eye size={18} strokeWidth={3} />
                    </button>
                    <button className="relative p-3 bg-[var(--accent)] rounded-xl text-white shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
                      <AestheticSparkle />
                      <Download size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* BACK TO TOP */}
        <div className="text-center py-10">
          <motion.button
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            whileHover={{ scale: 1.1 }}
            className="p-5 bg-blue-600 text-white rounded-2xl shadow-2xl"
          >
            <ChevronUp size={24} strokeWidth={3} />
          </motion.button>
        </div>
      </div>
    </div>
  );
};

// Simple missing icon component
const LayoutGrid = ({ size, className }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);

const Globe = ({ size, className }: any) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

export default ReportsPage;

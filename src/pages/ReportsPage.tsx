import React, { useState } from "react";
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
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// --- Data Definitions ---

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
    description:
      "Comprehensive monthly overview of faculty performance and session statistics",
    lastGenerated: "2024-01-15",
    size: "2.4 MB",
    icon: FileText,
  },
  {
    name: "Category Performance Analysis",
    description:
      "Detailed breakdown of performance metrics by subject category",
    lastGenerated: "2024-01-10",
    size: "1.8 MB",
    icon: PieChart,
  },
  {
    name: "Session Utilization Report",
    description:
      "Analysis of session scheduling efficiency and resource utilization",
    lastGenerated: "2024-01-08",
    size: "3.1 MB",
    icon: BarChart3,
  },
  {
    name: "Faculty Individual Reports",
    description: "Personal performance reports for individual faculty members",
    lastGenerated: "2024-01-05",
    size: "5.2 MB",
    icon: Users,
  },
];

// --- Export Functions ---
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

// --- Custom Components ---

const ReportViewModal = ({ isOpen, onClose, reportName, description }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border border-[var(--border-main)] transition-colors duration-300"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-8 border-b border-[var(--border-main)] flex justify-between items-center bg-[var(--bg-card)]">
            <h2 className="text-2xl font-black text-[var(--accent)] tracking-tight">
              Preview: {reportName}
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-full hover:bg-[var(--bg-main)] text-[var(--text-muted)] transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-8 overflow-y-auto flex-grow bg-[var(--bg-main)]/50">
            <div className="bg-[var(--bg-card)] p-10 rounded-[2rem] shadow-sm border border-dashed border-[var(--border-main)] min-h-[500px]">
              <h3 className="text-xl font-black mb-6 border-b border-[var(--border-main)] pb-3 text-[var(--text-main)] uppercase tracking-widest text-xs">
                Executive Summary
              </h3>
              <p className="text-[var(--text-muted)] font-medium mb-8 leading-relaxed">
                {description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
                <div className="p-6 bg-blue-500/10 rounded-2xl text-center border border-blue-500/20">
                  <p className="text-3xl font-black text-blue-600">
                    {reportMetricsData[0].value}
                  </p>
                  <p className="text-[10px] text-blue-600/70 uppercase tracking-widest font-black mt-1">
                    Total Sessions
                  </p>
                </div>
                <div className="p-6 bg-green-500/10 rounded-2xl text-center border border-green-500/20">
                  <p className="text-3xl font-black text-green-600">
                    {reportMetricsData[1].value}
                  </p>
                  <p className="text-[10px] text-green-600/70 uppercase tracking-widest font-black mt-1">
                    Utilization
                  </p>
                </div>
                <div className="p-6 bg-purple-500/10 rounded-2xl text-center border border-purple-500/20">
                  <p className="text-3xl font-black text-purple-600">
                    {reportMetricsData[3].value}
                  </p>
                  <p className="text-[10px] text-purple-600/70 uppercase tracking-widest font-black mt-1">
                    Completion Rate
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-black mb-6 border-b border-[var(--border-main)] pb-3 text-[var(--text-main)] uppercase tracking-widest text-[10px]">
                Detailed Category Breakdown
              </h3>
              <ul className="space-y-4">
                {categoryPerformanceData.slice(0, 3).map((cat, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b border-[var(--border-main)] last:border-b-0 py-3"
                  >
                    <span className="font-bold text-[var(--text-main)]">
                      {cat.category}
                    </span>
                    <span className="text-sm text-green-600 font-black">
                      {cat.completion}% Complete
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-[10px] text-[var(--text-muted)] mt-12 italic opacity-60">
                *This is a simplified web preview. Download for full charts and
                analytics.
              </p>
            </div>
          </div>

          <div className="p-6 flex justify-end space-x-4 bg-[var(--bg-card)] border-t border-[var(--border-main)]">
            <button
              onClick={onClose}
              className="px-6 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] bg-[var(--bg-main)] rounded-xl border border-[var(--border-main)] hover:bg-[var(--bg-card)] transition-all"
            >
              Close
            </button>
            <button className="px-6 py-3 text-xs font-black uppercase tracking-widest text-white bg-[var(--accent)] rounded-xl hover:opacity-90 transition-all flex items-center shadow-lg">
              <Download className="w-4 h-4 mr-2 stroke-[3]" /> Download Full
              Report
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

// --- ReportsPage ---

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
    else
      alert(
        `Generating ${format.toUpperCase()} Report for ${selectedPeriod}...`
      );
  };

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <ReportViewModal
          {...modalState}
          onClose={() =>
            setModalState({ isOpen: false, name: "", description: "" })
          }
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
              Reports & Analytics
            </h1>
            <p className="text-[var(--text-muted)] font-medium mt-2">
              Comprehensive insights into faculty performance and session
              analytics.
            </p>
          </div>
          <div className="flex space-x-3 relative">
            <motion.button
              className="bg-[var(--bg-card)] border border-[var(--border-main)] text-[var(--text-main)] px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-[var(--bg-main)] flex items-center shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-4 h-4 mr-2 stroke-[3]" /> Filter
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="bg-[var(--accent)] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs hover:opacity-90 flex items-center shadow-xl"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Download className="w-4 h-4 mr-2 stroke-[3]" /> Export Report{" "}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isExportDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isExportDropdownOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-3 w-52 bg-[var(--bg-card)] rounded-2xl shadow-2xl z-[60] border border-[var(--border-main)] p-2 overflow-hidden backdrop-blur-md"
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                  >
                    {[
                      {
                        id: "csv",
                        label: "CSV (Data)",
                        icon: FileSpreadsheet,
                        color: "text-green-600",
                      },
                      {
                        id: "pdf",
                        label: "PDF (Print)",
                        icon: FileTextIcon,
                        color: "text-red-600",
                      },
                      {
                        id: "word",
                        label: "MS Word",
                        icon: FileTextIcon,
                        color: "text-blue-600",
                      },
                    ].map((item) => (
                      <button
                        key={item.id}
                        onClick={() => handleExportClick(item.id)}
                        className="flex items-center w-full px-4 py-3 text-xs font-black uppercase tracking-widest text-[var(--text-main)] hover:bg-[var(--bg-main)] rounded-xl transition-all"
                      >
                        <item.icon className={`w-4 h-4 mr-3 ${item.color}`} />{" "}
                        {item.label}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Selectors */}
        <div className="flex flex-col md:flex-row gap-6 mb-10">
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all shadow-sm"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
              Main Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-[var(--bg-card)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl px-5 py-3 text-xs font-black uppercase tracking-widest focus:ring-2 focus:ring-[var(--accent)] outline-none transition-all shadow-sm"
            >
              <option value="all">All Categories</option>
              <option value="cs">Computer Science</option>
              <option value="math">Mathematics</option>
              <option value="physics">Physics</option>
            </select>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {reportMetricsData.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-[var(--bg-card)] rounded-[2rem] shadow-xl border border-[var(--border-main)] p-8 group transition-all hover:border-[var(--accent)]/50"
              whileHover={{ y: -5 }}
            >
              <div
                className={`w-14 h-14 ${metric.iconBg} rounded-[1.25rem] flex items-center justify-center mb-6 transition-transform group-hover:scale-110`}
              >
                <metric.icon className={`w-7 h-7 ${metric.iconColor}`} />
              </div>
              <p className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.2em] mb-2">
                {metric.title}
              </p>
              <p className="text-3xl font-black text-[var(--text-main)] mb-3">
                {metric.value}
              </p>
              <div
                className={`flex items-center text-xs font-black uppercase tracking-widest ${
                  metric.trend === "up" ? "text-green-500" : "text-red-500"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 mr-2 stroke-[3]" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-2 stroke-[3]" />
                )}
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Trends */}
          <div className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-xl border border-[var(--border-main)] p-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[var(--text-main)]">
              Activity Trends
            </h2>
            <div className="space-y-6">
              {sessionTrendsData.map((trend, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-[10px] font-black text-[var(--text-muted)] uppercase w-12 tracking-widest">
                    {trend.month}
                  </span>
                  <div className="flex-1 mx-6">
                    <div className="w-full bg-[var(--bg-main)] rounded-full h-3 border border-[var(--border-main)] overflow-hidden">
                      <motion.div
                        className="bg-[var(--accent)] h-full rounded-full shadow-lg"
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${(trend.sessions / 156) * 100}%`,
                        }}
                        transition={{ duration: 1, ease: "easeOut" }}
                      />
                    </div>
                  </div>
                  <span className="text-xs font-black text-green-600 w-12 text-right">
                    {trend.completion}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty */}
          <div className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-xl border border-[var(--border-main)] p-8">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[var(--text-main)]">
              Elite Faculty Metrics
            </h2>
            <div className="space-y-4">
              {facultyPerformanceData.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-4 bg-[var(--bg-main)]/50 rounded-2xl border border-[var(--border-main)] group hover:border-[var(--accent)] transition-all"
                >
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-[var(--accent)] text-white rounded-xl flex items-center justify-center font-black text-xs shadow-lg shadow-indigo-500/20">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-black text-[var(--text-main)] uppercase tracking-tight">
                        {f.name}
                      </p>
                      <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest mt-1 opacity-70">
                        {f.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-black text-[var(--accent)] tracking-tighter">
                      {f.rating} ★
                    </p>
                    <p className="text-[9px] text-[var(--text-muted)] uppercase font-black tracking-widest mt-1 opacity-70">
                      {f.sessions} Ses.
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-xl border border-[var(--border-main)] p-8 mb-12 overflow-hidden transition-all">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-8 text-[var(--text-main)]">
            Discipline Performance Matrix
          </h2>
          <div className="overflow-x-auto no-scrollbar">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b border-[var(--border-main)] text-[var(--text-muted)] uppercase text-[10px] font-black tracking-[0.2em]">
                  <th className="py-5 px-4">Discipline</th>
                  <th className="py-5 px-4">Sessions</th>
                  <th className="py-5 px-4">Effort Hours</th>
                  <th className="py-5 px-4">Completion</th>
                  <th className="py-5 px-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--border-main)]">
                {filteredCategoryPerformanceData.map((cat, i) => (
                  <tr
                    key={i}
                    className="hover:bg-[var(--bg-main)]/40 transition-colors group"
                  >
                    <td className="py-5 px-4 flex items-center">
                      <div
                        className={`w-3 h-3 ${cat.color} rounded-full mr-4 shadow-sm group-hover:scale-125 transition-transform`}
                      />
                      <span className="font-black text-sm text-[var(--text-main)] tracking-tight uppercase">
                        {cat.category}
                      </span>
                    </td>
                    <td className="py-5 px-4 text-xs font-bold text-[var(--text-main)]">
                      {cat.sessions}
                    </td>
                    <td className="py-5 px-4 text-xs font-bold text-[var(--text-main)]">
                      {cat.hours}
                    </td>
                    <td className="py-5 px-4 text-xs font-black text-green-600">
                      {cat.completion}%
                    </td>
                    <td className="py-5 px-4 text-xs text-yellow-500 font-black tracking-tighter">
                      {cat.avgRating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-xl border border-[var(--border-main)] p-8 transition-all">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
            <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)]">
              Dynamic Report Templates
            </h2>
            <button className="bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest hover:border-[var(--accent)] transition-all">
              Initialize Custom
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {reportTemplatesData.map((t, i) => (
              <div
                key={i}
                className="border border-[var(--border-main)] rounded-2xl p-6 group hover:border-[var(--accent)] transition-all bg-[var(--bg-main)]/20"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-5">
                    <div className="w-14 h-14 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl flex items-center justify-center group-hover:scale-105 transition-transform shadow-sm">
                      <t.icon
                        className="text-[var(--accent)] opacity-70"
                        size={24}
                      />
                    </div>
                    <div>
                      <h3 className="font-black text-sm text-[var(--text-main)] uppercase tracking-tight">
                        {t.name}
                      </h3>
                      <p className="text-[11px] text-[var(--text-muted)] mt-1.5 font-medium leading-relaxed max-w-[200px]">
                        {t.description}
                      </p>
                    </div>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() =>
                        setModalState({
                          isOpen: true,
                          name: t.name,
                          description: t.description,
                        })
                      }
                      className="p-3 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-xl text-[var(--text-muted)] hover:text-[var(--accent)] transition-all shadow-sm"
                    >
                      <Eye size={18} strokeWidth={3} />
                    </button>
                    <button className="p-3 bg-[var(--accent)] rounded-xl text-white shadow-lg shadow-indigo-500/10 hover:opacity-90 transition-all">
                      <Download size={18} strokeWidth={3} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;

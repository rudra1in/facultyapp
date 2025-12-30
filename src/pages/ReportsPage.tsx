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
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    title: "Faculty Utilization",
    value: "87.3%",
    change: "+3.2%",
    trend: "up",
    icon: Users,
    iconBg: "bg-green-100 dark:bg-green-900/30",
    iconColor: "text-green-600 dark:text-green-400",
  },
  {
    title: "Avg. Session Duration",
    value: "2h 15m",
    change: "-5.1%",
    trend: "down",
    icon: Clock,
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    title: "Completion Rate",
    value: "94.7%",
    change: "+2.8%",
    trend: "up",
    icon: TrendingUp,
    iconBg: "bg-orange-100 dark:bg-orange-900/30",
    iconColor: "text-orange-600 dark:text-orange-400",
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
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden border dark:border-gray-700"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
        >
          <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center bg-white dark:bg-gray-800">
            <h2 className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
              Preview: {reportName}
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="p-6 overflow-y-auto flex-grow bg-gray-50 dark:bg-gray-900/50">
            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-sm border border-dashed border-gray-300 dark:border-gray-700 min-h-[500px]">
              <h3 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                Executive Summary
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {description}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl text-center">
                  <p className="text-3xl font-extrabold text-blue-600 dark:text-blue-400">
                    {reportMetricsData[0].value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    Total Sessions
                  </p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-xl text-center">
                  <p className="text-3xl font-extrabold text-green-600 dark:text-green-400">
                    {reportMetricsData[1].value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    Utilization
                  </p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl text-center">
                  <p className="text-3xl font-extrabold text-purple-600 dark:text-purple-400">
                    {reportMetricsData[3].value}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400 uppercase tracking-wider font-semibold">
                    Completion Rate
                  </p>
                </div>
              </div>

              <h3 className="text-xl font-semibold mb-4 border-b dark:border-gray-700 pb-2 dark:text-white">
                Detailed Category Breakdown
              </h3>
              <ul className="space-y-3">
                {categoryPerformanceData.slice(0, 3).map((cat, i) => (
                  <li
                    key={i}
                    className="flex justify-between border-b dark:border-gray-700 last:border-b-0 py-2"
                  >
                    <span className="font-medium text-gray-700 dark:text-gray-300">
                      {cat.category}
                    </span>
                    <span className="text-sm text-green-600 dark:text-green-400 font-bold">
                      {cat.completion}% Complete
                    </span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-400 mt-10 italic">
                *This is a simplified web preview. Download for full charts and
                analytics.
              </p>
            </div>
          </div>

          <div className="p-4 flex justify-end space-x-3 bg-white dark:bg-gray-800 border-t dark:border-gray-700">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
            >
              Close
            </button>
            <button className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-xl hover:bg-indigo-700 transition-colors flex items-center">
              <Download className="w-4 h-4 mr-2" /> Download Full Report
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        <ReportViewModal
          {...modalState}
          onClose={() =>
            setModalState({ isOpen: false, name: "", description: "" })
          }
        />

        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 space-y-4 sm:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Reports & Analytics
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Comprehensive insights into faculty performance and session
              analytics.
            </p>
          </div>
          <div className="flex space-x-3 relative">
            <motion.button
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-2.5 rounded-xl font-medium hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter className="w-4 h-4 mr-2" /> Filter
            </motion.button>

            <div className="relative">
              <motion.button
                onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl font-medium hover:bg-indigo-700 flex items-center shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download className="w-4 h-4 mr-2" /> Export Report{" "}
                <ChevronDown
                  className={`w-4 h-4 ml-2 transition-transform ${
                    isExportDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </motion.button>

              <AnimatePresence>
                {isExportDropdownOpen && (
                  <motion.div
                    className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl z-20 border border-gray-100 dark:border-gray-700 p-2"
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
                        className="flex items-center w-full px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      >
                        <item.icon className={`w-4 h-4 mr-2 ${item.color}`} />{" "}
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
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
              Time Period
            </label>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
            >
              <option value="week">This Week</option>
              <option value="month">This Month</option>
              <option value="quarter">This Quarter</option>
              <option value="year">This Year</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-500 uppercase mb-1 ml-1">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
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
              className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border border-gray-100 dark:border-gray-700 p-6"
              whileHover={{ y: -5 }}
            >
              <div
                className={`w-12 h-12 ${metric.iconBg} rounded-xl flex items-center justify-center mb-4`}
              >
                <metric.icon className={`w-6 h-6 ${metric.iconColor}`} />
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
                {metric.title}
              </p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                {metric.value}
              </p>
              <div
                className={`flex items-center text-sm font-bold ${
                  metric.trend === "up" ? "text-green-600" : "text-red-600"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp className="w-4 h-4 mr-1" />
                ) : (
                  <TrendingDown className="w-4 h-4 mr-1" />
                )}
                {metric.change}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Trends */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-6 dark:text-white">
              Session Trends
            </h2>
            <div className="space-y-5">
              {sessionTrendsData.map((trend, index) => (
                <div key={index} className="flex items-center">
                  <span className="text-sm font-bold text-gray-500 w-12">
                    {trend.month}
                  </span>
                  <div className="flex-1 mx-4">
                    <div className="w-full bg-gray-100 dark:bg-gray-700 rounded-full h-2">
                      <div
                        className="bg-indigo-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: `${(trend.sessions / 156) * 100}%` }}
                      />
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600 w-12 text-right">
                    {trend.completion}%
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Faculty */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 p-6">
            <h2 className="text-lg font-bold mb-6 dark:text-white">
              Top Faculty Performance
            </h2>
            <div className="space-y-4">
              {facultyPerformanceData.map((f, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-900/50 rounded-xl border dark:border-gray-700"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-lg flex items-center justify-center font-bold text-xs">
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-bold">{f.name}</p>
                      <p className="text-[10px] text-gray-500 uppercase font-bold">
                        {f.category}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-indigo-600 dark:text-indigo-400">
                      {f.rating} ★
                    </p>
                    <p className="text-[10px] text-gray-500 uppercase font-bold">
                      {f.sessions} Sessions
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 p-6 mb-12 overflow-hidden">
          <h2 className="text-xl font-bold mb-4 dark:text-white">
            Category Performance Overview
          </h2>
          <div className="overflow-x-auto">
            <table className="min-w-full text-left">
              <thead>
                <tr className="border-b dark:border-gray-700 text-gray-500 uppercase text-[10px] font-bold tracking-widest">
                  <th className="py-4 px-2">Category</th>
                  <th className="py-4">Sessions</th>
                  <th className="py-4">Hours</th>
                  <th className="py-4">Completion</th>
                  <th className="py-4">Rating</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {filteredCategoryPerformanceData.map((cat, i) => (
                  <tr
                    key={i}
                    className="hover:bg-gray-50 dark:hover:bg-gray-900/40 transition-colors"
                  >
                    <td className="py-4 px-2 flex items-center">
                      <div
                        className={`w-3 h-3 ${cat.color} rounded-full mr-3`}
                      />
                      <span className="font-bold text-sm">{cat.category}</span>
                    </td>
                    <td className="py-4 text-sm">{cat.sessions}</td>
                    <td className="py-4 text-sm">{cat.hours}</td>
                    <td className="py-4 text-sm font-bold text-green-600">
                      {cat.completion}%
                    </td>
                    <td className="py-4 text-sm text-yellow-500 font-bold">
                      {cat.avgRating} ★
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Templates */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md border dark:border-gray-700 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold dark:text-white">
              Report Templates
            </h2>
            <button className="bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-bold">
              Create Custom
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {reportTemplatesData.map((t, i) => (
              <div
                key={i}
                className="border dark:border-gray-700 rounded-2xl p-5 group hover:border-indigo-500 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-gray-100 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                      <t.icon className="text-gray-500" />
                    </div>
                    <div>
                      <h3 className="font-bold text-sm dark:text-white">
                        {t.name}
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
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
                      className="p-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-500 hover:text-indigo-600"
                    >
                      <Eye size={18} />
                    </button>
                    <button className="p-2 bg-indigo-50 dark:bg-indigo-900/30 rounded-lg text-indigo-600">
                      <Download size={18} />
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

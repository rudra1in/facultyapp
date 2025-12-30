// src/components/CategoriesPage.tsx

import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  Users,
  Calendar,
  MoreHorizontal,
  BookOpen,
  X,
  AlertTriangle,
  HardHat,
  FlaskConical,
  Globe,
  Dna,
  Cpu,
  Calculator,
  Zap,
  Clock,
  Star,
  BarChart,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

// Category type definition
type Category = {
  id: number;
  name: string;
  description: string;
  color: string;
  facultyCount: number;
  sessionCount: number;
  subjects: string[];
  status: "active" | "inactive";
  createdDate: string;
  image: React.ElementType;
  priority: "High" | "Medium" | "Low";
  defaultTimeWeightHours: number;
};

const initialCategories: Category[] = [
  {
    id: 1,
    name: "Mathematics",
    description:
      "Advanced mathematical concepts including calculus, algebra, and statistics",
    color: "#2563EB",
    facultyCount: 12,
    sessionCount: 85,
    subjects: [
      "Calculus",
      "Linear Algebra",
      "Statistics",
      "Discrete Mathematics",
    ],
    status: "active",
    createdDate: "2024-01-10",
    image: Calculator,
    priority: "High",
    defaultTimeWeightHours: 5,
  },
  {
    id: 2,
    name: "Physics",
    description:
      "Theoretical and applied physics covering mechanics, thermodynamics, and quantum physics",
    color: "#10B981",
    facultyCount: 8,
    sessionCount: 64,
    subjects: [
      "Mechanics",
      "Thermodynamics",
      "Quantum Physics",
      "Electromagnetism",
    ],
    status: "active",
    createdDate: "2024-01-12",
    image: Zap,
    priority: "Medium",
    defaultTimeWeightHours: 3,
  },
  {
    id: 3,
    name: "Computer Science",
    description:
      "Programming, algorithms, data structures, and software engineering principles",
    color: "#9333EA",
    facultyCount: 15,
    sessionCount: 128,
    subjects: [
      "Data Structures",
      "Algorithms",
      "Machine Learning",
      "Software Engineering",
    ],
    status: "active",
    createdDate: "2024-01-08",
    image: Cpu,
    priority: "High",
    defaultTimeWeightHours: 6,
  },
  {
    id: 4,
    name: "Chemistry",
    description:
      "Organic, inorganic, and biochemistry with laboratory components",
    color: "#EA580C",
    facultyCount: 10,
    sessionCount: 72,
    subjects: [
      "Organic Chemistry",
      "Inorganic Chemistry",
      "Biochemistry",
      "Physical Chemistry",
    ],
    status: "active",
    createdDate: "2024-01-15",
    image: FlaskConical,
    priority: "Medium",
    defaultTimeWeightHours: 4,
  },
  {
    id: 5,
    name: "English Literature",
    description: "Classic and modern literature analysis and creative writing",
    color: "#DC2626",
    facultyCount: 6,
    sessionCount: 45,
    subjects: [
      "Classical Literature",
      "Modern Poetry",
      "Creative Writing",
      "Linguistics",
    ],
    status: "inactive",
    createdDate: "2024-01-05",
    image: Globe,
    priority: "Low",
    defaultTimeWeightHours: 2,
  },
  {
    id: 6,
    name: "Biology",
    description:
      "Life sciences including molecular biology, genetics, and ecology",
    color: "#0D9488",
    facultyCount: 9,
    sessionCount: 58,
    subjects: ["Molecular Biology", "Genetics", "Ecology", "Anatomy"],
    status: "active",
    createdDate: "2024-01-18",
    image: Dna,
    priority: "Medium",
    defaultTimeWeightHours: 4,
  },
];

const priorityOptions: Category["priority"][] = ["High", "Medium", "Low"];
const colorOptions = [
  { name: "Indigo", hex: "#4F46E5" },
  { name: "Green", hex: "#10B981" },
  { name: "Purple", hex: "#9333EA" },
  { name: "Red", hex: "#DC2626" },
  { name: "Orange", hex: "#EA580C" },
];

const WorkloadChart: React.FC<{ data: { name: string; effort: number }[] }> = ({
  data,
}) => {
  const totalEffort = data.reduce((sum, item) => sum + item.effort, 0);

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md border border-gray-200 dark:border-gray-700">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
        <BarChart className="w-5 h-5 mr-2 text-indigo-600 dark:text-indigo-400" />{" "}
        Effort Distribution by Category
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
        Total Estimated Effort:{" "}
        <span className="font-bold text-gray-900 dark:text-white">
          {totalEffort} hours
        </span>
      </p>
      <div className="space-y-3">
        {data.map((item, index) => {
          const percentage =
            totalEffort > 0 ? (item.effort / totalEffort) * 100 : 0;
          const barColor = colorOptions[index % colorOptions.length].hex;

          return (
            <div key={item.name}>
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {item.name}
                </span>
                <span className="text-gray-600 dark:text-gray-400">
                  {item.effort} hrs ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="h-2.5 rounded-full transition-all duration-500"
                  style={{ width: `${percentage}%`, backgroundColor: barColor }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

const CategoriesPage: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>(initialCategories);
  const [activeTab, setActiveTab] = useState<"management" | "analytics">(
    "management"
  );
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("All Status");
  const [sortOption, setSortOption] = useState("Sort by Name");
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );

  const handleCreateOrUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingCategory ? editingCategory.id : categories.length + 1;

    const newCategory: Category = {
      id: id,
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      color:
        (formData.get("color") as string) ||
        editingCategory?.color ||
        colorOptions[0].hex,
      priority:
        (formData.get("priority") as Category["priority"]) ||
        editingCategory?.priority ||
        "Medium",
      defaultTimeWeightHours:
        parseInt(formData.get("defaultTimeWeightHours") as string) || 0,
      facultyCount: editingCategory ? editingCategory.facultyCount : 0,
      sessionCount: editingCategory ? editingCategory.sessionCount : 0,
      subjects: editingCategory ? editingCategory.subjects : [],
      status: editingCategory ? editingCategory.status : "active",
      createdDate: editingCategory
        ? editingCategory.createdDate
        : new Date().toISOString().slice(0, 10),
      image: editingCategory ? editingCategory.image : FolderOpen,
    };

    if (editingCategory) {
      setCategories(
        categories.map((cat) => (cat.id === newCategory.id ? newCategory : cat))
      );
    } else {
      setCategories([...categories, newCategory]);
    }
    setShowModal(false);
    setEditingCategory(null);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setCategoryToDelete(null);
  };

  const getFilteredAndSortedCategories = () => {
    let filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterStatus !== "All Status")
      filtered = filtered.filter(
        (cat) => cat.status === filterStatus.toLowerCase()
      );

    if (sortOption === "Sort by Name")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "Sort by Faculty Count")
      filtered.sort((a, b) => b.facultyCount - a.facultyCount);
    else if (sortOption === "Sort by Sessions")
      filtered.sort((a, b) => b.sessionCount - a.sessionCount);
    else if (sortOption === "Sort by Priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      filtered.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }
    return filtered;
  };

  const filteredCategories = getFilteredAndSortedCategories();
  const activeCategories = filteredCategories.filter(
    (c) => c.status === "active"
  );
  const inactiveCategories = filteredCategories.filter(
    (c) => c.status === "inactive"
  );

  const analyticsData = activeCategories.map((cat) => ({
    name: cat.name,
    effort: cat.sessionCount * cat.defaultTimeWeightHours,
  }));
  const totalEffort = analyticsData.reduce((sum, item) => sum + item.effort, 0);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 space-y-4 md:space-y-0">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Category Dashboard
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-1">
              Manage subject areas and analyze workload distribution.
            </p>
          </div>
          <motion.button
            onClick={() => {
              setShowModal(true);
              setEditingCategory(null);
            }}
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-lg flex items-center"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Plus className="w-5 h-5 mr-2" /> Create Category
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 dark:border-gray-700 mb-8">
          {["management", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-4 py-2 text-sm font-medium capitalize transition-colors ${
                activeTab === tab
                  ? "border-b-2 border-indigo-600 text-indigo-600 dark:text-indigo-400"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {tab === "analytics" && (
                <BarChart className="w-4 h-4 mr-1 inline" />
              )}{" "}
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "management" && (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  label: "Total Categories",
                  val: categories.length,
                  icon: FolderOpen,
                  color: "blue",
                },
                {
                  label: "Active Categories",
                  val: activeCategories.length,
                  icon: BookOpen,
                  color: "green",
                },
                {
                  label: "Total Faculty",
                  val: categories.reduce((s, c) => s + c.facultyCount, 0),
                  icon: Users,
                  color: "purple",
                },
                {
                  label: "Total Effort (hrs)",
                  val: totalEffort,
                  icon: Clock,
                  color: "yellow",
                },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 p-6 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between z-10 relative">
                    <div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {stat.label}
                      </p>
                      <p className="text-4xl font-extrabold text-gray-900 dark:text-white mt-1">
                        {stat.val}
                      </p>
                    </div>
                    <div
                      className={`w-14 h-14 bg-${stat.color}-100 dark:bg-${stat.color}-900/30 rounded-lg flex items-center justify-center`}
                    >
                      <stat.icon
                        className={`w-7 h-7 text-${stat.color}-600 dark:text-${stat.color}-400`}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-6 space-y-4 md:space-y-0">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search categories..."
                  className="w-full pl-10 pr-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex space-x-3">
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <select
                  className="bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg px-3 py-2 text-sm outline-none"
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                >
                  <option>Sort by Name</option>
                  <option>Sort by Sessions</option>
                  <option>Sort by Priority</option>
                </select>
              </div>
            </div>

            {/* Active Categories */}
            <div className="space-y-4 mb-8">
              <h2 className="text-xl font-semibold dark:text-white">
                Active Categories ({activeCategories.length})
              </h2>
              {activeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-200 dark:border-gray-700 relative overflow-hidden group"
                >
                  <div
                    className="absolute left-0 top-0 bottom-0 w-2"
                    style={{ backgroundColor: cat.color }}
                  />
                  <div className="p-4 pl-6 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center space-x-4 flex-1">
                      <div
                        className="w-12 h-12 rounded-lg flex items-center justify-center"
                        style={{ backgroundColor: `${cat.color}1A` }}
                      >
                        <cat.image
                          className="w-6 h-6"
                          style={{ color: cat.color }}
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold truncate">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-center">
                        <div className="flex items-center text-sm font-semibold">
                          <Star
                            className="w-4 h-4 mr-1"
                            fill={
                              cat.priority === "High"
                                ? "#EF4444"
                                : cat.priority === "Medium"
                                ? "#F59E0B"
                                : "#10B981"
                            }
                            stroke="none"
                          />
                          {cat.priority}
                        </div>
                        <p className="text-xs text-gray-500">Priority</p>
                      </div>
                      <div className="text-center">
                        <p className="font-semibold">{cat.facultyCount}</p>
                        <p className="text-xs text-gray-500">Faculty</p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border-l dark:border-gray-700 pl-4">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-2 text-gray-400 hover:text-blue-600 transition-colors"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-2 text-gray-400 hover:text-red-600 transition-colors"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {activeTab === "analytics" && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <WorkloadChart data={analyticsData} />
            </div>
            <div className="space-y-6">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-xl border dark:border-gray-700 shadow-md">
                <h3 className="font-semibold mb-4">
                  Key Performance Indicators
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between border-b dark:border-gray-700 pb-2">
                    <span className="text-sm text-gray-500">
                      Avg Faculty/Cat
                    </span>
                    <span className="font-bold text-indigo-600">
                      {(
                        categories.reduce((s, c) => s + c.facultyCount, 0) /
                        categories.length
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">
                      Avg Effort (hrs)
                    </span>
                    <span className="font-bold text-indigo-600">
                      {(
                        totalEffort /
                        categories.reduce((s, c) => s + c.sessionCount, 0)
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-xl border border-yellow-200 dark:border-yellow-800">
                <h3 className="text-yellow-800 dark:text-yellow-400 font-semibold flex items-center mb-2">
                  <AlertTriangle className="w-5 h-5 mr-2" /> Action Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300/80">
                  Monitor High Session Count categories with Medium Priority to
                  prevent faculty burnout.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Modal */}
        <AnimatePresence>
          {showModal && (
            <motion.div
              className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-lg p-6 relative overflow-hidden"
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
                <h3 className="text-xl font-bold mb-6 dark:text-white">
                  {editingCategory ? "Update Category" : "New Category"}
                </h3>
                <form onSubmit={handleCreateOrUpdate} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Category Name
                    </label>
                    <input
                      name="name"
                      defaultValue={editingCategory?.name}
                      required
                      className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingCategory?.description}
                      className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg px-4 py-2 outline-none focus:ring-2 focus:ring-indigo-500"
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Priority
                      </label>
                      <select
                        name="priority"
                        className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg px-4 py-2 outline-none"
                      >
                        {priorityOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Effort (hrs)
                      </label>
                      <input
                        name="defaultTimeWeightHours"
                        type="number"
                        defaultValue={
                          editingCategory?.defaultTimeWeightHours || 1
                        }
                        className="w-full bg-gray-50 dark:bg-gray-700 border dark:border-gray-600 rounded-lg px-4 py-2 outline-none"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Category Color
                    </label>
                    <div className="flex gap-3">
                      {colorOptions.map((c) => (
                        <label key={c.hex} className="cursor-pointer">
                          <input
                            type="radio"
                            name="color"
                            value={c.hex}
                            className="hidden"
                            defaultChecked={
                              editingCategory?.color === c.hex ||
                              (!editingCategory &&
                                c.hex === colorOptions[0].hex)
                            }
                          />
                          <div
                            className="w-8 h-8 rounded-full border-2 border-transparent peer-checked:border-indigo-600 transition-all"
                            style={{ backgroundColor: c.hex }}
                          />
                        </label>
                      ))}
                    </div>
                  </div>
                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="px-5 py-2 rounded-lg border dark:border-gray-600"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-indigo-600 text-white rounded-lg font-bold"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {categoryToDelete && (
            <motion.div
              className="fixed inset-0 z-[60] bg-black/60 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-sm w-full text-center"
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.9 }}
              >
                <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold mb-2">Delete Category?</h3>
                <p className="text-gray-500 mb-6 italic">
                  "{categoryToDelete.name}"
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 py-2 border dark:border-gray-600 rounded-lg"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => handleDelete(categoryToDelete.id)}
                    className="flex-1 py-2 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CategoriesPage;

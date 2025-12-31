// src/components/CategoriesPage.tsx

import React, { useState, useMemo } from "react";
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
    <div className="bg-[var(--bg-card)] p-6 rounded-2xl shadow-xl border border-[var(--border-main)]">
      <h3 className="text-lg font-black text-[var(--text-main)] mb-6 flex items-center tracking-tight">
        <BarChart className="w-5 h-5 mr-3 text-[var(--accent)]" />
        Workload Distribution
      </h3>
      <p className="text-sm text-[var(--text-muted)] mb-6 font-medium">
        Estimated Cumulative Effort:{" "}
        <span className="font-black text-[var(--text-main)] bg-[var(--accent)]/10 px-2 py-0.5 rounded ml-1">
          {totalEffort} hours
        </span>
      </p>
      <div className="space-y-5">
        {data.map((item, index) => {
          const percentage =
            totalEffort > 0 ? (item.effort / totalEffort) * 100 : 0;

          return (
            <div key={item.name}>
              <div className="flex justify-between items-center text-xs mb-2 uppercase tracking-widest font-black opacity-80">
                <span className="text-[var(--text-main)]">{item.name}</span>
                <span className="text-[var(--text-muted)]">
                  {item.effort} hrs
                </span>
              </div>
              <div className="w-full bg-[var(--bg-main)] rounded-full h-3 border border-[var(--border-main)]">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${percentage}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full rounded-full shadow-sm"
                  style={{ backgroundColor: `var(--accent)` }}
                />
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
    const id = editingCategory
      ? editingCategory.id
      : Math.max(0, ...categories.map((c) => c.id)) + 1;

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

  const handleEditClick = (cat: Category) => {
    setEditingCategory(cat);
    setShowModal(true);
  };

  const handleDelete = (id: number) => {
    setCategories(categories.filter((cat) => cat.id !== id));
    setCategoryToDelete(null);
  };

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter((cat) =>
      cat.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    if (filterStatus !== "All Status")
      filtered = filtered.filter(
        (cat) => cat.status === filterStatus.toLowerCase()
      );

    if (sortOption === "Sort by Name")
      filtered.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortOption === "Sort by Sessions")
      filtered.sort((a, b) => b.sessionCount - a.sessionCount);
    else if (sortOption === "Sort by Priority") {
      const priorityOrder = { High: 3, Medium: 2, Low: 1 };
      filtered.sort(
        (a, b) => priorityOrder[b.priority] - priorityOrder[a.priority]
      );
    }
    return filtered;
  }, [categories, searchTerm, filterStatus, sortOption]);

  const activeCategories = filteredCategories.filter(
    (c) => c.status === "active"
  );
  const analyticsData = activeCategories.map((cat) => ({
    name: cat.name,
    effort: cat.sessionCount * cat.defaultTimeWeightHours,
  }));
  const totalEffort = analyticsData.reduce((sum, item) => sum + item.effort, 0);

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-6 max-w-7xl mx-auto font-sans">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-6 md:space-y-0">
          <div>
            <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
              Category Control
            </h1>
            <p className="text-[var(--text-muted)] font-medium mt-2">
              Management of academic disciplines and workload analysis.
            </p>
          </div>
          <motion.button
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="bg-[var(--accent)] text-white px-6 py-3 rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 flex items-center transition-all"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Plus className="w-5 h-5 mr-2 stroke-[3]" /> Create Discipline
          </motion.button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-[var(--border-main)] mb-10 overflow-x-auto no-scrollbar">
          {["management", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-8 py-3 text-xs font-black uppercase tracking-[0.2em] transition-all relative ${
                activeTab === tab
                  ? "text-[var(--accent)]"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabUnderline"
                  className="absolute bottom-0 left-0 right-0 h-1 bg-[var(--accent)] rounded-t-full"
                />
              )}
            </button>
          ))}
        </div>

        {activeTab === "management" && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              {[
                {
                  label: "Total Spheres",
                  val: categories.length,
                  icon: FolderOpen,
                },
                {
                  label: "Active Nodes",
                  val: activeCategories.length,
                  icon: BookOpen,
                },
                {
                  label: "Specialists",
                  val: categories.reduce((s, c) => s + c.facultyCount, 0),
                  icon: Users,
                },
                { label: "Total Load", val: `${totalEffort}h`, icon: Clock },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="bg-[var(--bg-card)] rounded-[2rem] shadow-xl border border-[var(--border-main)] p-6 group transition-all hover:border-[var(--accent)]/50"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] mb-2">
                        {stat.label}
                      </p>
                      <p className="text-3xl font-black text-[var(--text-main)]">
                        {stat.val}
                      </p>
                    </div>
                    <div className="p-4 bg-[var(--accent)]/10 rounded-2xl group-hover:scale-110 transition-transform">
                      <stat.icon className="w-6 h-6 text-[var(--accent)]" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 gap-4">
              <div className="relative flex-1 max-w-lg">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)] w-5 h-5 opacity-60" />
                <input
                  type="text"
                  placeholder="Search by name..."
                  className="w-full pl-12 pr-6 py-4 bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl outline-none focus:ring-2 focus:ring-[var(--accent)] transition-all font-bold"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="flex gap-3">
                <select
                  className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl px-5 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--accent)] transition-all"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option>All Status</option>
                  <option>Active</option>
                  <option>Inactive</option>
                </select>
                <select
                  className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl px-5 py-2 text-xs font-black uppercase tracking-widest outline-none focus:border-[var(--accent)] transition-all"
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
            <div className="space-y-5 mb-12">
              <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-muted)] flex items-center">
                <span className="w-1.5 h-4 bg-[var(--accent)] rounded-full mr-3" />
                Active Disciplines ({activeCategories.length})
              </h2>
              {activeCategories.map((cat) => (
                <div
                  key={cat.id}
                  className="bg-[var(--bg-card)] rounded-[2rem] shadow-xl border border-[var(--border-main)] overflow-hidden group hover:border-[var(--accent)]/50 transition-all"
                >
                  <div className="p-5 flex flex-wrap items-center justify-between gap-6">
                    <div className="flex items-center space-x-5 flex-1 min-w-[300px]">
                      <div className="w-16 h-16 rounded-[1.25rem] flex items-center justify-center bg-[var(--bg-main)] border border-[var(--border-main)] group-hover:scale-105 transition-transform">
                        <cat.image className="w-8 h-8 text-[var(--accent)] opacity-80" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-black text-[var(--text-main)] mb-1">
                          {cat.name}
                        </h3>
                        <p className="text-sm text-[var(--text-muted)] font-medium line-clamp-1">
                          {cat.description}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-12">
                      <div className="text-center hidden sm:block">
                        <div className="flex items-center text-xs font-black uppercase tracking-widest mb-1">
                          <Star className="w-3 h-3 mr-2 text-yellow-500 fill-yellow-500" />
                          {cat.priority}
                        </div>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold">
                          DISCIPLINE PRIORITY
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="font-black text-xl text-[var(--text-main)] mb-0.5">
                          {cat.facultyCount}
                        </p>
                        <p className="text-[10px] text-[var(--text-muted)] font-bold uppercase tracking-widest">
                          FACULTY
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2 border-l border-[var(--border-main)] pl-6">
                      <button
                        onClick={() => handleEditClick(cat)}
                        className="p-3 text-[var(--text-muted)] hover:text-[var(--accent)] transition-all hover:scale-110"
                      >
                        <Edit className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => setCategoryToDelete(cat)}
                        className="p-3 text-[var(--text-muted)] hover:text-red-500 transition-all hover:scale-110"
                      >
                        <Trash2 className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
          >
            <div className="lg:col-span-2">
              <WorkloadChart data={analyticsData} />
            </div>
            <div className="space-y-6">
              <div className="bg-[var(--bg-card)] p-8 rounded-[2.5rem] border border-[var(--border-main)] shadow-xl">
                <h3 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--text-main)] mb-8">
                  Efficiency Index
                </h3>
                <div className="space-y-6">
                  <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-4">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                      Avg Faculty Density
                    </span>
                    <span className="font-black text-xl text-[var(--accent)]">
                      {(
                        categories.reduce((s, c) => s + c.facultyCount, 0) /
                        categories.length
                      ).toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest">
                      Resource Weight
                    </span>
                    <span className="font-black text-xl text-[var(--accent)]">
                      {(
                        totalEffort /
                        categories.reduce((s, c) => s + c.sessionCount, 0)
                      ).toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="bg-yellow-500/10 border border-yellow-500/20 p-8 rounded-[2.5rem]">
                <h3 className="text-yellow-600 dark:text-yellow-400 text-xs font-black uppercase tracking-[0.2em] flex items-center mb-4">
                  <AlertTriangle className="w-4 h-4 mr-2" /> Alert Protocol
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300 font-bold leading-relaxed">
                  Nodes with High Session frequency and Low Priority thresholds
                  require immediate recalibration.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Create/Edit Modal */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 transition-all">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-[var(--bg-card)] rounded-[2.5rem] shadow-2xl w-full max-w-lg p-10 border border-[var(--border-main)] relative overflow-hidden"
              >
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-6 right-6 text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors p-2"
                >
                  <X className="w-6 h-6 stroke-[3]" />
                </button>
                <h3 className="text-3xl font-black text-[var(--text-main)] mb-8 tracking-tight">
                  {editingCategory ? "Update Discipline" : "New Discipline"}
                </h3>
                <form onSubmit={handleCreateOrUpdate} className="space-y-6">
                  <div>
                    <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                      Full Category Title
                    </label>
                    <input
                      name="name"
                      defaultValue={editingCategory?.name}
                      required
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                      Core Description
                    </label>
                    <textarea
                      name="description"
                      defaultValue={editingCategory?.description}
                      rows={3}
                      className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-4 outline-none focus:ring-2 focus:ring-[var(--accent)] font-bold transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                        Priority Level
                      </label>
                      <select
                        name="priority"
                        defaultValue={editingCategory?.priority}
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-4 outline-none font-bold uppercase tracking-widest text-xs"
                      >
                        {priorityOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest mb-2 ml-1">
                        Effort Bias (Hrs)
                      </label>
                      <input
                        name="defaultTimeWeightHours"
                        type="number"
                        defaultValue={
                          editingCategory?.defaultTimeWeightHours || 1
                        }
                        className="w-full bg-[var(--bg-main)] border border-[var(--border-main)] text-[var(--text-main)] rounded-2xl px-5 py-4 outline-none font-bold"
                      />
                    </div>
                  </div>
                  <div className="flex gap-4 pt-4">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] hover:bg-[var(--bg-main)] rounded-2xl transition-all"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-4 bg-[var(--accent)] text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:opacity-90 transition-all"
                    >
                      Confirm Discipline
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* Delete Confirmation */}
        <AnimatePresence>
          {categoryToDelete && (
            <div className="fixed inset-0 z-[110] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9 }}
                animate={{ scale: 1 }}
                className="bg-[var(--bg-card)] rounded-[2.5rem] p-10 max-w-sm w-full text-center border border-[var(--border-main)] shadow-2xl"
              >
                <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertTriangle className="w-10 h-10 text-red-500" />
                </div>
                <h3 className="text-2xl font-black text-[var(--text-main)] mb-2">
                  Delete Discipline?
                </h3>
                <p className="text-[var(--text-muted)] mb-8 font-medium italic">
                  "{categoryToDelete.name}"
                </p>
                <div className="flex gap-4">
                  <button
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 py-4 text-xs font-black uppercase tracking-widest text-[var(--text-muted)] border border-[var(--border-main)] rounded-2xl hover:bg-[var(--bg-main)] transition-all"
                  >
                    Keep
                  </button>
                  <button
                    onClick={() => handleDelete(categoryToDelete.id)}
                    className="flex-1 py-4 bg-red-600 text-white rounded-2xl font-black uppercase tracking-widest text-xs shadow-lg hover:bg-red-700 transition-all"
                  >
                    Delete
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

export default CategoriesPage;

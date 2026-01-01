import React, { useState, useMemo, useEffect } from "react";
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
  FlaskConical,
  Globe,
  Dna,
  Cpu,
  Calculator,
  Zap,
  Clock,
  Star,
  BarChart,
  Sparkles,
  ShieldCheck,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";

/* ---------------- TYPES & MOCK DATA (UNCHANGED LOGIC) ---------------- */
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
    subjects: ["Calculus", "Linear Algebra", "Statistics"],
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
      "Theoretical and applied physics covering mechanics and thermodynamics",
    color: "#10B981",
    facultyCount: 8,
    sessionCount: 64,
    subjects: ["Mechanics", "Thermodynamics", "Quantum"],
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
      "Programming, algorithms, data structures, and software principles",
    color: "#9333EA",
    facultyCount: 15,
    sessionCount: 128,
    subjects: ["Data Structures", "Algorithms", "ML"],
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
    subjects: ["Organic", "Inorganic", "BioChem"],
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
    subjects: ["Classical", "Modern Poetry"],
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
    subjects: ["Molecular", "Genetics"],
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

/* ---------------- AESTHETIC HELPERS ---------------- */
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

const WorkloadChart: React.FC<{ data: { name: string; effort: number }[] }> = ({
  data,
}) => {
  const totalEffort = data.reduce((sum, item) => sum + item.effort, 0);

  return (
    <div className="bg-[var(--bg-card)] p-10 rounded-[3.5rem] shadow-2xl border border-[var(--border-main)] relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:scale-110 transition-transform duration-1000">
        <BarChart size={180} />
      </div>
      <h3 className="text-2xl font-black text-[var(--text-main)] mb-10 flex items-center tracking-tighter uppercase italic">
        <Target className="w-6 h-6 mr-3 text-[var(--accent)] animate-pulse" />{" "}
        Node Effort Metrics
      </h3>
      <div className="space-y-8">
        {data.map((item, index) => {
          const percentage =
            totalEffort > 0 ? (item.effort / totalEffort) * 100 : 0;
          return (
            <div key={item.name} className="relative">
              <div className="flex justify-between items-center text-[10px] mb-3 uppercase tracking-[0.3em] font-black opacity-50">
                <span>{item.name}</span>
                <span className="text-[var(--accent)] font-black">
                  {item.effort} UNITS
                </span>
              </div>
              <div className="w-full bg-[var(--bg-main)] rounded-full h-3 border border-[var(--border-main)] p-0.5 relative overflow-hidden shadow-inner">
                <motion.div
                  initial={{ width: 0 }}
                  whileInView={{ width: `${percentage}%` }}
                  transition={{
                    duration: 1.5,
                    ease: "circOut",
                    delay: index * 0.1,
                  }}
                  className="h-full rounded-full relative shadow-[0_0_15px_var(--accent)]"
                  style={{ backgroundColor: `var(--accent)` }}
                >
                  <motion.div
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent w-20"
                  />
                </motion.div>
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

  /* Logic Handlers (Unchanged) */
  const handleCreateOrUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const id = editingCategory
      ? editingCategory.id
      : Math.max(0, ...categories.map((c) => c.id)) + 1;
    const newCategory: Category = {
      id,
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
    if (editingCategory)
      setCategories(
        categories.map((cat) => (cat.id === newCategory.id ? newCategory : cat))
      );
    else setCategories([...categories, newCategory]);
    setShowModal(false);
    setEditingCategory(null);
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
      const pOrder = { High: 3, Medium: 2, Low: 1 };
      filtered.sort((a, b) => pOrder[b.priority] - pOrder[a.priority]);
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
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-500 overflow-hidden font-sans relative">
      {/* Background Galactic Sparks */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <AestheticSparkle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 15}
          />
        ))}
        <div className="absolute top-[-20%] left-[-10%] w-[50rem] h-[50rem] bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px]" />
      </div>

      <div className="p-6 md:p-10 max-w-7xl mx-auto relative z-10">
        {/* HEADER SECTION */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-end mb-16 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-[var(--accent)]/10 rounded-2xl text-[var(--accent)] shadow-inner">
                <Target size={24} strokeWidth={3} />
              </div>
              <span className="text-[11px] font-black uppercase tracking-[0.5em] text-[var(--text-muted)] opacity-50">
                Operational Node Registry
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter text-[var(--text-main)] leading-[0.8] uppercase italic">
              Registry <br />{" "}
              <span className="text-[var(--accent)]">Sync.</span>
            </h1>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.05, y: -4, rotate: [0, -1, 1, 0] }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setEditingCategory(null);
              setShowModal(true);
            }}
            className="bg-[var(--accent)] text-white px-12 py-6 rounded-[2.2rem] font-black uppercase tracking-widest text-xs shadow-[0_30px_60px_rgba(0,0,0,0.2)] flex items-center gap-4 transition-all border border-white/20"
          >
            <Plus size={20} strokeWidth={4} /> Initialize Node
          </motion.button>
        </div>

        {/* TABS (Elite Switcher) */}
        <div className="flex bg-[var(--bg-card)]/50 backdrop-blur-xl border border-[var(--border-main)] mb-16 rounded-[2rem] p-1.5 shadow-2xl max-w-md">
          {["management", "analytics"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`flex-1 py-4 text-[10px] font-black uppercase tracking-[0.3em] transition-all relative z-10 ${
                activeTab === tab
                  ? "text-white"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <motion.div
                  layoutId="tabGlow"
                  className="absolute inset-0 bg-[var(--accent)] rounded-2xl shadow-lg"
                />
              )}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "management" ? (
            <motion.div
              key="manage"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              {/* Stat Bento Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
                {[
                  {
                    label: "Neural Spheres",
                    val: categories.length,
                    icon: FolderOpen,
                  },
                  {
                    label: "Active Nodes",
                    val: activeCategories.length,
                    icon: Zap,
                  },
                  {
                    label: "Faculty Links",
                    val: categories.reduce((s, c) => s + c.facultyCount, 0),
                    icon: Users,
                  },
                  {
                    label: "Load Intensity",
                    val: `${totalEffort}h`,
                    icon: BarChart,
                  },
                ].map((stat, i) => (
                  <motion.div
                    key={i}
                    whileHover={{ y: -8 }}
                    className="bg-[var(--bg-card)] rounded-[3rem] p-8 border border-[var(--border-main)] group shadow-xl relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="flex flex-col gap-6 relative z-10">
                      <div className="p-5 bg-[var(--bg-main)] rounded-3xl w-fit shadow-inner group-hover:scale-110 group-hover:rotate-12 transition-all duration-500">
                        <stat.icon className="w-8 h-8 text-[var(--accent)]" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] mb-1 opacity-50">
                          {stat.label}
                        </p>
                        <p className="text-5xl font-black text-[var(--text-main)] tracking-tighter">
                          {stat.val}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {/* SEARCH & FILTERS */}
              <div className="flex flex-col md:flex-row items-center gap-6 mb-12">
                <div className="relative flex-1 w-full group">
                  <Search
                    className="absolute left-6 top-1/2 -translate-y-1/2 text-[var(--text-muted)] group-focus-within:text-[var(--accent)] transition-colors"
                    size={22}
                    strokeWidth={3}
                  />
                  <input
                    type="text"
                    placeholder="IDENTIFY NODE BY NAME..."
                    className="w-full pl-16 pr-8 py-6 bg-[var(--bg-card)] border-2 border-transparent rounded-[3rem] outline-none focus:border-[var(--accent)] transition-all font-black text-xs uppercase tracking-widest shadow-2xl placeholder:opacity-30"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="flex gap-4">
                  <div className="relative group">
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="bg-[var(--bg-card)] border border-[var(--border-main)] rounded-2xl px-10 py-6 text-[10px] font-black uppercase tracking-[0.2em] outline-none focus:border-[var(--accent)] shadow-xl appearance-none cursor-pointer"
                    >
                      <option>All Status</option>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                    <MoreHorizontal
                      size={14}
                      className="absolute right-4 top-1/2 -translate-y-1/2 opacity-30"
                    />
                  </div>
                </div>
              </div>

              {/* NODE LIST */}
              <div className="space-y-6 mb-20">
                <AnimatePresence mode="popLayout">
                  {filteredCategories.map((cat, idx) => (
                    <motion.div
                      key={cat.id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ delay: idx * 0.05 }}
                      whileHover={{ x: 15 }}
                      className={`bg-[var(--bg-card)] rounded-[3rem] shadow-2xl border-l-[8px] border border-[var(--border-main)] overflow-hidden group transition-all relative`}
                      style={{
                        borderLeftColor:
                          cat.status === "active" ? "var(--accent)" : "#444",
                      }}
                    >
                      <div className="p-8 flex flex-wrap items-center justify-between gap-8 relative z-10">
                        <div className="flex items-center space-x-10 flex-1">
                          <div className="w-24 h-24 rounded-[2rem] flex items-center justify-center bg-[var(--bg-main)] shadow-inner relative group-hover:rotate-6 transition-transform">
                            <cat.image
                              className="w-10 h-10 text-[var(--accent)]"
                              strokeWidth={1.5}
                            />
                            <AestheticSparkle delay={idx * 0.2} />
                          </div>
                          <div className="max-w-md">
                            <h3 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase italic mb-2">
                              {cat.name}
                            </h3>
                            <p className="text-sm text-[var(--text-muted)] font-medium leading-relaxed opacity-60 italic">
                              "{cat.description}"
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-12">
                          <div className="text-right hidden xl:block">
                            <div className="flex items-center justify-end text-[11px] font-black text-yellow-500 uppercase tracking-widest mb-2">
                              <Star
                                size={14}
                                className="mr-2 fill-current shadow-[0_0_10px_orange]"
                              />{" "}
                              {cat.priority}
                            </div>
                            <p className="text-[9px] font-black uppercase text-[var(--text-muted)] opacity-30 tracking-[0.3em]">
                              Protocol Weight
                            </p>
                          </div>
                          <div className="h-12 w-[1px] bg-[var(--border-main)] hidden lg:block" />
                          <div className="text-right">
                            <p className="text-3xl font-black text-[var(--text-main)] tracking-tighter">
                              {cat.facultyCount}
                            </p>
                            <p className="text-[9px] font-black uppercase text-[var(--text-muted)] opacity-30 tracking-[0.3em]">
                              Links
                            </p>
                          </div>
                          <div className="flex items-center gap-3 pl-8">
                            <button
                              onClick={() => handleEditClick(cat)}
                              className="p-5 bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-[var(--accent)] hover:bg-[var(--bg-card)] rounded-3xl transition-all shadow-sm"
                            >
                              <Edit size={20} />
                            </button>
                            <button
                              onClick={() => setCategoryToDelete(cat)}
                              className="p-5 bg-[var(--bg-main)] text-[var(--text-muted)] hover:text-red-500 hover:bg-red-500/10 rounded-3xl transition-all shadow-sm"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="stats"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-12"
            >
              <div className="lg:col-span-2">
                <WorkloadChart data={analyticsData} />
              </div>
              <div className="space-y-10">
                <div className="bg-[var(--bg-card)] p-12 rounded-[4rem] border border-[var(--border-main)] shadow-[0_40px_100px_rgba(0,0,0,0.2)] relative overflow-hidden">
                  <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-45">
                    <BarChart size={200} />
                  </div>
                  <h3 className="text-[11px] font-black uppercase tracking-[0.4em] text-[var(--text-main)] mb-12">
                    Intelligence Matrix
                  </h3>
                  <div className="space-y-10">
                    <div className="flex justify-between items-center border-b border-[var(--border-main)] pb-8">
                      <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                        Neural Density
                      </span>
                      <span className="font-black text-4xl text-[var(--accent)] tracking-tighter">
                        {(
                          categories.reduce((s, c) => s + c.facultyCount, 0) /
                          categories.length
                        ).toFixed(1)}
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                        Force Factor
                      </span>
                      <span className="font-black text-4xl text-[var(--accent)] tracking-tighter">
                        {(
                          totalEffort /
                          categories.reduce((s, c) => s + c.sessionCount, 0)
                        ).toFixed(1)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="bg-orange-500/5 border-2 border-orange-500/10 p-12 rounded-[4rem] relative overflow-hidden group">
                  <AlertTriangle
                    className="absolute -bottom-8 -right-8 opacity-10 group-hover:rotate-12 transition-transform duration-700"
                    size={160}
                  />
                  <h3 className="text-orange-500 text-[11px] font-black uppercase tracking-[0.4em] flex items-center mb-8">
                    <Zap className="w-5 h-5 mr-3 fill-current" /> Critical Node
                  </h3>
                  <p className="text-sm text-orange-600/80 font-bold leading-relaxed italic uppercase tracking-tighter">
                    Protocol warning: Nodes exceeding session frequency limits
                    require immediate decryption and load balancing.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* INITIALIZATION MODAL (Quantum Theme) */}
        <AnimatePresence>
          {showModal && (
            <div className="fixed inset-0 z-[120] bg-black/80 backdrop-blur-2xl flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0, rotateX: 25 }}
                animate={{ scale: 1, opacity: 1, rotateX: 0 }}
                exit={{ scale: 0.8, opacity: 0 }}
                className="bg-[var(--bg-card)] rounded-[4.5rem] shadow-[0_60px_120px_rgba(0,0,0,0.5)] w-full max-w-2xl p-16 border-2 border-[var(--border-main)] relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent)] opacity-[0.03] rounded-full blur-[80px] -mr-20 -mt-20" />
                <button
                  onClick={() => setShowModal(false)}
                  className="absolute top-10 right-10 text-[var(--text-muted)] hover:text-red-500 p-4 bg-[var(--bg-main)] rounded-3xl transition-all hover:rotate-90"
                >
                  <X size={28} strokeWidth={4} />
                </button>

                <div className="mb-12">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="h-1 w-12 bg-[var(--accent)] rounded-full" />
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] text-[var(--accent)]">
                      Protocol Interface
                    </span>
                  </div>
                  <h3 className="text-5xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">
                    {editingCategory ? "Recalibrate" : "Register"}{" "}
                    <span className="text-[var(--accent)]">Node</span>
                  </h3>
                </div>

                <form
                  onSubmit={handleCreateOrUpdate}
                  className="space-y-10 relative z-10"
                >
                  <div className="space-y-4">
                    <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] ml-6 block opacity-40">
                      System Node ID
                    </label>
                    <input
                      name="name"
                      defaultValue={editingCategory?.name}
                      required
                      className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[2rem] px-10 py-7 outline-none focus:border-[var(--accent)] font-black text-sm transition-all shadow-inner uppercase tracking-widest"
                      placeholder="CORE_DISCIPLINE_01"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] ml-6 block opacity-40">
                        Node Priority
                      </label>
                      <select
                        name="priority"
                        defaultValue={editingCategory?.priority}
                        className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[2rem] px-10 py-7 outline-none font-black text-xs uppercase tracking-widest shadow-inner appearance-none"
                      >
                        {priorityOptions.map((p) => (
                          <option key={p} value={p}>
                            {p}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-4">
                      <label className="text-[10px] font-black text-[var(--text-muted)] uppercase tracking-[0.4em] ml-6 block opacity-40">
                        Effort Bias
                      </label>
                      <input
                        name="defaultTimeWeightHours"
                        type="number"
                        defaultValue={
                          editingCategory?.defaultTimeWeightHours || 1
                        }
                        className="w-full bg-[var(--bg-main)] border-2 border-[var(--border-main)] text-[var(--text-main)] rounded-[2rem] px-10 py-7 outline-none font-black text-sm shadow-inner"
                      />
                    </div>
                  </div>
                  <div className="flex gap-6 mt-16 relative">
                    <AestheticSparkle delay={0.5} size={24} />
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-7 text-[11px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] hover:bg-red-500/10 rounded-[2.5rem] transition-all border-2 border-transparent hover:border-red-500/20"
                    >
                      Discard
                    </button>
                    <button
                      type="submit"
                      className="flex-[2] py-7 bg-[var(--accent)] text-white rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl shadow-indigo-500/40 active:scale-95 transition-all"
                    >
                      Establish Uplink
                    </button>
                  </div>
                </form>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        {/* PURGE CONFIRMATION (Technical UI) */}
        <AnimatePresence>
          {categoryToDelete && (
            <div className="fixed inset-0 z-[150] bg-black/90 backdrop-blur-3xl flex items-center justify-center p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-[var(--bg-card)] rounded-[4rem] p-16 max-w-md w-full text-center border-2 border-red-500/20 shadow-3xl"
              >
                <div className="w-24 h-24 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-10 border border-red-500/20">
                  <Zap
                    className="w-10 h-10 text-red-500 animate-pulse"
                    strokeWidth={3}
                  />
                </div>
                <h3 className="text-4xl font-black text-[var(--text-main)] mb-3 tracking-tighter uppercase">
                  Purge Node?
                </h3>
                <p className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.4em] mb-12 opacity-50">
                  This action is irreversible
                </p>
                <div className="flex gap-5">
                  <button
                    onClick={() => setCategoryToDelete(null)}
                    className="flex-1 py-6 text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)] border-2 border-[var(--border-main)] rounded-3xl hover:bg-[var(--bg-main)]"
                  >
                    Retain
                  </button>
                  <button
                    onClick={() => handleDelete(categoryToDelete.id)}
                    className="flex-1 py-6 bg-red-600 text-white rounded-3xl font-black uppercase tracking-widest text-[10px] shadow-2xl"
                  >
                    Confirm Purge
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

import React, { useState, useEffect } from "react";
import { useFaculty } from "../../hooks/useFaculty";
import { FacultyMember } from "../../types/faculty";
import {
  CheckCircle,
  XCircle,
  UserMinus,
  Trash2,
  Sparkles,
  ShieldCheck,
  Zap,
  Mail,
  ArrowUpRight,
  User,
  GraduationCap,
  X,
  Fingerprint,
  Activity,
  Globe,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/* ---------------- AESTHETIC SPARKLE COMPONENT ---------------- */
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

/* ================= FACULTY DETAIL MODAL (RE-DESIGNED) ================= */
const EnhancedFacultyDetailModal = ({
  faculty,
  onClose,
}: {
  faculty: FacultyMember;
  onClose: () => void;
}) => {
  if (!faculty) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-2xl flex items-center justify-center z-[200] p-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 40 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 40 }}
        className="bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] w-full max-w-2xl overflow-hidden border border-[var(--border-main)] relative"
      >
        {/* Animated Gradient Header */}
        <div className="h-48 bg-gradient-to-r from-indigo-600 via-[var(--accent)] to-purple-600 relative">
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, 0] }}
            transition={{ duration: 10, repeat: Infinity }}
            className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"
          />
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-3 bg-white/10 hover:bg-white/20 text-white rounded-2xl backdrop-blur-md transition-all z-20"
          >
            <X size={20} strokeWidth={3} />
          </button>
        </div>

        <div className="px-10 pb-12 relative">
          {/* Avatar Node */}
          <div className="relative -mt-20 mb-8 inline-block">
            <div className="absolute -top-4 -right-4">
              <AestheticSparkle delay={0.2} size={24} />
            </div>
            <div className="h-40 w-40 rounded-[2.5rem] bg-[var(--bg-card)] p-2 shadow-2xl relative z-10 border border-[var(--border-main)]">
              <div className="h-full w-full rounded-[2rem] bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-800 dark:to-black flex items-center justify-center overflow-hidden">
                <User size={60} className="text-[var(--accent)] opacity-50" />
              </div>
            </div>
            <div className="absolute inset-0 bg-[var(--accent)] blur-3xl opacity-20 rounded-full" />
          </div>

          <div className="grid md:grid-cols-2 gap-10">
            {/* Left Col: Core ID */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--accent)] mb-1">
                  Identity Node
                </p>
                <h3 className="text-4xl font-black text-[var(--text-main)] tracking-tighter leading-none">
                  {faculty.name}
                </h3>
                <StatusBadge status={faculty.status} />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="p-5 bg-[var(--bg-main)] rounded-3xl border border-[var(--border-main)]"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-2 bg-blue-500/10 rounded-xl text-blue-500">
                    <Mail size={16} />
                  </div>
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    {faculty.email}
                  </span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="p-2 bg-purple-500/10 rounded-xl text-purple-500">
                    <Fingerprint size={16} />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[var(--text-muted)]">
                    NODE_REF_{faculty.id}
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Right Col: Academic Data */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] mb-3">
                  Institutional Scope
                </p>
                <div className="space-y-4">
                  <div className="flex items-center gap-4 p-4 border border-[var(--border-main)] rounded-2xl hover:border-[var(--accent)] transition-colors group">
                    <GraduationCap className="text-[var(--accent)] group-hover:scale-110 transition-transform" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-[var(--text-muted)] opacity-50">
                        Discipline Hub
                      </p>
                      <p className="text-sm font-black uppercase tracking-tight">
                        {faculty.subjects || "General Sciences"}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 p-4 border border-[var(--border-main)] rounded-2xl">
                    <Activity className="text-emerald-500" />
                    <div>
                      <p className="text-[8px] font-black uppercase text-[var(--text-muted)] opacity-50">
                        Registry Date
                      </p>
                      <p className="text-sm font-black uppercase tracking-tight">
                        Cycle_2025_Q1
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          <div className="mt-12 flex justify-end">
            <button
              onClick={onClose}
              className="px-10 py-4 bg-[var(--bg-main)] text-[var(--text-main)] border border-[var(--border-main)] rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-[var(--bg-card)] transition-all"
            >
              Terminate View
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

/* ================= STATUS BADGE (UNCHANGED LOGIC) ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const configs: Record<string, { class: string; icon: any }> = {
    PENDING: {
      class: "bg-orange-500/10 text-orange-600 border-orange-500/20",
      icon: Zap,
    },
    ACTIVE: {
      class:
        "bg-green-500/10 text-green-600 border-green-500/20 shadow-[0_0_15px_rgba(34,197,94,0.1)]",
      icon: CheckCircle,
    },
    INACTIVE: {
      class: "bg-gray-500/10 text-gray-500 border-gray-500/20",
      icon: XCircle,
    },
    REJECTED: {
      class: "bg-red-500/10 text-red-600 border-red-500/20",
      icon: XCircle,
    },
  };
  const config = configs[status] || configs.INACTIVE;
  const Icon = config.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border ${config.class}`}
    >
      <Icon size={10} strokeWidth={3} /> {status}
    </span>
  );
};

/* ================= FACULTY CARD ================= */
const FacultyCard = ({
  faculty,
  actions,
  onClick,
}: {
  faculty: FacultyMember;
  actions: React.ReactNode;
  onClick: () => void;
}) => (
  <motion.div
    layout
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.01 }}
    onClick={onClick}
    className="group relative flex flex-col md:flex-row justify-between items-start md:items-center 
               bg-[var(--bg-card)] p-6 rounded-[2.5rem] border border-[var(--border-main)] 
               shadow-xl hover:shadow-2xl transition-all cursor-pointer overflow-hidden"
  >
    <div className="absolute inset-0 bg-gradient-to-br from-[var(--accent)]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
    <div className="flex gap-6 items-center relative z-10">
      <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-[var(--accent)] to-purple-500 flex items-center justify-center text-white font-black text-xl">
        {faculty.name.charAt(0)}
      </div>
      <div className="flex-1">
        <h3 className="text-xl font-black text-[var(--text-main)] tracking-tighter uppercase italic">
          {faculty.name}
        </h3>
        <p className="text-xs font-bold text-[var(--text-muted)] flex items-center gap-2">
          <Mail size={12} /> {faculty.email}
        </p>
        <div className="mt-3">
          <StatusBadge status={faculty.status} />
        </div>
      </div>
    </div>
    <div
      className="flex flex-wrap gap-3 w-full md:w-auto relative z-10"
      onClick={(e) => e.stopPropagation()}
    >
      {actions}
    </div>
  </motion.div>
);

/* ================= ADMIN PAGE ================= */
const AdminFacultyPage = () => {
  const {
    faculty,
    loading,
    error,
    approveFacultyByAdmin,
    rejectFacultyByAdmin,
    deactivateFacultyByAdmin,
    activateFacultyByAdmin,
    removeFaculty,
  } = useFaculty();
  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(
    null
  );

  if (loading)
    return (
      <div className="min-h-screen bg-[var(--bg-main)] flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="relative"
        >
          <Zap className="h-16 w-16 text-[var(--accent)] opacity-20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Sparkles className="h-6 w-6 text-[var(--accent)] animate-pulse" />
          </div>
        </motion.div>
      </div>
    );

  const pending = faculty.filter((f) => f.status === "PENDING");
  const active = faculty.filter((f) => f.status === "ACTIVE");
  const inactive = faculty.filter((f) => f.status === "INACTIVE");

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-all duration-500 font-sans relative overflow-hidden">
      {/* Background Sparkles */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        {[...Array(12)].map((_, i) => (
          <AestheticSparkle
            key={i}
            delay={Math.random() * 5}
            size={Math.random() * 20}
          />
        ))}
      </div>

      <div className="p-8 md:p-12 max-w-7xl mx-auto relative z-10">
        <header className="mb-20 flex flex-col md:flex-row md:items-end justify-between gap-8">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-[var(--accent)]/10 rounded-lg text-[var(--accent)]">
                <ShieldCheck size={20} strokeWidth={3} />
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.4em] text-[var(--text-muted)] opacity-60">
                Control Terminal
              </span>
            </div>
            <h1 className="text-7xl font-black tracking-tighter leading-[0.8] uppercase italic">
              Faculty <span className="text-[var(--accent)]">Uplink.</span>
            </h1>
          </motion.div>
        </header>

        {/* Sections */}
        <SectionContainer title="Awaiting Validation" count={pending.length}>
          {pending.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <div className="flex gap-2">
                  <button
                    onClick={() => approveFacultyByAdmin(f.id)}
                    className="px-8 py-3.5 rounded-2xl bg-green-500 text-white text-[10px] font-black uppercase tracking-widest shadow-xl shadow-green-500/20 active:scale-95 transition-all"
                  >
                    Validate
                  </button>
                  <button
                    onClick={() => rejectFacultyByAdmin(f.id)}
                    className="px-8 py-3.5 rounded-2xl bg-red-500/10 text-red-500 border border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
                  >
                    Reject
                  </button>
                </div>
              }
            />
          ))}
        </SectionContainer>

        <SectionContainer title="Active Nodes" count={active.length}>
          {active.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => deactivateFacultyByAdmin(f.id)}
                    className="p-3.5 rounded-2xl bg-orange-500/10 text-orange-500 hover:bg-orange-500 hover:text-white transition-all"
                  >
                    <UserMinus size={18} />
                  </button>
                  <button
                    onClick={() =>
                      window.confirm("Purge node?") && removeFaculty(f.id)
                    }
                    className="p-3.5 rounded-2xl bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              }
            />
          ))}
        </SectionContainer>

        <SectionContainer title="Offline" count={inactive.length}>
          {inactive.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <button
                  onClick={() => activateFacultyByAdmin(f.id)}
                  className="px-8 py-3.5 rounded-2xl bg-[var(--accent)] text-white text-[10px] font-black uppercase tracking-widest shadow-xl transition-all"
                >
                  Restore
                </button>
              }
            />
          ))}
        </SectionContainer>

        <AnimatePresence>
          {selectedFaculty && (
            <EnhancedFacultyDetailModal
              faculty={selectedFaculty}
              onClose={() => setSelectedFaculty(null)}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

const SectionContainer = ({ title, count, children }: any) => (
  <div className="mb-20">
    <div className="flex items-center justify-between mb-8 border-b border-[var(--border-main)] pb-4">
      <h2 className="text-xs font-black uppercase tracking-[0.4em] text-[var(--text-muted)] flex items-center gap-3">
        <div className="h-1 w-8 bg-[var(--accent)] rounded-full" /> {title}
      </h2>
      <span className="text-[10px] font-black text-[var(--accent)]">
        {count} NODES
      </span>
    </div>
    <div className="grid gap-6">{children}</div>
  </div>
);

export default AdminFacultyPage;

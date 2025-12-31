import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  CheckCircle,
  Play,
  Users,
  Calendar,
  BarChart3,
  FileText,
  Clock,
  Plus,
  Activity,
  Zap,
  Briefcase,
  Shield,
  Loader,
  Monitor,
  BookOpen,
  Mail,
  ArrowRight,
  SparkleIcon,
  Target,
  Code,
  Cloud,
  Sparkles,
  Star,
  Cpu,
} from "lucide-react";
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
  useInView,
  AnimatePresence,
} from "framer-motion";

import faculty from "../assets/images/faculty.png";

const FACULTY_IMAGE_PLACEHOLDER_URL = faculty;

// --- MOCK DATA ---
const MOCK_LIVE_SESSION_DATA = {
  isLive: true,
  sessionTitle: "AI Fundamentals: Neural Networks",
  faculty: "Dr. Anya Sharma",
  duration: "2:34:12",
};

const MOCK_UPCOMING_SESSIONS = [
  {
    id: 201,
    name: "Quantum Mechanics Review",
    faculty: "Prof. Li Wei",
    time: "9:00 AM",
    date: "Today",
    category: "Physics",
  },
  {
    id: 202,
    name: "Advanced CSS Layouts Workshop",
    faculty: "David Kim",
    time: "1:30 PM",
    date: "Today",
    category: "CS",
  },
  {
    id: 203,
    name: "Microeconomics Case Study",
    faculty: "Dr. Sarah Johnson",
    time: "10:00 AM",
    date: "Tomorrow",
    category: "Economics",
  },
];

/* ---------------- MAGIC SPARKLE TRAIL CURSOR ---------------- */
const MagicSparkleCursor = () => {
  const [stars, setStars] = useState<
    { id: number; x: number; y: number; color: string }[]
  >([]);
  const colors = ["#6366f1", "#f59e0b", "#10b981", "#ec4899", "#ffffff"];

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
        const newStar = {
          id: Math.random(),
          x: e.clientX,
          y: e.clientY,
          color: colors[Math.floor(Math.random() * colors.length)],
        };
        setStars((prev) => [...prev.slice(-20), newStar]);
      }
    };
    window.addEventListener("mousemove", handleMove);
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {stars.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 180, y: s.y + 50 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            style={{
              left: s.x,
              top: s.y,
              position: "absolute",
              color: s.color,
            }}
          >
            <Sparkles size={14} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- AESTHETIC FLOATING SPARKLE OBJECTS ---------------- */
const AestheticFloatingIcon: React.FC<{
  Icon: React.ElementType;
  delay: number;
  color: string;
  style: React.CSSProperties;
}> = ({ Icon, delay, color, style }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0.6, 1, 0.6],
      scale: [1, 1.15, 1],
      y: [0, -25, 0],
      rotate: [0, 15, -15, 0],
    }}
    transition={{ duration: 7, delay, repeat: Infinity, ease: "easeInOut" }}
    className={`absolute rounded-[1.2rem] p-3 shadow-2xl ${color} backdrop-blur-xl border border-white/30 z-20 flex items-center justify-center`}
    style={style}
  >
    <Icon className="w-5 h-5 text-white drop-shadow-md" />

    {/* Orbiting Sparkles */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    >
      <Sparkles
        size={10}
        className="text-yellow-300 absolute -top-2 -left-2 animate-pulse"
      />
    </motion.div>

    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
      className="absolute inset-0"
    >
      <Star
        size={8}
        fill="currentColor"
        className="text-white absolute -bottom-2 -right-2"
      />
    </motion.div>
  </motion.div>
);

/* ---------------- ANIMATED STATS ---------------- */
const AnimatedStat = ({
  from,
  to,
  duration,
  suffix,
  label,
  colorClass,
  isPercentage = false,
}: any) => {
  const count = useMotionValue(from);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const formattedValue = useTransform(count, (latest) => {
    const val = isPercentage ? latest.toFixed(1) : latest.toFixed(0);
    return val.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  });

  useEffect(() => {
    if (isInView) animate(count, to, { duration });
  }, [isInView, count, to, duration]);

  return (
    <motion.div
      ref={ref}
      className="text-center p-8 rounded-[2.5rem] bg-[var(--bg-main)] border border-[var(--border-main)] transition-all"
      whileHover={{ y: -10, borderColor: "var(--accent)" }}
    >
      <div
        className={`text-5xl font-black mb-2 tracking-tighter ${colorClass}`}
      >
        <motion.span>{formattedValue}</motion.span>
        {suffix}
      </div>
      <div className="text-[10px] text-[var(--text-muted)] font-black uppercase tracking-[0.2em]">
        {label}
      </div>
    </motion.div>
  );
};

/* ---------------- MAIN HOME PAGE ---------------- */
const HomePage = () => {
  const navigate = useNavigate();
  const [liveSession] = useState(MOCK_LIVE_SESSION_DATA);

  const operationalMetrics = [
    {
      title: "Scheduled",
      value: 45,
      change: "+5",
      icon: Calendar,
      color: "text-orange-600",
      bg: "bg-orange-500/10",
      path: "/dashboard/calendar",
    },
    {
      title: "In Progress",
      value: 3,
      change: "+1",
      icon: Loader,
      color: "text-blue-600",
      bg: "bg-blue-500/10",
      path: "/dashboard/sessions",
    },
    {
      title: "Completed Today",
      value: 12,
      change: "-2",
      icon: CheckCircle,
      color: "text-green-600",
      bg: "bg-green-500/10",
      path: "/dashboard/reports",
    },
    {
      title: "Active Faculty",
      value: 85,
      change: "+3",
      icon: Users,
      color: "text-purple-600",
      bg: "bg-purple-500/10",
      path: "/dashboard/faculty",
    },
  ];

  const steps = [
    {
      title: "Identity Setup",
      desc: "Profile & Authentication",
      completed: true,
      action: () => navigate("/dashboard/settings"),
    },
    {
      title: "Staff Sync",
      desc: "Teaching Node Import",
      completed: true,
      action: () => navigate("/dashboard/faculty"),
    },
    {
      title: "Logic Categories",
      desc: "Departmental Org",
      completed: true,
      action: () => navigate("/dashboard/categories"),
    },
    {
      title: "Schedule Uplink",
      desc: "Timing Management",
      completed: false,
      action: () => navigate("/dashboard/calendar"),
    },
  ];

  const progress =
    (steps.filter((s) => s.completed).length / steps.length) * 100;

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-10 transition-all duration-300 relative overflow-hidden">
      <MagicSparkleCursor />

      <div className="max-w-7xl mx-auto font-sans relative z-10">
        {/* HERO GALAXY SECTION */}
        <div className="bg-[var(--accent)] rounded-[3.5rem] p-10 lg:p-20 mb-12 text-white relative overflow-hidden shadow-[0_40px_100px_-20px_rgba(0,0,0,0.3)] border border-white/10">
          <div className="absolute inset-0">
            <motion.div
              animate={{ scale: [1, 1.2, 1], rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-20 -left-20 w-[40rem] h-[40rem] bg-white opacity-[0.05] rounded-full blur-[120px]"
            />
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.1, 0.2, 0.1] }}
              transition={{ duration: 10, repeat: Infinity }}
              className="absolute bottom-0 right-0 w-[30rem] h-[30rem] bg-indigo-300 rounded-full blur-[100px]"
            />
          </div>

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-16">
            <div className="flex-1 text-center md:text-left">
              {liveSession.isLive && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="inline-flex items-center text-[10px] mb-10 bg-white/10 backdrop-blur-2xl px-6 py-2.5 rounded-full font-black uppercase tracking-[0.3em] border border-white/20"
                >
                  <span className="relative flex h-2.5 w-2.5 mr-3">
                    <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative h-2.5 w-2.5 rounded-full bg-red-500 shadow-[0_0_10px_red]"></span>
                  </span>
                  Transmitting LIVE: {liveSession.sessionTitle}
                </motion.div>
              )}

              <h1 className="text-6xl lg:text-8xl font-black mb-10 leading-[0.85] tracking-tighter drop-shadow-2xl">
                The New <br />
                <span className="text-white/40 italic">Excellence.</span>
              </h1>

              <p className="text-xl text-white/70 mb-12 max-w-lg font-medium leading-relaxed">
                A high-performance orchestration node for faculty management.
                Sync schedules and datasets in a single, beautiful workspace.
              </p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center md:justify-start">
                <motion.button
                  onClick={() => navigate("/dashboard/calendar")}
                  className="bg-white text-[var(--accent)] px-12 py-6 rounded-[2.2rem] font-black uppercase tracking-widest text-xs shadow-2xl hover:bg-gray-100 transition-all active:scale-95 flex items-center justify-center"
                >
                  Deploy Session <ArrowRight className="ml-3 w-5 h-5" />
                </motion.button>
                <motion.button
                  onClick={() => navigate("/dashboard/reports")}
                  className="bg-white/5 backdrop-blur-xl border border-white/20 text-white px-12 py-6 rounded-[2.2rem] font-black uppercase tracking-widest text-xs hover:bg-white/10 transition-all flex items-center justify-center"
                >
                  Audit Logs
                </motion.button>
              </div>
            </div>

            {/* AVATAR GALAXY */}
            <div className="relative w-full max-w-sm md:max-w-md aspect-square flex items-center justify-center">
              <motion.div
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 border-[1px] border-dashed border-white/20 rounded-full scale-110"
              />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                className="absolute inset-10 border-[1px] border-white/10 rounded-full shadow-inner"
              />

              <div className="relative p-6 bg-white/5 backdrop-blur-3xl rounded-full border border-white/10 shadow-2xl overflow-hidden">
                <img
                  src={FACULTY_IMAGE_PLACEHOLDER_URL}
                  alt="faculty"
                  className="rounded-full w-64 h-64 md:w-80 md:h-80 object-cover shadow-2xl border-4 border-white/20 transition-transform duration-700 hover:scale-110"
                />
              </div>

              <AestheticFloatingIcon
                Icon={Cpu}
                delay={0}
                color="bg-indigo-500"
                style={{ top: "0%", left: "5%" }}
              />
              <AestheticFloatingIcon
                Icon={Zap}
                delay={1.5}
                color="bg-amber-500"
                style={{ top: "10%", right: "-5%" }}
              />
              <AestheticFloatingIcon
                Icon={Cloud}
                delay={3}
                color="bg-teal-500"
                style={{ bottom: "10%", right: "5%" }}
              />
              <AestheticFloatingIcon
                Icon={Target}
                delay={4.5}
                color="bg-rose-500"
                style={{ bottom: "0%", left: "15%" }}
              />
              <AestheticFloatingIcon
                Icon={Code}
                delay={2.2}
                color="bg-pink-500"
                style={{ top: "45%", left: "-15%" }}
              />
            </div>
          </div>
        </div>

        {/* METRICS BENTO GRID */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {operationalMetrics.map((metric, index) => (
            <motion.div
              key={index}
              className="bg-[var(--bg-card)] rounded-[3rem] p-8 border border-[var(--border-main)] cursor-pointer shadow-xl transition-all group relative overflow-hidden"
              onClick={() => navigate(metric.path)}
              whileHover={{ y: -10, borderColor: "var(--accent)" }}
            >
              <div className="absolute -bottom-4 -right-4 opacity-5 group-hover:opacity-20 group-hover:rotate-12 transition-all duration-700">
                <metric.icon size={120} />
              </div>

              <div className="flex items-center justify-between mb-10 relative z-10">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[var(--text-muted)]">
                  {metric.title}
                </p>
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-125 ${metric.bg} shadow-lg shadow-black/5`}
                >
                  <metric.icon className={`w-6 h-6 ${metric.color}`} />
                </div>
              </div>
              <p className="text-6xl font-black text-[var(--text-main)] mb-1 tracking-tighter">
                {metric.value}
              </p>
              <div className="flex items-center gap-2">
                <div
                  className={`h-1.5 w-1.5 rounded-full ${
                    metric.change.startsWith("+")
                      ? "bg-green-500 animate-pulse"
                      : "bg-red-500"
                  }`}
                />
                <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-widest opacity-60">
                  Status Active
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-12 mb-20">
          {/* STEPPER */}
          <div className="lg:col-span-1">
            <div className="bg-[var(--bg-card)] rounded-[3.5rem] p-12 shadow-2xl border border-[var(--border-main)] relative overflow-hidden">
              <div className="flex items-center justify-between mb-12">
                <h2 className="text-xl font-black text-[var(--text-main)] uppercase tracking-tighter">
                  System Integration
                </h2>
                <Sparkles
                  size={20}
                  className="text-[var(--accent)] animate-spin-slow"
                />
              </div>
              <div className="w-full bg-[var(--bg-main)] rounded-full h-3 mb-12 border border-[var(--border-main)] p-1">
                <motion.div
                  className="bg-[var(--accent)] h-full rounded-full shadow-[0_0_15px_var(--accent)]"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 2, ease: "circOut" }}
                />
              </div>
              <div className="space-y-5">
                {steps.map((step, index) => (
                  <motion.div
                    key={index}
                    onClick={step.action}
                    className={`flex items-start gap-5 p-6 rounded-[2.2rem] cursor-pointer transition-all ${
                      step.completed
                        ? "bg-[var(--bg-main)]/50 opacity-40 grayscale"
                        : "bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--accent)] shadow-sm hover:shadow-xl"
                    }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
                        step.completed
                          ? "bg-green-500 text-white shadow-lg shadow-green-500/20"
                          : "bg-[var(--bg-main)] text-[var(--accent)]"
                      }`}
                    >
                      {step.completed ? (
                        <CheckCircle size={20} />
                      ) : (
                        <Zap size={18} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-black uppercase tracking-widest text-[var(--text-main)] mb-1">
                        {step.title}
                      </p>
                      <p className="text-[10px] font-bold text-[var(--text-muted)] uppercase opacity-60">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* PERFORMANCE ANALYTICS */}
          <div className="lg:col-span-2 space-y-12">
            <div className="bg-[var(--bg-card)] rounded-[3.5rem] p-14 border border-[var(--border-main)] shadow-2xl overflow-hidden relative">
              <div className="absolute top-0 right-0 p-12 opacity-5 scale-150 rotate-12">
                <BarChart3 size={300} />
              </div>
              <h2 className="text-xl font-black text-[var(--text-main)] mb-12 flex items-center tracking-[0.3em] uppercase">
                <Activity className="w-5 h-5 text-[var(--accent)] mr-4" />{" "}
                Global Grid Stats
              </h2>
              <div className="grid md:grid-cols-3 gap-10">
                <AnimatedStat
                  from={0}
                  to={2500}
                  duration={2}
                  suffix="+"
                  label="Faculty Nodes"
                  colorClass="text-[var(--accent)]"
                />
                <AnimatedStat
                  from={0}
                  to={15000}
                  duration={2.3}
                  suffix="+"
                  label="Total Operations"
                  colorClass="text-blue-500"
                />
                <AnimatedStat
                  from={0}
                  to={98.3}
                  duration={2.6}
                  suffix="%"
                  label="Core Stability"
                  colorClass="text-green-500"
                  isPercentage
                />
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              {[
                {
                  title: "Node Map",
                  icon: Users,
                  path: "/dashboard/faculty",
                  color: "text-purple-500",
                },
                {
                  title: "Protocol",
                  icon: Calendar,
                  path: "/dashboard/calendar",
                  color: "text-blue-500",
                },
                {
                  title: "Firewall",
                  icon: Shield,
                  path: "/dashboard/settings",
                  color: "text-orange-500",
                },
                {
                  title: "Uplink",
                  icon: Cloud,
                  path: "/dashboard/reports",
                  color: "text-emerald-500",
                },
              ].map((action, i) => (
                <motion.button
                  key={i}
                  onClick={() => navigate(action.path)}
                  className="flex flex-col items-center justify-center p-8 rounded-[2.8rem] bg-[var(--bg-card)] border border-[var(--border-main)] hover:border-[var(--accent)] transition-all shadow-xl group"
                  whileHover={{ scale: 1.05, y: -8 }}
                >
                  <div className="p-5 bg-[var(--bg-main)] rounded-3xl mb-4 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300">
                    <action.icon
                      className={`w-8 h-8 ${action.color}`}
                      strokeWidth={2.5}
                    />
                  </div>
                  <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-main)]">
                    {action.title}
                  </span>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Background Micro-Sparkles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute text-[var(--accent)] opacity-20"
            animate={{ opacity: [0, 0.4, 0], scale: [0.5, 1, 0.5] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: i,
            }}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
          >
            <SparkleIcon size={12} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default HomePage;

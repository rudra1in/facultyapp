import React, { useState, useEffect, useRef } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  Bell,
  Menu,
  Settings,
  User,
  Moon,
  Sun,
  Sunrise,
  Leaf,
  MessageSquare,
  X,
  Hexagon,
  Sparkles as SparkleIcon,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ui/ThemeContext";
import { getRole } from "../utils/auth";
import LogoutButton from "../components/common/LogoutButton";
import { profileService } from "../services/profile.service";

/* ---------------- SPARKLE EFFECT COMPONENT ---------------- */
const AestheticSparkle = ({ color }: { color: string }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0 }}
    animate={{
      opacity: [0, 1, 0],
      scale: [0, 1.2, 0.5],
      rotate: [0, 90, 180],
    }}
    transition={{
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
      delay: Math.random() * 2,
    }}
    className={`absolute pointer-events-none ${color}`}
  >
    <SparkleIcon size={10} fill="currentColor" />
  </motion.div>
);

/* ---------------- MAGIC CURSOR COMPONENT ---------------- */
const MagicSparkleCursor = () => {
  const [sparkles, setSparkles] = useState<
    { id: number; x: number; y: number }[]
  >([]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (Math.random() > 0.8) {
        const newSparkle = {
          id: Date.now() + Math.random(),
          x: e.clientX,
          y: e.clientY,
        };
        setSparkles((prev) => [...prev.slice(-15), newSparkle]);
      }
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <AnimatePresence>
        {sparkles.map((s) => (
          <motion.div
            key={s.id}
            initial={{ opacity: 1, scale: 0, rotate: 0 }}
            animate={{ opacity: 0, scale: 1.5, rotate: 90, y: s.y + 20 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            style={{ left: s.x, top: s.y, position: "absolute" }}
            className="text-[var(--accent)]"
          >
            <SparkleIcon size={14} fill="currentColor" />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- NAV TYPES ---------------- */
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/* ---------------- SIDEBAR CONTENT (FIXED) ---------------- */
const SidebarContent = ({
  navigation,
  onClose,
}: {
  navigation: NavItem[];
  onClose?: () => void;
}) => (
  <div className="flex flex-col h-full bg-[var(--bg-card)] text-[var(--text-main)] border-r border-[var(--border-main)] transition-all duration-500">
    <div className="flex items-center justify-between px-6 h-20 border-b border-[var(--border-main)] bg-[var(--bg-card)]">
      <div className="flex items-center group cursor-pointer">
        <div className="relative flex items-center justify-center w-12 h-12">
          <motion.div
            animate={{ scale: [1, 1.15, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute inset-0 bg-[var(--accent)] rounded-full blur-xl"
          />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            className="relative z-10 text-[var(--accent)]"
          >
            <Hexagon size={38} strokeWidth={1.5} />
          </motion.div>
          <motion.div
            animate={{ scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="absolute z-20 bg-[var(--accent)] h-4 w-4 rounded-full shadow-[0_0_15px_var(--accent)] flex items-center justify-center"
          >
            <SparkleIcon size={8} className="text-white fill-white" />
          </motion.div>
        </div>

        <div className="ml-4 flex flex-col">
          <span className="text-xl font-black tracking-tighter leading-none uppercase">
            Faculty<span className="text-[var(--accent)]">Hub</span>
          </span>
          <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60">
            Standard Excellence
          </span>
        </div>
      </div>
    </div>

    <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto no-scrollbar">
      {navigation.map((item) => (
        <NavLink key={item.name} to={item.href} onClick={onClose}>
          {({ isActive }) => (
            <div
              className={`flex items-center px-4 py-3 rounded-2xl text-sm font-bold transition-all duration-300 group relative overflow-hidden ${
                isActive
                  ? "bg-[var(--accent)] text-white shadow-xl shadow-indigo-500/20 translate-x-1"
                  : "text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--accent)]"
              }`}
            >
              <item.icon className="mr-3 h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
              <span className="tracking-tight">{item.name}</span>
              {/* Indicator fixed by checking isActive inside the block */}
              {isActive && (
                <motion.div
                  layoutId="nav-active-bar"
                  className="absolute left-0 w-1 h-1/2 bg-white rounded-r-full"
                />
              )}
            </div>
          )}
        </NavLink>
      ))}
    </nav>
  </div>
);

/* ---------------- MAIN LAYOUT ---------------- */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme, setPreviewTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  const [user, setUser] = useState({ name: "", photo: "/default-avatar.png" });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const data = await profileService.getMyProfile();
        setUser({
          name: data.name,
          photo: data.profileImage
            ? `http://localhost:8080/uploads/profile/${data.profileImage}`
            : "/default-avatar.png",
        });
      } catch {
        console.error("Failed to load profile");
      }
    };
    loadUser();
  }, [location.pathname]);

  const baseNav: NavItem[] = [
    { name: "Home", href: "/dashboard/home", icon: Home },
    { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
    ...(role === "ADMIN"
      ? [{ name: "Faculty", href: "/dashboard/admin-faculty", icon: Users }]
      : []),
    { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
    { name: "Calendar", href: "/dashboard/calendar", icon: Hexagon },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const themes = [
    {
      id: "light",
      icon: Sun,
      color: "text-yellow-500",
      sparkle: "text-yellow-300",
    },
    {
      id: "dark",
      icon: Moon,
      color: "text-indigo-400",
      sparkle: "text-indigo-200",
    },
    {
      id: "orange",
      icon: Sunrise,
      color: "text-orange-600",
      sparkle: "text-orange-300",
    },
    {
      id: "leaf",
      icon: Leaf,
      color: "text-green-700",
      sparkle: "text-green-300",
    },
  ];

  return (
    <div className="h-screen flex transition-colors duration-500 overflow-hidden font-sans bg-[var(--bg-main)] text-[var(--text-main)] selection:bg-[var(--accent)] selection:text-white">
      {/* GLOBAL SPARKLE CURSOR */}
      <MagicSparkleCursor />

      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex w-72 shrink-0 z-20 overflow-hidden shadow-2xl">
        <SidebarContent navigation={baseNav} />
      </aside>

      <div className="flex-1 flex flex-col min-w-0 relative">
        <header className="h-16 flex items-center px-4 md:px-8 bg-[var(--bg-card)]/80 backdrop-blur-xl border-b border-[var(--border-main)] z-10 sticky top-0">
          <button
            className="lg:hidden mr-4 p-2 rounded-xl hover:bg-[var(--bg-main)] transition-colors text-[var(--text-main)]"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={20} />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <div className="flex items-center gap-1 bg-[var(--bg-main)] p-1 rounded-2xl border border-[var(--border-main)] relative">
              {themes.map((t) => (
                <motion.button
                  key={t.id}
                  whileTap={{ scale: 0.9 }}
                  onMouseEnter={() => setPreviewTheme(t.id as any)}
                  onMouseLeave={() => setPreviewTheme(null)}
                  onClick={() => setTheme(t.id as any)}
                  className={`relative p-2.5 rounded-xl transition-all duration-300 ${
                    theme === t.id
                      ? "bg-[var(--bg-card)] shadow-lg scale-110"
                      : "opacity-40 hover:opacity-100"
                  }`}
                >
                  {theme === t.id && <AestheticSparkle color={t.sparkle} />}
                  <t.icon size={16} className={t.color} />
                </motion.button>
              ))}
            </div>

            <div className="h-8 w-[1px] bg-[var(--border-main)] mx-1 hidden sm:block" />

            <button
              onClick={() => navigate("/dashboard/profile")}
              className="group flex items-center gap-3 hover:bg-[var(--bg-main)] px-3 py-1.5 rounded-2xl transition-all duration-500 relative"
            >
              <div className="relative">
                <motion.div
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="relative z-10 h-10 w-10"
                >
                  <img
                    src={user.photo}
                    alt="p"
                    className="h-full w-full rounded-xl object-cover ring-2 ring-[var(--accent)] shadow-lg"
                  />
                </motion.div>
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <AestheticSparkle color="text-[var(--accent)]" />
                </div>
              </div>
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-sm font-black text-[var(--text-main)] truncate max-w-[120px]">
                  {user.name || "Admin"}
                </span>
                <span className="text-[10px] font-black text-[var(--accent)] uppercase tracking-widest opacity-80">
                  {role}
                </span>
              </div>
            </button>
            <LogoutButton />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 md:p-8 bg-[var(--bg-main)] no-scrollbar">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full h-full"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* MOBILE SIDEBAR (FIXED Reference) */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSidebarOpen(false)}
              className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed left-0 top-0 h-full w-80 z-50 lg:hidden shadow-2xl"
            >
              <SidebarContent
                navigation={baseNav}
                onClose={() => setSidebarOpen(false)}
              />
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DashboardLayout;

import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Home,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  Bell,
  Target,
  Menu,
  Settings,
  User,
  Moon,
  Sun,
  MessageSquare,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ui/ThemeContext";
import { getRole } from "../utils/auth";
import LogoutButton from "../components/common/LogoutButton";
import { profileService } from "../services/profile.service";

/* ---------------- NAV TYPES ---------------- */
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/* ---------------- SIDEBAR CONTENT ---------------- */
const SidebarContent = ({
  navigation,
  onClose,
}: {
  navigation: NavItem[];
  onClose?: () => void;
}) => (
  <div
    className="
      flex flex-col h-full
      bg-white dark:bg-gray-900
      text-gray-900 dark:text-gray-100
      border-r border-gray-200 dark:border-gray-800
      transition-colors duration-300
    "
  >
    {/* LOGO SECTION */}
    <div className="flex items-center justify-between px-6 h-16 border-b border-gray-200 dark:border-gray-800">
      <div className="flex items-center">
        <div className="bg-indigo-600 p-1.5 rounded-lg shadow-lg">
          <Target className="h-6 w-6 text-white" />
        </div>
        <span className="ml-3 text-xl font-black tracking-tight">
          FacultyApp
        </span>
      </div>
      {/* Mobile Close Button */}
      {onClose && (
        <button
          onClick={onClose}
          className="lg:hidden p-2 text-gray-400 hover:text-gray-600 dark:hover:text-white"
        >
          <X size={20} />
        </button>
      )}
    </div>

    {/* NAVIGATION LIST */}
    <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
      <p className="px-3 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-4">
        Main Menu
      </p>
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          onClick={onClose}
          className={({ isActive }) =>
            `
              flex items-center px-4 py-3 rounded-xl text-sm font-bold
              transition-all duration-200 group
              ${
                isActive
                  ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none"
                  : "text-gray-600 dark:text-gray-400 hover:bg-indigo-50 dark:hover:bg-gray-800 hover:text-indigo-600 dark:hover:text-white"
              }
            `
          }
        >
          <item.icon className="mr-3 h-5 w-5 shrink-0 transition-transform group-hover:scale-110" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  </div>
);

/* ---------------- MAIN LAYOUT ---------------- */
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const role = getRole();

  const [user, setUser] = useState({
    name: "",
    photo: "/default-avatar.png",
  });

  /* ---------- LOAD PROFILE ---------- */
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
        console.error("Failed to load dashboard profile");
      }
    };

    loadUser();
  }, [location.pathname]);

  /* ---------------- ROLE-BASED NAV ---------------- */
  const baseNav: NavItem[] = [
    { name: "Home", href: "/dashboard/home", icon: Home },
    { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
    ...(role === "ADMIN"
      ? [{ name: "Faculty", href: "/dashboard/admin-faculty", icon: Users }]
      : []),
    { name: "Categories", href: "/dashboard/categories", icon: FolderOpen },
    { name: "Calendar", href: "/dashboard/calendar", icon: Target },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-950 transition-colors duration-300 overflow-hidden">
      {/* DESKTOP SIDEBAR - Standard fixed width */}
      <div className="hidden lg:flex w-72 shrink-0 shadow-2xl z-20">
        <SidebarContent navigation={baseNav} />
      </div>

      {/* MAIN VIEWPORT */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* HEADER - Consistent with Sidebar background */}
        <header
          className="
            h-16 flex items-center px-4 md:px-8
            bg-white dark:bg-gray-900
            border-b border-gray-200 dark:border-gray-800
            transition-colors duration-300 z-10
          "
        >
          <button
            className="lg:hidden mr-3 p-2 rounded-xl text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu size={24} />
          </button>

          <div className="ml-auto flex items-center gap-2 md:gap-4">
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="
                p-2.5 rounded-xl border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-400
                hover:bg-gray-100 dark:hover:bg-gray-800
                transition-all duration-200
              "
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
            </button>

            {/* PROFILE DROPDOWN */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="
                flex items-center gap-3
                hover:bg-gray-100 dark:hover:bg-gray-800
                px-3 py-1.5 rounded-xl transition-all duration-200
                border border-transparent hover:border-gray-200 dark:hover:border-gray-700
              "
            >
              <img
                src={user.photo}
                alt="profile"
                className="h-8 w-8 rounded-lg object-cover ring-2 ring-indigo-50 dark:ring-indigo-900/30"
              />
              <div className="hidden md:flex flex-col items-start leading-tight">
                <span className="text-xs font-black text-gray-900 dark:text-white truncate max-w-[120px]">
                  {user.name || "My Account"}
                </span>
                <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-tighter">
                  {role}
                </span>
              </div>
            </button>

            <div className="h-6 w-[1px] bg-gray-200 dark:border-gray-700 mx-1 hidden sm:block" />

            <LogoutButton />
          </div>
        </header>

        {/* PAGE CONTENT CONTAINER - Deepest background for contrast */}
        <main className="flex-1 overflow-y-auto bg-gray-50/50 dark:bg-gray-950 transition-colors duration-300">
          <Outlet />
        </main>

        {/* MOBILE SIDEBAR MODAL */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
              />

              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="fixed left-0 top-0 h-full w-72 z-50 lg:hidden"
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
    </div>
  );
};

export default DashboardLayout;

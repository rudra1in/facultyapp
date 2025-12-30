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

/* ---------------- SIDEBAR ---------------- */
const SidebarContent = ({ navigation }: { navigation: NavItem[] }) => (
  <div className="flex flex-col h-full bg-white dark:bg-gray-800 border-r">
    <div className="flex items-center px-4 py-4">
      <Target className="h-8 w-8 text-indigo-600" />
      <span className="ml-2 text-xl font-bold">FacultyApp</span>
    </div>

    <nav className="flex-1 px-2 space-y-1">
      {navigation.map((item) => (
        <NavLink
          key={item.name}
          to={item.href}
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-lg ${
              isActive
                ? "bg-indigo-600 text-white"
                : "hover:bg-indigo-50 dark:hover:bg-gray-700"
            }`
          }
        >
          <item.icon className="mr-3 h-5 w-5" />
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
  const location = useLocation(); // ✅ IMPORTANT
  const role = getRole();

  const [user, setUser] = useState({
    name: "",
    photo: "/default-avatar.png",
  });

  // 🔥 Load dashboard profile (ADMIN & FACULTY)
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
      } catch (e) {
        console.error("Failed to load dashboard profile");
      }
    };

    loadUser();
  }, [location.pathname]); // 🔥 FIX LINE

  /* ---------------- ROLE-BASED NAV ---------------- */
  const navigation: NavItem[] =
    role === "ADMIN"
      ? [
          { name: "Home", href: "/dashboard/home", icon: Home },
          { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
          { name: "Faculty", href: "/dashboard/admin-faculty", icon: Users },
          {
            name: "Categories",
            href: "/dashboard/categories",
            icon: FolderOpen,
          },
          { name: "Calendar", href: "/dashboard/calendar", icon: Target },
          { name: "Contacts", href: "/dashboard/contacts", icon: Users },
          { name: "Reports", href: "/dashboard/reports", icon: FileText },
          {
            name: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
          },
          {
            name: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
          },
          { name: "Profile", href: "/dashboard/profile", icon: User },
          { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ]
      : [
          { name: "Home", href: "/dashboard/home", icon: Home },
          { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
          {
            name: "Categories",
            href: "/dashboard/categories",
            icon: FolderOpen,
          },
          { name: "Calendar", href: "/dashboard/calendar", icon: Target },
          { name: "Contacts", href: "/dashboard/contacts", icon: Users },
          { name: "Reports", href: "/dashboard/reports", icon: FileText },
          {
            name: "Notifications",
            href: "/dashboard/notifications",
            icon: Bell,
          },
          {
            name: "Messages",
            href: "/dashboard/messages",
            icon: MessageSquare,
          },
          { name: "Profile", href: "/dashboard/profile", icon: User },
          { name: "Settings", href: "/dashboard/settings", icon: Settings },
        ];

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900">
      {/* DESKTOP SIDEBAR */}
      <div className="hidden lg:flex w-64">
        <SidebarContent navigation={navigation} />
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex flex-col">
        {/* HEADER */}
        <div className="h-16 flex items-center px-4 bg-white dark:bg-gray-800 border-b">
          <button
            className="lg:hidden mr-3"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div className="ml-auto flex items-center gap-4">
            {/* Theme Toggle */}
            <button onClick={toggleTheme}>
              {isDarkMode ? <Sun /> : <Moon />}
            </button>

            {/* Profile */}
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="flex items-center gap-2"
            >
              <img
                src={user.photo}
                className="h-8 w-8 rounded-full object-cover"
              />
              <span className="hidden md:block font-semibold">{user.name}</span>
            </button>

            <LogoutButton />
          </div>
        </div>

        {/* PAGE CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        {/* MOBILE SIDEBAR */}
        <AnimatePresence>
          {sidebarOpen && (
            <>
              <motion.div
                onClick={() => setSidebarOpen(false)}
                className="fixed inset-0 bg-black/40 z-40"
              />
              <motion.div
                className="fixed left-0 top-0 h-full w-64 z-50"
                initial={{ x: -300 }}
                animate={{ x: 0 }}
                exit={{ x: -300 }}
              >
                <SidebarContent navigation={navigation} />
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;

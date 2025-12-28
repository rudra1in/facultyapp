import React, { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
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
  ChevronDown,
  User,
  Moon,
  Sun,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ui/ThemeContext";
import defaultUserPhoto from "../assets/images/milan.png";
import ChatComponent from "../components/chat/ChatComponent";
import LogoutButton from "../components/common/LogoutButton";

/* ---------------- MOCK USER ---------------- */
const mockUser = {
  uid: "mock-001",
  displayName: "Demo User",
  email: "demo@app.com",
  photoURL: defaultUserPhoto,
};

/* ---------------- NAV TYPES ---------------- */
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

/* ---------------- USER DROPDOWN ---------------- */
const UserProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative ml-4">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-3 p-2 rounded-lg
                   hover:bg-gray-200 dark:hover:bg-gray-700"
      >
        <img
          src={mockUser.photoURL}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="hidden md:block text-left">
          <p className="text-sm font-semibold">{mockUser.displayName}</p>
          <p className="text-xs text-gray-400">Demo Account</p>
        </div>
        <ChevronDown className="h-4 w-4" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute right-0 mt-2 w-52
                       bg-white dark:bg-gray-800
                       border border-gray-200 dark:border-gray-700
                       rounded-xl shadow-xl"
          >
            <button
              onClick={() => navigate("/dashboard/profile")}
              className="w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-700"
            >
              Profile
            </button>
            <button
              onClick={() => navigate("/dashboard/settings")}
              className="w-full px-4 py-2 text-left hover:bg-indigo-50 dark:hover:bg-gray-700"
            >
              Settings
            </button>

            <div className="px-4 py-2">
              <LogoutButton />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* ---------------- SIDEBAR ---------------- */
const SidebarContent = ({ navigation }: { navigation: NavItem[] }) => (
  <div
    className="flex flex-col h-full bg-white dark:bg-gray-800
               text-gray-900 dark:text-gray-100 border-r
               border-gray-200 dark:border-gray-700"
  >
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
            `flex items-center px-3 py-2 rounded-lg transition
             ${
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
  const [sidebarOpen] = useState(false);
  const [selectedChat, setSelectedChat] = useState<{
    id: string;
    name: string;
  } | null>(null);

  const { isDarkMode, toggleTheme } = useTheme();

  const navigation: NavItem[] = [
    { name: "Home", href: "/dashboard/home", icon: Home },
    { name: "Overview", href: "/dashboard/overview", icon: BarChart3 },
    { name: "Faculty", href: "/dashboard/faculty", icon: Users },
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
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors">
      <div className="hidden lg:flex w-64">
        <SidebarContent navigation={navigation} />
      </div>

      <div className="flex-1 flex flex-col">
        <div className="h-16 flex items-center px-4 bg-white dark:bg-gray-800 border-b">
          <button className="lg:hidden mr-3">
            <Menu />
          </button>

          <div className="ml-auto flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              {isDarkMode ? (
                <Sun className="text-yellow-400" />
              ) : (
                <Moon className="text-indigo-600" />
              )}
            </button>

            <UserProfileDropdown />
          </div>
        </div>

        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>

        <AnimatePresence>
          {selectedChat && (
            <ChatComponent
              chatRoomId={selectedChat.id}
              currentUserId={mockUser.uid}
              currentUserName={mockUser.displayName}
            />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;

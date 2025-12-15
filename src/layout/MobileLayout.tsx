import React from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";
import {
  Home,
  BookOpen,
  Bell,
  User,
  Settings,
  ChevronLeft,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ui/ThemeContext";

// ================= MOBILE NAV =================
const mobileNavConfig = [
  { name: "Home", path: "/faculty/home", icon: Home },
  { name: "Courses", path: "/faculty/categories", icon: BookOpen },
  { name: "Notifications", path: "/faculty/notifications", icon: Bell },
  { name: "Profile", path: "/faculty/profile", icon: User },
];

// ================= HEADER =================
const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const title = location.pathname.split("/").pop()?.replace("-", " ") || "Home";

  return (
    <header className="sticky top-0 z-30 bg-white shadow">
      <div className="flex items-center justify-between h-14 px-4">
        <button onClick={() => navigate(-1)}>
          <ChevronLeft className="w-6 h-6" />
        </button>
        <h1 className="text-lg font-semibold capitalize">{title}</h1>
        <button onClick={() => navigate("/faculty/settings")}>
          <Settings className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};

// ================= BOTTOM NAV =================
const BottomNav: React.FC = () => {
  const location = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t shadow">
      <div className="flex justify-around h-14">
        {mobileNavConfig.map((item) => {
          const active = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={`flex flex-col items-center justify-center text-xs ${
                active ? "text-indigo-600" : "text-gray-500"
              }`}
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

// ================= MAIN =================
const MobileLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation();

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-50"
      } lg:hidden`}
    >
      <MobileHeader />

      <main className="pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </main>

      <BottomNav />
    </div>
  );
};

export default MobileLayout;

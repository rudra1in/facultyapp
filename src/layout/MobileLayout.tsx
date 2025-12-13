// src/components/MobileLayout.tsx
import React from "react";
import { Outlet, useLocation, useNavigate, NavLink } from "react-router-dom";

import {
  Home,
  Users,
  MessageSquare,
  Settings,
  Bell,
  ChevronLeft,
  BookOpen,
  User,
} from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../components/ui/ThemeContext";

// --- Mobile Navigation Configuration ---
const mobileNavConfig = [
  { name: "Home", path: "/dashboard/home", icon: Home },
  { name: "Courses", path: "/dashboard/categories", icon: BookOpen },
  { name: "Messages", path: "/dashboard/messages", icon: MessageSquare },
  { name: "Notifications", path: "/dashboard/notifications", icon: Bell },
  { name: "Profile", path: "/dashboard/profile", icon: User },
];

// --- Sub-Component: Dynamic Header ---
const MobileHeader: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const pathSegments = location.pathname.split("/").filter(Boolean);
  const currentPage = pathSegments.length > 1 ? pathSegments.pop() : "Home";

  const formattedTitle =
    currentPage.charAt(0).toUpperCase() + currentPage.slice(1);

  return (
    <header className="sticky top-0 z-20 w-full bg-white dark:bg-gray-800 shadow-md">
      <div className="flex items-center justify-between h-16 px-4">
        {/* Back Button */}
        {pathSegments.length > 1 ? (
          <motion.button
            onClick={() => navigate(-1)}
            className="text-gray-600 dark:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
            whileTap={{ scale: 0.9 }}
          >
            <ChevronLeft className="w-6 h-6" />
          </motion.button>
        ) : (
          <div className="text-xl font-bold text-indigo-600 dark:text-indigo-400">
            FacultyApp
          </div>
        )}

        {/* Page Title */}
        <h1 className="absolute left-1/2 transform -translate-x-1/2 text-lg font-semibold text-gray-900 dark:text-white truncate max-w-[50%]">
          {formattedTitle}
        </h1>

        {/* Settings Button */}
        <motion.button
          onClick={() => navigate("/dashboard/settings")}
          className="text-gray-600 dark:text-gray-300 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
          whileTap={{ scale: 0.9 }}
        >
          <Settings className="w-6 h-6" />
        </motion.button>
      </div>
    </header>
  );
};

// --- Bottom Navigation Bar ---
const BottomNavBar: React.FC = () => {
  const location = useLocation();

  return (
    <motion.nav
      className="fixed bottom-0 left-0 right-0 z-40 bg-white dark:bg-gray-800 shadow-[0_-5px_20px_rgba(0,0,0,0.1)] border-t dark:border-gray-700"
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 100, delay: 0.3 }}
    >
      <div className="flex justify-around items-center h-16">
        {mobileNavConfig.map((item) => {
          const isActive = location.pathname.startsWith(item.path);
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className="flex flex-col items-center justify-center p-1 relative group"
            >
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute top-0 w-8 h-1 bg-indigo-600 rounded-b-lg"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <item.icon
                className={`w-6 h-6 transition-colors mt-2 ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
                }`}
              />
              <span
                className={`text-xs font-medium transition-colors ${
                  isActive
                    ? "text-indigo-600"
                    : "text-gray-500 dark:text-gray-400 group-hover:text-indigo-500"
                }`}
              >
                {item.name}
              </span>
            </NavLink>
          );
        })}
      </div>
    </motion.nav>
  );
};

// --- Main Mobile Layout Component ---
const MobileLayout: React.FC = () => {
  const { isDarkMode } = useTheme();
  const location = useLocation(); // needed for animation key

  return (
    <div
      className={`min-h-screen ${
        isDarkMode ? "bg-gray-900" : "bg-gray-50"
      } flex flex-col lg:hidden`}
    >
      {/* Header */}
      <MobileHeader />

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-20">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNavBar />
    </div>
  );
};

export default MobileLayout;

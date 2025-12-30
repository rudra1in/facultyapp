import React, { useState } from "react";
import {
  Palette,
  Lock,
  Briefcase,
  Database,
  ChevronRight,
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
  AlertTriangle,
  Download,
  FileText,
  Table,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT_USER_ROLE = "admin";

// Sidebar Navigation Items
const navItems = [
  { id: "appearance", label: "Appearance", icon: Palette, role: "standard" },
  {
    id: "security",
    label: "Security & Activity",
    icon: Lock,
    role: "standard",
  },
  {
    id: "system_config",
    label: "System Configuration",
    icon: Briefcase,
    role: "admin",
  },
  {
    id: "data_maintenance",
    label: "Data & Maintenance",
    icon: Database,
    role: "admin",
  },
];

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(
    CURRENT_USER_ROLE === "admin" ? "system_config" : "appearance"
  );
  const [fontSize, setFontSize] = useState("medium");
  const isAdmin = CURRENT_USER_ROLE === "admin";

  const showSuccess = (message: string) => alert(`✅ Success: ${message}`);

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  // Reusable row for settings
  const SettingRow = ({
    title,
    description,
    children,
  }: {
    title: string;
    description: any;
    children: React.ReactNode;
  }) => (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-gray-100 dark:border-gray-800 last:border-b-0 gap-4">
      <div className="flex flex-col">
        <span className="font-bold text-gray-900 dark:text-white">{title}</span>
        <div className="text-sm text-gray-500 dark:text-gray-400 max-w-md">
          {description}
        </div>
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );

  const AppearanceSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <header className="mb-8">
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Appearance
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Customize your viewing experience across the platform.
        </p>
      </header>

      <SettingRow
        title="System Font Size"
        description="Adjust text size to improve readability. This applies to all dashboard labels and descriptions."
      >
        <div className="flex bg-gray-100 dark:bg-gray-900 p-1 rounded-xl">
          {["small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                fontSize === size
                  ? "bg-white dark:bg-gray-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                  : "text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
              }`}
            >
              {size === "small" ? "A-" : size === "medium" ? "A" : "A+"}
            </button>
          ))}
        </div>
      </SettingRow>
    </motion.div>
  );

  const SecuritySection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Security & Activity
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account security and monitor login attempts.
        </p>
      </header>

      <SettingRow
        title="Active Sessions"
        description="You are currently logged in on multiple devices. Review or end these sessions to secure your account."
      >
        <button className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-xl hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors flex items-center">
          Log Out All Devices <LogOut className="inline h-4 w-4 ml-2" />
        </button>
      </SettingRow>

      <div className="bg-gray-50 dark:bg-gray-900/50 rounded-2xl p-6 border border-gray-100 dark:border-gray-800">
        <h3 className="font-bold text-gray-900 dark:text-white mb-4">
          Login History
        </h3>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="bg-green-100 dark:bg-green-900/30 p-2 rounded-full mr-3">
              <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Chrome on MacOS (Successful)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Today, 10:45 AM • IP: 192.168.1.1
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="bg-red-100 dark:bg-red-900/30 p-2 rounded-full mr-3">
              <XCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="font-semibold text-gray-800 dark:text-gray-200">
                Safari on iPhone (Failed Login)
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500">
                Yesterday, 9:20 PM • Unknown Location
              </p>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SystemConfigSection = () => {
    const [academicYear, setAcademicYear] = useState("2025-2026");
    return (
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        className="space-y-6"
      >
        <header>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            System Configuration
          </h2>
          <p className="text-gray-500 dark:text-gray-400">
            Global settings for the academic platform management.
          </p>
        </header>

        <SettingRow
          title="Academic Term Setup"
          description="Update the active academic year for all session scheduling and automated reporting."
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
              <input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="pl-9 pr-4 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-xl outline-none focus:ring-2 focus:ring-indigo-500 dark:text-white transition-all"
              />
            </div>
            <button
              onClick={() => showSuccess("Academic year updated")}
              className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-100 dark:shadow-none"
            >
              Update
            </button>
          </div>
        </SettingRow>
      </motion.div>
    );
  };

  const DataMaintenanceSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-8"
    >
      <header>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white">
          Data & Maintenance
        </h2>
        <p className="text-gray-500 dark:text-gray-400">
          Securely export your data or perform system cleanup.
        </p>
      </header>

      <SettingRow
        title="Full Database Backup"
        description="Generate an encrypted export of all faculty records and session history."
      >
        <div className="flex gap-2 flex-wrap">
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl flex items-center text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <FileText className="h-4 w-4 mr-2 text-red-500" /> PDF
          </button>
          <button className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 px-3 py-2 rounded-xl flex items-center text-sm font-bold hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
            <Table className="h-4 w-4 mr-2 text-green-500" /> Excel
          </button>
          <button className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-xl flex items-center text-sm font-bold shadow-lg shadow-indigo-100 dark:shadow-none">
            <Download className="h-4 w-4 mr-2" /> JSON FULL
          </button>
        </div>
      </SettingRow>

      <div className="p-6 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 rounded-2xl">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-4 mt-1 shrink-0" />
          <div>
            <h4 className="font-black text-red-800 dark:text-red-400 uppercase tracking-tight">
              Danger Zone
            </h4>
            <p className="text-sm text-red-700 dark:text-red-400/80 mb-4">
              Clearing local cache and system data will reset all your interface
              preferences. This action is irreversible.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-200 dark:shadow-none">
              Reset System Cache
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearanceSection />;
      case "security":
        return <SecuritySection />;
      case "system_config":
        return <SystemConfigSection />;
      case "data_maintenance":
        return <DataMaintenanceSection />;
      default:
        return <AppearanceSection />;
    }
  };

  return (
    <div
      className={`min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 md:p-10 transition-colors duration-300 ${fontSizeClass[fontSize]}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden border border-gray-100 dark:border-gray-700">
        {/* Sidebar Nav */}
        <nav
          className={`w-full md:w-72 p-6 flex flex-col gap-1 border-r border-gray-100 dark:border-gray-700 ${
            isAdmin
              ? "bg-gray-50/50 dark:bg-gray-900/30"
              : "bg-white dark:bg-gray-800"
          }`}
        >
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 dark:text-gray-500 mb-6">
            Settings Menu
          </h3>
          {navItems
            .filter((i) => i.role === "standard" || isAdmin)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3.5 rounded-2xl transition-all duration-200 ${
                  activeSection === item.id
                    ? "bg-indigo-600 text-white shadow-xl shadow-indigo-100 dark:shadow-none translate-x-1"
                    : "text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50"
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                <span className="font-bold text-sm">{item.label}</span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-transform ${
                    activeSection === item.id ? "opacity-100" : "opacity-0"
                  }`}
                />
              </button>
            ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-12 bg-white dark:bg-gray-800">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

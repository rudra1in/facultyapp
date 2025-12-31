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
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-6 border-b border-[var(--border-main)] last:border-b-0 gap-4 transition-colors">
      <div className="flex flex-col">
        <span className="font-bold text-[var(--text-main)]">{title}</span>
        <div className="text-sm text-[var(--text-muted)] max-w-md">
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
        <h2 className="text-2xl font-black text-[var(--text-main)] transition-colors">
          Appearance
        </h2>
        <p className="text-[var(--text-muted)] transition-colors">
          Customize your viewing experience across the platform.
        </p>
      </header>

      <SettingRow
        title="System Font Size"
        description="Adjust text size to improve readability. This applies to all dashboard labels and descriptions."
      >
        <div className="flex bg-[var(--bg-main)] p-1 rounded-xl border border-[var(--border-main)] transition-colors">
          {["small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all ${
                fontSize === size
                  ? "bg-[var(--bg-card)] text-[var(--accent)] shadow-sm"
                  : "text-[var(--text-muted)] hover:text-[var(--text-main)] opacity-60 hover:opacity-100"
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
        <h2 className="text-2xl font-black text-[var(--text-main)]">
          Security & Activity
        </h2>
        <p className="text-[var(--text-muted)]">
          Manage your account security and monitor login attempts.
        </p>
      </header>

      <SettingRow
        title="Active Sessions"
        description="You are currently logged in on multiple devices. Review or end these sessions to secure your account."
      >
        <button className="text-sm font-bold text-red-600 dark:text-red-400 bg-red-500/10 px-4 py-2 rounded-xl hover:bg-red-500/20 transition-colors flex items-center">
          Log Out All Devices <LogOut className="inline h-4 w-4 ml-2" />
        </button>
      </SettingRow>

      <div className="bg-[var(--bg-main)] rounded-2xl p-6 border border-[var(--border-main)] transition-colors">
        <h3 className="font-bold text-[var(--text-main)] mb-4">
          Login History
        </h3>
        <div className="space-y-4">
          <div className="flex items-center text-sm">
            <div className="bg-green-500/10 p-2 rounded-full mr-3">
              <CheckCircle className="h-4 w-4 text-green-600" />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-main)]">
                Chrome on MacOS (Successful)
              </p>
              <p className="text-xs text-[var(--text-muted)]">
                Today, 10:45 AM • IP: 192.168.1.1
              </p>
            </div>
          </div>
          <div className="flex items-center text-sm">
            <div className="bg-red-500/10 p-2 rounded-full mr-3">
              <XCircle className="h-4 w-4 text-red-600" />
            </div>
            <div>
              <p className="font-semibold text-[var(--text-main)]">
                Safari on iPhone (Failed Login)
              </p>
              <p className="text-xs text-[var(--text-muted)]">
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
          <h2 className="text-2xl font-black text-[var(--text-main)]">
            System Configuration
          </h2>
          <p className="text-[var(--text-muted)]">
            Global settings for the academic platform management.
          </p>
        </header>

        <SettingRow
          title="Academic Term Setup"
          description="Update the active academic year for all session scheduling and automated reporting."
        >
          <div className="flex items-center gap-2">
            <div className="relative">
              <Calendar className="absolute left-3 top-2.5 h-4 w-4 text-[var(--text-muted)]" />
              <input
                value={academicYear}
                onChange={(e) => setAcademicYear(e.target.value)}
                className="pl-9 pr-4 py-2 bg-[var(--bg-main)] border border-[var(--border-main)] rounded-xl outline-none focus:ring-2 focus:ring-[var(--accent)] text-[var(--text-main)] transition-all"
              />
            </div>
            <button
              onClick={() => showSuccess("Academic year updated")}
              className="px-4 py-2 bg-[var(--accent)] hover:opacity-90 text-white font-bold rounded-xl text-sm shadow-lg shadow-indigo-500/20"
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
        <h2 className="text-2xl font-black text-[var(--text-main)]">
          Data & Maintenance
        </h2>
        <p className="text-[var(--text-muted)]">
          Securely export your data or perform system cleanup.
        </p>
      </header>

      <SettingRow
        title="Full Database Backup"
        description="Generate an encrypted export of all faculty records and session history."
      >
        <div className="flex gap-2 flex-wrap">
          <button className="bg-[var(--bg-card)] border border-[var(--border-main)] px-3 py-2 rounded-xl flex items-center text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-all">
            <FileText className="h-4 w-4 mr-2 text-red-500" /> PDF
          </button>
          <button className="bg-[var(--bg-card)] border border-[var(--border-main)] px-3 py-2 rounded-xl flex items-center text-sm font-bold text-[var(--text-main)] hover:bg-[var(--bg-main)] transition-all">
            <Table className="h-4 w-4 mr-2 text-green-500" /> Excel
          </button>
          <button className="bg-[var(--accent)] hover:opacity-90 text-white px-4 py-2 rounded-xl flex items-center text-sm font-bold shadow-lg shadow-indigo-500/20">
            <Download className="h-4 w-4 mr-2" /> JSON FULL
          </button>
        </div>
      </SettingRow>

      <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-2xl transition-colors">
        <div className="flex items-start">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-4 mt-1 shrink-0" />
          <div>
            <h4 className="font-black text-red-700 dark:text-red-400 uppercase tracking-tight">
              Danger Zone
            </h4>
            <p className="text-sm text-red-600/70 mb-4 font-medium leading-relaxed">
              Clearing local cache and system data will reset all your interface
              preferences. This action is irreversible.
            </p>
            <button className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-red-500/20">
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
      className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-10 transition-colors duration-300 ${fontSizeClass[fontSize]}`}
    >
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row bg-[var(--bg-card)] rounded-[2.5rem] shadow-2xl overflow-hidden border border-[var(--border-main)] transition-all duration-300">
        {/* Sidebar Nav */}
        <nav
          className={`w-full md:w-72 p-6 flex flex-col gap-1 border-r border-[var(--border-main)] transition-colors duration-300 ${
            isAdmin ? "bg-[var(--bg-main)]/30" : "bg-[var(--bg-card)]"
          }`}
        >
          <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.2em] text-[var(--text-muted)] opacity-60 mb-6">
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
                    ? "bg-[var(--accent)] text-white shadow-xl shadow-indigo-500/20 translate-x-1"
                    : "text-[var(--text-muted)] hover:bg-[var(--bg-main)] hover:text-[var(--text-main)]"
                }`}
              >
                <item.icon
                  className={`h-5 w-5 mr-3 ${
                    activeSection === item.id
                      ? "text-white"
                      : "text-[var(--accent)] opacity-70"
                  }`}
                />
                <span className="font-bold text-sm tracking-tight">
                  {item.label}
                </span>
                <ChevronRight
                  className={`ml-auto h-4 w-4 transition-transform ${
                    activeSection === item.id
                      ? "opacity-100 translate-x-1"
                      : "opacity-0"
                  }`}
                />
              </button>
            ))}
        </nav>

        {/* Content Area */}
        <main className="flex-1 p-6 md:p-12 bg-[var(--bg-card)] transition-colors duration-300">
          <AnimatePresence mode="wait">{renderContent()}</AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

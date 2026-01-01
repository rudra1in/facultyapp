import React, { useState, useEffect } from "react";
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
  Sparkles,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const CURRENT_USER_ROLE = "admin";

const navItems = [
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
    role: "standard",
    color: "text-pink-500",
  },
  {
    id: "security",
    label: "Security & Activity",
    icon: Lock,
    role: "standard",
    color: "text-blue-500",
  },
  {
    id: "system_config",
    label: "Configuration",
    icon: Briefcase,
    role: "admin",
    color: "text-orange-500",
  },
  {
    id: "data_maintenance",
    label: "Maintenance",
    icon: Database,
    role: "admin",
    color: "text-emerald-500",
  },
];

/* ---------------- SPARKLE COMPONENT ---------------- */
const SettingSparkle = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: [0, 1.2, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
    className="absolute -top-1 -right-1 text-yellow-400 pointer-events-none"
  >
    <Sparkles size={14} fill="currentColor" />
  </motion.div>
);

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(
    CURRENT_USER_ROLE === "admin" ? "system_config" : "appearance"
  );
  const [fontSize, setFontSize] = useState("medium");
  const isAdmin = CURRENT_USER_ROLE === "admin";

  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const SettingRow = ({ title, description, icon: Icon, children }: any) => (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-col sm:flex-row justify-between items-start sm:items-center py-8 border-b border-[var(--border-main)] last:border-b-0 gap-6 group"
    >
      <div className="flex gap-4">
        <div className="mt-1 p-2 rounded-lg bg-[var(--bg-main)] text-[var(--accent)] group-hover:scale-110 transition-transform">
          {Icon && <Icon size={20} />}
        </div>
        <div className="flex flex-col">
          <span className="font-black text-[var(--text-main)] tracking-tight uppercase text-xs mb-1">
            {title}
          </span>
          <div className="text-sm text-[var(--text-muted)] max-w-md font-medium leading-relaxed">
            {description}
          </div>
        </div>
      </div>
      <div className="shrink-0 w-full sm:w-auto">{children}</div>
    </motion.div>
  );

  const AppearanceSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <header className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="text-pink-500" size={24} />
          <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase">
            Appearance
          </h2>
        </div>
        <p className="text-[var(--text-muted)] font-medium">
          Global interface personalization and accessibility nodes.
        </p>
      </header>

      <SettingRow
        title="Typography Scale"
        icon={FileText}
        description="Optimize readability by scaling the system-wide font size. This will recalibrate all dashboard labels."
      >
        <div className="flex bg-[var(--bg-main)] p-1.5 rounded-2xl border border-[var(--border-main)] shadow-inner">
          {["small", "medium", "large"].map((size) => (
            <button
              key={size}
              onClick={() => setFontSize(size)}
              className={`relative px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                fontSize === size
                  ? "bg-[var(--bg-card)] text-[var(--accent)] shadow-lg"
                  : "text-[var(--text-muted)] opacity-50"
              }`}
            >
              {fontSize === size && <SettingSparkle />}
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
      className="space-y-10"
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <ShieldCheck className="text-blue-500" size={24} />
          <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase">
            Security Protocol
          </h2>
        </div>
        <p className="text-[var(--text-muted)] font-medium">
          Manage access keys and monitor real-time auth traffic.
        </p>
      </header>

      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-[var(--bg-main)] rounded-[2rem] p-8 border border-[var(--border-main)] relative overflow-hidden">
          <Zap
            className="absolute -bottom-4 -right-4 text-[var(--accent)] opacity-5"
            size={120}
          />
          <h3 className="font-black text-[var(--text-main)] mb-6 text-xs uppercase tracking-[0.2em]">
            Live Session Uplink
          </h3>
          <p className="text-sm text-[var(--text-muted)] mb-8 font-medium">
            Currently broadcasting from 2 encrypted nodes.
          </p>
          <button className="w-full py-4 rounded-2xl bg-red-500/10 text-red-500 font-black text-[10px] uppercase tracking-widest border border-red-500/20 hover:bg-red-500 hover:text-white transition-all">
            Terminate All Connections
          </button>
        </div>

        <div className="bg-[var(--bg-main)] rounded-[2rem] p-8 border border-[var(--border-main)]">
          <h3 className="font-black text-[var(--text-main)] mb-6 text-xs uppercase tracking-[0.2em]">
            Auth History
          </h3>
          <div className="space-y-4">
            {[
              {
                icon: CheckCircle,
                text: "MacOS Node 1",
                color: "text-green-500",
                status: "Success",
              },
              {
                icon: XCircle,
                text: "Unknown Uplink",
                color: "text-red-500",
                status: "Blocked",
              },
            ].map((log, i) => (
              <div
                key={i}
                className="flex items-center gap-4 bg-[var(--bg-card)] p-3 rounded-xl border border-[var(--border-main)]"
              >
                <log.icon className={log.color} size={16} />
                <div className="flex flex-col">
                  <span className="text-xs font-bold text-[var(--text-main)]">
                    {log.text}
                  </span>
                  <span className="text-[9px] font-black text-[var(--text-muted)] uppercase tracking-tighter">
                    {log.status} Today
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const SystemConfigSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-6"
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <Briefcase className="text-orange-500" size={24} />
          <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase">
            Configuration
          </h2>
        </div>
        <p className="text-[var(--text-muted)] font-medium">
          Global core settings for institutional management.
        </p>
      </header>

      <SettingRow
        title="Active Academic Node"
        icon={Calendar}
        description="Update the current cycle for automated session synchronization and reporting."
      >
        <div className="flex items-center gap-3">
          <input
            defaultValue="2025-2026"
            className="px-6 py-3 bg-[var(--bg-main)] border-2 border-[var(--border-main)] rounded-2xl font-black text-xs outline-none focus:border-[var(--accent)] transition-all text-[var(--text-main)] w-full"
          />
          <button className="px-6 py-3 bg-[var(--accent)] text-white font-black rounded-2xl text-[10px] uppercase tracking-widest shadow-xl shadow-indigo-500/20 active:scale-95 transition-all">
            Update
          </button>
        </div>
      </SettingRow>
    </motion.div>
  );

  const DataMaintenanceSection = () => (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      className="space-y-10"
    >
      <header>
        <div className="flex items-center gap-3 mb-2">
          <Database className="text-emerald-500" size={24} />
          <h2 className="text-3xl font-black text-[var(--text-main)] tracking-tighter uppercase">
            Maintenance
          </h2>
        </div>
        <p className="text-[var(--text-muted)] font-medium">
          Secure data export and core system purge protocols.
        </p>
      </header>

      <SettingRow
        title="Encrypted Database Export"
        icon={Download}
        description="Generate a secure JSON/PDF payload of all faculty metadata and transaction history."
      >
        <div className="flex gap-2 flex-wrap">
          <button className="bg-[var(--bg-main)] border border-[var(--border-main)] px-4 py-3 rounded-xl flex items-center text-[10px] font-black uppercase text-[var(--text-main)] hover:bg-[var(--accent)] hover:text-white transition-all">
            <FileText className="mr-2" size={14} /> PDF
          </button>
          <button className="bg-[var(--accent)] text-white px-5 py-3 rounded-xl flex items-center text-[10px] font-black uppercase shadow-lg shadow-indigo-500/20 transition-all active:scale-95">
            <Download className="mr-2" size={14} /> Full JSON
          </button>
        </div>
      </SettingRow>

      <div className="p-8 bg-red-500/5 border-2 border-red-500/10 rounded-[2.5rem] relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:scale-110 transition-transform">
          <AlertTriangle className="text-red-500" size={120} />
        </div>
        <div className="flex items-start gap-6 relative z-10">
          <div className="p-4 bg-red-500 text-white rounded-2xl shadow-xl shadow-red-500/30">
            <AlertTriangle size={24} />
          </div>
          <div>
            <h4 className="text-sm font-black text-red-600 uppercase tracking-widest mb-2">
              Danger Protocol
            </h4>
            <p className="text-sm text-[var(--text-muted)] mb-6 font-medium max-w-lg leading-relaxed">
              Initiating a system cache reset will purge all local interface
              preferences and encrypted temporary nodes.
            </p>
            <button className="bg-red-600 text-white px-8 py-3.5 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 active:scale-95">
              Purge System Cache
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div
      className={`min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] p-4 md:p-10 transition-all duration-300 ${fontSizeClass[fontSize]}`}
    >
      <div className="max-w-7xl mx-auto flex flex-col lg:flex-row bg-[var(--bg-card)] rounded-[3.5rem] shadow-[0_50px_100px_-20px_rgba(0,0,0,0.3)] overflow-hidden border border-[var(--border-main)] min-h-[800px]">
        {/* SIDEBAR NAVIGATION */}
        <nav className="w-full lg:w-80 p-8 border-r border-[var(--border-main)] bg-[var(--bg-main)]/20">
          <div className="mb-12">
            <h3 className="px-4 text-[10px] font-black uppercase tracking-[0.3em] text-[var(--text-muted)] opacity-50 mb-8">
              System Settings
            </h3>
            <div className="space-y-2">
              {navItems
                .filter((i) => i.role === "standard" || isAdmin)
                .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveSection(item.id)}
                    className={`w-full flex items-center px-5 py-4 rounded-[1.5rem] transition-all duration-300 relative group overflow-hidden ${
                      activeSection === item.id
                        ? "bg-[var(--accent)] text-white shadow-2xl shadow-indigo-500/30 translate-x-2"
                        : "text-[var(--text-muted)] hover:bg-[var(--bg-card)] hover:text-[var(--text-main)]"
                    }`}
                  >
                    {activeSection === item.id && <SettingSparkle />}
                    <item.icon
                      className={`mr-4 transition-transform group-hover:scale-110 ${
                        activeSection === item.id ? "text-white" : item.color
                      }`}
                      size={18}
                    />
                    <span className="font-black text-xs uppercase tracking-widest">
                      {item.label}
                    </span>
                    <ChevronRight
                      className={`ml-auto transition-all ${
                        activeSection === item.id
                          ? "opacity-100 translate-x-0"
                          : "opacity-0 -translate-x-4"
                      }`}
                      size={14}
                    />
                  </button>
                ))}
            </div>
          </div>

          <div className="mt-auto pt-10 px-4 border-t border-[var(--border-main)]/50">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest opacity-40">
                System Nodes Active
              </span>
            </div>
          </div>
        </nav>

        {/* MAIN CONTENT AREA */}
        <main className="flex-1 p-8 md:p-16 relative overflow-hidden bg-[var(--bg-card)]">
          {/* Subtle Background Glow */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--accent)] opacity-[0.03] rounded-full blur-[120px] pointer-events-none" />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {activeSection === "appearance" && <AppearanceSection />}
              {activeSection === "security" && <SecuritySection />}
              {activeSection === "system_config" && <SystemConfigSection />}
              {activeSection === "data_maintenance" && (
                <DataMaintenanceSection />
              )}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;

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
  File,
  Table,
} from "lucide-react";

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
  const [darkMode, setDarkMode] = useState(false);
  const isAdmin = CURRENT_USER_ROLE === "admin";

  const showSuccess = (message) => alert(`✅ Success: ${message}`);

  // ✅ Font size mapping (TASK 2)
  const fontSizeClass = {
    small: "text-sm",
    medium: "text-base",
    large: "text-lg",
  };

  const SettingRow = ({ title, description, children }) => (
    <div
      className={`flex justify-between items-center py-4 border-b last:border-b-0 ${
        darkMode ? "border-gray-700" : ""
      }`}
    >
      <div className="flex flex-col">
        <span
          className={`font-semibold ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          {title}
        </span>
        <span
          className={`text-sm max-w-lg ${
            darkMode ? "text-gray-400" : "text-gray-500"
          }`}
        >
          {description}
        </span>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const AppearanceSection = () => (
    <div className="space-y-6">
      <h2
        className={`text-2xl font-bold border-b pb-2 ${
          darkMode ? "text-gray-100 border-gray-700" : "text-gray-800"
        }`}
      >
        Application Preferences
      </h2>

      <SettingRow
        title="Dark Mode"
        description="Switch between light and dark theme for comfortable viewing."
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full ${
            darkMode ? "bg-indigo-600" : "bg-gray-300"
          }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
              darkMode ? "translate-x-7" : "translate-x-1"
            }`}
          />
        </button>
      </SettingRow>

      <SettingRow
        title="Font Size"
        description="Adjust text size for better readability."
      >
        <div className="flex space-x-2">
          <button
            onClick={() => setFontSize("small")}
            className={`px-3 py-1 rounded-md ${
              fontSize === "small"
                ? "bg-indigo-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200"
            }`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("medium")}
            className={`px-3 py-1 rounded-md ${
              fontSize === "medium"
                ? "bg-indigo-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200"
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-3 py-1 rounded-md ${
              fontSize === "large"
                ? "bg-indigo-500 text-white"
                : darkMode
                ? "bg-gray-700 text-gray-300"
                : "bg-gray-200"
            }`}
          >
            A+
          </button>
        </div>
      </SettingRow>
    </div>
  );

  const SecuritySection = () => (
    <div className="space-y-6">
      <h2
        className={`text-2xl font-bold border-b pb-2 ${
          darkMode ? "text-gray-100 border-gray-700" : "text-gray-800"
        }`}
      >
        Security & Activity
      </h2>

      <SettingRow
        title="Active Sessions"
        description="See where you are currently logged in."
      >
        <button className="text-indigo-600 font-medium">
          Review & Log Out All <LogOut className="inline h-4 w-4 ml-1" />
        </button>
      </SettingRow>

      <div className="pt-6">
        <h3
          className={`font-semibold ${
            darkMode ? "text-gray-200" : "text-gray-800"
          }`}
        >
          Recent Login History
        </h3>
        <p>
          <CheckCircle className="inline h-4 w-4 text-green-500 mr-2" />
          Today, 10:45 AM (Chrome)
        </p>
        <p>
          <XCircle className="inline h-4 w-4 text-red-500 mr-2" />
          Yesterday, Failed Login
        </p>
      </div>
    </div>
  );

  const SystemConfigSection = () => {
    const [academicYear, setAcademicYear] = useState("2025-2026");

    return (
      <div className="space-y-6">
        <h2
          className={`text-2xl font-bold border-b pb-2 ${
            darkMode ? "text-gray-100 border-gray-700" : "text-gray-800"
          }`}
        >
          System Configuration
        </h2>

        <SettingRow
          title="Academic Term Setup"
          description="Set academic year."
        >
          <div className="flex items-center space-x-2">
            <Calendar className="h-4 w-4" />
            <input
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={`p-1 border rounded ${
                darkMode ? "bg-gray-700 text-white" : ""
              }`}
            />
            <button
              onClick={() => showSuccess("Academic year updated")}
              className="text-indigo-600"
            >
              Update
            </button>
          </div>
        </SettingRow>
      </div>
    );
  };

  const DataMaintenanceSection = () => (
    <div className="space-y-6">
      <h2
        className={`text-2xl font-bold border-b pb-2 ${
          darkMode ? "text-gray-100 border-gray-700" : "text-gray-800"
        }`}
      >
        Data & Maintenance
      </h2>

      <SettingRow title="Data Backup" description="Export application data.">
        <div className="flex gap-2 flex-wrap">
          <button className="bg-red-600 text-white px-3 py-2 rounded flex items-center">
            <FileText className="h-4 w-4 mr-2" /> PDF
          </button>
          <button className="bg-blue-600 text-white px-3 py-2 rounded flex items-center">
            <File className="h-4 w-4 mr-2" /> Word
          </button>
          <button className="bg-green-600 text-white px-3 py-2 rounded flex items-center">
            <Table className="h-4 w-4 mr-2" /> Excel
          </button>
          <button className="bg-purple-600 text-white px-3 py-2 rounded flex items-center">
            <Download className="h-4 w-4 mr-2" /> JSON
          </button>
        </div>
      </SettingRow>

      <SettingRow
        title="Clear Local Data"
        description={
          <span className="text-red-500 font-bold">DANGER ZONE</span>
        }
      >
        <button className="bg-red-700 text-white px-4 py-2 rounded flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" /> Clear All Data
        </button>
      </SettingRow>
    </div>
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
      className={`min-h-screen p-6 font-sans ${fontSizeClass[fontSize]} ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-black"
      }`}
    >
      <div className="max-w-6xl mx-auto flex rounded-xl shadow-xl overflow-hidden">
        <nav className={`w-64 p-6 ${darkMode ? "bg-gray-800" : "bg-gray-100"}`}>
          {navItems
            .filter((i) => i.role === "standard" || isAdmin)
            .map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveSection(item.id)}
                className={`w-full flex items-center px-4 py-3 rounded-lg mb-1 ${
                  activeSection === item.id ? "bg-indigo-600 text-white" : ""
                }`}
              >
                <item.icon className="h-5 w-5 mr-3" />
                {item.label}
                <ChevronRight className="ml-auto h-4 w-4" />
              </button>
            ))}
        </nav>

        <main className="flex-1 p-8">{renderContent()}</main>
      </div>
    </div>
  );
};

export default SettingsPage;

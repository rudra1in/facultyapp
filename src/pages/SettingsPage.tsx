import React, { useState } from "react";
import {
  Settings,
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
  { id: "security", label: "Security & Activity", icon: Lock, role: "standard" },
  { id: "system_config", label: "System Configuration", icon: Briefcase, role: "admin" },
  { id: "data_maintenance", label: "Data & Maintenance", icon: Database, role: "admin" },
];

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState(
    CURRENT_USER_ROLE === "admin" ? "system_config" : "appearance"
  );
  const [fontSize, setFontSize] = useState("medium");
  const [darkMode, setDarkMode] = useState(false);
  const isAdmin = CURRENT_USER_ROLE === "admin";

  const showSuccess = (message) => alert(`✅ Success: ${message}`);

  const SettingRow = ({ title, description, children }) => (
    <div className={`flex justify-between items-center py-4 border-b last:border-b-0 ${darkMode ? 'border-gray-700' : ''}`}>
      <div className="flex flex-col">
        <span className={`font-semibold ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>{title}</span>
        <span className={`text-sm max-w-lg ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{description}</span>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );

  const AppearanceSection = ({ fontSize, setFontSize, darkMode, setDarkMode }) => (
    <div className="space-y-6">
      <h2 className={`text-2xl font-bold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800'}`}>
        Application Preferences
      </h2>

      <SettingRow
        title="Dark Mode"
        description="Switch between light and dark theme for comfortable viewing."
      >
        <button
          onClick={() => setDarkMode(!darkMode)}
          className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors ${darkMode ? "bg-indigo-600" : "bg-gray-300"
            }`}
        >
          <span
            className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${darkMode ? "translate-x-7" : "translate-x-1"
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
            className={`px-3 py-1 rounded-md text-sm transition-colors ${fontSize === "small"
                ? "bg-indigo-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("medium")}
            className={`px-3 py-1 rounded-md text-base transition-colors ${fontSize === "medium"
                ? "bg-indigo-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-3 py-1 rounded-md text-lg transition-colors ${fontSize === "large"
                ? "bg-indigo-500 text-white"
                : darkMode
                  ? "bg-gray-700 text-gray-300"
                  : "bg-gray-200 text-gray-700"
              }`}
          >
            A+
          </button>
        </div>
      </SettingRow>

      <SettingRow
        title="Default View on Login"
        description="Select the landing page after successful sign-in."
      >
        <select className={`p-2 border rounded-md ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}>
          <option>My Dashboard</option>
          <option>Course List</option>
          <option>Today's Schedule</option>
        </select>
      </SettingRow>
    </div>
  );

  const SecuritySection = () => {
    return (
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800'}`}>
          Security & Activity
        </h2>

        <SettingRow
          title="Active Sessions"
          description="See where you are currently logged in."
        >
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            Review & Log Out All <LogOut className="inline h-4 w-4 ml-1" />
          </button>
        </SettingRow>

        <div className="pt-6">
          <h3 className={`text-lg font-semibold mb-2 ${darkMode ? 'text-gray-200' : 'text-gray-800'}`}>
            Recent Login History
          </h3>
          <div className={`text-sm space-y-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            <p className="flex justify-between">
              <span>
                <CheckCircle className="inline h-4 w-4 mr-2 text-green-500" />
                Today, 10:45 AM (Chrome, Campus LAN)
              </span>
              <span>Successful</span>
            </p>
            <p className="flex justify-between">
              <span>
                <XCircle className="inline h-4 w-4 mr-2 text-red-500" />
                Yesterday, 7:02 PM (Firefox, Home WiFi)
              </span>
              <span>Failed (Bad Password)</span>
            </p>
          </div>
        </div>
      </div>
    );
  };

  const SystemConfigSection = () => {
    const [academicYear, setAcademicYear] = useState("2025-2026");

    return (
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800'}`}>
          System Configuration
        </h2>

        <SettingRow
          title="Academic Term Setup"
          description="Define the current active academic year and semester dates."
        >
          <div className="flex space-x-2 items-center">
            <Calendar className={`h-5 w-5 ${darkMode ? 'text-gray-500' : 'text-gray-400'}`} />
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className={`p-1 border rounded-md w-32 ${darkMode ? 'bg-gray-700 text-gray-200 border-gray-600' : ''}`}
            />
            <button
              onClick={() => showSuccess("Academic year updated")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Update
            </button>
          </div>
        </SettingRow>
      </div>
    );
  };

  const DataMaintenanceSection = () => {
    const handleExport = (format) => {
      showSuccess(`All local data exported as ${format.toUpperCase()}.`);
    };

    const handleClearLocalData = () => {
      if (
        window.confirm(
          "⚠️ WARNING: This will permanently DELETE ALL local data. Continue?"
        )
      ) {
        alert("All local storage data cleared. Please refresh the page.");
      }
    };

    return (
      <div className="space-y-6">
        <h2 className={`text-2xl font-bold border-b pb-2 ${darkMode ? 'text-gray-100 border-gray-700' : 'text-gray-800'}`}>
          Data & Maintenance
        </h2>

        <SettingRow
          title="Data Backup"
          description="Export all application data in your preferred format."
        >
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handleExport("pdf")}
              className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center ${darkMode
                  ? 'bg-red-700 hover:bg-red-800 text-white'
                  : 'bg-red-600 hover:bg-red-700 text-white'
                }`}
            >
              <FileText className="h-4 w-4 mr-2" /> PDF
            </button>
            <button
              onClick={() => handleExport("word")}
              className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center ${darkMode
                  ? 'bg-blue-700 hover:bg-blue-800 text-white'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
            >
              <File className="h-4 w-4 mr-2" /> Word
            </button>
            <button
              onClick={() => handleExport("excel")}
              className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center ${darkMode
                  ? 'bg-green-700 hover:bg-green-800 text-white'
                  : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
            >
              <Table className="h-4 w-4 mr-2" /> Excel
            </button>
            <button
              onClick={() => handleExport("json")}
              className={`px-3 py-2 font-semibold rounded-lg transition-colors flex items-center ${darkMode
                  ? 'bg-purple-700 hover:bg-purple-800 text-white'
                  : 'bg-purple-600 hover:bg-purple-700 text-white'
                }`}
            >
              <Download className="h-4 w-4 mr-2" /> JSON
            </button>
          </div>
        </SettingRow>

        <SettingRow
          title="Clear Local Data"
          description={
            <span className="text-red-500 font-bold">
              DANGER ZONE: Deletes ALL demo data.
            </span>
          }
        >
          <button
            onClick={handleClearLocalData}
            className="px-4 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors flex items-center"
          >
            <AlertTriangle className="h-5 w-5 mr-2" /> Clear All Data
          </button>
        </SettingRow>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeSection) {
      case "appearance":
        return <AppearanceSection fontSize={fontSize} setFontSize={setFontSize} darkMode={darkMode} setDarkMode={setDarkMode} />;
      case "security":
        return <SecuritySection />;
      case "system_config":
        return <SystemConfigSection />;
      case "data_maintenance":
        return <DataMaintenanceSection />;
      default:
        return <AppearanceSection fontSize={fontSize} setFontSize={setFontSize} darkMode={darkMode} setDarkMode={setDarkMode} />;
    }
  };

  return (
    <div className={`min-h-screen p-4 md:p-8 font-sans ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
      <div className="max-w-6xl mx-auto">
        <header className={`mb-8 border-b pb-4 ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
          <h1 className={`text-3xl font-bold flex items-center ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            <Settings className="h-7 w-7 mr-3 text-indigo-600" />
            Portal Settings
          </h1>
          <p className={`mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            Personalize your experience or manage the entire system.
          </p>
        </header>

        <div className={`flex flex-col lg:flex-row rounded-xl shadow-2xl overflow-hidden ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
          <nav className={`w-full lg:w-64 p-6 border-b lg:border-r lg:border-b-0 ${darkMode ? 'bg-gray-900 border-gray-700' : 'bg-gray-50 border-gray-200'}`}>
            <ul className="space-y-1">
              {navItems
                .filter(
                  (item) =>
                    item.role === "standard" || (item.role === "admin" && isAdmin)
                )
                .map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${activeSection === item.id
                          ? "bg-indigo-500 text-white shadow-md"
                          : darkMode
                            ? "text-gray-300 hover:bg-gray-800"
                            : "text-gray-700 hover:bg-gray-200"
                        } ${item.role === "admin" ? `border-t pt-4 mt-2 ${darkMode ? 'border-gray-700' : 'border-gray-200'}` : ""
                        }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.label}
                      {activeSection === item.id && (
                        <ChevronRight className="h-4 w-4 ml-auto" />
                      )}
                    </button>
                  </li>
                ))}
            </ul>
          </nav>

          <main className="flex-1 p-6 md:p-10">{renderContent()}</main>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
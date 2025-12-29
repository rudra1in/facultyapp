import React, { useState, useEffect } from "react";
import {
  Settings,
  User,
  Bell,
  Palette,
  Lock,
  Briefcase,
  Database,
  ChevronRight,
  LogOut,
  CheckCircle,
  XCircle,
  Calendar,
  Mail,
  AlertTriangle,
  Download,
  PlusCircle,
} from "lucide-react";
// --- Mock Data ---
interface UserRecord {
  id: number;
  name: string;
  email: string;
  role: "faculty" | "admin" | "staff";
  status: "active" | "inactive";
}
const mockFaculty: UserRecord = {
  id: 101,
  name: "Dr. Elena Rodriguez",
  email: "e.rodriguez@uni.edu",
  role: "faculty",
  status: "active",
};
const CURRENT_USER_ROLE = "admin";
// Sidebar Navigation Items
const navItems = [
  { id: "profile", label: "Profile & Account", icon: User, role: "standard" },
  { id: "notifications", label: "Notifications", icon: Bell, role: "standard" },
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
const SettingsPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState(
    CURRENT_USER_ROLE === "admin" ? "system_config" : "profile"
  );
  const [fontSize, setFontSize] = useState("medium");
  const isAdmin = CURRENT_USER_ROLE === "admin";
  const showSuccess = (message: string) => alert(`✅ Success: ${message}`);
  const SettingRow: React.FC<{
    title: string;
    description: string | React.ReactNode;
    children: React.ReactNode;
  }> = ({ title, description, children }) => (
    <div className="flex justify-between items-center py-4 border-b last:border-b-0">
      <div className="flex flex-col">
        <span className="font-semibold text-gray-800">{title}</span>
        <span className="text-sm text-gray-500 max-w-lg">{description}</span>
      </div>
      <div className="ml-4">{children}</div>
    </div>
  );
  const ProfileSection: React.FC = () => {
    const [profile, setProfile] = useState({
      name: mockFaculty.name,
      department: "Computer Science",
      bio: "Teaching AI & ML.",
    });
    const handleSave = () => {
      showSuccess("Profile information saved!");
    };
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Profile Information
        </h2>
        <label className="block">
          <span className="text-gray-700 font-medium">Full Name</span>
          <input
            type="text"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">Department</span>
          <input
            type="text"
            value={profile.department}
            onChange={(e) =>
              setProfile({ ...profile, department: e.target.value })
            }
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
          />
        </label>
        <label className="block">
          <span className="text-gray-700 font-medium">
            Bio / Research Focus
          </span>
          <textarea
            value={profile.bio}
            onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
            className="mt-1 block w-full rounded-md border border-gray-300 p-2 shadow-sm"
            rows={3}
          />
        </label>
        <button
          onClick={handleSave}
          className="px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Save Profile Changes
        </button>
      </div>
    );
  };
  const NotificationsSection: React.FC = () => {
    const [settings, setSettings] = useState({
      inAppMessages: true,
      digestFrequency: "daily",
    });
    const toggleSetting = (key: keyof typeof settings) => {
      setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
      showSuccess("Notification setting updated!");
    };
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Notification Preferences
        </h2>
        <SettingRow
          title="In-App: Direct Messages"
          description="Show real-time pop-up alerts for new student/colleague messages."
        >
          <button
            onClick={() => toggleSetting("inAppMessages")}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              settings.inAppMessages
                ? "bg-green-100 text-green-700"
                : "bg-red-100 text-red-700"
            }`}
          >
            {settings.inAppMessages ? "Enabled" : "Disabled"}
          </button>
        </SettingRow>
        <SettingRow
          title="Digest Frequency"
          description="Choose how often you receive a summary of non-urgent activities."
        >
          <select
            value={settings.digestFrequency}
            onChange={(e) =>
              setSettings({ ...settings, digestFrequency: e.target.value })
            }
            className="p-2 border rounded-md"
          >
            <option value="immediate">Immediate</option>
            <option value="daily">Daily Summary</option>
            <option value="weekly">Weekly Digest</option>
          </select>
        </SettingRow>
      </div>
    );
  };
  const AppearanceSection: React.FC<{
    fontSize: string;
    setFontSize: (f: string) => void;
  }> = ({ fontSize, setFontSize }) => (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
        Application Preferences
      </h2>
      <SettingRow
        title="Font Size"
        description="Adjust text size for better readability."
      >
        <div className="flex space-x-2">
          <button
            onClick={() => setFontSize("small")}
            className={`px-3 py-1 rounded-md text-sm transition-colors ${
              fontSize === "small"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            A-
          </button>
          <button
            onClick={() => setFontSize("medium")}
            className={`px-3 py-1 rounded-md text-base transition-colors ${
              fontSize === "medium"
                ? "bg-indigo-500 text-white"
                : "bg-gray-200 text-gray-700"
            }`}
          >
            A
          </button>
          <button
            onClick={() => setFontSize("large")}
            className={`px-3 py-1 rounded-md text-lg transition-colors ${
              fontSize === "large"
                ? "bg-indigo-500 text-white"
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
        <select className="p-2 border rounded-md">
          <option>My Dashboard</option>
          <option>Course List</option>
          <option>Today's Schedule</option>
        </select>
      </SettingRow>
    </div>
  );
  const SecuritySection: React.FC = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
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
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Recent Login History
          </h3>
          <div className="text-sm text-gray-600 space-y-1">
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
  const SystemConfigSection: React.FC = () => {
    const [academicYear, setAcademicYear] = useState("2025-2026");
    const [departments, setDepartments] = useState([
      "CS",
      "Math",
      "Physics",
      "History",
    ]);
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          System Configuration
        </h2>
        <SettingRow
          title="Academic Term Setup"
          description="Define the current active academic year and semester dates."
        >
          <div className="flex space-x-2 items-center">
            <Calendar className="h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={academicYear}
              onChange={(e) => setAcademicYear(e.target.value)}
              className="p-1 border rounded-md w-32"
            />
            <button
              onClick={() => showSuccess("Academic year updated")}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              Update
            </button>
          </div>
        </SettingRow>
        <div className="pt-4">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Department Management (CRUD)
          </h3>
          <ul className="space-y-2 text-sm">
            {departments.map((dept, index) => (
              <li
                key={dept}
                className="flex justify-between items-center bg-gray-50 p-2 rounded-md border"
              >
                <span>{dept}</span>
                <button
                  onClick={() => {
                    const newDept = prompt(`Rename ${dept} to:`);
                    if (newDept)
                      setDepartments((prev) =>
                        prev.map((d, i) => (i === index ? newDept : d))
                      );
                  }}
                  className="text-blue-500 hover:text-blue-700 mr-4"
                >
                  Edit
                </button>
              </li>
            ))}
            <li className="text-center">
              <button
                onClick={() => {
                  const newDept = prompt("Enter new department name:");
                  if (newDept) setDepartments((prev) => [...prev, newDept]);
                }}
                className="text-green-600 hover:text-green-800 font-medium"
              >
                <PlusCircle className="inline h-4 w-4 mr-1" /> Add Department
              </button>
            </li>
          </ul>
        </div>
        <SettingRow
          title="Announcement Templates"
          description="Manage and pre-configure standard email and system announcement templates."
        >
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            <Mail className="inline h-4 w-4 mr-1" /> Edit Templates
          </button>
        </SettingRow>
      </div>
    );
  };
  const DataMaintenanceSection: React.FC = () => {
    const handleExport = () => {
      showSuccess("All local data exported as JSON.");
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
        <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">
          Data & Maintenance
        </h2>
        <SettingRow
          title="Data Backup (Simulated)"
          description="Export all application data to a JSON file."
        >
          <button
            onClick={handleExport}
            className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors flex items-center"
          >
            <Download className="h-5 w-5 mr-2" /> Export JSON
          </button>
        </SettingRow>
        <SettingRow
          title="System Audit Log"
          description="View a log of all critical administrative actions (simulated log)."
        >
          <button className="text-indigo-600 hover:text-indigo-800 font-medium">
            View Logs
          </button>
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
      case "profile":
        return <ProfileSection />;
      case "notifications":
        return <NotificationsSection />;
      case "appearance":
        return (
          <AppearanceSection fontSize={fontSize} setFontSize={setFontSize} />
        );
      case "security":
        return <SecuritySection />;
      case "system_config":
        return <SystemConfigSection />;
      case "data_maintenance":
        return <DataMaintenanceSection />;
      default:
        return <ProfileSection />;
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 border-b border-gray-200 pb-4">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center">
            <Settings className="h-7 w-7 mr-3 text-indigo-600" />
            Portal Settings
          </h1>
          <p className="text-gray-500 mt-1">
            Personalize your experience or manage the entire system.
          </p>
        </header>
        <div className="flex flex-col lg:flex-row bg-white rounded-xl shadow-2xl overflow-hidden">
          <nav className="w-full lg:w-64 bg-gray-50 p-6 border-b lg:border-r lg:border-b-0">
            <ul className="space-y-1">
              {navItems
                .filter(
                  (item) =>
                    item.role === "standard" ||
                    (item.role === "admin" && isAdmin)
                )
                .map((item) => (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full text-left flex items-center px-4 py-3 rounded-lg font-medium transition-colors ${
                        activeSection === item.id
                          ? "bg-indigo-500 text-white shadow-md"
                          : "text-gray-700 hover:bg-gray-200"
                      } ${
                        item.role === "admin"
                          ? "border-t border-gray-200 pt-4 mt-2"
                          : ""
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

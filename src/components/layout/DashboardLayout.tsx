// src/components/DashboardLayout.tsx

import React, { useState, useRef, useEffect, useMemo } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  BarChart3,
  Users,
  FolderOpen,
  FileText,
  Search,
  Bell,
  Target,
  Menu,
  X,
  Settings,
  ChevronDown,
  User,
  Moon,
  Sun,
  Zap,
  MessageSquare,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../ui/ThemeContext";
import defaultUserPhoto from "../../assets/images/milan.png";

import ChatComponent from "../chat/ChatComponent";

// ------------------------------------
// REMOVE AUTH COMPLETELY
// REPLACE WITH SINGLE MOCK USER
// ------------------------------------
const mockUser = {
  uid: "mock-001",
  displayName: "Demo User",
  email: "demo@app.com",
  photoURL: defaultUserPhoto,
};

// ------------------------------------
// Faculty Mock Data
// ------------------------------------
interface NavItem {
  name: string;
  href: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface MockFaculty {
  id: string;
  name: string;
  role: string;
  department: string;
  email: string;
}

const mockFacultyData: MockFaculty[] = [
  {
    id: "faculty-milan",
    name: "Dr. Milan Sharma",
    role: "Assoc. Professor",
    department: "Computer Science",
    email: "milan.sharma@uni.edu",
  },
  {
    id: "faculty-anya",
    name: "Dr. Anya Smith",
    role: "Professor",
    department: "Physics",
    email: "anya.smith@uni.edu",
  },
  {
    id: "faculty-john",
    name: "Prof. John Doe",
    role: "Lecturer",
    department: "Mathematics",
    email: "john.doe@uni.edu",
  },
  {
    id: "faculty-jane",
    name: "Dr. Jane Wilson",
    role: "Assoc. Professor",
    department: "Biology",
    email: "jane.wilson@uni.edu",
  },
];

// ==================================
// 🔍 FacultySearch Component
// ==================================
const FacultySearch = ({
  onChatSelect,
}: {
  onChatSelect: (id: string, name: string) => void;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [resultsOpen, setResultsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const filteredFaculty = useMemo(() => {
    if (!searchTerm) return [];
    const t = searchTerm.toLowerCase();
    return mockFacultyData.filter(
      (f) =>
        f.name.toLowerCase().includes(t) ||
        f.department.toLowerCase().includes(t) ||
        f.email.toLowerCase().includes(t)
    );
  }, [searchTerm]);

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setResultsOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={searchRef} className="relative flex-1 mr-4 sm:mr-0 sm:max-w-lg">
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          className="block w-full pl-10 pr-3 py-2 border rounded-lg bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white"
          placeholder="Search Faculty..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setResultsOpen(true);
          }}
        />
      </div>

      <AnimatePresence>
        {searchTerm && resultsOpen && filteredFaculty.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute mt-1 w-full rounded-lg shadow-xl bg-white dark:bg-gray-800 max-h-60 overflow-y-auto"
          >
            {filteredFaculty.map((f) => (
              <div
                key={f.id}
                className="flex justify-between items-center px-2 py-2 border-b hover:bg-indigo-50 dark:hover:bg-gray-700"
              >
                <button
                  className="flex-1 text-left px-2"
                  onClick={() => navigate(`/dashboard/faculty/${f.id}`)}
                >
                  <span className="font-semibold">{f.name}</span>
                  <span className="text-xs text-gray-500 block">
                    {f.role} • {f.department}
                  </span>
                </button>

                <motion.button
                  onClick={() => onChatSelect(f.id, f.name)}
                  className="p-2 rounded-full text-indigo-600 hover:bg-indigo-100"
                >
                  <MessageSquare className="h-5 w-5" />
                </motion.button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================================
// 🔽 User Dropdown (No Auth Needed)
// ==================================
const UserProfileDropdown = () => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const user = mockUser;

  useEffect(() => {
    const close = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node))
        setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div ref={ref} className="relative flex items-center ml-4">
      <motion.button
        onClick={() => setOpen(!open)}
        className="flex items-center p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
      >
        <img
          src={user.photoURL}
          className="h-9 w-9 rounded-full object-cover"
        />
        <div className="hidden md:flex flex-col ml-3">
          <span className="text-sm font-medium">{user.displayName}</span>
          <span className="text-xs text-gray-400">User</span>
        </div>
        <ChevronDown className="ml-1 h-4 w-4" />
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="absolute top-12 right-0 w-56 rounded-xl shadow-xl bg-white dark:bg-gray-800 py-2"
          >
            <button
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
              onClick={() => navigate("/dashboard/profile")}
            >
              Profile
            </button>
            <button
              className="w-full text-left px-4 py-2 hover:bg-indigo-50 dark:hover:bg-gray-700"
              onClick={() => navigate("/dashboard/settings")}
            >
              Settings
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ==================================
// 📌 Sidebar Navigation
// ==================================
const SidebarContent = ({ navigation }: { navigation: NavItem[] }) => (
  <div className="flex flex-col flex-grow bg-white dark:bg-gray-800 border-r pt-5 pb-4 overflow-y-auto">
    <div className="flex items-center px-4">
      <Target className="h-8 w-8 text-indigo-600" />
      <span className="ml-2 text-xl font-bold">FacultyApp</span>
    </div>

    <nav className="mt-5 flex-1 px-2 space-y-1">
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
          <item.icon className="mr-3 h-6 w-6" />
          {item.name}
        </NavLink>
      ))}
    </nav>
  </div>
);

// ==================================
// MAIN DASHBOARD LAYOUT (NO AUTH)
// ==================================
const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showBlast, setShowBlast] = useState(false);
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
    { name: "Calendar", href: "/dashboard/calender", icon: Target },
    { name: "Contacts", href: "/dashboard/contacts", icon: Users },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Notifications", href: "/dashboard/notifications", icon: Bell },
    { name: "Messages", href: "/dashboard/messages", icon: MessageSquare },
    { name: "Profile", href: "/dashboard/profile", icon: User },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
  ];

  const handleChatSelect = (facultyId: string, facultyName: string) => {
    const chatId = `${mockUser.uid}-${facultyId}`;
    setSelectedChat({ id: chatId, name: facultyName });
  };

  return (
    <div className="h-screen flex bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar Mobile */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            <div
              className="absolute inset-0 bg-black opacity-50"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "-100%" }}
              className="relative w-64 h-full bg-white dark:bg-gray-800"
            >
              <SidebarContent navigation={navigation} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <div className="hidden lg:flex lg:w-64">
        <SidebarContent navigation={navigation} />
      </div>

      {/* TOP BAR */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center h-16 bg-white dark:bg-gray-800 shadow px-4">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden mr-2"
          >
            <Menu className="h-6 w-6" />
          </button>

          <FacultySearch onChatSelect={handleChatSelect} />

          {/* Right */}
          <button onClick={toggleTheme} className="ml-4">
            {isDarkMode ? <Sun /> : <Moon />}
          </button>
          <UserProfileDropdown />
        </div>

        {/* MAIN OUTLET */}
        <main className="flex-1 overflow-y-auto relative">
          <Outlet />
        </main>

        {/* CHAT SIDEBAR */}
        <AnimatePresence>
          {selectedChat && (
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: "0%" }}
              exit={{ x: "100%" }}
              className="fixed right-0 top-0 bottom-0 w-full lg:w-80 bg-white dark:bg-gray-800 shadow-2xl pt-16 z-50"
            >
              <div className="px-4 py-2 flex justify-between items-center border-b">
                <h5 className="font-semibold">Chat with {selectedChat.name}</h5>
                <button onClick={() => setSelectedChat(null)}>
                  <X />
                </button>
              </div>

              <ChatComponent
                chatRoomId={selectedChat.id}
                currentUserId={mockUser.uid}
                currentUserName={mockUser.displayName}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default DashboardLayout;

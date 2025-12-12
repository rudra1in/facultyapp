import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Mail,
  Phone,
  MapPin,
  Calendar,
  MoreHorizontal,
  Clock, // New icon for Workload
  TrendingUp, // New icon for last activity
  AlertTriangle,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";
import AddFacultyModal from "../components/ui/AddFacultyModal"; // Import the new modal

// Placeholder functions for your navigation and data handlers
const handleViewFacultyProfile = (id: number) =>
  console.log(`Navigating to profile for faculty ID: ${id}`);
const handleMoreOptions = (id: number) =>
  console.log(`Showing more options for faculty ID: ${id}`);

interface FacultyMember {
  id: number;
  name: string;
  title: string;
  email: string;
  phone: string;
  location: string;
  joinDate: string;
  status: "active" | "inactive";
  subjects: string[];
  sessions: number;
  rating: number;
  initials: string;
  color: string;
  // NEW FIELD
  lastActivity: string; // e.g., '2025-01-15'
  workloadThreshold: number; // Max sessions before 'Overloaded'
}

const initialFacultyMembers: FacultyMember[] = [
  {
    id: 1,
    name: "Dr. Sarah Johnson",
    title: "Professor",
    email: "sarah.johnson@university.edu",
    phone: "+1 (555) 123-4567",
    location: "New York, NY",
    joinDate: "Joined 2018-08-15",
    status: "active",
    subjects: ["Advanced Calculus", "Linear Algebra", "Statistics"],
    sessions: 45, // High Session Count
    rating: 4.8,
    initials: "SJ",
    color: "bg-blue-600",
    lastActivity: "2025-09-28", // Recent
    workloadThreshold: 40, // Overloaded (45 > 40)
  },
  {
    id: 2,
    name: "Prof. Michael Chen",
    title: "Associate Professor",
    email: "michael.chen@university.edu",
    phone: "+1 (555) 234-5678",
    location: "Boston, MA",
    joinDate: "Joined 2020-01-10",
    status: "active",
    subjects: ["Quantum Physics", "Thermodynamics"],
    sessions: 32, // Optimal
    rating: 4.6,
    initials: "MC",
    color: "bg-green-600",
    lastActivity: "2025-09-25",
    workloadThreshold: 50, // Underutilized (32 < 50)
  },
  {
    id: 3,
    name: "Dr. Emily Davis",
    title: "Assistant Professor",
    email: "emily.davis@university.edu",
    phone: "+1 (555) 345-6789",
    location: "San Francisco, CA",
    joinDate: "Joined 2021-09-01",
    status: "active",
    subjects: ["Data Structures", "Algorithms", "Machine Learning"],
    sessions: 38, // Optimal
    rating: 4.9,
    initials: "ED",
    color: "bg-purple-600",
    lastActivity: "2025-10-01", // Very Recent
    workloadThreshold: 40, // Optimal (38 is close to 40)
  },
  {
    id: 4,
    name: "Dr. Robert Wilson",
    title: "Professor",
    email: "robert.wilson@university.edu",
    phone: "+1 (555) 456-7890",
    location: "Chicago, IL",
    joinDate: "Joined 2017-03-20",
    status: "inactive",
    subjects: ["Organic Chemistry", "Biochemistry"],
    sessions: 52,
    rating: 4.7,
    initials: "RW",
    color: "bg-indigo-600",
    lastActivity: "2024-03-10", // Old
    workloadThreshold: 45,
  },
];

const FacultyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Subjects"); // Renamed for clarity
  const [facultyMembers, setFacultyMembers] = useState<FacultyMember[]>(
    initialFacultyMembers
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(
    null
  ); // For editing

  // Workload Classification Logic
  const getWorkloadStatus = (sessions: number, threshold: number) => {
    if (sessions > threshold) {
      return { status: "Overloaded", color: "bg-red-500", icon: AlertTriangle };
    }
    if (sessions >= threshold * 0.8) {
      return { status: "Optimal", color: "bg-green-500", icon: Zap };
    }
    return { status: "Underutilized", color: "bg-yellow-500", icon: Clock };
  };

  // Function to handle Add and Edit
  const handleSaveFaculty = (faculty: FacultyMember, isEditing: boolean) => {
    if (isEditing) {
      setFacultyMembers((prevMembers) =>
        prevMembers.map((m) => (m.id === faculty.id ? faculty : m))
      );
    } else {
      setFacultyMembers((prevMembers) => [faculty, ...prevMembers]);
    }
    setIsModalOpen(false);
    setEditingFaculty(null);
    console.log(`Faculty ${isEditing ? "updated" : "added"}:`, faculty);
  };

  const handleEditFaculty = (faculty: FacultyMember) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleDeleteFaculty = (id: number) => {
    setFacultyMembers((prevMembers) =>
      prevMembers.filter((member) => member.id !== id)
    );
    console.log(`Deleted faculty member with ID: ${id}`);
  };

  const getSubjectColor = (subject: string) => {
    const colors: { [key: string]: string } = {
      "Advanced Calculus": "bg-blue-100 text-blue-800",
      "Linear Algebra": "bg-blue-100 text-blue-800",
      Statistics: "bg-blue-100 text-blue-800",
      "Quantum Physics": "bg-green-100 text-green-800",
      Thermodynamics: "bg-green-100 text-green-800",
      "Data Structures": "bg-purple-100 text-purple-800",
      Algorithms: "bg-purple-100 text-purple-800",
      "Machine Learning": "bg-purple-100 text-purple-800",
      "Organic Chemistry": "bg-orange-100 text-orange-800",
      Biochemistry: "bg-orange-100 text-orange-800",
    };
    return colors[subject] || "bg-gray-100 text-gray-800";
  };

  const getAllSubjects = () => {
    const subjects = new Set<string>();
    facultyMembers.forEach((member) => {
      member.subjects.forEach((subject) => subjects.add(subject));
    });
    return Array.from(subjects).sort();
  };

  const filteredFaculty = facultyMembers.filter((faculty) => {
    const matchesSearch =
      faculty.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faculty.subjects.some((subject) =>
        subject.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTag =
      selectedTag === "All Subjects" || faculty.subjects.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const activeFaculty = filteredFaculty.filter((f) => f.status === "active");
  const inactiveFaculty = filteredFaculty.filter(
    (f) => f.status === "inactive"
  );

  return (
    <div className="p-6 max-w-7xl mx-auto font-sans bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Faculty Management
          </h1>
          <p className="text-gray-600 mt-1">
            Manage faculty members, their profiles, and subject assignments.
          </p>
        </div>
        <motion.button
          onClick={() => {
            setEditingFaculty(null);
            setIsModalOpen(true);
          }}
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 transition-colors flex items-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </motion.button>
      </div>

      {/* Stats Cards (Enhanced) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Total Active Faculty</p>
            <p className="text-3xl font-bold text-gray-900 mt-1">
              {activeFaculty.length}
            </p>
          </div>
          <Clock className="w-10 h-10 text-indigo-500 opacity-20" />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Overloaded Faculty</p>
            <p className="text-3xl font-bold text-red-600 mt-1">
              {
                activeFaculty.filter(
                  (f) =>
                    getWorkloadStatus(f.sessions, f.workloadThreshold)
                      .status === "Overloaded"
                ).length
              }
            </p>
          </div>
          <AlertTriangle className="w-10 h-10 text-red-500 opacity-20" />
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border border-gray-200 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-600">Average Rating</p>
            <p className="text-3xl font-bold text-yellow-600 mt-1">
              {activeFaculty.length > 0
                ? (
                    activeFaculty.reduce((sum, f) => sum + f.rating, 0) /
                    activeFaculty.length
                  ).toFixed(2)
                : "N/A"}
            </p>
          </div>
          <Star className="w-10 h-10 text-yellow-500 opacity-20 fill-yellow-500" />
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between mb-8 space-y-4 md:space-y-0 md:space-x-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search faculty by name, email, or subject..."
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <div>
          {/* Tag Filter (Uses all unique subjects) */}
          <select
            className="border border-gray-300 rounded-xl px-4 py-2.5 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all w-full md:w-auto"
            value={selectedTag}
            onChange={(e) => setSelectedTag(e.target.value)}
          >
            <option>All Subjects</option>
            {getAllSubjects().map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Active Faculty List */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          Active Faculty ({activeFaculty.length})
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {activeFaculty.map((faculty) => {
            const workload = getWorkloadStatus(
              faculty.sessions,
              faculty.workloadThreshold
            );
            const StatusIcon = workload.icon;

            return (
              <motion.div
                key={faculty.id}
                className="bg-white rounded-xl shadow-md border p-6 flex flex-col justify-between cursor-pointer hover:shadow-lg transition-shadow duration-300 relative overflow-hidden"
                onClick={() => handleViewFacultyProfile(faculty.id)}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* Workload Indicator Badge (NEW FEATURE) */}
                <div
                  className={`absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-xs font-semibold text-white flex items-center ${workload.color}`}
                >
                  <StatusIcon className="w-3 h-3 mr-1" />
                  {workload.status}
                </div>

                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 ${faculty.color} rounded-full flex items-center justify-center flex-shrink-0`}
                    >
                      <span className="text-white text-lg font-bold">
                        {faculty.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 leading-tight">
                        {faculty.name}
                      </h3>
                      <p className="text-sm text-gray-600">{faculty.title}</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-3 text-gray-600 mb-5">
                  <div className="flex items-center text-sm">
                    <Mail className="w-4 h-4 mr-2 text-gray-400" />
                    {faculty.email}
                  </div>
                  <div className="flex items-center text-sm">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    {faculty.location}
                  </div>
                  {/* Last Activity (NEW FEATURE) */}
                  <div className="flex items-center text-sm">
                    <TrendingUp className="w-4 h-4 mr-2 text-gray-400" />
                    Last Activity:{" "}
                    <span className="font-medium ml-1 text-gray-800">
                      {faculty.lastActivity}
                    </span>
                  </div>
                </div>

                <div className="mb-4">
                  <p className="text-sm font-semibold text-gray-700 mb-2">
                    Expertise
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {faculty.subjects.map((subject, index) => (
                      <span
                        key={index}
                        className={`px-3 py-1 text-xs font-medium rounded-full ${getSubjectColor(
                          subject
                        )}`}
                      >
                        {subject}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <div className="flex items-center space-x-4">
                    <div className="text-center">
                      <div className="text-sm font-bold text-gray-900">
                        {faculty.sessions} / {faculty.workloadThreshold}
                      </div>
                      <div className="text-xs text-gray-500">
                        Sessions / Max
                      </div>
                    </div>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      <span className="text-sm font-semibold text-gray-900 ml-1">
                        {faculty.rating}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {/* Edit Button (Now opens modal for editing) */}
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditFaculty(faculty); // Call new handler
                      }}
                      className="p-2 rounded-full text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Edit Faculty"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Edit className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFaculty(faculty.id);
                      }}
                      className="p-2 rounded-full text-red-500 hover:text-red-700 hover:bg-red-100 transition-colors"
                      title="Delete Faculty"
                      whileHover={{ scale: 1.1 }}
                    >
                      <Trash2 className="w-5 h-5" />
                    </motion.button>
                    <MoreHorizontal className="w-5 h-5 text-gray-400 ml-2" />
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Inactive Faculty */}
      {inactiveFaculty.length > 0 && (
        <div className="mt-12">
          <h2 className="text-xl font-bold text-gray-900 mb-4">
            Inactive Faculty ({inactiveFaculty.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveFaculty.map((faculty) => (
              <motion.div
                key={faculty.id}
                className="bg-white rounded-xl shadow-md border p-6 flex flex-col justify-between opacity-70 cursor-pointer hover:shadow-lg transition-shadow duration-300"
                onClick={() => handleViewFacultyProfile(faculty.id)}
                whileHover={{
                  y: -5,
                  boxShadow: "0 10px 20px rgba(0,0,0,0.05)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {/* ... (Inactive card content, simplified for brevity) ... */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-14 h-14 ${faculty.color} rounded-full flex items-center justify-center flex-shrink-0 opacity-75`}
                    >
                      <span className="text-white text-lg font-bold">
                        {faculty.initials}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-700 leading-tight">
                        {faculty.name}
                      </h3>
                      <p className="text-sm text-gray-500">{faculty.title}</p>
                    </div>
                  </div>
                  <div className="flex-shrink-0">
                    <span className="bg-gray-100 text-gray-600 px-3 py-1 text-xs font-semibold rounded-full">
                      Inactive
                    </span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 flex items-center space-x-3">
                  <Calendar className="w-4 h-4" />
                  <span>{faculty.joinDate}</span>
                </div>

                <div className="flex justify-end pt-4 border-t mt-4 border-gray-100">
                  <motion.button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditFaculty(faculty);
                    }}
                    className="p-2 rounded-full text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                    title="Reactivate/Edit"
                    whileHover={{ scale: 1.1 }}
                  >
                    <Edit className="w-5 h-5" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* The Modal Component (Passes editing state) */}
      <AddFacultyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFaculty(null); // Clear editing state on close
        }}
        onSaveFaculty={handleSaveFaculty}
        editingFaculty={editingFaculty} // Pass the member being edited
      />
    </div>
  );
};

export default FacultyPage;

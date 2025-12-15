import React, { useState } from "react";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  Star,
  Mail,
  MapPin,
  Calendar,
  MoreHorizontal,
  Clock,
  TrendingUp,
  AlertTriangle,
  Zap,
} from "lucide-react";
import { motion } from "framer-motion";

import AddFacultyModal from "../components/ui/AddFacultyModal";
import { useFaculty } from "../hooks/useFaculty";
import { FacultyMember } from "../types/faculty";

// Placeholder navigation handlers (unchanged)
const handleViewFacultyProfile = (id: number) =>
  console.log(`Navigating to profile for faculty ID: ${id}`);

const FacultyPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Subjects");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingFaculty, setEditingFaculty] = useState<FacultyMember | null>(
    null
  );

  // 🔥 API Hook
  const { faculty, loading, createFaculty, editFaculty, removeFaculty } =
    useFaculty();

  // -----------------------------------
  // Workload Classification
  // -----------------------------------
  const getWorkloadStatus = (sessions: number, threshold: number) => {
    if (sessions > threshold)
      return { status: "Overloaded", color: "bg-red-500", icon: AlertTriangle };
    if (sessions >= threshold * 0.8)
      return { status: "Optimal", color: "bg-green-500", icon: Zap };
    return { status: "Underutilized", color: "bg-yellow-500", icon: Clock };
  };

  // -----------------------------------
  // API Actions
  // -----------------------------------
  const handleSaveFaculty = async (
    facultyData: FacultyMember,
    isEditing: boolean
  ) => {
    if (isEditing) {
      await editFaculty(facultyData.id, facultyData);
    } else {
      await createFaculty(facultyData);
    }
    setIsModalOpen(false);
    setEditingFaculty(null);
  };

  const handleEditFaculty = (faculty: FacultyMember) => {
    setEditingFaculty(faculty);
    setIsModalOpen(true);
  };

  const handleDeleteFaculty = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this faculty?")) {
      await removeFaculty(id);
    }
  };

  // -----------------------------------
  // Helpers
  // -----------------------------------
  const getSubjectColor = (subject: string) => {
    const colors: Record<string, string> = {
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
    faculty.forEach((f) => f.subjects.forEach((s) => subjects.add(s)));
    return Array.from(subjects).sort();
  };

  // -----------------------------------
  // Filters
  // -----------------------------------
  const filteredFaculty = faculty.filter((f) => {
    const matchesSearch =
      f.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.subjects.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase())
      );

    const matchesTag =
      selectedTag === "All Subjects" || f.subjects.includes(selectedTag);

    return matchesSearch && matchesTag;
  });

  const activeFaculty = filteredFaculty.filter((f) => f.status === "active");
  const inactiveFaculty = filteredFaculty.filter(
    (f) => f.status === "inactive"
  );

  // -----------------------------------
  // Loading State
  // -----------------------------------
  if (loading) {
    return <div className="p-6 text-gray-500">Loading faculty...</div>;
  }

  // ===================================
  // UI
  // ===================================
  return (
    <div className="p-6 max-w-7xl mx-auto bg-gray-50 min-h-screen">
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
          className="bg-indigo-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-indigo-700 flex items-center shadow-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Faculty
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <p className="text-sm text-gray-600">Total Active Faculty</p>
          <p className="text-3xl font-bold">{activeFaculty.length}</p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <p className="text-sm text-gray-600">Overloaded Faculty</p>
          <p className="text-3xl font-bold text-red-600">
            {
              activeFaculty.filter(
                (f) =>
                  getWorkloadStatus(f.sessions, f.workloadThreshold).status ===
                  "Overloaded"
              ).length
            }
          </p>
        </div>
        <div className="bg-white p-5 rounded-xl shadow-md border">
          <p className="text-sm text-gray-600">Average Rating</p>
          <p className="text-3xl font-bold text-yellow-600">
            {activeFaculty.length
              ? (
                  activeFaculty.reduce((s, f) => s + f.rating, 0) /
                  activeFaculty.length
                ).toFixed(2)
              : "N/A"}
          </p>
        </div>
      </div>

      {/* Search */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            className="w-full pl-10 pr-4 py-2.5 border rounded-xl"
            placeholder="Search faculty..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <select
          className="border rounded-xl px-4 py-2.5"
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
        >
          <option>All Subjects</option>
          {getAllSubjects().map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      {/* Active Faculty */}
      <h2 className="text-xl font-bold mb-4">
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
              className="bg-white rounded-xl shadow-md border p-6 cursor-pointer"
              onClick={() => handleViewFacultyProfile(faculty.id)}
              whileHover={{ y: -5 }}
            >
              <div
                className={`absolute top-0 right-0 px-3 py-1 text-xs text-white ${workload.color}`}
              >
                <StatusIcon className="w-3 h-3 inline mr-1" />
                {workload.status}
              </div>

              <h3 className="text-lg font-semibold">{faculty.name}</h3>
              <p className="text-sm text-gray-600">{faculty.title}</p>

              <div className="mt-4 space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {faculty.email}
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {faculty.location}
                </div>
                <div className="flex items-center">
                  <TrendingUp className="w-4 h-4 mr-2" />
                  Last Activity: {faculty.lastActivity}
                </div>
              </div>

              <div className="flex justify-between mt-4 border-t pt-4">
                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditFaculty(faculty);
                  }}
                >
                  <Edit />
                </motion.button>

                <motion.button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteFaculty(faculty.id);
                  }}
                  className="text-red-500"
                >
                  <Trash2 />
                </motion.button>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Inactive Faculty */}
      {inactiveFaculty.length > 0 && (
        <>
          <h2 className="text-xl font-bold mt-12 mb-4">
            Inactive Faculty ({inactiveFaculty.length})
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {inactiveFaculty.map((faculty) => (
              <div
                key={faculty.id}
                className="bg-white p-6 rounded-xl border opacity-70"
              >
                <h3 className="font-semibold">{faculty.name}</h3>
                <p className="text-sm text-gray-500">{faculty.title}</p>
              </div>
            ))}
          </div>
        </>
      )}

      {/* Modal */}
      <AddFacultyModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingFaculty(null);
        }}
        onSaveFaculty={handleSaveFaculty}
        editingFaculty={editingFaculty}
      />
    </div>
  );
};

export default FacultyPage;

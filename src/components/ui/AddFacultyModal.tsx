// src/components/AddFacultyModal.tsx
import React, { useState, useEffect } from "react";
import { X, UserPlus, Save, Info } from "lucide-react"; // <- CORRECTED LINE
import { AnimatePresence, motion } from "framer-motion";

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
  // New field for the update
  lastActivity: string;
  workloadThreshold: number; // For workload calculation
}

interface AddFacultyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveFaculty: (faculty: FacultyMember, isEditing: boolean) => void;
  editingFaculty: FacultyMember | null;
}

const colorOptions = [
  { name: "Blue", value: "bg-blue-600" },
  { name: "Green", value: "bg-green-600" },
  { name: "Purple", value: "bg-purple-600" },
  { name: "Indigo", value: "bg-indigo-600" },
];

const subjectOptions = [
  "Advanced Calculus",
  "Linear Algebra",
  "Statistics",
  "Quantum Physics",
  "Thermodynamics",
  "Data Structures",
  "Algorithms",
  "Machine Learning",
  "Organic Chemistry",
  "Biochemistry",
];

const modalVariants = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } },
  exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2 } },
};

const AddFacultyModal: React.FC<AddFacultyModalProps> = ({
  isOpen,
  onClose,
  onSaveFaculty,
  editingFaculty,
}) => {
  const isEditing = !!editingFaculty;

  // Set initial state based on editingFaculty or default values
  const [formData, setFormData] = useState({
    name: "",
    title: "Professor",
    email: "",
    phone: "",
    location: "",
    status: "active",
    color: colorOptions[0].value,
    selectedSubjects: [] as string[],
    workloadThreshold: 40, // Default workload threshold
  });

  useEffect(() => {
    if (editingFaculty) {
      setFormData({
        name: editingFaculty.name,
        title: editingFaculty.title,
        email: editingFaculty.email,
        phone: editingFaculty.phone,
        location: editingFaculty.location,
        status: editingFaculty.status,
        color: editingFaculty.color,
        selectedSubjects: editingFaculty.subjects,
        workloadThreshold: (editingFaculty as any).workloadThreshold || 40,
      });
    } else {
      setFormData({
        name: "",
        title: "Professor",
        email: "",
        phone: "",
        location: "",
        status: "active",
        color: colorOptions[0].value,
        selectedSubjects: [],
        workloadThreshold: 40,
      });
    }
  }, [editingFaculty, isOpen]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubjectChange = (subject: string) => {
    setFormData((prev) => ({
      ...prev,
      selectedSubjects: prev.selectedSubjects.includes(subject)
        ? prev.selectedSubjects.filter((s) => s !== subject)
        : [...prev.selectedSubjects, subject],
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Helper to generate initials
    const getInitials = (name: string): string => {
      return name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .substring(0, 2);
    };

    const newFaculty: FacultyMember = {
      id: isEditing ? editingFaculty!.id : Date.now(), // Use existing ID or generate new
      name: formData.name,
      title: formData.title,
      email: formData.email,
      phone: formData.phone,
      location: formData.location,
      joinDate: isEditing
        ? editingFaculty!.joinDate
        : `Joined ${new Date().toISOString().slice(0, 10)}`,
      status: formData.status as "active" | "inactive",
      subjects: formData.selectedSubjects,
      sessions: isEditing ? editingFaculty!.sessions : 0, // Preserve sessions when editing
      rating: isEditing ? editingFaculty!.rating : 0.0, // Preserve rating when editing
      initials: getInitials(formData.name),
      color: formData.color,
      lastActivity: isEditing
        ? editingFaculty!.lastActivity
        : new Date().toISOString().slice(0, 10),
      workloadThreshold: formData.workloadThreshold,
    };

    onSaveFaculty(newFaculty, isEditing);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative"
          onClick={(e) => e.stopPropagation()}
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            {isEditing ? (
              <Save className="w-6 h-6 mr-3 text-indigo-600" />
            ) : (
              <UserPlus className="w-6 h-6 mr-3 text-indigo-600" />
            )}
            {isEditing ? "Edit Faculty Member" : "Add New Faculty Member"}
          </h3>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="e.g., Jane Doe"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Title */}
              <div>
                <label
                  htmlFor="title"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Title
                </label>
                <select
                  id="title"
                  name="title"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={formData.title}
                  onChange={handleChange}
                  required
                >
                  <option>Professor</option>
                  <option>Associate Professor</option>
                  <option>Assistant Professor</option>
                  <option>Lecturer</option>
                </select>
              </div>
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="user@university.edu"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              {/* Phone */}
              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Phone
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              {/* Location */}
              <div>
                <label
                  htmlFor="location"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Location / Campus
                </label>
                <input
                  type="text"
                  id="location"
                  name="location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  placeholder="City, State"
                  value={formData.location}
                  onChange={handleChange}
                />
              </div>
              {/* Status */}
              <div>
                <label
                  htmlFor="status"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                  value={formData.status}
                  onChange={handleChange}
                  required
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive / Leave</option>
                </select>
              </div>
            </div>

            {/* NEW: Workload Threshold */}
            <div>
              <label
                htmlFor="workloadThreshold"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Workload Threshold (Max Sessions){" "}
                <Info
                  className="inline w-4 h-4 text-gray-400 ml-1"
                  title="The maximum number of sessions this faculty member is expected to handle before being flagged as 'Overloaded'."
                />
              </label>
              <input
                type="number"
                id="workloadThreshold"
                name="workloadThreshold"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-colors"
                placeholder="e.g., 40"
                value={formData.workloadThreshold}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    workloadThreshold: parseInt(e.target.value) || 0,
                  }))
                }
                required
                min="1"
              />
            </div>

            {/* Subjects/Expertise */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject Expertise
              </label>
              <div className="flex flex-wrap gap-2">
                {subjectOptions.map((subject) => (
                  <button
                    key={subject}
                    type="button"
                    onClick={() => handleSubjectChange(subject)}
                    className={`px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                      formData.selectedSubjects.includes(subject)
                        ? "bg-indigo-600 text-white hover:bg-indigo-700"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {subject}
                  </button>
                ))}
              </div>
            </div>

            {/* Profile Color */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Profile Avatar Color
              </label>
              <div className="flex space-x-3">
                {colorOptions.map((color) => (
                  <div
                    key={color.value}
                    onClick={() =>
                      setFormData((prev) => ({ ...prev, color: color.value }))
                    }
                    className={`w-10 h-10 rounded-full cursor-pointer border-4 ${
                      formData.color === color.value
                        ? "border-indigo-300 shadow-lg"
                        : "border-transparent opacity-80"
                    } transition-all duration-200`}
                    title={color.name}
                    style={{
                      backgroundColor: color.value
                        .replace("bg-", "var(--tw-bg-opacity)")
                        .replace("-600", "-600"),
                    }} // Use Tailwind colors for background
                  ></div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-lg bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition-colors flex items-center"
              >
                <Save className="w-4 h-4 mr-2" />
                {isEditing ? "Save Changes" : "Add Faculty"}
              </button>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AddFacultyModal;

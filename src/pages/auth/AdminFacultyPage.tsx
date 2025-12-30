import React, { useState } from "react";
import { useFaculty } from "../../hooks/useFaculty";
import { FacultyMember } from "../../types/faculty";
import FacultyDetailModal from "./FacultyDetailModal";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING:
      "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/40 dark:text-yellow-400",
    ACTIVE:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400",
    INACTIVE: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold ${colors[status]}`}
    >
      {status}
    </span>
  );
};

/* ================= FACULTY CARD ================= */
const FacultyCard = ({
  faculty,
  actions,
  onClick,
}: {
  faculty: FacultyMember;
  actions: React.ReactNode;
  onClick: () => void;
}) => (
  <div
    onClick={onClick}
    className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white dark:bg-gray-800 p-5 rounded-xl border border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md dark:hover:bg-gray-750 transition-all cursor-pointer space-y-4 md:space-y-0"
  >
    <div className="flex-1">
      <h3 className="font-semibold text-gray-900 dark:text-white">
        {faculty.name}
      </h3>
      <p className="text-sm text-gray-600 dark:text-gray-400">
        {faculty.email}
      </p>
      <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
        Subjects:{" "}
        <span className="text-gray-700 dark:text-gray-300">
          {faculty.subjects}
        </span>
      </p>

      <div className="mt-2">
        <StatusBadge status={faculty.status} />
      </div>
    </div>

    <div
      className="flex gap-2 w-full md:w-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {actions}
    </div>
  </div>
);

/* ================= SECTION ================= */
const Section = ({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) => (
  <div className="mb-10">
    <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200 flex items-center">
      <span className="w-1.5 h-6 bg-indigo-600 rounded-full mr-2"></span>
      {title}
    </h2>
    <div className="space-y-4">{children}</div>
  </div>
);

/* ================= ADMIN PAGE ================= */
const AdminFacultyPage = () => {
  const {
    faculty,
    loading,
    error,
    approveFacultyByAdmin,
    rejectFacultyByAdmin,
    deactivateFacultyByAdmin,
    activateFacultyByAdmin,
    removeFaculty,
  } = useFaculty();

  const [selectedFaculty, setSelectedFaculty] = useState<FacultyMember | null>(
    null
  );

  if (loading)
    return (
      <div className="p-8 min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"></div>
          <span>Loading faculty roster...</span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-600 bg-gray-50 dark:bg-gray-900 min-h-screen">
        {error}
      </div>
    );

  const pending = faculty.filter((f) => f.status === "PENDING");
  const active = faculty.filter((f) => f.status === "ACTIVE");
  const inactive = faculty.filter((f) => f.status === "INACTIVE");

  const toast = (msg: string) => alert(msg); // simple toast

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard – Faculty Control 🔐
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Manage approvals, account status, and faculty credentials.
          </p>
        </div>

        {/* ===================== PENDING ===================== */}
        <Section title={`Pending Requests (${pending.length})`}>
          {pending.length === 0 && (
            <div className="p-8 text-center rounded-xl border border-dashed border-gray-300 dark:border-gray-700">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                No pending faculty requests at this time.
              </p>
            </div>
          )}

          {pending.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <>
                  <button
                    onClick={() => {
                      approveFacultyByAdmin(f.id);
                      toast("Faculty approved successfully");
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-green-600 hover:bg-green-700 text-white text-sm font-medium transition-colors"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectFacultyByAdmin(f.id);
                      toast("Faculty rejected");
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    Reject
                  </button>
                </>
              }
            />
          ))}
        </Section>

        {/* ===================== ACTIVE ===================== */}
        <Section title={`Active Faculty (${active.length})`}>
          {active.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <>
                  <button
                    onClick={() => {
                      deactivateFacultyByAdmin(f.id);
                      toast("Faculty deactivated");
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-yellow-500 hover:bg-yellow-600 text-white text-sm font-medium transition-colors"
                  >
                    Deactivate
                  </button>
                  <button
                    onClick={() => {
                      if (
                        window.confirm(
                          "Are you sure? This is a permanent action."
                        )
                      ) {
                        removeFaculty(f.id);
                        toast("Faculty deleted");
                      }
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 text-sm font-medium transition-colors"
                  >
                    Hard Delete
                  </button>
                </>
              }
            />
          ))}
        </Section>

        {/* ===================== INACTIVE ===================== */}
        <Section title={`Inactive Faculty (${inactive.length})`}>
          {inactive.map((f) => (
            <FacultyCard
              key={f.id}
              faculty={f}
              onClick={() => setSelectedFaculty(f)}
              actions={
                <>
                  <button
                    onClick={() => {
                      activateFacultyByAdmin(f.id);
                      toast("Faculty activated");
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium transition-colors"
                  >
                    Activate
                  </button>
                  <button
                    onClick={() => {
                      if (window.confirm("Permanent delete?")) {
                        removeFaculty(f.id);
                        toast("Faculty deleted");
                      }
                    }}
                    className="flex-1 md:flex-none px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-medium transition-colors"
                  >
                    Hard Delete
                  </button>
                </>
              }
            />
          ))}
        </Section>

        {selectedFaculty && (
          <FacultyDetailModal
            faculty={selectedFaculty}
            onClose={() => setSelectedFaculty(null)}
          />
        )}
      </div>
    </div>
  );
};

export default AdminFacultyPage;

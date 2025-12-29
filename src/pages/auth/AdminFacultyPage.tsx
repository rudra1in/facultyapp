import React, { useState } from "react";
import { useFaculty } from "../../hooks/useFaculty";
import { FacultyMember } from "../../types/faculty";
import FacultyDetailModal from "./FacultyDetailModal";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    PENDING: "bg-yellow-100 text-yellow-800",
    ACTIVE: "bg-green-100 text-green-800",
    INACTIVE: "bg-gray-200 text-gray-800",
    REJECTED: "bg-red-100 text-red-800",
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
    className="flex justify-between items-center bg-white p-5 rounded-xl border shadow-sm hover:shadow-md transition cursor-pointer"
  >
    <div>
      <h3 className="font-semibold text-gray-900">{faculty.name}</h3>
      <p className="text-sm text-gray-600">{faculty.email}</p>
      <p className="text-xs text-gray-500 mt-1">Subjects: {faculty.subjects}</p>

      <div className="mt-2">
        <StatusBadge status={faculty.status} />
      </div>
    </div>

    <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
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
    <h2 className="text-lg font-bold mb-4 text-gray-800">{title}</h2>
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

  if (loading) return <div className="p-6">Loading faculty...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  const pending = faculty.filter((f) => f.status === "PENDING");
  const active = faculty.filter((f) => f.status === "ACTIVE");
  const inactive = faculty.filter((f) => f.status === "INACTIVE");

  const toast = (msg: string) => alert(msg); // simple toast

  return (
    <div className="p-8 max-w-6xl mx-auto bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold mb-10 text-gray-900">
        Admin Dashboard – Faculty Control
      </h1>

      {/* ===================== PENDING ===================== */}
      <Section title={`Pending Requests (${pending.length})`}>
        {pending.length === 0 && (
          <p className="text-sm text-gray-500">No pending faculty</p>
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
                  className="px-4 py-2 rounded-lg bg-green-600 text-white text-sm"
                >
                  Approve
                </button>
                <button
                  onClick={() => {
                    rejectFacultyByAdmin(f.id);
                    toast("Faculty rejected");
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
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
                  className="px-4 py-2 rounded-lg bg-yellow-500 text-white text-sm"
                >
                  Deactivate
                </button>
                <button
                  onClick={() => {
                    removeFaculty(f.id);
                    toast("Faculty deleted");
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
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
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm"
                >
                  Activate
                </button>
                <button
                  onClick={() => {
                    removeFaculty(f.id);
                    toast("Faculty deleted");
                  }}
                  className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm"
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
  );
};

export default AdminFacultyPage;

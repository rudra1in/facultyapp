import React, { useState } from "react";
import { useFaculty } from "../../hooks/useFaculty";
import { FacultyMember } from "../../types/faculty";
import FacultyDetailModal from "./FacultyDetailModal";

/* ================= STATUS BADGE ================= */
const StatusBadge = ({ status }: { status: string }) => {
  // Using theme-aware colors for badges
  const colors: Record<string, string> = {
    PENDING:
      "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-400 orange:bg-white/20 orange:text-[#7c2d12]",
    ACTIVE:
      "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-400 leaf:bg-white/20 leaf:text-[#064e3b]",
    INACTIVE: "bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300",
    REJECTED: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-400",
  };

  return (
    <span
      className={`px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-black ${colors[status]}`}
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
    className="flex flex-col md:flex-row justify-between items-start md:items-center 
               bg-[var(--bg-card)] p-5 rounded-2xl border border-[var(--border-main)] 
               shadow-sm hover:shadow-md transition-all cursor-pointer space-y-4 md:space-y-0"
  >
    <div className="flex-1">
      <h3 className="font-bold text-[var(--text-main)]">{faculty.name}</h3>
      <p className="text-sm text-[var(--text-muted)]">{faculty.email}</p>
      <p className="text-xs text-[var(--text-muted)] mt-1 font-medium">
        Subjects:{" "}
        <span className="text-[var(--text-main)] opacity-80">
          {faculty.subjects}
        </span>
      </p>

      <div className="mt-3">
        <StatusBadge status={faculty.status} />
      </div>
    </div>

    <div
      className="flex flex-wrap gap-2 w-full md:w-auto"
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
  <div className="mb-12">
    <h2 className="text-sm font-black uppercase tracking-[0.2em] mb-6 text-[var(--text-main)] flex items-center">
      <span className="w-1.5 h-4 bg-[var(--accent)] rounded-full mr-3"></span>
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
      <div className="p-8 min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] flex items-center justify-center">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-[var(--accent)] rounded-full animate-ping"></div>
          <span className="font-bold text-sm uppercase tracking-widest">
            Loading Roster...
          </span>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="p-6 text-red-600 bg-[var(--bg-main)] min-h-screen font-bold">
        Error: {error}
      </div>
    );

  const pending = faculty.filter((f) => f.status === "PENDING");
  const active = faculty.filter((f) => f.status === "ACTIVE");
  const inactive = faculty.filter((f) => f.status === "INACTIVE");

  const toast = (msg: string) => alert(msg); // replace with your toast lib if available

  return (
    <div className="min-h-screen bg-[var(--bg-main)] text-[var(--text-main)] transition-colors duration-300">
      <div className="p-8 max-w-6xl mx-auto">
        <div className="mb-12">
          <h1 className="text-4xl font-black tracking-tight text-[var(--text-main)]">
            Faculty Control <span className="opacity-50">🔐</span>
          </h1>
          <p className="text-[var(--text-muted)] mt-3 font-medium">
            Manage approvals, account status, and faculty credentials for the
            institution.
          </p>
        </div>

        {/* ===================== PENDING ===================== */}
        <Section title={`Pending Requests (${pending.length})`}>
          {pending.length === 0 && (
            <div className="p-12 text-center rounded-3xl border-2 border-dashed border-[var(--border-main)]">
              <p className="text-sm text-[var(--text-muted)] font-bold uppercase tracking-widest">
                No pending requests
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
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-green-600 hover:bg-green-700 text-white text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-green-500/20"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => {
                      rejectFacultyByAdmin(f.id);
                      toast("Faculty rejected");
                    }}
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all hover:scale-105 shadow-lg shadow-red-500/20"
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
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white text-xs font-black uppercase tracking-wider transition-all"
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
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl border-2 border-red-500 text-red-500 hover:bg-red-500 hover:text-white text-xs font-black uppercase tracking-wider transition-all"
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
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[var(--accent)] hover:opacity-90 text-white text-xs font-black uppercase tracking-wider transition-all shadow-lg shadow-indigo-500/20"
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
                    className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-black uppercase tracking-wider transition-all"
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

import { useEffect, useState } from "react";
import { facultyService } from "../services/faculty.service";
import { FacultyMember } from "../types/faculty";

export const useFaculty = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // =========================
  // FETCH ALL
  // =========================
  const fetchFaculty = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await facultyService.getAllFaculty();
      setFaculty(data);
    } catch {
      setError("Failed to fetch faculty");
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // ADMIN: APPROVE (PENDING → ACTIVE)
  // =========================
  const approveFacultyByAdmin = async (id: number) => {
    await facultyService.approveFaculty(id);

    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "active" } : f))
    );
  };

  // =========================
  // ADMIN: REJECT (PENDING → INACTIVE)
  // =========================
  const rejectFacultyByAdmin = async (id: number) => {
    await facultyService.rejectFaculty(id);

    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "inactive" } : f))
    );
  };

  // =========================
  // ACTIVATE (INACTIVE → ACTIVE)
  // =========================
  const activateFacultyByAdmin = async (id: number) => {
    await facultyService.activateFaculty(id);

    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "active" } : f))
    );
  };

  // =========================
  // DEACTIVATE (ACTIVE → INACTIVE)
  // =========================
  const deactivateFacultyByAdmin = async (id: number) => {
    await facultyService.deactivateFaculty(id);

    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "inactive" } : f))
    );
  };

  // =========================
  // HARD DELETE
  // =========================
  const removeFaculty = async (id: number) => {
    await facultyService.deleteFaculty(id);
    setFaculty((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return {
    faculty,
    loading,
    error,

    approveFacultyByAdmin,
    rejectFacultyByAdmin,
    activateFacultyByAdmin,
    deactivateFacultyByAdmin,
    removeFaculty,
  };
};

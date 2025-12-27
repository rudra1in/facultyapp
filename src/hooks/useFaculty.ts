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
  // SEARCH / FILTER
  // =========================
  const searchFacultyList = async (params: {
    q?: string;
    subject?: string;
    status?: "active" | "inactive" | "pending";
  }) => {
    setLoading(true);
    try {
      const data = await facultyService.searchFaculty(params);
      setFaculty(data);
    } finally {
      setLoading(false);
    }
  };

  // =========================
  // REGISTER (Faculty self-register)
  // =========================
  const createFaculty = async (data: FacultyMember) => {
    const created = await facultyService.createFaculty(data);
    setFaculty((prev) => [created, ...prev]);
  };

  // =========================
  // ADMIN APPROVAL
  // =========================
  const approveFacultyByAdmin = async (id: number) => {
    await facultyService.activateFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "active" } : f))
    );
  };

  // =========================
  // SOFT DELETE (Deactivate)
  // =========================
  const deactivateFacultyByAdmin = async (id: number) => {
    await facultyService.deactivateFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "inactive" } : f))
    );
  };

  const activateFacultyByAdmin = async (id: number) => {
    await facultyService.activateFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "active" } : f))
    );
  };

  // =========================
  // UPDATE
  // =========================
  const editFaculty = async (id: number, data: FacultyMember) => {
    const updated = await facultyService.updateFaculty(id, data);
    setFaculty((prev) => prev.map((f) => (f.id === id ? updated : f)));
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

    fetchFaculty,
    searchFacultyList,
    createFaculty,
    editFaculty,

    approveFacultyByAdmin,
    deactivateFacultyByAdmin,
    activateFacultyByAdmin,

    removeFaculty,
  };
};

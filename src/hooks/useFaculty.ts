import { useEffect, useState } from "react";
import { facultyService } from "../services/faculty.service";
import { FacultyMember } from "../types/faculty";

export const useFaculty = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const data = await facultyService.getAllFaculty();
      setFaculty(data);
    } catch {
      setError("Failed to fetch faculty");
    } finally {
      setLoading(false);
    }
  };

  const approveFacultyByAdmin = async (id: number) => {
    await facultyService.approveFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "ACTIVE" } : f))
    );
  };

  const rejectFacultyByAdmin = async (id: number) => {
    await facultyService.rejectFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "REJECTED" } : f))
    );
  };

  const deactivateFacultyByAdmin = async (id: number) => {
    await facultyService.deactivateFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "INACTIVE" } : f))
    );
  };

  const activateFacultyByAdmin = async (id: number) => {
    await facultyService.activateFaculty(id);
    setFaculty((prev) =>
      prev.map((f) => (f.id === id ? { ...f, status: "ACTIVE" } : f))
    );
  };

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
    deactivateFacultyByAdmin,
    activateFacultyByAdmin,
    removeFaculty,
  };
};

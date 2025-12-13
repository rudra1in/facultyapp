import { useEffect, useState } from "react";
import {
  getAllFaculty,
  addFaculty,
  updateFaculty,
  deleteFaculty,
} from "../services/faculty.service";
import { FacultyMember } from "../types/faculty";

export const useFaculty = () => {
  const [faculty, setFaculty] = useState<FacultyMember[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchFaculty = async () => {
    setLoading(true);
    try {
      const res = await getAllFaculty();
      setFaculty(res.data);
    } finally {
      setLoading(false);
    }
  };

  const createFaculty = async (data: FacultyMember) => {
    const res = await addFaculty(data);
    setFaculty((prev) => [res.data, ...prev]);
  };

  const editFaculty = async (id: number, data: FacultyMember) => {
    await updateFaculty(id, data);
    setFaculty((prev) => prev.map((f) => (f.id === id ? data : f)));
  };

  const removeFaculty = async (id: number) => {
    await deleteFaculty(id);
    setFaculty((prev) => prev.filter((f) => f.id !== id));
  };

  useEffect(() => {
    fetchFaculty();
  }, []);

  return {
    faculty,
    loading,
    createFaculty,
    editFaculty,
    removeFaculty,
  };
};

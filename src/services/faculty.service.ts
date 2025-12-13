import api from "../api/axios";
import { FacultyMember } from "../types/faculty";

/**
 * BACKEND MUST IMPLEMENT THESE ENDPOINTS
 */

// GET all faculty
export const getAllFaculty = () => api.get<FacultyMember[]>("/faculty");

// SEARCH + FILTER
export const searchFaculty = (params: {
  q?: string;
  subject?: string;
  status?: "active" | "inactive";
}) => api.get<FacultyMember[]>("/faculty/search", { params });

// ADD
export const addFaculty = (data: FacultyMember) => api.post("/faculty", data);

// UPDATE
export const updateFaculty = (id: number, data: FacultyMember) =>
  api.put(`/faculty/${id}`, data);

// DELETE
export const deleteFaculty = (id: number) => api.delete(`/faculty/${id}`);

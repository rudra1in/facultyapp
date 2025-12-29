import api from "../api/axios";

export const facultyService = {
  // =========================
  // ADMIN
  // =========================
  getAllFaculty: async () => {
    const res = await api.get("/admin/faculties");
    return res.data;
  },

  approveFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/approve`);
  },

  rejectFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/reject`);
  },

  activateFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/activate`);
  },

  deactivateFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/deactivate`);
  },

  deleteFaculty: async (id: number) => {
    await api.delete(`/admin/faculty/${id}`);
  },

  // =========================
  // FACULTY REGISTRATION
  // =========================
  registerFacultyMultipart: async (formData: FormData) => {
    const res = await api.post("/faculty/register", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  },
};

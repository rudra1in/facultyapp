import api from "../api/axios";

export const facultyService = {
  // =========================
  // ADMIN: FETCH ALL FACULTY
  // =========================
  getAllFaculty: async () => {
    const res = await api.get("/admin/faculties");
    return res.data;
  },

  // =========================
  // ADMIN: APPROVE
  // =========================
  approveFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/approve`);
  },

  // =========================
  // ADMIN: REJECT
  // =========================
  rejectFaculty: async (id: number) => {
    await api.put(`/admin/faculty/${id}/reject`);
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

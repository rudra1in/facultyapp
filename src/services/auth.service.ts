import api from "../api/axios";

/* ==============================
   TYPES
================================ */

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string | null;
  role: "ADMIN" | "FACULTY";
  status?: "PENDING" | "ACTIVE" | "INACTIVE" | "REJECTED";
  userId?: number;
}

/* ==============================
   AUTH SERVICE
================================ */

export const authService = {
  // LOGIN
  login: async (data: LoginRequest): Promise<LoginResponse> => {
    const res = await api.post("/auth/login", data);
    return res.data;
  },

  // FACULTY REGISTRATION
  registerFaculty: async (formData: FormData): Promise<{ message: string }> => {
    const res = await api.post("/faculty/register", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  },
};

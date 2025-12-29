import axios, { AxiosError } from "axios";
import { getToken, isTokenExpired, logout } from "../utils/auth";

// ==============================
// BASE API CONFIGURATION
// ==============================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";

// ==============================
// AXIOS INSTANCE
// ==============================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================

api.interceptors.request.use(
  (config) => {
    const token = getToken();

    // Attach token (except login/register)
    if (token && config.url !== "/auth/login") {
      if (isTokenExpired(token)) {
        console.warn("[AUTH] Token expired → auto logout");
        logout();
        return Promise.reject(new Error("Token expired"));
      }

      config.headers.Authorization = `Bearer ${token}`;
    }

    console.log(
      `[API REQUEST] ${config.method?.toUpperCase()} ${config.baseURL}${
        config.url
      }`
    );

    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

// ==============================
// RESPONSE INTERCEPTOR
// ==============================

api.interceptors.response.use(
  (response) => {
    console.log(`[API RESPONSE] ${response.status} ${response.config.url}`);
    return response;
  },
  (error: AxiosError) => {
    if (error.response) {
      console.error(
        `[API ERROR] ${error.response.status}`,
        error.response.data
      );

      if (error.response.status === 401) {
        console.warn("[AUTH] Unauthorized → auto logout");
        logout();
      }
    } else if (error.request) {
      console.error("[API ERROR] No response from server");
    } else {
      console.error("[API ERROR]", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

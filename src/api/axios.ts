import axios, { AxiosError } from "axios";

// ==============================
// BASE API CONFIGURATION
// ==============================

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

// ==============================
// AXIOS INSTANCE
// ==============================

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 15 seconds
  headers: {
    "Content-Type": "application/json",
  },
});

// ==============================
// REQUEST INTERCEPTOR
// ==============================

api.interceptors.request.use(
  (config) => {
    // 🔐 Future Auth Support
    // const token = localStorage.getItem("accessToken");
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }

    console.log(`[API REQUEST] ${config.method?.toUpperCase()} ${config.url}`);

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
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
    } else if (error.request) {
      console.error("[API ERROR] No response from server");
    } else {
      console.error("[API ERROR]", error.message);
    }

    return Promise.reject(error);
  }
);

export default api;

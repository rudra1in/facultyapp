import api from "../api/axios";

export const profileService = {
  getMyProfile: async () => {
    const res = await api.get("/auth/me");
    return res.data;
  },

  uploadProfilePhoto: async (file: File) => {
    const formData = new FormData();
    formData.append("file", file);

    await api.post("/auth/profile-photo", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

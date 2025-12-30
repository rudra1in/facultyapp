import api from "../api/axios";

export const facultyDirectoryService = {
  getDirectory: async () => {
    const res = await api.get("/faculty/directory");
    return res.data;
  },
};

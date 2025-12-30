import api from "../api/axios";

export const conversationService = {
  findOrCreate: async (otherUserId: number): Promise<number> => {
    const res = await api.post(`/conversations/${otherUserId}`);
    return res.data; // conversationId
  },
};

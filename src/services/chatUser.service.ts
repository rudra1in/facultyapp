// services/chatUser.service.ts
import api from "../api/axios";

export interface ChatUser {
  id: number;
  name: string;
  role: "ADMIN" | "FACULTY";
}

export const chatUserService = {
  getChatUsers: async (): Promise<ChatUser[]> => {
    const res = await api.get("/users/chat-users");
    return res.data;
  },
};

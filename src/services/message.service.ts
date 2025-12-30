import api from "../api/axios";

export interface MessageResponse {
  id: number;
  senderId: number;
  senderName: string;
  content: string;
  edited: boolean;
  createdAt: string;
}

export const messageService = {
  getMessages: async (conversationId: number): Promise<MessageResponse[]> => {
    const res = await api.get(`/messages/${conversationId}`);
    return res.data;
  },

  sendMessage: async (conversationId: number, content: string) => {
    const res = await api.post("/messages", {
      conversationId,
      content,
    });
    return res.data;
  },

  editMessage: async (messageId: number, content: string) => {
    const res = await api.put(`/messages/${messageId}`, { content });
    return res.data;
  },

  deleteMessage: async (messageId: number) => {
    await api.delete(`/messages/${messageId}`);
  },
};

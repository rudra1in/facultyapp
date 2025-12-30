import api from "../api/axios";

export interface Notification {
  id: number;
  category: string;
  type: string;
  message: string;
  context?: string;
  read: boolean;
  muted: boolean;
  createdAt: string;
}

export const notificationService = {
  // 🔹 GET my notifications
  getMyNotifications: async (): Promise<Notification[]> => {
    const res = await api.get("/notifications");
    return res.data;
  },

  // 🔹 MARK AS READ
  markAsRead: async (id: number) => {
    await api.patch(`/notifications/${id}/read`);
  },

  // 🔹 DELETE
  deleteNotification: async (id: number) => {
    await api.delete(`/notifications/${id}`);
  },
};

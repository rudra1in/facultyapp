import api from "../api/axios";

export const calendarService = {
  getUpcomingEvents: async () => {
    const res = await api.get("/calendar/upcoming");
    return res.data;
  },

  createEvent: async (event: any) => {
    const res = await api.post("/calendar/events", event); // ✅ FIX
    return res.data;
  },

  deleteEvent: async (id: number) => {
    await api.delete(`/calendar/events/${id}`); // ✅ FIX
  },
};

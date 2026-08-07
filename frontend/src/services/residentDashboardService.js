import api from "./api";

const residentDashboardService = {
  // Household + meter info, current billing cycle summary, quick stats
  getOverview: async () => {
    const response = await api.get("/api/resident-dashboard/overview");
    return response.data;
  },

  // Last 30 days of consumption
  getDailyTrend: async () => {
    const response = await api.get(
      "/api/resident-dashboard/consumption/daily"
    );
    return response.data;
  },

  // Last 12 months of consumption
  getMonthlyTrend: async () => {
    const response = await api.get(
      "/api/resident-dashboard/consumption/monthly"
    );
    return response.data;
  },

  // Household usage vs. building/apartment average for the current cycle
  getComparison: async () => {
    const response = await api.get("/api/resident-dashboard/comparison");
    return response.data;
  },

  // Household's usage alerts (threshold breach / anomaly leak), newest first
  getNotifications: async () => {
    const response = await api.get("/api/resident-dashboard/notifications");
    return response.data;
  },

  // Count of unread notifications, for the bell badge
  getUnreadNotificationCount: async () => {
    const response = await api.get(
      "/api/resident-dashboard/notifications/unread-count"
    );
    return response.data;
  },

  // Mark a single notification as read
  markNotificationRead: async (alertId) => {
    const response = await api.post(
      `/api/resident-dashboard/notifications/${alertId}/read`
    );
    return response.data;
  },

  // Mark every notification as read
  markAllNotificationsRead: async () => {
    await api.post("/api/resident-dashboard/notifications/read-all");
  },
};

export default residentDashboardService;
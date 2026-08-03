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
};

export default residentDashboardService;
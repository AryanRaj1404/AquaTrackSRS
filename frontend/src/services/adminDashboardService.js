import api from "./api";

const adminDashboardService = {
  getAdminAlerts: async () => {
    const response = await api.get("/api/admin/dashboard/alerts");
    return response.data;
  },

  getAdminAlertSummary: async () => {
    const response = await api.get("/api/admin/dashboard/alerts/summary");
    return response.data;
  },

  getMonthlyConsumption: async () => {
    const response = await api.get("/api/admin/dashboard/charts/monthly-consumption");
    return response.data;
  },

  getApartmentConsumption: async () => {
    const response = await api.get("/api/admin/dashboard/charts/apartment-consumption");
    return response.data;
  },

  getUsageStatus: async () => {
    const response = await api.get("/api/admin/dashboard/charts/usage-status");
    return response.data;
  },

  getConsumptionTrend(mode, range) {
    return api
        .get("/api/admin/dashboard/charts/consumption", {
            params: {
                mode,
                range,
            },
        })
        .then((res) => res.data);
}
};

export default adminDashboardService;
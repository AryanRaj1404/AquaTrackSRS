import api from "./api";

const dashboardService = {
    getDashboard: async () => {
        const response =
            await api.get("/api/dashboard/admin");

        return response.data;
    },

    getMonthlyConsumption: async () => {
        const response =
            await api.get("/api/dashboard/analytics/monthly-consumption");

        return response.data;
    },

    getTopHouseholds: async () => {
        const response =
            await api.get("/api/dashboard/analytics/top-households");

        return response.data;
    },
};

export default dashboardService;
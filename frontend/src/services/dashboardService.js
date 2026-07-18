import api from "./api";

const dashboardService = {

    getDashboard: async () => {

        const response =
            await api.get("/api/dashboard/admin");
            
        return response.data;
    }

};

export default dashboardService;
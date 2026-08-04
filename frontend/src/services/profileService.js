import api from "./api";

const profileService = {

    async getProfile() {
        const response = await api.get("/auth/me");
        return response.data;
    },

    async updateProfile(profile) {
        const response = await api.put(
            "/auth/profile",
            profile
        );

        return response.data;
    },

};

export default profileService;
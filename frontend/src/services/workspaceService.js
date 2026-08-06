import api from "./api";

const ALL_WORKSPACE = {
    id: null,
    name: "All Apartments",
};

const workspaceService = {

    async getWorkspaces() {

        const response = await api.get("/apartments");

        /*
         * Supports both:
         * 1. Spring Page<T>
         * 2. Normal List<T>
         */

        const apartments =
            response.data.content ?? response.data ?? [];

        return [
            ALL_WORKSPACE,
            ...apartments.map((apartment) => ({
                id: apartment.id,
                name: apartment.name,
                apartment,
            })),
        ];
    },

    getDefaultWorkspace() {

        return ALL_WORKSPACE;

    },

};

export default workspaceService;
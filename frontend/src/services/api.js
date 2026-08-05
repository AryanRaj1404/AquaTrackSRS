import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080",
});

api.interceptors.request.use(

    (config) => {

        const token =
            localStorage.getItem("token");

        if (token) {

            config.headers.Authorization =
                `Bearer ${token}`;

        }

        try {

            const workspace =
                JSON.parse(
                    localStorage.getItem(
                        "aquatrack-workspace"
                    )
                );

            /*
             * Workspace Header
             *
             * Sprint 1:
             * Header is sent automatically.
             *
             * Sprint 2:
             * Backend will start reading it.
             */

            if (
                workspace &&
                workspace.id !== null &&
                workspace.id !== undefined
            ) {

                config.headers[
                    "X-Workspace-Id"
                ] = workspace.id;

            }

        } catch {

            // Ignore malformed localStorage

        }

        return config;

    },

    (error) => Promise.reject(error)

);

api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (error.response?.status === 401) {

            localStorage.removeItem("token");

            localStorage.removeItem(
                "aquatrack-workspace"
            );

            window.location.href = "/login";

        }

        return Promise.reject(error);

    }

);

export default api;
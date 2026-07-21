import axios from "axios";
import toast from "react-hot-toast";

const api = axios.create({
  baseURL: "http://localhost:8080",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT to every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Handle API errors
api.interceptors.response.use(
  (response) => response,
  (error) => {

    // Only logout if authentication itself is invalid
    if (
      error.response?.status === 401 &&
      error.config?.url === "/auth/me"
    ) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("username");
      localStorage.removeItem("user");

      toast.error("Your session has expired. Please login again.");

      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
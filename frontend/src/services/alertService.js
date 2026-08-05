import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getRecentAlerts = async () => {
  const response = await axios.get(
    `${API_URL}/alerts/recent`,
    getAuthConfig()
  );
  return response.data;
};

export const acknowledgeAlert = async (alertId) => {
  const response = await axios.post(
    `${API_URL}/alerts/${alertId}/acknowledge`,
    {},
    getAuthConfig()
  );

  return response.data;
};
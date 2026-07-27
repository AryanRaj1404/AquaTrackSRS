import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

export const getHouseholdAlerts = async (householdId) => {
  const response = await axios.get(
    `${API_URL}/households/${householdId}/alerts`,
    getAuthConfig()
  );
  return response.data;
};

export const acknowledgeAlert = async (householdId, alertId) => {
  const response = await axios.post(
    `${API_URL}/households/${householdId}/alerts/${alertId}/acknowledge`,
    {},
    getAuthConfig()
  );
  return response.data;
};
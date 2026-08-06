import axios from "axios";

const API_URL = "http://localhost:8080";

const getAuthConfig = () => ({
  headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`,
  },
});

/* ===========================
   Dashboard (Top 5 Alerts)
=========================== */

export const getRecentAlerts = async () => {
  const response = await axios.get(
    `${API_URL}/alerts/recent`,
    getAuthConfig()
  );

  return response.data;
};

/* ===========================
   Alert Management Page
=========================== */

export const getAllAlerts = async (
  page = 0,
  size = 10,
  status = "ALL"
) => {
  const response = await axios.get(
    `${API_URL}/alerts`,
    {
      ...getAuthConfig(),
      params: {
        page,
        size,
        status,
      },
    }
  );

  return response.data;
};

export const getAlertSummary = async () => {
  const response = await axios.get(
    `${API_URL}/api/admin/dashboard/alerts/summary`,
    getAuthConfig()
  );

  return response.data;
};

/* ===========================
   Acknowledge Alert
=========================== */

export const acknowledgeAlert = async (alertId) => {
  const response = await axios.post(
    `${API_URL}/alerts/${alertId}/acknowledge`,
    {},
    getAuthConfig()
  );

  return response.data;
};

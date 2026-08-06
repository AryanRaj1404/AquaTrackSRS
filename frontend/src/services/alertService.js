import api from "./api";

/* ===========================
   Dashboard (Top 5 Alerts)
=========================== */

export const getRecentAlerts = async () => {
  const response = await api.get("/alerts/recent");
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
  const response = await api.get("/alerts", {
    params: {
      page,
      size,
      status,
    },
  });

  return response.data;
};

export const getAlertSummary = async () => {
  const response = await api.get("/api/admin/dashboard/alerts/summary");
  return response.data;
};

/* ===========================
   Acknowledge Alert
=========================== */

export const acknowledgeAlert = async (alertId) => {
  const response = await api.post(
    `/alerts/${alertId}/acknowledge`
  );

  return response.data;
};
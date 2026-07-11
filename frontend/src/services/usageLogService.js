import api from "./api";

export async function getUsageLogs() {
  const response = await api.get("/usage-logs");
  return response.data;
}

export async function createUsageLog(usageLogData) {
  const response = await api.post("/usage-logs", usageLogData);
  return response.data;
}

export async function updateUsageLog(id, usageLogData) {
  const response = await api.put(`/usage-logs/${id}`, usageLogData);
  return response.data;
}

export async function deleteUsageLog(id) {
  await api.delete(`/usage-logs/${id}`);
}

export async function uploadCsv(file) {
  const formData = new FormData();

  formData.append("file", file);

  const response = await api.post(
    "/usage-logs/upload-csv",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
}
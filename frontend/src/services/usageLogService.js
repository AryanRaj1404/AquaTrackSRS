import api from "./api";

export async function getUsageLogs(
    page = 0,
    size = 20,
    keyword = ""
) {

    const response = await api.get(
        "/usage-logs",
        {
            params: {
                page,
                size,
                keyword,
            },
        }
    );

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

export const uploadCsv = async (
    file,
    billingCycleId
) => {

    const formData = new FormData();

    formData.append("file", file);

    formData.append(
        "billingCycleId",
        billingCycleId
    );

    const response = await api.post(

        "/usage-logs/upload-csv",

        formData,

        {
            headers: {
                "Content-Type":
                    "multipart/form-data",
            },
        }

    );

    return response.data;

};

export async function getUsageLogsByHousehold(householdId) {
  const response = await api.get(`/usage-logs/household/${householdId}`);
  return response.data;
}
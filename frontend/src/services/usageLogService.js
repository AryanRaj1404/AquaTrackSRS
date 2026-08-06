import api from "./api";

export async function getUsageLogs(
    page = 0,
    size = 20,
    keyword = "",
    workspaceId = null
) {
    const response = await api.get("/usage-logs", {
        params: {
            page,
            size,
            keyword,
            workspaceId,
        },
    });

    return response.data;
}

export async function createUsageLog(
    usageLogData,
    workspaceId
) {
    const response = await api.post(
        "/usage-logs",
        usageLogData,
        {
            params: {
                workspaceId,
            },
        }
    );

    return response.data;
}

export async function updateUsageLog(
    id,
    usageLogData,
    workspaceId
) {
    const response = await api.put(
        `/usage-logs/${id}`,
        usageLogData,
        {
            params: {
                workspaceId,
            },
        }
    );

    return response.data;
}

export async function deleteUsageLog(
    id,
    workspaceId
) {
    await api.delete(`/usage-logs/${id}`, {
        params: {
            workspaceId,
        },
    });
}

export const uploadCsv = async (
    file,
    billingCycleId,
    workspaceId
) => {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("billingCycleId", billingCycleId);

    const response = await api.post(
        "/usage-logs/upload-csv",
        formData,
        {
            params: {
                workspaceId,
            },
            headers: {
                "Content-Type": "multipart/form-data",
            },
        }
    );

    return response.data;
};

export async function getUsageLogsByHousehold(
    householdId,
    workspaceId
) {
    const response = await api.get(
        `/usage-logs/household/${householdId}`,
        {
            params: {
                workspaceId,
            },
        }
    );

    return response.data;
}
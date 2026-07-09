import api from "./api";

export async function getHouseholds() {
    const response = await api.get("/households");
    return response.data;
}

export async function createHousehold(householdData) {
    const response = await api.post("/households", householdData);
    return response.data;
}
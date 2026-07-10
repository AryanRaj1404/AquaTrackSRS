import api from "./api";

export async function getHouseholds() {
  const response = await api.get("/households");
  return response.data;
}

export async function createHousehold(householdData) {
  const response = await api.post("/households", householdData);
  return response.data;
}

export async function assignResident(householdId, userId) {
  const response = await api.put(
    `/households/${householdId}/residents/${userId}`
  );
  return response.data;
}

export async function removeResident(householdId, userId) {
  const response = await api.delete(
    `/households/${householdId}/residents/${userId}`
  );
  return response.data;
}

export async function getUnassignedResidents() {
  const response = await api.get("/households/unassigned-residents");
  return response.data;
}
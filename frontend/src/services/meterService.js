import api from "./api";

export async function getMeters() {
  const response = await api.get("/meters");
  return response.data;
}

export async function createMeter(meterData) {
  const response = await api.post("/meters", meterData);
  return response.data;
}

export async function updateMeter(id, meterData) {
  const response = await api.put(`/meters/${id}`, meterData);
  return response.data;
}

export async function deleteMeter(id) {
  await api.delete(`/meters/${id}`);
}

export async function getMetersByHousehold(householdId) {
  const response = await api.get(
    `/meters/household/${householdId}`
  );

  return response.data;
}
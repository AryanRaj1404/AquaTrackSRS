import api from "./api";

export async function getHouseholds(page = 0, size = 20) {

  const response = await api.get("/households", {
    params: {
      page,
      size,
    },
  });

  return response.data;
}

export const getHouseholdsForDropdown = async () => {

    const response = await api.get(
        "/households/dropdown"
    );

    return response.data;

};

export async function getHouseholdsByApartmentPage(
    apartmentId,
    page,
    size
) {

    const response = await api.get(
        "/households/filter",
        {
            params: {
                apartmentId,
                page,
                size,
            },
        }
    );

    return response.data;

}

export async function searchHouseholds(keyword, page, size) {

    const response = await api.get(
        "/households/search",
        {
            params: {
                keyword,
                page,
                size,
            },
        }
    );

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

export const getHouseholdsByApartment = async (apartmentId) => {

  const response = await api.get(
    `/households/apartment/${apartmentId}`
  );

  return response.data;
};
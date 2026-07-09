import api from "./api";

export async function getApartments() {
    const response = await api.get("/apartments");
    return response.data;
}

export async function createApartment(apartmentData) {
    const response = await api.post("/apartments", apartmentData);
    return response.data;
}
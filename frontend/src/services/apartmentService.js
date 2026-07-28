import api from "./api";

export async function getApartments(page = 0, size = 20) {

    const response = await api.get("/apartments", {

        params: {

            page,
            size,

        },

    });

    return response.data;

}

export async function searchApartments(
    keyword,
    page = 0,
    size = 20
) {

    const response = await api.get("/apartments/search", {

        params: {

            keyword,
            page,
            size,

        },

    });

    return response.data;

}

export async function createApartment(apartmentData) {
  const response = await api.post("/apartments", apartmentData);
  return response.data;
}
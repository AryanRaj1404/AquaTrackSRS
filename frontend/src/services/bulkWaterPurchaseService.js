import api from "./api";

export const getPurchases = async () => {

    const response =
        await api.get(
            "/bulk-water-purchases"
        );

    return response.data;
};

export const getPurchaseById = async (id) => {

    const response =
        await api.get(
            `/bulk-water-purchases/${id}`
        );

    return response.data;
};

export const createPurchase = async (purchase) => {

    const response =
        await api.post(
            "/bulk-water-purchases",
            purchase
        );

    return response.data;
};

export const updatePurchase = async (
    id,
    purchase
) => {

    const response =
        await api.put(
            `/bulk-water-purchases/${id}`,
            purchase
        );

    return response.data;
};

export const deletePurchase = async (id) => {

    const response =
        await api.delete(
            `/bulk-water-purchases/${id}`
        );

    return response.data;
};
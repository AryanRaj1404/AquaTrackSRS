import api from "./api";

/* ===========================
   Billing Cycles
=========================== */

export const getBillingCycles = async () => {

    const response = await api.get(
        "/billing-cycles"
    );

    return response.data;

};

export const createBillingCycle = async (
    billingCycle
) => {

    const response = await api.post(
        "/billing-cycles",
        billingCycle
    );

    return response.data;

};

export const updateBillingCycle = async (
    id,
    billingCycle
) => {

    const response = await api.put(
        `/billing-cycles/${id}`,
        billingCycle
    );

    return response.data;

};

export const deleteBillingCycle = async (
    id
) => {

    const response = await api.delete(
        `/billing-cycles/${id}`
    );

    return response.data;

};
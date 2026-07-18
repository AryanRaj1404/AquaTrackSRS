import api from "./api";

export const getInvoices = async () => {

    const response = await api.get("/api/invoices");

    return response.data;
};

export const getInvoiceById = async (invoiceId) => {

    const response = await api.get(
        `/api/invoices/${invoiceId}`
    );

    return response.data;
};

export const getInvoicesByBillingCycle = async (
    billingCycleId
) => {

    const response = await api.get(
        `/api/invoices/billing-cycle/${billingCycleId}`
    );

    return response.data;
};

export const getInvoicesByHousehold = async (
    householdId
) => {

    const response = await api.get(
        `/api/invoices/household/${householdId}`
    );

    return response.data;
};

export const generateInvoices = async (
    billingCycleId
) => {

    const response = await api.post(
        `/api/invoices/generate/${billingCycleId}`
    );

    return response.data;
};

export const markInvoicePaid = async (
    invoiceId
) => {

    const response = await api.patch(
        `/api/invoices/${invoiceId}/paid`
    );

    return response.data;
};

export const emailInvoice = async (
    invoiceId
) => {

    const response = await api.post(
        `/api/invoices/${invoiceId}/email`
    );

    return response.data;
};

export const emailBillingCycleInvoices = async (
    billingCycleId
) => {

    const response = await api.post(
        `/api/invoices/billing-cycle/${billingCycleId}/email`
    );

    return response.data;
};

export const downloadInvoicePdf = async (
    invoiceId
) => {

    return await api.get(
        `/api/invoices/${invoiceId}/pdf`,
        {
            responseType: "blob",
        }
    );

};
import axios from "axios";

const API_URL = "http://localhost:8080/tariff-plans";

const getAuthConfig = () => {
  const token = localStorage.getItem("token");

  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

export const getTariffPlans = async () => {
  const response = await axios.get(API_URL, getAuthConfig());
  return response.data;
};

export const createTariffPlan = async (tariffPlan) => {
  const response = await axios.post(
    API_URL,
    tariffPlan,
    getAuthConfig()
  );

  return response.data;
};

export const updateTariffPlan = async (id, tariffPlan) => {
  const response = await axios.put(
    `${API_URL}/${id}`,
    tariffPlan,
    getAuthConfig()
  );

  return response.data;
};

export const deleteTariffPlan = async (id) => {
  await axios.delete(
    `${API_URL}/${id}`,
    getAuthConfig()
  );
};
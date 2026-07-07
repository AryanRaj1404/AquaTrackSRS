const API_BASE_URL = "http://localhost:8081/api";

export async function getApartments() {
  const response = await fetch(`${API_BASE_URL}/apartments`);

  if (!response.ok) {
    throw new Error("Failed to fetch apartments.");
  }

  return response.json();
}

export async function createApartment(apartmentData) {
  const response = await fetch(`${API_BASE_URL}/apartments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(apartmentData),
  });

  if (!response.ok) {
    throw new Error("Failed to create apartment.");
  }

  return response.json();
}
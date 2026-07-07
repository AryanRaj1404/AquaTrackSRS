const API_BASE_URL = "http://localhost:8081/api";

export async function getHouseholds() {
  const response = await fetch(`${API_BASE_URL}/households`);

  if (!response.ok) {
    throw new Error("Failed to fetch households.");
  }

  return response.json();
}

export async function createHousehold(householdData) {
  const response = await fetch(`${API_BASE_URL}/households`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(householdData),
  });

  if (!response.ok) {
    throw new Error("Failed to create household.");
  }

  return response.json();
}
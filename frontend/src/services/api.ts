// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8080/api",
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const token = JSON.parse(storedUser)?.token;
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const fetchPendingApprovals = async (managerId: string) => {
  try {
    const response = await api.get(`/manager/${managerId}/pending-approvals`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending-approvals:", error);
    throw new Error("Failed to load pending-approvals");
  }
};

export const getAllUsers = async () => {
  try {
    const response = await api.get(`/users`);
    return response.data;
  } catch (error) {
    console.error("Error fetching pending-approvals:", error);
    throw new Error("Failed to load pending-approvals");
  }
};

// Fetch all bookings method
export const fetchAllBookings = async () => {
  try {
    const response = await api.get("/bookings");
    return response.data;
  } catch (error) {
    console.error("Error fetching bookings:", error);
    throw new Error("Failed to load bookings");
  }
};

export const checkIfEmployeeExists = async (
  email: string
): Promise<boolean> => {
  try {
    const response = await fetch(
      `https://w3-unified-profile-api.ibm.com/v3/profiles/${email}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          // Add auth header if needed
          // "Authorization": `Bearer ${yourToken}`,
        },
      }
    );

    if (response.status === 200) {
      const data = await response.json();
      return data; // or check for another reliable key like `employeeType` or `id`
    } else if (response.status === 404) {
      return false;
    } else {
      console.error("Unexpected response status:", response.status);
      return false;
    }
  } catch (error) {
    console.error("Error checking employee existence:", error);
    return false;
  }
};

export default api;

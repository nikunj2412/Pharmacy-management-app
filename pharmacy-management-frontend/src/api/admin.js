import axios from "axios";

const API_BASE_URL = "https://pharmacy-management-app.onrender.com/v1/admin"; // Replace with your backend API URL

// Admin login
export const loginAdmin = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/login`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to login");
  }
};

// Create a new admin
export const createAdmin = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create admin");
  }
};

// Fetch all users

export const getAllUsers = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllUsers`);
    console.log("Users Response:", response.data); // Debugging
    return response.data; // Adjust based on actual structure
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch users");
  }
};

export const getAllSales = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllSales`);
    console.log("Sales Response:", response.data); // Debugging
    return response.data; // Adjust based on actual structure
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sales");
  }
};

// Fetch all medicines
export const getAllMedicines = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getAllMedicine`);
    console.log("Medicines Response:", response.data); // Debugging
    return response.data; // Adjust based on actual structure
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch medicines");
  }
};

// Refresh tokens
export const refreshTokens = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/refresh-tokens`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to refresh tokens");
  }
};

// Logout admin
export const logoutAdmin = async (refreshToken) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/logout`, {
      refreshToken,
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to logout");
  }
};

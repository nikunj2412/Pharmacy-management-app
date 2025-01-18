import axios from "axios";

const API_BASE_URL = "https://pharmacy-management-app.onrender.com/v1/admin"; // Replace with your backend API URL

// Create a new medicine
export const createMedicine = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createMedicine`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create medicine");
  }
};

// Get medicine by ID
export const getMedicineById = async (medicineId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getMedicine/${medicineId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch medicine details");
  }
};

// Update medicine by ID
export const updateMedicine = async (medicineId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateMedicine/${medicineId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update medicine");
  }
};

// Delete medicine by ID
export const deleteMedicine = async (medicineId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteMedicine/${medicineId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete medicine");
  }
};

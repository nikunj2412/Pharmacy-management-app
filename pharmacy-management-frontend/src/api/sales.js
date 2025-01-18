import axios from "axios";

const API_BASE_URL = "http://localhost:3333/v1/admin"; // Replace with your backend API URL

// Create a new sales record
export const createSales = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createSales`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create sales record");
  }
};

// Get sales records by user ID
export const getSalesByUserId = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getSalesByUserId/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sales records");
  }
};

export const getSalesId = async (salesId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getSales/${salesId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch sales records");
  }
};

export const updateSales = async (salesId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateSales/${salesId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update sales details");
  }
};

// Delete a sales record by aID
export const deleteSalesById = async (salesId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteSalesById/${salesId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete sales record");
  }
};

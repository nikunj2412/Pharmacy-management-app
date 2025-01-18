import axios from "axios";

const API_BASE_URL = "http://localhost:3333/v1/admin"; // Replace with your backend API URL

// Create a new user
export const createUser = async (data) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/createUser`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to create user");
  }
};

// Get user details by user ID
export const getUserById = async (userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/getUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to fetch user details");
  }
};

// Update user details by user ID
export const updateUser = async (userId, data) => {
  try {
    const response = await axios.put(`${API_BASE_URL}/updateUser/${userId}`, data);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to update user details");
  }
};

// Delete a user by user ID
export const deleteUserById = async (userId) => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/deleteUser/${userId}`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || "Failed to delete user");
  }
};

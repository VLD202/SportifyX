// src/config/api.js

// Backend ka address
export const API_URL = 'http://localhost:5000';

// Simple fetch function - isko use karke API call kar sakte ho
export const fetchFromAPI = async (endpoint) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`);
    
    if (!response.ok) {
      throw new Error('API call failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};

// POST request ke liye
export const postToAPI = async (endpoint, body) => {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body),
    });
    
    if (!response.ok) {
      throw new Error('API call failed');
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error posting data:', error);
    throw error;
  }
};
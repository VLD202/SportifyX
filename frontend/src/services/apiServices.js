import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Request interceptor
apiClient.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method.toUpperCase()} request to ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
apiClient.interceptors.response.use(
  (response) => {
    return response.data;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const apiService = {
  // Match endpoints
  getLiveMatches: async () => {
    return await apiClient.get('/matches/live');
  },

  getStoredMatches: async () => {
    return await apiClient.get('/matches/stored');
  },

  getMatchById: async (matchId) => {
    return await apiClient.get(`/matches/${matchId}`);
  },

  getMatchStats: async (matchId) => {
    return await apiClient.get(`/matches/${matchId}/stats`);
  },

  getMatchEvents: async (matchId) => {
    return await apiClient.get(`/matches/${matchId}/events`);
  },

  // Player endpoints
  getPlayerInfo: async (playerId) => {
    return await apiClient.get(`/players/${playerId}`);
  },

  getPlayerStats: async (playerId, matchId = null) => {
    const params = matchId ? { matchId } : {};
    return await apiClient.get(`/players/${playerId}/stats`, { params });
  },

  // Health check
  healthCheck: async () => {
    return await axios.get(`${API_URL.replace('/api', '')}/health`);
  }
};

export default apiService;
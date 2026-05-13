import axios from 'axios';

// In production, we use a relative path since backend serves frontend
// In development, we use the full localhost URL
const isProduction = import.meta.env.MODE === 'production';
const baseURL = isProduction ? '/api' : (import.meta.env.VITE_API_URL || 'http://localhost:5000/api');

const api = axios.create({
  baseURL: baseURL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

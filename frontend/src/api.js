import axios from 'axios';

const configuredUrl = import.meta.env.VITE_API_URL?.trim();
// Local development uses Vite's /api proxy; production should set VITE_API_URL.
const API_BASE_URL = (configuredUrl || '/api').replace(/\/$/, '');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && localStorage.getItem('token')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.dispatchEvent(new Event('otd:session-expired'));
    }
    return Promise.reject(error);
  }
);

export const getApiErrorMessage = (error, fallback = 'Something went wrong. Please try again.') => {
  if (!error?.response) {
    return 'The OTD service is unavailable. Check your connection and try again.';
  }
  return error.response.data?.message || fallback;
};

export default api;

import axios from 'axios';
import { useAuthStore } from '../store/authStore';

// API Configuration
export const API_BASE_URL = 'http://localhost:3000';

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/orders`,
    GET_ALL: `${API_BASE_URL}/api/orders`,
    UPDATE: `${API_BASE_URL}/api/orders/:id`,
  },
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/api/products`,
  }
};

// Interceptor ל-axios שמבצע logout אוטומטי ב-401
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error);
  }
);

export default axios; 
import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS } from '../config/api';

const useAuthStore = create((set, get) => ({
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: !!localStorage.getItem('token'),

  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password: '***' });
      console.log('Login URL:', API_ENDPOINTS.AUTH.LOGIN);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      console.log('Login response:', response.data);
      const { token, user } = response.data;
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
      await get().getProfile();
      return true;
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      return false;
    }
  },

  register: async (name, email, password) => {
    try {
      console.log('Attempting registration with:', { name, email, password: '***' });
      console.log('Register URL:', API_ENDPOINTS.AUTH.REGISTER);
      
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      });
      
      console.log('Registration response:', response.data);
      return true;
    } catch (error) {
      console.error('Registration error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        config: error.config
      });
      return false;
    }
  },

  updateUser: (updatedUser) => {
    set((state) => ({
      user: { ...state.user, ...updatedUser }
    }));
  },

  getProfile: async () => {
    try {
      const token = get().token || localStorage.getItem('token');
      if (!token) return;
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.data && response.data.user) {
        set({ user: response.data.user });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  },

  logout: () => {
    localStorage.removeItem('token');
    set({ user: null, token: null, isAuthenticated: false });
  }
}));

export { useAuthStore }; 
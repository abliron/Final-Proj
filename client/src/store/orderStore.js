import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const useOrderStore = create((set, get) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.get(API_ENDPOINTS.ORDERS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      set({ orders: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching orders:', error);
      set({ error: 'שגיאה בטעינת ההזמנות', loading: false });
    }
  },

  createOrder: async (orderData) => {
    try {
      set({ loading: true, error: null });
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.ORDERS.CREATE, orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { orders } = get();
      set({ orders: [...orders, response.data], loading: false });
      return { success: true, order: response.data };
    } catch (error) {
      console.error('Error creating order:', error);
      set({ error: 'שגיאה ביצירת הזמנה', loading: false });
      return { success: false, message: error.response?.data?.message || 'שגיאה ביצירת הזמנה' };
    }
  },

  updateOrderStatus: async (id, status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/orders/${id}`, { status }, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { orders } = get();
      const updatedOrders = orders.map(order => 
        order._id === id ? response.data : order
      );
      set({ orders: updatedOrders });
      return { success: true };
    } catch (error) {
      console.error('Error updating order:', error);
      return { success: false, message: error.response?.data?.message || 'שגיאה בעדכון הזמנה' };
    }
  },

  deleteOrder: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/orders/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { orders } = get();
      const filteredOrders = orders.filter(order => order._id !== id);
      set({ orders: filteredOrders });
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false, message: error.response?.data?.message || 'שגיאה במחיקת הזמנה' };
    }
  },

  clearError: () => {
    set({ error: null });
  }
}));

export { useOrderStore }; 
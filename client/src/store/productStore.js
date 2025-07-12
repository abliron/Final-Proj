import { create } from 'zustand';
import axios from 'axios';
import { API_ENDPOINTS, API_BASE_URL } from '../config/api';

const useProductStore = create((set, get) => ({
  products: [],
  loading: false,
  error: null,
  selectedProduct: null,
  showProductModal: false,

  fetchProducts: async () => {
    try {
      set({ loading: true, error: null });
      const response = await axios.get(API_ENDPOINTS.PRODUCTS.GET_ALL);
      set({ products: response.data, loading: false });
    } catch (error) {
      console.error('Error fetching products:', error);
      set({ error: 'שגיאה בטעינת המוצרים', loading: false });
    }
  },

  setSelectedProduct: (product) => {
    set({ selectedProduct: product, showProductModal: true });
  },

  closeProductModal: () => {
    set({ showProductModal: false, selectedProduct: null });
  },

  addReview: async (productId, reviewData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(`${API_BASE_URL}/api/products/${productId}/reviews`, reviewData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Update the product in the store with the new review
      const { products } = get();
      const updatedProducts = products.map(product => 
        product._id === productId 
          ? { ...product, reviews: [...(product.reviews || []), response.data] }
          : product
      );
      set({ products: updatedProducts });
      
      return true;
    } catch (error) {
      console.error('Error adding review:', error);
      return false;
    }
  },

  createProduct: async (productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(API_ENDPOINTS.PRODUCTS.GET_ALL, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { products } = get();
      set({ products: [...products, response.data] });
      return true;
    } catch (error) {
      console.error('Error creating product:', error);
      return false;
    }
  },

  updateProduct: async (id, productData) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`${API_BASE_URL}/api/products/${id}`, productData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { products } = get();
      const updatedProducts = products.map(product => 
        product._id === id ? response.data : product
      );
      set({ products: updatedProducts });
      return true;
    } catch (error) {
      console.error('Error updating product:', error);
      return false;
    }
  },

  deleteProduct: async (id) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`${API_BASE_URL}/api/products/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const { products } = get();
      const filteredProducts = products.filter(product => product._id !== id);
      set({ products: filteredProducts });
      return true;
    } catch (error) {
      console.error('Error deleting product:', error);
      return false;
    }
  }
}));

export { useProductStore }; 
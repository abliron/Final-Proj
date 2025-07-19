// קובץ הגדרות API - מגדיר את כתובות הקצה של השרת

import axios from 'axios'; // ייבוא ספרייה לבקשות HTTP
import { useAuthStore } from '../store/authStore'; // ייבוא store לניהול אימות

// הגדרת כתובת בסיס של השרת
export const API_BASE_URL = 'http://localhost:3000';

// הגדרת נקודות קצה (endpoints) של ה-API
export const API_ENDPOINTS = {
  // נקודות קצה לאימות משתמשים
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`, // התחברות
    REGISTER: `${API_BASE_URL}/api/auth/register`, // הרשמה
  },
  // נקודות קצה להזמנות
  ORDERS: {
    CREATE: `${API_BASE_URL}/api/orders`, // יצירת הזמנה
    GET_ALL: `${API_BASE_URL}/api/orders`, // קבלת כל ההזמנות
    UPDATE: `${API_BASE_URL}/api/orders/:id`, // עדכון הזמנה
  },
  // נקודות קצה למוצרים
  PRODUCTS: {
    GET_ALL: `${API_BASE_URL}/api/products`, // קבלת כל המוצרים
  }
};

// Interceptor ל-axios שמבצע logout אוטומטי ב-401
// Interceptor הוא פונקציה שמתבצעת לפני או אחרי כל בקשה
axios.interceptors.response.use(
  response => response, // אם התגובה תקינה, החזר אותה
  error => {
    // אם התגובה היא 401 (לא מורשה), התנתק אוטומטית
    if (error.response && error.response.status === 401) {
      useAuthStore.getState().logout();
    }
    return Promise.reject(error); // החזר את השגיאה
  }
);

export default axios; 
// Store לניהול אימות משתמשים - מטפל בהתחברות, הרשמה וניהול משתמש

import { create } from 'zustand'; // ייבוא ספריית ניהול state
import axios from 'axios'; // ייבוא ספרייה לבקשות HTTP
import { API_ENDPOINTS } from '../config/api'; // ייבוא נקודות קצה של ה-API

// יצירת store לאימות משתמשים
const useAuthStore = create((set, get) => ({
  // מצב ראשוני של ה-store
  user: null, // נתוני המשתמש הנוכחי
  token: localStorage.getItem('token'), // טוקן האימות מהזיכרון המקומי
  isAuthenticated: !!localStorage.getItem('token'), // האם המשתמש מחובר

  // פונקציה להתחברות משתמש
  login: async (email, password) => {
    try {
      console.log('Attempting login with:', { email, password: '***' }); // לוג לניסיון התחברות
      console.log('Login URL:', API_ENDPOINTS.AUTH.LOGIN); // לוג לכתובת ההתחברות
      
      // שליחת בקשה להתחברות לשרת
      const response = await axios.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });
      
      console.log('Login response:', response.data); // לוג לתגובה מהשרת
      const { token, user } = response.data; // חילוץ הטוקן ונתוני המשתמש
      
      // שמירת הטוקן בזיכרון המקומי ועדכון ה-store
      localStorage.setItem('token', token);
      set({ user, token, isAuthenticated: true });
      
      // קבלת פרטי הפרופיל המלאים
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

  // פונקציה להרשמת משתמש חדש
  register: async (name, email, password) => {
    try {
      console.log('Attempting registration with:', { name, email, password: '***' }); // לוג לניסיון הרשמה
      console.log('Register URL:', API_ENDPOINTS.AUTH.REGISTER); // לוג לכתובת ההרשמה
      
      // שליחת בקשה להרשמה לשרת
      const response = await axios.post(API_ENDPOINTS.AUTH.REGISTER, {
        name,
        email,
        password
      });
      
      console.log('Registration response:', response.data); // לוג לתגובה מהשרת
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

  // פונקציה לעדכון נתוני משתמש
  updateUser: (updatedUser) => {
    set((state) => ({
      user: { ...state.user, ...updatedUser } // עדכון נתוני המשתמש עם הנתונים החדשים
    }));
  },

  // פונקציה לקבלת פרטי פרופיל המשתמש
  getProfile: async () => {
    try {
      const token = get().token || localStorage.getItem('token'); // קבלת הטוקן
      if (!token) return; // אם אין טוקן, לא ממשיכים
      
      // שליחת בקשה לקבלת פרטי הפרופיל
      const response = await axios.get('http://localhost:3000/api/auth/profile', {
        headers: { 'Authorization': `Bearer ${token}` } // הוספת הטוקן לכותרות
      });
      
      // עדכון נתוני המשתמש אם התקבלו
      if (response.data && response.data.user) {
        set({ user: response.data.user });
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  },

  // פונקציה להתנתקות משתמש
  logout: () => {
    localStorage.removeItem('token'); // מחיקת הטוקן מהזיכרון המקומי
    set({ user: null, token: null, isAuthenticated: false }); // איפוס מצב המשתמש
  }
}));

export { useAuthStore }; 
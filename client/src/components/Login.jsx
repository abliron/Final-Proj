// רכיב התחברות - טופס להתחברות משתמש למערכת

import React, { useState } from 'react'; // ייבוא React ו-hook לניהול state
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa'; // ייבוא אייקונים
import { useAuthStore } from '../store/authStore'; // ייבוא store לניהול אימות

const Login = () => {
  // ניהול state של הטופס
  const [formData, setFormData] = useState({
    email: '', // אימייל המשתמש
    password: '' // סיסמת המשתמש
  });
  const [loading, setLoading] = useState(false); // מצב טעינה
  const [error, setError] = useState(''); // הודעת שגיאה
  
  // קבלת פונקציית ההתחברות מה-store
  const { login } = useAuthStore();

  // פונקציה לטיפול בשינויי שדות הטופס
  const handleChange = (e) => {
    setFormData({
      ...formData, // שמירת הנתונים הקיימים
      [e.target.name]: e.target.value // עדכון השדה שהשתנה
    });
  };

  // פונקציה לטיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault(); // מניעת ריענון הדף
    setLoading(true); // הפעלת מצב טעינה
    setError(''); // איפוס הודעות שגיאה קודמות

    try {
      // ניסיון התחברות
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      setError('שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false); // כיבוי מצב טעינה
    }
  };

  // החזרת מבנה ה-JSX של טופס ההתחברות
  return (
    <div className="auth-form">
      {/* כותרת הטופס */}
      <h2>התחברות</h2>
      <p>ברוכים הבאים! התחבר לחשבון שלך</p>
      
      {/* הצגת הודעת שגיאה אם קיימת */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* טופס ההתחברות */}
      <form onSubmit={handleSubmit}>
        {/* שדה אימייל */}
        <div className="form-group">
          <label className="form-label">
            <FaEnvelope /> אימייל
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="הכנס את האימייל שלך"
            required
          />
        </div>
        
        {/* שדה סיסמה */}
        <div className="form-group">
          <label className="form-label">
            <FaLock /> סיסמה
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="הכנס את הסיסמה שלך"
            required
          />
        </div>
        
        {/* כפתור שליחה */}
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading} // ביטול הכפתור בזמן טעינה
        >
          {loading ? (
            // מצג טעינה
            <>
              <div className="spinner"></div>
              מתחבר...
            </>
          ) : (
            // מצג רגיל
            <>
              <FaSignInAlt />
              התחבר
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Login; 
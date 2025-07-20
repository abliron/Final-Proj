// קומפוננטת Register - טופס הרשמה ליצירת משתמש חדש
import React, { useState } from 'react';
import { FaUserPlus, FaEnvelope, FaLock, FaUser, FaCheckCircle } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const Register = ({ onViewChange }) => {
  // state לניהול שדות הטופס, טעינה, שגיאה והצלחה
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  
  const { register } = useAuthStore(); // פונקציית הרשמה מה-store

  // טיפול בשינוי שדות הטופס
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // טיפול בשליחת הטופס
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess(false);

    // בדיקת התאמת סיסמאות
    if (formData.password !== formData.confirmPassword) {
      setError('הסיסמאות אינן תואמות');
      setLoading(false);
      return;
    }

    try {
      // ניסיון הרשמה
      const success = await register(formData.name, formData.email, formData.password);
      if (success) {
        setSuccess(true);
        setFormData({
          name: '',
          email: '',
          password: '',
          confirmPassword: ''
        });
        
        // הצגת הודעת הצלחה ומעבר לעמוד התחברות לאחר 2 שניות
        setTimeout(() => {
          if (onViewChange) {
            onViewChange('login');
          }
        }, 2000);
      } else {
        setError('שגיאה בהרשמה. ייתכן שהאימייל כבר קיים במערכת.');
      }
    } catch (error) {
      setError('שגיאה בהרשמה. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  // תצוגת טופס הרשמה
  return (
    <div className="auth-form">
      <h2>הרשמה</h2>
      <p>צור חשבון חדש כדי להתחיל</p>
      
      {/* הודעת הצלחה */}
      {success && (
        <div className="success-message">
          <FaCheckCircle />
          <span>ההרשמה הושלמה בהצלחה! מעביר אותך לעמוד הכניסה...</span>
        </div>
      )}
      
      {/* הודעת שגיאה */}
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {/* טופס הרשמה */}
      <form onSubmit={handleSubmit}>
        {/* שדה שם מלא */}
        <div className="form-group">
          <label className="form-label">
            <FaUser /> שם מלא
          </label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="form-input"
            placeholder="הכנס את השם המלא שלך"
            required
            disabled={success}
          />
        </div>
        
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
            disabled={success}
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
            placeholder="הכנס סיסמה (לפחות 6 תווים)"
            required
            minLength="6"
            disabled={success}
          />
        </div>
        
        {/* שדה אימות סיסמה */}
        <div className="form-group">
          <label className="form-label">
            <FaLock /> אימות סיסמה
          </label>
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="form-input"
            placeholder="הכנס שוב את הסיסמה"
            required
            disabled={success}
          />
        </div>
        
        {/* כפתור שליחה */}
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading || success}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              נרשם...
            </>
          ) : success ? (
            <>
              <FaCheckCircle />
              נרשם בהצלחה!
            </>
          ) : (
            <>
              <FaUserPlus />
              הרשמה
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default Register; 
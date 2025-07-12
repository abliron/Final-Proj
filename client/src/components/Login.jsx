import React, { useState } from 'react';
import { FaSignInAlt, FaEnvelope, FaLock } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuthStore();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('שם משתמש או סיסמה שגויים');
      }
    } catch (error) {
      setError('שגיאה בהתחברות. נסה שוב.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-form">
      <h2>התחברות</h2>
      <p>ברוכים הבאים! התחבר לחשבון שלך</p>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
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
        
        <button
          type="submit"
          className="btn btn-primary btn-large"
          disabled={loading}
        >
          {loading ? (
            <>
              <div className="spinner"></div>
              מתחבר...
            </>
          ) : (
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
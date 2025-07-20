// קומפוננטת Toast - הודעה קופצת להצגת סטטוס/שגיאה/הצלחה
import React, { useEffect } from 'react';

// props: message - תוכן ההודעה, type - סוג (info/success/error/warning), onClose - סגירה, duration - משך זמן
const Toast = ({ message, type = 'info', onClose, duration = 5000 }) => {
  // סגירת ההודעה אוטומטית לאחר זמן מוגדר
  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration, onClose]);

  // קבלת אייקון לפי סוג ההודעה
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'fas fa-check-circle';
      case 'error':
        return 'fas fa-exclamation-circle';
      case 'warning':
        return 'fas fa-exclamation-triangle';
      case 'info':
      default:
        return 'fas fa-info-circle';
    }
  };

  // קבלת רקע גרפי לפי סוג ההודעה
  const getBackground = () => {
    switch (type) {
      case 'success':
        return 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)';
      case 'error':
        return 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
      case 'warning':
        return 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)';
      case 'info':
      default:
        return 'var(--primary-gradient)';
    }
  };

  // תצוגת ההודעה הקופצת
  return (
    <div 
      className="toast"
      style={{
        background: getBackground(),
        animation: 'slideInRight 0.3s ease-out'
      }}
    >
      <div className="toast-icon">
        <i className={getIcon()}></i>
      </div>
      <div className="toast-content">
        <p>{message}</p>
      </div>
      <button className="toast-close" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
    </div>
  );
};

export default Toast; 
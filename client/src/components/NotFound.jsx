// קומפוננטת NotFound - מציגה עמוד שגיאה 404 כאשר הדף לא נמצא
import React from 'react';

const NotFound = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        {/* אייקון שגיאה */}
        <div className="not-found-icon">
          <i className="fas fa-exclamation-triangle"></i>
        </div>
        
        {/* כותרות שגיאה */}
        <h1>404</h1>
        <h2>העמוד לא נמצא</h2>
        <p>העמוד שחיפשת לא קיים או הועבר לכתובת אחרת</p>
        
        {/* כפתורי ניווט חזרה */}
        <div className="not-found-actions">
          <button className="btn btn-primary" onClick={() => window.history.back()}>
            <i className="fas fa-arrow-right"></i>
            חזור לעמוד הקודם
          </button>
          
          <button className="btn btn-secondary" onClick={() => window.location.href = '/'}>
            <i className="fas fa-home"></i>
            דף הבית
          </button>
        </div>
        
        {/* עזרה למשתמש */}
        <div className="not-found-help">
          <h3>מה אפשר לעשות?</h3>
          <ul>
            <li>
              <i className="fas fa-check"></i>
              בדוק שהכתובת נכונה
            </li>
            <li>
              <i className="fas fa-check"></i>
              נסה לחזור לדף הבית
            </li>
            <li>
              <i className="fas fa-check"></i>
              השתמש בתפריט הניווט
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NotFound; 
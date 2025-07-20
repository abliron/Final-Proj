// קומפוננטת Header - מציגה את סרגל הניווט העליון של האתר
import React from 'react';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

// props: cartItemCount - מספר פריטים בסל, onViewChange - פונקציה לשינוי תצוגה
const Header = ({ cartItemCount = 0, onViewChange }) => {
  const { logout } = useAuthStore(); // פעולה להתנתקות

  // טיפול בלחיצה על התנתקות
  const handleLogout = () => {
    logout(); // קריאה לפעולת התנתקות מה-store
    if (onViewChange) {
      onViewChange('home'); // מעבר לדף הבית לאחר התנתקות
    }
  };

  // ניווט בין תצוגות שונות (store, cart, profile וכו')
  const handleNavigation = (view) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        {/* סרגל ניווט ראשי */}
        <div className="header-nav">
          {/* כפתור התנתקות */}
          <button 
            className="nav-link logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> התנתק
          </button>
          {/* מעבר לפרופיל */}
          <button 
            className="nav-link"
            onClick={() => handleNavigation('profile')}
          >
            <FaUser /> פרופיל
          </button>
          {/* מעבר לסל קניות */}
          <button 
            className="nav-link"
            onClick={() => handleNavigation('cart')}
          >
            <FaShoppingCart />
            סל קניות
            {/* תצוגת מספר פריטים בסל */}
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
          {/* מעבר לחיפוש/חנות */}
          <button 
            className="nav-link"
            onClick={() => handleNavigation('store')}
          >
            <FaSearch /> חיפוש
          </button>
        </div>
        {/* לוגו האתר - לחיצה מחזירה לחנות */}
        <button 
          className="logo-btn"
          onClick={() => handleNavigation('store')}
        >
          🛒 חנות אינטרנטית
        </button>
      </div>
    </header>
  );
};

export default Header; 
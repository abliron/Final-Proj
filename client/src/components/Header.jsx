import React from 'react';
import { FaShoppingCart, FaUser, FaSearch, FaSignOutAlt } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const Header = ({ cartItemCount = 0, onViewChange }) => {
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
    if (onViewChange) {
      onViewChange('home');
    }
  };

  const handleNavigation = (view) => {
    if (onViewChange) {
      onViewChange(view);
    }
  };

  return (
    <header className="header">
      <div className="header-content">
        <div className="header-nav">
          <button 
            className="nav-link logout-btn"
            onClick={handleLogout}
          >
            <FaSignOutAlt /> התנתק
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigation('profile')}
          >
            <FaUser /> פרופיל
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigation('cart')}
          >
            <FaShoppingCart />
            סל קניות
            {cartItemCount > 0 && (
              <span className="cart-badge">{cartItemCount}</span>
            )}
          </button>
          <button 
            className="nav-link"
            onClick={() => handleNavigation('store')}
          >
            <FaSearch /> חיפוש
          </button>
        </div>
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
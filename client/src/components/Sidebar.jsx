import React from 'react';
import {
  FaHome,
  FaShoppingBag,
  FaShoppingCart,
  FaHistory,
  FaUser,
  FaCog,
  FaHeart,
  FaStar
} from 'react-icons/fa';

const Sidebar = ({ currentView, onViewChange }) => {
  const menuItems = [
    { id: 'store', label: 'קטלוג מוצרים', icon: FaShoppingBag },
    { id: 'cart', label: 'סל קניות', icon: FaShoppingCart },
    { id: 'history', label: 'היסטוריית רכישות', icon: FaHistory },
    { id: 'profile', label: 'פרופיל', icon: FaUser },
    { id: 'settings', label: 'הגדרות', icon: FaCog },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <p></p>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <button
              key={item.id}
              className={currentView === item.id ? 'active' : ''}
              onClick={() => onViewChange(item.id)}
            >
              <IconComponent />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="category-section">
          <h3>קטגוריות</h3>
          <button className="category-link">
            <FaHeart /> מועדפים
          </button>
          <button className="category-link">
            <FaStar /> מוצרים מובילים
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 
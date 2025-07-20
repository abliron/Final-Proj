// קומפוננטת Sidebar - תפריט צד לניווט בין דפי האפליקציה
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

// props: currentView - תצוגה נוכחית, onViewChange - פונקציה לשינוי תצוגה
const Sidebar = ({ currentView, onViewChange }) => {
  // הגדרת פריטי התפריט הראשי
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

      {/* תפריט ניווט ראשי */}
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
    </div>
  );
};

export default Sidebar; 
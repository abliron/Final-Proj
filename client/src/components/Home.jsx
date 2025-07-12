import React from 'react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const Home = ({ setCurrentView }) => {
  const { user } = useAuthStore();
  const { orders } = useOrderStore();

  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const totalValue = orders.reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  const recentOrders = orders.slice(0, 3);

  return (
    <div className="home-container">
      {/* Hero Section */}
      <div className="hero-section">
        <h1>ברוכים הבאים למערכת ניהול הזמנות</h1>
        <p>ניהול חכם ופשוט של כל ההזמנות שלכם במקום אחד</p>
      </div>

      {/* Dashboard */}
      <div className="dashboard">
        <div className="welcome-section">
          <h2>שלום {user?.name}!</h2>
          <p>הנה סקירה מהירה של הפעילות שלכם</p>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <h3>סה"כ הזמנות</h3>
            <div className="stat-number">
              <i className="fas fa-shopping-cart"></i> {totalOrders}
            </div>
          </div>
          <div className="stat-card">
            <h3>הזמנות ממתינות</h3>
            <div className="stat-number pending">
              <i className="fas fa-clock"></i> {pendingOrders}
            </div>
          </div>
          <div className="stat-card">
            <h3>הזמנות שהושלמו</h3>
            <div className="stat-number completed">
              <i className="fas fa-check-circle"></i> {completedOrders}
            </div>
          </div>
          <div className="stat-card">
            <h3>ערך כולל</h3>
            <div className="stat-number">
              <i className="fas fa-shekel-sign"></i> ₪{totalValue.toFixed(2)}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h3>פעולות מהירות</h3>
          <div className="action-buttons">
            <button 
              className="action-btn primary"
              onClick={() => {
                console.log('New Order button clicked');
                setCurrentView('order-form');
              }}
            >
              <span><i className="fas fa-plus"></i></span>
              הזמנה חדשה
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setCurrentView('order-list')}
            >
              <span><i className="fas fa-list"></i></span>
              צפייה בהזמנות
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setCurrentView('reports')}
            >
              <span><i className="fas fa-chart-bar"></i></span>
              דוחות וסטטיסטיקות
            </button>
            <button 
              className="action-btn secondary"
              onClick={() => setCurrentView('settings')}
            >
              <span><i className="fas fa-cog"></i></span>
              הגדרות
            </button>
          </div>
        </div>

        {/* Recent Orders */}
        {recentOrders.length > 0 && (
          <div className="recent-orders">
            <h3>הזמנות אחרונות</h3>
            <div className="orders-preview">
              {recentOrders.map((order) => (
                <div key={order._id} className="order-preview">
                  <div className="order-preview-header">
                    <span>הזמנה #{order._id.slice(-6)}</span>
                    <span className={`status ${order.status}`}>
                      {order.status === 'pending' && 'ממתין'}
                      {order.status === 'processing' && 'בטיפול'}
                      {order.status === 'completed' && 'הושלם'}
                      {order.status === 'cancelled' && 'בוטל'}
                    </span>
                  </div>
                  <div className="order-preview-items">
                    {order.items.slice(0, 2).map((item, index) => (
                      <div key={index}>
                        {item.name} - {item.quantity}x ₪{item.price}
                      </div>
                    ))}
                    {order.items.length > 2 && (
                      <div>+{order.items.length - 2} פריטים נוספים</div>
                    )}
                  </div>
                  <div style={{ marginTop: '10px', fontWeight: 'bold', color: 'white' }}>
                    סה"כ: ₪{order.total}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="features-section">
        <h2>?למה לבחור במערכת שלנו</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-rocket"></i>
            </div>
            <h3>מהיר ופשוט</h3>
            <p>יצירת הזמנות תוך שניות עם ממשק אינטואיטיבי ונוח לשימוש</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-shield-alt"></i>
            </div>
            <h3>אבטחה מתקדמת</h3>
            <p>הנתונים שלכם מוגנים עם הצפנה מתקדמת ואימות משתמשים חזק</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-chart-line"></i>
            </div>
            <h3>ניתוח מתקדם</h3>
            <p>קבלו תובנות עמוקות על הפעילות שלכם עם דוחות מפורטים</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-mobile-alt"></i>
            </div>
            <h3>גישה מכל מקום</h3>
            <p>גישה למערכת מכל מכשיר - מחשב, טאבלט או סמארטפון</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-sync-alt"></i>
            </div>
            <h3>סנכרון בזמן אמת</h3>
            <p>כל השינויים מתעדכנים מיד בכל המכשירים שלכם</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">
              <i className="fas fa-headset"></i>
            </div>
            <h3>תמיכה 24/7</h3>
            <p>צוות התמיכה שלנו זמין עבורכם בכל שעה של היום</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 
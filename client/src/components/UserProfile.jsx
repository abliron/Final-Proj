import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore';
import { useOrderStore } from '../store/orderStore';

const UserProfile = () => {
  const { user, getProfile } = useAuthStore();
  const { orders } = useOrderStore();
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    getProfile();
  }, []);

  // Calculate user statistics
  const totalOrders = orders?.length || 0;
  const completedOrders = orders?.filter(order => order.status === 'completed').length || 0;
  const totalSpent = orders?.reduce((sum, order) => sum + (order.total || 0), 0) || 0;
  const averageOrderValue = totalOrders > 0 ? totalSpent / totalOrders : 0;

  // Get recent orders
  const recentOrders = orders?.slice(0, 5) || [];

  // Get order history by month
  const orderHistory = orders?.reduce((acc, order) => {
    const month = new Date(order.createdAt).toLocaleDateString('he-IL', { month: 'long', year: 'numeric' });
    if (!acc[month]) {
      acc[month] = { count: 0, total: 0 };
    }
    acc[month].count++;
    acc[month].total += order.total || 0;
    return acc;
  }, {}) || {};

  // Safety check - if user doesn't exist, show loading or error
  if (!user) {
    return (
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 פרופיל משתמש</h1>
        </div>
        <div className="profile-content">
          <div className="profile-card">
            <p>טוען פרטי משתמש...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <div className="profile-avatar">
          <i className="fas fa-user-circle"></i>
        </div>
        <div className="profile-info">
          <h2>{user?.name || 'משתמש'}</h2>
          <p>{user?.email || 'user@example.com'}</p>
          <p><strong>טלפון:</strong> {user?.phone ? user.phone : 'לא הוזן'}</p>
          {user?.address && (
            <div style={{ direction: 'rtl', textAlign: 'right', fontSize: '0.95em' }}>
              <div><strong>כתובת:</strong> {user.address.street || ''}</div>
              <div>{user.address.city || ''}{user.address.city && user.address.postalCode ? ', ' : ''}{user.address.postalCode || ''}</div>
              <div>{user.address.country || ''}</div>
            </div>
          )}
          <span className="member-since">
            <i className="fas fa-calendar"></i>
            חבר מאז {new Date().toLocaleDateString('he-IL', { month: 'long', year: 'numeric' })}
          </span>
        </div>
      </div>

      {/* Profile Stats */}
      <div className="profile-stats">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--primary-gradient)' }}>
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="stat-content">
            <h3>סה"כ הזמנות</h3>
            <div className="stat-value">{totalOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-gradient)' }}>
            <i className="fas fa-check-circle"></i>
          </div>
          <div className="stat-content">
            <h3>הזמנות שהושלמו</h3>
            <div className="stat-value">{completedOrders}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--warning-gradient)' }}>
            <i className="fas fa-shekel-sign"></i>
          </div>
          <div className="stat-content">
            <h3>סה"כ הוצאות</h3>
            <div className="stat-value">₪{totalSpent.toFixed(2)}</div>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--secondary-gradient)' }}>
            <i className="fas fa-chart-line"></i>
          </div>
          <div className="stat-content">
            <h3>ערך הזמנה ממוצע</h3>
            <div className="stat-value">₪{averageOrderValue.toFixed(2)}</div>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="profile-tabs">
        <button
          className={`profile-tab ${activeTab === 'overview' ? 'active' : ''}`}
          onClick={() => setActiveTab('overview')}
        >
          <i className="fas fa-chart-pie"></i> סקירה כללית
        </button>
        <button
          className={`profile-tab ${activeTab === 'history' ? 'active' : ''}`}
          onClick={() => setActiveTab('history')}
        >
          <i className="fas fa-history"></i> היסטוריית הזמנות
        </button>
        <button
          className={`profile-tab ${activeTab === 'activity' ? 'active' : ''}`}
          onClick={() => setActiveTab('activity')}
        >
          <i className="fas fa-clock"></i> פעילות אחרונה
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="profile-section">
          <h3>
            <i className="fas fa-chart-pie"></i> סקירה כללית
          </h3>
          
          <div className="overview-grid">
            <div className="overview-card">
              <h4>הזמנות לפי חודש</h4>
              <div className="monthly-chart">
                {Object.entries(orderHistory).slice(0, 6).map(([month, data]) => (
                  <div key={month} className="chart-item">
                    <div className="chart-bar" style={{ 
                      height: `${(data.count / Math.max(...Object.values(orderHistory).map(d => d.count || 0))) * 100}%`,
                      background: 'var(--primary-gradient)'
                    }}></div>
                    <span>{month}</span>
                    <small>{data.count} הזמנות</small>
                  </div>
                ))}
              </div>
            </div>

            <div className="overview-card">
              <h4>סטטיסטיקות מהירות</h4>
              <div className="quick-stats">
                <div className="quick-stat">
                  <span>הזמנה הראשונה</span>
                  <strong>
                    {orders?.length > 0 
                      ? new Date(orders[orders.length - 1].createdAt).toLocaleDateString('he-IL')
                      : 'אין הזמנות'
                    }
                  </strong>
                </div>
                <div className="quick-stat">
                  <span>הזמנה האחרונה</span>
                  <strong>
                    {orders?.length > 0 
                      ? new Date(orders[0].createdAt).toLocaleDateString('he-IL')
                      : 'אין הזמנות'
                    }
                  </strong>
                </div>
                <div className="quick-stat">
                  <span>הזמנה הגדולה ביותר</span>
                  <strong>
                    {orders?.length > 0 
                      ? `₪${Math.max(...orders.map(o => o.total || 0)).toFixed(2)}`
                      : 'אין הזמנות'
                    }
                  </strong>
                </div>
                <div className="quick-stat">
                  <span>אחוז הזמנות שהושלמו</span>
                  <strong>
                    {totalOrders > 0 
                      ? `${((completedOrders / totalOrders) * 100).toFixed(1)}%`
                      : '0%'
                    }
                  </strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* History Tab */}
      {activeTab === 'history' && (
        <div className="profile-section">
          <h3>
            <i className="fas fa-history"></i> היסטוריית הזמנות
          </h3>
          
          {orders?.length === 0 ? (
            <div className="empty-state">
              <i className="fas fa-inbox"></i>
              <p>אין הזמנות עדיין</p>
              <p>צור הזמנה ראשונה כדי להתחיל!</p>
            </div>
          ) : (
            <div className="orders-timeline">
              {orders?.map((order, index) => (
                <div key={order._id} className="timeline-item">
                  <div className="timeline-marker">
                    <i className="fas fa-shopping-cart"></i>
                  </div>
                  <div className="timeline-content">
                    <div className="timeline-header">
                      <h4>הזמנה #{order._id?.slice(-6) || 'N/A'}</h4>
                      <span className={`status ${order.status}`}>
                        {order.status === 'pending' && 'ממתין'}
                        {order.status === 'processing' && 'בטיפול'}
                        {order.status === 'completed' && 'הושלם'}
                        {order.status === 'cancelled' && 'בוטל'}
                      </span>
                    </div>
                    <div className="timeline-details">
                      <p>
                        <i className="fas fa-calendar"></i>
                        {new Date(order.createdAt).toLocaleDateString('he-IL')}
                      </p>
                      <p>
                        <i className="fas fa-tag"></i>
                        {order.items?.length || 0} פריטים
                      </p>
                      <p>
                        <i className="fas fa-shekel-sign"></i>
                        ₪{order.total || 0}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Activity Tab */}
      {activeTab === 'activity' && (
        <div className="profile-section">
          <h3>
            <i className="fas fa-clock"></i> פעילות אחרונה
          </h3>
          
          <div className="activity-feed">
            {recentOrders?.map((order, index) => (
              <div key={order._id} className="activity-item">
                <div className="activity-icon">
                  <i className="fas fa-shopping-cart"></i>
                </div>
                <div className="activity-content">
                  <h4>הזמנה חדשה #{order._id?.slice(-6) || 'N/A'}</h4>
                  <p>נוצרה הזמנה חדשה עם {order.items?.length || 0} פריטים</p>
                  <small>{new Date(order.createdAt).toLocaleDateString('he-IL')}</small>
                </div>
                <div className="activity-amount">
                  ₪{order.total || 0}
                </div>
              </div>
            ))}
            
            {recentOrders?.length === 0 && (
              <div className="empty-state">
                <i className="fas fa-clock"></i>
                <p>אין פעילות עדיין</p>
                <p>הפעילות שלך תופיע כאן</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default UserProfile; 
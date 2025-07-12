import React from 'react';
import { useOrderStore } from '../store/orderStore';

const Reports = () => {
  const { orders } = useOrderStore();

  // Calculate statistics
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(order => order.status === 'pending').length;
  const completedOrders = orders.filter(order => order.status === 'completed').length;
  const processingOrders = orders.filter(order => order.status === 'processing').length;
  const cancelledOrders = orders.filter(order => order.status === 'cancelled').length;
  const totalRevenue = orders.reduce((sum, order) => sum + order.total, 0);
  const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  // Monthly data (mock data for demonstration)
  const monthlyData = [
    { month: 'ינואר', orders: 12, revenue: 2400 },
    { month: 'פברואר', orders: 19, revenue: 3800 },
    { month: 'מרץ', orders: 15, revenue: 3000 },
    { month: 'אפריל', orders: 22, revenue: 4400 },
    { month: 'מאי', orders: 18, revenue: 3600 },
    { month: 'יוני', orders: 25, revenue: 5000 }
  ];

  // Top products (mock data)
  const topProducts = [
    { name: 'מוצר א', quantity: 45, revenue: 2250 },
    { name: 'מוצר ב', quantity: 32, revenue: 1600 },
    { name: 'מוצר ג', quantity: 28, revenue: 1400 },
    { name: 'מוצר ד', quantity: 22, revenue: 1100 },
    { name: 'מוצר ה', quantity: 18, revenue: 900 }
  ];

  return (
    <div className="reports-container">
      <div className="reports-header">
        <h2>
          <i className="fas fa-chart-line"></i> דוחות וסטטיסטיקות
        </h2>
        <p>סקירה מקיפה של הפעילות העסקית שלכם</p>
      </div>

      {/* Key Metrics */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--primary-gradient)' }}>
            <i className="fas fa-shopping-cart"></i>
          </div>
          <div className="metric-content">
            <h3>סה"כ הזמנות</h3>
            <div className="metric-value">{totalOrders}</div>
            <div className="metric-change positive">+12% מהחודש הקודם</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--success-gradient)' }}>
            <i className="fas fa-shekel-sign"></i>
          </div>
          <div className="metric-content">
            <h3>הכנסות כוללות</h3>
            <div className="metric-value">₪{totalRevenue.toFixed(2)}</div>
            <div className="metric-change positive">+8% מהחודש הקודם</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--warning-gradient)' }}>
            <i className="fas fa-clock"></i>
          </div>
          <div className="metric-content">
            <h3>הזמנות ממתינות</h3>
            <div className="metric-value">{pendingOrders}</div>
            <div className="metric-change neutral">ללא שינוי</div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon" style={{ background: 'var(--secondary-gradient)' }}>
            <i className="fas fa-chart-bar"></i>
          </div>
          <div className="metric-content">
            <h3>ערך הזמנה ממוצע</h3>
            <div className="metric-value">₪{averageOrderValue.toFixed(2)}</div>
            <div className="metric-change positive">+5% מהחודש הקודם</div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-section">
        <div className="chart-container">
          <h3>
            <i className="fas fa-chart-pie"></i> התפלגות הזמנות לפי סטטוס
          </h3>
          <div className="status-chart">
            <div className="chart-item">
              <div className="chart-bar" style={{ 
                height: `${(pendingOrders / totalOrders) * 100}%`,
                background: 'var(--warning-gradient)'
              }}></div>
              <span>ממתין ({pendingOrders})</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ 
                height: `${(processingOrders / totalOrders) * 100}%`,
                background: 'var(--primary-gradient)'
              }}></div>
              <span>בטיפול ({processingOrders})</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ 
                height: `${(completedOrders / totalOrders) * 100}%`,
                background: 'var(--success-gradient)'
              }}></div>
              <span>הושלם ({completedOrders})</span>
            </div>
            <div className="chart-item">
              <div className="chart-bar" style={{ 
                height: `${(cancelledOrders / totalOrders) * 100}%`,
                background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)'
              }}></div>
              <span>בוטל ({cancelledOrders})</span>
            </div>
          </div>
        </div>

        <div className="chart-container">
          <h3>
            <i className="fas fa-chart-area"></i> הכנסות חודשיות
          </h3>
          <div className="revenue-chart">
            {monthlyData.map((data, index) => (
              <div key={index} className="chart-column">
                <div className="chart-bar" style={{ 
                  height: `${(data.revenue / 5000) * 100}%`,
                  background: 'var(--primary-gradient)'
                }}></div>
                <span>{data.month}</span>
                <small>₪{data.revenue}</small>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Products */}
      <div className="top-products">
        <h3>
          <i className="fas fa-star"></i> המוצרים הפופולריים ביותר
        </h3>
        <div className="products-list">
          {topProducts.map((product, index) => (
            <div key={index} className="product-item">
              <div className="product-rank">#{index + 1}</div>
              <div className="product-info">
                <h4>{product.name}</h4>
                <p>כמות: {product.quantity} יחידות</p>
              </div>
              <div className="product-revenue">
                ₪{product.revenue}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="recent-activity">
        <h3>
          <i className="fas fa-history"></i> פעילות אחרונה
        </h3>
        <div className="activity-list">
          {orders.slice(0, 5).map((order, index) => (
            <div key={index} className="activity-item">
              <div className="activity-icon">
                <i className="fas fa-shopping-cart"></i>
              </div>
              <div className="activity-content">
                <p>הזמנה חדשה #{order._id.slice(-6)}</p>
                <small>{new Date(order.createdAt).toLocaleDateString('he-IL')}</small>
              </div>
              <div className="activity-amount">
                ₪{order.total}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Reports; 
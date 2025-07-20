// קומפוננטת OrderList - מציגה את רשימת ההזמנות במערכת
import React, { useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';

const OrderList = () => {
  // קבלת פונקציות ונתונים מה-store של הזמנות
  const { orders, fetchOrders, updateOrderStatus, deleteOrder } = useOrderStore();

  // טעינת ההזמנות מהשרת בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // שינוי סטטוס של הזמנה
  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('שגיאה בעדכון סטטוס ההזמנה:', error);
    }
  };

  // מחיקת הזמנה
  const handleDeleteOrder = async (orderId) => {
    if (window.confirm('האם אתה בטוח שברצונך למחוק הזמנה זו?')) {
      try {
        await deleteOrder(orderId);
      } catch (error) {
        console.error('שגיאה במחיקת ההזמנה:', error);
      }
    }
  };

  // המרת סטטוס להזמנה לטקסט בעברית
  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'ממתין';
      case 'processing': return 'בטיפול';
      case 'completed': return 'הושלם';
      case 'cancelled': return 'בוטל';
      default: return status;
    }
  };

  // קבלת אייקון מתאים לסטטוס
  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return 'fas fa-clock';
      case 'processing': return 'fas fa-cog';
      case 'completed': return 'fas fa-check-circle';
      case 'cancelled': return 'fas fa-times-circle';
      default: return 'fas fa-question';
    }
  };

  // תצוגה כאשר אין הזמנות
  if (orders.length === 0) {
    return (
      <div className="order-list">
        <h3>
          <i className="fas fa-list"></i> רשימת הזמנות
        </h3>
        <div style={{ 
          textAlign: 'center', 
          padding: '60px 20px',
          color: 'rgba(255, 255, 255, 0.7)',
          fontSize: '1.1rem'
        }}>
          <i className="fas fa-inbox" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}></i>
          <p>אין הזמנות עדיין</p>
          <p>צור הזמנה ראשונה כדי להתחיל!</p>
        </div>
      </div>
    );
  }

  // תצוגת רשימת הזמנות
  return (
    <div className="order-list">
      <h3>
        <i className="fas fa-list"></i> רשימת הזמנות ({orders.length})
      </h3>
      
      {/* מעבר על כל הזמנה */}
      {orders.map((order) => (
        <div key={order._id} className="order-item">
          <div className="order-header">
            <div>
              <h4>
                <i className="fas fa-shopping-cart"></i> הזמנה #{order._id.slice(-6)}
              </h4>
              <small style={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                <i className="fas fa-calendar"></i> {new Date(order.createdAt).toLocaleDateString('he-IL')}
              </small>
            </div>
            
            <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
              {/* בחירת סטטוס להזמנה */}
              <select
                className="order-status-select"
                value={order.status}
                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  border: '1.5px solid #1e40af',
                  background: '#fff',
                  color: '#1e293b',
                  fontSize: '1rem',
                  minWidth: '120px',
                  minHeight: '36px',
                  fontWeight: 600,
                  cursor: 'pointer',
                  boxShadow: '0 2px 8px 0 rgba(30,64,175,0.08)'
                }}
              >
                <option value="pending">ממתין</option>
                <option value="processing">בטיפול</option>
                <option value="completed">הושלם</option>
                <option value="cancelled">בוטל</option>
              </select>
              
              {/* כפתור מחיקת הזמנה */}
              <button
                onClick={() => handleDeleteOrder(order._id)}
                className="btn btn-secondary"
                style={{ padding: '8px 12px', minWidth: 'auto' }}
              >
                <i className="fas fa-trash"></i>
              </button>
            </div>
          </div>

          {/* רשימת פריטים בהזמנה */}
          <div className="order-items">
            {order.items.map((item, index) => (
              <div key={index} className="item">
                <span>
                  <i className="fas fa-tag"></i> {item.name}
                </span>
                <span>
                  <i className="fas fa-hashtag"></i> {item.quantity} x ₪{item.price}
                </span>
                <span style={{ fontWeight: 'bold' }}>
                  ₪{(item.quantity * item.price).toFixed(2)}
                </span>
              </div>
            ))}
          </div>

          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            paddingTop: '15px',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)'
          }}>
            <div className="order-total">
              <i className="fas fa-shekel-sign"></i> סה"כ: ₪{order.total}
            </div>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className={`${getStatusIcon(order.status)}`} style={{ fontSize: '1.2rem' }}></i>
              <span className={`status ${order.status}`}>
                {getStatusText(order.status)}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default OrderList; 
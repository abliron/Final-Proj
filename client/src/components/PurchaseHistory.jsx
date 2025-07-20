// קומפוננטת PurchaseHistory - מציגה את היסטוריית הרכישות של המשתמש
import React, { useState, useEffect } from 'react';
import { FaHistory, FaCalendar, FaCreditCard, FaBox, FaTimesCircle } from 'react-icons/fa';
import { API_ENDPOINTS } from '../config/api';

const PurchaseHistory = ({ onViewChange }) => {
  // state לניהול הזמנות, טעינה, הזמנה נבחרת וביטול
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  // תמונת ברירת מחדל למוצרים ללא תמונה
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjYwIiBoZWlnaHQ9IjYwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik0zMCAxNUMzMS42NTY5IDE1IDMzIDE2LjM0MzEgMzMgMThDMzMgMTkuNjU2OSAzMS42NTY5IDIxIDMwIDIxQzI4LjM0MzEgMjEgMjcgMTkuNjU2OSAyNyAxOEMyNyAxNi4zNDMxIDI4LjM0MzEgMTUgMzAgMTVaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0yNCA0MUMyNCAzOC43OTQ5IDI1Ljc5NDkgMzcgMjggMzdIMzJDMzQuMjA1MSAzNyAzNiAzOC43OTQ5IDM2IDQxVjQzQzM2IDQ1LjIwNTEgMzQuMjA1MSA0NyAzMiA0N0gyOEMyNS43OTQ5IDQ3IDI0IDQ1LjIwNTEgMjQgNDNWNDFaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';

  // טעינת ההזמנות מהשרת בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchOrders();
  }, []);

  // שליפת ההזמנות מהשרת
  const fetchOrders = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch(API_ENDPOINTS.ORDERS.GET_ALL, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      } else {
        console.error('Failed to fetch orders');
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  // ביטול הזמנה
  const cancelOrder = async (orderId) => {
    if (!window.confirm('האם אתה בטוח שברצונך לבטל את ההזמנה?')) return;
    setCancellingOrderId(orderId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_ENDPOINTS.ORDERS.UPDATE.replace(':id', orderId)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status: 'cancelled' })
      });
      if (response.ok) {
        await fetchOrders();
        setSelectedOrder(null);
      } else {
        const data = await response.json();
        alert(data.message || 'שגיאה בביטול ההזמנה');
      }
    } catch (error) {
      alert('שגיאה בביטול ההזמנה');
    } finally {
      setCancellingOrderId(null);
    }
  };

  // עיצוב תאריך
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('he-IL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // קבלת צבע סטטוס
  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return '#28a745';
      case 'pending':
        return '#ffc107';
      case 'cancelled':
        return '#dc3545';
      default:
        return '#6c757d';
    }
  };

  // קבלת טקסט סטטוס בעברית
  const getStatusText = (status) => {
    switch (status) {
      case 'completed':
        return 'הושלם';
      case 'pending':
        return 'ממתין';
      case 'cancelled':
        return 'בוטל';
      default:
        return status;
    }
  };

  // מעבר לחנות
  const handleNavigateToStore = () => {
    if (onViewChange) {
      onViewChange('store');
    }
  };

  // טיפול בשגיאת טעינת תמונה
  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null; // מניעת לולאה אינסופית
  };

  // קבלת כתובת תמונה של פריט
  const getItemImage = (item) => {
    if (item.image && item.image !== '') {
      return item.image;
    }
    return placeholderImage;
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>טוען היסטוריית רכישות...</p>
      </div>
    );
  }

  // תצוגה כאשר אין רכישות
  if (orders.length === 0) {
    return (
      <div className="purchase-history-empty fade-in">
        <div className="empty-state">
          <div className="empty-state-icon">📦</div>
          <h2>אין רכישות עדיין</h2>
          <p>כשתרכוש מוצרים, הם יופיעו כאן</p>
          <button 
            className="btn btn-primary"
            onClick={handleNavigateToStore}
          >
            <FaBox /> התחל לקנות
          </button>
        </div>
      </div>
    );
  }

  // תצוגת היסטוריית רכישות
  return (
    <div className="purchase-history-container fade-in">
      <div className="purchase-history-header">
        <h1>📦 היסטוריית רכישות</h1>
        <p>יש לך {orders.length} הזמנות</p>
      </div>

      <div className="orders-grid">
        {/* מעבר על כל הזמנה */}
        {orders.map((order) => (
          <div key={order._id} className="order-card">
            <div className="order-header">
              <div className="order-info">
                <h3>הזמנה #{order._id.slice(-8)}</h3>
                <div className="order-date">
                  <FaCalendar />
                  {formatDate(order.createdAt)}
                </div>
              </div>
            </div>

            <div className="order-items">
              {/* מעבר על כל פריט בהזמנה */}
              {order.items.map((item, index) => (
                <div key={index} className="order-item">
                  <div className="order-item-image">
                    <img
                      src={getItemImage(item)}
                      alt={item.name || 'מוצר'}
                      onError={handleImageError}
                    />
                  </div>
                  <div className="order-item-details">
                    <h4>{item.name || 'מוצר'}</h4>
                    <p>כמות: {item.quantity}</p>
                    <p>מחיר: ₪{item.price}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>סה"כ:</span>
                <span className="total-amount">₪{order.total}</span>
              </div>
            </div>
            
            {/* שורת סטטוס ופעולות */}
            <div className="order-actions-row">
              <div 
                className="order-status"
                style={{ color: getStatusColor(order.status) }}
              >
                {getStatusText(order.status)}
              </div>
              <div className="order-actions">
                <button
                  className="btn btn-outline btn-sm"
                  onClick={() => setSelectedOrder(order)}
                >
                  <FaHistory /> פרטים נוספים
                </button>
                {order.status === 'pending' && (
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => cancelOrder(order._id)}
                    disabled={cancellingOrderId === order._id}
                  >
                    <FaTimesCircle />
                    {cancellingOrderId === order._id ? 'מבטל...' : 'בטל הזמנה'}
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* מודל פרטי הזמנה */}
      {selectedOrder && (
        <div className="modal-overlay" onClick={() => setSelectedOrder(null)}>
          <div className="modal-content order-details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>פרטי הזמנה #{selectedOrder._id.slice(-8)}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedOrder(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="order-details-grid">
                <div className="order-details-info">
                  <div className="detail-row">
                    <span className="detail-label">תאריך הזמנה:</span>
                    <span>{formatDate(selectedOrder.createdAt)}</span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">סטטוס:</span>
                    <span 
                      style={{ color: getStatusColor(selectedOrder.status) }}
                    >
                      {getStatusText(selectedOrder.status)}
                    </span>
                  </div>
                  
                  <div className="detail-row">
                    <span className="detail-label">סה"כ לתשלום:</span>
                    <span className="total-amount">₪{selectedOrder.total}</span>
                  </div>
                </div>
                
                <div className="order-details-items">
                  <h4>פריטי ההזמנה:</h4>
                  {/* מעבר על כל פריט במודל */}
                  {selectedOrder.items.map((item, index) => (
                    <div key={index} className="detail-item">
                      <div className="detail-item-image">
                        <img
                          src={getItemImage(item)}
                          alt={item.name || 'מוצר'}
                          onError={handleImageError}
                        />
                      </div>
                      <div className="detail-item-info">
                        <h5>{item.name || 'מוצר'}</h5>
                        <p>כמות: {item.quantity} | מחיר: ₪{item.price}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              {selectedOrder.status === 'pending' && (
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button
                    className="btn btn-danger"
                    onClick={() => cancelOrder(selectedOrder._id)}
                    disabled={cancellingOrderId === selectedOrder._id}
                  >
                    <FaTimesCircle />
                    {cancellingOrderId === selectedOrder._id ? 'מבטל...' : 'בטל הזמנה'}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PurchaseHistory; 
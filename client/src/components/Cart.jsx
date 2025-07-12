import React, { useState } from 'react';
import { FaTrash, FaMinus, FaPlus, FaShoppingCart, FaCreditCard, FaMapMarkerAlt } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore';
import { useAuthStore } from '../store/authStore';
import { API_ENDPOINTS } from '../config/api';

const Cart = ({ onViewChange }) => {
  const { items, removeFromCart, updateQuantity, clearCart } = useCartStore();
  const { user } = useAuthStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [showAddressMessage, setShowAddressMessage] = useState(false);

  // Simple placeholder image data URL
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAiIGhlaWdodD0iODAiIHZpZXdCb3g9IjAgMCA4MCA4MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjgwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjRjVGNUY1Ii8+CjxwYXRoIGQ9Ik00MCAyMEM0NC40MTgzIDIwIDQ4IDIzLjU4MTcgNDggMjhDNDggMzIuNDE4MyA0NC40MTgzIDM2IDQwIDM2QzM1LjU4MTcgMzYgMzIgMzIuNDE4MyAzMiAyOEMzMiAyMy41ODE3IDM1LjU4MTcgMjAgNDAgMjBaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0zMiA1NEMzMiA1MS43OTQ5IDMzLjc5NDkgNTAgMzYgNTBINDNDNDUuMjA1MSA1MCA0NyA1MS43OTQ5IDQ3IDU0VjU4QzQ3IDYwLjIwNTEgNDUuMjA1MSA2MiA0MyA2MkgzNkMzMy43OTQ5IDYyIDMyIDYwLjIwNTEgMzIgNThWNTRaIiBmaWxsPSIjOTk5OTk5Ii8+Cjwvc3ZnPgo=';

  const total = items.reduce((sum, item) => sum + (item.product.price * item.quantity), 0);

  // Check if user has shipping address
  const hasShippingAddress = user?.address?.street && user?.address?.city && user?.address?.postalCode;

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity > 0) {
      updateQuantity(productId, newQuantity);
    } else {
      removeFromCart(productId);
    }
  };

  const handleNavigateToStore = () => {
    if (onViewChange) {
      onViewChange('store');
    }
  };

  const handleNavigateToSettings = () => {
    if (onViewChange) {
      onViewChange('settings');
    }
  };

  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null; // Prevent infinite loop
  };

  // Helper function to get the correct image URL
  const getProductImage = (product) => {
    if (product.images && product.images.length > 0) {
      return product.images[0];
    }
    if (product.image) {
      return product.image;
    }
    return placeholderImage;
  };

  const handlePurchase = async () => {
    if (items.length === 0) return;

    // Check for shipping address
    if (!hasShippingAddress) {
      setShowAddressMessage(true);
      setTimeout(() => setShowAddressMessage(false), 5000);
      return;
    }

    setIsProcessing(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        alert('יש להתחבר כדי לבצע רכישה');
        return;
      }

      const orderData = {
        items: items.map(item => ({
          productId: item.product.id,
          name: item.product.title,
          quantity: item.quantity,
          price: item.product.price,
          image: getProductImage(item.product)
        })),
        total: total,
        shippingAddress: user.address
      };

      console.log('Sending order data:', orderData);

      const response = await fetch(API_ENDPOINTS.ORDERS.CREATE, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderData)
      });

      if (response.ok) {
        clearCart();
        alert('הרכישה הושלמה בהצלחה! תודה על הקנייה שלך.');
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || 'שגיאה בביצוע הרכישה');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      if (error.message.includes('Failed to fetch')) {
        alert('שגיאה בחיבור לשרת. בדוק שהשרת רץ ונסה שוב.');
      } else {
        alert(`שגיאה בביצוע הרכישה: ${error.message}`);
      }
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="cart-empty fade-in">
        <div className="empty-state">
          <div className="empty-state-icon">🛒</div>
          <h2>הסל שלך ריק</h2>
          <p>אין לך מוצרים בסל הקניות שלך</p>
          <button 
            className="btn btn-primary"
            onClick={handleNavigateToStore}
          >
            <FaShoppingCart /> התחל לקנות
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-container fade-in">
      <div className="cart-header">
        <h1>🛒 סל קניות</h1>
        <p>יש לך {items.length} מוצרים בסל</p>
      </div>

      {showAddressMessage && (
        <div className="message error">
          <FaMapMarkerAlt /> נדרשת כתובת למשלוח. אנא עדכן את פרטי הפרופיל שלך בהגדרות.
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleNavigateToSettings}
            style={{ marginLeft: '1rem' }}
          >
            עדכן כתובת
          </button>
        </div>
      )}

      {!hasShippingAddress && (
        <div className="message warning">
          <FaMapMarkerAlt /> אין לך כתובת למשלוח. אנא עדכן את פרטי הפרופיל שלך בהגדרות.
          <button 
            className="btn btn-outline btn-sm"
            onClick={handleNavigateToSettings}
            style={{ marginLeft: '1rem' }}
          >
            עדכן כתובת
          </button>
        </div>
      )}

      <div className="cart-content">
        <div className="cart-items">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.product.title}`} className="cart-item">
              <div className="cart-item-image-container">
                <img
                  src={getProductImage(item.product)}
                  alt={item.product.title}
                  className="cart-item-image"
                  onError={handleImageError}
                />
              </div>
              
              <div className="cart-item-details">
                <h3 className="cart-item-title">{item.product.title}</h3>
                <div className="cart-item-price">₪{item.product.price}</div>
              </div>
              
              <div className="cart-quantity">
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                >
                  <FaMinus />
                </button>
                <span className="quantity-display">{item.quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                >
                  <FaPlus />
                </button>
              </div>
              
              <div className="cart-item-total">
                ₪{(item.product.price * item.quantity).toFixed(2)}
              </div>
              
              <button
                className="btn btn-danger btn-sm"
                onClick={() => removeFromCart(item.product.id)}
              >
                <FaTrash />
              </button>
            </div>
          ))}
        </div>

        <div className="cart-summary">
          <div className="cart-summary-card">
            <h3>סיכום הזמנה</h3>
            
            <div className="summary-row">
              <span>מספר מוצרים:</span>
              <span>{items.length}</span>
            </div>
            
            <div className="summary-row">
              <span>סכום ביניים:</span>
              <span>₪{total.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>משלוח:</span>
              <span>₪0.00</span>
            </div>
            
            <div className="summary-row total-row">
              <span>סה"כ לתשלום:</span>
              <span className="total-amount">₪{total.toFixed(2)}</span>
            </div>
            
            {hasShippingAddress && (
              <div className="shipping-address-info">
                <h4><FaMapMarkerAlt /> כתובת למשלוח:</h4>
                <p>{user.address.street}</p>
                <p>{user.address.city}, {user.address.postalCode}</p>
                <p>{user.address.country}</p>
              </div>
            )}
            
            <button
              className="btn btn-primary btn-large checkout-btn"
              onClick={handlePurchase}
              disabled={isProcessing || !hasShippingAddress}
            >
              {isProcessing ? (
                <>
                  <div className="spinner"></div>
                  מעבד...
                </>
              ) : !hasShippingAddress ? (
                <>
                  <FaMapMarkerAlt />
                  עדכן כתובת למשלוח
                </>
              ) : (
                <>
                  <FaCreditCard />
                  סיים רכישה
                </>
              )}
            </button>
            
            <button
              className="btn btn-outline btn-large"
              onClick={clearCart}
              disabled={isProcessing}
            >
              <FaTrash />
              רוקן סל
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart; 
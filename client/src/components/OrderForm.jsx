// קומפוננטת OrderForm - טופס ליצירת הזמנה חדשה
import React, { useState, useEffect } from 'react';
import { useOrderStore } from '../store/orderStore';
import { useProductStore } from '../store/productStore';

const OrderForm = () => {
  const { createOrder } = useOrderStore(); // פעולה ליצירת הזמנה
  const { products, fetchProducts, loading: productsLoading } = useProductStore(); // מוצרים וטעינת מוצרים
  // state של פריטי ההזמנה
  const [items, setItems] = useState([
    { productId: '', name: '', quantity: 1, price: 0, image: '', total: 0 }
  ]);
  const [message, setMessage] = useState(''); // הודעת הצלחה/שגיאה

  // טעינת מוצרים מהשרת בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // הוספת שורה חדשה להזמנה
  const addItem = () => {
    setItems([...items, { productId: '', name: '', quantity: 1, price: 0, image: '', total: 0 }]);
  };

  // הסרת שורה מההזמנה
  const removeItem = (index) => {
    if (items.length > 1) {
      setItems(items.filter((_, i) => i !== index));
    }
  };

  // עדכון שדה בפריט מסוים (מוצר/כמות וכו')
  const updateItem = (index, field, value) => {
    const newItems = [...items];
    if (field === 'productId') {
      const selectedProduct = products.find(p => p.id === value);
      const price = selectedProduct ? Number(selectedProduct.price) : 0;
      const quantity = newItems[index].quantity || 1;
      newItems[index] = {
        ...newItems[index],
        productId: value,
        name: selectedProduct ? selectedProduct.title : '',
        price,
        image: selectedProduct && Array.isArray(selectedProduct.images) ? selectedProduct.images[0] : '',
        total: price * quantity,
      };
    } else if (field === 'quantity') {
      const quantity = Math.max(1, parseInt(value) || 1);
      const price = newItems[index].price;
      newItems[index] = {
        ...newItems[index],
        quantity,
        total: price * quantity,
      };
    } else {
      newItems[index][field] = value;
    }
    setItems(newItems);
  };

  // שליחת הטופס ליצירת הזמנה
  const handleSubmit = async (e) => {
    e.preventDefault();
    // בדיקת תקינות שדות
    if (items.some(item => !item.productId || item.quantity < 1 || item.price <= 0)) {
      setMessage('אנא בחר מוצר וכמות תקינה לכל שורה');
      return;
    }
    const total = items.reduce((sum, item) => sum + item.total, 0);
    try {
      await createOrder({
        items,
        total,
        status: 'pending'
      });
      setItems([{ productId: '', name: '', quantity: 1, price: 0, image: '', total: 0 }]);
      setMessage('ההזמנה נוצרה בהצלחה!');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('שגיאה ביצירת ההזמנה');
    }
  };

  return (
    <div className="order-form">
      <h3>
        <i className="fas fa-plus-circle"></i> יצירת הזמנה חדשה
      </h3>
      {/* הודעת הצלחה/שגיאה */}
      {message && (
        <div className={`message ${message.includes('בהצלחה') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
      {/* טופס יצירת הזמנה */}
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            <i className="fas fa-list"></i> פריטי ההזמנה
          </label>
          {/* מעבר על כל שורה (פריט) בהזמנה */}
          {items.map((item, index) => {
            const selectedProduct = products.find(p => p.id === item.productId);
            return (
              <div key={index} className="item-row" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* תמונת מוצר */}
                <div style={{ width: 50, height: 50, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {selectedProduct && Array.isArray(selectedProduct.images) && selectedProduct.images[0] && (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.title} style={{ width: 40, height: 40, objectFit: 'contain', borderRadius: 8, background: '#fff' }} />
                  )}
                </div>
                {/* בחירת מוצר */}
                <div className="form-group">
                  <select
                    value={item.productId}
                    onChange={e => updateItem(index, 'productId', e.target.value)}
                    required
                    disabled={productsLoading}
                  >
                    <option value="">בחר מוצר...</option>
                    {products.map(product => (
                      <option key={product.id} value={product.id}>
                        {product.title} (₪{product.price})
                      </option>
                    ))}
                  </select>
                </div>
                {/* כמות */}
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="כמות"
                    min="1"
                    value={item.quantity}
                    onChange={e => updateItem(index, 'quantity', e.target.value)}
                    required
                  />
                </div>
                {/* מחיר כולל לשורה */}
                <div className="form-group">
                  <input
                    type="number"
                    placeholder="מחיר כולל"
                    min="0"
                    step="0.01"
                    value={item.total}
                    readOnly
                    disabled
                  />
                </div>
                {/* מחיקת שורה */}
                <button
                  type="button"
                  onClick={() => removeItem(index)}
                  className="btn btn-secondary"
                  style={{ padding: '8px 12px', minWidth: 'auto' }}
                  disabled={items.length === 1}
                >
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            );
          })}
        </div>
        {/* כפתור להוספת פריט חדש */}
        <div style={{ marginBottom: '20px' }}>
          <button
            type="button"
            onClick={addItem}
            className="btn btn-secondary"
            style={{ marginBottom: '20px' }}
          >
            <i className="fas fa-plus"></i> הוסף פריט
          </button>
        </div>
        {/* כפתור שליחת הזמנה */}
        <div style={{ textAlign: 'center' }}>
          <button type="submit" className="btn btn-primary">
            <i className="fas fa-paper-plane"></i> שלח הזמנה
          </button>
        </div>
      </form>
    </div>
  );
};

export default OrderForm; 
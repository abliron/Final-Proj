// קומפוננטת ProductDetails - מציגה פרטי מוצר בחלון קופץ
import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

// props: productId - מזהה מוצר, onClose - סגירת חלון, addToast - הצגת הודעה
const ProductDetails = ({ productId, onClose, addToast }) => {
  const { currentProduct, fetchProduct, loading } = useProductStore(); // קבלת מוצר נוכחי ופונקציות מה-store
  const { addToCart } = useCartStore(); // פונקציה להוספת מוצר לסל

  // טעינת פרטי המוצר כאשר productId משתנה
  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId, fetchProduct]);

  // תצוגת טעינה
  if (loading || !currentProduct) {
    return <div className="product-details-loading">טוען פרטי מוצר...</div>;
  }

  // הוספת מוצר לסל והצגת הודעה
  const handleAddToCart = () => {
    addToCart(currentProduct, 1);
    if (addToast) addToast('המוצר נוסף לסל!', 'success');
  };

  // תצוגת פרטי מוצר בחלון קופץ
  return (
    <div className="product-details-modal">
      {/* כפתור סגירה */}
      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <div className="product-details-content">
        {/* תמונת מוצר */}
        <img src={Array.isArray(currentProduct.images) ? currentProduct.images[0] : currentProduct.image} alt={currentProduct.title} className="product-details-image" />
        <div className="product-details-info">
          {/* כותרת מוצר */}
          <h2>{currentProduct.title}</h2>
          {/* קטגוריה */}
          <p className="product-details-category">
            <i className="fas fa-tag"></i> {currentProduct.category?.name}
          </p>
          {/* תיאור מוצר */}
          <p className="product-details-description">{currentProduct.description}</p>
          {/* מחיר */}
          <div className="product-details-price">מחיר: ₪{currentProduct.price}</div>
          {/* כפתור הוספה לסל */}
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart"></i> הוסף לסל
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
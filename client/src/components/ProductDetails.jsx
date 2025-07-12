import React, { useEffect } from 'react';
import { useProductStore } from '../store/productStore';
import { useCartStore } from '../store/cartStore';

const ProductDetails = ({ productId, onClose, addToast }) => {
  const { currentProduct, fetchProduct, loading } = useProductStore();
  const { addToCart } = useCartStore();

  useEffect(() => {
    if (productId) fetchProduct(productId);
  }, [productId, fetchProduct]);

  if (loading || !currentProduct) {
    return <div className="product-details-loading">טוען פרטי מוצר...</div>;
  }

  const handleAddToCart = () => {
    addToCart(currentProduct, 1);
    if (addToast) addToast('המוצר נוסף לסל!', 'success');
  };

  return (
    <div className="product-details-modal">
      <button className="close-btn" onClick={onClose}>
        <i className="fas fa-times"></i>
      </button>
      <div className="product-details-content">
        <img src={Array.isArray(currentProduct.images) ? currentProduct.images[0] : currentProduct.image} alt={currentProduct.title} className="product-details-image" />
        <div className="product-details-info">
          <h2>{currentProduct.title}</h2>
          <p className="product-details-category">
            <i className="fas fa-tag"></i> {currentProduct.category?.name}
          </p>
          <p className="product-details-description">{currentProduct.description}</p>
          <div className="product-details-price">מחיר: ₪{currentProduct.price}</div>
          <button className="btn btn-primary" onClick={handleAddToCart}>
            <i className="fas fa-shopping-cart"></i> הוסף לסל
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails; 
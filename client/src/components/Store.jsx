// קומפוננטת Store - מציגה את קטלוג המוצרים ומאפשרת חיפוש, צפייה והוספה לסל
import React, { useState, useEffect } from 'react';
import { FaShoppingCart, FaEye, FaStar, FaSearch } from 'react-icons/fa';
import { useCartStore } from '../store/cartStore';

const Store = () => {
  // state לניהול מוצרים, חיפוש, טעינה, מוצר נבחר
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const { addToCart } = useCartStore();

  // תמונת ברירת מחדל למוצרים ללא תמונה
  const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzAwIGhlaWdodD0iMjAwIHZpZXdCb3g9IjAgMCAzMDAgMjAwIiBmaWxsPSJub25lIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgo8cmVjdCB3aWR0aD0iMzAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI0Y1RjVGNSIvPgo8cGF0aCBkPSJNMTUwIDUwQzE2Ni41NDkgNTAgMTgwIDYzLjQ1MSAxODAgODBDMTgwIDk2LjU0OSAxNjYuNTQ5IDExMCAxNTAgMTEwQzEzMy40NTEgMTEwIDEyMCA5Ni41NDkgMTIwIDgwQzEyMCA2My40NTEgMTMzLjQ1MSA1MCAxNTAgNTBaIiBmaWxsPSIjOTk5OTk5Ii8+CjxwYXRoIGQ9Ik0xMjAgMTYwQzEyMCAxNDMuNDUxIDEzMy40NTEgMTMwIDE1MCAxMzBIMTcwQzE4Ni41NDkgMTMwIDIwMCAxNDMuNDUxIDIwMCAxNjBWMjAwQzIwMCAyMTYuNTQ5IDE4Ni41NDkgMjMwIDE3MCAyMzBIMTUwQzEzMy40NTEgMjMwIDEyMCAyMTYuNTQ5IDEyMCAyMDBWMTYwWiIgZmlsbD0iIzk5OTk5OSIvPgo8L3N2Zz4K';

  // טעינת מוצרים מה-API בעת טעינת הקומפוננטה
  useEffect(() => {
    fetchProducts();
  }, []);

  // סינון מוצרים לפי מחרוזת חיפוש
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product =>
        product.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.name?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredProducts(filtered);
    }
  }, [searchTerm, products]);

  // שליפת מוצרים מה-API
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('https://api.escuelajs.co/api/v1/products');
      const data = await response.json();
      
      // טיפול במבנה התשובה מה-API
      let productsArray = [];
      if (Array.isArray(data)) {
        productsArray = data;
      } else if (data && data.products && Array.isArray(data.products)) {
        productsArray = data.products;
      }
      
      setProducts(productsArray);
      setFilteredProducts(productsArray);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
      setFilteredProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // הוספת מוצר לסל
  const handleAddToCart = (product) => {
    addToCart(product);
  };

  // צפייה בפרטי מוצר
  const handleViewDetails = (product) => {
    setSelectedProduct(product);
  };

  // טיפול בשגיאת טעינת תמונה
  const handleImageError = (e) => {
    e.target.src = placeholderImage;
    e.target.onerror = null; // מניעת לולאה אינסופית
  };

  // שינוי מחרוזת חיפוש
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // ניקוי שדה חיפוש
  const clearSearch = () => {
    setSearchTerm('');
  };

  // תצוגת טעינה
  if (loading) {
    return (
      <div className="loading">
        <div className="loading-spinner"></div>
        <p>טוען מוצרים...</p>
      </div>
    );
  }

  // תצוגת קטלוג מוצרים
  return (
    <div className="store-container fade-in">
      <div className="store-header">
        <h1>🛍️ קטלוג מוצרים</h1>
        <p>גלה את המוצרים הטובים ביותר במחירים מעולים</p>
      </div>

      {/* שורת חיפוש */}
      <div className="search-container">
        <div className="search-input-wrapper">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="חפש מוצרים..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="search-input"
          />
          {searchTerm && (
            <button 
              onClick={clearSearch}
              className="clear-search-btn"
            >
              ×
            </button>
          )}
        </div>
        {searchTerm && (
          <div className="search-results-info">
            נמצאו {Array.isArray(filteredProducts) ? filteredProducts.length : 0} מוצרים עבור "{searchTerm}"
          </div>
        )}
      </div>

      <div className="product-grid">
        {/* מעבר על כל מוצר */}
        {Array.isArray(filteredProducts) && filteredProducts.map((product) => (
          <div key={product.id} className="product-card">
            <div className="product-image-container">
              <img
                src={product.images[0] || placeholderImage}
                alt={product.title}
                className="product-image"
                onError={handleImageError}
              />
              <div className="product-overlay">
                <button
                  className="btn btn-primary overlay-btn"
                  onClick={() => handleAddToCart(product)}
                >
                  <FaShoppingCart /> הוסף לסל
                </button>
                <button
                  className="btn btn-outline overlay-btn"
                  onClick={() => handleViewDetails(product)}
                >
                  <FaEye /> פרטים
                </button>
              </div>
            </div>
            
            <div className="product-info">
              <h3 className="product-title">{product.title}</h3>
              <div className="product-rating">
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <FaStar className="star-icon" />
                <span className="rating-text">(4.5)</span>
              </div>
              <div className="product-price">₪{product.price}</div>
              <p className="product-description">
                {product.description.substring(0, 100)}...
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* הודעה כאשר אין תוצאות */}
      {searchTerm && Array.isArray(filteredProducts) && filteredProducts.length === 0 && (
        <div className="no-results">
          <div className="no-results-icon">🔍</div>
          <h3>לא נמצאו תוצאות</h3>
          <p>נסה לחפש מוצר אחר או לנקות את החיפוש</p>
          <button 
            className="btn btn-outline"
            onClick={clearSearch}
          >
            נקה חיפוש
          </button>
        </div>
      )}

      {/* מודל פרטי מוצר */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{selectedProduct.title}</h2>
              <button
                className="modal-close"
                onClick={() => setSelectedProduct(null)}
              >
                ×
              </button>
            </div>
            
            <div className="modal-body">
              <div className="product-details-grid">
                <div className="product-details-images">
                  <img
                    src={selectedProduct.images[0] || placeholderImage}
                    alt={selectedProduct.title}
                    className="product-details-image"
                    onError={handleImageError}
                  />
                </div>
                
                <div className="product-details-info">
                  <div className="product-details-rating">
                    <FaStar className="star-icon" />
                    <FaStar className="star-icon" />
                    <FaStar className="star-icon" />
                    <FaStar className="star-icon" />
                    <FaStar className="star-icon" />
                    <span>4.5 מתוך 5</span>
                  </div>
                  
                  <div className="product-details-price">
                    <span className="price-label">מחיר:</span>
                    <span className="price-amount">₪{selectedProduct.price}</span>
                  </div>
                  
                  <div className="product-details-description">
                    <h4>תיאור המוצר:</h4>
                    <p>{selectedProduct.description}</p>
                  </div>
                  
                  <button
                    className="btn btn-primary btn-large"
                    onClick={() => {
                      handleAddToCart(selectedProduct);
                      setSelectedProduct(null);
                    }}
                  >
                    <FaShoppingCart /> הוסף לסל קניות
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Store; 
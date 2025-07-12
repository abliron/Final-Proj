const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const { 
  getProducts, 
  getProduct, 
  createProduct, 
  updateProduct, 
  deleteProduct,
  addReview,
  getCategories,
  getFeaturedProducts,
  seedProducts
} = require('../controllers/productController');

// Public routes
router.get('/', getProducts);
router.get('/categories', getCategories);
router.get('/featured', getFeaturedProducts);
router.get('/seed', seedProducts); // For development
router.get('/:id', getProduct);

// Protected routes (authenticated users)
router.post('/:id/reviews', auth, addReview);

// Admin routes (you can add admin middleware later)
router.post('/', auth, createProduct);
router.put('/:id', auth, updateProduct);
router.delete('/:id', auth, deleteProduct);

module.exports = router; 
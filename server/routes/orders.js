const express = require('express');
const router = express.Router();
const auth = require('../utils/auth');
const { createOrder, getOrders, updateOrder, deleteOrder } = require('../controllers/orderController');

router.post('/', auth, createOrder);

// Test route to check auth
router.get('/test-auth', auth, (req, res) => {
  res.json({ message: 'Auth working', userId: req.userId });
});
router.get('/', auth, getOrders);
router.put('/:id', auth, updateOrder);
router.delete('/:id', auth, deleteOrder);

module.exports = router; 
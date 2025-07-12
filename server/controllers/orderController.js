const Order = require('../models/Order');
const User = require('../models/User');

exports.createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    console.log('Headers:', req.headers);
    
    const { items, total, shippingAddress } = req.body;
    
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return res.status(400).json({ message: 'רשימת מוצרים ריקה או לא תקינה' });
    }

    // Get user's shipping address from profile if not provided in request
    let finalShippingAddress = shippingAddress;
    if (!finalShippingAddress) {
      const user = await User.findById(req.userId);
      if (user && user.address) {
        finalShippingAddress = user.address;
      } else {
        return res.status(400).json({ message: 'נדרשת כתובת למשלוח. אנא עדכן את פרטי הפרופיל שלך.' });
      }
    }

    // Validate shipping address
    if (!finalShippingAddress.street || !finalShippingAddress.city || !finalShippingAddress.postalCode) {
      return res.status(400).json({ message: 'כתובת המשלוח לא מלאה. נדרשים רחוב, עיר ומיקוד.' });
    }

    console.log('Creating order with data:', {
      user: req.userId,
      items,
      total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      shippingAddress: finalShippingAddress
    });

    const order = new Order({ 
      user: req.userId, 
      items,
      total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      shippingAddress: finalShippingAddress
    });
    
    console.log('Order object created:', order);
    
    const savedOrder = await order.save();
    console.log('Order saved successfully:', savedOrder);
    
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error('=== CREATE ORDER ERROR ===');
    console.error('Error creating order:', err);
    console.error('Error stack:', err.stack);
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

exports.updateOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      req.body,
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    res.json(order);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

exports.deleteOrder = async (req, res) => {
  try {
    const order = await Order.findOneAndDelete({ _id: req.params.id, user: req.userId });
    if (!order) return res.status(404).json({ message: 'הזמנה לא נמצאה' });
    res.json({ message: 'הזמנה נמחקה' });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
}; 
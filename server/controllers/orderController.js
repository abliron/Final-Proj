// בקר הזמנות - מטפל ביצירת, שליפת, עדכון ומחיקת הזמנות
const Order = require('../models/Order');
const User = require('../models/User');

// יצירת הזמנה חדשה
exports.createOrder = async (req, res) => {
  try {
    console.log('=== CREATE ORDER DEBUG ===');
    console.log('Request body:', req.body);
    console.log('User ID:', req.userId);
    console.log('Headers:', req.headers);
    
    // חילוץ נתוני ההזמנה מהבקשה
    const { items, total, shippingAddress } = req.body;
    
    // בדיקה שהוזנו פריטים להזמנה
    if (!items || !Array.isArray(items) || items.length === 0) {
      console.log('Invalid items array:', items);
      return res.status(400).json({ message: 'רשימת מוצרים ריקה או לא תקינה' });
    }

    // קבלת כתובת למשלוח מהפרופיל אם לא סופקה בבקשה
    let finalShippingAddress = shippingAddress;
    if (!finalShippingAddress) {
      const user = await User.findById(req.userId);
      if (user && user.address) {
        finalShippingAddress = user.address;
      } else {
        return res.status(400).json({ message: 'נדרשת כתובת למשלוח. אנא עדכן את פרטי הפרופיל שלך.' });
      }
    }

    // בדיקת תקינות כתובת למשלוח
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

    // יצירת אובייקט הזמנה חדש
    const order = new Order({ 
      user: req.userId, 
      items,
      total: total || items.reduce((sum, item) => sum + (item.price * item.quantity), 0),
      status: 'pending',
      shippingAddress: finalShippingAddress
    });
    
    console.log('Order object created:', order);
    
    // שמירת ההזמנה במסד הנתונים
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

// שליפת כל ההזמנות של המשתמש
exports.getOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error('Error getting orders:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// עדכון הזמנה קיימת
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

// מחיקת הזמנה
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
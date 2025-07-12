const Product = require('../models/Product');

// Get all products (public)
exports.getProducts = async (req, res) => {
  try {
    const { category, search, sort = 'createdAt', order = 'desc', page = 1, limit = 12 } = req.query;
    
    let query = { isActive: true };
    
    // Filter by category
    if (category && category !== 'all') {
      query.category = category;
    }
    
    // Search functionality
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ];
    }
    
    const skip = (page - 1) * limit;
    
    const products = await Product.find(query)
      .sort({ [sort]: order === 'desc' ? -1 : 1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    const total = await Product.countDocuments(query);
    
    res.json({
      products,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalProducts: total,
        hasNext: skip + products.length < total,
        hasPrev: page > 1
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Get single product (public)
exports.getProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.isActive) {
      return res.status(404).json({ message: 'מוצר לא נמצא' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Create product (admin only)
exports.createProduct = async (req, res) => {
  try {
    const product = new Product(req.body);
    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Update product (admin only)
exports.updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!product) {
      return res.status(404).json({ message: 'מוצר לא נמצא' });
    }
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Delete product (admin only)
exports.deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'מוצר לא נמצא' });
    }
    res.json({ message: 'מוצר נמחק בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Add review to product (authenticated users)
exports.addReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    
    if (!rating || rating < 1 || rating > 5) {
      return res.status(400).json({ message: 'דירוג חייב להיות בין 1 ל-5' });
    }
    
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ message: 'מוצר לא נמצא' });
    }
    
    // Check if user already reviewed this product
    const existingReview = product.reviews.find(
      review => review.user.toString() === req.userId
    );
    
    if (existingReview) {
      return res.status(400).json({ message: 'כבר דירגת מוצר זה' });
    }
    
    product.reviews.push({
      user: req.userId,
      rating,
      comment
    });
    
    // Update average rating
    const totalRating = product.reviews.reduce((sum, review) => sum + review.rating, 0);
    product.rating = totalRating / product.reviews.length;
    
    await product.save();
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Get categories (public)
exports.getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct('category');
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Get featured products (public)
exports.getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, createdAt: -1 })
      .limit(8);
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// Seed products (for development)
exports.seedProducts = async (req, res) => {
  try {
    const sampleProducts = [
      {
        name: 'מחשב נייד HP Pavilion',
        description: 'מחשב נייד חזק עם מעבד Intel i7 ומסך 15.6 אינץ',
        price: 2999,
        category: 'electronics',
        stock: 10,
        tags: ['מחשב', 'נייד', 'HP']
      },
      {
        name: 'חולצת טי שירט כותנה',
        description: 'חולצת טי שירט נוחה מ-100% כותנה אורגנית',
        price: 89,
        category: 'clothing',
        stock: 50,
        tags: ['בגדים', 'חולצה', 'כותנה']
      },
      {
        name: 'ספר "המסע המופלא"',
        description: 'ספר מדע בדיוני מרתק מאת סופר מוביל',
        price: 45,
        category: 'books',
        stock: 25,
        tags: ['ספר', 'מדע בדיוני', 'ספרות']
      },
      {
        name: 'כיסא משרדי ארגונומי',
        description: 'כיסא משרדי נוח עם תמיכה לגב ומשענות יד',
        price: 599,
        category: 'home',
        stock: 15,
        tags: ['ריהוט', 'כיסא', 'משרד']
      },
      {
        name: 'אופני כביש מקצועיים',
        description: 'אופני כביש קלים עם שלדת אלומיניום',
        price: 2499,
        category: 'sports',
        stock: 8,
        tags: ['ספורט', 'אופניים', 'כביש']
      },
      {
        name: 'סמארטפון Samsung Galaxy',
        description: 'סמארטפון מתקדם עם מצלמה 108MP ומסך 6.7 אינץ',
        price: 1899,
        category: 'electronics',
        stock: 20,
        tags: ['טלפון', 'סמארטפון', 'Samsung']
      },
      {
        name: 'מכנסי ג\'ינס קלאסיים',
        description: 'מכנסי ג\'ינס נוחים עם גזרה מודרנית',
        price: 199,
        category: 'clothing',
        stock: 30,
        tags: ['בגדים', 'מכנסיים', 'ג\'ינס']
      },
      {
        name: 'ספר בישול "טעמים מהעולם"',
        description: 'ספר בישול עם מתכונים מכל העולם',
        price: 75,
        category: 'books',
        stock: 12,
        tags: ['ספר', 'בישול', 'מתכונים']
      }
    ];
    
    await Product.insertMany(sampleProducts);
    res.json({ message: 'מוצרים נוצרו בהצלחה' });
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
}; 
// קובץ השרת הראשי - מגדיר את האפליקציה Express ומחבר את כל הרכיבים

// טעינת משתני הסביבה מקובץ .env
require('dotenv').config();

// ייבוא הספריות הנדרשות
const express = require('express'); // מסגרת עבודה לבניית שרתים
const cors = require('cors'); // טיפול בבעיות CORS (Cross-Origin Resource Sharing)
const connectDB = require('./config/db'); // פונקציה לחיבור למסד נתונים
const authRoutes = require('./routes/auth'); // נתיבי אימות משתמשים
const orderRoutes = require('./routes/orders'); // נתיבי הזמנות
const productRoutes = require('./routes/products'); // נתיבי מוצרים

// הגדרת מפתח JWT ברירת מחדל אם לא הוגדר
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-for-development';
  console.log('⚠️  Using default JWT_SECRET for development');
}

// יצירת אפליקציית Express
const app = express();

// הגדרת middleware (תוכנה ביניים)
app.use(cors()); // מאפשר בקשות מכל מקור
app.use(express.json()); // מפענח JSON בבקשות

// דף בית בסיסי
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the E-Commerce Store!',
    endpoints: {
      auth: '/api/auth', // נתיבי אימות
      orders: '/api/orders', // נתיבי הזמנות
      products: '/api/products' // נתיבי מוצרים
    },
    status: 'Server is running'
  });
});

// נתיב בדיקה - לבדיקה שהשרת עובד
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

// הגדרת נתיבי API
app.use('/api/auth', authRoutes); // נתיבי אימות משתמשים
app.use('/api/orders', orderRoutes); // נתיבי ניהול הזמנות
app.use('/api/products', productRoutes); // נתיבי ניהול מוצרים

// הגדרת פורט השרת
const PORT = process.env.PORT || 3000;

// חיבור למסד נתונים
connectDB();

// הפעלת השרת
app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const authRoutes = require('./routes/auth');
const orderRoutes = require('./routes/orders');
const productRoutes = require('./routes/products');

// Set default JWT_SECRET if not provided
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'your-super-secret-jwt-key-for-development';
  console.log('⚠️  Using default JWT_SECRET for development');
}

const app = express();

app.use(cors());
app.use(express.json());

// Basic home page
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the E-Commerce Store!',
    endpoints: {
      auth: '/api/auth',
      orders: '/api/orders',
      products: '/api/products'
    },
    status: 'Server is running'
  });
});

// Test route
app.get('/test', (req, res) => {
  res.json({ message: 'Server is working!' });
});

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => console.log(`Server running on port ${PORT}`)); 
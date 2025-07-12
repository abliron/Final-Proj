require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');

const createTestUser = async () => {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI;
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if test user exists
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists');
      return;
    }

    // Create test user
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({
      name: 'Test User',
      email: 'test@example.com',
      password: hashedPassword
    });

    await user.save();
    console.log('✅ Test user created successfully');
    console.log('Email: test@example.com');
    console.log('Password: test123');

  } catch (error) {
    console.error('❌ Error creating test user:', error);
  } finally {
    await mongoose.disconnect();
  }
};

createTestUser(); 
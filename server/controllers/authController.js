const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body);
    console.log('Content-Type:', req.headers['content-type']);
    
    const { name, email, password } = req.body;
    console.log('Extracted data:', { name, email, password: password ? '***' : 'undefined' });
    
    if (!name || !email || !password) {
      console.log('Missing required fields:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }
    
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'אימייל כבר קיים' });
    }
    
    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ name, email, password: hashedPassword });
    await user.save();
    
    console.log('User created successfully:', { id: user._id, name: user.name, email: user.email });
    res.status(201).json({ message: 'נרשמת בהצלחה' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body);
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set');
    
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }
    
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    }
    
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    console.log('Creating token with secret:', jwtSecret ? 'Set' : 'Using fallback');
    
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '2h' });
    console.log('Token generated successfully');
    
    res.json({ 
      token, 
      user: { 
        id: user._id, 
        name: user.name, 
        email: user.email,
        phone: user.phone,
        address: user.address,
        preferences: user.preferences
      } 
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
}; 
// בקר אימות - מטפל בהרשמה והתחברות של משתמשים

const User = require('../models/User'); // ייבוא מודל המשתמש
const bcrypt = require('bcryptjs'); // ספרייה להצפנת סיסמאות
const jwt = require('jsonwebtoken'); // ספרייה ליצירת טוקנים

// פונקציה להרשמת משתמש חדש
exports.register = async (req, res) => {
  try {
    console.log('Register request received:', req.body); // לוג לקבלת בקשה
    console.log('Content-Type:', req.headers['content-type']); // לוג לסוג התוכן
    
    // חילוץ הנתונים מהבקשה
    const { name, email, password } = req.body;
    console.log('Extracted data:', { name, email, password: password ? '***' : 'undefined' });
    
    // בדיקה שכל השדות הנדרשים קיימים
    if (!name || !email || !password) {
      console.log('Missing required fields:', { hasName: !!name, hasEmail: !!email, hasPassword: !!password });
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }
    
    // בדיקה אם המשתמש כבר קיים במסד הנתונים
    console.log('Checking if user exists...');
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      console.log('User already exists with email:', email);
      return res.status(400).json({ message: 'אימייל כבר קיים' });
    }
    
    // יצירת משתמש חדש עם סיסמה מוצפנת
    console.log('Creating new user...');
    const hashedPassword = await bcrypt.hash(password, 10); // הצפנת הסיסמה
    const user = new User({ name, email, password: hashedPassword });
    await user.save(); // שמירת המשתמש במסד הנתונים
    
    console.log('User created successfully:', { id: user._id, name: user.name, email: user.email });
    res.status(201).json({ message: 'נרשמת בהצלחה' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
};

// פונקציה להתחברות משתמש
exports.login = async (req, res) => {
  try {
    console.log('Login attempt:', req.body); // לוג לניסיון התחברות
    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'Set' : 'Not set'); // לוג למפתח JWT
    
    // חילוץ נתוני ההתחברות
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'נא למלא את כל השדות' });
    }
    
    // חיפוש המשתמש במסד הנתונים
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No');
    if (!user) {
      return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    }
    
    // אימות הסיסמה
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch);
    if (!isMatch) {
      return res.status(400).json({ message: 'אימייל או סיסמה שגויים' });
    }
    
    // יצירת טוקן JWT
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    console.log('Creating token with secret:', jwtSecret ? 'Set' : 'Using fallback');
    
    const token = jwt.sign({ userId: user._id }, jwtSecret, { expiresIn: '2h' }); // יצירת טוקן שתוקפו 2 שעות
    console.log('Token generated successfully');
    
    // החזרת הטוקן ונתוני המשתמש
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
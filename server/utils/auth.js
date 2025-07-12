const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    console.log('Auth middleware - headers:', req.headers);
    const authHeader = req.header('Authorization');
    console.log('Auth header:', authHeader);
    
    if (!authHeader) {
      return res.status(401).json({ message: 'אין טוקן אימות' });
    }
    
    const token = authHeader.replace('Bearer ', '');
    console.log('Token:', token ? 'Present' : 'Missing');
    
    const jwtSecret = process.env.JWT_SECRET || 'fallback-secret-key-for-development';
    console.log('Verifying token with secret:', jwtSecret ? 'Set' : 'Using fallback');
    const decoded = jwt.verify(token, jwtSecret);
    console.log('Token verified, userId:', decoded.userId);
    
    req.userId = decoded.userId;
    next();
  } catch (err) {
    console.error('Auth error:', err);
    res.status(401).json({ message: 'אין הרשאה' });
  }
};

module.exports = auth; 
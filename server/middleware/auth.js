// Middleware לאימות משתמשים - בודק טוקן JWT בבקשות

const jwt = require('jsonwebtoken'); // ייבוא ספריית JWT

// Middleware function - פונקציה שמתבצעת לפני הבקשה
module.exports = (req, res, next) => {
  // קבלת כותרת האימות מהבקשה
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'לא סופק טוקן' });

  // חילוץ הטוקן מהכותרת (מסיר את המילה "Bearer")
  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'טוקן לא תקין' });

  try {
    // אימות הטוקן עם המפתח הסודי
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // הוספת פרטי המשתמש לבקשה
    req.user = { userId: decoded.userId };
    req.userId = decoded.userId;
    
    // המשך לבקשה הבאה
    next();
  } catch (err) {
    // אם הטוקן לא תקין או פג תוקף
    return res.status(403).json({ message: 'טוקן לא תקין או פג תוקף' });
  }
}; 
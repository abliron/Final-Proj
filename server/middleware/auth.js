const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: 'לא סופק טוקן' });

  const token = authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'טוקן לא תקין' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { userId: decoded.userId };
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: 'טוקן לא תקין או פג תוקף' });
  }
}; 
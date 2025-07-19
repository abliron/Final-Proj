// קובץ נתיבי אימות - מטפל בכל הפעולות הקשורות למשתמשים ואימות

const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController'); // ייבוא פונקציות מהבקר
const User = require('../models/User'); // ייבוא מודל המשתמש
const auth = require('../middleware/auth'); // ייבוא middleware לאימות

// נתיב הרשמה - יצירת משתמש חדש
router.post('/register', register);

// נתיב התחברות - כניסת משתמש למערכת
router.post('/login', (req, res, next) => {
  console.log('Login route hit:', req.body); // לוג לבדיקה
  login(req, res, next);
});

// עדכון פרופיל משתמש
router.put('/profile', auth, async (req, res) => {
  try {
    const { name, email, phone, address } = req.body; // קבלת נתונים מהבקשה
    const userId = req.user.userId; // קבלת מזהה המשתמש מה-middleware

    // חיפוש המשתמש במסד הנתונים
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    // עדכון שדות המשתמש אם נשלחו
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (address) {
      // עדכון כתובת המשתמש
      if (address.street !== undefined) user.address.street = address.street;
      if (address.city !== undefined) user.address.city = address.city;
      if (address.postalCode !== undefined) user.address.postalCode = address.postalCode;
      if (address.country !== undefined) user.address.country = address.country;
    }

    await user.save(); // שמירת השינויים במסד הנתונים

    // החזרת נתוני המשתמש ללא סיסמה
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      address: user.address,
      preferences: user.preferences,
      createdAt: user.createdAt
    };

    res.json({ 
      message: 'פרופיל עודכן בהצלחה', 
      user: userResponse 
    });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'שגיאה בעדכון הפרופיל', error: error.message });
  }
});

// עדכון העדפות משתמש
router.put('/preferences', auth, async (req, res) => {
  try {
    const { notifications, emailUpdates, darkMode, language } = req.body; // קבלת העדפות מהבקשה
    const userId = req.user.userId;

    // חיפוש המשתמש במסד הנתונים
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    // עדכון ההעדפות אם נשלחו
    if (notifications !== undefined) user.preferences.notifications = notifications;
    if (emailUpdates !== undefined) user.preferences.emailUpdates = emailUpdates;
    if (darkMode !== undefined) user.preferences.darkMode = darkMode;
    if (language) user.preferences.language = language;

    await user.save(); // שמירת השינויים

    res.json({ 
      message: 'העדפות עודכנו בהצלחה', 
      preferences: user.preferences 
    });
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'שגיאה בעדכון ההעדפות', error: error.message });
  }
});

// שינוי סיסמה
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body; // קבלת סיסמה נוכחית וחדשה
    const userId = req.user.userId;

    // חיפוש המשתמש במסד הנתונים
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    // אימות הסיסמה הנוכחית
    const bcrypt = require('bcryptjs');
    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);
    if (!isPasswordValid) {
      return res.status(400).json({ message: 'הסיסמה הנוכחית שגויה' });
    }

    // הצפנת הסיסמה החדשה
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save(); // שמירת הסיסמה החדשה

    res.json({ message: 'הסיסמה שונתה בהצלחה' });
  } catch (error) {
    console.error('Error changing password:', error);
    res.status(500).json({ message: 'שגיאה בשינוי הסיסמה', error: error.message });
  }
});

// קבלת פרופיל משתמש
router.get('/profile', auth, async (req, res) => {
  try {
    const userId = req.user.userId;
    // חיפוש המשתמש ללא הסיסמה
    const user = await User.findById(userId, { password: 0 });
    
    if (!user) {
      return res.status(404).json({ message: 'משתמש לא נמצא' });
    }

    res.json({ user });
  } catch (error) {
    console.error('Error getting profile:', error);
    res.status(500).json({ message: 'שגיאה בקבלת הפרופיל', error: error.message });
  }
});

// נתיב דיבאג - בדיקת כל המשתמשים (לפיתוח בלבד)
router.get('/users', async (req, res) => {
  try {
    const users = await User.find({}, { password: 0 }); // קבלת כל המשתמשים ללא סיסמאות
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
});

// נתיב דיבאג - יצירת משתמש בדיקה (לפיתוח בלבד)
router.get('/create-test-user', async (req, res) => {
  try {
    console.log('Creating test user...');
    
    // בדיקה אם המשתמש כבר קיים
    const existingUser = await User.findOne({ email: 'test@example.com' });
    if (existingUser) {
      console.log('Test user already exists, updating password...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('test123', 10);
      existingUser.password = hashedPassword;
      await existingUser.save();
      return res.json({ 
        message: 'Test user updated', 
        user: { name: existingUser.name, email: existingUser.email } 
      });
    }
    
    // יצירת משתמש בדיקה חדש
    const bcrypt = require('bcryptjs');
    const hashedPassword = await bcrypt.hash('test123', 10);
    const user = new User({ 
      name: 'Test User', 
      email: 'test@example.com', 
      password: hashedPassword 
    });
    await user.save();
    console.log('Test user created successfully');
    res.json({ message: 'Test user created', user: { name: user.name, email: user.email } });
  } catch (err) {
    console.error('Error creating test user:', err);
    res.status(500).json({ message: 'שגיאת שרת', error: err.message });
  }
});

module.exports = router; 
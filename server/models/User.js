// מודל משתמש - מגדיר את המבנה של משתמש במסד הנתונים

const mongoose = require('mongoose'); // ייבוא ספריית MongoDB

// הגדרת סכמת המשתמש - המבנה של אובייקט משתמש במסד הנתונים
const userSchema = new mongoose.Schema({
  // שדות בסיסיים של המשתמש
  name: { type: String, required: true }, // שם המשתמש - שדה חובה
  email: { type: String, required: true, unique: true }, // אימייל - שדה חובה וייחודי
  password: { type: String, required: true }, // סיסמה מוצפנת - שדה חובה
  
  // פרטי קשר נוספים
  phone: { type: String, default: '' }, // מספר טלפון - שדה אופציונלי
  
  // כתובת המשתמש
  address: {
    street: { type: String, default: '' }, // רחוב
    city: { type: String, default: '' }, // עיר
    postalCode: { type: String, default: '' }, // מיקוד
    country: { type: String, default: 'ישראל' } // מדינה - ברירת מחדל ישראל
  },
  
  // העדפות המשתמש
  preferences: {
    notifications: { type: Boolean, default: true }, // התראות - ברירת מחדל פעיל
    emailUpdates: { type: Boolean, default: true }, // עדכונים באימייל - ברירת מחדל פעיל
    darkMode: { type: Boolean, default: false }, // מצב כהה - ברירת מחדל כבוי
    language: { type: String, default: 'he' } // שפה - ברירת מחדל עברית
  },
  
  // תאריך יצירת המשתמש
  createdAt: { type: Date, default: Date.now } // תאריך יצירה - ברירת מחדל עכשיו
});

// ייצוא המודל - יצירת מודל mongoose מהסכמה
module.exports = mongoose.model('User', userSchema); 
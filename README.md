# 🛒 E-Commerce Full-Stack Application

## 📋 תיאור הפרויקט / Project Description

אפליקציית מסחר אלקטרוני מלאה עם React frontend ו-Node.js backend עם MongoDB. הפרויקט כולל מערכת אימות משתמשים, עגלת קניות, היסטוריית הזמנות וממשק משתמש מודרני.

A full-stack e-commerce application with React frontend and Node.js backend with MongoDB. The project includes user authentication, shopping cart, order history, and a modern user interface.

## 🚀 טכנולוגיות / Technologies

### Frontend (צד לקוח)
- **React** - מסגרת עבודה לממשק משתמש
- **Vite** - כלי בנייה מהיר
- **Zustand** - ניהול מצב (state management)
- **Axios** - לקוח HTTP לבקשות לשרת
- **CSS3** - עיצוב וסגנונות

### Backend (צד שרת)
- **Node.js** - סביבת הרצה
- **Express.js** - מסגרת עבודה לשרת
- **MongoDB** - מסד נתונים
- **JWT** - אימות משתמשים
- **Mongoose** - Object Document Mapper למסד נתונים

## 📁 מבנה הפרויקט / Project Structure

```
Final Proj/
├── client/                 # React Frontend (צד לקוח)
│   ├── src/
│   │   ├── components/    # רכיבי React
│   │   ├── stores/        # ניהול מצב עם Zustand
│   │   └── config/        # הגדרות
│   └── public/            # קבצים סטטיים
├── server/                # Node.js Backend (צד שרת)
│   ├── routes/            # נתיבי API
│   ├── controllers/       # לוגיקה עסקית
│   ├── models/            # מודלים של MongoDB
│   ├── services/          # שירותים חיצוניים
│   ├── dal/              # שכבת גישה לנתונים
│   ├── utils/             # פונקציות עזר
│   └── config/            # הגדרות
└── README.md
```

## 🛠️ התקנה והפעלה / Installation & Setup

### דרישות מקדימות / Prerequisites
- Node.js (גרסה 16 ומעלה)
- MongoDB (מסד נתונים)
- npm או yarn (מנהלי חבילות)

### התקנה / Installation

1. **Clone the repository (שכפול המאגר)**
```bash
git clone <repository-url>
cd Final-Proj
```

2. **Install dependencies (התקנת תלויות)**
```bash
# התקנת תלויות השרת
cd server
npm install

# התקנת תלויות הלקוח
cd ../client
npm install
```

3. **Environment Setup (הגדרת סביבה)**
```bash
# יצירת קובץ .env בתיקיית השרת
cd ../server
cp .env.example .env
```

עריכת קובץ ה-`.env` עם ההגדרות שלך:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
```

4. **Start the application (הפעלת האפליקציה)**
```bash
# הפעלת השרת (מתיקיית השרת)
npm start

# הפעלת הלקוח (מתיקיית הלקוח)
npm run dev
```

האפליקציה תהיה זמינה ב:
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

## 🔧 תכונות / Features

### משתמשים / Users
- ✅ רישום משתמש חדש / User registration
- ✅ התחברות / User login
- ✅ אימות JWT / JWT authentication
- ✅ ניהול פרופיל / Profile management

### מוצרים / Products
- ✅ הצגת מוצרים / Product display
- ✅ חיפוש וסינון / Search and filtering
- ✅ פרטי מוצר / Product details

### עגלת קניות / Shopping Cart
- ✅ הוספת מוצרים לעגלה / Add items to cart
- ✅ עדכון כמות / Update quantities
- ✅ הסרת מוצרים / Remove items
- ✅ חישוב סכום כולל / Total calculation

### הזמנות / Orders
- ✅ יצירת הזמנה / Create order
- ✅ היסטוריית הזמנות / Order history
- ✅ סטטוס הזמנה / Order status

## 🎨 ממשק משתמש / User Interface

- עיצוב מודרני ונגיש / Modern and accessible design
- תגובה מלאה למובייל / Fully responsive mobile design
- ניווט חלק ואינטואיטיבי / Smooth and intuitive navigation
- עגלת קניות מתקדמת / Advanced shopping cart

## 🔒 אבטחה / Security

- אימות JWT / JWT authentication
- הצפנת סיסמאות / Password encryption
- הגנה על נתיבים / Route protection
- אימות נתונים / Data validation

## 📝 API Endpoints (נקודות קצה)

### Authentication (אימות)
- `POST /api/auth/register` - רישום משתמש חדש
- `POST /api/auth/login` - התחברות משתמש

### Products (מוצרים)
- `GET /api/products` - קבלת כל המוצרים
- `GET /api/products/:id` - קבלת מוצר לפי מזהה

### Cart (עגלת קניות)
- `GET /api/cart` - קבלת עגלת המשתמש
- `POST /api/cart` - הוספת פריט לעגלה
- `PUT /api/cart/:id` - עדכון פריט בעגלה
- `DELETE /api/cart/:id` - הסרת פריט מהעגלה

### Orders (הזמנות)
- `POST /api/orders` - יצירת הזמנה
- `GET /api/orders` - קבלת הזמנות המשתמש

## 🤝 תרומה / Contributing

1. Fork the repository (שכפול המאגר)
2. Create your feature branch (יצירת ענף תכונה חדש)
3. Commit your changes (שמירת השינויים)
4. Push to the branch (דחיפה לענף)
5. Open a Pull Request (פתיחת בקשת משיכה)

## 📄 רישיון / License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 מפתח / Developer

**Liron** - Full Stack Developer

---

## 🚀 Deploy (פריסה)

### Frontend Deployment (פריסת צד לקוח)
האפליקציה React יכולה להיות מופצת ב:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment (פריסת צד שרת)
שרת Node.js יכול להיות מופץ ב:
- Heroku
- Railway
- DigitalOcean
- AWS

זכור להגדיר משתני סביבה בפלטפורמת הפריסה שלך!

# 🛒 E-Commerce Full-Stack Application

## 📋 תיאור הפרויקט / Project Description

אפליקציית מסחר אלקטרוני מלאה עם React frontend ו-Node.js backend עם MongoDB. הפרויקט כולל מערכת אימות משתמשים, עגלת קניות, היסטוריית הזמנות וממשק משתמש מודרני.

A full-stack e-commerce application with React frontend and Node.js backend with MongoDB. The project includes user authentication, shopping cart, order history, and a modern user interface.

## 🚀 טכנולוגיות / Technologies

### Frontend
- **React** - UI Framework
- **Vite** - Build tool
- **Zustand** - State management
- **Axios** - HTTP client
- **CSS3** - Styling

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **MongoDB** - Database
- **JWT** - Authentication
- **Mongoose** - ODM

## 📁 מבנה הפרויקט / Project Structure

```
Final Proj/
├── client/                 # React Frontend
│   ├── src/
│   │   ├── components/    # React Components
│   │   ├── stores/        # Zustand Stores
│   │   └── config/        # Configuration
│   └── public/            # Static files
├── server/                # Node.js Backend
│   ├── routes/            # API Routes
│   ├── controllers/       # Business Logic
│   ├── models/            # MongoDB Models
│   ├── services/          # External Services
│   ├── dal/              # Data Access Layer
│   ├── utils/             # Utilities
│   └── config/            # Configuration
└── README.md
```

## 🛠️ התקנה והפעלה / Installation & Setup

### דרישות מקדימות / Prerequisites
- Node.js (v16 or higher)
- MongoDB
- npm or yarn

### התקנה / Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd Final-Proj
```

2. **Install dependencies**
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. **Environment Setup**
```bash
# Create .env file in server directory
cd ../server
cp .env.example .env
```

Edit the `.env` file with your configuration:
```env
PORT=3000
MONGODB_URI=mongodb://localhost:27017/ecommerce
JWT_SECRET=your-secret-key
```

4. **Start the application**
```bash
# Start the server (from server directory)
npm start

# Start the client (from client directory)
npm run dev
```

The application will be available at:
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

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders

## 🤝 תרומה / Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 רישיון / License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 מפתח / Developer

**Liron** - Full Stack Developer

---

## 🚀 Deploy

### Frontend Deployment
The React app can be deployed to:
- Vercel
- Netlify
- GitHub Pages

### Backend Deployment
The Node.js server can be deployed to:
- Heroku
- Railway
- DigitalOcean
- AWS

Remember to set up environment variables on your deployment platform!

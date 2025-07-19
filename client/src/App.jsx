// קובץ האפליקציה הראשי - הרכיב הראשי של האפליקציה

import React, { useState } from 'react'; // ייבוא React ו-hook לניהול state
import { useAuthStore } from './store/authStore'; // ייבוא store לניהול אימות משתמשים
import { useCartStore } from './store/cartStore'; // ייבוא store לניהול עגלת קניות
import Header from './components/Header'; // רכיב כותרת עליונה
import Sidebar from './components/Sidebar'; // רכיב תפריט צד
import Store from './components/Store'; // רכיב החנות
import Cart from './components/Cart'; // רכיב עגלת קניות
import PurchaseHistory from './components/PurchaseHistory'; // רכיב היסטוריית רכישות
import Login from './components/Login'; // רכיב התחברות
import Register from './components/Register'; // רכיב הרשמה
import Settings from './components/Settings'; // רכיב הגדרות
import './App.css'; // ייבוא קובץ הסגנונות

function App() {
  // קבלת נתוני המשתמש והאימות מה-store
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore(); // קבלת פריטי העגלה
  
  // ניהול state של האפליקציה
  const [currentView, setCurrentView] = useState('home'); // תצוגה נוכחית
  const [authView, setAuthView] = useState('login'); // תצוגת אימות (התחברות/הרשמה)

  // חישוב מספר הפריטים בעגלה
  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // אם המשתמש לא מחובר, הצג את הדף הראשי עם כפתור התחברות
  if (!isAuthenticated) {
    return (
      <div className="home-page">
        {/* כותרת הדף הראשי */}
        <header className="home-header">
          <div className="home-header-content">
            <h1 className="home-logo">🛒 ModernStore</h1>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                setCurrentView('auth'); // מעבר לתצוגת אימות
                setAuthView('login'); // הגדרת תצוגת התחברות
              }}
            >
              התחבר
            </button>
          </div>
        </header>
        
        {/* תוכן הדף הראשי */}
        <main className="home-main">
          {currentView === 'home' ? (
            // תצוגת דף הבית
            <div className="home-content">
              {/* אזור גיבור - כותרת ראשית */}
              <div className="hero-section">
                <h1>ברוכים הבאים לחנות המקוונת המודרנית</h1>
                <p>גלה מגוון רחב של מוצרים איכותיים במחירים משתלמים</p>
                <div className="hero-buttons">
                  <button 
                    className="btn btn-primary btn-large"
                    onClick={() => {
                      setCurrentView('auth');
                      setAuthView('login');
                    }}
                  >
                    התחבר עכשיו
                  </button>
                  <button 
                    className="btn btn-outline btn-large"
                    onClick={() => {
                      setCurrentView('auth');
                      setAuthView('register');
                    }}
                  >
                    צור חשבון חדש
                  </button>
                </div>
              </div>
              
              {/* אזור תכונות - למה לבחור בנו */}
              <div className="features-section">
                <h2>למה לבחור בנו?</h2>
                <div className="features-grid">
                  <div className="feature-card">
                    <div className="feature-icon">🚚</div>
                    <h3>משלוח מהיר</h3>
                    <p>משלוח חינם לכל הארץ תוך 24 שעות</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🛡️</div>
                    <h3>קנייה בטוחה</h3>
                    <p>אבטחה מתקדמת לכל העסקאות שלך</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">💎</div>
                    <h3>איכות מובטחת</h3>
                    <p>מוצרים איכותיים עם אחריות מלאה</p>
                  </div>
                  <div className="feature-card">
                    <div className="feature-icon">🎯</div>
                    <h3>מחירים משתלמים</h3>
                    <p>המחירים הטובים ביותר בשוק</p>
                  </div>
                </div>
              </div>
            </div>
          ) : currentView === 'auth' ? (
            // תצוגת אימות - התחברות או הרשמה
            <div className="auth-container">
              <div className="auth-content">
                <div className="auth-header">
                  <h1>🛒 ModernStore</h1>
                  <p>ברוכים הבאים לחנות המקוונת המודרנית</p>
                  <p>יש להתחבר או להירשם כדי להמשיך</p>
                </div>
                
                {authView === 'login' ? (
                  // תצוגת התחברות
                  <>
                    <Login />
                    <div className="auth-divider">
                      <span>או</span>
                    </div>
                    <button 
                      className="btn btn-outline btn-large"
                      onClick={() => setAuthView('register')}
                    >
                      צור חשבון חדש
                    </button>
                    <button 
                      className="btn btn-text"
                      onClick={() => setCurrentView('home')}
                    >
                      ← חזור לדף הראשי
                    </button>
                  </>
                ) : (
                  // תצוגת הרשמה
                  <>
                    <Register onViewChange={setAuthView} />
                    <div className="auth-divider">
                      <span>או</span>
                    </div>
                    <button 
                      className="btn btn-outline btn-large"
                      onClick={() => setAuthView('login')}
                    >
                      יש לך כבר חשבון? התחבר
                    </button>
                    <button 
                      className="btn btn-text"
                      onClick={() => setCurrentView('home')}
                    >
                      ← חזור לדף הראשי
                    </button>
                  </>
                )}
              </div>
            </div>
          ) : null}
        </main>
      </div>
    );
  }

  // פונקציה להצגת התוכן המתאים לפי התצוגה הנוכחית
  const renderContent = () => {
    switch (currentView) {
      case 'store':
        return <Store />; // הצגת החנות
      case 'cart':
        return <Cart onViewChange={setCurrentView} />; // הצגת עגלת קניות
      case 'history':
        return <PurchaseHistory onViewChange={setCurrentView} />; // הצגת היסטוריית רכישות
      case 'profile':
        return (
          // הצגת פרופיל המשתמש
          <div className="profile-container fade-in">
            <div className="profile-header">
              <h1>👤 פרופיל משתמש</h1>
            </div>
            <div className="profile-content">
              <div className="profile-card">
                <h3>פרטי משתמש</h3>
                <div className="profile-info">
                  <p><strong>שם:</strong> {user?.name || 'לא זמין'}</p>
                  <p><strong>אימייל:</strong> {user?.email || 'לא זמין'}</p>
                  <p><strong>טלפון:</strong> {user?.phone ? user.phone : 'לא הוזן'}</p>
                  <p><strong>כתובת:</strong> {user?.address ? 
                    `${user.address.street || ''} ${user.address.city || ''} ${user.address.postalCode || ''} ${user.address.country || ''}`.trim() || 'לא הוזנה' 
                    : 'לא הוזנה'}</p>
                </div>
              </div>
            </div>
          </div>
        );
      case 'settings':
        return <Settings />; // הצגת הגדרות
      default:
        return <Store />; // ברירת מחדל - הצגת החנות
    }
  };

  // החזרת המבנה הראשי של האפליקציה למשתמש מחובר
  return (
    <div className="app">
      {/* כותרת עליונה עם מספר פריטי העגלה */}
      <Header 
        cartItemCount={cartItemCount} 
        onViewChange={setCurrentView}
      />
      <div className="app-content">
        {/* תפריט צד לניווט */}
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        {/* תוכן ראשי */}
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
 
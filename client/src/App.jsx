import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { useCartStore } from './store/cartStore';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Store from './components/Store';
import Cart from './components/Cart';
import PurchaseHistory from './components/PurchaseHistory';
import Login from './components/Login';
import Register from './components/Register';
import Settings from './components/Settings';
import './App.css';

function App() {
  const { user, isAuthenticated } = useAuthStore();
  const { items } = useCartStore();
  const [currentView, setCurrentView] = useState('home');
  const [authView, setAuthView] = useState('login');

  const cartItemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  // אם המשתמש לא מחובר, הצג את הדף הראשי עם כפתור התחברות
  if (!isAuthenticated) {
    return (
      <div className="home-page">
        <header className="home-header">
          <div className="home-header-content">
            <h1 className="home-logo">🛒 ModernStore</h1>
            <button 
              className="btn btn-primary btn-large"
              onClick={() => {
                setCurrentView('auth');
                setAuthView('login');
              }}
            >
              התחבר
            </button>
          </div>
        </header>
        
        <main className="home-main">
          {currentView === 'home' ? (
            <div className="home-content">
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
            <div className="auth-container">
              <div className="auth-content">
                <div className="auth-header">
                  <h1>🛒 ModernStore</h1>
                  <p>ברוכים הבאים לחנות המקוונת המודרנית</p>
                  <p>יש להתחבר או להירשם כדי להמשיך</p>
                </div>
                
                {authView === 'login' ? (
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

  const renderContent = () => {
    switch (currentView) {
      case 'store':
        return <Store />;
      case 'cart':
        return <Cart onViewChange={setCurrentView} />;
      case 'history':
        return <PurchaseHistory onViewChange={setCurrentView} />;
      case 'profile':
        return (
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
        return <Settings />;
      default:
        return <Store />;
    }
  };

  return (
    <div className="app">
      <Header 
        cartItemCount={cartItemCount} 
        onViewChange={setCurrentView}
      />
      <div className="app-content">
        <Sidebar 
          currentView={currentView} 
          onViewChange={setCurrentView} 
        />
        <main className="main-content">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
 
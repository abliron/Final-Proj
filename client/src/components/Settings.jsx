import React, { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaPhone, FaMapMarkerAlt, FaMoon, FaSun, FaBell, FaLock, FaKey, FaSlidersH, FaSave, FaEdit } from 'react-icons/fa';
import { useAuthStore } from '../store/authStore';

const Settings = () => {
  const { user, token, updateUser, getProfile } = useAuthStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [message, setMessage] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: {
      street: user?.address?.street || '',
      city: user?.address?.city || '',
      postalCode: user?.address?.postalCode || '',
      country: user?.address?.country || 'ישראל'
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [preferences, setPreferences] = useState({
    notifications: user?.preferences?.notifications ?? true,
    emailUpdates: user?.preferences?.emailUpdates ?? true,
    darkMode: user?.preferences?.darkMode ?? false,
    language: user?.preferences?.language ?? 'he'
  });

  // Load dark mode preference from localStorage and user preferences
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('darkMode') === 'true' || user?.preferences?.darkMode;
    setIsDarkMode(savedDarkMode);
    setPreferences(prev => ({ ...prev, darkMode: savedDarkMode }));
    applyDarkMode(savedDarkMode);
  }, [user]);

  // Update profile data when user changes
  useEffect(() => {
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      address: {
        street: user?.address?.street || '',
        city: user?.address?.city || '',
        postalCode: user?.address?.postalCode || '',
        country: user?.address?.country || 'ישראל'
      }
    });
  }, [user]);

  useEffect(() => {
    getProfile();
  }, []);

  const applyDarkMode = (isDark) => {
    if (isDark) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(profileData)
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('פרטי הפרופיל עודכנו בהצלחה!');
        updateUser(data.user);
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'שגיאה בעדכון הפרטים');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('שגיאה בעדכון הפרטים. נסה שוב.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('הסיסמאות החדשות אינן תואמות');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage('הסיסמה החדשה חייבת להכיל לפחות 6 תווים');
      return;
    }
    
    setIsLoading(true);
    try {
      const response = await fetch('http://localhost:3000/api/auth/password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword
        })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('הסיסמה שונתה בהצלחה!');
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'שגיאה בשינוי הסיסמה');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage('שגיאה בשינוי הסיסמה. נסה שוב.');
      setTimeout(() => setMessage(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreferenceChange = async (key, value) => {
    const newPreferences = { ...preferences, [key]: value };
    setPreferences(newPreferences);
    
    if (key === 'darkMode') {
      setIsDarkMode(value);
      localStorage.setItem('darkMode', value.toString());
      applyDarkMode(value);
    }
    
    try {
      const response = await fetch('http://localhost:3000/api/auth/preferences', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ [key]: value })
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('העדפות עודכנו בהצלחה!');
        // Update user preferences in store
        updateUser({ ...user, preferences: { ...user.preferences, [key]: value } });
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.message || 'שגיאה בעדכון ההעדפות');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating preferences:', error);
      setMessage('שגיאה בעדכון ההעדפות. נסה שוב.');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  const handleAddressChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      address: {
        ...prev.address,
        [field]: value
      }
    }));
  };

  return (
    <div className="settings-container fade-in">
      <div className="settings-header">
        <h1>⚙️ הגדרות</h1>
        <p>נהל את הפרופיל, הסיסמה והעדפות שלך</p>
      </div>

      {message && (
        <div className={`message ${message.includes('בהצלחה') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}

      {/* Settings Tabs */}
      <div className="settings-tabs">
        <button
          className={`settings-tab ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <FaUser /> פרופיל
        </button>
        <button
          className={`settings-tab ${activeTab === 'password' ? 'active' : ''}`}
          onClick={() => setActiveTab('password')}
        >
          <FaLock /> סיסמה
        </button>
        <button
          className={`settings-tab ${activeTab === 'preferences' ? 'active' : ''}`}
          onClick={() => setActiveTab('preferences')}
        >
          <FaSlidersH /> העדפות
        </button>
      </div>

      {/* Profile Settings */}
      {activeTab === 'profile' && (
        <div className="settings-section">
          <h3>
            <FaUser /> פרטי פרופיל
          </h3>
          <form onSubmit={handleProfileUpdate}>
            <div className="form-group">
              <label>
                <FaUser /> שם מלא
              </label>
              <input
                type="text"
                value={profileData.name}
                onChange={(e) => setProfileData({...profileData, name: e.target.value})}
                placeholder="הכנס את השם המלא שלך"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaEnvelope /> כתובת אימייל
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                placeholder="הכנס את כתובת האימייל שלך"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaPhone /> מספר טלפון
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                placeholder="הכנס את מספר הטלפון שלך"
              />
            </div>

            <div className="address-section">
              <h4>
                <FaMapMarkerAlt /> כתובת למשלוח
              </h4>
              
              <div className="form-group">
                <label>רחוב ומספר בית</label>
                <input
                  type="text"
                  value={profileData.address.street}
                  onChange={(e) => handleAddressChange('street', e.target.value)}
                  placeholder="רחוב ומספר בית"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>עיר</label>
                  <input
                    type="text"
                    value={profileData.address.city}
                    onChange={(e) => handleAddressChange('city', e.target.value)}
                    placeholder="עיר"
                  />
                </div>

                <div className="form-group">
                  <label>מיקוד</label>
                  <input
                    type="text"
                    value={profileData.address.postalCode}
                    onChange={(e) => handleAddressChange('postalCode', e.target.value)}
                    placeholder="מיקוד"
                  />
                </div>
              </div>

              <div className="form-group">
                <label>מדינה</label>
                <input
                  type="text"
                  value={profileData.address.country}
                  onChange={(e) => handleAddressChange('country', e.target.value)}
                  placeholder="מדינה"
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <FaSave /> {isLoading ? 'שומר...' : 'שמור שינויים'}
            </button>
          </form>
        </div>
      )}

      {/* Password Settings */}
      {activeTab === 'password' && (
        <div className="settings-section">
          <h3>
            <FaKey /> שינוי סיסמה
          </h3>
          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label>
                <FaLock /> סיסמה נוכחית
              </label>
              <input
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="הכנס את הסיסמה הנוכחית שלך"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> סיסמה חדשה
              </label>
              <input
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="הכנס סיסמה חדשה (לפחות 6 תווים)"
                required
              />
            </div>

            <div className="form-group">
              <label>
                <FaLock /> אימות סיסמה חדשה
              </label>
              <input
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                placeholder="הכנס שוב את הסיסמה החדשה"
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" disabled={isLoading}>
              <FaKey /> {isLoading ? 'משנה...' : 'שנה סיסמה'}
            </button>
          </form>
        </div>
      )}

      {/* Preferences Settings */}
      {activeTab === 'preferences' && (
        <div className="settings-section">
          <h3>
            <FaSlidersH /> העדפות מערכת
          </h3>
          
          <div className="preferences-list">
            <div className="preference-item">
              <div className="preference-info">
                <h4>
                  <FaBell /> התראות מערכת
                </h4>
                <p>קבל התראות על הזמנות חדשות ועדכונים</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.notifications}
                  onChange={(e) => handlePreferenceChange('notifications', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h4>
                  <FaEnvelope /> עדכונים באימייל
                </h4>
                <p>קבל עדכונים על הזמנות באימייל</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={preferences.emailUpdates}
                  onChange={(e) => handlePreferenceChange('emailUpdates', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h4>
                  {isDarkMode ? <FaSun /> : <FaMoon />} מצב כהה
                </h4>
                <p>החלף בין עיצוב בהיר לעיצוב כהה</p>
              </div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={(e) => handlePreferenceChange('darkMode', e.target.checked)}
                />
                <span className="slider"></span>
              </label>
            </div>

            <div className="preference-item">
              <div className="preference-info">
                <h4>
                  <FaEdit /> שפה
                </h4>
                <p>בחר את שפת הממשק</p>
              </div>
              <select
                value={preferences.language}
                onChange={(e) => handlePreferenceChange('language', e.target.value)}
                className="language-select"
              >
                <option value="he">עברית</option>
                <option value="en">English</option>
                <option value="ar">العربية</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings; 
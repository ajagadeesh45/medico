import React, { useState } from 'react';

// ── Screens ──
import SplashScreen      from './screens/SplashScreen';
import AuthScreen        from './screens/AuthScreen';
import HomeScreen        from './screens/HomeScreen';
import MapScreen         from './screens/MapScreen';
import ChatbotScreen     from './screens/ChatbotScreen';
import DoctorListScreen  from './screens/DoctorListScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import EmergencyScreen   from './screens/EmergencyScreen';
import RecordsScreen     from './screens/RecordsScreen';
import ProfileScreen     from './screens/ProfileScreen';
import OwnerDashboard    from './screens/OwnerDashboard';

// ── Components ──
import Toast from './components/Toast';

export default function App() {

  // ── Current screen ──
  const [screen, setScreen] = useState('splash');

  // ── Screen history for back button ──
  const [history, setHistory] = useState([]);

  // ── Logged in user ──
  const [user, setUser] = useState(null);

  // ── Toast message ──
  const [toast, setToast] = useState({ show: false, msg: '' });

  // ── Current doctor selected ──
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // ─────────────────────────────────────
  // Navigate to a screen
  // ─────────────────────────────────────
  const navigate = (to) => {
    const ROOT_SCREENS = [
      'home', 'map', 'chatbot',
      'doctors', 'profile', 'owner'
    ];
    if (!ROOT_SCREENS.includes(to)) {
      setHistory(h => [...h, to]);
    } else {
      setHistory([]);
    }
    setScreen(to);
  };

  // ─────────────────────────────────────
  // Go back to previous screen
  // ─────────────────────────────────────
  const goBack = () => {
    setHistory(h => {
      const newH = [...h];
      newH.pop();
      const prev = newH[newH.length - 1];
      setScreen(
        prev || (user?.role === 'doctor' ? 'owner' : 'home')
      );
      return newH;
    });
  };

  // ─────────────────────────────────────
  // Show toast notification
  // ─────────────────────────────────────
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  // ─────────────────────────────────────
  // Login handler
  // ─────────────────────────────────────
  const handleLogin = (userData) => {
    setUser(userData);
    if (userData.role === 'doctor') {
      navigate('owner');
    } else {
      navigate('home');
    }
    showToast('👋 Welcome, ' + userData.name + '!');
  };

  // ─────────────────────────────────────
  // Logout handler
  // ─────────────────────────────────────
  const handleLogout = () => {
    setUser(null);
    setHistory([]);
    navigate('auth');
    showToast('👋 Logged out successfully');
  };

  // ─────────────────────────────────────
  // Open doctor profile
  // ─────────────────────────────────────
  const openDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    navigate('docProfile');
  };

  // ─────────────────────────────────────
  // Shared props passed to every screen
  // ─────────────────────────────────────
  const sharedProps = {
    navigate,
    goBack,
    showToast,
    user,
    handleLogin,
    handleLogout,
    openDoctor,
    selectedDoctor,
  };

  // ─────────────────────────────────────
  // Render correct screen
  // ─────────────────────────────────────
  return (
    <div>

      {/* Toast notification */}
      {toast.show && <Toast msg={toast.msg} />}

      {/* Screens */}
      {screen === 'splash'     && <SplashScreen     {...sharedProps} />}
      {screen === 'auth'       && <AuthScreen        {...sharedProps} />}
      {screen === 'home'       && <HomeScreen        {...sharedProps} />}
      {screen === 'map'        && <MapScreen         {...sharedProps} />}
      {screen === 'chatbot'    && <ChatbotScreen     {...sharedProps} />}
      {screen === 'doctors'    && <DoctorListScreen  {...sharedProps} />}
      {screen === 'docProfile' && <DoctorProfileScreen {...sharedProps} />}
      {screen === 'emergency'  && <EmergencyScreen   {...sharedProps} />}
      {screen === 'records'    && <RecordsScreen     {...sharedProps} />}
      {screen === 'profile'    && <ProfileScreen     {...sharedProps} />}
      {screen === 'owner'      && <OwnerDashboard    {...sharedProps} />}

    </div>
  );
}
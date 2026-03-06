import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';

import SplashScreen        from './screens/SplashScreen';
import AuthScreen          from './screens/AuthScreen';
import HomeScreen          from './screens/HomeScreen';
import MapScreen           from './screens/MapScreen';
import ChatbotScreen       from './screens/ChatbotScreen';
import DoctorListScreen    from './screens/DoctorListScreen';
import DoctorProfileScreen from './screens/DoctorProfileScreen';
import EmergencyScreen     from './screens/EmergencyScreen';
import RecordsScreen       from './screens/RecordsScreen';
import ProfileScreen       from './screens/ProfileScreen';
import OwnerDashboard      from './screens/OwnerDashboard';
import Toast               from './components/Toast';

export default function App() {

  const [screen, setScreen]                 = useState('splash');
  const [history, setHistory]               = useState([]);
  const [user, setUser]                     = useState(null);
  const [toast, setToast]                   = useState({ show: false, msg: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  // ── Check if already logged in ──
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            const userData = {
              id:    session.user.id,
              name:  profile?.full_name || session.user.email.split('@')[0],
              email: session.user.email,
              phone: profile?.phone || '',
              role:  profile?.role  || 'patient',
            };
            setUser(userData);
            setScreen(userData.role === 'doctor' ? 'owner' : 'home');
          });
      }
    });
  }, []);

  // ── Navigate ──
  const navigate = (to) => {
    setHistory(h => [...h, screen]);
    setScreen(to);
  };

  // ── Go back ──
  const goBack = () => {
    if (history.length === 0) {
      setScreen('home');
      return;
    }
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setScreen(prev);
  };

  // ── Toast ──
  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  // ── Login ──
  const handleLogin = (userData) => {
    console.log('handleLogin called with:', userData);
    setUser(userData);
    setHistory([]);
    setScreen(userData.role === 'doctor' ? 'owner' : 'home');
    showToast('👋 Welcome, ' + userData.name + '!');
  };

  // ── Logout ──
  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHistory([]);
    setScreen('auth');
    showToast('👋 Logged out successfully');
  };

  // ── Open doctor ──
  const openDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    navigate('docProfile');
  };

  // ── Shared props ──
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

  // ── Show back button on all screens except these ──
  const noBackScreens = ['splash', 'auth', 'home'];
  const showBackBtn   = !noBackScreens.includes(screen);

  return (
    <div>

      {/* Toast */}
      {toast.show && <Toast msg={toast.msg}/>}

      {/* ── Floating Back Button ── */}
      {showBackBtn && (
        <button
          onClick={goBack}
          style={{
            position:        'fixed',
            top:             '16px',
            left:            'calc(50% - 210px + 16px)',
            width:           '42px',
            height:          '42px',
            borderRadius:    '50%',
            background:      'rgba(10,47,110,0.9)',
            border:          'none',
            color:           '#fff',
            fontSize:        '20px',
            cursor:          'pointer',
            zIndex:          '9999',
            display:         'flex',
            alignItems:      'center',
            justifyContent:  'center',
            boxShadow:       '0 4px 16px rgba(10,47,110,0.35)',
            backdropFilter:  'blur(8px)',
            transition:      'transform 0.15s',
          }}
        >
          ←
        </button>
      )}

      {/* ── Screens ── */}
      {screen === 'splash'     && <SplashScreen        {...sharedProps}/>}
      {screen === 'auth'       && <AuthScreen          {...sharedProps}/>}
      {screen === 'home'       && <HomeScreen          {...sharedProps}/>}
      {screen === 'map'        && <MapScreen           {...sharedProps}/>}
      {screen === 'chatbot'    && <ChatbotScreen       {...sharedProps}/>}
      {screen === 'doctors'    && <DoctorListScreen    {...sharedProps}/>}
      {screen === 'docProfile' && <DoctorProfileScreen {...sharedProps}/>}
      {screen === 'emergency'  && <EmergencyScreen     {...sharedProps}/>}
      {screen === 'records'    && <RecordsScreen       {...sharedProps}/>}
      {screen === 'profile'    && <ProfileScreen       {...sharedProps}/>}
      {screen === 'owner'      && <OwnerDashboard      {...sharedProps}/>}

    </div>
  );
}
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
import VideoCallScreen     from './screens/VideoCallScreen';
import Toast               from './components/Toast';

export default function App() {

  const [screen, setScreen]                 = useState('splash');
  const [history, setHistory]               = useState([]);
  const [user, setUser]                     = useState(null);
  const [toast, setToast]                   = useState({ show: false, msg: '' });
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const routeByRole = (role) => role === 'doctor' ? 'owner' : 'home';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        supabase.from('profiles').select('*').eq('id', session.user.id).single()
          .then(({ data: profile }) => {
            const userData = {
              id:    session.user.id,
              name:  profile?.full_name || session.user.email.split('@')[0],
              email: session.user.email,
              phone: profile?.phone || '',
              role:  profile?.role  || 'patient',
            };
            setUser(userData);
            setScreen(routeByRole(userData.role));
          });
      }
    });
  }, []);

  const navigate = (to) => {
    setHistory(h => [...h, screen]);
    setScreen(to);
  };

  const goBack = () => {
    if (history.length === 0) { setScreen(routeByRole(user?.role)); return; }
    const prev = history[history.length - 1];
    setHistory(h => h.slice(0, -1));
    setScreen(prev);
  };

  const showToast = (msg) => {
    setToast({ show: true, msg });
    setTimeout(() => setToast({ show: false, msg: '' }), 2500);
  };

  const handleLogin = (userData) => {
    setUser(userData);
    setHistory([]);
    setScreen(routeByRole(userData.role));
    showToast('👋 Welcome, ' + userData.name + '!');
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setHistory([]);
    setScreen('auth');
    showToast('👋 Logged out successfully');
  };

  const openDoctor = (doctor) => {
    setSelectedDoctor(doctor);
    navigate('docProfile');
  };

  const sharedProps = {
    navigate, goBack, showToast,
    user, handleLogin, handleLogout,
    openDoctor, selectedDoctor,
  };

  const isDoctor  = user?.role === 'doctor';
  const isPatient = !isDoctor;

  return (
    <div>
      {toast.show && <Toast msg={toast.msg} />}

      {screen === 'splash'     && <SplashScreen        {...sharedProps} />}
      {screen === 'auth'       && <AuthScreen          {...sharedProps} />}

      {/* Patient screens */}
      {screen === 'home'       && isPatient && <HomeScreen          {...sharedProps} />}
      {screen === 'map'        && isPatient && <MapScreen           {...sharedProps} />}
      {screen === 'chatbot'    && isPatient && <ChatbotScreen       {...sharedProps} />}
      {screen === 'doctors'    && isPatient && <DoctorListScreen    {...sharedProps} />}
      {screen === 'docProfile' && isPatient && <DoctorProfileScreen {...sharedProps} />}
      {screen === 'emergency'  && isPatient && <EmergencyScreen     {...sharedProps} />}
      {screen === 'records'    && isPatient && <RecordsScreen       {...sharedProps} />}
      {screen === 'profile'    && isPatient && <ProfileScreen       {...sharedProps} />}
      {screen === 'videoCall'  && isPatient && <VideoCallScreen     {...sharedProps} />}

      {/* Doctor screen */}
      {screen === 'owner'      && isDoctor  && <OwnerDashboard      {...sharedProps} />}
      {screen === 'videoCall'  && isDoctor  && <VideoCallScreen     {...sharedProps} />}

      {/* Safety redirects */}
      {screen === 'owner' && isPatient && (() => { setScreen('home');  return null; })()}
      {screen === 'home'  && isDoctor  && (() => { setScreen('owner'); return null; })()}
    </div>
  );
}
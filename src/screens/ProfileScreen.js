import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';
import { useLang } from '../LanguageContext';
import { LANGUAGES } from '../translations';

export default function ProfileScreen({ navigate, user, handleLogout, openLangPicker }) {
  const { t, lang, switchLang } = useLang();
  const [activeTab, setActiveTab] = useState('profile');

  const currentLang = LANGUAGES.find(l => l.code === lang);

  const menuItems = [
    { icon: '📋', label: 'Health Records',     action: () => navigate('records')   },
    { icon: '📅', label: 'My Appointments',    action: () => navigate('records')   },
    { icon: '🚨', label: 'Emergency SOS',      action: () => navigate('emergency') },
    { icon: '💊', label: 'Medicine Reminders', action: () => {} },
    { icon: '🔔', label: 'Notifications',      action: () => {} },
    { icon: '🔒', label: 'Privacy & Security', action: () => {} },
    { icon: '❓', label: 'Help & Support',     action: () => {} },
  ];

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding: '40px 20px 20px', display: 'flex', alignItems: 'center', gap: '14px', flexShrink: '0' }}>
        <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: '0' }}>🙋</div>
        <div style={{ flex: '1' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#fff' }}>{user?.name || 'Patient'}</div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{user?.email || ''}</div>
          <div style={{ fontSize: '11px', color: '#00C896', marginTop: '3px', fontWeight: '600' }}>✅ Verified Patient</div>
        </div>
        {/* Language quick toggle */}
        <div
          onClick={openLangPicker}
          style={{
            background: 'rgba(255,255,255,0.15)', borderRadius: '10px',
            padding: '6px 10px', cursor: 'pointer', textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '16px' }}>{currentLang?.flag || '🌐'}</div>
          <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.7)', fontWeight: '700', marginTop: '2px' }}>{currentLang?.name || 'EN'}</div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #EEF2FF', flexShrink: '0' }}>
        {[
          { id: 'profile',  label: '👤 Profile'  },
          { id: 'language', label: '🌐 Language' },
          { id: 'settings', label: '⚙️ Settings' },
        ].map(tab => (
          <div key={tab.id} onClick={() => setActiveTab(tab.id)} style={{
            flex: '1', padding: '12px 4px', textAlign: 'center',
            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
            color: activeTab === tab.id ? '#0A2F6E' : '#9BA8C9',
            borderBottom: activeTab === tab.id ? '2px solid #0A2F6E' : '2px solid transparent',
          }}>{tab.label}</div>
        ))}
      </div>

      <div style={{ flex: '1', overflowY: 'auto', paddingBottom: '72px' }}>

        {/* ── PROFILE TAB ── */}
        {activeTab === 'profile' && (
          <div style={{ padding: '16px' }}>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', marginBottom: '20px' }}>
              {[
                { icon: '🩺', label: 'Consultations', value: '0'  },
                { icon: '💊', label: 'Prescriptions', value: '0'  },
                { icon: '🩸', label: 'Blood Group',   value: 'N/A'},
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '14px 10px', textAlign: 'center', boxShadow: '0 2px 8px rgba(10,47,110,0.06)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#0A2F6E' }}>{s.value}</div>
                  <div style={{ fontSize: '10px', color: '#9BA8C9', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Menu */}
            <div style={{ background: '#fff', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 2px 8px rgba(10,47,110,0.06)', marginBottom: '16px' }}>
              {menuItems.map((item, i) => (
                <div key={i} onClick={item.action} style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '15px 16px', borderBottom: i < menuItems.length - 1 ? '1px solid #F4F8FF' : 'none', cursor: 'pointer' }}>
                  <span style={{ fontSize: '20px', width: '28px', textAlign: 'center' }}>{item.icon}</span>
                  <span style={{ flex: '1', fontSize: '14px', fontWeight: '600', color: '#0D1B3E' }}>{item.label}</span>
                  <span style={{ fontSize: '16px', color: '#CBD5E1' }}>›</span>
                </div>
              ))}
            </div>

            {/* Logout */}
            <div onClick={handleLogout} style={{ background: '#FFF0F0', borderRadius: '14px', padding: '15px 16px', display: 'flex', alignItems: 'center', gap: '14px', cursor: 'pointer' }}>
              <span style={{ fontSize: '20px' }}>🚪</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#FF4757' }}>{t.logout}</span>
            </div>
          </div>
        )}

        {/* ── LANGUAGE TAB ── */}
        {activeTab === 'language' && (
          <div style={{ padding: '16px' }}>
            <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '12px 14px', marginBottom: '16px', fontSize: '13px', color: '#5A6A8A', lineHeight: '1.6' }}>
              🌐 Select your preferred language. The entire app will switch instantly.
            </div>

            {/* Current language */}
            <div style={{ background: '#fff', borderRadius: '14px', padding: '14px 16px', marginBottom: '16px', boxShadow: '0 2px 8px rgba(10,47,110,0.06)', display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '28px' }}>{currentLang?.flag}</span>
              <div style={{ flex: '1' }}>
                <div style={{ fontSize: '11px', color: '#9BA8C9', fontWeight: '700', textTransform: 'uppercase', marginBottom: '2px' }}>Current Language</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800', color: '#0A2F6E' }}>{currentLang?.native}</div>
                <div style={{ fontSize: '12px', color: '#9BA8C9' }}>{currentLang?.name}</div>
              </div>
              <div style={{ background: '#E8FFF7', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '700', color: '#00A878' }}>Active ✓</div>
            </div>

            {/* All languages grid */}
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', fontWeight: '800', color: '#0D1B3E', marginBottom: '12px' }}>
              All Languages
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '16px' }}>
              {LANGUAGES.map(l => (
                <div
                  key={l.code}
                  onClick={() => {
                    switchLang(l.code);
                  }}
                  style={{
                    borderRadius: '12px', padding: '12px 10px',
                    cursor: 'pointer', textAlign: 'center',
                    background:  lang === l.code ? '#0A2F6E' : '#F4F8FF',
                    border:      lang === l.code ? '2px solid #0A2F6E' : '2px solid #EEF2FF',
                    boxShadow:   lang === l.code ? '0 4px 14px rgba(10,47,110,0.2)' : 'none',
                  }}
                >
                  <div style={{ fontSize: '20px', marginBottom: '3px' }}>{l.flag}</div>
                  <div style={{
                    fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800',
                    color: lang === l.code ? '#fff' : '#0D1B3E', marginBottom: '1px',
                  }}>{l.native}</div>
                  <div style={{ fontSize: '10px', color: lang === l.code ? 'rgba(255,255,255,0.7)' : '#9BA8C9' }}>{l.name}</div>
                  {lang === l.code && <div style={{ fontSize: '12px', color: '#00C896', marginTop: '2px', fontWeight: '800' }}>✓</div>}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── SETTINGS TAB ── */}
        {activeTab === 'settings' && (
          <div style={{ padding: '16px' }}>
            {[
              { icon: '🔔', label: 'Push Notifications',  sub: 'Appointment reminders' },
              { icon: '🌙', label: 'Dark Mode',           sub: 'Coming soon'          },
              { icon: '📍', label: 'Location Access',     sub: 'For hospital map'     },
              { icon: '🔒', label: 'Privacy Settings',    sub: 'Data & permissions'   },
              { icon: '📱', label: 'App Version',         sub: 'NadiDoc v1.0.0'       },
            ].map((item, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '14px 16px', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 2px 8px rgba(10,47,110,0.06)' }}>
                <span style={{ fontSize: '22px', width: '32px', textAlign: 'center' }}>{item.icon}</span>
                <div style={{ flex: '1' }}>
                  <div style={{ fontSize: '14px', fontWeight: '700', color: '#0D1B3E' }}>{item.label}</div>
                  <div style={{ fontSize: '12px', color: '#9BA8C9', marginTop: '2px' }}>{item.sub}</div>
                </div>
                <span style={{ fontSize: '16px', color: '#CBD5E1' }}>›</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <BottomNav active="profile" navigate={navigate} />
    </div>
  );
}
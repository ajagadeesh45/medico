import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import BottomNav from '../components/BottomNav';
import { useLang } from '../LanguageContext';
import { LANGUAGES } from '../translations';

const isOnline = (online_at) => {
  if (!online_at) return false;
  return (Date.now() - new Date(online_at).getTime()) < 2 * 60 * 1000;
};

const doctorName = (full_name) => (full_name || 'Unknown').replace(/^Dr\.?\s*/i, '').trim();

export default function HomeScreen({ navigate, user, openLangPicker }) {
  const { t, lang } = useLang();
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === lang);
  const hour = new Date().getHours();
  const greeting = hour < 12 ? t.goodMorning : hour < 17 ? t.goodAfternoon : t.goodEvening;

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, specialty, city, consultation_fee, experience, online_at')
      .eq('role', 'doctor')
      .then(({ data }) => {
        const sorted = (data || []).sort((a, b) =>
          (isOnline(b.online_at) ? 1 : 0) - (isOnline(a.online_at) ? 1 : 0)
        );
        setDoctors(sorted);
        setLoading(false);
      });
  }, []);

  const getAvatar = (name) => ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'][(name || 'A').charCodeAt(0) % 3];

  const quickActions = [
    { icon: '👨‍⚕️', label: t.findDoctors,  color: '#EEF2FF', iconBg: '#0A2F6E', screen: 'doctors'   },
    { icon: '🤖',   label: t.aiChat,        color: '#E8FFF7', iconBg: '#00A878', screen: 'chatbot'   },
    { icon: '🗺️',  label: t.hospitalMap,   color: '#FFF3E8', iconBg: '#FF6B35', screen: 'map'       },
    { icon: '🚨',   label: t.emergencySOS,  color: '#FFE8E8', iconBg: '#FF4757', screen: 'emergency' },
  ];

  return (
    <div style={{ position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto', display: 'flex', flexDirection: 'column', background: '#F4F8FF' }}>
      <div style={{ flex: '1', overflowY: 'auto', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding: '40px 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{greeting} 👋</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                {user?.name || 'Welcome'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{t.howFeeling}</div>
            </div>

            {/* 3-dots menu */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setMenuOpen(o => !o)}
                style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255,255,255,0.15)', border: 'none', color: '#fff', fontSize: '18px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              >⋮</button>

              {menuOpen && (
                <>
                  {/* backdrop */}
                  <div onClick={() => setMenuOpen(false)} style={{ position: 'fixed', inset: '0', zIndex: 98 }}/>
                  {/* dropdown */}
                  <div style={{ position: 'absolute', top: '46px', right: '0', background: '#fff', borderRadius: '14px', boxShadow: '0 8px 32px rgba(10,47,110,0.18)', zIndex: 99, minWidth: '180px', overflow: 'hidden' }}>
                    <div
                      onClick={() => { setMenuOpen(false); openLangPicker(); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', cursor: 'pointer', borderBottom: '1px solid #F4F8FF' }}
                    >
                      <span style={{ fontSize: '18px' }}>{currentLang?.flag || '🌐'}</span>
                      <div>
                        <div style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B3E' }}>Language</div>
                        <div style={{ fontSize: '11px', color: '#9BA8C9' }}>{currentLang?.native} · {currentLang?.name}</div>
                      </div>
                    </div>
                    <div
                      onClick={() => { setMenuOpen(false); navigate('profile'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', cursor: 'pointer', borderBottom: '1px solid #F4F8FF' }}
                    >
                      <span style={{ fontSize: '18px' }}>👤</span>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B3E' }}>My Profile</div>
                    </div>
                    <div
                      onClick={() => { setMenuOpen(false); navigate('records'); }}
                      style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '13px 16px', cursor: 'pointer' }}
                    >
                      <span style={{ fontSize: '18px' }}>📋</span>
                      <div style={{ fontSize: '13px', fontWeight: '700', color: '#0D1B3E' }}>Health Records</div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div onClick={() => navigate('doctors')} style={{ marginTop: '16px', display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.12)', borderRadius: '12px', padding: '12px 16px', gap: '10px', cursor: 'pointer', border: '1px solid rgba(255,255,255,0.15)' }}>
            <span>🔍</span>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>{t.searchDoctors}</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800', color: '#0D1B3E', marginBottom: '12px' }}>{t.quickActions}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {quickActions.map((a, i) => (
              <div key={i} onClick={() => navigate(a.screen)} style={{ background: a.color, borderRadius: '16px', padding: '16px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(10,47,110,0.06)' }}>
                <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: a.iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '10px' }}>{a.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800', color: '#0D1B3E', whiteSpace: 'pre-line', lineHeight: '1.3' }}>{a.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Doctors */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800', color: '#0D1B3E' }}>{t.availableDoctors}</div>
            {doctors.length > 0 && <div onClick={() => navigate('doctors')} style={{ fontSize: '13px', color: '#0A2F6E', fontWeight: '700', cursor: 'pointer' }}>{t.seeAll}</div>}
          </div>

          {loading && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1,2].map(i => <div key={i} style={{ flex: '1', height: '130px', borderRadius: '16px', background: '#E8EDF8' }}/>)}
            </div>
          )}

          {!loading && doctors.length === 0 && (
            <div style={{ background: '#fff', borderRadius: '16px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 2px 12px rgba(10,47,110,0.06)' }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🩺</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#0A2F6E', marginBottom: '6px' }}>{t.doctorsJoiningSoon}</div>
              <div style={{ fontSize: '12px', color: '#9BA8C9', lineHeight: '1.6', marginBottom: '12px' }}>{t.doctorsJoiningDesc}</div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#0A2F6E', animation: 'bounce 1.2s ease-in-out infinite', animationDelay: i * 0.2 + 's' }}/>)}
              </div>
              <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
            </div>
          )}

          {!loading && doctors.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {doctors.map(doc => {
                const online = isOnline(doc.online_at);
                const name   = doctorName(doc.full_name);
                return (
                  <div key={doc.id} onClick={() => navigate('doctors')} style={{ background: '#fff', borderRadius: '16px', padding: '16px', minWidth: '140px', maxWidth: '140px', flexShrink: '0', boxShadow: online ? '0 4px 16px rgba(0,200,150,0.15)' : '0 2px 12px rgba(10,47,110,0.08)', cursor: 'pointer', textAlign: 'center', border: online ? '1.5px solid #00C896' : '1.5px solid transparent' }}>
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                      <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: '#EEF2FF', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>{getAvatar(doc.full_name)}</div>
                      <div style={{ position: 'absolute', bottom: '1px', right: '1px', width: '13px', height: '13px', borderRadius: '50%', background: online ? '#00C896' : '#CBD5E1', border: '2px solid #fff', boxShadow: online ? '0 0 6px rgba(0,200,150,0.6)' : 'none' }}/>
                    </div>
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800', color: '#0D1B3E', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Dr. {name.split(' ')[0]}</div>
                    <div style={{ fontSize: '11px', color: '#9BA8C9', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{doc.specialty || 'General'}</div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: online ? '#00A878' : '#94A3B8' }}>{online ? t.online : t.offline}</div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Banner */}
        <div style={{ padding: '20px 16px' }}>
          <div onClick={() => navigate('chatbot')} style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', borderRadius: '16px', padding: '16px', display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', flexShrink: '0' }}>🤖</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', fontWeight: '800', color: '#fff' }}>{t.aiAssistant}</div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>{t.aiAssistantDesc}</div>
            </div>
            <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}>›</span>
          </div>
        </div>
      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}
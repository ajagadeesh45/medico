import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import BottomNav from '../components/BottomNav';

const isOnline = (online_at) => {
  if (!online_at) return false;
  return (Date.now() - new Date(online_at).getTime()) < 2 * 60 * 1000;
};

// Smart name display — remove "Dr." prefix if already in name
const doctorName = (full_name) => {
  if (!full_name) return 'Unknown';
  const cleaned = full_name.replace(/^Dr\.?\s*/i, '').trim();
  return cleaned;
};

export default function HomeScreen({ navigate, user }) {

  const [doctors, setDoctors]     = useState([]);
  const [loadingDocs, setLoading] = useState(true);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good Morning' : hour < 17 ? 'Good Afternoon' : 'Good Evening';

  useEffect(() => {
    supabase
      .from('profiles')
      .select('id, full_name, specialty, city, consultation_fee, experience, online_at')
      .eq('role', 'doctor')
      .then(({ data }) => {
        // Sort: online first, then offline
        const sorted = (data || []).sort((a, b) => {
          const aOnline = isOnline(a.online_at) ? 1 : 0;
          const bOnline = isOnline(b.online_at) ? 1 : 0;
          return bOnline - aOnline;
        });
        setDoctors(sorted);
        setLoading(false);
      });
  }, []);

  const getAvatar = (name) => {
    const list = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'];
    return list[(name || 'A').charCodeAt(0) % list.length];
  };

  const quickActions = [
    { icon: '👨‍⚕️', label: 'Find\nDoctors',  color: '#EEF2FF', iconBg: '#0A2F6E', screen: 'doctors'   },
    { icon: '🤖',   label: 'AI\nChat',        color: '#E8FFF7', iconBg: '#00A878', screen: 'chatbot'   },
    { icon: '🗺️',  label: 'Hospital\nMap',   color: '#FFF3E8', iconBg: '#FF6B35', screen: 'map'       },
    { icon: '🚨',   label: 'Emergency\nSOS', color: '#FFE8E8', iconBg: '#FF4757', screen: 'emergency' },
  ];

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>

      {/* Scrollable area — enough bottom padding for BottomNav */}
      <div style={{ flex: '1', overflowY: 'auto', paddingBottom: '80px' }}>

        {/* Header */}
        <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding: '40px 20px 24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '4px' }}>{greeting} 👋</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', color: '#fff' }}>
                {user?.name || 'Welcome'}
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginTop: '2px' }}>How are you feeling today?</div>
            </div>
            <div
              onClick={() => navigate('profile')}
              style={{
                width: '44px', height: '44px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.15)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '22px', cursor: 'pointer',
              }}
            >🙋</div>
          </div>

          {/* Search bar */}
          <div
            onClick={() => navigate('doctors')}
            style={{
              marginTop: '16px', display: 'flex', alignItems: 'center',
              background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
              padding: '12px 16px', gap: '10px', cursor: 'pointer',
              border: '1px solid rgba(255,255,255,0.15)',
            }}
          >
            <span>🔍</span>
            <span style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)' }}>Search doctors, symptoms...</span>
          </div>
        </div>

        {/* Quick Actions */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800', color: '#0D1B3E', marginBottom: '12px' }}>
            Quick Actions
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            {quickActions.map((a, i) => (
              <div key={i} onClick={() => navigate(a.screen)} style={{
                background: a.color, borderRadius: '16px', padding: '16px',
                cursor: 'pointer', boxShadow: '0 2px 8px rgba(10,47,110,0.06)',
              }}>
                <div style={{
                  width: '42px', height: '42px', borderRadius: '12px', background: a.iconBg,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '22px', marginBottom: '10px',
                }}>{a.icon}</div>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800', color: '#0D1B3E', whiteSpace: 'pre-line', lineHeight: '1.3' }}>
                  {a.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Available Doctors */}
        <div style={{ padding: '20px 16px 0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800', color: '#0D1B3E' }}>
              Available Doctors
            </div>
            {doctors.length > 0 && (
              <div onClick={() => navigate('doctors')} style={{ fontSize: '13px', color: '#0A2F6E', fontWeight: '700', cursor: 'pointer' }}>
                See All →
              </div>
            )}
          </div>

          {/* Loading shimmer */}
          {loadingDocs && (
            <div style={{ display: 'flex', gap: '12px' }}>
              {[1,2].map(i => (
                <div key={i} style={{ flex: '1', height: '130px', borderRadius: '16px', background: '#E8EDF8' }}/>
              ))}
            </div>
          )}

          {/* No doctors */}
          {!loadingDocs && doctors.length === 0 && (
            <div style={{
              background: '#fff', borderRadius: '16px', padding: '28px 20px',
              textAlign: 'center', boxShadow: '0 2px 12px rgba(10,47,110,0.06)',
            }}>
              <div style={{ fontSize: '44px', marginBottom: '10px' }}>🩺</div>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#0A2F6E', marginBottom: '6px' }}>
                Doctors Joining Soon!
              </div>
              <div style={{ fontSize: '12px', color: '#9BA8C9', lineHeight: '1.6', marginBottom: '12px' }}>
                Verified doctors are setting up their profiles.
              </div>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '6px' }}>
                {[0,1,2].map(i => (
                  <div key={i} style={{
                    width: '8px', height: '8px', borderRadius: '50%', background: '#0A2F6E',
                    animation: 'bounce 1.2s ease-in-out infinite',
                    animationDelay: i * 0.2 + 's',
                  }}/>
                ))}
              </div>
              <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
            </div>
          )}

          {/* Doctor cards — horizontal scroll */}
          {!loadingDocs && doctors.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '4px' }}>
              {doctors.map(doc => {
                const online = isOnline(doc.online_at);
                const name   = doctorName(doc.full_name);
                return (
                  <div
                    key={doc.id}
                    onClick={() => navigate('doctors')}
                    style={{
                      background: '#fff', borderRadius: '16px', padding: '16px',
                      minWidth: '140px', maxWidth: '140px', flexShrink: '0',
                      boxShadow: online ? '0 4px 16px rgba(0,200,150,0.15)' : '0 2px 12px rgba(10,47,110,0.08)',
                      cursor: 'pointer', textAlign: 'center',
                      border: online ? '1.5px solid #00C896' : '1.5px solid transparent',
                    }}
                  >
                    {/* Avatar + online dot */}
                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: '8px' }}>
                      <div style={{
                        width: '48px', height: '48px', borderRadius: '14px', background: '#EEF2FF',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px',
                      }}>
                        {getAvatar(doc.full_name)}
                      </div>
                      <div style={{
                        position: 'absolute', bottom: '1px', right: '1px',
                        width: '13px', height: '13px', borderRadius: '50%',
                        background: online ? '#00C896' : '#CBD5E1',
                        border: '2px solid #fff',
                        boxShadow: online ? '0 0 6px rgba(0,200,150,0.6)' : 'none',
                      }}/>
                    </div>

                    {/* Name — no double Dr. */}
                    <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800', color: '#0D1B3E', marginBottom: '2px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      Dr. {name.split(' ')[0]}
                    </div>
                    <div style={{ fontSize: '11px', color: '#9BA8C9', marginBottom: '6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {doc.specialty || 'General Physician'}
                    </div>
                    <div style={{ fontSize: '10px', fontWeight: '700', color: online ? '#00A878' : '#94A3B8' }}>
                      {online ? '🟢 Online' : '⚫ Offline'}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* AI Health Assistant banner */}
        <div style={{ padding: '20px 16px' }}>
          <div
            onClick={() => navigate('chatbot')}
            style={{
              background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)',
              borderRadius: '16px', padding: '16px',
              display: 'flex', gap: '14px', alignItems: 'center', cursor: 'pointer',
            }}
          >
            <div style={{
              width: '48px', height: '48px', borderRadius: '14px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '24px', flexShrink: '0',
            }}>🤖</div>
            <div style={{ flex: '1' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '14px', fontWeight: '800', color: '#fff' }}>
                AI Health Assistant
              </div>
              <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)', marginTop: '2px' }}>
                Describe symptoms and get instant advice in your language
              </div>
            </div>
            <span style={{ fontSize: '20px', color: 'rgba(255,255,255,0.5)' }}>›</span>
          </div>
        </div>

      </div>

      <BottomNav active="home" navigate={navigate} />
    </div>
  );
}
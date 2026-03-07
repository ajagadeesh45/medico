import React, { useState } from 'react';
import TopBar from '../components/TopBar';

export default function DoctorProfileScreen({ goBack, navigate, selectedDoctor, showToast }) {

  const [tab, setTab] = useState('about');
  const doc = selectedDoctor;

  if (!doc) {
    return (
      <div style={{
        position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', background: '#F4F8FF', gap: '12px',
      }}>
        <div style={{ fontSize: '48px' }}>😕</div>
        <div style={{ fontSize: '16px', fontWeight: '700', color: '#0A2F6E' }}>Doctor not found</div>
        <button onClick={goBack} style={{ padding: '10px 24px', background: '#0A2F6E', color: '#fff', border: 'none', borderRadius: '12px', fontWeight: '700', cursor: 'pointer' }}>
          ← Go Back
        </button>
      </div>
    );
  }

  const getAvatar = (name) => {
    const list = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'];
    return list[(name || '').charCodeAt(0) % list.length];
  };

  const cleanName = (name) => (name || '').replace(/^Dr\.?\s*/i, '').trim();

  const parseList = (val) => {
    if (!val) return [];
    try { return JSON.parse(val); } catch { return val.split(',').map(s => s.trim()).filter(Boolean); }
  };

  const education = parseList(doc.education);
  const languages = parseList(doc.languages);

  const isOnline = (online_at) => {
    if (!online_at) return false;
    return (Date.now() - new Date(online_at).getTime()) < 2 * 60 * 1000;
  };
  const online = isOnline(doc.online_at);

  const startVideoCall = () => {
    navigate('videoCall');
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>
      <TopBar title="Doctor Profile" goBack={goBack} dark />

      <div style={{ flex: '1', overflowY: 'auto' }}>

        {/* Hero */}
        <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding: '20px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ position: 'relative', flexShrink: '0' }}>
            <div style={{
              width: '72px', height: '72px', borderRadius: '20px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '36px', border: '2px solid rgba(255,255,255,0.2)',
            }}>
              {getAvatar(doc.full_name)}
            </div>
            {/* Online dot */}
            <div style={{
              position: 'absolute', bottom: '2px', right: '2px',
              width: '16px', height: '16px', borderRadius: '50%',
              background: online ? '#00C896' : '#CBD5E1',
              border: '2.5px solid #0A2F6E',
              boxShadow: online ? '0 0 8px rgba(0,200,150,0.8)' : 'none',
            }}/>
          </div>

          <div style={{ flex: '1', minWidth: '0' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#fff' }}>
              Dr. {cleanName(doc.full_name)}
            </div>
            <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginTop: '3px' }}>
              {doc.specialty || 'General Physician'}
            </div>
            {doc.city && <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', marginTop: '2px' }}>📍 {doc.city}</div>}
            <div style={{ display: 'flex', gap: '8px', marginTop: '6px', flexWrap: 'wrap' }}>
              {doc.experience && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>🏅 {doc.experience} yrs</span>}
              {languages.length > 0 && <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.6)' }}>🌐 {languages.join(', ')}</span>}
            </div>
            <div style={{
              marginTop: '8px', display: 'inline-block',
              background: online ? 'rgba(0,200,150,0.2)' : 'rgba(255,255,255,0.1)',
              borderRadius: '50px', padding: '3px 12px',
              fontSize: '11px', fontWeight: '700',
              color: online ? '#00C896' : 'rgba(255,255,255,0.5)',
            }}>
              {online ? '🟢 Online Now' : '⚫ Offline'}
            </div>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #EEF2FF' }}>
          {[
            { label: 'Experience', value: doc.experience ? doc.experience + ' yrs' : 'N/A' },
            { label: 'Consult Fee', value: doc.consultation_fee ? '₹' + doc.consultation_fee : 'Free' },
            { label: 'Specialty', value: (doc.specialty || 'General').split(' ')[0] },
          ].map((s, i) => (
            <div key={i} style={{ flex: '1', padding: '14px 8px', textAlign: 'center', borderRight: i < 2 ? '1px solid #EEF2FF' : 'none' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#0A2F6E' }}>{s.value}</div>
              <div style={{ fontSize: '11px', color: '#9BA8C9', marginTop: '2px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #EEF2FF' }}>
          {[{ id: 'about', label: '📋 About' }, { id: 'contact', label: '📞 Contact' }].map(t => (
            <div key={t.id} onClick={() => setTab(t.id)} style={{
              flex: '1', padding: '12px', textAlign: 'center',
              fontSize: '13px', fontWeight: '700', cursor: 'pointer',
              color: tab === t.id ? '#0A2F6E' : '#9BA8C9',
              borderBottom: tab === t.id ? '2px solid #0A2F6E' : '2px solid transparent',
            }}>{t.label}</div>
          ))}
        </div>

        <div style={{ padding: '16px' }}>
          {tab === 'about' && (
            <>
              {doc.bio && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '14px', color: '#0D1B3E', marginBottom: '8px' }}>About</div>
                  <p style={{ fontSize: '14px', lineHeight: '1.7', color: '#5A6A8A', margin: '0' }}>{doc.bio}</p>
                </div>
              )}
              {education.length > 0 && (
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '14px', color: '#0D1B3E', marginBottom: '8px' }}>🎓 Education</div>
                  {education.map((e, i) => (
                    <div key={i} style={{ fontSize: '13px', color: '#5A6A8A', padding: '8px 0', borderBottom: '1px solid #EEF2FF' }}>• {e}</div>
                  ))}
                </div>
              )}
              {languages.length > 0 && (
                <div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '14px', color: '#0D1B3E', marginBottom: '8px' }}>🌐 Languages</div>
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                    {languages.map((l, i) => (
                      <div key={i} style={{ background: '#EEF2FF', borderRadius: '50px', padding: '5px 14px', fontSize: '12px', fontWeight: '700', color: '#0A2F6E' }}>{l}</div>
                    ))}
                  </div>
                </div>
              )}
              {!doc.bio && education.length === 0 && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#9BA8C9', fontSize: '13px', background: '#fff', borderRadius: '14px' }}>
                  👨‍⚕️ Dr. {cleanName(doc.full_name)} is setting up their profile.
                </div>
              )}
            </>
          )}

          {tab === 'contact' && (
            <>
              {[
                { label: 'PHONE',    value: doc.phone, icon: '📞' },
                { label: 'EMAIL',    value: doc.email, icon: '✉️' },
                { label: 'LOCATION', value: doc.city,  icon: '📍' },
              ].filter(r => r.value).map((r, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '16px', marginBottom: '10px', boxShadow: '0 2px 8px rgba(10,47,110,0.06)' }}>
                  <div style={{ fontSize: '11px', color: '#9BA8C9', fontWeight: '700', marginBottom: '4px' }}>{r.label}</div>
                  <div style={{ fontSize: '15px', fontWeight: '700', color: '#0D1B3E' }}>{r.icon} {r.value}</div>
                </div>
              ))}
              {!doc.phone && !doc.email && !doc.city && (
                <div style={{ textAlign: 'center', padding: '24px', color: '#9BA8C9', fontSize: '13px' }}>No contact info available yet.</div>
              )}
            </>
          )}
        </div>
      </div>

      {/* Action buttons */}
      <div style={{ padding: '12px 16px 16px', background: '#fff', borderTop: '1px solid #EEF2FF', display: 'flex', gap: '10px' }}>

        {/* Video call button */}
        <button
          onClick={startVideoCall}
          style={{
            flex: '2', padding: '16px',
            background: online ? '#0A2F6E' : '#E2E8F0',
            color: online ? '#fff' : '#94A3B8',
            border: 'none', borderRadius: '14px',
            fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800',
            cursor: online ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
          }}
        >
          📹 {online ? 'Start Video Call' : 'Doctor Offline'}
        </button>

        {/* Book for later */}
        <button
          onClick={() => showToast && showToast('📅 Booking feature coming soon!')}
          style={{
            flex: '1', padding: '16px',
            background: '#EEF2FF', color: '#0A2F6E',
            border: 'none', borderRadius: '14px',
            fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800',
            cursor: 'pointer',
          }}
        >
          📅 Book Later
        </button>
      </div>
    </div>
  );
}
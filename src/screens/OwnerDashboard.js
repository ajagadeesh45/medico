import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import TopBar from '../components/TopBar';

export default function OwnerDashboard({ user, handleLogout, showToast }) {

  const [tab, setTab]       = useState('dashboard');
  const [saving, setSaving] = useState(false);

  const [specialty, setSpecialty]   = useState('');
  const [experience, setExperience] = useState('');
  const [city, setCity]             = useState('');
  const [fee, setFee]               = useState('');
  const [bio, setBio]               = useState('');
  const [education, setEducation]   = useState('');
  const [languages, setLanguages]   = useState('');

  // ── Load profile ──
  useEffect(() => {
    if (!user?.id) return;
    supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
      if (data) {
        setSpecialty(data.specialty        || '');
        setExperience(data.experience      || '');
        setCity(data.city                  || '');
        setFee(data.consultation_fee       || '');
        setBio(data.bio                    || '');
        setEducation(data.education        || '');
        setLanguages(data.languages        || '');
      }
    });
  }, [user]);

  // ── Heartbeat: mark doctor online every 30 seconds ──
  useEffect(() => {
    if (!user?.id) return;
    const ping = () => {
      supabase.from('profiles').update({ online_at: new Date().toISOString() }).eq('id', user.id);
    };
    ping(); // immediate on login
    const interval = setInterval(ping, 30000);
    return () => {
      clearInterval(interval);
      // Mark offline on logout/unmount
      supabase.from('profiles').update({ online_at: null }).eq('id', user.id);
    };
  }, [user]);

  const saveProfile = async () => {
    setSaving(true);
    const { error } = await supabase.from('profiles').update({
      specialty:        specialty.trim(),
      experience:       experience.trim(),
      city:             city.trim(),
      consultation_fee: fee.trim(),
      bio:              bio.trim(),
      education:        education.trim(),
      languages:        languages.trim(),
    }).eq('id', user.id);
    setSaving(false);
    if (error) showToast && showToast('❌ Failed: ' + error.message);
    else        showToast && showToast('✅ Profile saved! Patients can now find you.');
  };

  const isComplete = specialty && city;

  const inp = {
    width: '100%', padding: '12px 14px', border: '2px solid #D1D8F0',
    borderRadius: '12px', fontSize: '14px', color: '#0D1B3E',
    outline: 'none', background: '#fff', boxSizing: 'border-box',
    fontFamily: "'DM Sans',sans-serif",
  };
  const lbl = {
    display: 'block', fontSize: '11px', fontWeight: '700', color: '#5A6A8A',
    textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px', marginTop: '14px',
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>
      <TopBar
        title="🏥 Doctor Dashboard"
        goBack={null}
        dark
        rightElement={
          <button onClick={handleLogout} style={{
            padding: '6px 12px', background: 'rgba(255,255,255,0.15)',
            border: 'none', borderRadius: '8px', color: '#fff',
            fontSize: '12px', fontWeight: '700', cursor: 'pointer',
          }}>Logout</button>
        }
      />

      {!isComplete && (
        <div style={{
          background: '#FFF3CD', padding: '10px 16px', fontSize: '13px',
          color: '#856404', fontWeight: '600', display: 'flex', alignItems: 'center', flexShrink: '0',
        }}>
          ⚠️ Complete your profile so patients can find you!
          <span onClick={() => setTab('profile')} style={{ color: '#0A2F6E', fontWeight: '800', cursor: 'pointer', marginLeft: 'auto' }}>
            Fill now →
          </span>
        </div>
      )}

      {/* Tabs */}
      <div style={{ display: 'flex', background: '#fff', borderBottom: '1px solid #EEF2FF', flexShrink: '0' }}>
        {[
          { id: 'dashboard', label: '📊 Dashboard'  },
          { id: 'patients',  label: '📅 Patients'   },
          { id: 'profile',   label: '👤 My Profile' },
        ].map(t => (
          <div key={t.id} onClick={() => setTab(t.id)} style={{
            flex: '1', padding: '12px 4px', textAlign: 'center',
            fontSize: '11px', fontWeight: '700', cursor: 'pointer',
            color: tab === t.id ? '#0A2F6E' : '#9BA8C9',
            borderBottom: tab === t.id ? '2px solid #0A2F6E' : '2px solid transparent',
          }}>{t.label}</div>
        ))}
      </div>

      <div style={{ flex: '1', overflowY: 'auto', padding: '16px' }}>

        {/* ── DASHBOARD ── */}
        {tab === 'dashboard' && (
          <>
            <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', borderRadius: '16px', padding: '16px', marginBottom: '16px', color: '#fff' }}>
              <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800' }}>
                Welcome, Dr. {user?.name}! 👋
              </div>
              <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
                {isComplete ? 'Your profile is live — patients can find you!' : 'Complete your profile to appear in the doctor list.'}
              </div>
              <div style={{
                marginTop: '10px', display: 'inline-flex', alignItems: 'center', gap: '6px',
                borderRadius: '50px', padding: '4px 12px', fontSize: '12px', fontWeight: '700',
                background: isComplete ? 'rgba(0,200,150,0.2)' : 'rgba(255,100,0,0.2)',
                color:      isComplete ? '#00C896' : '#FF6B35',
              }}>
                <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: isComplete ? '#00C896' : '#FF6B35', animation: isComplete ? 'ping 1.5s infinite' : 'none' }}/>
                {isComplete ? 'You are Online' : 'Profile Incomplete'}
              </div>
              <style>{`@keyframes ping { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:0.5;transform:scale(1.4)} }`}</style>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
              {[
                { icon: '👥', label: 'Patients Today', value: '0',   color: '#0A2F6E' },
                { icon: '⭐', label: 'Rating',          value: 'N/A', color: '#FFB800' },
                { icon: '💰', label: 'Earnings',        value: '₹0',  color: '#00C896' },
                { icon: '📅', label: 'Appointments',   value: '0',   color: '#FF6B35' },
              ].map((s, i) => (
                <div key={i} style={{ background: '#fff', borderRadius: '14px', padding: '14px', boxShadow: '0 2px 8px rgba(10,47,110,0.06)' }}>
                  <div style={{ fontSize: '22px', marginBottom: '6px' }}>{s.icon}</div>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: s.color }}>{s.value}</div>
                  <div style={{ fontSize: '11px', color: '#9BA8C9', marginTop: '2px' }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ fontFamily: "'Syne',sans-serif", fontWeight: '800', fontSize: '15px', color: '#0D1B3E', marginBottom: '10px' }}>Quick Actions</div>
            <div style={{ display: 'flex', gap: '10px' }}>
              {[
                { icon: '👤', label: 'Edit Profile', action: () => setTab('profile') },
                { icon: '📹', label: 'Video Call',   action: () => showToast && showToast('📹 Coming soon!') },
                { icon: '💬', label: 'Chat',         action: () => showToast && showToast('💬 Coming soon!') },
                { icon: '💊', label: 'Prescription', action: () => showToast && showToast('💊 Coming soon!') },
              ].map((a, i) => (
                <div key={i} onClick={a.action} style={{
                  flex: '1', background: '#fff', borderRadius: '14px', padding: '12px 8px',
                  textAlign: 'center', cursor: 'pointer', boxShadow: '0 2px 8px rgba(10,47,110,0.06)',
                }}>
                  <div style={{ fontSize: '22px', marginBottom: '4px' }}>{a.icon}</div>
                  <div style={{ fontSize: '10px', fontWeight: '700', color: '#0A2F6E' }}>{a.label}</div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* ── PATIENTS ── */}
        {tab === 'patients' && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '56px' }}>📅</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#0A2F6E', marginTop: '12px' }}>No Patients Yet</div>
            <div style={{ fontSize: '14px', color: '#9BA8C9', lineHeight: '1.6', marginTop: '8px' }}>
              Patient consultations will appear here once they book a session.
            </div>
            {!isComplete && (
              <div onClick={() => setTab('profile')} style={{
                marginTop: '16px', display: 'inline-block', background: '#0A2F6E',
                color: '#fff', borderRadius: '12px', padding: '12px 24px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer',
              }}>Complete Profile First →</div>
            )}
          </div>
        )}

        {/* ── MY PROFILE ── */}
        {tab === 'profile' && (
          <>
            <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '12px 14px', marginBottom: '4px', fontSize: '13px', color: '#5A6A8A', lineHeight: '1.6' }}>
              💡 Fill your details to appear in the <strong>Find Doctors</strong> tab.
            </div>

            <label style={lbl}>Specialty *</label>
            <input style={inp} placeholder="e.g. General Physician, Cardiologist" value={specialty} onChange={e => setSpecialty(e.target.value)} />

            <label style={lbl}>City *</label>
            <input style={inp} placeholder="e.g. Chennai, Mumbai" value={city} onChange={e => setCity(e.target.value)} />

            <label style={lbl}>Years of Experience</label>
            <input style={inp} placeholder="e.g. 8" value={experience} onChange={e => setExperience(e.target.value)} />

            <label style={lbl}>Consultation Fee (₹)</label>
            <input style={inp} placeholder="e.g. 299" value={fee} onChange={e => setFee(e.target.value)} />

            <label style={lbl}>Languages (comma separated)</label>
            <input style={inp} placeholder="e.g. English, Tamil, Hindi" value={languages} onChange={e => setLanguages(e.target.value)} />

            <label style={lbl}>Education (comma separated)</label>
            <input style={inp} placeholder="e.g. MBBS - MMC, MD - Apollo" value={education} onChange={e => setEducation(e.target.value)} />

            <label style={lbl}>About / Bio</label>
            <textarea style={{ ...inp, minHeight: '90px', resize: 'vertical' }}
              placeholder="Write a short bio for patients..."
              value={bio} onChange={e => setBio(e.target.value)} />

            <button onClick={saveProfile} disabled={saving} style={{
              width: '100%', marginTop: '20px', padding: '16px',
              background: saving ? '#9BA8C9' : '#0A2F6E', color: '#fff',
              border: 'none', borderRadius: '14px',
              fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800',
              cursor: saving ? 'not-allowed' : 'pointer',
            }}>
              {saving ? '⏳ Saving...' : '✅ Save Profile'}
            </button>

            <div onClick={handleLogout} style={{
              marginTop: '16px', marginBottom: '8px', background: '#FFF0F0',
              borderRadius: '14px', padding: '14px 16px',
              display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer',
            }}>
              <span style={{ fontSize: '20px' }}>🚪</span>
              <span style={{ fontSize: '15px', fontWeight: '700', color: '#FF4757' }}>Logout</span>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
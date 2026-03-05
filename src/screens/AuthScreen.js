import React, { useState } from 'react';

export default function AuthScreen({ handleLogin }) {

  const [authMode, setAuthMode] = useState('login');
  const [role, setRole]         = useState('patient');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [password, setPassword] = useState('');

  // ── Handle login/signup ──
  const handleSubmit = () => {
    if (!phone || !password) {
      alert('Please fill phone and password');
      return;
    }
    const userData = {
      name:  name || (role === 'doctor' ? 'Dr. Ramesh Kumar' : 'Arun Kumar'),
      phone: phone,
      role:  role,
    };
    handleLogin(userData);
  };

  const styles = {
    screen: {
      position:   'fixed',
      inset:      '0',
      maxWidth:   '420px',
      margin:     '0 auto',
      background: '#0A2F6E',
      display:    'flex',
      flexDirection: 'column',
      justifyContent: 'flex-end',
    },
    hero: {
      position:       'absolute',
      top:            '0',
      left:           '0',
      right:          '0',
      height:         '48%',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '10px',
    },
    heroIcon: {
      fontSize:  '56px',
      animation: 'bounce 2s ease-in-out infinite',
    },
    heroTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '28px',
      fontWeight: '800',
      color:      '#fff',
    },
    heroSub: {
      fontFamily: "'Noto Sans Tamil', sans-serif",
      fontSize:   '13px',
      color:      'rgba(255,255,255,0.45)',
    },
    card: {
      background:   '#fff',
      borderRadius: '32px 32px 0 0',
      padding:      '28px 24px 40px',
      position:     'relative',
      zIndex:       '2',
    },
    tabs: {
      display:      'flex',
      background:   '#EEF2FF',
      borderRadius: '12px',
      padding:      '4px',
      marginBottom: '20px',
    },
    tab: {
      flex:         '1',
      padding:      '11px',
      textAlign:    'center',
      borderRadius: '9px',
      fontFamily:   "'Syne', sans-serif",
      fontWeight:   '700',
      fontSize:     '14px',
      cursor:       'pointer',
      color:        '#5A6A8A',
      border:       'none',
      background:   'transparent',
    },
    tabActive: {
      flex:         '1',
      padding:      '11px',
      textAlign:    'center',
      borderRadius: '9px',
      fontFamily:   "'Syne', sans-serif",
      fontWeight:   '700',
      fontSize:     '14px',
      cursor:       'pointer',
      color:        '#0A2F6E',
      border:       'none',
      background:   '#fff',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
    },
    roleRow: {
      display:      'flex',
      gap:          '10px',
      marginBottom: '18px',
    },
    roleCard: {
      flex:         '1',
      border:       '2px solid #D1D8F0',
      borderRadius: '14px',
      padding:      '14px 10px',
      textAlign:    'center',
      cursor:       'pointer',
      background:   '#fff',
    },
    roleCardActive: {
      flex:         '1',
      border:       '2px solid #0A2F6E',
      borderRadius: '14px',
      padding:      '14px 10px',
      textAlign:    'center',
      cursor:       'pointer',
      background:   '#EEF2FF',
    },
    roleIcon: {
      fontSize:     '26px',
      marginBottom: '4px',
      display:      'block',
    },
    roleLabel: {
      fontSize:   '13px',
      fontWeight: '700',
      color:      '#5A6A8A',
    },
    roleLabelActive: {
      fontSize:   '13px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    formGroup: {
      marginBottom: '14px',
    },
    label: {
      display:       'block',
      fontSize:      '12px',
      fontWeight:    '700',
      color:         '#5A6A8A',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      marginBottom:  '6px',
    },
    input: {
      width:        '100%',
      padding:      '14px 16px',
      border:       '2px solid #D1D8F0',
      borderRadius: '14px',
      fontFamily:   "'DM Sans', sans-serif",
      fontSize:     '15px',
      color:        '#0D1B3E',
      outline:      'none',
      background:   '#fff',
    },
    submitBtn: {
      width:        '100%',
      padding:      '16px',
      background:   '#0A2F6E',
      color:        '#fff',
      border:       'none',
      borderRadius: '14px',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '16px',
      fontWeight:   '800',
      cursor:       'pointer',
      marginTop:    '6px',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Hero top section */}
      <div style={styles.hero}>
        <div style={styles.heroIcon}>🏥</div>
        <div style={styles.heroTitle}>Medico</div>
        <div style={styles.heroSub}>
          உங்கள் மருத்துவர். எங்கும்.
        </div>
      </div>

      {/* White card bottom */}
      <div style={styles.card}>

        {/* Login / Signup tabs */}
        <div style={styles.tabs}>
          <button
            style={authMode === 'login' ? styles.tabActive : styles.tab}
            onClick={() => setAuthMode('login')}
          >
            Login
          </button>
          <button
            style={authMode === 'signup' ? styles.tabActive : styles.tab}
            onClick={() => setAuthMode('signup')}
          >
            Sign Up
          </button>
        </div>

        {/* Role selector */}
        <div style={styles.roleRow}>
          <div
            style={role === 'patient' ? styles.roleCardActive : styles.roleCard}
            onClick={() => setRole('patient')}
          >
            <span style={styles.roleIcon}>🙋</span>
            <span style={role === 'patient' ? styles.roleLabelActive : styles.roleLabel}>
              Patient
            </span>
          </div>
          <div
            style={role === 'doctor' ? styles.roleCardActive : styles.roleCard}
            onClick={() => setRole('doctor')}
          >
            <span style={styles.roleIcon}>👨‍⚕️</span>
            <span style={role === 'doctor' ? styles.roleLabelActive : styles.roleLabel}>
              Doctor
            </span>
          </div>
        </div>

        {/* Name field — only on signup */}
        {authMode === 'signup' && (
          <div style={styles.formGroup}>
            <label style={styles.label}>Full Name</label>
            <input
              style={styles.input}
              placeholder="Your full name"
              value={name}
              onChange={e => setName(e.target.value)}
            />
          </div>
        )}

        {/* Phone */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Phone Number</label>
          <input
            style={styles.input}
            placeholder="+91 98765 43210"
            value={phone}
            onChange={e => setPhone(e.target.value)}
          />
        </div>

        {/* Password */}
        <div style={styles.formGroup}>
          <label style={styles.label}>Password</label>
          <input
            style={styles.input}
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
        </div>

        {/* Submit button */}
        <button style={styles.submitBtn} onClick={handleSubmit}>
          {authMode === 'login' ? 'Login →' : 'Create Account →'}
        </button>

      </div>
    </div>
  );
}
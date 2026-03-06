import React from 'react';

export default function SplashScreen({ navigate }) {

  const styles = {
    screen: {
      position:       'fixed',
      inset:          '0',
      maxWidth:       '420px',
      margin:         '0 auto',
      background:     'linear-gradient(160deg, #0A2F6E 0%, #0D3B8A 60%, #0A5A4E 100%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '16px',
      padding:        '40px 32px',
      animation:      'fadeIn 0.4s ease',
    },
    circle1: {
      position:     'absolute',
      width:        '400px',
      height:       '400px',
      borderRadius: '50%',
      background:   '#fff',
      opacity:      '0.05',
      top:          '-100px',
      right:        '-100px',
    },
    circle2: {
      position:     'absolute',
      width:        '300px',
      height:       '300px',
      borderRadius: '50%',
      background:   '#00C896',
      opacity:      '0.06',
      bottom:       '-80px',
      left:         '-80px',
    },
    logoBox: {
      width:          '100px',
      height:         '100px',
      background:     'rgba(255,255,255,0.12)',
      border:         '2px solid rgba(255,255,255,0.2)',
      borderRadius:   '30px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '48px',
      animation:      'float 3s ease-in-out infinite',
      backdropFilter: 'blur(10px)',
    },
    brand: {
      fontFamily:    "'Syne', sans-serif",
      fontSize:      '48px',
      fontWeight:    '800',
      color:         '#fff',
      letterSpacing: '-2px',
      marginTop:     '8px',
    },
    brandGreen: {
      color: '#00C896',
    },
    tagline: {
      color:      'rgba(255,255,255,0.6)',
      fontSize:   '15px',
      textAlign:  'center',
      lineHeight: '1.6',
    },
    taglineTamil: {
      fontFamily: "'Noto Sans Tamil', sans-serif",
      fontSize:   '13px',
      color:      'rgba(255,255,255,0.4)',
      marginTop:  '4px',
      textAlign:  'center',
    },
    pillsRow: {
      display:        'flex',
      gap:            '8px',
      flexWrap:       'wrap',
      justifyContent: 'center',
      marginTop:      '8px',
    },
    pill: {
      background:   'rgba(255,255,255,0.1)',
      border:       '1px solid rgba(255,255,255,0.15)',
      borderRadius: '50px',
      padding:      '6px 14px',
      fontSize:     '12px',
      color:        'rgba(255,255,255,0.7)',
    },
    btn: {
      width:         '100%',
      maxWidth:      '280px',
      padding:       '18px',
      background:    '#00C896',
      color:         '#fff',
      border:        'none',
      borderRadius:  '16px',
      fontFamily:    "'Syne', sans-serif",
      fontSize:      '18px',
      fontWeight:    '800',
      cursor:        'pointer',
      marginTop:     '16px',
      boxShadow:     '0 8px 32px rgba(0,200,150,0.4)',
      letterSpacing: '0.3px',
    },
    loginText: {
      color:    'rgba(255,255,255,0.5)',
      fontSize: '14px',
      cursor:   'pointer',
    },
    loginSpan: {
      color:      '#00C896',
      fontWeight: '600',
    },
  };

  return (
    <div style={styles.screen}>

      <div style={styles.circle1}/>
      <div style={styles.circle2}/>

      <div style={styles.logoBox}>🏥</div>

      <div style={styles.brand}>
        Medi<span style={styles.brandGreen}>co</span>
      </div>

      <div style={styles.tagline}>
        Your Doctor. Anywhere. Anytime.
      </div>
      <div style={styles.taglineTamil}>
        உங்கள் மருத்துவர். எங்கும். எப்போதும்.
      </div>

      <div style={styles.pillsRow}>
        <div style={styles.pill}>🌍 Verified Doctors</div>
        <div style={styles.pill}>🤖 AI Symptom Check</div>
        <div style={styles.pill}>🗺️ Hospital Map</div>
        <div style={styles.pill}>🚨 Emergency SOS</div>
      </div>

      {/* ── Only navigates on click ── */}
      <button
        style={styles.btn}
        onClick={() => navigate('auth')}
      >
        Get Started →
      </button>

      <div
        style={styles.loginText}
        onClick={() => navigate('auth')}
      >
        Already have an account?{' '}
        <span style={styles.loginSpan}>Login</span>
      </div>

    </div>
  );
}
import React, { useState } from 'react';

export default function EmergencyScreen({ goBack, showToast }) {

  const [pressed, setPressed] = useState(false);

  const handleEmergency = () => {
    setPressed(true);
    showToast('🚨 Emergency alert sent! Help is on the way.');
    setTimeout(() => setPressed(false), 3000);
  };

  const styles = {
    screen: {
      position:       'fixed',
      inset:          '0',
      maxWidth:       '420px',
      margin:         '0 auto',
      display:        'flex',
      flexDirection:  'column',
      background:     'linear-gradient(160deg, #8B0000 0%, #C0392B 50%, #E74C3C 100%)',
      zIndex:         '50',
    },
    // Top bar
    topBar: {
      padding:    '16px 20px 14px',
      display:    'flex',
      alignItems: 'center',
      gap:        '12px',
      flexShrink: '0',
      background: 'rgba(0,0,0,0.2)',
    },
    backBtn: {
      width:          '40px',
      height:         '40px',
      borderRadius:   '50%',
      border:         'none',
      background:     'rgba(255,255,255,0.15)',
      color:          '#fff',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '18px',
      cursor:         'pointer',
    },
    topTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '20px',
      fontWeight: '800',
      color:      '#fff',
      flex:       '1',
    },
    // Main content
    content: {
      flex:           '1',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '16px',
      padding:        '32px 24px',
    },
    // SOS ring
    ring: {
      position:       'relative',
      width:          '200px',
      height:         '200px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    },
    ringOuter: {
      position:     'absolute',
      width:        '200px',
      height:       '200px',
      borderRadius: '50%',
      border:       '2px solid rgba(255,255,255,0.2)',
      animation:    'glow 2s ease-in-out infinite',
    },
    ringInner: {
      position:     'absolute',
      width:        '160px',
      height:       '160px',
      borderRadius: '50%',
      background:   'rgba(255,255,255,0.08)',
    },
    // SOS button
    sosBtn: {
      width:          '140px',
      height:         '140px',
      background:     pressed ? '#ffcccc' : '#fff',
      borderRadius:   '50%',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
      cursor:         'pointer',
      zIndex:         '2',
      border:         'none',
      boxShadow:      pressed
        ? '0 0 0 8px rgba(255,255,255,0.3)'
        : '0 0 0 0 rgba(255,255,255,0.4)',
      transition:     'all 0.2s',
    },
    sosBtnIcon: {
      fontSize: '44px',
    },
    sosBtnLabel: {
      fontSize:   '12px',
      fontWeight: '800',
      color:      '#C0392B',
      fontFamily: "'Syne', sans-serif",
    },
    // Text
    title: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '26px',
      fontWeight: '800',
      color:      '#fff',
      textAlign:  'center',
    },
    sub: {
      color:      'rgba(255,255,255,0.6)',
      fontSize:   '14px',
      textAlign:  'center',
      lineHeight: '1.6',
      padding:    '0 16px',
    },
    // Nearest hospital card
    hospCard: {
      background:    'rgba(255,255,255,0.12)',
      borderRadius:  '16px',
      padding:       '16px',
      width:         '100%',
      backdropFilter:'blur(10px)',
      border:        '1px solid rgba(255,255,255,0.15)',
    },
    hospRow: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    hospName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '16px',
      fontWeight: '700',
      color:      '#fff',
    },
    hospSub: {
      fontSize:  '13px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '2px',
    },
    // Ambulance button
    ambulanceBtn: {
      width:        '100%',
      padding:      '16px',
      background:   'rgba(255,255,255,0.2)',
      border:       '2px solid rgba(255,255,255,0.3)',
      borderRadius: '14px',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '16px',
      fontWeight:   '800',
      color:        '#fff',
      cursor:       'pointer',
      backdropFilter: 'blur(10px)',
    },
    // Status message when pressed
    statusMsg: {
      background:   'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      padding:      '12px 20px',
      color:        '#fff',
      fontSize:     '14px',
      fontWeight:   '600',
      textAlign:    'center',
      animation:    'fadeIn 0.3s ease',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={goBack}>←</button>
        <div style={styles.topTitle}>Emergency</div>
      </div>

      {/* Main content */}
      <div style={styles.content}>

        {/* SOS Ring & Button */}
        <div style={styles.ring}>
          <div style={styles.ringOuter}/>
          <div style={styles.ringInner}/>
          <button
            style={styles.sosBtn}
            onClick={handleEmergency}
          >
            <span style={styles.sosBtnIcon}>🆘</span>
            <span style={styles.sosBtnLabel}>
              {pressed ? 'SENDING...' : 'PRESS & HOLD'}
            </span>
          </button>
        </div>

        {/* Status message */}
        {pressed && (
          <div style={styles.statusMsg}>
            📍 Sharing your location...
          </div>
        )}

        {/* Title */}
        <div style={styles.title}>Need Emergency Help?</div>
        <div style={styles.sub}>
          Press the button to send your location
          to the nearest hospital and alert your
          emergency contacts immediately.
        </div>

        {/* Nearest hospital */}
        <div style={styles.hospCard}>
          <div style={styles.hospRow}>
            <div>
              <div style={styles.hospName}>
                🏥 City Hospital — 0.3 km
              </div>
              <div style={styles.hospSub}>
                24/7 Emergency • Trauma Center
              </div>
            </div>
            <span style={{
              fontSize: '22px',
              color: 'rgba(255,255,255,0.5)'
            }}>›</span>
          </div>
        </div>

        {/* Ambulance button */}
        <button
          style={styles.ambulanceBtn}
          onClick={() => showToast('📞 Calling 108 Ambulance...')}
        >
          📞 Call 108 — Free Ambulance
        </button>

      </div>
    </div>
  );
}
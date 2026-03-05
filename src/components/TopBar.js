import React from 'react';

export default function TopBar({
  title,
  onBack,
  onAvatarPress,
  dark = false,
}) {

  const styles = {
    bar: {
      padding:        '16px 20px 14px',
      display:        'flex',
      alignItems:     'center',
      gap:            '12px',
      flexShrink:     '0',
      background:     dark ? '#fff' : '#0A2F6E',
      borderBottom:   dark ? '1px solid #EEF2FF' : 'none',
    },
    backBtn: {
      width:          '40px',
      height:         '40px',
      borderRadius:   '50%',
      border:         'none',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '18px',
      cursor:         'pointer',
      flexShrink:     '0',
      background:     dark
        ? '#EEF2FF'
        : 'rgba(255,255,255,0.15)',
      color: dark ? '#0A2F6E' : '#fff',
    },
    title: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '20px',
      fontWeight: '800',
      flex:       '1',
      color:      dark ? '#0A2F6E' : '#fff',
    },
    avatar: {
      width:          '40px',
      height:         '40px',
      background:     '#00C896',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '20px',
      cursor:         'pointer',
      flexShrink:     '0',
      border:         '2px solid rgba(255,255,255,0.3)',
    },
  };

  return (
    <div style={styles.bar}>

      {/* Back button — only shows if onBack is passed */}
      {onBack && (
        <button style={styles.backBtn} onClick={onBack}>
          ←
        </button>
      )}

      {/* Title */}
      <div style={styles.title}>{title}</div>

      {/* Avatar — only shows if onAvatarPress is passed */}
      {onAvatarPress && (
        <div style={styles.avatar} onClick={onAvatarPress}>
          😊
        </div>
      )}

    </div>
  );
}

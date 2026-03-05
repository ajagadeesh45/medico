import React from 'react';

export default function Toast({ msg }) {

  // Pick icon based on message content
  const getIcon = () => {
    if (msg.includes('👋')) return '👋';
    if (msg.includes('✅')) return '✅';
    if (msg.includes('❌')) return '❌';
    if (msg.includes('📞')) return '📞';
    if (msg.includes('🗺️')) return '🗺️';
    if (msg.includes('🚨')) return '🚨';
    if (msg.includes('📅')) return '📅';
    if (msg.includes('⚠️')) return '⚠️';
    return 'ℹ️';
  };

  const styles = {
    toast: {
      position:     'fixed',
      top:          '16px',
      left:         '50%',
      transform:    'translateX(-50%)',
      width:        'calc(100% - 32px)',
      maxWidth:     '388px',
      background:   '#0A2F6E',
      color:        '#fff',
      borderRadius: '16px',
      padding:      '14px 18px',
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      fontSize:     '14px',
      fontWeight:   '500',
      zIndex:       '9999',
      boxShadow:    '0 8px 32px rgba(10,47,110,0.3)',
      animation:    'slideUp 0.3s ease',
    },
    icon: {
      fontSize: '18px',
      flexShrink: 0,
    },
  };

  return (
    <div style={styles.toast}>
      <span style={styles.icon}>{getIcon()}</span>
      <span>{msg.replace(/^[\p{Emoji}]\s*/u, '')}</span>
    </div>
  );
}
import React from 'react';

const navItems = [
  { id: 'home',    icon: '🏠', label: 'Home'    },
  { id: 'map',     icon: '🗺️', label: 'Map'     },
  { id: 'chatbot', icon: '🤖', label: 'AI Chat' },
  { id: 'doctors', icon: '👨‍⚕️', label: 'Doctors' },
  { id: 'profile', icon: '👤', label: 'Profile' },
];

export default function BottomNav({ active, navigate }) {

  const styles = {
    nav: {
      position:     'fixed',
      bottom:       '0',
      left:         '50%',
      transform:    'translateX(-50%)',
      width:        '100%',
      maxWidth:     '420px',
      height:       '68px',
      background:   '#fff',
      borderTop:    '1px solid #EEF2FF',
      display:      'flex',
      alignItems:   'center',
      zIndex:       '100',
    },
    item: {
      flex:           '1',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '3px',
      cursor:         'pointer',
      padding:        '8px 0',
      position:       'relative',
    },
    icon: {
      fontSize: '22px',
      transition: 'transform 0.2s',
    },
    iconActive: {
      fontSize:  '22px',
      transform: 'scale(1.15)',
      transition: 'transform 0.2s',
    },
    label: {
      fontSize:      '10px',
      fontWeight:    '600',
      color:         '#9BA8C9',
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
    },
    labelActive: {
      fontSize:      '10px',
      fontWeight:    '600',
      color:         '#0A2F6E',
      letterSpacing: '0.4px',
      textTransform: 'uppercase',
    },
    indicator: {
      position:     'absolute',
      top:          '0',
      left:         '50%',
      transform:    'translateX(-50%)',
      width:        '32px',
      height:       '3px',
      background:   '#0A2F6E',
      borderRadius: '0 0 4px 4px',
    },
  };

  return (
    <div style={styles.nav}>
      {navItems.map(item => (
        <div
          key={item.id}
          style={styles.item}
          onClick={() => navigate(item.id)}
        >
          {/* Active indicator bar on top */}
          {active === item.id && (
            <div style={styles.indicator} />
          )}

          {/* Icon */}
          <span style={
            active === item.id
              ? styles.iconActive
              : styles.icon
          }>
            {item.icon}
          </span>

          {/* Label */}
          <span style={
            active === item.id
              ? styles.labelActive
              : styles.label
          }>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}
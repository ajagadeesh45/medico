import React from 'react';
import BottomNav from '../components/BottomNav';

export default function ProfileScreen({
  navigate,
  user,
  handleLogout,
  showToast,
}) {

  const menuItems = [
    {
      icon:    '📋',
      bg:      '#EEF2FF',
      label:   'Health Records',
      action:  () => navigate('records'),
    },
    {
      icon:    '📅',
      bg:      '#F0FDF4',
      label:   'My Appointments',
      action:  () => showToast('📅 Appointments coming soon!'),
    },
    {
      icon:    '🔔',
      bg:      '#FFF7ED',
      label:   'Notifications',
      action:  () => showToast('🔔 Notifications coming soon!'),
    },
    {
      icon:    '🌐',
      bg:      '#F0F9FF',
      label:   'Language — Tamil',
      action:  () => showToast('🌐 Language settings coming soon!'),
    },
    {
      icon:    '💳',
      bg:      '#FDF2F8',
      label:   'Payment Methods',
      action:  () => showToast('💳 Payment methods coming soon!'),
    },
    {
      icon:    '📞',
      bg:      '#FFFBEB',
      label:   'Help & Support',
      action:  () => showToast('📞 Support: 1800-MED-HELP'),
    },
    {
      icon:    '🚪',
      bg:      '#FEF2F2',
      label:   'Logout',
      red:     true,
      action:  handleLogout,
    },
  ];

  const styles = {
    screen: {
      position:      'fixed',
      inset:         '0',
      maxWidth:      '420px',
      margin:        '0 auto',
      display:       'flex',
      flexDirection: 'column',
      background:    '#F4F8FF',
    },
    // Hero
    hero: {
      background:  'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:     '24px 20px 44px',
      flexShrink:  '0',
      position:    'relative',
      overflow:    'hidden',
    },
    heroBg: {
      position:     'absolute',
      width:        '200px',
      height:       '200px',
      background:   'rgba(255,255,255,0.04)',
      borderRadius: '50%',
      top:          '-60px',
      right:        '-40px',
    },
    avatar: {
      width:          '72px',
      height:         '72px',
      background:     'rgba(255,255,255,0.15)',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '36px',
      border:         '3px solid rgba(255,255,255,0.25)',
      marginBottom:   '12px',
    },
    userName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '22px',
      fontWeight: '800',
      color:      '#fff',
    },
    userPhone: {
      fontSize:  '13px',
      color:     'rgba(255,255,255,0.5)',
      marginTop: '2px',
    },
    statsRow: {
      display:   'flex',
      gap:       '20px',
      marginTop: '16px',
    },
    stat: {
      textAlign: 'center',
    },
    statNum: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '20px',
      fontWeight: '800',
      color:      '#fff',
    },
    statLabel: {
      fontSize:  '11px',
      color:     'rgba(255,255,255,0.4)',
      marginTop: '2px',
    },
    // Body
    body: {
      background:              '#fff',
      borderRadius:            '28px 28px 0 0',
      marginTop:               '-22px',
      padding:                 '24px 20px',
      flex:                    '1',
      overflowY:               'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom:           '80px',
    },
    // Menu items
    menuRow: {
      display:     'flex',
      alignItems:  'center',
      gap:         '14px',
      padding:     '15px 0',
      borderBottom:'1px solid #EEF2FF',
      cursor:      'pointer',
    },
    menuIcon: {
      width:          '42px',
      height:         '42px',
      borderRadius:   '13px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '20px',
      flexShrink:     '0',
    },
    menuLabel: {
      flex:       '1',
      fontSize:   '15px',
      fontWeight: '500',
      color:      '#0D1B3E',
    },
    menuLabelRed: {
      flex:       '1',
      fontSize:   '15px',
      fontWeight: '500',
      color:      '#EF4444',
    },
    menuArrow: {
      color:    '#9BA8C9',
      fontSize: '16px',
    },
    // App version
    version: {
      textAlign:  'center',
      fontSize:   '12px',
      color:      '#9BA8C9',
      marginTop:  '16px',
      paddingTop: '16px',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg}/>

        {/* Avatar */}
        <div style={styles.avatar}>😊</div>

        {/* Name & phone */}
        <div style={styles.userName}>
          {user?.name || 'Guest User'}
        </div>
        <div style={styles.userPhone}>
          {user?.phone || '+91 00000 00000'}
        </div>

        {/* Stats */}
        <div style={styles.statsRow}>
          <div style={styles.stat}>
            <div style={styles.statNum}>4</div>
            <div style={styles.statLabel}>Consultations</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>2</div>
            <div style={styles.statLabel}>Prescriptions</div>
          </div>
          <div style={styles.stat}>
            <div style={styles.statNum}>B+</div>
            <div style={styles.statLabel}>Blood Group</div>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div style={styles.body}>
        {menuItems.map((item, i) => (
          <div
            key={i}
            style={styles.menuRow}
            onClick={item.action}
          >
            {/* Icon */}
            <div style={{
              ...styles.menuIcon,
              background: item.bg,
            }}>
              {item.icon}
            </div>

            {/* Label */}
            <div style={
              item.red
                ? styles.menuLabelRed
                : styles.menuLabel
            }>
              {item.label}
            </div>

            {/* Arrow */}
            <div style={styles.menuArrow}>›</div>
          </div>
        ))}

        {/* App version */}
        <div style={styles.version}>
          Medico v1.0.0 — Made with ❤️ for India
        </div>
      </div>

      {/* Bottom Nav */}
      <BottomNav active="profile" navigate={navigate}/>

    </div>
  );
}
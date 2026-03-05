import React from 'react';
import BottomNav from '../components/BottomNav';

export default function HomeScreen({ navigate, user, showToast }) {

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
    // ── Hero top section ──
    hero: {
      background:  'linear-gradient(135deg, #0A2F6E 0%, #0D3B8A 100%)',
      padding:     '20px 20px 32px',
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
    heroTop: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
    },
    greeting: {
      color:    'rgba(255,255,255,0.55)',
      fontSize: '14px',
    },
    userName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '24px',
      fontWeight: '800',
      color:      '#fff',
      marginTop:  '2px',
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
      border:         '2px solid rgba(255,255,255,0.3)',
    },
    searchBar: {
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      background:   'rgba(255,255,255,0.12)',
      borderRadius: '14px',
      padding:      '12px 16px',
      cursor:       'pointer',
      border:       '1.5px solid rgba(255,255,255,0.1)',
      marginTop:    '16px',
    },
    searchText: {
      color:    'rgba(255,255,255,0.4)',
      fontSize: '15px',
    },
    // ── Scroll area ──
    scroll: {
      flex:                    '1',
      overflowY:               'auto',
      overflowX:               'hidden',
      WebkitOverflowScrolling: 'touch',
      paddingBottom:           '80px',
    },
    // ── Quick actions grid ──
    quickGrid: {
      display:             'grid',
      gridTemplateColumns: 'repeat(4, 1fr)',
      gap:                 '10px',
      padding:             '20px 20px 0',
    },
    qCard: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '14px 8px',
      textAlign:    'center',
      cursor:       'pointer',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
    },
    qIcon: {
      fontSize:     '26px',
      marginBottom: '6px',
    },
    qLabel: {
      fontSize:   '11px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    // ── Emergency banner ──
    emergencyBanner: {
      margin:       '16px 20px 0',
      background:   'linear-gradient(135deg, #FF4757, #C0392B)',
      borderRadius: '20px',
      padding:      '16px 18px',
      display:      'flex',
      alignItems:   'center',
      gap:          '14px',
      cursor:       'pointer',
    },
    emergencyText: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '15px',
      fontWeight: '800',
      color:      '#fff',
      flex:       '1',
    },
    emergencySub: {
      fontSize:  '12px',
      color:     'rgba(255,255,255,0.6)',
      marginTop: '2px',
    },
    // ── Section ──
    section: {
      padding: '20px 20px 0',
    },
    sectionHeader: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   '14px',
    },
    sectionTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '18px',
      fontWeight: '800',
      color:      '#0A2F6E',
    },
    sectionLink: {
      fontSize:   '13px',
      color:      '#00A878',
      fontWeight: '600',
      cursor:     'pointer',
    },
    // ── Doctor cards scroll ──
    docScroll: {
      display:    'flex',
      gap:        '12px',
      overflowX:  'auto',
      padding:    '0 20px 4px',
    },
    docMini: {
      background:   '#fff',
      borderRadius: '20px',
      padding:      '16px 14px',
      minWidth:     '150px',
      flexShrink:   '0',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      cursor:       'pointer',
      textAlign:    'center',
    },
    docAva: {
      width:          '52px',
      height:         '52px',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '28px',
      margin:         '0 auto 10px',
      background:     '#EEF2FF',
    },
    docName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '13px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    docSpec: {
      fontSize:  '11px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    docStatus: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '4px',
      marginTop:      '8px',
    },
    dotGreen: {
      width:        '7px',
      height:       '7px',
      background:   '#00C896',
      borderRadius: '50%',
    },
    statusText: {
      fontSize:   '11px',
      fontWeight: '600',
      color:      '#00A878',
    },
    verifiedBadge: {
      display:      'inline-flex',
      alignItems:   'center',
      gap:          '3px',
      background:   'rgba(0,200,150,0.1)',
      borderRadius: '50px',
      padding:      '3px 8px',
      fontSize:     '10px',
      fontWeight:   '700',
      color:        '#00A878',
      marginTop:    '6px',
    },
    // ── Hospital cards ──
    hospitalCard: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '14px 16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      cursor:       'pointer',
      marginBottom: '10px',
    },
    hospitalIcon: {
      width:          '48px',
      height:         '48px',
      background:     '#EEF2FF',
      borderRadius:   '14px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '24px',
      flexShrink:     '0',
    },
    hospitalName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '14px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    hospitalSub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
  };

  const doctors = [
    { name: 'Dr. Ramesh',  spec: 'General',      emoji: '👨‍⚕️', online: true  },
    { name: 'Dr. Priya',   spec: 'Paediatric',   emoji: '👩‍⚕️', online: true  },
    { name: 'Dr. Suresh',  spec: 'Cardiology',   emoji: '👨‍⚕️', online: false },
    { name: 'Dr. Meena',   spec: 'Dermatology',  emoji: '👩‍⚕️', online: true  },
  ];

  const hospitals = [
    { icon: '🏥', name: 'City Government Hospital', sub: '0.3 km • Open 24/7 • Free OPD'     },
    { icon: '🏨', name: 'Apollo Clinic',            sub: '0.7 km • Open • Multi-speciality'  },
  ];

  return (
    <div style={styles.screen}>

      {/* ── Hero ── */}
      <div style={styles.hero}>
        <div style={styles.heroBg} />
        <div style={styles.heroTop}>
          <div>
            <div style={styles.greeting}>Good morning 👋</div>
            <div style={styles.userName}>
              {user?.name || 'Welcome'}
            </div>
          </div>
          <div
            style={styles.avatar}
            onClick={() => navigate('profile')}
          >
            😊
          </div>
        </div>
        <div
          style={styles.searchBar}
          onClick={() => showToast('🔍 Search coming soon!')}
        >
          <span style={{ fontSize: '18px' }}>🔍</span>
          <span style={styles.searchText}>
            Search doctors, hospitals...
          </span>
        </div>
      </div>

      {/* ── Scrollable content ── */}
      <div style={styles.scroll}>

        {/* Quick Actions */}
        <div style={styles.quickGrid}>
          {[
            { icon: '🗺️', label: 'Hospital Map', to: 'map'       },
            { icon: '🤖', label: 'Symptom Check', to: 'chatbot'  },
            { icon: '📞', label: 'Call Doctor',   to: 'doctors'  },
            { icon: '🚨', label: 'Emergency',     to: 'emergency'},
          ].map(item => (
            <div
              key={item.to}
              style={styles.qCard}
              onClick={() => navigate(item.to)}
            >
              <div style={styles.qIcon}>{item.icon}</div>
              <div style={styles.qLabel}>{item.label}</div>
            </div>
          ))}
        </div>

        {/* Emergency Banner */}
        <div
          style={styles.emergencyBanner}
          onClick={() => navigate('emergency')}
        >
          <span style={{ fontSize: '32px' }}>🚨</span>
          <div>
            <div style={styles.emergencyText}>
              Emergency? Tap Here
            </div>
            <div style={styles.emergencySub}>
              108 Ambulance • Nearest Hospital
            </div>
          </div>
          <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)' }}>›</span>
        </div>

        {/* Available Doctors */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>Available Doctors</div>
            <div
              style={styles.sectionLink}
              onClick={() => navigate('doctors')}
            >
              See All
            </div>
          </div>
        </div>
        <div style={styles.docScroll}>
          {doctors.map((doc, i) => (
            <div
              key={i}
              style={styles.docMini}
              onClick={() => navigate('doctors')}
            >
              <div style={styles.docAva}>{doc.emoji}</div>
              <div style={styles.docName}>{doc.name}</div>
              <div style={styles.docSpec}>{doc.spec}</div>
              <div style={styles.docStatus}>
                <div style={{
                  ...styles.dotGreen,
                  background: doc.online ? '#00C896' : '#9BA8C9'
                }}/>
                <span style={{
                  ...styles.statusText,
                  color: doc.online ? '#00A878' : '#9BA8C9'
                }}>
                  {doc.online ? 'Online' : 'Busy'}
                </span>
              </div>
              <div style={styles.verifiedBadge}>✅ Verified</div>
            </div>
          ))}
        </div>

        {/* Nearest Hospitals */}
        <div style={styles.section}>
          <div style={styles.sectionHeader}>
            <div style={styles.sectionTitle}>Nearest Hospitals</div>
            <div
              style={styles.sectionLink}
              onClick={() => navigate('map')}
            >
              View Map
            </div>
          </div>
          {hospitals.map((h, i) => (
            <div
              key={i}
              style={styles.hospitalCard}
              onClick={() => navigate('map')}
            >
              <div style={styles.hospitalIcon}>{h.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.hospitalName}>{h.name}</div>
                <div style={styles.hospitalSub}>{h.sub}</div>
              </div>
              <span style={{ fontSize: '22px', color: '#9BA8C9' }}>›</span>
            </div>
          ))}
        </div>

      </div>

      {/* Bottom Nav */}
      <BottomNav active="home" navigate={navigate} />

    </div>
  );
}
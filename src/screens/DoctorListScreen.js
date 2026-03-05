import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

const DOCTORS = [
  {
    id:       1,
    name:     'Dr. Ramesh Kumar',
    degree:   'MBBS, MD',
    spec:     'General Physician',
    emoji:    '👨‍⚕️',
    rating:   4.8,
    patients: '2,400',
    exp:      '12 yrs',
    fee:      '₹200',
    online:   true,
    langs:    ['Tamil', 'English', 'Hindi'],
    category: 'general',
  },
  {
    id:       2,
    name:     'Dr. Priya Sharma',
    degree:   'MBBS, DCH',
    spec:     'Paediatrician',
    emoji:    '👩‍⚕️',
    rating:   4.9,
    patients: '1,800',
    exp:      '8 yrs',
    fee:      '₹250',
    online:   true,
    langs:    ['Tamil', 'English', 'Telugu'],
    category: 'child',
  },
  {
    id:       3,
    name:     'Dr. John Thomas',
    degree:   'MBBS, DM',
    spec:     'Cardiologist',
    emoji:    '👨‍⚕️',
    rating:   4.7,
    patients: '3,100',
    exp:      '15 yrs',
    fee:      '₹500',
    online:   false,
    langs:    ['English', 'Malayalam'],
    category: 'cardio',
  },
  {
    id:       4,
    name:     'Dr. Meena Devi',
    degree:   'MBBS, DVD',
    spec:     'Dermatologist',
    emoji:    '👩‍⚕️',
    rating:   4.6,
    patients: '1,200',
    exp:      '6 yrs',
    fee:      '₹300',
    online:   true,
    langs:    ['Tamil', 'English'],
    category: 'skin',
  },
  {
    id:       5,
    name:     'Dr. Suresh Babu',
    degree:   'MBBS, MS',
    spec:     'Orthopaedic',
    emoji:    '👨‍⚕️',
    rating:   4.5,
    patients: '980',
    exp:      '10 yrs',
    fee:      '₹400',
    online:   false,
    langs:    ['Tamil', 'English'],
    category: 'ortho',
  },
];

const FILTERS = [
  { id: 'all',     icon: '🌟', label: 'All'       },
  { id: 'general', icon: '🩺', label: 'General'   },
  { id: 'cardio',  icon: '❤️', label: 'Cardio'    },
  { id: 'child',   icon: '👶', label: 'Child'      },
  { id: 'skin',    icon: '✨', label: 'Skin'       },
  { id: 'ortho',   icon: '🦴', label: 'Ortho'     },
];

export default function DoctorListScreen({
  navigate,
  showToast,
  openDoctor,
}) {

  const [activeFilter, setActiveFilter] = useState('all');

  const filtered = activeFilter === 'all'
    ? DOCTORS
    : DOCTORS.filter(d => d.category === activeFilter);

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
    topBar: {
      background:  'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:     '16px 20px 14px',
      display:     'flex',
      alignItems:  'center',
      gap:         '12px',
      flexShrink:  '0',
    },
    topTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '20px',
      fontWeight: '800',
      color:      '#fff',
      flex:       '1',
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
    // Filter chips
    filterScroll: {
      display:   'flex',
      gap:       '8px',
      overflowX: 'auto',
      padding:   '14px 20px',
      flexShrink:'0',
      background:'#fff',
      borderBottom: '1px solid #EEF2FF',
    },
    chip: {
      display:      'flex',
      alignItems:   'center',
      gap:          '6px',
      padding:      '9px 16px',
      background:   '#F4F8FF',
      border:       '1.5px solid #D1D8F0',
      borderRadius: '50px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#5A6A8A',
      cursor:       'pointer',
      whiteSpace:   'nowrap',
      flexShrink:   '0',
    },
    chipActive: {
      display:      'flex',
      alignItems:   'center',
      gap:          '6px',
      padding:      '9px 16px',
      background:   '#0A2F6E',
      border:       '1.5px solid #0A2F6E',
      borderRadius: '50px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#fff',
      cursor:       'pointer',
      whiteSpace:   'nowrap',
      flexShrink:   '0',
    },
    // Scroll area
    scroll: {
      flex:                    '1',
      overflowY:               'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom:           '80px',
      paddingTop:              '4px',
    },
    // Doctor card
    docCard: {
      background:   '#fff',
      borderRadius: '20px',
      padding:      '18px',
      margin:       '12px 20px 0',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      cursor:       'pointer',
    },
    cardTop: {
      display:    'flex',
      gap:        '14px',
      alignItems: 'flex-start',
    },
    avaWrap: {
      position:     'relative',
      flexShrink:   '0',
    },
    ava: {
      width:          '64px',
      height:         '64px',
      borderRadius:   '20px',
      background:     '#EEF2FF',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '34px',
    },
    onlineDot: {
      position:     'absolute',
      bottom:       '2px',
      right:        '2px',
      width:        '14px',
      height:       '14px',
      borderRadius: '50%',
      border:       '2px solid #fff',
    },
    docName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '16px',
      fontWeight: '800',
      color:      '#0A2F6E',
    },
    docSpec: {
      fontSize:  '13px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    verifiedBadge: {
      display:      'inline-flex',
      alignItems:   'center',
      gap:          '4px',
      background:   'rgba(0,200,150,0.1)',
      borderRadius: '50px',
      padding:      '3px 10px',
      fontSize:     '11px',
      fontWeight:   '700',
      color:        '#00A878',
      marginTop:    '6px',
    },
    // Stats row
    statsRow: {
      display:       'flex',
      gap:           '14px',
      marginTop:     '12px',
      paddingTop:    '12px',
      borderTop:     '1px solid #EEF2FF',
      flexWrap:      'wrap',
    },
    stat: {
      display:    'flex',
      alignItems: 'center',
      gap:        '5px',
      fontSize:   '12px',
      color:      '#5A6A8A',
    },
    // Language tags
    langsRow: {
      display:   'flex',
      gap:       '6px',
      flexWrap:  'wrap',
      marginTop: '10px',
    },
    langTag: {
      background:   '#EEF2FF',
      borderRadius: '6px',
      padding:      '3px 10px',
      fontSize:     '11px',
      fontWeight:   '600',
      color:        '#5A6A8A',
    },
    // Action buttons
    btnsRow: {
      display:   'flex',
      gap:       '8px',
      marginTop: '12px',
    },
    btnCall: {
      flex:         '1',
      padding:      '12px',
      borderRadius: '14px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '14px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#0A2F6E',
      color:        '#fff',
    },
    btnBook: {
      flex:         '1',
      padding:      '12px',
      borderRadius: '14px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '14px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#EEF2FF',
      color:        '#0A2F6E',
    },
    btnBusy: {
      flex:         '1',
      padding:      '12px',
      borderRadius: '14px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'not-allowed',
      background:   '#EEF2FF',
      color:        '#9BA8C9',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Top Bar */}
      <div style={styles.topBar}>
        <div style={styles.topTitle}>Find Doctors</div>
        <div
          style={styles.avatar}
          onClick={() => navigate('profile')}
        >
          😊
        </div>
      </div>

      {/* Filter chips */}
      <div style={styles.filterScroll}>
        {FILTERS.map(f => (
          <div
            key={f.id}
            style={activeFilter === f.id ? styles.chipActive : styles.chip}
            onClick={() => setActiveFilter(f.id)}
          >
            <span>{f.icon}</span>
            <span>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Doctor list */}
      <div style={styles.scroll}>
        {filtered.map(doc => (
          <div
            key={doc.id}
            style={styles.docCard}
            onClick={() => openDoctor(doc)}
          >
            {/* Top row */}
            <div style={styles.cardTop}>
              <div style={styles.avaWrap}>
                <div style={styles.ava}>{doc.emoji}</div>
                <div style={{
                  ...styles.onlineDot,
                  background: doc.online ? '#00C896' : '#9BA8C9',
                }}/>
              </div>
              <div style={{ flex: 1 }}>
                <div style={styles.docName}>{doc.name}</div>
                <div style={styles.docSpec}>
                  {doc.spec} • {doc.degree}
                </div>
                <div style={styles.verifiedBadge}>
                  ✅ Verified Doctor
                </div>
              </div>
            </div>

            {/* Stats */}
            <div style={styles.statsRow}>
              <div style={styles.stat}>⭐ {doc.rating}</div>
              <div style={styles.stat}>👥 {doc.patients} patients</div>
              <div style={styles.stat}>🕐 {doc.exp} exp</div>
              <div style={styles.stat}>💬 {doc.fee}</div>
            </div>

            {/* Languages */}
            <div style={styles.langsRow}>
              {doc.langs.map((l, i) => (
                <span key={i} style={styles.langTag}>{l}</span>
              ))}
            </div>

            {/* Buttons */}
            <div style={styles.btnsRow}>
              {doc.online ? (
                <>
                  <button
                    style={styles.btnCall}
                    onClick={e => {
                      e.stopPropagation();
                      showToast(`📞 Connecting to ${doc.name}...`);
                    }}
                  >
                    📞 Call Now
                  </button>
                  <button
                    style={styles.btnBook}
                    onClick={e => {
                      e.stopPropagation();
                      openDoctor(doc);
                    }}
                  >
                    📅 Book
                  </button>
                </>
              ) : (
                <>
                  <button style={styles.btnBusy} disabled>
                    ⏳ Currently Unavailable
                  </button>
                  <button
                    style={styles.btnBook}
                    onClick={e => {
                      e.stopPropagation();
                      openDoctor(doc);
                    }}
                  >
                    📅 Book
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Nav */}
      <BottomNav active="doctors" navigate={navigate} />

    </div>
  );
}
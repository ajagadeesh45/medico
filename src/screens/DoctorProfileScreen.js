import React, { useState } from 'react';

export default function DoctorProfileScreen({
  goBack,
  showToast,
  selectedDoctor,
}) {

  const [selectedSlot, setSelectedSlot] = useState('11:00 AM');

  // Fallback if no doctor selected
  const doc = selectedDoctor || {
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
  };

  const slots = [
    { time: '10:00 AM', full: false },
    { time: '11:00 AM', full: false },
    { time: '12:00 PM', full: true  },
    { time: '2:00 PM',  full: false },
    { time: '3:00 PM',  full: false },
    { time: '4:00 PM',  full: true  },
    { time: '5:00 PM',  full: false },
    { time: '6:00 PM',  full: false },
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
      zIndex:        '50',
    },
    // Hero
    hero: {
      background:  'linear-gradient(160deg, #0A2F6E 0%, #0D3B8A 100%)',
      padding:     '20px 20px 40px',
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
      marginBottom:   '16px',
    },
    ava: {
      width:          '80px',
      height:         '80px',
      borderRadius:   '24px',
      background:     'rgba(255,255,255,0.15)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '44px',
      border:         '2px solid rgba(255,255,255,0.2)',
      marginBottom:   '12px',
    },
    docName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '24px',
      fontWeight: '800',
      color:      '#fff',
    },
    docDegree: {
      fontSize:  '14px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '2px',
    },
    verifiedBadge: {
      display:      'inline-flex',
      alignItems:   'center',
      gap:          '5px',
      background:   'rgba(0,200,150,0.2)',
      borderRadius: '50px',
      padding:      '5px 14px',
      fontSize:     '12px',
      fontWeight:   '700',
      color:        '#00C896',
      marginTop:    '8px',
    },
    numsRow: {
      display:   'flex',
      gap:       '24px',
      marginTop: '16px',
    },
    numItem: {
      textAlign: 'center',
    },
    numVal: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '20px',
      fontWeight: '800',
      color:      '#fff',
    },
    numLbl: {
      fontSize:  '11px',
      color:     'rgba(255,255,255,0.45)',
      marginTop: '2px',
    },
    // Body
    body: {
      background:              '#fff',
      borderRadius:            '28px 28px 0 0',
      marginTop:               '-20px',
      padding:                 '24px 20px',
      flex:                    '1',
      overflowY:               'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom:           '100px',
    },
    section: {
      marginBottom: '20px',
    },
    secTitle: {
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '15px',
      fontWeight:   '700',
      color:        '#0A2F6E',
      marginBottom: '10px',
    },
    about: {
      fontSize:   '14px',
      color:      '#5A6A8A',
      lineHeight: '1.6',
    },
    // Info rows
    infoRow: {
      display:     'flex',
      alignItems:  'center',
      gap:         '12px',
      padding:     '10px 0',
      borderBottom:'1px solid #EEF2FF',
    },
    infoIcon: {
      width:          '36px',
      height:         '36px',
      background:     '#EEF2FF',
      borderRadius:   '10px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '18px',
      flexShrink:     '0',
    },
    infoLabel: {
      fontSize:  '12px',
      color:     '#5A6A8A',
    },
    infoVal: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#0A2F6E',
    },
    // Slots
    slotsGrid: {
      display:   'flex',
      gap:       '8px',
      flexWrap:  'wrap',
    },
    slot: {
      padding:      '10px 16px',
      border:       '2px solid #D1D8F0',
      borderRadius: '10px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#5A6A8A',
      cursor:       'pointer',
      background:   '#fff',
    },
    slotActive: {
      padding:      '10px 16px',
      border:       '2px solid #0A2F6E',
      borderRadius: '10px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#fff',
      cursor:       'pointer',
      background:   '#0A2F6E',
    },
    slotFull: {
      padding:      '10px 16px',
      border:       '2px solid #EEF2FF',
      borderRadius: '10px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#9BA8C9',
      cursor:       'not-allowed',
      background:   '#EEF2FF',
    },
    // Bottom buttons
    btnsRow: {
      position:   'fixed',
      bottom:     '0',
      left:       '50%',
      transform:  'translateX(-50%)',
      width:      '100%',
      maxWidth:   '420px',
      display:    'flex',
      gap:        '10px',
      padding:    '16px 20px 32px',
      background: '#fff',
      boxShadow:  '0 -4px 24px rgba(10,47,110,0.08)',
    },
    btnCall: {
      flex:         '1',
      padding:      '16px',
      borderRadius: '14px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '15px',
      fontWeight:   '800',
      cursor:       'pointer',
      background:   '#0A2F6E',
      color:        '#fff',
    },
    btnBook: {
      flex:         '1',
      padding:      '16px',
      borderRadius: '14px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '15px',
      fontWeight:   '800',
      cursor:       'pointer',
      background:   '#00C896',
      color:        '#fff',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Hero */}
      <div style={styles.hero}>
        <div style={styles.heroBg}/>

        {/* Back button */}
        <button style={styles.backBtn} onClick={goBack}>←</button>

        {/* Avatar */}
        <div style={styles.ava}>{doc.emoji}</div>

        {/* Name & degree */}
        <div style={styles.docName}>{doc.name}</div>
        <div style={styles.docDegree}>
          {doc.degree} — {doc.spec}
        </div>

        {/* Verified badge */}
        <div style={styles.verifiedBadge}>✅ Verified Doctor</div>

        {/* Stats */}
        <div style={styles.numsRow}>
          <div style={styles.numItem}>
            <div style={styles.numVal}>{doc.rating}⭐</div>
            <div style={styles.numLbl}>Rating</div>
          </div>
          <div style={styles.numItem}>
            <div style={styles.numVal}>{doc.patients}</div>
            <div style={styles.numLbl}>Patients</div>
          </div>
          <div style={styles.numItem}>
            <div style={styles.numVal}>{doc.exp}</div>
            <div style={styles.numLbl}>Experience</div>
          </div>
          <div style={styles.numItem}>
            <div style={styles.numVal}>
              {doc.online ? '🟢' : '🔴'}
            </div>
            <div style={styles.numLbl}>
              {doc.online ? 'Online' : 'Offline'}
            </div>
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={styles.body}>

        {/* About */}
        <div style={styles.section}>
          <div style={styles.secTitle}>About</div>
          <div style={styles.about}>
            Specialist in {doc.spec} with {doc.exp} of
            experience. Treats a wide range of conditions
            with compassionate and patient-centred care.
            Available in {doc.langs?.join(', ')}.
          </div>
        </div>

        {/* Details */}
        <div style={styles.section}>
          <div style={styles.secTitle}>Details</div>
          {[
            { icon: '🏥', label: 'Hospital',          val: 'Apollo Clinic, Chennai'      },
            { icon: '🌐', label: 'Languages',          val: doc.langs?.join(', ')         },
            { icon: '💬', label: 'Consultation Fee',   val: doc.fee                       },
            { icon: '📍', label: 'Location',           val: 'Chennai, Tamil Nadu'         },
          ].map((item, i) => (
            <div key={i} style={styles.infoRow}>
              <div style={styles.infoIcon}>{item.icon}</div>
              <div>
                <div style={styles.infoLabel}>{item.label}</div>
                <div style={styles.infoVal}>{item.val}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Time slots */}
        <div style={styles.section}>
          <div style={styles.secTitle}>
            Available Slots — Today
          </div>
          <div style={styles.slotsGrid}>
            {slots.map((s, i) => (
              <div
                key={i}
                style={
                  s.full
                    ? styles.slotFull
                    : selectedSlot === s.time
                    ? styles.slotActive
                    : styles.slot
                }
                onClick={() => {
                  if (!s.full) setSelectedSlot(s.time);
                }}
              >
                {s.full ? `🔴 ${s.time}` : s.time}
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom buttons */}
      <div style={styles.btnsRow}>
        <button
          style={styles.btnCall}
          onClick={() =>
            showToast(`📞 Connecting to ${doc.name}...`)
          }
        >
          📞 Call Now
        </button>
        <button
          style={styles.btnBook}
          onClick={() =>
            showToast(
              `📅 Appointment booked for ${selectedSlot}!`
            )
          }
        >
          📅 Book Slot
        </button>
      </div>

    </div>
  );
}
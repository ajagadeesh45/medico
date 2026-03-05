import React, { useState } from 'react';

export default function OwnerDashboard({
  user,
  handleLogout,
  showToast,
}) {

  const [activeTab, setActiveTab]   = useState('appointments');
  const [isOnline, setIsOnline]     = useState(true);

  const appointments = [
    {
      id:       '#MED-1042',
      patient:  'Arun Kumar',
      age:      '24yrs • Male',
      symptoms: 'Fever, Headache (2 days)',
      time:     'Just now',
      status:   'new',
    },
    {
      id:       '#MED-1041',
      patient:  'Priya Nair',
      age:      '32yrs • Female',
      symptoms: 'Cough, Cold (4 days)',
      time:     '11:00 AM',
      status:   'soon',
    },
    {
      id:       '#MED-1040',
      patient:  'Karthik Raja',
      age:      '45yrs • Male',
      symptoms: 'Follow-up: Blood Pressure',
      time:     '9:30 AM',
      status:   'done',
    },
    {
      id:       '#MED-1039',
      patient:  'Anitha P.',
      age:      '38yrs • Female',
      symptoms: 'Diabetes follow-up',
      time:     'Yesterday',
      status:   'done',
    },
  ];

  const patients = [
    {
      emoji:   '😊',
      name:    'Arun Kumar',
      desc:    '24yrs • Fever, Headache',
      time:    'Today',
      status:  'Improving well',
    },
    {
      emoji:   '👩',
      name:    'Priya Nair',
      desc:    '32yrs • Cough, Cold',
      time:    'Today',
      status:  'Follow-up in 3 days',
    },
    {
      emoji:   '👴',
      name:    'Rajan S.',
      desc:    '58yrs • BP Check',
      time:    'Yesterday',
      status:  'Stable, continue meds',
    },
    {
      emoji:   '👦',
      name:    'Kiran M.',
      desc:    '8yrs • Stomach pain',
      time:    '2 days ago',
      status:  'Recovered',
    },
    {
      emoji:   '👩',
      name:    'Anitha P.',
      desc:    '40yrs • Diabetes follow-up',
      time:    '3 days ago',
      status:  'Controlled',
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
    // Top section
    topSection: {
      background:  'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:     '20px 20px 32px',
      flexShrink:  '0',
    },
    greeting: {
      color:    'rgba(255,255,255,0.55)',
      fontSize: '14px',
    },
    docName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '22px',
      fontWeight: '800',
      color:      '#fff',
      marginTop:  '2px',
    },
    // Online toggle
    toggleRow: {
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      marginTop:    '14px',
      background:   'rgba(255,255,255,0.1)',
      borderRadius: '12px',
      padding:      '12px 16px',
    },
    toggleLabel: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#fff',
      flex:       '1',
    },
    toggleSwitch: {
      width:        '48px',
      height:       '26px',
      borderRadius: '50px',
      position:     'relative',
      cursor:       'pointer',
      border:       'none',
      transition:   'background 0.2s',
    },
    toggleThumb: {
      position:   'absolute',
      width:      '20px',
      height:     '20px',
      background: '#fff',
      borderRadius:'50%',
      top:        '3px',
      transition: 'left 0.2s',
    },
    // Stats grid
    statsGrid: {
      display:             'grid',
      gridTemplateColumns: '1fr 1fr',
      gap:                 '12px',
      padding:             '16px 20px',
      background:          '#F4F8FF',
      flexShrink:          '0',
    },
    statCard: {
      borderRadius: '14px',
      padding:      '16px',
      color:        '#fff',
    },
    statNum: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '26px',
      fontWeight: '800',
    },
    statLabel: {
      fontSize:  '12px',
      opacity:   '0.7',
      marginTop: '2px',
    },
    // Tabs
    tabsRow: {
      display:      'flex',
      background:   '#fff',
      borderBottom: '1px solid #EEF2FF',
      flexShrink:   '0',
    },
    tab: {
      flex:         '1',
      padding:      '14px',
      textAlign:    'center',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      color:        '#9BA8C9',
      cursor:       'pointer',
      border:       'none',
      background:   'transparent',
      borderBottom: '3px solid transparent',
    },
    tabActive: {
      flex:         '1',
      padding:      '14px',
      textAlign:    'center',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      color:        '#0A2F6E',
      cursor:       'pointer',
      border:       'none',
      background:   '#fff',
      borderBottom: '3px solid #0A2F6E',
    },
    // Scroll
    scroll: {
      flex:                    '1',
      overflowY:               'auto',
      WebkitOverflowScrolling: 'touch',
      paddingBottom:           '24px',
    },
    // Appointment card
    apptCard: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '16px',
      margin:       '12px 20px 0',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
    },
    apptHeader: {
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'space-between',
      marginBottom:   '6px',
    },
    apptId: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '13px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    apptTime: {
      fontSize: '12px',
      color:    '#5A6A8A',
    },
    apptPatient: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#0A2F6E',
    },
    apptSymptoms: {
      fontSize:  '13px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    apptBtns: {
      display:   'flex',
      gap:       '8px',
      marginTop: '10px',
    },
    btnAccept: {
      padding:      '9px 16px',
      borderRadius: '9px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#00C896',
      color:        '#fff',
    },
    btnCall: {
      padding:      '9px 16px',
      borderRadius: '9px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#0A2F6E',
      color:        '#fff',
    },
    btnDone: {
      padding:      '9px 16px',
      borderRadius: '9px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#EEF2FF',
      color:        '#5A6A8A',
    },
    doneText: {
      color:      '#00A878',
      fontSize:   '13px',
      fontWeight: '600',
      marginTop:  '8px',
    },
    // Patient card
    patientCard: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '14px 16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      margin:       '12px 20px 0',
    },
    patientAva: {
      width:          '44px',
      height:         '44px',
      background:     '#EEF2FF',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '22px',
      flexShrink:     '0',
    },
    patientName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '14px',
      fontWeight: '700',
      color:      '#0A2F6E',
    },
    patientDesc: {
      fontSize:  '12px',
      color:     '#5A6A8A',
      marginTop: '1px',
    },
    patientStatus: {
      fontSize:   '11px',
      color:      '#00A878',
      fontWeight: '600',
      marginTop:  '4px',
    },
    patientTime: {
      fontSize: '11px',
      color:    '#9BA8C9',
    },
    // Verification tab
    verifyCard: {
      background:   '#fff',
      borderRadius: '20px',
      padding:      '20px',
      margin:       '16px 20px 0',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
    },
    verifyHeader: {
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      marginBottom: '16px',
    },
    verifyIcon: {
      width:          '44px',
      height:         '44px',
      background:     'rgba(0,200,150,0.1)',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '22px',
    },
    verifyTitle: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '15px',
      fontWeight: '800',
      color:      '#0A2F6E',
    },
    verifySub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
    },
    docItem: {
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      padding:      '12px',
      background:   '#F4F8FF',
      borderRadius: '12px',
      marginBottom: '10px',
    },
    docItemIcon: {
      fontSize: '22px',
    },
    docItemName: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#0A2F6E',
      flex:       '1',
    },
    docItemSub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
    },
    approvedText: {
      fontSize:   '12px',
      fontWeight: '700',
      color:      '#00A878',
    },
    // Logout button
    logoutBtn: {
      margin:       '16px 20px',
      width:        'calc(100% - 40px)',
      padding:      '14px',
      background:   '#FEF2F2',
      color:        '#EF4444',
      border:       'none',
      borderRadius: '14px',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '15px',
      fontWeight:   '700',
      cursor:       'pointer',
    },
  };

  const statCards = [
    { num: '8',    label: 'Helped Today',  bg: '#0A2F6E' },
    { num: '342',  label: 'Total Patients', bg: '#00A878' },
    { num: '4.8⭐', label: 'Patient Rating', bg: '#FF6B35' },
    { num: '12yr', label: 'Experience',     bg: '#6C63FF' },
  ];

  return (
    <div style={styles.screen}>

      {/* Top section */}
      <div style={styles.topSection}>
        <div style={styles.greeting}>Welcome back 👋</div>
        <div style={styles.docName}>
          {user?.name || 'Dr. Ramesh Kumar'}
        </div>

        {/* Online toggle */}
        <div style={styles.toggleRow}>
          <span style={styles.toggleLabel}>
            {isOnline ? '🟢 You are Online' : '🔴 You are Offline'}
          </span>
          <button
            style={{
              ...styles.toggleSwitch,
              background: isOnline ? '#00C896' : 'rgba(255,255,255,0.2)',
            }}
            onClick={() => {
              setIsOnline(!isOnline);
              showToast(
                isOnline
                  ? '🔴 You are now Offline'
                  : '🟢 You are now Online'
              );
            }}
          >
            <div style={{
              ...styles.toggleThumb,
              left: isOnline ? '25px' : '3px',
            }}/>
          </button>
        </div>
      </div>

      {/* Stats grid */}
      <div style={styles.statsGrid}>
        {statCards.map((s, i) => (
          <div
            key={i}
            style={{ ...styles.statCard, background: s.bg }}
          >
            <div style={styles.statNum}>{s.num}</div>
            <div style={styles.statLabel}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div style={styles.tabsRow}>
        {[
          { id: 'appointments', label: 'Appointments' },
          { id: 'patients',     label: 'My Patients'  },
          { id: 'verification', label: 'Verification' },
        ].map(t => (
          <button
            key={t.id}
            style={
              activeTab === t.id
                ? styles.tabActive
                : styles.tab
            }
            onClick={() => setActiveTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.scroll}>

        {/* ── Appointments tab ── */}
        {activeTab === 'appointments' &&
          appointments.map((a, i) => (
            <div key={i} style={{
              ...styles.apptCard,
              borderLeft: `4px solid ${
                a.status === 'new'  ? '#00C896' :
                a.status === 'soon' ? '#FF6B35' :
                '#EEF2FF'
              }`,
            }}>
              <div style={styles.apptHeader}>
                <div style={styles.apptId}>
                  {a.status === 'new'  ? '🆕 New • '  :
                   a.status === 'soon' ? '⏰ Soon • ' :
                   '✅ Done • '}
                  {a.id}
                </div>
                <div style={styles.apptTime}>{a.time}</div>
              </div>
              <div style={styles.apptPatient}>
                👤 {a.patient} • {a.age}
              </div>
              <div style={styles.apptSymptoms}>
                {a.symptoms}
              </div>

              {/* Buttons based on status */}
              {a.status === 'new' && (
                <div style={styles.apptBtns}>
                  <button
                    style={styles.btnAccept}
                    onClick={() =>
                      showToast('✅ Appointment accepted!')
                    }
                  >
                    Accept
                  </button>
                  <button
                    style={styles.btnCall}
                    onClick={() =>
                      showToast('📞 Starting call...')
                    }
                  >
                    Start Call
                  </button>
                  <button
                    style={styles.btnDone}
                    onClick={() =>
                      showToast('❌ Appointment declined')
                    }
                  >
                    Decline
                  </button>
                </div>
              )}
              {a.status === 'soon' && (
                <div style={styles.apptBtns}>
                  <button
                    style={styles.btnCall}
                    onClick={() =>
                      showToast('📞 Starting call...')
                    }
                  >
                    Call Now
                  </button>
                  <button
                    style={styles.btnDone}
                    onClick={() =>
                      showToast('✅ Marked complete!')
                    }
                  >
                    Done
                  </button>
                </div>
              )}
              {a.status === 'done' && (
                <div style={styles.doneText}>
                  ✅ Consultation Complete
                </div>
              )}
            </div>
          ))
        }

        {/* ── My Patients tab ── */}
        {activeTab === 'patients' &&
          patients.map((p, i) => (
            <div key={i} style={styles.patientCard}>
              <div style={styles.patientAva}>{p.emoji}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.patientName}>{p.name}</div>
                <div style={styles.patientDesc}>{p.desc}</div>
                <div style={styles.patientStatus}>
                  ✅ {p.status}
                </div>
              </div>
              <div style={styles.patientTime}>{p.time}</div>
            </div>
          ))
        }

        {/* ── Verification tab ── */}
        {activeTab === 'verification' && (
          <div style={styles.verifyCard}>
            <div style={styles.verifyHeader}>
              <div style={styles.verifyIcon}>✅</div>
              <div>
                <div style={styles.verifyTitle}>
                  You are Verified!
                </div>
                <div style={styles.verifySub}>
                  All documents approved
                </div>
              </div>
            </div>
            {[
              {
                icon: '📄',
                name: 'Medical License',
                sub:  'MBBS #TN2012-4521',
              },
              {
                icon: '🪪',
                name: 'Govt Photo ID',
                sub:  'Aadhaar verified',
              },
              {
                icon: '🎓',
                name: 'Specialization Proof',
                sub:  'MD Certificate',
              },
            ].map((d, i) => (
              <div key={i} style={styles.docItem}>
                <span style={styles.docItemIcon}>{d.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={styles.docItemName}>{d.name}</div>
                  <div style={styles.docItemSub}>{d.sub}</div>
                </div>
                <div style={styles.approvedText}>
                  ✅ Approved
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Logout button */}
        <button
          style={styles.logoutBtn}
          onClick={handleLogout}
        >
          🚪 Logout
        </button>

      </div>
    </div>
  );
}
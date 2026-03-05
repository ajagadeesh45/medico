import React, { useState } from 'react';

export default function RecordsScreen({ goBack, showToast }) {

  const [activeTab, setActiveTab] = useState('prescriptions');

  const prescriptions = [
    {
      id:      1,
      medicine:'Paracetamol 500mg',
      doctor:  'Dr. Ramesh Kumar',
      date:    '2 days ago',
      dose:    'Twice daily after food',
      icon:    '💊',
    },
    {
      id:      2,
      medicine:'Vitamin C 500mg',
      doctor:  'Dr. Priya Sharma',
      date:    '1 week ago',
      dose:    'Once daily morning',
      icon:    '🍊',
    },
    {
      id:      3,
      medicine:'Cetirizine 10mg',
      doctor:  'Dr. Meena Devi',
      date:    '2 weeks ago',
      dose:    'Once daily at night',
      icon:    '💊',
    },
  ];

  const reports = [
    {
      id:    1,
      name:  'Complete Blood Count',
      lab:   'City Lab',
      date:  '1 week ago',
      icon:  '🩸',
      type:  'PDF',
    },
    {
      id:    2,
      name:  'Blood Sugar Test',
      lab:   'Apollo Diagnostics',
      date:  '1 month ago',
      icon:  '🔬',
      type:  'PDF',
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
      zIndex:        '50',
    },
    // Top bar
    topBar: {
      background:  'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:     '16px 20px 14px',
      display:     'flex',
      alignItems:  'center',
      gap:         '12px',
      flexShrink:  '0',
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
    // Health info card
    infoCard: {
      margin:       '16px 20px 0',
      background:   '#fff',
      borderRadius: '20px',
      padding:      '18px',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
    },
    infoTitle: {
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '15px',
      fontWeight:   '700',
      color:        '#0A2F6E',
      marginBottom: '12px',
      display:      'flex',
      alignItems:   'center',
      gap:          '8px',
    },
    bloodRow: {
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      paddingBottom:'12px',
      borderBottom: '1px solid #EEF2FF',
      marginBottom: '12px',
    },
    bloodBadge: {
      width:          '48px',
      height:         '48px',
      background:     'rgba(255,71,87,0.1)',
      borderRadius:   '14px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontFamily:     "'Syne', sans-serif",
      fontSize:       '18px',
      fontWeight:     '800',
      color:          '#FF4757',
      flexShrink:     '0',
    },
    bloodName: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#0A2F6E',
    },
    bloodSub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    tagsRow: {
      display:  'flex',
      gap:      '8px',
      flexWrap: 'wrap',
    },
    tagRed: {
      background:   'rgba(255,71,87,0.08)',
      borderRadius: '8px',
      padding:      '8px 12px',
      fontSize:     '12px',
      fontWeight:   '600',
      color:        '#FF4757',
    },
    tagGreen: {
      background:   'rgba(0,200,150,0.08)',
      borderRadius: '8px',
      padding:      '8px 12px',
      fontSize:     '12px',
      fontWeight:   '600',
      color:        '#00A878',
    },
    // Tabs
    tabs: {
      display:      'flex',
      background:   '#fff',
      borderBottom: '1px solid #EEF2FF',
      margin:       '16px 20px 0',
      borderRadius: '14px 14px 0 0',
      overflow:     'hidden',
      flexShrink:   '0',
    },
    tab: {
      flex:         '1',
      padding:      '13px',
      textAlign:    'center',
      fontFamily:   "'Syne', sans-serif',",
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
      padding:      '13px',
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
      padding:                 '12px 20px 100px',
    },
    // Item cards
    itemCard: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '14px 16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      marginBottom: '10px',
      cursor:       'pointer',
    },
    itemIcon: {
      width:          '44px',
      height:         '44px',
      background:     '#EEF2FF',
      borderRadius:   '12px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '22px',
      flexShrink:     '0',
    },
    itemName: {
      fontSize:   '14px',
      fontWeight: '600',
      color:      '#0A2F6E',
    },
    itemSub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    itemDose: {
      fontSize:  '11px',
      color:     '#00A878',
      fontWeight:'600',
      marginTop: '4px',
    },
    viewBtn: {
      background:   '#EEF2FF',
      borderRadius: '8px',
      padding:      '6px 12px',
      fontSize:     '12px',
      fontWeight:   '600',
      color:        '#0A2F6E',
      border:       'none',
      cursor:       'pointer',
      flexShrink:   '0',
    },
    // Add FAB
    fab: {
      position:       'fixed',
      bottom:         '24px',
      right:          'calc(50% - 210px + 20px)',
      width:          '56px',
      height:         '56px',
      background:     '#0A2F6E',
      borderRadius:   '50%',
      border:         'none',
      fontSize:       '26px',
      color:          '#fff',
      cursor:         'pointer',
      boxShadow:      '0 4px 20px rgba(10,47,110,0.35)',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={goBack}>←</button>
        <div style={styles.topTitle}>Health Records</div>
      </div>

      {/* Health info card */}
      <div style={styles.infoCard}>
        <div style={styles.infoTitle}>👤 My Health Info</div>
        <div style={styles.bloodRow}>
          <div style={styles.bloodBadge}>B+</div>
          <div>
            <div style={styles.bloodName}>Blood Group B+</div>
            <div style={styles.bloodSub}>
              Age: 24 • Male • 68 kg
            </div>
          </div>
        </div>
        <div style={styles.tagsRow}>
          <div style={styles.tagRed}>
            ⚠️ Allergic to Penicillin
          </div>
          <div style={styles.tagGreen}>
            💉 Vaccinated — COVID
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={styles.tabs}>
        <button
          style={
            activeTab === 'prescriptions'
              ? styles.tabActive
              : styles.tab
          }
          onClick={() => setActiveTab('prescriptions')}
        >
          📄 Prescriptions
        </button>
        <button
          style={
            activeTab === 'reports'
              ? styles.tabActive
              : styles.tab
          }
          onClick={() => setActiveTab('reports')}
        >
          📊 Lab Reports
        </button>
      </div>

      {/* Content */}
      <div style={styles.scroll}>

        {/* Prescriptions tab */}
        {activeTab === 'prescriptions' &&
          prescriptions.map(p => (
            <div
              key={p.id}
              style={styles.itemCard}
              onClick={() =>
                showToast('📄 Opening prescription...')
              }
            >
              <div style={styles.itemIcon}>{p.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.itemName}>{p.medicine}</div>
                <div style={styles.itemSub}>
                  {p.doctor} • {p.date}
                </div>
                <div style={styles.itemDose}>
                  ✅ {p.dose}
                </div>
              </div>
              <button
                style={styles.viewBtn}
                onClick={e => {
                  e.stopPropagation();
                  showToast('📄 Opening prescription...');
                }}
              >
                View
              </button>
            </div>
          ))
        }

        {/* Reports tab */}
        {activeTab === 'reports' &&
          reports.map(r => (
            <div
              key={r.id}
              style={styles.itemCard}
              onClick={() =>
                showToast('📊 Opening report...')
              }
            >
              <div style={styles.itemIcon}>{r.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={styles.itemName}>{r.name}</div>
                <div style={styles.itemSub}>
                  {r.lab} • {r.date}
                </div>
              </div>
              <button
                style={styles.viewBtn}
                onClick={e => {
                  e.stopPropagation();
                  showToast('📊 Opening report...');
                }}
              >
                {r.type}
              </button>
            </div>
          ))
        }

      </div>

      {/* Add FAB button */}
      <button
        style={styles.fab}
        onClick={() =>
          showToast('➕ Add record feature coming soon!')
        }
      >
        +
      </button>

    </div>
  );
}
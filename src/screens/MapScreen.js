import React, { useState } from 'react';
import BottomNav from '../components/BottomNav';

export default function MapScreen({ navigate, showToast }) {

  const [selectedPin, setSelectedPin] = useState(null);

  const hospitals = [
    {
      id:      0,
      icon:    '🏥',
      name:    'City Government Hospital',
      sub:     '0.3 km • 24/7 Emergency • Free',
      color:   '#0A2F6E',
      cx:      140,
      cy:      215,
    },
    {
      id:      1,
      icon:    '🏨',
      name:    'Apollo Multi-Speciality Clinic',
      sub:     '0.7 km • Open • Private',
      color:   '#1565C0',
      cx:      295,
      cy:      230,
    },
    {
      id:      2,
      icon:    '💊',
      name:    'MedPlus Pharmacy',
      sub:     '0.4 km • Open until 10 PM',
      color:   '#FF6B35',
      cx:      155,
      cy:      385,
    },
    {
      id:      3,
      icon:    '🩺',
      name:    'Primary Health Centre',
      sub:     '0.5 km • Government • Free OPD',
      color:   '#00C896',
      cx:      360,
      cy:      265,
    },
    {
      id:      4,
      icon:    '🚑',
      name:    'Emergency Trauma Centre',
      sub:     '0.9 km • 24/7 Ambulance',
      color:   '#FF4757',
      cx:      78,
      cy:      355,
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
    mapWrap: {
      flex:     '1',
      position: 'relative',
      overflow: 'hidden',
    },
    // Search bar on top of map
    searchWrap: {
      position: 'absolute',
      top:      '16px',
      left:     '16px',
      right:    '16px',
      zIndex:   '10',
      display:  'flex',
      flexDirection: 'column',
      gap:      '8px',
    },
    searchBox: {
      background:   '#fff',
      borderRadius: '14px',
      padding:      '12px 16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '10px',
      boxShadow:    '0 4px 24px rgba(10,47,110,0.12)',
    },
    searchInput: {
      flex:       '1',
      border:     'none',
      outline:    'none',
      fontFamily: "'DM Sans', sans-serif",
      fontSize:   '14px',
      color:      '#0D1B3E',
    },
    // Filter chips
    chipsRow: {
      display:   'flex',
      gap:       '8px',
      overflowX: 'auto',
    },
    chip: {
      background:   '#fff',
      borderRadius: '50px',
      padding:      '7px 14px',
      fontSize:     '12px',
      fontWeight:   '700',
      color:        '#0A2F6E',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      whiteSpace:   'nowrap',
      cursor:       'pointer',
      border:       '2px solid transparent',
      flexShrink:   '0',
    },
    chipActive: {
      background:   '#0A2F6E',
      borderRadius: '50px',
      padding:      '7px 14px',
      fontSize:     '12px',
      fontWeight:   '700',
      color:        '#fff',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      whiteSpace:   'nowrap',
      cursor:       'pointer',
      border:       '2px solid transparent',
      flexShrink:   '0',
    },
    // Popup card
    popup: {
      position:     'absolute',
      bottom:       '16px',
      left:         '16px',
      right:        '16px',
      background:   '#fff',
      borderRadius: '20px',
      padding:      '18px',
      boxShadow:    '0 8px 40px rgba(10,47,110,0.18)',
      zIndex:       '20',
      animation:    'slideUp 0.25s ease',
    },
    popupRow: {
      display:    'flex',
      alignItems: 'center',
      gap:        '12px',
    },
    popupIcon: {
      width:          '48px',
      height:         '48px',
      borderRadius:   '14px',
      background:     '#EEF2FF',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '24px',
      flexShrink:     '0',
    },
    popupName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '16px',
      fontWeight: '800',
      color:      '#0A2F6E',
    },
    popupSub: {
      fontSize:  '12px',
      color:     '#5A6A8A',
      marginTop: '2px',
    },
    popupBtns: {
      display:   'flex',
      gap:       '8px',
      marginTop: '12px',
    },
    btnCall: {
      flex:         '1',
      padding:      '11px',
      borderRadius: '10px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#00C896',
      color:        '#fff',
    },
    btnDir: {
      flex:         '1',
      padding:      '11px',
      borderRadius: '10px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
      background:   '#EEF2FF',
      color:        '#0A2F6E',
    },
  };

  return (
    <div style={styles.screen}>

      <div
        style={styles.mapWrap}
        onClick={(e) => {
          if (e.target.tagName === 'svg' ||
              e.target.tagName === 'rect' ||
              e.target.tagName === 'line' ||
              e.target.tagName === 'ellipse' ||
              e.target.tagName === 'text') {
            setSelectedPin(null);
          }
        }}
      >

        {/* Search & Filter */}
        <div style={styles.searchWrap}>
          <div style={styles.searchBox}>
            <span style={{ fontSize: '18px' }}>🔍</span>
            <input
              style={styles.searchInput}
              placeholder="Search hospital, clinic..."
            />
            <span
              style={{ fontSize: '18px', cursor: 'pointer' }}
              onClick={() => showToast('📍 Using your GPS location')}
            >
              📍
            </span>
          </div>
          <div style={styles.chipsRow}>
            {['All', '🏥 Hospitals', '🏨 Clinics',
              '💊 Pharmacy', '🚑 Emergency'].map((c, i) => (
              <div key={i} style={i === 0 ? styles.chipActive : styles.chip}>
                {c}
              </div>
            ))}
          </div>
        </div>

        {/* SVG Map */}
        <svg
          viewBox="0 0 420 620"
          style={{
            position: 'absolute',
            inset:    '0',
            width:    '100%',
            height:   '100%',
          }}
        >
          {/* Map background */}
          <rect width="420" height="620" fill="#e8f0dc"/>

          {/* Roads */}
          <line x1="0"   y1="160" x2="420" y2="160" stroke="#fff" strokeWidth="20"/>
          <line x1="0"   y1="320" x2="420" y2="320" stroke="#fff" strokeWidth="20"/>
          <line x1="0"   y1="480" x2="420" y2="480" stroke="#fff" strokeWidth="16"/>
          <line x1="105" y1="0"   x2="105" y2="620" stroke="#fff" strokeWidth="14"/>
          <line x1="220" y1="0"   x2="220" y2="620" stroke="#fff" strokeWidth="24"/>
          <line x1="340" y1="0"   x2="340" y2="620" stroke="#fff" strokeWidth="14"/>

          {/* Blocks */}
          <rect x="115" y="170" width="95"  height="140" rx="10" fill="#d4e6c8" opacity=".8"/>
          <rect x="230" y="170" width="100" height="140" rx="10" fill="#d4e6c8" opacity=".8"/>
          <rect x="115" y="330" width="95"  height="140" rx="10" fill="#d4e6c8" opacity=".8"/>
          <rect x="230" y="330" width="100" height="140" rx="10" fill="#d4e6c8" opacity=".8"/>
          <rect x="8"   y="170" width="88"  height="300" rx="10" fill="#c8dcc0" opacity=".6"/>
          <rect x="352" y="170" width="62"  height="300" rx="10" fill="#c8dcc0" opacity=".6"/>

          {/* Park */}
          <ellipse cx="163" cy="245" rx="32" ry="24" fill="#a8d898" opacity=".9"/>
          <text x="163" y="250" textAnchor="middle" fontSize="16">🌳</text>

          {/* Water */}
          <ellipse cx="280" cy="400" rx="28" ry="18" fill="#a8c8e8" opacity=".7"/>

          {/* Road labels */}
          <text x="210" y="152" textAnchor="middle" fontSize="9"
            fill="#aaa" fontFamily="sans-serif" fontWeight="600">
            MAIN ROAD
          </text>
          <text x="210" y="312" textAnchor="middle" fontSize="9"
            fill="#aaa" fontFamily="sans-serif" fontWeight="600">
            CROSS STREET
          </text>

          {/* You are here */}
          <circle cx="220" cy="320" r="20"
            fill="rgba(10,47,110,0.15)"
            stroke="rgba(10,47,110,0.3)"
            strokeWidth="1.5"
          />
          <circle cx="220" cy="320" r="10" fill="#0A2F6E"/>
          <circle cx="220" cy="320" r="4"  fill="#fff"/>

          {/* Hospital pins */}
          {hospitals.map(h => (
            <g
              key={h.id}
              style={{ cursor: 'pointer' }}
              onClick={() => setSelectedPin(h)}
            >
              <circle
                cx={h.cx} cy={h.cy} r="22"
                fill={h.color}
                stroke="#fff"
                strokeWidth="2"
              />
              <text
                x={h.cx} y={h.cy + 7}
                textAnchor="middle"
                fontSize="18"
              >
                {h.icon}
              </text>
            </g>
          ))}
        </svg>

        {/* Popup card */}
        {selectedPin && (
          <div style={styles.popup}>
            <div style={styles.popupRow}>
              <div style={styles.popupIcon}>{selectedPin.icon}</div>
              <div>
                <div style={styles.popupName}>{selectedPin.name}</div>
                <div style={styles.popupSub}>{selectedPin.sub}</div>
              </div>
            </div>
            <div style={styles.popupBtns}>
              <button
                style={styles.btnCall}
                onClick={() => showToast('📞 Calling hospital...')}
              >
                📞 Call
              </button>
              <button
                style={styles.btnDir}
                onClick={() => showToast('🗺️ Opening directions...')}
              >
                🗺️ Directions
              </button>
            </div>
          </div>
        )}

      </div>

      {/* Bottom Nav */}
      <BottomNav active="map" navigate={navigate} />

    </div>
  );
}
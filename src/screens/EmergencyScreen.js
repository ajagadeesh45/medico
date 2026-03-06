import React, { useState, useEffect } from 'react';

export default function EmergencyScreen({ goBack, showToast }) {

  const [pressed, setPressed]       = useState(false);
  const [location, setLocation]     = useState(null);
  const [nearestHosp, setNearestHosp] = useState(null);
  const [loading, setLoading]       = useState(true);

  // ── Get GPS + nearest hospital on load ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setLocation({ lat, lng });
        fetchNearestHospital(lat, lng);
      },
      () => {
        setLoading(false);
      }
    );
  }, []);

  // ── Fetch nearest hospital from OpenStreetMap ──
  const fetchNearestHospital = (lat, lng) => {
    const q = '[out:json][timeout:10];node["amenity"="hospital"](around:5000,' + lat + ',' + lng + ');out 1;';
    fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q))
      .then(r => r.json())
      .then(data => {
        if (data.elements && data.elements.length > 0) {
          const h = data.elements[0];
          const dist = getDistance(lat, lng, h.lat, h.lon);
          setNearestHosp({
            name:  h.tags.name || 'Nearest Hospital',
            lat:   h.lat,
            lng:   h.lon,
            phone: h.tags.phone || h.tags['contact:phone'] || null,
            dist:  dist,
          });
        }
        setLoading(false);
      })
      .catch(() => setLoading(false));
  };

  // ── Calculate distance ──
  const getDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lng2 - lng1) * Math.PI / 180;
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) *
      Math.cos(lat2 * Math.PI / 180) *
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1000;
    return d < 1000
      ? Math.round(d) + 'm away'
      : (d/1000).toFixed(1) + 'km away';
  };

  // ── SOS Button pressed ──
  const handleSOS = () => {
    setPressed(true);

    // Immediately call 108
    window.location.href = 'tel:108';

    setTimeout(() => setPressed(false), 3000);
  };

  // ── Call hospital directly ──
  const callHospital = () => {
    if (nearestHosp && nearestHosp.phone) {
      window.location.href = 'tel:' + nearestHosp.phone;
    } else {
      window.location.href = 'tel:108';
    }
  };

  // ── Open directions to hospital ──
  const openDirections = () => {
    if (nearestHosp) {
      window.open(
        'https://www.google.com/maps/dir/?api=1&destination=' +
        nearestHosp.lat + ',' + nearestHosp.lng,
        '_blank'
      );
    }
  };

  // ── Call 108 ambulance ──
  const call108 = () => {
    window.location.href = 'tel:108';
  };

  const styles = {
    screen: {
      position:       'fixed',
      inset:          '0',
      maxWidth:       '420px',
      margin:         '0 auto',
      display:        'flex',
      flexDirection:  'column',
      background:     'linear-gradient(160deg, #8B0000 0%, #C0392B 50%, #E74C3C 100%)',
      zIndex:         '50',
    },
    topBar: {
      padding:    '16px 20px 14px',
      display:    'flex',
      alignItems: 'center',
      gap:        '12px',
      flexShrink: '0',
      background: 'rgba(0,0,0,0.2)',
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
    content: {
      flex:           '1',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '16px',
      padding:        '24px',
    },
    ring: {
      position:       'relative',
      width:          '200px',
      height:         '200px',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    },
    ringOuter: {
      position:     'absolute',
      width:        '200px',
      height:       '200px',
      borderRadius: '50%',
      border:       '2px solid rgba(255,255,255,0.2)',
      animation:    'glow 2s ease-in-out infinite',
    },
    ringInner: {
      position:     'absolute',
      width:        '160px',
      height:       '160px',
      borderRadius: '50%',
      background:   'rgba(255,255,255,0.08)',
    },
    sosBtn: {
      width:          '140px',
      height:         '140px',
      background:     pressed ? '#ffcccc' : '#fff',
      borderRadius:   '50%',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      gap:            '6px',
      cursor:         'pointer',
      zIndex:         '2',
      border:         'none',
      transition:     'all 0.2s',
      boxShadow:      '0 0 32px rgba(255,255,255,0.3)',
    },
    sosBtnIcon:  { fontSize: '44px' },
    sosBtnLabel: {
      fontSize:   '11px',
      fontWeight: '800',
      color:      '#C0392B',
      fontFamily: "'Syne', sans-serif",
    },
    title: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '24px',
      fontWeight: '800',
      color:      '#fff',
      textAlign:  'center',
    },
    sub: {
      color:      'rgba(255,255,255,0.65)',
      fontSize:   '13px',
      textAlign:  'center',
      lineHeight: '1.6',
    },
    statusMsg: {
      background:   'rgba(255,255,255,0.15)',
      borderRadius: '12px',
      padding:      '10px 20px',
      color:        '#fff',
      fontSize:     '14px',
      fontWeight:   '600',
      textAlign:    'center',
    },
    hospCard: {
      background:     'rgba(255,255,255,0.12)',
      borderRadius:   '16px',
      padding:        '16px',
      width:          '100%',
      border:         '1px solid rgba(255,255,255,0.15)',
    },
    hospName: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '15px',
      fontWeight: '700',
      color:      '#fff',
    },
    hospSub: {
      fontSize:  '12px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '4px',
    },
    hospBtns: {
      display:   'flex',
      gap:       '8px',
      marginTop: '12px',
    },
    hospBtn: {
      flex:         '1',
      padding:      '10px',
      borderRadius: '10px',
      border:       'none',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '13px',
      fontWeight:   '700',
      cursor:       'pointer',
    },
    ambulanceBtn: {
      width:        '100%',
      padding:      '16px',
      background:   'rgba(255,255,255,0.2)',
      border:       '2px solid rgba(255,255,255,0.3)',
      borderRadius: '14px',
      fontFamily:   "'Syne', sans-serif",
      fontSize:     '16px',
      fontWeight:   '800',
      color:        '#fff',
      cursor:       'pointer',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Top bar */}
      <div style={styles.topBar}>
        <button style={styles.backBtn} onClick={goBack}>←</button>
        <div style={styles.topTitle}>🚨 Emergency</div>
      </div>

      <div style={styles.content}>

        {/* SOS Ring */}
        <div style={styles.ring}>
          <div style={styles.ringOuter}/>
          <div style={styles.ringInner}/>
          <button style={styles.sosBtn} onClick={handleSOS}>
            <span style={styles.sosBtnIcon}>🆘</span>
            <span style={styles.sosBtnLabel}>
              {pressed ? 'CALLING 108...' : 'TAP TO CALL'}
            </span>
          </button>
        </div>

        {/* Status */}
        {pressed && (
          <div style={styles.statusMsg}>
            📞 Calling 108 Ambulance...
          </div>
        )}

        {/* Title */}
        <div style={styles.title}>Need Emergency Help?</div>
        <div style={styles.sub}>
          Tap the SOS button to instantly call{'\n'}
          108 Free Ambulance Service
        </div>

        {/* Nearest Hospital Card */}
        <div style={styles.hospCard}>
          {loading ? (
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>
              📍 Finding nearest hospital...
            </div>
          ) : nearestHosp ? (
            <>
              <div style={styles.hospName}>
                🏥 {nearestHosp.name}
              </div>
              <div style={styles.hospSub}>
                📍 {nearestHosp.dist} • 24/7 Emergency
              </div>
              <div style={styles.hospBtns}>
                <button
                  style={{...styles.hospBtn, background:'#00C896', color:'#fff'}}
                  onClick={callHospital}
                >
                  📞 Call Hospital
                </button>
                <button
                  style={{...styles.hospBtn, background:'rgba(255,255,255,0.2)', color:'#fff'}}
                  onClick={openDirections}
                >
                  🗺️ Directions
                </button>
              </div>
            </>
          ) : (
            <div style={{color:'rgba(255,255,255,0.7)',fontSize:'14px'}}>
              📍 Enable GPS to find nearest hospital
            </div>
          )}
        </div>

        {/* 108 Ambulance button */}
        <button style={styles.ambulanceBtn} onClick={call108}>
          📞 Call 108 — Free Ambulance
        </button>

      </div>
    </div>
  );
}
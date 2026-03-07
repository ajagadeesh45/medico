import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../components/BottomNav';

const getDist = (lat1, lng1, lat2, lng2) => {
  const R    = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lng2 - lng1) * Math.PI / 180;
  const a    =
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const d = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) * 1000;
  return d < 1000
    ? Math.round(d) + 'm away'
    : (d/1000).toFixed(1) + 'km away';
};

const getColor = (type) => {
  if (type === 'hospital') return '#0A2F6E';
  if (type === 'clinic')   return '#1565C0';
  if (type === 'pharmacy') return '#FF6B35';
  return '#00C896';
};

const getLabel = (type) => {
  if (type === 'hospital') return '🏥 Hospital';
  if (type === 'clinic')   return '🏨 Clinic';
  if (type === 'pharmacy') return '💊 Pharmacy';
  return '🏥 Medical';
};

const FALLBACK = [
  { id:1,  name:'Apollo Hospitals',            lat:13.0629, lng:80.2785, type:'hospital', phone:'+914428296666' },
  { id:2,  name:'Fortis Malar Hospital',       lat:13.0108, lng:80.2575, type:'hospital', phone:'+914442592222' },
  { id:3,  name:'MIOT International',          lat:13.0159, lng:80.1912, type:'hospital', phone:'+914422492288' },
  { id:4,  name:'Kauvery Hospital',            lat:13.0524, lng:80.2464, type:'hospital', phone:'+914444554455' },
  { id:5,  name:'Stanley Medical College',     lat:13.1083, lng:80.2870, type:'hospital', phone:'+914425281349' },
  { id:6,  name:'Rajiv Gandhi Govt Hospital',  lat:13.0836, lng:80.2754, type:'hospital', phone:'+914425305000' },
  { id:7,  name:'Vijaya Hospital',             lat:13.0358, lng:80.2108, type:'hospital', phone:'+914422650000' },
  { id:8,  name:'Sri Ramachandra Hospital',    lat:13.0339, lng:80.1597, type:'hospital', phone:'+914445928888' },
  { id:9,  name:'Govt Royapettah Hospital',    lat:13.0549, lng:80.2644, type:'hospital', phone:null },
  { id:10, name:'Dr Mehta Hospitals',          lat:13.0633, lng:80.2587, type:'hospital', phone:'+914428264266' },
  { id:11, name:'Kilpauk Medical College',     lat:13.0850, lng:80.2480, type:'hospital', phone:'+914426441000' },
  { id:12, name:'Madras Medical College',      lat:13.0827, lng:80.2707, type:'hospital', phone:'+914428193000' },
  { id:13, name:'MedPlus Pharmacy Egmore',     lat:13.0770, lng:80.2607, type:'pharmacy', phone:null },
  { id:14, name:'Apollo Pharmacy T Nagar',     lat:13.0400, lng:80.2340, type:'pharmacy', phone:null },
  { id:15, name:'City Clinic Egmore',          lat:13.0700, lng:80.2600, type:'clinic',   phone:null },
  { id:16, name:'ESI Hospital Chennai',        lat:13.0900, lng:80.2800, type:'hospital', phone:null },
  { id:17, name:'Voluntary Health Services',   lat:12.9900, lng:80.2100, type:'hospital', phone:'+914422540600' },
  { id:18, name:'Sundaram Medical Foundation', lat:13.0450, lng:80.2350, type:'hospital', phone:'+914424743000' },
  { id:19, name:'Nungambakkam Clinic',         lat:13.0600, lng:80.2400, type:'clinic',   phone:null },
  { id:20, name:'Greams Road Pharmacy',        lat:13.0580, lng:80.2580, type:'pharmacy', phone:null },
];

export default function MapScreen({ navigate }) {

  const mapContainer = useRef(null);
  const mapRef       = useRef(null);
  const markersRef   = useRef([]);
  const placesRef    = useRef([]);
  const locationRef  = useRef(null);

  const [location, setLocation] = useState(null);
  const [places, setPlaces]     = useState([]);
  const [filter, setFilter]     = useState('all');
  const [loading, setLoading]   = useState(true);
  const [mapReady, setMapReady] = useState(false);
  const [count, setCount]       = useState(0);

  const filters = [
    { id: 'all',      label: 'All'        },
    { id: 'hospital', label: '🏥 Hospital' },
    { id: 'clinic',   label: '🏨 Clinic'   },
    { id: 'pharmacy', label: '💊 Pharmacy' },
  ];

  // ── Add markers ──
  const addMarkers = (allPlaces, currentFilter, loc) => {
    if (!mapRef.current || !window.L) {
      setTimeout(() => addMarkers(allPlaces, currentFilter, loc), 500);
      return;
    }

    const L   = window.L;
    const map = mapRef.current;

    markersRef.current.forEach(m => { try { map.removeLayer(m); } catch(e) {} });
    markersRef.current = [];

    const toShow = currentFilter === 'all'
      ? allPlaces
      : allPlaces.filter(p => p.type === currentFilter);

    setCount(toShow.length);

    toShow.forEach(place => {
      const color = getColor(place.type);
      const icon  = L.divIcon({
        html:
          '<div style="' +
          'width:34px;height:34px;' +
          'background:' + color + ';' +
          'border-radius:50% 50% 50% 0;' +
          'transform:rotate(-45deg);' +
          'border:3px solid #fff;' +
          'box-shadow:0 3px 10px rgba(0,0,0,0.3);' +
          '"></div>',
        iconSize:   [34, 34],
        iconAnchor: [17, 34],
        className:  '',
      });

      const dist    = loc
        ? getDist(loc.lat, loc.lng, place.lat, place.lng)
        : '';
      const callBtn = place.phone
        ? '<button onclick="window.location.href=\'tel:' + place.phone + '\'" ' +
          'style="flex:1;padding:8px;background:#00C896;color:#fff;border:none;' +
          'border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📞 Call</button>'
        : '';
      const dirBtn =
        '<button onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination=' +
        place.lat + ',' + place.lng + '\',\'_blank\')" ' +
        'style="flex:1;padding:8px;background:#0A2F6E;color:#fff;border:none;' +
        'border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🗺️ Directions</button>';

      const popup =
        '<div style="font-family:sans-serif;min-width:195px;padding:4px;">' +
        '<div style="font-weight:700;font-size:12px;color:#0A2F6E;margin-bottom:3px;">' +
        getLabel(place.type) + '</div>' +
        '<div style="font-size:14px;color:#111;font-weight:700;margin-bottom:4px;">' +
        place.name + '</div>' +
        (dist
          ? '<div style="font-size:12px;color:#5A6A8A;margin-bottom:8px;">📍 ' + dist + '</div>'
          : '') +
        '<div style="display:flex;gap:6px;">' + callBtn + dirBtn + '</div>' +
        '</div>';

      try {
        const marker = L.marker([place.lat, place.lng], { icon })
          .addTo(map)
          .bindPopup(popup);
        markersRef.current.push(marker);
      } catch(e) {}
    });
  };

  // ── Step 1: GPS ──
  useEffect(() => {
    if (!navigator.geolocation) {
      const loc = { lat: 13.0827, lng: 80.2707 };
      setLocation(loc);
      locationRef.current = loc;
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        locationRef.current = loc;
      },
      () => {
        const loc = { lat: 13.0827, lng: 80.2707 };
        setLocation(loc);
        locationRef.current = loc;
      }
    );
  }, []);

  // ── Step 2: Fetch hospitals ──
  useEffect(() => {
    if (!location) return;

    const fetchPlaces = async () => {
      const { lat, lng } = location;

      const q =
        '[out:json][timeout:25];(' +
        'node["amenity"="hospital"](around:5000,' + lat + ',' + lng + ');' +
        'node["amenity"="clinic"](around:5000,' + lat + ',' + lng + ');' +
        'node["amenity"="pharmacy"](around:5000,' + lat + ',' + lng + ');' +
        'node["amenity"="doctors"](around:5000,' + lat + ',' + lng + ');' +
        'way["amenity"="hospital"](around:5000,' + lat + ',' + lng + ');' +
        ');out center max 50;';

      const attempts = [
        () => fetch('https://overpass-api.de/api/interpreter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    'data=' + encodeURIComponent(q),
        }),
        () => fetch('https://overpass.kumi.systems/api/interpreter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    'data=' + encodeURIComponent(q),
        }),
        () => fetch('https://lz4.overpass-api.de/api/interpreter', {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    'data=' + encodeURIComponent(q),
        }),
      ];

      for (let attempt of attempts) {
        try {
          console.log('Trying Overpass...');
          const res  = await attempt();
          const data = await res.json();
          console.log('Elements found:', data.elements?.length);

          if (data.elements && data.elements.length > 0) {
            const results = data.elements
              .filter(el => el.tags && el.tags.name)
              .map(el => ({
                id:    el.id,
                name:  el.tags.name,
                lat:   el.lat || (el.center && el.center.lat),
                lng:   el.lon || (el.center && el.center.lon),
                type:  el.tags.amenity === 'pharmacy' ? 'pharmacy' :
                       el.tags.amenity === 'clinic' ||
                       el.tags.amenity === 'doctors' ? 'clinic' : 'hospital',
                phone: el.tags.phone || el.tags['contact:phone'] || null,
              }))
              .filter(el => el.lat && el.lng);

            if (results.length > 0) {
              console.log('✅ Live data:', results.length);
              placesRef.current = results;
              setPlaces(results);
              setCount(results.length);
              setLoading(false);
              setTimeout(() => addMarkers(results, 'all', locationRef.current), 800);
              return;
            }
          }
        } catch(e) {
          console.log('Attempt failed:', e.message);
        }
      }

      // ── Fallback ──
      console.log('Using fallback data');
      placesRef.current = FALLBACK;
      setPlaces(FALLBACK);
      setCount(FALLBACK.length);
      setLoading(false);
      setTimeout(() => addMarkers(FALLBACK, 'all', locationRef.current), 800);
    };

    fetchPlaces();
  }, [location]);

  // ── Step 3: Init Leaflet ──
  useEffect(() => {
    if (!location || !mapContainer.current) return;

    if (!document.getElementById('leaflet-css')) {
      const link  = document.createElement('link');
      link.id     = 'leaflet-css';
      link.rel    = 'stylesheet';
      link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    const initMap = () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch(e) {}
        mapRef.current = null;
      }

      const L   = window.L;
      const map = L.map(mapContainer.current, {
        zoomControl: true,
      }).setView([location.lat, location.lng], 14);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom:     19,
      }).addTo(map);

      // You are here dot
      const youIcon = L.divIcon({
        html:
          '<div style="' +
          'width:20px;height:20px;' +
          'background:#0A2F6E;' +
          'border-radius:50%;' +
          'border:4px solid #fff;' +
          'box-shadow:0 0 0 3px rgba(10,47,110,0.3);' +
          '"></div>',
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
        className:  '',
      });

      L.marker([location.lat, location.lng], { icon: youIcon })
        .addTo(map)
        .bindPopup('<b>📍 You are here</b>');

      mapRef.current = map;
      setMapReady(true);
      console.log('✅ Map ready');

      if (placesRef.current.length > 0) {
        setTimeout(() => addMarkers(placesRef.current, filter, locationRef.current), 300);
      }
    };

    if (window.L) {
      initMap();
    } else {
      const script  = document.createElement('script');
      script.src    = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (mapRef.current) {
        try { mapRef.current.remove(); } catch(e) {}
        mapRef.current = null;
      }
    };
  }, [location]);

  // ── Step 4: Filter change ──
  useEffect(() => {
    if (placesRef.current.length > 0 && mapReady) {
      addMarkers(placesRef.current, filter, locationRef.current);
    }
  }, [filter, mapReady]);

  return (
    <div style={{
      position:      'fixed',
      inset:         '0',
      maxWidth:      '420px',
      margin:        '0 auto',
      display:       'flex',
      flexDirection: 'column',
    }}>
      <div style={{ flex:'1', position:'relative' }}>

        {/* Search + Filter bar */}
        <div style={{
          position:      'absolute',
          top:           '16px',
          left:          '66px',
          right:         '16px',
          zIndex:        '1000',
          display:       'flex',
          flexDirection: 'column',
          gap:           '8px',
        }}>
          <div style={{
            background:   '#fff',
            borderRadius: '14px',
            padding:      '12px 16px',
            display:      'flex',
            alignItems:   'center',
            gap:          '10px',
            boxShadow:    '0 4px 24px rgba(10,47,110,0.15)',
          }}>
            <span style={{ fontSize:'18px' }}>🔍</span>
            <span style={{ flex:'1', fontSize:'14px', color:'#5A6A8A' }}>
              {loading
                ? 'Finding hospitals near you...'
                : count + ' places found nearby'}
            </span>
            <span style={{ fontSize:'18px' }}>📍</span>
          </div>

          {/* Filter chips */}
          <div style={{ display:'flex', gap:'8px', overflowX:'auto' }}>
            {filters.map(f => (
              <div
                key={f.id}
                onClick={() => setFilter(f.id)}
                style={{
                  background:   filter === f.id ? '#0A2F6E' : '#fff',
                  color:        filter === f.id ? '#fff'    : '#0A2F6E',
                  borderRadius: '50px',
                  padding:      '7px 14px',
                  fontSize:     '12px',
                  fontWeight:   '700',
                  whiteSpace:   'nowrap',
                  cursor:       'pointer',
                  flexShrink:   '0',
                  boxShadow:    '0 2px 8px rgba(10,47,110,0.1)',
                }}
              >
                {f.label}
              </div>
            ))}
          </div>
        </div>

        {/* Count badge */}
        {!loading && (
          <div style={{
            position:     'absolute',
            top:          '106px',
            right:        '16px',
            background:   '#0A2F6E',
            color:        '#fff',
            borderRadius: '50px',
            padding:      '6px 14px',
            fontSize:     '12px',
            fontWeight:   '700',
            zIndex:       '1000',
            boxShadow:    '0 2px 8px rgba(10,47,110,0.3)',
          }}>
            {'📍 ' + count + ' nearby'}
          </div>
        )}

        {/* Map */}
        <div
          ref={mapContainer}
          style={{ width:'100%', height:'100%' }}
        />

        {/* Loading */}
        {loading && (
          <div style={{
            position:       'absolute',
            inset:          '0',
            background:     'rgba(255,255,255,0.93)',
            display:        'flex',
            flexDirection:  'column',
            alignItems:     'center',
            justifyContent: 'center',
            zIndex:         '2000',
            gap:            '12px',
          }}>
            <div style={{ fontSize:'52px' }}>🗺️</div>
            <div style={{
              fontSize:   '16px',
              fontWeight: '700',
              color:      '#0A2F6E',
            }}>
              Finding hospitals near you...
            </div>
            <div style={{ fontSize:'13px', color:'#5A6A8A' }}>
              Getting your GPS location
            </div>
          </div>
        )}

      </div>

      <BottomNav active="map" navigate={navigate} />
    </div>
  );
}
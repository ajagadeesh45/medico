import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../components/BottomNav';

const getLabel = (tags) => {
  if (tags.amenity === 'hospital') return '🏥 Hospital';
  if (tags.amenity === 'clinic')   return '🏨 Clinic';
  if (tags.amenity === 'pharmacy') return '💊 Pharmacy';
  if (tags.amenity === 'doctors')  return '🩺 Doctor';
  return '🏥 Medical';
};

const getColor = (tags) => {
  if (tags.amenity === 'hospital') return '#0A2F6E';
  if (tags.amenity === 'clinic')   return '#1565C0';
  if (tags.amenity === 'pharmacy') return '#FF6B35';
  if (tags.amenity === 'doctors')  return '#1565C0';
  return '#00C896';
};

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

export default function MapScreen({ navigate }) {

  const mapRef             = useRef(null);
  const leafletMap         = useRef(null);
  const [location, setLocation] = useState(null);
  const [places, setPlaces]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [error, setError]       = useState(null);

  const filters = [
    { id: 'all',      label: 'All'        },
    { id: 'hospital', label: '🏥 Hospital' },
    { id: 'clinic',   label: '🏨 Clinic'   },
    { id: 'pharmacy', label: '💊 Pharmacy' },
  ];

  // ── Step 1: Get GPS ──
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocation({ lat: 13.0827, lng: 80.2707 });
      setError('GPS not available. Showing Chennai.');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setLocation({
        lat: pos.coords.latitude,
        lng: pos.coords.longitude,
      }),
      () => {
        setLocation({ lat: 13.0827, lng: 80.2707 });
        setError('Could not get location. Showing Chennai.');
      }
    );
  }, []);

  // ── Step 2: Fetch hospitals ──
  useEffect(() => {
    if (!location) return;
    const { lat, lng } = location;
    const q =
      '[out:json][timeout:25];(' +
      'node["amenity"="hospital"](around:3000,' + lat + ',' + lng + ');' +
      'node["amenity"="clinic"](around:3000,' + lat + ',' + lng + ');' +
      'node["amenity"="pharmacy"](around:3000,' + lat + ',' + lng + ');' +
      'node["amenity"="doctors"](around:3000,' + lat + ',' + lng + ');' +
      'way["amenity"="hospital"](around:3000,' + lat + ',' + lng + ');' +
      ');out center max 30;';

    fetch('https://overpass-api.de/api/interpreter?data=' + encodeURIComponent(q))
      .then(r => r.json())
      .then(data => {
        const results = data.elements
          .filter(el => el.tags && el.tags.name)
          .map(el => ({
            id:    el.id,
            name:  el.tags.name,
            lat:   el.lat || (el.center && el.center.lat),
            lng:   el.lon || (el.center && el.center.lon),
            tags:  el.tags,
            phone: el.tags.phone || el.tags['contact:phone'] || null,
          }))
          .filter(el => el.lat && el.lng);
        setPlaces(results);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setError('Could not load hospitals. Check internet.');
      });
  }, [location]);

  // ── Step 3: Init Leaflet map directly ──
  useEffect(() => {
    if (!location || !mapRef.current) return;

    // Load Leaflet CSS dynamically
    if (!document.getElementById('leaflet-css')) {
      const link  = document.createElement('link');
      link.id     = 'leaflet-css';
      link.rel    = 'stylesheet';
      link.href   = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
    }

    // Load Leaflet JS dynamically
    const initMap = () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }

      const L   = window.L;
      const map = L.map(mapRef.current, { zoomControl: false }).setView(
        [location.lat, location.lng], 15
      );

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);

      // Your location circle
      L.circle([location.lat, location.lng], {
        radius:      80,
        color:       '#0A2F6E',
        fillColor:   '#0A2F6E',
        fillOpacity: 0.4,
      }).addTo(map);

      leafletMap.current = map;
    };

    if (window.L) {
      initMap();
    } else {
      const script    = document.createElement('script');
      script.src      = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload   = initMap;
      document.head.appendChild(script);
    }

    return () => {
      if (leafletMap.current) {
        leafletMap.current.remove();
        leafletMap.current = null;
      }
    };
  }, [location]);

  // ── Step 4: Add markers when places load ──
  useEffect(() => {
    if (!leafletMap.current || !window.L || places.length === 0) return;
    const L        = window.L;
    const map      = leafletMap.current;
    const filtered = filter === 'all'
      ? places
      : places.filter(p => p.tags && p.tags.amenity === filter);

    // Clear old markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) map.removeLayer(layer);
    });

    filtered.forEach(place => {
      const color = getColor(place.tags);
      const icon  = L.divIcon({
        html: '<div style="width:32px;height:32px;background:' + color + ';border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',
        iconSize:   [32, 32],
        iconAnchor: [16, 32],
        className:  '',
      });

      const dist    = getDist(location.lat, location.lng, place.lat, place.lng);
      const callBtn = place.phone
        ? '<button onclick="window.location.href=\'tel:' + place.phone + '\'" style="flex:1;padding:8px;background:#00C896;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📞 Call</button>'
        : '';
      const dirBtn  = '<button onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination=' + place.lat + ',' + place.lng + '\',\'_blank\')" style="flex:1;padding:8px;background:#EEF2FF;color:#0A2F6E;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🗺️ Directions</button>';

      const popup = '<div style="font-family:sans-serif;min-width:180px;">' +
        '<div style="font-weight:700;font-size:14px;color:#0A2F6E;margin-bottom:2px;">' + getLabel(place.tags) + '</div>' +
        '<div style="font-size:13px;color:#333;margin-bottom:4px;">' + place.name + '</div>' +
        '<div style="font-size:12px;color:#5A6A8A;margin-bottom:10px;">📍 ' + dist + '</div>' +
        '<div style="display:flex;gap:8px;">' + callBtn + dirBtn + '</div>' +
        '</div>';

      L.marker([place.lat, place.lng], { icon })
        .addTo(map)
        .bindPopup(popup);
    });
  }, [places, filter, location]);

  const filtered = filter === 'all'
    ? places
    : places.filter(p => p.tags && p.tags.amenity === filter);

  return (
    <div style={{position:'fixed',inset:'0',maxWidth:'420px',margin:'0 auto',display:'flex',flexDirection:'column',background:'#F4F8FF'}}>
      <div style={{flex:'1',position:'relative'}}>

        {/* Search bar */}
        <div style={{position:'absolute',top:'16px',left:'16px',right:'16px',zIndex:'1000',display:'flex',flexDirection:'column',gap:'8px'}}>
          <div style={{background:'#fff',borderRadius:'14px',padding:'12px 16px',display:'flex',alignItems:'center',gap:'10px',boxShadow:'0 4px 24px rgba(10,47,110,0.15)'}}>
            <span style={{fontSize:'18px'}}>🔍</span>
            <span style={{flex:'1',fontSize:'14px',color:'#5A6A8A'}}>
              {loading
                ? 'Finding hospitals near you...'
                : filtered.length + ' places found nearby'}
            </span>
            <span style={{fontSize:'18px'}}>📍</span>
          </div>
          <div style={{display:'flex',gap:'8px',overflowX:'auto'}}>
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
          <div style={{position:'absolute',top:'100px',right:'16px',background:'#0A2F6E',color:'#fff',borderRadius:'50px',padding:'6px 14px',fontSize:'12px',fontWeight:'700',zIndex:'1000'}}>
            {'📍 ' + filtered.length + ' nearby'}
          </div>
        )}

        {/* Map container */}
        <div
          ref={mapRef}
          style={{width:'100%',height:'100%'}}
        />

        {/* Loading */}
        {loading && (
          <div style={{position:'absolute',inset:'0',background:'rgba(255,255,255,0.92)',display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',zIndex:'2000',gap:'12px'}}>
            <div style={{fontSize:'48px'}}>🗺️</div>
            <div style={{fontSize:'16px',fontWeight:'700',color:'#0A2F6E'}}>
              Finding hospitals near you...
            </div>
            <div style={{fontSize:'13px',color:'#5A6A8A'}}>
              Getting your GPS location
            </div>
          </div>
        )}

        {/* Error */}
        {error && (
          <div style={{position:'absolute',bottom:'80px',left:'16px',right:'16px',background:'#FFF3CD',borderRadius:'12px',padding:'10px 14px',fontSize:'13px',color:'#856404',zIndex:'1000'}}>
            {'⚠️ ' + error}
          </div>
        )}

      </div>

      <BottomNav active="map" navigate={navigate}/>
    </div>
  );
}
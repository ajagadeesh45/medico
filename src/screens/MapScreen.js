import React, { useState, useEffect, useRef } from 'react';
import BottomNav from '../components/BottomNav';

const getLabel = (tags) => {
  if (tags.amenity === 'hospital') return '🏥 Hospital';
  if (tags.amenity === 'clinic')   return '🏨 Clinic';
  if (tags.amenity === 'pharmacy') return '💊 Pharmacy';
  return '🏥 Medical';
};
const getColor = (tags) => {
  if (tags.amenity === 'hospital') return '#0A2F6E';
  if (tags.amenity === 'clinic')   return '#1565C0';
  if (tags.amenity === 'pharmacy') return '#FF6B35';
  return '#00C896';
};
const getDist = (lat1, lng1, lat2, lng2) => {
  const R = 6371, dLat = (lat2-lat1)*Math.PI/180, dLon = (lng2-lng1)*Math.PI/180;
  const a = Math.sin(dLat/2)**2 + Math.cos(lat1*Math.PI/180)*Math.cos(lat2*Math.PI/180)*Math.sin(dLon/2)**2;
  const d = R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))*1000;
  return d < 1000 ? Math.round(d)+'m away' : (d/1000).toFixed(1)+'km away';
};

const FALLBACK = [
  { id:1,  name:'Apollo Hospital',            lat:13.0604, lng:80.2496, tags:{amenity:'hospital'}, phone:'+914428296000' },
  { id:2,  name:'Fortis Malar Hospital',       lat:13.0061, lng:80.2559, tags:{amenity:'hospital'}, phone:null },
  { id:3,  name:'MIOT International',          lat:13.0067, lng:80.1982, tags:{amenity:'hospital'}, phone:null },
  { id:4,  name:'Kauvery Hospital',            lat:13.0827, lng:80.2707, tags:{amenity:'hospital'}, phone:'+914466114400' },
  { id:5,  name:'Stanley Medical College',     lat:13.1061, lng:80.2906, tags:{amenity:'hospital'}, phone:null },
  { id:6,  name:'Rajiv Gandhi Govt Hospital',  lat:13.0827, lng:80.2760, tags:{amenity:'hospital'}, phone:null },
  { id:7,  name:'Vijaya Hospital',             lat:13.0358, lng:80.2176, tags:{amenity:'hospital'}, phone:null },
  { id:8,  name:'Sri Ramachandra Hospital',    lat:13.0359, lng:80.1617, tags:{amenity:'hospital'}, phone:null },
  { id:9,  name:'Govt Royapettah Hospital',    lat:13.0548, lng:80.2667, tags:{amenity:'hospital'}, phone:null },
  { id:10, name:'Kilpauk Medical College',     lat:13.0832, lng:80.2389, tags:{amenity:'hospital'}, phone:null },
  { id:11, name:'City Clinic Egmore',          lat:13.0789, lng:80.2594, tags:{amenity:'clinic'},   phone:null },
  { id:12, name:'Apollo Pharmacy T Nagar',     lat:13.0418, lng:80.2341, tags:{amenity:'pharmacy'}, phone:null },
  { id:13, name:'MedPlus Pharmacy Anna Nagar', lat:13.0850, lng:80.2101, tags:{amenity:'pharmacy'}, phone:null },
];

export default function MapScreen({ navigate, goBack }) {

  const mapRef     = useRef(null);
  const leafletMap = useRef(null);
  const [location, setLocation] = useState(null);
  const [places, setPlaces]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState('all');
  const [error, setError]       = useState(null);

  const filters = [
    { id:'all',      label:'All'        },
    { id:'hospital', label:'🏥 Hospital' },
    { id:'clinic',   label:'🏨 Clinic'   },
    { id:'pharmacy', label:'💊 Pharmacy' },
  ];

  useEffect(() => {
    if (!navigator.geolocation) { setLocation({ lat:13.0827, lng:80.2707 }); return; }
    navigator.geolocation.getCurrentPosition(
      pos => setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      ()  => { setLocation({ lat:13.0827, lng:80.2707 }); setError('Using Chennai as default location'); }
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    const { lat, lng } = location;
    const q = '[out:json][timeout:25];(node["amenity"="hospital"](around:3000,'+lat+','+lng+');node["amenity"="clinic"](around:3000,'+lat+','+lng+');node["amenity"="pharmacy"](around:3000,'+lat+','+lng+');way["amenity"="hospital"](around:3000,'+lat+','+lng+'););out center max 30;';
    const apis = ['https://overpass.kumi.systems/api/interpreter','https://overpass-api.de/api/interpreter'];
    const tryFetch = async () => {
      for (let api of apis) {
        try {
          const res  = await fetch(api + '?data=' + encodeURIComponent(q));
          const data = await res.json();
          if (data.elements?.length > 0) {
            setPlaces(data.elements.filter(el => el.tags?.name).map(el => ({
              id: el.id, name: el.tags.name,
              lat: el.lat||(el.center?.lat), lng: el.lon||(el.center?.lon),
              tags: el.tags, phone: el.tags.phone||null,
            })).filter(el => el.lat && el.lng));
            setLoading(false); return;
          }
        } catch(e) {}
      }
      setPlaces(FALLBACK); setLoading(false);
      setError('Showing demo hospitals (network offline)');
    };
    tryFetch();
  }, [location]);

  useEffect(() => {
    if (!location || !mapRef.current) return;
    if (!document.getElementById('leaflet-css')) {
      const l = document.createElement('link');
      l.id='leaflet-css'; l.rel='stylesheet';
      l.href='https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(l);
    }
    const init = () => {
      if (leafletMap.current) { leafletMap.current.remove(); leafletMap.current=null; }
      const L = window.L;
      const map = L.map(mapRef.current,{zoomControl:false}).setView([location.lat,location.lng],15);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'© OpenStreetMap'}).addTo(map);
      L.circle([location.lat,location.lng],{radius:80,color:'#0A2F6E',fillColor:'#0A2F6E',fillOpacity:0.5}).addTo(map);
      leafletMap.current = map;
    };
    if (window.L) init();
    else { const s=document.createElement('script'); s.src='https://unpkg.com/leaflet@1.9.4/dist/leaflet.js'; s.onload=init; document.head.appendChild(s); }
    return () => { if(leafletMap.current){leafletMap.current.remove();leafletMap.current=null;} };
  }, [location]);

  useEffect(() => {
    if (!leafletMap.current || !window.L || places.length===0) return;
    const L=window.L, map=leafletMap.current;
    const filtered = filter==='all' ? places : places.filter(p=>p.tags?.amenity===filter);
    map.eachLayer(l => { if(l instanceof L.Marker) map.removeLayer(l); });
    filtered.forEach(place => {
      const color=getColor(place.tags);
      const icon=L.divIcon({html:'<div style="width:32px;height:32px;background:'+color+';border-radius:50% 50% 50% 0;transform:rotate(-45deg);border:3px solid #fff;box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>',iconSize:[32,32],iconAnchor:[16,32],className:''});
      const dist = location ? getDist(location.lat,location.lng,place.lat,place.lng) : '';
      const callBtn = place.phone ? '<button onclick="window.location.href=\'tel:'+place.phone+'\'" style="flex:1;padding:8px;background:#00C896;color:#fff;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">📞 Call</button>' : '';
      const dirBtn = '<button onclick="window.open(\'https://www.google.com/maps/dir/?api=1&destination='+place.lat+','+place.lng+'\',\'_blank\')" style="flex:1;padding:8px;background:#EEF2FF;color:#0A2F6E;border:none;border-radius:8px;font-size:12px;font-weight:700;cursor:pointer;">🗺️ Directions</button>';
      const popup='<div style="font-family:sans-serif;min-width:190px;"><div style="font-weight:700;font-size:13px;color:#0A2F6E;margin-bottom:2px;">'+getLabel(place.tags)+'</div><div style="font-size:13px;color:#333;margin-bottom:4px;">'+place.name+'</div><div style="font-size:12px;color:#5A6A8A;margin-bottom:10px;">📍 '+dist+'</div><div style="display:flex;gap:8px;">'+callBtn+dirBtn+'</div></div>';
      L.marker([place.lat,place.lng],{icon}).addTo(map).bindPopup(popup);
    });
  }, [places, filter, location]);

  const filteredCount = filter==='all' ? places.length : places.filter(p=>p.tags?.amenity===filter).length;

  return (
    <div style={{ position:'fixed', inset:'0', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', background:'#F4F8FF' }}>

      {/* Header with back button */}
      <div style={{ background:'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding:'16px', flexShrink:'0', display:'flex', alignItems:'center', gap:'10px' }}>
        <button onClick={goBack} style={{ width:'38px', height:'38px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:'0' }}>←</button>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:'800', color:'#fff' }}>🗺️ Hospital Map</div>
      </div>

      {/* Filter chips */}
      <div style={{ display:'flex', gap:'8px', padding:'10px 16px', overflowX:'auto', background:'#fff', borderBottom:'1px solid #EEF2FF', flexShrink:'0' }}>
        {filters.map(f => (
          <div key={f.id} onClick={() => setFilter(f.id)} style={{ background:filter===f.id?'#0A2F6E':'#EEF2FF', color:filter===f.id?'#fff':'#0A2F6E', borderRadius:'50px', padding:'7px 14px', fontSize:'12px', fontWeight:'700', whiteSpace:'nowrap', cursor:'pointer', flexShrink:'0' }}>
            {f.label}
          </div>
        ))}
        {!loading && <div style={{ marginLeft:'auto', background:'#0A2F6E', color:'#fff', borderRadius:'50px', padding:'7px 14px', fontSize:'12px', fontWeight:'700', whiteSpace:'nowrap', flexShrink:'0' }}>📍 {filteredCount} nearby</div>}
      </div>

      {/* Map */}
      <div style={{ flex:'1', position:'relative' }}>
        <div ref={mapRef} style={{ width:'100%', height:'100%' }}/>
        {loading && (
          <div style={{ position:'absolute', inset:'0', background:'rgba(255,255,255,0.92)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', zIndex:2000, gap:'12px' }}>
            <div style={{ fontSize:'48px' }}>🗺️</div>
            <div style={{ fontSize:'16px', fontWeight:'700', color:'#0A2F6E' }}>Finding hospitals near you...</div>
          </div>
        )}
        {error && (
          <div style={{ position:'absolute', bottom:'10px', left:'16px', right:'16px', background:'#FFF3CD', borderRadius:'12px', padding:'10px 14px', fontSize:'13px', color:'#856404', zIndex:1000 }}>
            ⚠️ {error}
          </div>
        )}
      </div>

      <BottomNav active="map" navigate={navigate}/>
    </div>
  );
}
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import BottomNav from '../components/BottomNav';

const isOnline = (online_at) => {
  if (!online_at) return false;
  return (Date.now() - new Date(online_at).getTime()) < 2 * 60 * 1000;
};

export default function DoctorListScreen({ navigate, goBack, openDoctor }) {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');
  const [error, setError]     = useState(null);

  const fetchDoctors = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor');

      if (error) {
        console.error('Supabase error:', error);
        setError(error.message);
      } else {
        console.log('Doctors fetched:', data?.length, data);
        setDoctors(data || []);
      }
    } catch (e) {
      console.error('Fetch error:', e);
      setError(e.message);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (d.full_name  || '').toLowerCase().includes(q) ||
      (d.specialty  || '').toLowerCase().includes(q) ||
      (d.city       || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || d.specialty === filter;
    return matchSearch && matchFilter;
  });

  const onlineCount = doctors.filter(d => isOnline(d.online_at)).length;

  const getAvatar = (name) => {
    const list = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'];
    return list[(name || 'A').charCodeAt(0) % list.length];
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)',
        padding: '20px 16px 16px', flexShrink: '0',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
          <button onClick={goBack} style={{
            width: '38px', height: '38px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: '#fff', fontSize: '18px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: '0',
          }}>←</button>
          <div style={{ flex: '1' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: '#fff' }}>
              👨‍⚕️ Find Doctors
            </div>
            {onlineCount > 0 && (
              <div style={{ fontSize: '12px', color: '#00C896', fontWeight: '600', marginTop: '1px' }}>
                🟢 {onlineCount} online now
              </div>
            )}
          </div>
          {/* Refresh button */}
          <button onClick={fetchDoctors} style={{
            width: '36px', height: '36px', borderRadius: '50%',
            background: 'rgba(255,255,255,0.15)', border: 'none',
            color: '#fff', fontSize: '16px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>🔄</button>
        </div>

        {/* Search */}
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
          padding: '10px 14px', gap: '8px',
          border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>🔍</span>
          <input
            style={{ flex: '1', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', color: '#fff' }}
            placeholder="Search name, specialty, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && (
            <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setSearch('')}>✕</span>
          )}
        </div>
      </div>

      {/* Specialty chips */}
      {specialties.length > 1 && (
        <div style={{
          display: 'flex', gap: '8px', padding: '10px 16px',
          overflowX: 'auto', background: '#fff',
          borderBottom: '1px solid #EEF2FF', flexShrink: '0',
        }}>
          {specialties.map(s => (
            <div key={s} onClick={() => setFilter(s)} style={{
              background:   filter === s ? '#0A2F6E' : '#EEF2FF',
              color:        filter === s ? '#fff'    : '#0A2F6E',
              borderRadius: '50px', padding: '6px 14px',
              fontSize: '12px', fontWeight: '700',
              whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: '0',
            }}>
              {s === 'all' ? 'All Doctors' : s}
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: '1', overflowY: 'auto', padding: '12px 16px' }}>

        {/* Error */}
        {error && (
          <div style={{ background: '#FFF0F0', borderRadius: '12px', padding: '12px 16px', marginBottom: '12px', fontSize: '13px', color: '#FF4757' }}>
            ❌ {error} — <span onClick={fetchDoctors} style={{ fontWeight: '700', cursor: 'pointer', textDecoration: 'underline' }}>Retry</span>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px' }}>⏳</div>
            <div style={{ fontSize: '14px', color: '#9BA8C9', marginTop: '12px', fontWeight: '600' }}>
              Finding doctors...
            </div>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && doctors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '48px 24px' }}>
            <div style={{ fontSize: '64px', marginBottom: '14px' }}>🩺</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: '#0A2F6E', marginBottom: '8px' }}>
              Doctors Joining Soon!
            </div>
            <div style={{ fontSize: '14px', color: '#9BA8C9', lineHeight: '1.7', marginBottom: '20px' }}>
              Verified doctors are setting up their profiles.
            </div>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginBottom: '20px' }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: '10px', height: '10px', borderRadius: '50%', background: '#0A2F6E',
                  animation: 'bounce 1.2s ease-in-out infinite',
                  animationDelay: i * 0.2 + 's',
                }}/>
              ))}
            </div>
            <div style={{ background: '#EEF2FF', borderRadius: '14px', padding: '16px', fontSize: '13px', color: '#5A6A8A', lineHeight: '1.7' }}>
              💡 Are you a doctor?<br/>
              <strong style={{ color: '#0A2F6E' }}>Sign up with the Doctor role</strong> to appear here.
            </div>
            <style>{`@keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}`}</style>
          </div>
        )}

        {/* No search results */}
        {!loading && doctors.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2F6E', marginTop: '12px' }}>No doctors found</div>
            <div style={{ fontSize: '13px', color: '#9BA8C9', marginTop: '6px' }}>Try different search terms</div>
          </div>
        )}

        {/* Doctor cards */}
        {!loading && filtered.map(doc => {
          const online = isOnline(doc.online_at);
          return (
            <div
              key={doc.id}
              onClick={() => openDoctor && openDoctor(doc)}
              style={{
                background: '#fff', borderRadius: '16px', padding: '16px',
                marginBottom: '12px',
                boxShadow: online
                  ? '0 4px 16px rgba(0,200,150,0.15)'
                  : '0 2px 12px rgba(10,47,110,0.08)',
                cursor: 'pointer', display: 'flex', gap: '12px', alignItems: 'flex-start',
                border: online ? '1.5px solid #00C896' : '1.5px solid #EEF2FF',
              }}
            >
              {/* Avatar + dot */}
              <div style={{ position: 'relative', flexShrink: '0' }}>
                <div style={{
                  width: '56px', height: '56px', borderRadius: '16px', background: '#EEF2FF',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px',
                }}>
                  {getAvatar(doc.full_name)}
                </div>
                <div style={{
                  position: 'absolute', bottom: '2px', right: '2px',
                  width: '14px', height: '14px', borderRadius: '50%',
                  background: online ? '#00C896' : '#CBD5E1',
                  border: '2.5px solid #fff',
                  boxShadow: online ? '0 0 6px rgba(0,200,150,0.6)' : 'none',
                }}/>
              </div>

              <div style={{ flex: '1', minWidth: '0' }}>
                {/* Name + status */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '3px' }}>
                  <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#0D1B3E' }}>
                    Dr. {doc.full_name}
                  </div>
                  <div style={{
                    background: online ? '#E8FFF7' : '#F1F5F9',
                    color:      online ? '#00A878' : '#94A3B8',
                    borderRadius: '50px', padding: '2px 8px',
                    fontSize: '10px', fontWeight: '700', flexShrink: '0',
                  }}>
                    {online ? '🟢 Online' : '⚫ Offline'}
                  </div>
                </div>

                <div style={{ fontSize: '13px', color: '#5A6A8A', marginBottom: '3px' }}>
                  {doc.specialty || 'General Physician'}
                </div>

                {(doc.city || doc.experience) && (
                  <div style={{ fontSize: '12px', color: '#9BA8C9', marginBottom: '8px' }}>
                    {doc.city ? '📍 ' + doc.city : ''}
                    {doc.city && doc.experience ? '  •  ' : ''}
                    {doc.experience ? doc.experience + ' yrs exp' : ''}
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center' }}>
                  {doc.consultation_fee
                    ? <div style={{ fontSize: '13px', fontWeight: '700', color: '#00A878' }}>₹{doc.consultation_fee} / consult</div>
                    : <div style={{ fontSize: '12px', color: '#9BA8C9' }}>Setting up profile...</div>
                  }
                  <div style={{
                    marginLeft: 'auto', padding: '7px 14px',
                    background: online ? '#0A2F6E' : '#E2E8F0',
                    color:      online ? '#fff'    : '#94A3B8',
                    borderRadius: '10px', fontSize: '12px', fontWeight: '700',
                  }}>
                    {online ? '💬 Consult' : '📅 Book'}
                  </div>
                </div>
              </div>
            </div>
          );
        })}

        {!loading && filtered.length > 0 && (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#9BA8C9', padding: '8px 0 16px' }}>
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} registered
            {onlineCount > 0 ? ` · ${onlineCount} online` : ''}
          </div>
        )}
      </div>

      <BottomNav active="doctors" navigate={navigate} />
    </div>
  );
}
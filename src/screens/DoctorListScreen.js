import React, { useState, useEffect } from 'react';
import { supabase } from '../supabase';
import BottomNav from '../components/BottomNav';

export default function DoctorListScreen({ navigate, openDoctor }) {

  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch]   = useState('');
  const [filter, setFilter]   = useState('all');

  useEffect(() => {
    const fetchDoctors = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('role', 'doctor')
        .order('created_at', { ascending: false });
      if (!error && data) setDoctors(data);
      setLoading(false);
    };

    fetchDoctors();

    // Real-time: new doctor signs up → appears instantly
    const channel = supabase
      .channel('doctors-realtime')
      .on('postgres_changes', {
        event:  '*',
        schema: 'public',
        table:  'profiles',
        filter: 'role=eq.doctor',
      }, () => fetchDoctors())
      .subscribe();

    return () => supabase.removeChannel(channel);
  }, []);

  const specialties = ['all', ...new Set(doctors.map(d => d.specialty).filter(Boolean))];

  const filtered = doctors.filter(d => {
    const q = search.toLowerCase();
    const matchSearch = !search ||
      (d.full_name || '').toLowerCase().includes(q) ||
      (d.specialty || '').toLowerCase().includes(q) ||
      (d.city      || '').toLowerCase().includes(q);
    const matchFilter = filter === 'all' || d.specialty === filter;
    return matchSearch && matchFilter;
  });

  const getAvatar = (name) => {
    const list = ['👨‍⚕️', '👩‍⚕️', '🧑‍⚕️'];
    return list[(name || '').charCodeAt(0) % list.length];
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#F4F8FF',
    }}>

      {/* Header */}
      <div style={{ background: 'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding: '20px 16px 16px', flexShrink: '0' }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: '#fff', marginBottom: '12px' }}>
          👨‍⚕️ Find Doctors
        </div>
        <div style={{
          display: 'flex', alignItems: 'center',
          background: 'rgba(255,255,255,0.12)', borderRadius: '12px',
          padding: '10px 14px', gap: '8px', border: '1px solid rgba(255,255,255,0.2)',
        }}>
          <span>🔍</span>
          <input
            style={{ flex: '1', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', color: '#fff' }}
            placeholder="Search doctors, specialty, city..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          {search && <span style={{ cursor: 'pointer', color: 'rgba(255,255,255,0.6)' }} onClick={() => setSearch('')}>✕</span>}
        </div>
      </div>

      {/* Specialty chips */}
      {specialties.length > 1 && (
        <div style={{
          display: 'flex', gap: '8px', padding: '10px 16px',
          overflowX: 'auto', background: '#fff', borderBottom: '1px solid #EEF2FF', flexShrink: '0',
        }}>
          {specialties.map(s => (
            <div key={s} onClick={() => setFilter(s)} style={{
              background: filter === s ? '#0A2F6E' : '#EEF2FF',
              color: filter === s ? '#fff' : '#0A2F6E',
              borderRadius: '50px', padding: '6px 14px',
              fontSize: '12px', fontWeight: '700', whiteSpace: 'nowrap', cursor: 'pointer', flexShrink: '0',
            }}>
              {s === 'all' ? 'All Doctors' : s}
            </div>
          ))}
        </div>
      )}

      {/* List */}
      <div style={{ flex: '1', overflowY: 'auto', padding: '12px 16px' }}>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '40px' }}>⏳</div>
            <div style={{ fontSize: '14px', color: '#9BA8C9', marginTop: '12px', fontWeight: '600' }}>Loading doctors...</div>
          </div>
        )}

        {!loading && doctors.length === 0 && (
          <div style={{ textAlign: 'center', padding: '60px 24px' }}>
            <div style={{ fontSize: '64px' }}>🏥</div>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#0A2F6E', marginTop: '12px' }}>
              No Doctors Yet
            </div>
            <div style={{ fontSize: '14px', color: '#9BA8C9', lineHeight: '1.6', marginTop: '8px' }}>
              Doctors will appear here once they sign up.
            </div>
            <div style={{ background: '#EEF2FF', borderRadius: '12px', padding: '14px', marginTop: '16px', fontSize: '13px', color: '#5A6A8A', lineHeight: '1.6' }}>
              💡 Are you a doctor? Sign up with the <strong>Doctor</strong> role to appear here.
            </div>
          </div>
        )}

        {!loading && doctors.length > 0 && filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 20px' }}>
            <div style={{ fontSize: '40px' }}>🔍</div>
            <div style={{ fontSize: '15px', fontWeight: '700', color: '#0A2F6E', marginTop: '12px' }}>No doctors found</div>
            <div style={{ fontSize: '13px', color: '#9BA8C9', marginTop: '6px' }}>Try a different search or filter</div>
          </div>
        )}

        {!loading && filtered.map(doc => (
          <div key={doc.id} onClick={() => openDoctor && openDoctor(doc)} style={{
            background: '#fff', borderRadius: '16px', padding: '16px', marginBottom: '12px',
            boxShadow: '0 2px 12px rgba(10,47,110,0.08)', cursor: 'pointer',
            display: 'flex', gap: '12px', alignItems: 'flex-start',
          }}>
            <div style={{
              width: '56px', height: '56px', borderRadius: '16px', background: '#EEF2FF',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: '0',
            }}>
              {getAvatar(doc.full_name)}
            </div>
            <div style={{ flex: '1', minWidth: '0' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap', marginBottom: '2px' }}>
                <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#0D1B3E' }}>
                  Dr. {doc.full_name}
                </div>
                <div style={{ background: '#E8FFF7', color: '#00A878', borderRadius: '50px', padding: '2px 8px', fontSize: '10px', fontWeight: '700', flexShrink: '0' }}>
                  🟢 Online
                </div>
              </div>
              <div style={{ fontSize: '13px', color: '#5A6A8A', marginBottom: '4px' }}>
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
                {doc.consultation_fee && (
                  <div style={{ fontSize: '13px', fontWeight: '700', color: '#00A878' }}>
                    ₹{doc.consultation_fee} / consult
                  </div>
                )}
                <div style={{ marginLeft: 'auto', padding: '7px 14px', background: '#0A2F6E', color: '#fff', borderRadius: '10px', fontSize: '12px', fontWeight: '700' }}>
                  💬 Consult
                </div>
              </div>
            </div>
          </div>
        ))}

        {!loading && filtered.length > 0 && (
          <div style={{ textAlign: 'center', fontSize: '12px', color: '#9BA8C9', padding: '8px 0 16px' }}>
            {filtered.length} doctor{filtered.length !== 1 ? 's' : ''} available
          </div>
        )}
      </div>

      <BottomNav active="doctors" navigate={navigate} />
    </div>
  );
}
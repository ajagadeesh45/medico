import React, { useState } from 'react';
import { LANGUAGES } from '../translations';
import { useLang } from '../LanguageContext';

export default function LanguagePickerModal({ onClose, showToast }) {
  const { lang, switchLang } = useLang();
  const [selected, setSelected] = useState(lang);
  const [search, setSearch]     = useState('');

  const filtered = LANGUAGES.filter(l =>
    l.name.toLowerCase().includes(search.toLowerCase()) ||
    l.native.toLowerCase().includes(search.toLowerCase())
  );

  const handleApply = () => {
    switchLang(selected);
    const langName = LANGUAGES.find(l => l.code === selected)?.native || selected;
    showToast && showToast('🌐 Language changed to ' + langName);
    onClose();
  };

  const selectedLang = LANGUAGES.find(l => l.code === selected);

  return (
    <div style={{
      position: 'fixed', inset: '0', zIndex: 9999,
      background: 'rgba(0,0,0,0.55)', display: 'flex',
      alignItems: 'flex-end', justifyContent: 'center',
    }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: '100%', maxWidth: '420px',
        background: '#fff', borderRadius: '24px 24px 0 0',
        maxHeight: '90vh', display: 'flex', flexDirection: 'column',
        overflow: 'hidden',
      }}>
        {/* Handle */}
        <div style={{ display: 'flex', justifyContent: 'center', padding: '10px 0 0' }}>
          <div style={{ width: '40px', height: '4px', background: '#E2E8F0', borderRadius: '2px' }}/>
        </div>

        {/* Header */}
        <div style={{ padding: '12px 20px 12px', display: 'flex', alignItems: 'center', gap: '10px', borderBottom: '1px solid #EEF2FF' }}>
          <div style={{ flex: '1' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800', color: '#0D1B3E' }}>
              🌐 Language / भाषा
            </div>
            <div style={{ fontSize: '12px', color: '#9BA8C9', marginTop: '2px' }}>
              Select your preferred language
            </div>
          </div>
          <button onClick={onClose} style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#F1F5F9', border: 'none', fontSize: '16px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748B' }}>✕</button>
        </div>

        {/* Search */}
        <div style={{ padding: '10px 16px', borderBottom: '1px solid #EEF2FF' }}>
          <div style={{ display: 'flex', alignItems: 'center', background: '#F4F8FF', borderRadius: '10px', padding: '8px 12px', gap: '8px' }}>
            <span style={{ fontSize: '14px' }}>🔍</span>
            <input
              style={{ flex: '1', border: 'none', background: 'transparent', fontSize: '14px', outline: 'none', color: '#0D1B3E' }}
              placeholder="Search language..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && <span onClick={() => setSearch('')} style={{ cursor: 'pointer', color: '#9BA8C9', fontSize: '14px' }}>✕</span>}
          </div>
        </div>

        {/* Language grid */}
        <div style={{ flex: '1', overflowY: 'auto', padding: '12px 16px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {filtered.map(l => (
              <div
                key={l.code}
                onClick={() => setSelected(l.code)}
                style={{
                  borderRadius: '12px', padding: '12px 10px',
                  cursor: 'pointer', textAlign: 'center',
                  background:  selected === l.code ? '#0A2F6E' : '#F4F8FF',
                  border:      selected === l.code ? '2px solid #0A2F6E' : '2px solid #EEF2FF',
                  boxShadow:   selected === l.code ? '0 4px 14px rgba(10,47,110,0.2)' : 'none',
                }}
              >
                <div style={{ fontSize: '20px', marginBottom: '3px' }}>{l.flag}</div>
                <div style={{
                  fontFamily: "'Syne',sans-serif", fontSize: '13px', fontWeight: '800',
                  color: selected === l.code ? '#fff' : '#0D1B3E',
                  marginBottom: '1px',
                }}>{l.native}</div>
                <div style={{
                  fontSize: '10px',
                  color: selected === l.code ? 'rgba(255,255,255,0.7)' : '#9BA8C9',
                }}>{l.name}</div>
                {selected === l.code && (
                  <div style={{ fontSize: '12px', color: '#00C896', marginTop: '3px', fontWeight: '800' }}>✓</div>
                )}
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px', color: '#9BA8C9', fontSize: '14px' }}>
              No language found for "{search}"
            </div>
          )}
        </div>

        {/* Apply button */}
        <div style={{ padding: '12px 16px 24px', borderTop: '1px solid #EEF2FF', background: '#fff' }}>
          {selectedLang && (
            <div style={{ textAlign: 'center', fontSize: '13px', color: '#5A6A8A', marginBottom: '10px', fontWeight: '600' }}>
              Selected: <strong style={{ color: '#0A2F6E' }}>{selectedLang.native} — {selectedLang.name}</strong>
            </div>
          )}
          <button
            onClick={handleApply}
            style={{
              width: '100%', padding: '15px',
              background: '#0A2F6E', border: 'none', borderRadius: '14px',
              fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800',
              color: '#fff', cursor: 'pointer',
            }}
          >
            ✅ Apply Language
          </button>
        </div>
      </div>
    </div>
  );
}
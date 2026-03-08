import React, { useState } from 'react';
import { LANGUAGES } from '../translations';
import { useLang } from '../LanguageContext';

export default function LanguageSelectScreen({ onDone }) {
  const { lang, switchLang } = useLang();
  const [selected, setSelected] = useState(lang);

  const handleContinue = () => {
    switchLang(selected);
    onDone();
  };

  const selectedLang = LANGUAGES.find(l => l.code === selected);

  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column',
      background: 'linear-gradient(160deg,#0A2F6E 0%,#0D3B8A 100%)',
    }}>

      {/* Header */}
      <div style={{ padding: '48px 24px 20px', textAlign: 'center', flexShrink: '0' }}>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '32px', fontWeight: '800', color: '#fff', marginBottom: '6px' }}>
          <span style={{ color: '#fff' }}>Nadi</span>
          <span style={{ color: '#00C896' }}>Doc</span>
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginBottom: '20px' }}>
          24/7 Doctor Access · भारत · India
        </div>
        <div style={{ fontSize: '18px', fontWeight: '700', color: '#fff', marginBottom: '4px' }}>
          🌐 Choose Your Language
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
          अपनी भाषा चुनें · உங்கள் மொழி தேர்ந்தெடுக்கவும்
        </div>
      </div>

      {/* Language grid */}
      <div style={{ flex: '1', overflowY: 'auto', padding: '0 16px 16px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          {LANGUAGES.map(l => (
            <div
              key={l.code}
              onClick={() => setSelected(l.code)}
              style={{
                borderRadius: '14px', padding: '14px 12px',
                cursor: 'pointer', textAlign: 'center',
                background: selected === l.code
                  ? '#00C896'
                  : 'rgba(255,255,255,0.08)',
                border: selected === l.code
                  ? '2px solid #00C896'
                  : '2px solid rgba(255,255,255,0.12)',
                boxShadow: selected === l.code
                  ? '0 4px 16px rgba(0,200,150,0.35)'
                  : 'none',
                transition: 'all 0.15s ease',
              }}
            >
              <div style={{ fontSize: '22px', marginBottom: '4px' }}>{l.flag}</div>
              <div style={{
                fontFamily: "'Syne',sans-serif",
                fontSize: '14px', fontWeight: '800',
                color: selected === l.code ? '#fff' : '#fff',
                marginBottom: '2px',
              }}>
                {l.native}
              </div>
              <div style={{
                fontSize: '11px',
                color: selected === l.code ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.45)',
              }}>
                {l.name}
              </div>
              {selected === l.code && (
                <div style={{ marginTop: '6px', fontSize: '14px' }}>✓</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Continue button */}
      <div style={{ padding: '12px 16px 28px', background: 'rgba(0,0,0,0.2)', flexShrink: '0' }}>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.5)', textAlign: 'center', marginBottom: '10px' }}>
          Selected: <strong style={{ color: '#00C896' }}>{selectedLang?.native} ({selectedLang?.name})</strong>
        </div>
        <button
          onClick={handleContinue}
          style={{
            width: '100%', padding: '16px',
            background: '#00C896', border: 'none', borderRadius: '14px',
            fontFamily: "'Syne',sans-serif", fontSize: '18px', fontWeight: '800',
            color: '#fff', cursor: 'pointer',
            boxShadow: '0 4px 20px rgba(0,200,150,0.4)',
          }}
        >
          {selectedLang?.native ? `${selectedLang.native} →` : 'Continue →'}
        </button>
        <div style={{ textAlign: 'center', fontSize: '11px', color: 'rgba(255,255,255,0.35)', marginTop: '10px' }}>
          You can change this anytime in Settings
        </div>
      </div>
    </div>
  );
}
import React from 'react';

export default function TopBar({ title, goBack, rightElement, dark }) {

  const bg     = dark ? 'linear-gradient(135deg, #0A2F6E, #0D3B8A)' : '#fff';
  const color  = dark ? '#fff' : '#0A2F6E';
  const shadow = dark ? 'none' : '0 2px 12px rgba(10,47,110,0.08)';
  const border = dark ? 'none' : '1px solid #EEF2FF';

  return (
    <div style={{
      display:         'flex',
      alignItems:      'center',
      padding:         '12px 16px',
      background:      bg,
      boxShadow:       shadow,
      borderBottom:    border,
      flexShrink:      '0',
      minHeight:       '58px',
      position:        'relative',
      zIndex:          '100',
    }}>
      {/* Back button */}
      {goBack && (
        <button
          onClick={goBack}
          style={{
            width:          '38px',
            height:         '38px',
            borderRadius:   '50%',
            border:         'none',
            background:     dark ? 'rgba(255,255,255,0.15)' : '#EEF2FF',
            color:          color,
            fontSize:       '18px',
            cursor:         'pointer',
            display:        'flex',
            alignItems:     'center',
            justifyContent: 'center',
            flexShrink:     '0',
            marginRight:    '10px',
          }}
        >
          ←
        </button>
      )}

      {/* Title */}
      <div style={{
        flex:       '1',
        fontFamily: "'Syne', sans-serif",
        fontSize:   '18px',
        fontWeight: '800',
        color:      color,
        whiteSpace: 'nowrap',
        overflow:   'hidden',
        textOverflow: 'ellipsis',
      }}>
        {title}
      </div>

      {/* Right element (optional) */}
      {rightElement && (
        <div style={{ flexShrink: '0', marginLeft: '10px' }}>
          {rightElement}
        </div>
      )}
    </div>
  );
}
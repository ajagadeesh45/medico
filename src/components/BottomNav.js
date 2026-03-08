import React from 'react';
import { useLang } from '../LanguageContext';

export default function BottomNav({ active, navigate }) {
  const { t } = useLang();

  const tabs = [
    { id: 'home',    icon: '🏠', label: t.home    },
    { id: 'map',     icon: '🗺️', label: t.map     },
    { id: 'chatbot', icon: '🤖', label: t.chatbot  },
    { id: 'doctors', icon: '👨‍⚕️', label: t.doctors },
    { id: 'profile', icon: '👤', label: t.profile  },
  ];

  return (
    <div style={{
      position: 'absolute', bottom: '0', left: '0', right: '0',
      height: '60px', background: '#fff',
      borderTop: '1px solid #EEF2FF',
      display: 'flex', alignItems: 'center',
      boxShadow: '0 -4px 20px rgba(10,47,110,0.06)',
      zIndex: 100,
    }}>
      {tabs.map(tab => (
        <div
          key={tab.id}
          onClick={() => navigate(tab.id)}
          style={{
            flex: '1', display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'center',
            gap: '2px', cursor: 'pointer', padding: '4px 2px',
          }}
        >
          <span style={{ fontSize: '20px', lineHeight: '1' }}>{tab.icon}</span>
          <span style={{
            fontSize: '9px', fontWeight: '700',
            color: active === tab.id ? '#0A2F6E' : '#9BA8C9',
            textTransform: 'uppercase', letterSpacing: '0.3px',
            textAlign: 'center', lineHeight: '1.2',
            maxWidth: '56px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
          }}>{tab.label}</span>
          {active === tab.id && (
            <div style={{ position: 'absolute', bottom: '0', width: '32px', height: '3px', background: '#0A2F6E', borderRadius: '3px 3px 0 0' }}/>
          )}
        </div>
      ))}
    </div>
  );
}
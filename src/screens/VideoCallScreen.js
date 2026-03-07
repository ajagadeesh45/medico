import React, { useEffect, useRef, useState } from 'react';

export default function VideoCallScreen({ goBack, selectedDoctor, user }) {

  const jitsiContainer = useRef(null);
  const jitsiApi       = useRef(null);
  const [status, setStatus]   = useState('connecting'); // connecting | live | ended
  const [muted, setMuted]     = useState(false);
  const [videoOff, setVideoOff] = useState(false);
  const [duration, setDuration] = useState(0);

  const doctorName = (selectedDoctor?.full_name || 'doctor').replace(/^Dr\.?\s*/i, '').trim().toLowerCase().replace(/\s+/g, '-');
  const roomName   = `nadidoc-${doctorName}-${Math.floor(Date.now() / 300000)}`; // same room for 5 min window

  // Timer
  useEffect(() => {
    if (status !== 'live') return;
    const t = setInterval(() => setDuration(d => d + 1), 1000);
    return () => clearInterval(t);
  }, [status]);

  const formatTime = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // Load Jitsi
  useEffect(() => {
    const loadJitsi = () => {
      if (!window.JitsiMeetExternalAPI) {
        const script = document.createElement('script');
        script.src   = 'https://meet.jit.si/external_api.js';
        script.async = true;
        script.onload = initJitsi;
        document.head.appendChild(script);
      } else {
        initJitsi();
      }
    };

    const initJitsi = () => {
      if (!jitsiContainer.current) return;
      if (jitsiApi.current) { jitsiApi.current.dispose(); }

      const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
        roomName,
        parentNode: jitsiContainer.current,
        width:      '100%',
        height:     '100%',
        userInfo: {
          displayName: user?.name || 'Patient',
          email:       user?.email || '',
        },
        configOverwrite: {
          startWithAudioMuted:      false,
          startWithVideoMuted:      false,
          disableDeepLinking:       true,
          enableWelcomePage:        false,
          prejoinPageEnabled:       false,
          disableInviteFunctions:   true,
          toolbarButtons: [
            'microphone', 'camera', 'hangup',
            'chat', 'tileview', 'fullscreen',
          ],
        },
        interfaceConfigOverwrite: {
          SHOW_JITSI_WATERMARK:         false,
          SHOW_WATERMARK_FOR_GUESTS:    false,
          SHOW_BRAND_WATERMARK:         false,
          DEFAULT_BACKGROUND:           '#0A2F6E',
          TOOLBAR_ALWAYS_VISIBLE:       true,
          MOBILE_APP_PROMO:             false,
          HIDE_INVITE_MORE_HEADER:      true,
          DISPLAY_WELCOME_FOOTER:       false,
          SHOW_CHROME_EXTENSION_BANNER: false,
        },
      });

      api.addEventListeners({
        videoConferenceJoined: () => setStatus('live'),
        videoConferenceLeft:   () => setStatus('ended'),
        audioMuteStatusChanged: ({ muted }) => setMuted(muted),
        videoMuteStatusChanged: ({ muted }) => setVideoOff(muted),
      });

      jitsiApi.current = api;
    };

    loadJitsi();

    return () => {
      if (jitsiApi.current) { jitsiApi.current.dispose(); jitsiApi.current = null; }
    };
  }, [roomName, user]);

  const hangUp = () => {
    if (jitsiApi.current) jitsiApi.current.executeCommand('hangup');
    setStatus('ended');
  };

  // ── ENDED SCREEN ──
  if (status === 'ended') {
    return (
      <div style={{
        position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
        background: 'linear-gradient(160deg,#0A2F6E,#0D3B8A)',
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        justifyContent: 'center', padding: '32px', gap: '16px', textAlign: 'center',
      }}>
        <div style={{ fontSize: '72px' }}>✅</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', color: '#fff' }}>
          Call Ended
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)' }}>
          Duration: {formatTime(duration)}
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.6)', lineHeight: '1.6' }}>
          Your consultation with{'\n'}
          <strong style={{ color: '#fff' }}>Dr. {(selectedDoctor?.full_name || '').replace(/^Dr\.?\s*/i, '')}</strong> is complete.
        </div>

        {/* Rate */}
        <div style={{ background: 'rgba(255,255,255,0.1)', borderRadius: '16px', padding: '16px', width: '100%' }}>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.7)', marginBottom: '10px', fontWeight: '600' }}>
            Rate your experience
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
            {['😞','😐','😊','😄','🤩'].map((emoji, i) => (
              <div key={i} style={{ fontSize: '28px', cursor: 'pointer' }}
                onClick={() => {}}
              >{emoji}</div>
            ))}
          </div>
        </div>

        <button
          onClick={goBack}
          style={{
            width: '100%', padding: '16px', background: '#00C896',
            border: 'none', borderRadius: '14px',
            fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800',
            color: '#fff', cursor: 'pointer', marginTop: '8px',
          }}
        >
          ← Back to Home
        </button>
      </div>
    );
  }

  // ── CALL SCREEN ──
  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      display: 'flex', flexDirection: 'column', background: '#000',
    }}>

      {/* Top bar */}
      <div style={{
        position: 'absolute', top: '0', left: '0', right: '0',
        padding: '12px 16px', zIndex: '100',
        background: 'linear-gradient(to bottom,rgba(0,0,0,0.7),transparent)',
        display: 'flex', alignItems: 'center', gap: '10px',
      }}>
        <button onClick={goBack} style={{
          width: '36px', height: '36px', borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)', border: 'none',
          color: '#fff', fontSize: '18px', cursor: 'pointer',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>←</button>

        <div style={{ flex: '1' }}>
          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '15px', fontWeight: '800', color: '#fff' }}>
            Dr. {(selectedDoctor?.full_name || 'Doctor').replace(/^Dr\.?\s*/i, '')}
          </div>
          <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
            {status === 'connecting'
              ? '⏳ Connecting...'
              : <span style={{ color: '#00C896' }}>🔴 Live · {formatTime(duration)}</span>
            }
          </div>
        </div>

        {/* Status indicators */}
        <div style={{ display: 'flex', gap: '6px' }}>
          {muted && (
            <div style={{ background: '#FF4757', borderRadius: '50px', padding: '4px 8px', fontSize: '11px', color: '#fff', fontWeight: '700' }}>
              🔇 Muted
            </div>
          )}
          {videoOff && (
            <div style={{ background: '#FF6B35', borderRadius: '50px', padding: '4px 8px', fontSize: '11px', color: '#fff', fontWeight: '700' }}>
              📵 No Video
            </div>
          )}
        </div>
      </div>

      {/* Connecting overlay */}
      {status === 'connecting' && (
        <div style={{
          position: 'absolute', inset: '0', zIndex: '50',
          background: 'linear-gradient(160deg,#0A2F6E,#0D3B8A)',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center', gap: '16px',
        }}>
          {/* Pulsing avatar */}
          <div style={{ position: 'relative' }}>
            <div style={{
              width: '100px', height: '100px', borderRadius: '50%',
              background: 'rgba(255,255,255,0.1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '48px', animation: 'pulse 1.5s infinite',
            }}>
              👨‍⚕️
            </div>
            <div style={{
              position: 'absolute', inset: '-8px', borderRadius: '50%',
              border: '2px solid rgba(0,200,150,0.4)',
              animation: 'ping 1.5s infinite',
            }}/>
          </div>

          <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '20px', fontWeight: '800', color: '#fff', textAlign: 'center' }}>
            Connecting to{'\n'}Dr. {(selectedDoctor?.full_name || 'Doctor').replace(/^Dr\.?\s*/i, '')}
          </div>
          <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.55)' }}>
            {selectedDoctor?.specialty || 'General Physician'}
          </div>
          <div style={{ display: 'flex', gap: '6px', marginTop: '8px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                width: '8px', height: '8px', borderRadius: '50%', background: '#00C896',
                animation: 'bounce 1.2s ease-in-out infinite',
                animationDelay: i * 0.2 + 's',
              }}/>
            ))}
          </div>
          <style>{`
            @keyframes pulse{0%,100%{transform:scale(1)}50%{transform:scale(1.05)}}
            @keyframes ping{0%{transform:scale(1);opacity:1}100%{transform:scale(1.4);opacity:0}}
            @keyframes bounce{0%,80%,100%{transform:scale(0.6);opacity:0.4}40%{transform:scale(1);opacity:1}}
          `}</style>

          {/* Cancel button */}
          <button onClick={goBack} style={{
            marginTop: '16px', padding: '12px 32px',
            background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)',
            borderRadius: '50px', color: '#fff', fontSize: '14px',
            fontWeight: '700', cursor: 'pointer',
          }}>
            Cancel
          </button>
        </div>
      )}

      {/* Jitsi container */}
      <div ref={jitsiContainer} style={{ flex: '1', width: '100%' }}/>

      {/* Bottom hang up button */}
      {status === 'live' && (
        <div style={{
          position: 'absolute', bottom: '24px', left: '0', right: '0',
          display: 'flex', justifyContent: 'center', zIndex: '100',
        }}>
          <button
            onClick={hangUp}
            style={{
              width: '64px', height: '64px', borderRadius: '50%',
              background: '#FF4757', border: 'none',
              fontSize: '24px', cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(255,71,87,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >
            📵
          </button>
        </div>
      )}
    </div>
  );
}
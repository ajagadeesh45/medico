import React, { useState, useEffect } from 'react';

const TAGLINES = [
  { text: 'Your Doctor. Anywhere. Anytime.',       lang: 'English'    },
  { text: 'உங்கள் மருத்துவர். எங்கும். எப்போதும்.', lang: 'Tamil'      },
  { text: 'आपका डॉक्टर। कहीं भी। कभी भी।',          lang: 'Hindi'      },
  { text: 'మీ డాక్టర్. ఎక్కడైనా. ఎప్పుడైనా.',        lang: 'Telugu'     },
  { text: 'ನಿಮ್ಮ ವೈದ್ಯರು. ಎಲ್ಲಿಯಾದರೂ. ಯಾವಾಗಲೂ.',    lang: 'Kannada'    },
  { text: 'നിങ്ങളുടെ ഡോക്ടർ. എവിടെയും. എപ്പോഴും.',  lang: 'Malayalam'  },
  { text: 'তোমার ডাক্তার। যেকোনো জায়গায়। যেকোনো সময়।', lang: 'Bengali'  },
  { text: 'તમારા ડૉક્ટર. ગમે ત્યાં. ગમે ત્યારે.',    lang: 'Gujarati'   },
  { text: 'ਤੁਹਾਡਾ ਡਾਕਟਰ। ਕਿਤੇ ਵੀ। ਕਦੇ ਵੀ।',          lang: 'Punjabi'    },
  { text: 'তোমার ডাক্তার। যেকোনো সময়।',              lang: 'Odia'       },
  { text: 'आपला डॉक्टर. कुठेही. केव्हाही.',           lang: 'Marathi'    },
  { text: 'మీ వైద్యుడు. ఎప్పుడైనా. ఎక్కడైనా.',        lang: 'Telugu'     },
];

export default function SplashScreen({ navigate }) {

  const [taglineIndex, setTaglineIndex] = useState(0);
  const [fade, setFade]                 = useState(true);

  // Rotate tagline every 1.8 seconds through all Indian languages
  useEffect(() => {
    const interval = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTaglineIndex(i => (i + 1) % TAGLINES.length);
        setFade(true);
      }, 300);
    }, 1800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{
      position:       'fixed',
      inset:          '0',
      maxWidth:       '420px',
      margin:         '0 auto',
      background:     'linear-gradient(160deg, #0A2F6E 0%, #0D3B8A 50%, #0A5C4A 100%)',
      display:        'flex',
      flexDirection:  'column',
      alignItems:     'center',
      justifyContent: 'center',
      padding:        '40px 32px',
      overflow:       'hidden',
    }}>

      {/* Background circles */}
      <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '280px', height: '280px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }}/>
      <div style={{ position: 'absolute', bottom: '-60px', left: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(0,200,150,0.08)' }}/>

      {/* App icon */}
      <div style={{
        width:          '100px',
        height:         '100px',
        borderRadius:   '28px',
        background:     'rgba(255,255,255,0.12)',
        display:        'flex',
        alignItems:     'center',
        justifyContent: 'center',
        fontSize:       '52px',
        marginBottom:   '28px',
        border:         '1.5px solid rgba(255,255,255,0.2)',
        boxShadow:      '0 8px 32px rgba(0,0,0,0.2)',
      }}>
        🩺
      </div>

      {/* App name — NadiDoc */}
      <div style={{
        fontFamily:  "'Syne', sans-serif",
        fontSize:    '48px',
        fontWeight:  '900',
        color:       '#fff',
        marginBottom: '4px',
        letterSpacing: '-1px',
      }}>
        Nadi<span style={{ color: '#00C896' }}>Doc</span>
      </div>

      {/* Language label */}
      <div style={{
        fontSize:    '11px',
        fontWeight:  '600',
        color:       'rgba(255,255,255,0.35)',
        marginBottom: '6px',
        letterSpacing: '1px',
        textTransform: 'uppercase',
        transition:  'opacity 0.3s',
        opacity:     fade ? 1 : 0,
      }}>
        {TAGLINES[taglineIndex].lang}
      </div>

      {/* Rotating tagline */}
      <div style={{
        fontSize:    '16px',
        fontWeight:  '500',
        color:       'rgba(255,255,255,0.85)',
        textAlign:   'center',
        lineHeight:  '1.5',
        marginBottom: '40px',
        minHeight:   '52px',
        display:     'flex',
        alignItems:  'center',
        justifyContent: 'center',
        transition:  'opacity 0.3s ease',
        opacity:     fade ? 1 : 0,
      }}>
        {TAGLINES[taglineIndex].text}
      </div>

      {/* Language dots indicator */}
      <div style={{ display: 'flex', gap: '5px', marginBottom: '40px' }}>
        {TAGLINES.map((_, i) => (
          <div key={i} style={{
            width:        i === taglineIndex ? '20px' : '6px',
            height:       '6px',
            borderRadius: '3px',
            background:   i === taglineIndex ? '#00C896' : 'rgba(255,255,255,0.25)',
            transition:   'all 0.3s ease',
          }}/>
        ))}
      </div>

      {/* Feature chips */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginBottom: '40px' }}>
        {[
          { icon: '🌐', label: 'Verified Doctors' },
          { icon: '🤖', label: 'AI Symptom Check' },
          { icon: '🗺️', label: 'Hospital Map'     },
          { icon: '🚨', label: 'Emergency SOS'    },
        ].map((f, i) => (
          <div key={i} style={{
            background:   'rgba(255,255,255,0.1)',
            border:       '1px solid rgba(255,255,255,0.15)',
            borderRadius: '50px',
            padding:      '8px 16px',
            fontSize:     '13px',
            fontWeight:   '600',
            color:        'rgba(255,255,255,0.85)',
            display:      'flex',
            alignItems:   'center',
            gap:          '6px',
          }}>
            {f.icon} {f.label}
          </div>
        ))}
      </div>

      {/* Get Started button */}
      <button
        onClick={() => navigate('auth')}
        style={{
          width:        '100%',
          padding:      '18px',
          background:   '#00C896',
          border:       'none',
          borderRadius: '16px',
          fontFamily:   "'Syne', sans-serif",
          fontSize:     '18px',
          fontWeight:   '800',
          color:        '#fff',
          cursor:       'pointer',
          marginBottom: '16px',
          boxShadow:    '0 8px 24px rgba(0,200,150,0.4)',
          letterSpacing: '0.3px',
        }}
      >
        Get Started →
      </button>

      {/* Already have account */}
      <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.55)' }}>
        Already have an account?{' '}
        <span
          onClick={() => navigate('auth')}
          style={{ color: '#00C896', fontWeight: '700', cursor: 'pointer' }}
        >
          Login
        </span>
      </div>

    </div>
  );
}
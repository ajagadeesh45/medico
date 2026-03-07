import React, { useState, useRef, useEffect } from 'react';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

const SYSTEM_PROMPT = `You are Medico AI, a helpful medical assistant for Indian patients.
Rules:
1. Always respond in the same language the user writes in (Tamil or English)
2. Give practical first aid advice for common symptoms
3. Always recommend seeing a real doctor for serious symptoms
4. Keep responses short and clear — max 5 lines
5. If symptoms sound serious (chest pain, difficulty breathing) say CALL 108 immediately
6. Add relevant emojis to make it friendly
7. Never diagnose — only suggest and guide
8. End every response with either "Talk to a Medico Doctor →" or "Call 108 immediately 🚨"`;

export default function ChatbotScreen({ navigate }) {

  const [messages, setMessages] = useState([
    {
      from:    'bot',
      text:    '👋 Hello! I am Medico AI.\n\nTell me your symptoms in English or Tamil and I will help you.\n\nநான் தமிழிலும் பதில் சொல்வேன்! 😊',
      showCTA: false,
    },
  ]);
  const [input, setInput]       = useState('');
  const [lang, setLang]         = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Call Gemini API ──
  const askGemini = async (userText) => {
    try {
      console.log('Gemini key:', GEMINI_KEY ? 'found ✅' : 'missing ❌');

      const url =
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' +
        GEMINI_KEY;

      const body = {
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role:  'user',
            parts: [{ text: userText }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 300,
          temperature:     0.7,
        },
      };

      const res  = await fetch(url, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify(body),
      });

      console.log('Gemini status:', res.status);
      const data = await res.json();
      console.log('Gemini data:', data);

      if (data.candidates && data.candidates[0]) {
        return data.candidates[0].content.parts[0].text;
      }

      if (data.error) {
        console.error('Gemini error:', data.error.message);
        return '⚠️ ' + data.error.message;
      }

      return '⚠️ No response. Please try again.';

    } catch (err) {
      console.error('Gemini fetch error:', err);
      return '⚠️ Could not connect to AI. Check internet.';
    }
  };

  // ── Send message ──
  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;

    setMessages(prev => [...prev, { from:'user', text }]);
    setInput('');
    setIsTyping(true);

    const reply = await askGemini(text);

    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      { from:'bot', text: reply, showCTA: true },
    ]);
  };

  const quickReplies = [
    '🌡️ I have fever',
    '🤕 Headache',
    '❤️ Chest pain',
    '😵 Feeling dizzy',
    '🤧 Cough & cold',
    '🤒 Body pain',
  ];

  const s = {
    screen: {
      position:      'fixed',
      inset:         '0',
      maxWidth:      '420px',
      margin:        '0 auto',
      display:       'flex',
      flexDirection: 'column',
      background:    '#F0F4FF',
    },
    header: {
      background:  'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:     '16px 20px',
      display:     'flex',
      alignItems:  'center',
      gap:         '12px',
      flexShrink:  '0',
    },
    botAva: {
      width:          '44px',
      height:         '44px',
      background:     '#00C896',
      borderRadius:   '50%',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '22px',
      flexShrink:     '0',
    },
    botName: {
      fontSize:   '16px',
      fontWeight: '800',
      color:      '#fff',
    },
    botStatus: {
      fontSize:  '11px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '2px',
    },
    langPills: {
      display:    'flex',
      gap:        '6px',
      marginLeft: 'auto',
    },
    langPill: (active) => ({
      padding:      '5px 10px',
      borderRadius: '50px',
      fontSize:     '11px',
      fontWeight:   '700',
      border:       '1.5px solid rgba(255,255,255,' + (active ? '0.4' : '0.2') + ')',
      color:        active ? '#fff' : 'rgba(255,255,255,0.5)',
      cursor:       'pointer',
      background:   active ? 'rgba(255,255,255,0.15)' : 'transparent',
    }),
    chatBody: {
      flex:      '1',
      overflowY: 'auto',
      padding:   '16px',
    },
    msgBot: {
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-start',
      marginBottom:  '14px',
    },
    msgUser: {
      display:       'flex',
      flexDirection: 'column',
      alignItems:    'flex-end',
      marginBottom:  '14px',
    },
    bubbleBot: {
      maxWidth:     '82%',
      padding:      '12px 16px',
      borderRadius: '4px 18px 18px 18px',
      background:   '#fff',
      color:        '#0D1B3E',
      fontSize:     '14px',
      lineHeight:   '1.6',
      boxShadow:    '0 2px 8px rgba(10,47,110,0.08)',
      whiteSpace:   'pre-line',
    },
    bubbleUser: {
      maxWidth:     '82%',
      padding:      '12px 16px',
      borderRadius: '18px 18px 4px 18px',
      background:   '#0A2F6E',
      color:        '#fff',
      fontSize:     '14px',
      lineHeight:   '1.6',
      whiteSpace:   'pre-line',
    },
    quickReplies: {
      display:   'flex',
      gap:       '8px',
      flexWrap:  'wrap',
      marginTop: '8px',
    },
    qr: {
      padding:      '8px 14px',
      background:   '#fff',
      border:       '1.5px solid #D1D8F0',
      borderRadius: '50px',
      fontSize:     '13px',
      fontWeight:   '600',
      color:        '#0A2F6E',
      cursor:       'pointer',
    },
    typingWrap: {
      display:      'flex',
      gap:          '5px',
      padding:      '12px 16px',
      background:   '#fff',
      borderRadius: '4px 18px 18px 18px',
      width:        'fit-content',
      boxShadow:    '0 2px 8px rgba(10,47,110,0.08)',
      marginBottom: '14px',
    },
    typingDot: {
      width:        '7px',
      height:       '7px',
      background:   '#9BA8C9',
      borderRadius: '50%',
    },
    cta: {
      margin:       '4px 0 12px',
      background:   'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      borderRadius: '16px',
      padding:      '14px 16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      cursor:       'pointer',
      border:       'none',
      width:        '100%',
      textAlign:    'left',
    },
    ctaText: {
      fontSize:   '14px',
      fontWeight: '700',
      color:      '#fff',
      flex:       '1',
    },
    ctaSub: {
      fontSize:  '11px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '2px',
    },
    disclaimer: {
      textAlign:  'center',
      fontSize:   '11px',
      color:      '#9BA8C9',
      padding:    '6px 16px 0',
      flexShrink: '0',
      background: '#fff',
    },
    inputRow: {
      padding:    '12px 16px',
      background: '#fff',
      borderTop:  '1px solid #EEF2FF',
      display:    'flex',
      gap:        '10px',
      alignItems: 'center',
      flexShrink: '0',
    },
    input: {
      flex:         '1',
      padding:      '12px 16px',
      background:   '#EEF2FF',
      border:       'none',
      borderRadius: '50px',
      fontSize:     '14px',
      outline:      'none',
      color:        '#0D1B3E',
    },
    sendBtn: {
      width:          '44px',
      height:         '44px',
      background:     isTyping ? '#9BA8C9' : '#0A2F6E',
      borderRadius:   '50%',
      border:         'none',
      fontSize:       '18px',
      cursor:         isTyping ? 'not-allowed' : 'pointer',
      flexShrink:     '0',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    },
  };

  return (
    <div style={s.screen}>

      {/* Header */}
      <div style={s.header}>
        <div style={s.botAva}>🤖</div>
        <div>
          <div style={s.botName}>Medico AI</div>
          <div style={s.botStatus}>🟢 Powered by Gemini • Always Online</div>
        </div>
        <div style={s.langPills}>
          {[
            { code:'en', label:'EN'     },
            { code:'ta', label:'தமிழ்' },
          ].map(l => (
            <button
              key={l.code}
              style={s.langPill(lang === l.code)}
              onClick={() => setLang(l.code)}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat body */}
      <div style={s.chatBody}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={msg.from === 'bot' ? s.msgBot : s.msgUser}>
              <div style={msg.from === 'bot' ? s.bubbleBot : s.bubbleUser}>
                {msg.text}
              </div>
            </div>

            {/* Quick replies — first message only */}
            {msg.from === 'bot' && i === 0 && (
              <div style={s.quickReplies}>
                {quickReplies.map((qr, j) => (
                  <button
                    key={j}
                    style={s.qr}
                    onClick={() => sendMessage(qr)}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Talk to doctor CTA */}
            {msg.from === 'bot' && msg.showCTA && (
              <button
                style={s.cta}
                onClick={() => navigate('doctors')}
              >
                <div>
                  <div style={s.ctaText}>👨‍⚕️ Talk to a Real Doctor</div>
                  <div style={s.ctaSub}>Verified doctors available now</div>
                </div>
                <span style={{ fontSize:'20px', color:'rgba(255,255,255,0.6)' }}>›</span>
              </button>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={s.typingWrap}>
            {[0,1,2].map(i => (
              <div
                key={i}
                style={{
                  ...s.typingDot,
                  animationDelay: i * 0.15 + 's',
                }}
              />
            ))}
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Disclaimer */}
      <div style={s.disclaimer}>
        ⚕️ AI advice is not a substitute for professional medical care
      </div>

      {/* Input */}
      <div style={s.inputRow}>
        <input
          style={s.input}
          placeholder={
            lang === 'ta'
              ? 'உங்கள் அறிகுறிகளை தட்டச்சு செய்யுங்கள்...'
              : 'Type your symptoms...'
          }
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
        />
        <button
          style={s.sendBtn}
          onClick={() => sendMessage(input)}
          disabled={isTyping}
        >
          📤
        </button>
      </div>

    </div>
  );
}
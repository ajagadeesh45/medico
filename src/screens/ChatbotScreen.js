import React, { useState, useRef, useEffect } from 'react';

export default function ChatbotScreen({ navigate, showToast }) {

  const [messages, setMessages]   = useState([
    {
      from: 'bot',
      text: '👋 Hello! I am your Medico AI assistant.\n\nTell me your symptoms and I will help suggest what to do.\n\nRemember: I am not a replacement for a real doctor!',
    },
  ]);
  const [input, setInput]         = useState('');
  const [lang, setLang]           = useState('en');
  const [isTyping, setIsTyping]   = useState(false);
  const bottomRef                 = useRef(null);

  // Auto scroll to bottom when new message arrives
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Bot replies based on symptoms ──
  const botReplies = {
    fever: {
      en: '🌡️ I see you have fever.\n\n• Drink plenty of water\n• Take Paracetamol 500mg if temp above 100°F\n• Rest well\n\n⚠️ If fever is above 103°F or lasts more than 3 days please see a doctor immediately.',
      ta: '🌡️ உங்களுக்கு காய்ச்சல் இருக்கிறது.\n\n• தண்ணீர் அதிகமாக குடிக்கவும்\n• Paracetamol எடுக்கவும்\n\n⚠️ 3 நாட்களுக்கு மேல் இருந்தால் மருத்துவரை சந்தியுங்கள்.',
    },
    headache: {
      en: '🤕 Headaches can have many causes.\n\n• Drink water — dehydration is common cause\n• Rest in a dark quiet room\n• Try Paracetamol for mild pain\n\n⚠️ If severe or sudden please consult a doctor immediately.',
      ta: '🤕 தலைவலிக்கு பல காரணங்கள் இருக்கலாம்.\n\n• தண்ணீர் குடியுங்கள்\n• ஓய்வெடுங்கள்\n• தீவிரமாக இருந்தால் மருத்துவரை பாருங்கள்.',
    },
    chest: {
      en: '❤️ Chest pain needs immediate attention!\n\n⚠️ Please go to emergency NOW if:\n• Pain is severe or crushing\n• Spreading to arm or jaw\n• You are short of breath\n\nDo NOT ignore chest pain.',
      ta: '❤️ மார்பு வலி உடனடியாக கவனிக்க வேண்டும்!\n\n⚠️ 108 அழைக்கவும் அல்லது உடனே மருத்துவமனை செல்லுங்கள்.',
    },
    dizzy: {
      en: '😵 Dizziness can be caused by:\n\n• Low blood pressure — sit down slowly\n• Dehydration — drink water\n• Low blood sugar — eat something\n\n⚠️ If dizziness is severe or frequent please see a doctor.',
      ta: '😵 தலைசுற்றல் ஏற்பட்டால்:\n\n• மெதுவாக உட்காருங்கள்\n• தண்ணீர் குடியுங்கள்\n• சாப்பிடுங்கள்',
    },
    cough: {
      en: '🤧 For cough and cold:\n\n• Drink warm water with honey\n• Steam inhalation helps\n• Rest well\n• Avoid cold drinks and ice cream\n\n⚠️ If cough lasts more than 2 weeks see a doctor.',
      ta: '🤧 இருமல் மற்றும் சளிக்கு:\n\n• தேனுடன் சூடான தண்ணீர் குடிக்கவும்\n• ஆவி பிடிக்கவும்\n• குளிர்ந்த உணவுகளை தவிர்க்கவும்',
    },
    default: {
      en: '🩺 I understand. Based on what you said I suggest consulting one of our verified doctors for proper diagnosis.\n\nWould you like to talk to a doctor now?',
      ta: '🩺 நான் புரிந்துகொள்கிறேன். சரியான கண்டறிதலுக்கு எங்கள் மருத்துவரை தொடர்பு கொள்ளுங்கள்.',
    },
  };

  // ── Get bot reply based on input ──
  const getBotReply = (text) => {
    const t = text.toLowerCase();
    if (t.includes('fever') || t.includes('காய்ச்சல்'))        return botReplies.fever[lang];
    if (t.includes('head')  || t.includes('தலைவலி'))           return botReplies.headache[lang];
    if (t.includes('chest') || t.includes('மார்பு'))           return botReplies.chest[lang];
    if (t.includes('dizz')  || t.includes('தலைசுற்றல்'))       return botReplies.dizzy[lang];
    if (t.includes('cough') || t.includes('cold') ||
        t.includes('இருமல்'))                                   return botReplies.cough[lang];
    return botReplies.default[lang];
  };

  // ── Send message ──
  const sendMessage = (text) => {
    if (!text.trim()) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Simulate bot typing delay
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [
        ...prev,
        { from: 'bot', text: getBotReply(text), showCTA: true },
      ]);
    }, 1200);
  };

  const styles = {
    screen: {
      position:      'fixed',
      inset:         '0',
      maxWidth:      '420px',
      margin:        '0 auto',
      display:       'flex',
      flexDirection: 'column',
      background:    '#F0F4FF',
    },
    // Header
    header: {
      background: 'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      padding:    '16px 20px',
      display:    'flex',
      alignItems: 'center',
      gap:        '12px',
      flexShrink: '0',
    },
    botAvatar: {
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
      fontFamily: "'Syne', sans-serif",
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
      display:     'flex',
      gap:         '6px',
      marginLeft:  'auto',
    },
    langPill: {
      padding:      '5px 10px',
      borderRadius: '50px',
      fontSize:     '11px',
      fontWeight:   '700',
      border:       '1.5px solid rgba(255,255,255,0.25)',
      color:        'rgba(255,255,255,0.6)',
      cursor:       'pointer',
      background:   'transparent',
    },
    langPillActive: {
      padding:      '5px 10px',
      borderRadius: '50px',
      fontSize:     '11px',
      fontWeight:   '700',
      border:       '1.5px solid rgba(255,255,255,0.4)',
      color:        '#fff',
      cursor:       'pointer',
      background:   'rgba(255,255,255,0.15)',
    },
    // Chat body
    chatBody: {
      flex:                    '1',
      overflowY:               'auto',
      padding:                 '16px',
      WebkitOverflowScrolling: 'touch',
    },
    // Messages
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
      maxWidth:     '80%',
      padding:      '12px 16px',
      borderRadius: '4px 18px 18px 18px',
      background:   '#fff',
      color:        '#0D1B3E',
      fontSize:     '14px',
      lineHeight:   '1.6',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      whiteSpace:   'pre-line',
    },
    bubbleUser: {
      maxWidth:     '80%',
      padding:      '12px 16px',
      borderRadius: '18px 18px 4px 18px',
      background:   '#0A2F6E',
      color:        '#fff',
      fontSize:     '14px',
      lineHeight:   '1.6',
      whiteSpace:   'pre-line',
    },
    // Quick reply buttons
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
    // Typing indicator
    typingWrap: {
      display:      'flex',
      gap:          '5px',
      padding:      '12px 16px',
      background:   '#fff',
      borderRadius: '4px 18px 18px 18px',
      width:        'fit-content',
      boxShadow:    '0 2px 12px rgba(10,47,110,0.08)',
      marginBottom: '14px',
    },
    typingDot: {
      width:        '7px',
      height:       '7px',
      background:   '#9BA8C9',
      borderRadius: '50%',
      animation:    'bounce 0.8s ease-in-out infinite',
    },
    // Talk to doctor CTA
    cta: {
      margin:       '0 0 12px',
      background:   'linear-gradient(135deg, #0A2F6E, #0D3B8A)',
      borderRadius: '16px',
      padding:      '16px',
      display:      'flex',
      alignItems:   'center',
      gap:          '12px',
      cursor:       'pointer',
    },
    ctaText: {
      fontFamily: "'Syne', sans-serif",
      fontSize:   '14px',
      fontWeight: '700',
      color:      '#fff',
      flex:       '1',
    },
    ctaSub: {
      fontSize:  '12px',
      color:     'rgba(255,255,255,0.55)',
      marginTop: '2px',
    },
    // Input row
    inputRow: {
      padding:     '12px 16px',
      background:  '#fff',
      borderTop:   '1px solid #EEF2FF',
      display:     'flex',
      gap:         '10px',
      alignItems:  'center',
      flexShrink:  '0',
    },
    input: {
      flex:         '1',
      padding:      '12px 16px',
      background:   '#EEF2FF',
      border:       'none',
      borderRadius: '50px',
      fontFamily:   "'DM Sans', sans-serif",
      fontSize:     '14px',
      outline:      'none',
      color:        '#0D1B3E',
    },
    sendBtn: {
      width:          '44px',
      height:         '44px',
      background:     '#0A2F6E',
      borderRadius:   '50%',
      border:         'none',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
      fontSize:       '18px',
      cursor:         'pointer',
      flexShrink:     '0',
    },
  };

  const quickReplies = [
    '🌡️ I have fever',
    '🤕 I have headache',
    '❤️ Chest pain',
    '😵 I feel dizzy',
    '🤧 Cough & cold',
  ];

  return (
    <div style={styles.screen}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.botAvatar}>🤖</div>
        <div>
          <div style={styles.botName}>Medico AI</div>
          <div style={styles.botStatus}>
            🟢 Always Online • Symptom Checker
          </div>
        </div>
        <div style={styles.langPills}>
          {[
            { code: 'en', label: 'EN'     },
            { code: 'ta', label: 'தமிழ்' },
          ].map(l => (
            <button
              key={l.code}
              style={lang === l.code ? styles.langPillActive : styles.langPill}
              onClick={() => {
                setLang(l.code);
                showToast(l.code === 'ta'
                  ? '🌐 Tamil selected!'
                  : '🌐 English selected!');
              }}
            >
              {l.label}
            </button>
          ))}
        </div>
      </div>

      {/* Chat messages */}
      <div style={styles.chatBody}>

        {messages.map((msg, i) => (
          <div key={i}>
            <div style={msg.from === 'bot' ? styles.msgBot : styles.msgUser}>
              <div style={
                msg.from === 'bot'
                  ? styles.bubbleBot
                  : styles.bubbleUser
              }>
                {msg.text}
              </div>
            </div>

            {/* Quick replies only on first bot message */}
            {msg.from === 'bot' && i === 0 && (
              <div style={styles.quickReplies}>
                {quickReplies.map((qr, j) => (
                  <button
                    key={j}
                    style={styles.qr}
                    onClick={() => sendMessage(qr)}
                  >
                    {qr}
                  </button>
                ))}
              </div>
            )}

            {/* Talk to doctor CTA after bot reply */}
            {msg.from === 'bot' && msg.showCTA && (
              <div
                style={styles.cta}
                onClick={() => navigate('doctors')}
              >
                <div>
                  <div style={styles.ctaText}>
                    👨‍⚕️ Talk to a Real Doctor
                  </div>
                  <div style={styles.ctaSub}>
                    Verified doctors available now
                  </div>
                </div>
                <span style={{ fontSize: '22px', color: 'rgba(255,255,255,0.6)' }}>
                  ›
                </span>
              </div>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={styles.typingWrap}>
            {[0, 1, 2].map(i => (
              <div
                key={i}
                style={{
                  ...styles.typingDot,
                  animationDelay: `${i * 0.15}s`,
                }}
              />
            ))}
          </div>
        )}

        {/* Auto scroll anchor */}
        <div ref={bottomRef} />
      </div>

      {/* Input row */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
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
          style={styles.sendBtn}
          onClick={() => sendMessage(input)}
        >
          📤
        </button>
      </div>

    </div>
  );
}
import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';

// ── Initialize Gemini ──
const genAI = new GoogleGenerativeAI(
  process.env.REACT_APP_GEMINI_KEY
);

const SYSTEM_PROMPT = `You are Medico AI, a helpful medical assistant for Indian patients. 

Rules:
1. Always respond in the same language the user writes in (Tamil or English)
2. Give practical first aid advice for common symptoms
3. Always recommend seeing a real doctor for serious symptoms
4. Keep responses short and clear — max 5 lines
5. If symptoms sound serious (chest pain, difficulty breathing, stroke) — immediately say CALL 108
6. Add relevant emojis to make it friendly
7. Never diagnose — only suggest and guide
8. End every response with either "Talk to a Medico Doctor →" or "Call 108 immediately 🚨"

You serve rural and urban patients across Tamil Nadu and India.`;

export default function ChatbotScreen({ navigate, showToast }) {

  const [messages, setMessages] = useState([
    {
      from: 'bot',
      text: '👋 Hello! I am Medico AI.\n\nTell me your symptoms in English or Tamil and I will help you.\n\nநான் தமிழிலும் பதில் சொல்வேன்! 😊',
      showCTA: false,
    },
  ]);
  const [input, setInput]       = useState('');
  const [lang, setLang]         = useState('en');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef               = useRef(null);
  const chatRef                 = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  // ── Send to Gemini AI ──
  const askGemini = async (userText) => {
    try {
      const model = genAI.getGenerativeModel({
        model: 'gemini-1.5-flash',
      });

      // Build conversation history
      const history = messages
        .filter(m => m.from === 'user' || (m.from === 'bot' && m.text))
        .slice(-6) // last 6 messages for context
        .map(m => ({
          role:  m.from === 'user' ? 'user' : 'model',
          parts: [{ text: m.text }],
        }));

      const chat = model.startChat({
        history,
        generationConfig: { maxOutputTokens: 300 },
      });

      const fullPrompt = SYSTEM_PROMPT + '\n\nUser says: ' + userText;
      const result = await chat.sendMessage(fullPrompt);
      return result.response.text();

    } catch (err) {
      console.error('Gemini error:', err);
      return '⚠️ AI is busy right now. Please try again or talk to a real doctor.';
    }
  };

  // ── Send message ──
  const sendMessage = async (text) => {
    if (!text.trim()) return;
    if (isTyping) return;

    // Add user message
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);

    // Get AI response
    const reply = await askGemini(text);

    setIsTyping(false);
    setMessages(prev => [
      ...prev,
      { from: 'bot', text: reply, showCTA: true },
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
      display:    'flex',
      gap:        '6px',
      marginLeft: 'auto',
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
      animation:    'bounce 0.8s ease-in-out infinite',
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
      fontFamily: "'Syne', sans-serif",
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
      fontSize:       '18px',
      cursor:         'pointer',
      flexShrink:     '0',
      display:        'flex',
      alignItems:     'center',
      justifyContent: 'center',
    },
    disclaimer: {
      textAlign:  'center',
      fontSize:   '11px',
      color:      '#9BA8C9',
      padding:    '6px 16px 0',
      flexShrink: '0',
      background: '#fff',
    },
  };

  return (
    <div style={styles.screen}>

      {/* Header */}
      <div style={styles.header}>
        <div style={styles.botAva}>🤖</div>
        <div>
          <div style={styles.botName}>Medico AI</div>
          <div style={styles.botStatus}>
            🟢 Powered by Gemini • Always Online
          </div>
        </div>
        <div style={styles.langPills}>
          {[
            { code: 'en', label: 'EN'     },
            { code: 'ta', label: 'தமிழ்' },
          ].map(l => (
            <button
              key={l.code}
              style={lang === l.code
                ? styles.langPillActive
                : styles.langPill}
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

      {/* Chat body */}
      <div style={styles.chatBody} ref={chatRef}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={msg.from === 'bot'
              ? styles.msgBot
              : styles.msgUser}
            >
              <div style={msg.from === 'bot'
                ? styles.bubbleBot
                : styles.bubbleUser}
              >
                {msg.text}
              </div>
            </div>

            {/* Quick replies on first message */}
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

            {/* Talk to doctor CTA */}
            {msg.from === 'bot' && msg.showCTA && (
              <button
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
                <span style={{fontSize:'20px',color:'rgba(255,255,255,0.6)'}}>
                  ›
                </span>
              </button>
            )}
          </div>
        ))}

        {/* Typing indicator */}
        {isTyping && (
          <div style={styles.typingWrap}>
            {[0,1,2].map(i => (
              <div key={i} style={{
                ...styles.typingDot,
                animationDelay: i * 0.15 + 's',
              }}/>
            ))}
          </div>
        )}

        <div ref={bottomRef}/>
      </div>

      {/* Disclaimer */}
      <div style={styles.disclaimer}>
        ⚕️ AI advice is not a substitute for professional medical care
      </div>

      {/* Input */}
      <div style={styles.inputRow}>
        <input
          style={styles.input}
          placeholder={lang === 'ta'
            ? 'உங்கள் அறிகுறிகளை தட்டச்சு செய்யுங்கள்...'
            : 'Type your symptoms...'}
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
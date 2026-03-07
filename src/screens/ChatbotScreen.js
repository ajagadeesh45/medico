import React, { useState, useRef, useEffect } from 'react';
import BottomNav from '../components/BottomNav';

const GEMINI_KEY = process.env.REACT_APP_GEMINI_KEY;

const SYSTEM_PROMPT = `You are NadiDoc AI, a helpful medical assistant for Indian patients.
Rules:
1. Respond in the same language the user writes in (Tamil, Hindi, Telugu, or English)
2. Give practical first aid advice for common symptoms
3. Always recommend seeing a real doctor for serious symptoms
4. Keep responses short — max 5 lines
5. If symptoms sound serious (chest pain, difficulty breathing) — say CALL 108
6. Add relevant emojis
7. Never diagnose — only suggest and guide`;

export default function ChatbotScreen({ navigate, goBack }) {

  const [messages, setMessages] = useState([{
    from: 'bot',
    text: '👋 Hello! I am NadiDoc AI.\n\nTell me your symptoms in English or your language.\n\nநான் தமிழிலும் பதில் சொல்வேன்! 😊',
    showCTA: false,
  }]);
  const [input, setInput]       = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef               = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages, isTyping]);

  const askGemini = async (userText) => {
    try {
      const history = messages.filter(m => m.text).slice(-6).map(m => ({
        role: m.from === 'user' ? 'user' : 'model',
        parts: [{ text: m.text }],
      }));
      const filteredHistory = history[0]?.role === 'model' ? history.slice(1) : history;
      const res = await fetch(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + GEMINI_KEY,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
            contents: [...filteredHistory, { role: 'user', parts: [{ text: userText }] }],
          }),
        }
      );
      const data = await res.json();
      return data.candidates?.[0]?.content?.parts?.[0]?.text || '⚠️ AI is busy. Please try again.';
    } catch(e) {
      return '⚠️ AI is busy right now. Please try again or talk to a real doctor.';
    }
  };

  const sendMessage = async (text) => {
    if (!text.trim() || isTyping) return;
    setMessages(prev => [...prev, { from: 'user', text }]);
    setInput('');
    setIsTyping(true);
    const reply = await askGemini(text);
    setIsTyping(false);
    setMessages(prev => [...prev, { from: 'bot', text: reply, showCTA: true }]);
  };

  const quickReplies = ['🌡️ I have fever','🤕 Headache','❤️ Chest pain','😵 Feeling dizzy','🤧 Cough & cold','🤒 Body pain'];

  return (
    <div style={{ position:'fixed', inset:'0', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', background:'#F0F4FF' }}>

      {/* Header with back button */}
      <div style={{ background:'linear-gradient(135deg,#0A2F6E,#0D3B8A)', padding:'16px', display:'flex', alignItems:'center', gap:'10px', flexShrink:'0' }}>
        <button onClick={goBack} style={{ width:'38px', height:'38px', borderRadius:'50%', background:'rgba(255,255,255,0.15)', border:'none', color:'#fff', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:'0' }}>←</button>
        <div style={{ flex:'1' }}>
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:'800', color:'#fff' }}>🤖 NadiDoc AI</div>
          <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)' }}>Your AI Health Assistant</div>
        </div>
      </div>

      {/* Chat */}
      <div style={{ flex:'1', overflowY:'auto', padding:'16px' }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <div style={{ display:'flex', flexDirection:'column', alignItems: msg.from==='bot'?'flex-start':'flex-end', marginBottom:'12px' }}>
              <div style={{
                maxWidth:'82%', padding:'12px 16px',
                borderRadius: msg.from==='bot'?'4px 18px 18px 18px':'18px 18px 4px 18px',
                background: msg.from==='bot'?'#fff':'#0A2F6E',
                color: msg.from==='bot'?'#0D1B3E':'#fff',
                fontSize:'14px', lineHeight:'1.6',
                boxShadow:'0 2px 8px rgba(10,47,110,0.08)', whiteSpace:'pre-line',
              }}>{msg.text}</div>
            </div>

            {msg.from==='bot' && i===0 && (
              <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
                {quickReplies.map((qr,j) => (
                  <button key={j} onClick={() => sendMessage(qr)} style={{
                    padding:'8px 14px', background:'#fff', border:'1.5px solid #D1D8F0',
                    borderRadius:'50px', fontSize:'13px', fontWeight:'600', color:'#0A2F6E', cursor:'pointer',
                  }}>{qr}</button>
                ))}
              </div>
            )}

            {msg.from==='bot' && msg.showCTA && (
              <button onClick={() => navigate('doctors')} style={{
                width:'100%', marginBottom:'12px', background:'linear-gradient(135deg,#0A2F6E,#0D3B8A)',
                borderRadius:'16px', padding:'14px 16px', display:'flex', alignItems:'center',
                gap:'12px', cursor:'pointer', border:'none', textAlign:'left',
              }}>
                <div style={{ flex:'1' }}>
                  <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'14px', fontWeight:'700', color:'#fff' }}>👨‍⚕️ Talk to a Real Doctor</div>
                  <div style={{ fontSize:'11px', color:'rgba(255,255,255,0.55)', marginTop:'2px' }}>Verified doctors available now</div>
                </div>
                <span style={{ fontSize:'20px', color:'rgba(255,255,255,0.6)' }}>›</span>
              </button>
            )}
          </div>
        ))}

        {isTyping && (
          <div style={{ display:'flex', gap:'5px', padding:'12px 16px', background:'#fff', borderRadius:'4px 18px 18px 18px', width:'fit-content', boxShadow:'0 2px 8px rgba(10,47,110,0.08)', marginBottom:'12px' }}>
            {[0,1,2].map(i => (
              <div key={i} style={{ width:'7px', height:'7px', background:'#9BA8C9', borderRadius:'50%', animation:'bounce 0.8s ease-in-out infinite', animationDelay:i*0.15+'s' }}/>
            ))}
            <style>{`@keyframes bounce{0%,80%,100%{transform:translateY(0)}40%{transform:translateY(-6px)}}`}</style>
          </div>
        )}
        <div ref={bottomRef}/>
      </div>

      <div style={{ textAlign:'center', fontSize:'11px', color:'#9BA8C9', padding:'6px 16px 0', background:'#fff', borderTop:'1px solid #EEF2FF' }}>
        ⚕️ AI advice is not a substitute for professional medical care
      </div>

      <div style={{ padding:'10px 16px 12px', background:'#fff', display:'flex', gap:'10px', alignItems:'center' }}>
        <input
          style={{ flex:'1', padding:'12px 16px', background:'#EEF2FF', border:'none', borderRadius:'50px', fontSize:'14px', outline:'none', color:'#0D1B3E' }}
          placeholder="Type your symptoms..."
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key==='Enter' && sendMessage(input)}
        />
        <button onClick={() => sendMessage(input)} style={{ width:'44px', height:'44px', background:'#0A2F6E', borderRadius:'50%', border:'none', fontSize:'18px', cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:'0' }}>
          📤
        </button>
      </div>

      <BottomNav active="chatbot" navigate={navigate}/>
    </div>
  );
}
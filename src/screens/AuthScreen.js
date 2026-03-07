import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function AuthScreen({ handleLogin, showToast }) {

  const [mode, setMode]         = useState('choose');  // 'choose' | 'patient' | 'doctor'
  const [isLogin, setIsLogin]   = useState(true);
  const [email, setEmail]       = useState('');
  const [password, setPassword] = useState('');
  const [name, setName]         = useState('');
  const [phone, setPhone]       = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading]   = useState(false);

  const isPatient = mode === 'patient';
  const isDoctor  = mode === 'doctor';
  const accentColor = isPatient ? '#0A2F6E' : '#00A878';

  const getStrength = (p) => {
    if (p.length === 0) return 0;
    if (p.length < 6)   return 1;
    if (p.length < 8)   return 2;
    if (/[A-Z]/.test(p) && /[0-9]/.test(p)) return 4;
    return 3;
  };
  const strengthLabel = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const strengthColor = ['', '#FF4757', '#FF6B35', '#FFB800', '#00C896'];
  const strength = getStrength(password);

  const reset = () => {
    setEmail(''); setPassword(''); setName(''); setPhone('');
    setIsLogin(true); setShowPass(false);
  };

  const handleSubmit = async () => {
    if (!email || !password)             { showToast('⚠️ Enter email and password'); return; }
    if (!isLogin && !name.trim())        { showToast('⚠️ Enter your name'); return; }
    if (!isLogin && password.length < 8) { showToast('⚠️ Password must be 8+ characters'); return; }

    setLoading(true);
    try {
      if (isLogin) {
        // ── LOGIN ──
        const { data, error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
        if (error) { showToast('❌ ' + error.message); setLoading(false); return; }

        const { data: profile } = await supabase
          .from('profiles').select('*').eq('id', data.user.id).single();

        // Use role from DB — never trust what user selected on login
        const dbRole = profile?.role || mode;

        // If doctor tries patient login or vice versa — block
        if (dbRole !== mode) {
          showToast('❌ Wrong portal! You are a ' + dbRole + '. Please use the ' + dbRole + ' login.');
          await supabase.auth.signOut();
          setLoading(false);
          return;
        }

        handleLogin({
          id:    data.user.id,
          name:  profile?.full_name || email.split('@')[0],
          email: data.user.email,
          phone: profile?.phone || '',
          role:  dbRole,
        });

      } else {
        // ── SIGN UP ──
        const { data, error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
        });
        if (error) { showToast('❌ ' + error.message); setLoading(false); return; }

        // Save profile with the role from choose screen
        await supabase.from('profiles').upsert({
          id:        data.user.id,
          full_name: name.trim(),
          email:     email.trim(),
          phone:     phone.trim(),
          role:      mode,   // ← locked from choose screen
        });

        handleLogin({
          id:    data.user.id,
          name:  name.trim(),
          email: email.trim(),
          phone: phone.trim(),
          role:  mode,
        });
      }
    } catch (e) {
      showToast('❌ Something went wrong. Try again.');
    }
    setLoading(false);
  };

  const inp = {
    width:        '100%',
    padding:      '14px 16px',
    border:       '2px solid #E8EDF8',
    borderRadius: '12px',
    fontSize:     '15px',
    color:        '#0D1B3E',
    outline:      'none',
    background:   '#F4F8FF',
    boxSizing:    'border-box',
    fontFamily:   "'DM Sans', sans-serif",
  };

  const lbl = {
    display: 'block', fontSize: '11px', fontWeight: '700',
    color: '#5A6A8A', textTransform: 'uppercase',
    letterSpacing: '0.5px', marginBottom: '6px',
  };

  // ════════════════════════════════
  // CHOOSE SCREEN
  // ════════════════════════════════
  if (mode === 'choose') {
    return (
      <div style={{
        position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
        background: 'linear-gradient(160deg,#0A2F6E,#0D3B8A,#0A5C4A)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center', padding: '32px 24px',
      }}>
        {/* Background circles */}
        <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '220px', height: '220px', borderRadius: '50%', background: 'rgba(255,255,255,0.04)' }} />
        <div style={{ position: 'absolute', bottom: '-40px', left: '-40px', width: '180px', height: '180px', borderRadius: '50%', background: 'rgba(0,200,150,0.06)' }} />

        <div style={{ fontSize: '48px', marginBottom: '10px' }}>🩺</div>
        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '34px', fontWeight: '900', color: '#fff', marginBottom: '6px' }}>
          Nadi<span style={{ color: '#00C896' }}>Doc</span>
        </div>
        <div style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', marginBottom: '48px' }}>
          Choose how you want to continue
        </div>

        {/* Patient */}
        <div
          onClick={() => { reset(); setMode('patient'); }}
          style={{
            width: '100%', background: '#fff', borderRadius: '20px',
            padding: '22px', marginBottom: '14px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{
            width: '58px', height: '58px', borderRadius: '16px', background: '#EEF2FF',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: '0',
          }}>🙋</div>
          <div style={{ flex: '1' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '17px', fontWeight: '800', color: '#0A2F6E' }}>
              I'm a Patient
            </div>
            <div style={{ fontSize: '12px', color: '#9BA8C9', marginTop: '3px' }}>
              Find doctors · Book consultations · AI health advice
            </div>
          </div>
          <span style={{ fontSize: '20px', color: '#C5D0E6' }}>›</span>
        </div>

        {/* Doctor */}
        <div
          onClick={() => { reset(); setMode('doctor'); }}
          style={{
            width: '100%', background: '#fff', borderRadius: '20px',
            padding: '22px', cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: '16px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.15)',
          }}
        >
          <div style={{
            width: '58px', height: '58px', borderRadius: '16px', background: '#E8FFF7',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', flexShrink: '0',
          }}>👨‍⚕️</div>
          <div style={{ flex: '1' }}>
            <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '17px', fontWeight: '800', color: '#0A5C4A' }}>
              I'm a Doctor
            </div>
            <div style={{ fontSize: '12px', color: '#9BA8C9', marginTop: '3px' }}>
              Manage patients · Grow your practice · Earn online
            </div>
          </div>
          <span style={{ fontSize: '20px', color: '#C5D0E6' }}>›</span>
        </div>

      </div>
    );
  }

  // ════════════════════════════════
  // LOGIN / SIGNUP FORM
  // ════════════════════════════════
  return (
    <div style={{
      position: 'fixed', inset: '0', maxWidth: '420px', margin: '0 auto',
      background: '#F4F8FF', display: 'flex', flexDirection: 'column', overflowY: 'auto',
    }}>

      {/* Colored header */}
      <div style={{
        background: isPatient
          ? 'linear-gradient(135deg,#0A2F6E,#0D3B8A)'
          : 'linear-gradient(135deg,#0A5C4A,#00A878)',
        padding: '40px 24px 28px', flexShrink: '0',
      }}>
        <button
          onClick={() => setMode('choose')}
          style={{
            background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%',
            width: '38px', height: '38px', color: '#fff', fontSize: '18px',
            cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px',
          }}
        >←</button>

        {/* Role badge */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: '8px',
          background: 'rgba(255,255,255,0.15)', borderRadius: '50px',
          padding: '6px 14px', marginBottom: '12px',
        }}>
          <span style={{ fontSize: '16px' }}>{isPatient ? '🙋' : '👨‍⚕️'}</span>
          <span style={{ fontSize: '12px', fontWeight: '800', color: '#fff', textTransform: 'uppercase', letterSpacing: '1px' }}>
            {isPatient ? 'Patient Portal' : 'Doctor Portal'}
          </span>
        </div>

        <div style={{ fontFamily: "'Syne',sans-serif", fontSize: '22px', fontWeight: '800', color: '#fff' }}>
          {isLogin ? 'Welcome back!' : (isPatient ? 'Join as Patient' : 'Join as Doctor')}
        </div>
        <div style={{ fontSize: '13px', color: 'rgba(255,255,255,0.6)', marginTop: '4px' }}>
          Nadi<span style={{ color: '#00C896', fontWeight: '700' }}>Doc</span>
          {isPatient ? ' — Your health, our priority' : ' — Grow your practice online'}
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: '1', padding: '24px' }}>

        {/* Login / Signup toggle */}
        <div style={{ display: 'flex', background: '#E8EDF8', borderRadius: '12px', padding: '4px', marginBottom: '20px' }}>
          {['Login', 'Sign Up'].map((t, i) => (
            <div
              key={t}
              onClick={() => setIsLogin(i === 0)}
              style={{
                flex: '1', padding: '10px', textAlign: 'center', borderRadius: '10px',
                fontSize: '14px', fontWeight: '700', cursor: 'pointer', transition: 'all 0.2s',
                background: isLogin === (i === 0) ? '#fff' : 'transparent',
                color:      isLogin === (i === 0) ? accentColor : '#9BA8C9',
                boxShadow:  isLogin === (i === 0) ? '0 2px 8px rgba(10,47,110,0.1)' : 'none',
              }}
            >{t}</div>
          ))}
        </div>

        {/* Name */}
        {!isLogin && (
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>{isPatient ? 'Full Name' : 'Doctor Name'}</label>
            <input style={inp} placeholder={isPatient ? 'Your full name' : 'Dr. Your Name'} value={name} onChange={e => setName(e.target.value)} />
          </div>
        )}

        {/* Phone */}
        {!isLogin && (
          <div style={{ marginBottom: '14px' }}>
            <label style={lbl}>Phone Number</label>
            <input style={inp} placeholder="+91 98765 43210" value={phone} onChange={e => setPhone(e.target.value)} type="tel" />
          </div>
        )}

        {/* Email */}
        <div style={{ marginBottom: '14px' }}>
          <label style={lbl}>Email Address</label>
          <input style={inp} placeholder="your@email.com" value={email} onChange={e => setEmail(e.target.value)} type="email" />
        </div>

        {/* Password */}
        <div style={{ marginBottom: '6px' }}>
          <label style={lbl}>Password</label>
          <div style={{ position: 'relative' }}>
            <input
              style={{ ...inp, paddingRight: '46px' }}
              placeholder="Min 8 characters"
              value={password}
              onChange={e => setPassword(e.target.value)}
              type={showPass ? 'text' : 'password'}
            />
            <span
              onClick={() => setShowPass(!showPass)}
              style={{ position: 'absolute', right: '14px', top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: '18px' }}
            >
              {showPass ? '🙈' : '👁️'}
            </span>
          </div>
        </div>

        {/* Strength meter */}
        {!isLogin && password.length > 0 && (
          <div style={{ marginBottom: '14px' }}>
            <div style={{ display: 'flex', gap: '4px', marginTop: '6px' }}>
              {[1,2,3,4].map(i => (
                <div key={i} style={{
                  flex: '1', height: '4px', borderRadius: '2px',
                  background: i <= strength ? strengthColor[strength] : '#E8EDF8',
                  transition: 'background 0.3s',
                }}/>
              ))}
            </div>
            <div style={{ fontSize: '11px', color: strengthColor[strength], fontWeight: '700', marginTop: '4px' }}>
              {strengthLabel[strength]}
            </div>
          </div>
        )}

        {/* Forgot */}
        {isLogin && (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <span style={{ fontSize: '13px', color: accentColor, fontWeight: '700', cursor: 'pointer' }}>
              Forgot Password?
            </span>
          </div>
        )}

        {/* Submit */}
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%', padding: '16px',
            background: loading ? '#9BA8C9' : accentColor,
            color: '#fff', border: 'none', borderRadius: '14px',
            fontFamily: "'Syne',sans-serif", fontSize: '16px', fontWeight: '800',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginTop: isLogin ? '0' : '8px',
            boxShadow: loading ? 'none' : '0 6px 20px rgba(0,0,0,0.2)',
          }}
        >
          {loading
            ? '⏳ Please wait...'
            : isLogin
              ? `Login as ${isPatient ? 'Patient' : 'Doctor'} →`
              : `Create ${isPatient ? 'Patient' : 'Doctor'} Account →`}
        </button>

        {/* Switch */}
        <div style={{ textAlign: 'center', marginTop: '16px', fontSize: '14px', color: '#9BA8C9' }}>
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <span
            onClick={() => setIsLogin(!isLogin)}
            style={{ color: accentColor, fontWeight: '700', cursor: 'pointer' }}
          >
            {isLogin ? 'Sign Up' : 'Login'}
          </span>
        </div>

      </div>
    </div>
  );
}
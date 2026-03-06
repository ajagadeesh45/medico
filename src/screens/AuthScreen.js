import React, { useState } from 'react';
import { supabase } from '../supabase';

export default function AuthScreen({ handleLogin }) {

  const [authMode, setAuthMode]             = useState('login');
  const [role, setRole]                     = useState('patient');
  const [loginEmail, setLoginEmail]         = useState('');
  const [loginPassword, setLoginPassword]   = useState('');
  const [signupName, setSignupName]         = useState('');
  const [signupEmail, setSignupEmail]       = useState('');
  const [signupPhone, setSignupPhone]       = useState('');
  const [signupPassword, setSignupPassword] = useState('');
  const [signupConfirm, setSignupConfirm]   = useState('');
  const [errors, setErrors]                 = useState({});
  const [loading, setLoading]               = useState(false);
  const [showPass, setShowPass]             = useState(false);
  const [successMsg, setSuccessMsg]         = useState('');

  const isValidEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
  const isValidPhone = (p) => /^[6-9]\d{9}$/.test(p.replace(/\s/g, ''));

  // ── REAL LOGIN ──
  const handleLoginSubmit = async () => {
    const newErrors = {};
    if (!loginEmail.trim())             newErrors.loginEmail    = 'Email is required';
    else if (!isValidEmail(loginEmail)) newErrors.loginEmail    = 'Enter valid email';
    if (!loginPassword.trim())          newErrors.loginPassword = 'Password is required';
    else if (loginPassword.length < 8)  newErrors.loginPassword = 'Min 8 characters';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      console.log('Logging in with Supabase...');

      const { data, error } = await supabase.auth.signInWithPassword({
        email:    loginEmail.trim(),
        password: loginPassword,
      });

      console.log('Login data:', data);
      console.log('Login error:', error);

      if (error) {
        setLoading(false);
        setErrors({ loginEmail: '❌ ' + error.message });
        return;
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      console.log('Profile:', profile);

      const userData = {
        id:    data.user.id,
        name:  profile?.full_name || loginEmail.split('@')[0],
        email: data.user.email,
        phone: profile?.phone     || '',
        role:  profile?.role      || role,
      };

      console.log('Calling handleLogin with:', userData);
      setLoading(false);
      handleLogin(userData);

    } catch (err) {
      console.error('Login exception:', err);
      setLoading(false);
      setErrors({ loginEmail: '❌ Something went wrong. Try again.' });
    }
  };

  // ── REAL SIGNUP ──
  const handleSignupSubmit = async () => {
    const newErrors = {};
    if (!signupName.trim())               newErrors.signupName     = 'Full name is required';
    if (!signupEmail.trim())              newErrors.signupEmail    = 'Email is required';
    else if (!isValidEmail(signupEmail))  newErrors.signupEmail    = 'Enter valid email';
    if (!signupPhone.trim())              newErrors.signupPhone    = 'Phone is required';
    else if (!isValidPhone(signupPhone))  newErrors.signupPhone    = 'Enter valid 10 digit number';
    if (!signupPassword.trim())           newErrors.signupPassword = 'Password is required';
    else if (signupPassword.length < 8)   newErrors.signupPassword = 'Min 8 characters';
    if (signupConfirm !== signupPassword) newErrors.signupConfirm  = 'Passwords do not match';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      console.log('Signing up with Supabase...');

      const { data, error } = await supabase.auth.signUp({
        email:    signupEmail.trim(),
        password: signupPassword,
      });

      console.log('Signup data:', data);
      console.log('Signup error:', error);

      if (error) {
        setLoading(false);
        setErrors({ signupEmail: '❌ ' + error.message });
        return;
      }

      const { error: profileError } = await supabase
        .from('profiles')
        .insert({
          id:        data.user.id,
          full_name: signupName.trim(),
          email:     signupEmail.trim(),
          phone:     signupPhone.trim(),
          role:      role,
        });

      console.log('Profile error:', profileError);

      setLoading(false);

      if (profileError) {
        setErrors({ signupEmail: '❌ ' + profileError.message });
        return;
      }

      setSuccessMsg('✅ Account created! You can now login.');
      setAuthMode('login');
      setLoginEmail(signupEmail.trim());

    } catch (err) {
      console.error('Signup exception:', err);
      setLoading(false);
      setErrors({ signupEmail: '❌ Something went wrong. Try again.' });
    }
  };

  const getStrength = (pass) => {
    let s = 0;
    if (pass.length >= 8)          s++;
    if (/[A-Z]/.test(pass))        s++;
    if (/[0-9]/.test(pass))        s++;
    if (/[^A-Za-z0-9]/.test(pass)) s++;
    return s;
  };

  const strength = getStrength(
    authMode === 'login' ? loginPassword : signupPassword
  );

  const st = {
    screen: {
      position:'fixed', inset:'0', maxWidth:'420px',
      margin:'0 auto', background:'#0A2F6E',
      display:'flex', flexDirection:'column', justifyContent:'flex-end',
    },
    hero: {
      position:'absolute', top:'0', left:'0', right:'0', height:'35%',
      display:'flex', flexDirection:'column', alignItems:'center',
      justifyContent:'center', gap:'8px',
    },
    heroIcon:  { fontSize:'48px', animation:'bounce 2s ease-in-out infinite' },
    heroTitle: { fontFamily:"'Syne',sans-serif", fontSize:'28px', fontWeight:'800', color:'#fff' },
    heroSub:   { fontSize:'13px', color:'rgba(255,255,255,0.45)' },
    card: {
      background:'#fff', borderRadius:'32px 32px 0 0',
      padding:'24px 24px 40px', position:'relative',
      zIndex:'2', maxHeight:'75vh', overflowY:'auto',
    },
    tabs: {
      display:'flex', background:'#EEF2FF',
      borderRadius:'12px', padding:'4px', marginBottom:'16px',
    },
    tab: {
      flex:'1', padding:'11px', textAlign:'center',
      borderRadius:'9px', fontFamily:"'Syne',sans-serif",
      fontWeight:'700', fontSize:'14px', cursor:'pointer',
      color:'#5A6A8A', border:'none', background:'transparent',
    },
    tabActive: {
      flex:'1', padding:'11px', textAlign:'center',
      borderRadius:'9px', fontFamily:"'Syne',sans-serif",
      fontWeight:'700', fontSize:'14px', cursor:'pointer',
      color:'#0A2F6E', border:'none', background:'#fff',
      boxShadow:'0 2px 12px rgba(10,47,110,0.08)',
    },
    roleRow:        { display:'flex', gap:'10px', marginBottom:'16px' },
    roleCard:       { flex:'1', border:'2px solid #D1D8F0', borderRadius:'14px', padding:'12px 10px', textAlign:'center', cursor:'pointer', background:'#fff' },
    roleCardActive: { flex:'1', border:'2px solid #0A2F6E', borderRadius:'14px', padding:'12px 10px', textAlign:'center', cursor:'pointer', background:'#EEF2FF' },
    roleIcon:        { fontSize:'22px', marginBottom:'4px', display:'block' },
    roleLabel:       { fontSize:'13px', fontWeight:'700', color:'#5A6A8A' },
    roleLabelActive: { fontSize:'13px', fontWeight:'700', color:'#0A2F6E' },
    formGroup: { marginBottom:'12px' },
    label: {
      display:'block', fontSize:'11px', fontWeight:'700',
      color:'#5A6A8A', textTransform:'uppercase',
      letterSpacing:'0.5px', marginBottom:'5px',
    },
    inputWrap: { position:'relative' },
    input: {
      width:'100%', padding:'12px 16px',
      border:'2px solid #D1D8F0', borderRadius:'12px',
      fontFamily:"'DM Sans',sans-serif", fontSize:'15px',
      color:'#0D1B3E', outline:'none', background:'#fff',
      boxSizing:'border-box',
    },
    inputErr: {
      width:'100%', padding:'12px 16px',
      border:'2px solid #FF4757', borderRadius:'12px',
      fontFamily:"'DM Sans',sans-serif", fontSize:'15px',
      color:'#0D1B3E', outline:'none', background:'#fff',
      boxSizing:'border-box',
    },
    errText:    { fontSize:'12px', color:'#FF4757', marginTop:'4px', fontWeight:'500' },
    successBox: {
      background:'rgba(0,200,150,0.1)', border:'1.5px solid #00C896',
      borderRadius:'12px', padding:'12px 16px', marginBottom:'14px',
      fontSize:'13px', color:'#00A878', fontWeight:'600',
    },
    eyeBtn: {
      position:'absolute', right:'14px', top:'50%',
      transform:'translateY(-50%)', background:'none',
      border:'none', cursor:'pointer', fontSize:'16px', color:'#9BA8C9',
    },
    submitBtn: {
      width:'100%', padding:'15px',
      background: loading ? '#9BA8C9' : '#0A2F6E',
      color:'#fff', border:'none', borderRadius:'14px',
      fontFamily:"'Syne',sans-serif", fontSize:'16px',
      fontWeight:'800', cursor: loading ? 'not-allowed' : 'pointer',
      marginTop:'8px',
    },
    strengthRow: { display:'flex', gap:'4px', marginTop:'6px' },
    strengthBar: (s, i) => ({
      flex:'1', height:'3px', borderRadius:'2px',
      background: i < s ? (
        s <= 1 ? '#FF4757' : s <= 2 ? '#FF6B35' :
        s <= 3 ? '#FFD700' : '#00C896'
      ) : '#EEF2FF',
    }),
    switchText: { textAlign:'center', marginTop:'16px', fontSize:'14px', color:'#5A6A8A' },
    switchLink: { color:'#0A2F6E', fontWeight:'700', cursor:'pointer' },
  };

  return (
    <div style={st.screen}>

      {/* Hero */}
      <div style={st.hero}>
        <div style={st.heroIcon}>🏥</div>
        <div style={st.heroTitle}>Medico</div>
        <div style={st.heroSub}>உங்கள் மருத்துவர். எங்கும்.</div>
      </div>

      {/* Card */}
      <div style={st.card}>

        {/* Tabs */}
        <div style={st.tabs}>
          <button
            style={authMode === 'login' ? st.tabActive : st.tab}
            onClick={() => { setAuthMode('login'); setErrors({}); setSuccessMsg(''); }}
          >Login</button>
          <button
            style={authMode === 'signup' ? st.tabActive : st.tab}
            onClick={() => { setAuthMode('signup'); setErrors({}); setSuccessMsg(''); }}
          >Sign Up</button>
        </div>

        {/* Success message */}
        {successMsg && <div style={st.successBox}>{successMsg}</div>}

        {/* Role selector */}
        <div style={st.roleRow}>
          {[
            { id:'patient', icon:'🙋', label:'Patient' },
            { id:'doctor',  icon:'👨‍⚕️', label:'Doctor'  },
          ].map(r => (
            <div
              key={r.id}
              style={role === r.id ? st.roleCardActive : st.roleCard}
              onClick={() => setRole(r.id)}
            >
              <span style={st.roleIcon}>{r.icon}</span>
              <span style={role === r.id ? st.roleLabelActive : st.roleLabel}>
                {r.label}
              </span>
            </div>
          ))}
        </div>

        {/* ── LOGIN FORM ── */}
        {authMode === 'login' && (
          <>
            <div style={st.formGroup}>
              <label style={st.label}>Email Address</label>
              <input
                style={errors.loginEmail ? st.inputErr : st.input}
                placeholder="your@email.com"
                value={loginEmail}
                onChange={e => {
                  setLoginEmail(e.target.value);
                  setErrors(err => ({...err, loginEmail:''}));
                }}
              />
              {errors.loginEmail && (
                <div style={st.errText}>{errors.loginEmail}</div>
              )}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Password</label>
              <div style={st.inputWrap}>
                <input
                  style={errors.loginPassword ? st.inputErr : st.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={loginPassword}
                  onChange={e => {
                    setLoginPassword(e.target.value);
                    setErrors(err => ({...err, loginPassword:''}));
                  }}
                />
                <button
                  style={st.eyeBtn}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {errors.loginPassword && (
                <div style={st.errText}>{errors.loginPassword}</div>
              )}
            </div>

            <div style={{textAlign:'right', marginBottom:'8px'}}>
              <span style={{fontSize:'13px', color:'#0A2F6E', fontWeight:'600', cursor:'pointer'}}>
                Forgot Password?
              </span>
            </div>
          </>
        )}

        {/* ── SIGNUP FORM ── */}
        {authMode === 'signup' && (
          <>
            <div style={st.formGroup}>
              <label style={st.label}>Full Name</label>
              <input
                style={errors.signupName ? st.inputErr : st.input}
                placeholder="Your full name"
                value={signupName}
                onChange={e => {
                  setSignupName(e.target.value);
                  setErrors(err => ({...err, signupName:''}));
                }}
              />
              {errors.signupName && <div style={st.errText}>{errors.signupName}</div>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Email Address</label>
              <input
                style={errors.signupEmail ? st.inputErr : st.input}
                placeholder="your@email.com"
                value={signupEmail}
                onChange={e => {
                  setSignupEmail(e.target.value);
                  setErrors(err => ({...err, signupEmail:''}));
                }}
              />
              {errors.signupEmail && <div style={st.errText}>{errors.signupEmail}</div>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Phone Number</label>
              <input
                style={errors.signupPhone ? st.inputErr : st.input}
                placeholder="10 digit mobile number"
                value={signupPhone}
                maxLength={10}
                onChange={e => {
                  setSignupPhone(e.target.value.replace(/\D/g,''));
                  setErrors(err => ({...err, signupPhone:''}));
                }}
              />
              {errors.signupPhone && <div style={st.errText}>{errors.signupPhone}</div>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Password</label>
              <div style={st.inputWrap}>
                <input
                  style={errors.signupPassword ? st.inputErr : st.input}
                  type={showPass ? 'text' : 'password'}
                  placeholder="Min 8 characters"
                  value={signupPassword}
                  onChange={e => {
                    setSignupPassword(e.target.value);
                    setErrors(err => ({...err, signupPassword:''}));
                  }}
                />
                <button
                  style={st.eyeBtn}
                  onClick={() => setShowPass(!showPass)}
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              <div style={st.strengthRow}>
                {[0,1,2,3].map(i => (
                  <div key={i} style={st.strengthBar(strength, i)}/>
                ))}
              </div>
              <div style={{fontSize:'11px', color:'#9BA8C9', marginTop:'4px'}}>
                {strength === 0 ? '' : strength === 1 ? '🔴 Weak' :
                 strength === 2 ? '🟠 Fair' : strength === 3 ? '🟡 Good' : '🟢 Strong'}
              </div>
              {errors.signupPassword && <div style={st.errText}>{errors.signupPassword}</div>}
            </div>

            <div style={st.formGroup}>
              <label style={st.label}>Confirm Password</label>
              <input
                style={errors.signupConfirm ? st.inputErr : st.input}
                type="password"
                placeholder="Re-enter password"
                value={signupConfirm}
                onChange={e => {
                  setSignupConfirm(e.target.value);
                  setErrors(err => ({...err, signupConfirm:''}));
                }}
              />
              {errors.signupConfirm && <div style={st.errText}>{errors.signupConfirm}</div>}
            </div>
          </>
        )}

        {/* Submit button */}
        <button
          style={st.submitBtn}
          onClick={authMode === 'login'
            ? handleLoginSubmit
            : handleSignupSubmit}
          disabled={loading}
        >
          {loading ? '⏳ Please wait...' :
           authMode === 'login' ? 'Login →' : 'Create Account →'}
        </button>

        {/* Switch mode */}
        <div style={st.switchText}>
          {authMode === 'login'
            ? "Don't have an account? "
            : 'Already have an account? '}
          <span
            style={st.switchLink}
            onClick={() => {
              setAuthMode(authMode === 'login' ? 'signup' : 'login');
              setErrors({});
              setSuccessMsg('');
            }}
          >
            {authMode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </div>

      </div>
    </div>
  );
}
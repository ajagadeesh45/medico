import React, { useState } from 'react';
import { supabase } from '../supabase';
import TopBar from '../components/TopBar';
import { useLang } from '../LanguageContext';

const TIME_SLOTS = [
  '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM',
  '04:00 PM', '04:30 PM', '05:00 PM', '05:30 PM',
  '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
];

const cleanName = (name) => (name || '').replace(/^Dr\.?\s*/i, '').trim();

const getNext7Days = () => {
  const days = [];
  const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
  const monthNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  for (let i = 1; i <= 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push({
      label:    dayNames[d.getDay()],
      date:     d.getDate(),
      month:    monthNames[d.getMonth()],
      fullDate: d.toISOString().split('T')[0],
      display:  `${d.getDate()} ${monthNames[d.getMonth()]} ${d.getFullYear()}`,
    });
  }
  return days;
};

export default function BookingScreen({ goBack, navigate, selectedDoctor, user, showToast }) {
  const { t } = useLang();
  const [selectedDay, setSelectedDay]   = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [reason, setReason]             = useState('');
  const [booking, setBooking]           = useState(false);
  const [booked, setBooked]             = useState(false);

  const days = getNext7Days();
  const doc  = selectedDoctor;

  const confirmBooking = async () => {
    if (!selectedDay)  { showToast('⚠️ Please select a date'); return; }
    if (!selectedTime) { showToast('⚠️ Please select a time slot'); return; }
    setBooking(true);
    const { error } = await supabase.from('appointments').insert({
      patient_id:   user?.id,
      doctor_id:    doc?.id,
      patient_name: user?.name,
      doctor_name:  doc?.full_name,
      date:         selectedDay.display,
      time_slot:    selectedTime,
      reason:       reason.trim() || 'General Consultation',
      status:       'pending',
    });
    setBooking(false);
    if (error) showToast('❌ Booking failed: ' + error.message);
    else setBooked(true);
  };

  if (booked) {
    return (
      <div style={{ position:'fixed', inset:'0', maxWidth:'420px', margin:'0 auto', background:'linear-gradient(160deg,#0A2F6E,#0D3B8A)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', padding:'32px', gap:'16px', textAlign:'center' }}>
        <div style={{ fontSize:'80px' }}>🎉</div>
        <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'24px', fontWeight:'800', color:'#fff' }}>{t.appointmentBooked}</div>
        <div style={{ background:'rgba(255,255,255,0.12)', borderRadius:'16px', padding:'20px', width:'100%', border:'1px solid rgba(255,255,255,0.2)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'16px' }}>
            <div style={{ width:'48px', height:'48px', borderRadius:'14px', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'24px' }}>👨‍⚕️</div>
            <div style={{ textAlign:'left' }}>
              <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:'800', color:'#fff' }}>Dr. {cleanName(doc?.full_name)}</div>
              <div style={{ fontSize:'12px', color:'rgba(255,255,255,0.6)' }}>{doc?.specialty || 'General Physician'}</div>
            </div>
          </div>
          {[
            { icon:'📅', label: t.selectDate?.replace('📅 ',''),  value: selectedDay?.display },
            { icon:'⏰', label: t.selectTime?.replace('⏰ ',''),  value: selectedTime },
            { icon:'📋', label: t.reason?.replace('📋 ',''),      value: reason || 'General Consultation' },
            { icon:'🔄', label: 'Status',                          value: 'Pending Confirmation' },
          ].map((r,i) => (
            <div key={i} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', padding:'8px 0', borderBottom: i<3?'1px solid rgba(255,255,255,0.1)':'none' }}>
              <span style={{ fontSize:'13px', color:'rgba(255,255,255,0.55)' }}>{r.icon} {r.label}</span>
              <span style={{ fontSize:'13px', fontWeight:'700', color:'#fff' }}>{r.value}</span>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('home')} style={{ width:'100%', padding:'16px', background:'#00C896', border:'none', borderRadius:'14px', fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:'800', color:'#fff', cursor:'pointer' }}>
          {t.backToHome}
        </button>
        <div onClick={() => navigate('records')} style={{ fontSize:'13px', color:'rgba(255,255,255,0.55)', cursor:'pointer', fontWeight:'600' }}>{t.viewRecords}</div>
      </div>
    );
  }

  return (
    <div style={{ position:'fixed', inset:'0', maxWidth:'420px', margin:'0 auto', display:'flex', flexDirection:'column', background:'#F4F8FF' }}>
      <TopBar title={t.bookAppointmentTitle} goBack={goBack} dark />

      <div style={{ flex:'1', overflowY:'auto', paddingBottom:'100px' }}>
        {/* Doctor info */}
        <div style={{ background:'#fff', padding:'16px', display:'flex', gap:'12px', alignItems:'center', borderBottom:'1px solid #EEF2FF' }}>
          <div style={{ width:'52px', height:'52px', borderRadius:'14px', background:'#EEF2FF', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'26px', flexShrink:'0' }}>👨‍⚕️</div>
          <div>
            <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:'800', color:'#0D1B3E' }}>Dr. {cleanName(doc?.full_name)}</div>
            <div style={{ fontSize:'13px', color:'#9BA8C9', marginTop:'2px' }}>{doc?.specialty || 'General Physician'}{doc?.consultation_fee ? ' · ₹'+doc.consultation_fee : ''}</div>
          </div>
        </div>

        <div style={{ padding:'16px' }}>
          {/* Date */}
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:'800', color:'#0D1B3E', marginBottom:'12px' }}>{t.selectDate}</div>
          <div style={{ display:'flex', gap:'8px', overflowX:'auto', paddingBottom:'4px', marginBottom:'20px' }}>
            {days.map((day,i) => (
              <div key={i} onClick={() => setSelectedDay(day)} style={{ flexShrink:'0', width:'60px', borderRadius:'14px', padding:'10px 6px', textAlign:'center', cursor:'pointer', background: selectedDay?.fullDate===day.fullDate?'#0A2F6E':'#fff', color: selectedDay?.fullDate===day.fullDate?'#fff':'#0D1B3E', boxShadow: selectedDay?.fullDate===day.fullDate?'0 4px 14px rgba(10,47,110,0.3)':'0 2px 8px rgba(10,47,110,0.06)', border: selectedDay?.fullDate===day.fullDate?'none':'1.5px solid #EEF2FF' }}>
                <div style={{ fontSize:'11px', fontWeight:'700', opacity:0.7, marginBottom:'4px' }}>{day.label}</div>
                <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'18px', fontWeight:'800' }}>{day.date}</div>
                <div style={{ fontSize:'10px', opacity:0.7, marginTop:'2px' }}>{day.month}</div>
              </div>
            ))}
          </div>

          {/* Time */}
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:'800', color:'#0D1B3E', marginBottom:'12px' }}>{t.selectTime}</div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'8px', marginBottom:'20px' }}>
            {TIME_SLOTS.map((slot,i) => (
              <div key={i} onClick={() => setSelectedTime(slot)} style={{ padding:'10px 6px', borderRadius:'12px', textAlign:'center', fontSize:'12px', fontWeight:'700', cursor:'pointer', background: selectedTime===slot?'#0A2F6E':'#fff', color: selectedTime===slot?'#fff':'#0D1B3E', boxShadow: selectedTime===slot?'0 4px 14px rgba(10,47,110,0.3)':'0 2px 8px rgba(10,47,110,0.06)', border: selectedTime===slot?'none':'1.5px solid #EEF2FF' }}>{slot}</div>
            ))}
          </div>

          {/* Reason */}
          <div style={{ fontFamily:"'Syne',sans-serif", fontSize:'15px', fontWeight:'800', color:'#0D1B3E', marginBottom:'12px' }}>{t.reason}</div>
          <div style={{ display:'flex', gap:'8px', flexWrap:'wrap', marginBottom:'12px' }}>
            {['General Checkup','Fever','Headache','Follow-up','Skin Issue','Other'].map((r,i) => (
              <div key={i} onClick={() => setReason(r)} style={{ padding:'8px 14px', borderRadius:'50px', fontSize:'12px', fontWeight:'700', cursor:'pointer', background: reason===r?'#0A2F6E':'#EEF2FF', color: reason===r?'#fff':'#0A2F6E' }}>{r}</div>
            ))}
          </div>
          <input style={{ width:'100%', padding:'12px 14px', border:'2px solid #E8EDF8', borderRadius:'12px', fontSize:'14px', color:'#0D1B3E', outline:'none', background:'#fff', boxSizing:'border-box' }}
            placeholder="Or type your reason..."
            value={reason} onChange={e => setReason(e.target.value)} />
        </div>
      </div>

      <div style={{ padding:'12px 16px 20px', background:'#fff', borderTop:'1px solid #EEF2FF' }}>
        {selectedDay && selectedTime && (
          <div style={{ background:'#EEF2FF', borderRadius:'12px', padding:'10px 14px', marginBottom:'12px', fontSize:'13px', color:'#0A2F6E', fontWeight:'600' }}>
            📅 {selectedDay.display} &nbsp;·&nbsp; ⏰ {selectedTime}
          </div>
        )}
        <button onClick={confirmBooking} disabled={booking || !selectedDay || !selectedTime} style={{ width:'100%', padding:'16px', background:(!selectedDay||!selectedTime||booking)?'#9BA8C9':'#0A2F6E', color:'#fff', border:'none', borderRadius:'14px', fontFamily:"'Syne',sans-serif", fontSize:'16px', fontWeight:'800', cursor:(!selectedDay||!selectedTime||booking)?'not-allowed':'pointer' }}>
          {booking ? t.booking : t.confirmAppointment}
        </button>
      </div>
    </div>
  );
}
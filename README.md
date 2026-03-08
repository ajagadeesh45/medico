# NadiDoc

# 🎯 Project Vision
NadiDoc is India's first truly multilingual, affordable telemedicine platform built to digitalize healthcare for every Indian — rural or urban — in their own language.
# The Problem We're Solving:

Existing apps like Practo, Apollo 247, mfine work only in metros
Most telemedicine apps are English/Hindi only — leaving out 800M+ regional language speakers
Consultation fees of ₹500–2000 are unaffordable for rural India
Poor internet areas have no reliable doctor access

# Our Solution:

🌍 Works everywhere — rural, tier-2, tier-3 cities
🗣️ 22 Indian languages + English — full UI translation
💸 Affordable — ₹99 flat consultations
📱 Lightweight — works on low-end Android phones


# 🏗️ What We Built
# ✅ Completed Features
FeatureDescription🌐 Splash ScreenNadiDoc branding, rotating Indian language taglines👤 Patient PortalSeparate login, home, doctor search👨‍⚕️ Doctor PortalSeparate login, dashboard, profile setup🔍 Find DoctorsReal doctors from Supabase, search by name/specialty/city🟢 Online StatusGreen dot — doctor online if active in last 2 minutes📹 Video CallsLive Jitsi video consultation — patient calls doctor📅 Book AppointmentDate picker, time slots, saved to Supabase🤖 AI ChatbotGemini 1.5 Flash — symptom checker in any language🗺️ Hospital MapLeaflet.js — nearest hospitals via GPS🚨 Emergency SOSOne-tap 108 call + nearest hospital🌐 22 LanguagesFull UI in Tamil, Telugu, Hindi, Kannada, Malayalam + 17 more🔄 Language Switcher3-dots menu → instant language change across entire app💾 Health RecordsRecords, appointments, vitals tabs👤 Profile + SettingsLanguage tab, settings tab, logout
# 🔜 Pending Features
FeatureStatus💊 Digital PrescriptionsDoctor writes → patient gets PDF💳 ₹99 Payment GatewayRazorpay/UPI integration💬 Real-time ChatPatient ↔ Doctor messaging📲 Convert to APKCapacitor for Android🏪 Medicine DeliveryConnect to local pharmacies

# 🛠️ Tech Stack
LayerTechnologyWhyFrontendReact.js 19Fast, component-based UIDatabaseSupabase (PostgreSQL)Real-time, free tier, auth built-inAuthSupabase AuthEmail/password, role-basedAI ChatbotGoogle Gemini 1.5 Flash APIMultilingual symptom checkerVideo CallsJitsi Meet (meet.jit.si)Free, no account needed, works on mobileMapsLeaflet.js (CDN)Lightweight, no React 19 conflictMap DataOpenStreetMap + Overpass APIFree hospital/clinic/pharmacy dataTranslationsCustom translations.js23 languages, 50+ strings eachHostingVercelFree, auto-deploy from GitHubStateReact Context (LanguageContext)Global language stateStoragelocalStorageRemember language preference



# 📁 Project Structure
src/
├── App.js                        ← Main router + auth
├── supabase.js                   ← Supabase client
├── translations.js               ← All 23 languages
├── LanguageContext.js            ← Global language state
│
├── components/
│   ├── BottomNav.js              ← Translated bottom navigation
│   ├── TopBar.js                 ← Back button header
│   ├── Toast.js                  ← Notification toasts
│   └── LanguagePickerModal.js    ← Language selection bottom sheet
│
└── screens/
    ├── SplashScreen.js           ← NadiDoc intro
    ├── AuthScreen.js             ← Patient/Doctor login & signup
    ├── HomeScreen.js             ← Patient home + 3-dots menu
    ├── DoctorListScreen.js       ← All doctors + online status
    ├── DoctorProfileScreen.js    ← Doctor details + call/book
    ├── VideoCallScreen.js        ← Jitsi live video call
    ├── BookingScreen.js          ← Date + time slot booking
    ├── ChatbotScreen.js          ← Gemini AI symptom checker
    ├── MapScreen.js              ← Hospital map (Leaflet)
    ├── EmergencyScreen.js        ← SOS + 108 call
    ├── RecordsScreen.js          ← Health records
    ├── ProfileScreen.js          ← Profile + Language + Settings
    └── OwnerDashboard.js         ← Doctor dashboard



# 👥 User Roles
# Patient

Sign up → choose "I'm a Patient"
Access: Home, Find Doctors, AI Chat, Map, Emergency, Records, Profile
Can: search doctors, video call, book appointments, use AI chatbot

# Doctor

Sign up → choose "I'm a Doctor"
Access: Doctor Dashboard only
Can: fill profile (specialty, fee, city, bio), go online, join patient video calls
Appears in patient's doctor list once profile is filled


# 🌐 Supported Languages
English, தமிழ் (Tamil), తెలుగు (Telugu), हिंदी (Hindi), ಕನ್ನಡ (Kannada), മലയാളം (Malayalam), বাংলা (Bengali), मराठी (Marathi), ગુજરાતી (Gujarati), ਪੰਜਾਬੀ (Punjabi), ଓଡ଼ିଆ (Odia), অসমীয়া (Assamese), اردو (Urdu), संस्कृतम् (Sanskrit), کٲشُر (Kashmiri), سنڌي (Sindhi), मैथिली (Maithili), नेपाली (Nepali), बड़ो (Bodo), डोगरी (Dogri), মৈতৈলোন্ (Manipuri), ᱥᱟᱱᱛᱟᱲᱤ (Santali)

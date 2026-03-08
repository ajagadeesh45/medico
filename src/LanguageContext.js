import React, { createContext, useContext, useState } from 'react';
import translations from './translations';

const LanguageContext = createContext();

const getSavedLang = () => {
  try { return localStorage.getItem('nadidoc_lang') || 'en'; }
  catch { return 'en'; }
};

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getSavedLang);

  const switchLang = (code) => {
    try { localStorage.setItem('nadidoc_lang', code); } catch {}
    setLang(code);
  };

  const t = translations[lang] || translations['en'];

  return (
    <LanguageContext.Provider value={{ lang, switchLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLang = () => useContext(LanguageContext);
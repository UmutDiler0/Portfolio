import React, { createContext, useContext, useEffect, useState } from 'react';
import { translations } from '../i18n/translations';
import type { TranslationDict } from '../i18n/translations';

type Language = 'en' | 'tr';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDict;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    const savedLang = localStorage.getItem('portfolio-lang') as Language;
    if (savedLang === 'en' || savedLang === 'tr') {
      return savedLang;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('portfolio-lang', language);
    // Optionally update lang attribute of html
    document.documentElement.lang = language;
  }, [language]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

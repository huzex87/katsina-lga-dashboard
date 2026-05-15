'use client';

import { createContext, useContext, useState, type ReactNode } from 'react';

type Lang = 'en' | 'ha';

interface LanguageContextValue {
  lang: Lang;
  toggle: () => void;
  t: (en: string | undefined, ha: string | undefined) => string;
}

const LanguageContext = createContext<LanguageContextValue>({
  lang: 'en',
  toggle: () => {},
  t: (en) => en ?? '',
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>('en');

  const toggle = () => setLang((l) => (l === 'en' ? 'ha' : 'en'));

  // Falls back to English when Hausa translation is missing
  const t = (en: string | undefined, ha: string | undefined): string => {
    if (lang === 'ha' && ha) return ha;
    return en ?? '';
  };

  return (
    <LanguageContext.Provider value={{ lang, toggle, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

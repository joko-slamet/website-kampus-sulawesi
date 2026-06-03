'use client';

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

type ContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: typeof translations['id'];
};

const LanguageContext = createContext<ContextType>({
  lang: 'id',
  setLang: () => {},
  t: translations.id,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('stimik_lang') as Lang | null;
    if (stored === 'en' || stored === 'id') setLangState(stored);
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('stimik_lang', l);
  };

  // Always use 'id' on first render to match SSR, switch after hydration
  const effectiveLang = mounted ? lang : 'id';

  return (
    <LanguageContext.Provider value={{ lang: effectiveLang, setLang, t: translations[effectiveLang] }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

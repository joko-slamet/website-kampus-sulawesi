'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { translations, type Lang } from './translations';

type BaseTranslation = typeof translations['id'];

// Shape of what the API returns: each section key holds { id: {...}, en: {...} }
export type SiteSettingsOverrides = Partial<Record<string, { id: Record<string, unknown>; en: Record<string, unknown> }>>;

type ContextType = {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: BaseTranslation;
};

const LanguageContext = createContext<ContextType>({
  lang: 'id',
  setLang: () => {},
  t: translations.id,
});

// Section key → translation key mapping (most match directly, visiMisi maps to profil)
const SECTION_TO_TRANS_KEY: Record<string, keyof BaseTranslation> = {
  hero: 'hero',
  about: 'about',
  visiMisi: 'profil',
  why: 'why',
  pmb: 'pmb',
  contact: 'contact',
  footer: 'footer',
};

function applyOverrides(base: BaseTranslation, overrides: SiteSettingsOverrides, lang: Lang): BaseTranslation {
  const result = { ...base };
  for (const [sectionKey, langMap] of Object.entries(overrides)) {
    if (!langMap) continue;
    const content = langMap[lang];
    if (!content || typeof content !== 'object') continue;
    const transKey = SECTION_TO_TRANS_KEY[sectionKey] ?? (sectionKey as keyof BaseTranslation);
    const existing = result[transKey];
    if (existing && typeof existing === 'object') {
      (result as Record<string, unknown>)[transKey] = { ...existing, ...content };
    }
  }
  return result;
}

export function LanguageProvider({
  children,
  overrides,
}: {
  children: ReactNode;
  overrides?: SiteSettingsOverrides;
}) {
  const [lang, setLangState] = useState<Lang>('id');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem('stia_lang') as Lang | null;
    if (stored === 'en' || stored === 'id') setLangState(stored);
    setMounted(true);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    localStorage.setItem('stia_lang', l);
  };

  const effectiveLang = mounted ? lang : 'id';

  const t = useMemo(() => {
    const base = translations[effectiveLang];
    if (!overrides || Object.keys(overrides).length === 0) return base;
    return applyOverrides(base, overrides, effectiveLang);
  }, [effectiveLang, overrides]);

  return (
    <LanguageContext.Provider value={{ lang: effectiveLang, setLang, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}

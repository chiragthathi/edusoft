import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from './locales/en.json';

/**
 * English ships in the main bundle (it is also the fallback). Other languages
 * are separate chunks fetched only when selected or detected, so visitors
 * never download translations they don't use.
 */
const lazyLocales = import.meta.glob<{ default: Record<string, unknown> }>(['./locales/*.json', '!./locales/en.json']);

i18n
  .use(LanguageDetector)
  .use({
    type: 'backend',
    read(lng: string, _ns: string, cb: (err: unknown, data?: Record<string, unknown> | boolean) => void) {
      if (lng === 'en') return cb(null, en);
      const load = lazyLocales[`./locales/${lng}.json`];
      if (!load) return cb(null, false);
      load().then(m => cb(null, m.default), err => cb(err));
    },
  })
  .use(initReactI18next)
  .init({
    resources: { en: { translation: en } },
    partialBundledLanguages: true,
    supportedLngs: ['en', 'ja', 'fr', 'zh', 'ko'],
    nonExplicitSupportedLngs: true,   // en-GB → en, zh-CN → zh
    load: 'languageOnly',
    fallbackLng: 'en',
    defaultNS: 'translation',
    returnObjects: true,   // allows t() to return arrays/objects
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage'],
      lookupLocalStorage: 'edusoft_lang',
    },
    interpolation: {
      escapeValue: false,
    },
    // Render English immediately; swap in the translation when its chunk arrives.
    react: { useSuspense: false },
  });

i18n.on('languageChanged', lng => { document.documentElement.lang = lng; });

export default i18n;

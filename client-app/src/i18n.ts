import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import enTranslation from './locales/en.json';
import faTranslation from './locales/fa.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslation },
      fa: { translation: faTranslation }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    },
    detection: {
      order: ['localStorage', 'navigator'],
      caches: ['localStorage']
    }
  });

export const updateDocumentAttributes = (lng: string) => {
  const dir = lng === 'fa' ? 'rtl' : 'ltr';
  document.documentElement.setAttribute('dir', dir);
  document.documentElement.setAttribute('lang', lng);
  if (lng === 'fa') {
    document.documentElement.classList.add('font-vazir');
  } else {
    document.documentElement.classList.remove('font-vazir');
  }
};

updateDocumentAttributes(i18n.language || 'en');
i18n.on('languageChanged', (lng) => {
  updateDocumentAttributes(lng);
});

export default i18n;

import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from '../../public/locales/en/common.json';
import ar from '../../public/locales/ar/common.json';

const resources = {
  en: { common: en },
  ar: { common: ar },
} as const;

if (!i18n.isInitialized) {
  i18n
    .use(initReactI18next)
    .init({
      resources,
      lng: 'en',
      fallbackLng: 'en',
      defaultNS: 'common',
      interpolation: { escapeValue: false },
      supportedLngs: ['en', 'ar'],
      react: { useSuspense: false },
    })
    .catch((err) => console.error('i18n init error', err));
}

export default i18n;

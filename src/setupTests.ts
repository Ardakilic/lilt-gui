import '@testing-library/jest-dom';
import i18n from './renderer/i18n/i18n';

// Initialize i18n for tests
i18n.init({
  lng: 'en',
  fallbackLng: 'en',
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

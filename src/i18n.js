import i18n from 'i18next';
import  {initReactI18next}  from 'react-i18next';

import en_UK from './locales/uk/en.json';
import cy_UK from './locales/uk/cy.json';

const resources = {
  en_UK: {
    translation: en_UK,
  },
  cy_UK: {
    translation: cy_UK,
  }
};

i18n
  .use(initReactI18next).init({
    resources,
    fallbackLng: 'en_UK',
    keySeparator: '.',
    interpolation: {
      escapeValue: false
    }
});

export default i18n;

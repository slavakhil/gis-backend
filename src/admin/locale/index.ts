import { locales as AdminJSLocales } from 'adminjs';

import en from './en/index.js';

const localeKey = 'en';
const customLanguage = 'mk';

export const locale = {
  language: localeKey,
  //   availableLanguages: [...Object.keys(AdminJSLocales), customLanguage].sort(),
  // localeDetection: true,
  // withBackend: true,
  translations: {
    en,
  },
};

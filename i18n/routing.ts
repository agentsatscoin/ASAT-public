import {defineRouting} from 'next-intl/routing';

export const routing = defineRouting({
  locales: ['en', 'fr', 'es', 'ar', 'zh'],
  defaultLocale: 'en',
  localePrefix: 'always'
});

export type AppLocale = (typeof routing.locales)[number];

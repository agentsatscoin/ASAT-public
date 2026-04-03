import {getRequestConfig} from 'next-intl/server';
import {hasLocale} from 'next-intl';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  const requested = await requestLocale;
  const locale = hasLocale(routing.locales, requested)
    ? requested
    : routing.defaultLocale;

  const [baseMessages, batch2Messages] = await Promise.all([
    import(`../messages/${locale}.json`).then((module) => module.default),
    import(`../messages/batch2/${locale}.json`)
      .then((module) => module.default)
      .catch(() => ({}))
  ]);

  return {
    locale,
    messages: {
      ...baseMessages,
      ...batch2Messages
    }
  };
});

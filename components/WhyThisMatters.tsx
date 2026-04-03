'use client';

import { useTranslations } from 'next-intl';

export default function WhyThisMatters() {
  const t = useTranslations('WhyThisMatters');

  const reasons = [
    {
      title: t('r1Title'),
      description: t('r1Body'),
    },
    {
      title: t('r2Title'),
      description: t('r2Body'),
    },
    {
      title: t('r3Title'),
      description: t('r3Body'),
    },
    {
      title: t('r4Title'),
      description: t('r4Body'),
    },
  ];

  return (
    <section className="border-y border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 protocol-kicker">{t('kicker')}</div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          {t('title')}
        </h2>

        <div className="mt-12 grid gap-0 border-t border-white/10 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`border-b border-white/10 bg-[#060B14] px-8 py-8 ${
                index % 2 === 0 ? 'md:border-r' : ''
              }`}
            >
              <h3 className="text-2xl font-semibold text-[#8CEBFF] sm:text-3xl">
                {reason.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#C9D3DF] sm:text-lg">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

'use client';

import { useTranslations } from 'next-intl';

export default function WhatIsASAT() {
  const t = useTranslations('WhatIsASAT');

  return (
    <section className="border-b border-white/10 bg-[#050816] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 protocol-kicker">{t('kicker')}</div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
              {t('title')}
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-[#C9D3DF] sm:text-lg">
              <p>{t('p1')}</p>
              <p>{t('p2')}</p>
              <p>{t('p3')}</p>
            </div>
          </div>

          <div className="border border-white/10 bg-[#081326] p-6 sm:p-8">
            <div className="protocol-kicker">{t('panelTitle')}</div>

            <div className="mt-6 space-y-4">
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  {t('assetRoleLabel')}
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  {t('assetRoleValue')}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  {t('liveNowLabel')}
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  {t('liveNowValue')}
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  {t('expandsIntoLabel')}
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  {t('expandsIntoValue')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

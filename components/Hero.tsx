'use client';

import { ASAT_CONTRACT } from '@/lib/asatConfig';
import { useTranslations } from 'next-intl';

const CONTRACT = ASAT_CONTRACT;

export function Hero() {
  const t = useTranslations('Hero');

  const scrollToRegistry = () => {
    document.getElementById('registry')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section id="top" className="overflow-hidden border-b border-white/10 bg-[#050816]">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 sm:py-16 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-12 lg:px-8 lg:py-20">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-3 border border-white/10 bg-[#081326] px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#C9D3E0]">
            <span className="flex h-5 w-5 items-center justify-center border border-white/20 text-[11px] font-semibold text-white">
              A
            </span>
            {t('badge')}
          </div>

          <h1 className="mt-7 max-w-[760px] text-4xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-[68px]">
            {t('title')}
          </h1>

          <p className="mt-5 max-w-[760px] text-base leading-8 text-[#C8D2DF] sm:text-[21px]">
            {t('subtitle')}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToRegistry}
              className="inline-flex items-center justify-center border border-[#F4F0E8] bg-[#F4F0E8] px-6 py-4 text-sm font-semibold text-[#050816] transition hover:opacity-90"
            >
              {t('viewRegistry')}
            </button>

            <a
              href="#registry"
              className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
            >
              {t('registerWallet')}
            </a>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <div className="border border-white/10 bg-[#081326] px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                {t('chainLabel')}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{t('chainValue')}</div>
            </div>

            <div className="border border-white/10 bg-[#081326] px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                {t('registryLabel')}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{t('registryValue')}</div>
            </div>

            <div className="border border-white/10 bg-[#081326] px-4 py-4">
              <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                {t('contractLabel')}
              </div>
              <div className="mt-2 text-lg font-semibold text-white">{t('contractValue')}</div>
            </div>
          </div>
        </div>

        <div className="hidden min-w-0 lg:block">
          <div className="mx-auto w-full max-w-[380px] border border-white/10 bg-[#081326] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#D7E0EA]">
                {t('surfaceTitle')}
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">v1</div>
            </div>

            <div className="grid gap-4 pt-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">{t('statusLabel')}</span>
                <span className="text-sm font-semibold text-white">{t('statusValue')}</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">{t('registryApiLabel')}</span>
                <span className="text-sm font-semibold text-white">/api/registry</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">{t('statsApiLabel')}</span>
                <span className="text-sm font-semibold text-white">/api/stats</span>
              </div>

              <div>
                <div className="text-sm text-[#9FB0C5]">{t('contractBoxLabel')}</div>
                <div className="mt-3 border border-white/10 bg-[#050816] px-4 py-3">
                  <div className="break-all font-mono text-[11px] leading-5 text-white">
                    {CONTRACT}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

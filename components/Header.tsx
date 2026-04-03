'use client';

import { AsatLogo } from '@/components/AsatLogo';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const GITHUB_URL = 'https://github.com/agentsatscoin/ASAT-public';
const X_URL = 'https://x.com/ASATcoin';

const LANGUAGES = [
  { locale: 'en', label: 'EN' },
  { locale: 'fr', label: 'FR' },
  { locale: 'es', label: 'ES' },
  { locale: 'ar', label: 'AR' },
  { locale: 'zh', label: 'ZH' },
] as const;

export function Header() {
  const t = useTranslations('Header');
  const locale = useLocale();
  const pathname = usePathname();

  const switchPath = pathname || '/';
  const isHome = switchPath === '/';

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6 lg:px-8">
        <Link href="/" className="min-w-0 shrink-0">
          <AsatLogo size="sm" />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm uppercase tracking-[0.22em] text-[#A7B5C7] transition hover:text-white"
          >
            {t('github')}
          </a>

          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm uppercase tracking-[0.22em] text-[#A7B5C7] transition hover:text-white"
          >
            {t('x')}
          </a>

          <div className="flex items-center gap-2">
            {LANGUAGES.map((item) => {
              const active = item.locale === locale;

              return (
                <Link
                  key={item.locale}
                  href={switchPath}
                  locale={item.locale}
                  className={`inline-flex items-center justify-center whitespace-nowrap border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] transition ${
                    active
                      ? 'border-[#8CEBFF]/35 bg-[#8CEBFF]/10 text-[#8CEBFF]'
                      : 'border-white/10 bg-transparent text-[#A7B5C7] hover:text-white'
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>
        </div>

        {isHome ? (
          <a
            href="#registry"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04] sm:px-5 sm:py-3"
          >
            {t('register')}
          </a>
        ) : (
          <Link
            href="/registry"
            className="inline-flex shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04] sm:px-5 sm:py-3"
          >
            {t('register')}
          </Link>
        )}
      </div>

      <div className="border-t border-white/5 px-4 py-2 md:hidden">
        <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 transition hover:text-white"
          >
            {t('github')}
          </a>

          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className="shrink-0 transition hover:text-white"
          >
            {t('x')}
          </a>

          {LANGUAGES.map((item) => {
            const active = item.locale === locale;

            return (
              <Link
                key={item.locale}
                href={switchPath}
                locale={item.locale}
                className={`inline-flex shrink-0 items-center justify-center whitespace-nowrap rounded-xl border px-2.5 py-1.5 transition ${
                  active
                    ? 'border-[#8CEBFF]/35 bg-[#8CEBFF]/10 text-[#8CEBFF]'
                    : 'border-white/10 bg-transparent text-[#8FA3BC] hover:text-white'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}

export default Header;

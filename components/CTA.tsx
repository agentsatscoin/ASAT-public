import { useTranslations } from 'next-intl';

export function CTA() {
  const t = useTranslations('CTA');

  return (
    <section className="border-b border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-5xl px-4 py-14 text-center sm:px-6 lg:px-8">
        <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
          {t('kicker')}
        </div>

        <h2 className="mx-auto mt-4 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
          {t('title')}
        </h2>

        <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-xl">
          {t('subtitle')}
        </p>

        <div className="mt-8">
          <a
            href="#registry"
            className="inline-flex items-center justify-center border border-[#F4F0E8] bg-[#F4F0E8] px-8 py-4 text-base font-semibold text-[#050816] transition hover:opacity-90"
          >
            {t('button')}
          </a>
        </div>
      </div>
    </section>
  );
}

export default CTA;

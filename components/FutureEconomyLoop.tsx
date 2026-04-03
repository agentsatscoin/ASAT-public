import { useTranslations } from 'next-intl';

export function FutureEconomyLoop() {
  const t = useTranslations('FutureEconomyLoop');

  const steps = [
    { number: '1', label: t('step1Label'), description: t('step1Body') },
    { number: '2', label: t('step2Label'), description: t('step2Body') },
    { number: '3', label: t('step3Label'), description: t('step3Body') },
    { number: '4', label: t('step4Label'), description: t('step4Body') },
    { number: '5', label: t('step5Label'), description: t('step5Body') },
    { number: '6', label: t('step6Label'), description: t('step6Body') },
  ];

  const principles = [
    {
      title: t('p1Title'),
      description: t('p1Body'),
    },
    {
      title: t('p2Title'),
      description: t('p2Body'),
    },
    {
      title: t('p3Title'),
      description: t('p3Body'),
    },
  ];

  return (
    <section className="border-b border-white/10 bg-[#050816] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 text-center protocol-kicker">{t('kicker')}</div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          {t('title')}
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-[#C9D3DF] sm:text-lg">
          {t('subtitle')}
        </p>

        <div className="mt-12 hidden gap-4 lg:grid lg:grid-cols-6">
          {steps.map((step, idx) => (
            <div key={step.number} className="relative">
              <div className="h-full border border-white/10 bg-[#081326] p-5">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center border border-[#C8B08A]/40 bg-[#C8B08A]/12 font-mono text-xs font-semibold text-[#C8B08A]">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8CEBFF]">
                  {step.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#B8C5D6]">
                  {step.description}
                </p>
              </div>

              {idx < steps.length - 1 && (
                <div className="pointer-events-none absolute -right-2 top-1/2 hidden -translate-y-1/2 text-[#6F8399] xl:block">
                  →
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 space-y-4 lg:hidden">
          {steps.map((step, idx) => (
            <div key={step.number}>
              <div className="border border-white/10 bg-[#081326] p-5">
                <div className="mb-4 inline-flex h-8 w-8 items-center justify-center border border-[#C8B08A]/40 bg-[#C8B08A]/12 font-mono text-xs font-semibold text-[#C8B08A]">
                  {step.number}
                </div>
                <h3 className="text-sm font-semibold uppercase tracking-[0.18em] text-[#8CEBFF]">
                  {step.label}
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#B8C5D6]">
                  {step.description}
                </p>
              </div>
              {idx < steps.length - 1 && (
                <div className="py-2 text-center text-[#6F8399]">↓</div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {principles.map((item) => (
            <div key={item.title} className="border-l border-[#8CEBFF]/40 pl-5">
              <h4 className="text-lg font-semibold text-[#F4F6F8]">{item.title}</h4>
              <p className="mt-3 text-sm leading-7 text-[#B8C5D6]">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useTranslations } from 'next-intl';

export function AgentWorkMiningPreview() {
  const t = useTranslations('AgentWorkMiningPreview');

  const workTypes = [
    {
      code: '01',
      name: t('w1Title'),
      description: t('w1Body'),
    },
    {
      code: '02',
      name: t('w2Title'),
      description: t('w2Body'),
    },
    {
      code: '03',
      name: t('w3Title'),
      description: t('w3Body'),
    },
    {
      code: '04',
      name: t('w4Title'),
      description: t('w4Body'),
    },
    {
      code: '05',
      name: t('w5Title'),
      description: t('w5Body'),
    },
    {
      code: '06',
      name: t('w6Title'),
      description: t('w6Body'),
    },
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
    <section className="border-b border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 protocol-kicker">{t('kicker')}</div>

        <div className="max-w-4xl">
          <div className="inline-flex items-center border border-[#C8B08A]/35 bg-[#C8B08A]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#C8B08A]">
            {t('phaseLabel')}
          </div>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
            {t('title')}
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#C9D3DF] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workTypes.map((work) => (
            <div key={work.code} className="border border-white/10 bg-[#060B14] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8FA3BC]">
                  {t('workSurface')}
                </span>
                <span className="font-mono text-xs text-[#C8B08A]">{work.code}</span>
              </div>

              <h3 className="mt-5 text-2xl font-semibold text-[#F4F6F8]">
                {work.name}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#B8C5D6] sm:text-base">
                {work.description}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 border border-white/10 bg-[#060B14] p-6 sm:p-8">
          <div className="grid gap-8 md:grid-cols-3">
            {principles.map((item) => (
              <div
                key={item.title}
                className="border-l border-[#8CEBFF]/35 pl-5"
              >
                <h4 className="text-lg font-semibold text-[#F4F6F8]">
                  {item.title}
                </h4>
                <p className="mt-3 text-sm leading-7 text-[#B8C5D6]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

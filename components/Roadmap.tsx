import { useTranslations } from 'next-intl';

export default function Roadmap() {
  const t = useTranslations('Roadmap');

  const phases = [
    {
      phase: t('phase1Label'),
      title: t('phase1Title'),
      note: t('phase1Note'),
      window: t('phase1Window'),
      live: true,
    },
    {
      phase: t('phase2Label'),
      title: t('phase2Title'),
      note: t('phase2Note'),
      window: t('phase2Window'),
      live: false,
    },
    {
      phase: t('phase3Label'),
      title: t('phase3Title'),
      note: t('phase3Note'),
      window: t('phase3Window'),
      live: false,
    },
    {
      phase: t('phase4Label'),
      title: t('phase4Title'),
      note: t('phase4Note'),
      window: t('phase4Window'),
      live: false,
    },
  ];

  return (
    <section id="roadmap" className="border-b border-white/10 bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
            {t('kicker')}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {phases.map((item) => (
            <article
              key={item.phase}
              className="border border-white/10 bg-[#06101D]/90 p-5 sm:p-6"
            >
              <div className="flex items-center justify-between gap-4">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                  {item.phase}
                </div>
                <span
                  className={`inline-flex shrink-0 items-center border px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    item.live
                      ? 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200'
                      : 'border-[#8FA3BC]/25 bg-[#8FA3BC]/[0.08] text-[#D9E3EF]'
                  }`}
                >
                  {item.window}
                </span>
              </div>

              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">
                {item.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-[#C8D2DF]">{item.note}</p>

              <div className="mt-6 flex items-center gap-3 border-t border-white/10 pt-4">
                <span
                  className={`h-2.5 w-2.5 ${item.live ? 'bg-emerald-300' : 'bg-[#6C84B4]'}`}
                />
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                  {item.live ? t('activeNow') : t('planned')}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

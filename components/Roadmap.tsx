const phases = [
  {
    phase: 'Phase 1',
    title: 'Agent Registry Launch',
    note: 'Live identity layer for wallets and operator positioning.',
    window: 'Live',
    live: true,
  },
  {
    phase: 'Phase 2',
    title: 'Work Mining Protocol',
    note: 'Task accounting, reward logic, and operator state.',
    window: 'Next',
    live: false,
  },
  {
    phase: 'Phase 3',
    title: 'Multi-Chain Integration',
    note: 'Routing expansion and broader machine settlement surface.',
    window: 'Later 2026',
    live: false,
  },
  {
    phase: 'Phase 4',
    title: 'AI Agent Marketplace',
    note: 'Agent discovery, coordination, and execution market.',
    window: 'Future',
    live: false,
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-b border-white/10 bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
            Protocol Roadmap / 2026+
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Roadmap
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-lg">
            A cleaner progression from identity to machine-native work and settlement.
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
                  className={`h-2.5 w-2.5 ${
                    item.live ? 'bg-emerald-300' : 'bg-[#6C84B4]'
                  }`}
                />
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                  {item.live ? 'Active now' : 'Planned'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

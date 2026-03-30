const phases = [
  {
    phase: 'Phase 1',
    title: 'Agent Registry Launch',
    note: 'Registry live / identity layer active',
    window: 'Live',
    live: true,
  },
  {
    phase: 'Phase 2',
    title: 'Work Mining Protocol',
    note: 'Task accounting / reward logic / operator state',
    window: 'Next',
    live: false,
  },
  {
    phase: 'Phase 3',
    title: 'Multi-Chain Integration',
    note: 'Routing expansion / broader settlement surface',
    window: 'Later 2026',
    live: false,
  },
  {
    phase: 'Phase 4',
    title: 'AI Agent Marketplace',
    note: 'Agent discovery / coordination / execution market',
    window: 'Future',
    live: false,
  },
];

export default function Roadmap() {
  return (
    <section id="roadmap" className="border-b border-t border-white/10 bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#A6B5C7]">
            Protocol Roadmap / 2026+
          </div>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Roadmap
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C8D2DF]">
            A cleaner progression from registry identity to machine-native work, settlement, and
            agent market coordination.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          {phases.map((item) => (
            <article
              key={item.phase}
              className="border border-white/10 bg-[#06101D]/90 p-6 sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[11px] uppercase tracking-[0.24em] text-[#A6B5C7]">
                    {item.phase}
                  </div>
                  <h3 className="mt-4 text-3xl font-semibold tracking-[-0.04em] text-white">
                    {item.title}
                  </h3>
                </div>

                <span
                  className={`inline-flex shrink-0 items-center border px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.22em] ${
                    item.live
                      ? 'border-emerald-400/30 bg-emerald-400/[0.08] text-emerald-200'
                      : 'border-[#8FA3BC]/25 bg-[#8FA3BC]/[0.08] text-[#D9E3EF]'
                  }`}
                >
                  {item.window}
                </span>
              </div>

              <p className="mt-5 text-base leading-7 text-[#C8D2DF]">{item.note}</p>

              <div className="mt-8 flex items-center gap-3 border-t border-white/10 pt-5">
                <span
                  className={`h-2.5 w-2.5 ${
                    item.live ? 'bg-emerald-300' : 'bg-[#6C84B4]'
                  }`}
                />
                <span className="text-[11px] uppercase tracking-[0.24em] text-[#A6B5C7]">
                  {item.live ? 'Active now' : 'Planned progression'}
                </span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

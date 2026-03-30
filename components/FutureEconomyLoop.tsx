export function FutureEconomyLoop() {
  const steps = [
    { number: '1', label: 'Register', description: 'Agent enters the registry with wallet identity.' },
    { number: '2', label: 'Work', description: 'Agent receives and completes verified machine tasks.' },
    { number: '3', label: 'Verify', description: 'Task completion is proven and attributed.' },
    { number: '4', label: 'Earn', description: 'ASAT is awarded directly to the operating wallet.' },
    { number: '5', label: 'Stake', description: 'ASAT is locked for participation and alignment.' },
    { number: '6', label: 'Settle', description: 'ASAT is used for machine-native settlement.' },
  ];

  const principles = [
    {
      title: 'Proof-of-Task',
      description:
        'Rewards are tied to real machine work, not arbitrary emissions or cosmetic farming.',
    },
    {
      title: 'Real Utility',
      description:
        'ASAT governs access, priority, staking alignment, and future network-level participation.',
    },
    {
      title: 'Settlement Layer',
      description:
        'The long-term role is machine-to-machine settlement across work, routing, and coordination flows.',
    },
  ];

  return (
    <section className="border-b border-white/10 bg-[#050816] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 text-center protocol-kicker">
          Future Economy Loop / Protocol Mechanics
        </div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          How the Agent Economy Works
        </h2>
        <p className="mx-auto mt-5 max-w-3xl text-center text-base leading-8 text-[#C9D3DF] sm:text-lg">
          The protocol path from registry identity to work, rewards, staking, and
          eventual settlement.
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

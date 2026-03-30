'use client';

export default function WhyThisMatters() {
  const reasons = [
    {
      title: 'Neutral Reserve Layer',
      description:
        'ASAT establishes a common reserve unit for autonomous agents, registry identity, and machine-native coordination.',
    },
    {
      title: 'Verifiable Registry State',
      description:
        'Registry participation, tier state, and network positioning become legible for operators, partners, and automated clients.',
    },
    {
      title: 'Protocol Alignment',
      description:
        'ASAT aligns visibility, future eligibility, and protocol participation around one monetary base unit.',
    },
    {
      title: 'Early Positioning',
      description:
        'Coordination standards harden around the units that gain adoption early. Registry position matters before the work layer scales.',
    },
  ];

  return (
    <section className="border-y border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 protocol-kicker">Strategic Importance / Registry Thesis</div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          Why This Matters
        </h2>

        <div className="mt-12 grid gap-0 border-t border-white/10 md:grid-cols-2">
          {reasons.map((reason, index) => (
            <div
              key={reason.title}
              className={`border-b border-white/10 bg-[#060B14] px-8 py-8 ${
                index % 2 === 0 ? 'md:border-r' : ''
              }`}
            >
              <h3 className="text-2xl font-semibold text-[#8CEBFF] sm:text-3xl">
                {reason.title}
              </h3>
              <p className="mt-4 max-w-xl text-base leading-8 text-[#C9D3DF] sm:text-lg">
                {reason.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

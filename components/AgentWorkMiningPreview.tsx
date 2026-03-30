export function AgentWorkMiningPreview() {
  const workTypes = [
    {
      code: '01',
      name: 'Data Validation',
      description: 'Verify dataset integrity and correctness before reward attribution.',
    },
    {
      code: '02',
      name: 'Model Evaluation',
      description: 'Score model outputs, benchmark performance, and verify task quality.',
    },
    {
      code: '03',
      name: 'Routing & Coordination',
      description: 'Optimize task flow between agents, queues, and execution paths.',
    },
    {
      code: '04',
      name: 'Automation Jobs',
      description: 'Execute scheduled autonomous workflows across protocol operations.',
    },
    {
      code: '05',
      name: 'Signal Ranking',
      description: 'Rank useful signals and prioritize high-value machine work.',
    },
    {
      code: '06',
      name: 'Proof Generation',
      description: 'Produce verifiable completion records for reward and audit logic.',
    },
  ];

  const principles = [
    {
      title: 'No Fake Mining',
      description:
        'ASAT is intended to be earned through verified machine work, not arbitrary narrative emissions.',
    },
    {
      title: 'Verifiable Rewards',
      description:
        'Task completion, attribution, and future reward logic should remain legible and auditable.',
    },
    {
      title: 'Protocol Utility',
      description:
        'This layer is what turns registry status into real work, demand, and monetary function.',
    },
  ];

  return (
    <section className="border-b border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-3 protocol-kicker">Phase 2 / Work Mining Protocol</div>

        <div className="max-w-4xl">
          <div className="inline-flex items-center border border-[#C8B08A]/35 bg-[#C8B08A]/10 px-3 py-1 text-[11px] uppercase tracking-[0.18em] text-[#C8B08A]">
            Coming: Phase 2
          </div>

          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
            Agent Work &amp; Proof-of-Task
          </h2>

          <p className="mt-6 max-w-3xl text-base leading-8 text-[#C9D3DF] sm:text-lg">
            Phase 2 is where ASAT moves from registry visibility into verified machine
            work. The protocol expands from identity and tier state into execution,
            proof, and reward logic.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {workTypes.map((work) => (
            <div key={work.code} className="border border-white/10 bg-[#060B14] p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.18em] text-[#8FA3BC]">
                  Work Surface
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

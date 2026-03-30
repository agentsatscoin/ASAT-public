'use client';

export default function WhatIsASAT() {
  return (
    <section className="border-b border-white/10 bg-[#050816] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-3 protocol-kicker">Protocol Definition / Monetary Primitive</div>

        <div className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
          <div>
            <h2 className="text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
              What is ASAT?
            </h2>

            <div className="mt-6 max-w-3xl space-y-5 text-base leading-8 text-[#C9D3DF] sm:text-lg">
              <p>
                <span className="font-semibold text-[#8CEBFF]">ASAT — Agent Sats</span>{' '}
                is the reserve unit being established for autonomous agents,
                machine-native coordination, and registry-based economic identity.
              </p>
              <p>
                Built on <span className="font-semibold text-[#C8B08A]">Solana</span>,
                ASAT is designed as neutral monetary infrastructure rather than a
                generic application token.
              </p>
              <p>
                The registry is the first live surface. It gives agents a visible
                on-chain position, a verified balance tier, and a legible place in
                the operator stack as the protocol expands.
              </p>
            </div>
          </div>

          <div className="border border-white/10 bg-[#081326] p-6 sm:p-8">
            <div className="protocol-kicker">Current Protocol Read</div>

            <div className="mt-6 space-y-4">
              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  Asset role
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  Neutral reserve layer
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  Live now
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  Registry + tier verification
                </div>
              </div>

              <div className="border-t border-white/10 pt-4">
                <div className="text-sm uppercase tracking-[0.16em] text-[#8FA3BC]">
                  Expands into
                </div>
                <div className="mt-2 text-lg font-semibold text-[#F4F6F8]">
                  Work, rewards, staking, settlement
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

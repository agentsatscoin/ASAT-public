'use client';

const CONTRACT = 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

export function Hero() {
  const scrollToRegistry = () => {
    document.getElementById('registry')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  return (
    <section id="top" className="overflow-hidden border-b border-white/10 bg-[#050816]">
      <div className="mx-auto grid max-w-7xl gap-12 px-4 py-14 sm:px-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:items-center lg:gap-16 lg:px-8 lg:py-24">
        <div className="min-w-0">
          <div className="inline-flex items-center gap-3 border border-white/10 bg-[#081326] px-4 py-3 text-[11px] uppercase tracking-[0.28em] text-[#C9D3E0]">
            <span className="flex h-5 w-5 items-center justify-center border border-white/20 text-[11px] font-semibold text-white">
              A
            </span>
            ASAT / Reserve Protocol
          </div>

          <h1 className="mt-8 max-w-[760px] text-5xl font-semibold leading-[0.96] tracking-[-0.06em] text-white sm:text-6xl lg:text-[72px]">
            The reserve unit for the autonomous economy.
          </h1>

          <p className="mt-6 max-w-[760px] text-lg leading-8 text-[#C8D2DF] sm:text-[22px]">
            ASAT is the neutral monetary layer for autonomous machine work, registry
            coordination, and future machine-to-machine settlement.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              onClick={scrollToRegistry}
              className="inline-flex items-center justify-center border border-[#F4F0E8] bg-[#F4F0E8] px-6 py-4 text-sm font-semibold text-[#050816] transition hover:opacity-90"
            >
              View Live Registry
            </button>

            <button
              type="button"
              onClick={scrollToRegistry}
              className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
            >
              Register Wallet
            </button>
          </div>

          <div className="mt-10 flex flex-wrap gap-x-8 gap-y-3 border-t border-white/10 pt-6 text-[11px] uppercase tracking-[0.28em] text-[#A8B6C8]">
            <span>Live on Solana</span>
            <span>Registry active</span>
            <span>Contract verified</span>
            <span>Official channels live</span>
          </div>
        </div>

        <div className="min-w-0 lg:justify-self-center">
          <div className="mx-auto w-full max-w-[380px] border border-white/10 bg-[#081326] p-6">
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#D7E0EA]">
                Machine Surface
              </div>
              <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">v1</div>
            </div>

            <div className="space-y-4 pt-4">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">status</span>
                <span className="text-sm font-semibold text-white">live</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">registry</span>
                <span className="text-sm font-semibold text-white">/api/registry</span>
              </div>

              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <span className="text-sm text-[#9FB0C5]">stats</span>
                <span className="text-sm font-semibold text-white">/api/stats</span>
              </div>

              <div>
                <div className="text-sm text-[#9FB0C5]">contract</div>
                <div className="mt-3 border border-white/10 bg-[#050816] px-4 py-3">
                  <div className="break-all font-mono text-[11px] leading-5 text-white">
                    {CONTRACT}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

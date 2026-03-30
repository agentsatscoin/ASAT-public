'use client';

const CONTRACT = 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';
const RESERVE = '13LYwfamjvDuquevVoKwMwbxFFRCDpFaU5xr87ry6a8b';

const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {}
};

function InfoCard({
  title,
  value,
  buttons,
  note,
}: {
  title: string;
  value: string;
  buttons?: React.ReactNode;
  note: string;
}) {
  return (
    <div className="border border-white/10 bg-[#06101D]/90 p-6 sm:p-7">
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#A6B5C7]">{title}</div>

      <div className="mt-5 overflow-x-auto border border-white/10 bg-[#050816] px-4 py-4">
        <div className="w-max min-w-full font-mono text-[12px] text-white">{value}</div>
      </div>

      {buttons ? <div className="mt-5 flex flex-col gap-3 sm:flex-row">{buttons}</div> : null}

      <p className="mt-5 text-sm text-[#9FB0C5]">{note}</p>
    </div>
  );
}

function SurfaceCard({
  kicker,
  title,
  note,
  href,
}: {
  kicker: string;
  title: string;
  note: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border border-white/10 bg-[#06101D]/90 p-6 transition hover:border-[#11D6FF]/35 hover:bg-[#081326]"
    >
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#A6B5C7]">{kicker}</div>
      <div className="mt-4 text-2xl font-semibold tracking-[-0.04em] text-white">{title}</div>
      <div className="mt-2 text-[11px] uppercase tracking-[0.24em] text-[#8CEBFF]">{note}</div>
    </a>
  );
}

export default function OfficialLinks() {
  return (
    <section id="official-links" className="border-y border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#A6B5C7]">
            Trust Surface / Official Registry Links
          </div>
          <h2 className="mt-5 text-4xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Official Links & Information
          </h2>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[#C8D2DF]">
            Clean official references for contract verification, reserve tracking, and channel
            discovery.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-2">
          <InfoCard
            title="Solana Mainnet Contract"
            value={CONTRACT}
            note="Always verify official links. Check contract before trading."
            buttons={
              <>
                <a
                  href={`https://solscan.io/token/${CONTRACT}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  View on Solscan
                </a>
                <button
                  type="button"
                  onClick={() => copyText(CONTRACT)}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  Copy Contract
                </button>
              </>
            }
          />

          <InfoCard
            title="Registry Reserve Wallet"
            value={RESERVE}
            note="Registry reserve wallet used for ASAT registry and reward tracking."
            buttons={
              <button
                type="button"
                onClick={() => copyText(RESERVE)}
                className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
              >
                Copy Wallet
              </button>
            }
          />
        </div>

        <div className="mt-6 grid gap-6 md:grid-cols-3">
          <SurfaceCard
            kicker="Market"
            title="Dexscreener"
            note="Search live market"
            href={`https://dexscreener.com/search?q=${CONTRACT}`}
          />
          <SurfaceCard
            kicker="Official X"
            title="@ASATcoin"
            note="Primary channel"
            href="https://x.com/ASATcoin"
          />
          <SurfaceCard
            kicker="Official Telegram"
            title="@ASATcoin"
            note="Coordination channel"
            href="https://t.me/ASATcoin"
          />
        </div>
      </div>
    </section>
  );
}

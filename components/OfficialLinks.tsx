'use client';

import type { ReactNode } from 'react';

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
  note,
  actions,
}: {
  title: string;
  value: string;
  note: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-[#06101D]/90 p-5 sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">{title}</div>

      <div className="mt-4 border border-white/10 bg-[#050816] px-4 py-4">
        <div className="break-all font-mono text-[12px] leading-6 text-white">{value}</div>
      </div>

      {actions ? <div className="mt-4 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}

      <p className="mt-4 text-sm leading-7 text-[#9FB0C5]">{note}</p>
    </div>
  );
}

function LinkCard({
  kicker,
  title,
  subtext,
  href,
}: {
  kicker: string;
  title: string;
  subtext: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border border-white/10 bg-[#06101D]/90 p-5 transition hover:border-[#11D6FF]/35 hover:bg-[#081326]"
    >
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">{kicker}</div>
      <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{title}</div>
      <div className="mt-2 text-sm text-[#C8D2DF]">{subtext}</div>
    </a>
  );
}

export default function OfficialLinks() {
  return (
    <section id="official-links" className="border-y border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
            Official Surface
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Official Links
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-lg">
            Clean verification points for contract, reserve wallet, and official channels.
          </p>
        </div>

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard
            title="Solana Mainnet Contract"
            value={CONTRACT}
            note="Always verify the contract before trading or sharing the token."
            actions={
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
            note="Reserve wallet used for registry and reward tracking."
            actions={
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

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <LinkCard
            kicker="Market"
            title="Dexscreener"
            subtext="Track the live ASAT market surface."
            href={`https://dexscreener.com/search?q=${CONTRACT}`}
          />
          <LinkCard
            kicker="Official X"
            title="@ASATcoin"
            subtext="Primary public communication channel."
            href="https://x.com/ASATcoin"
          />
          <LinkCard
            kicker="Official Telegram"
            title="@ASATcoin"
            subtext="Coordination and community surface."
            href="https://t.me/ASATcoin"
          />
        </div>
      </div>
    </section>
  );
}

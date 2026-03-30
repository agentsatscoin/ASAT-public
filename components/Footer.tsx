'use client';

import { AsatLogo } from '@/components/AsatLogo';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT ||
  'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

function shortMint(value: string) {
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

export default function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#050B14]">
      <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <AsatLogo />
              <div>
                <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">
                  ASAT / RESERVE PROTOCOL
                </div>
                <div className="mt-1 text-sm text-[#D7E0EA]">
                  Neutral reserve unit for autonomous machine work and settlement.
                </div>
              </div>
            </div>

            <div className="max-w-xl text-xs leading-6 text-[#7E90A7]">
              Live on Solana. Registry visibility and tier status are derived from
              verified ASAT balance at registration.
            </div>
          </div>

          <div className="grid gap-2 text-xs uppercase tracking-[0.18em] text-[#8FA3BC] md:text-right">
            <a
              href="https://x.com/ASATcoin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8CEBFF]"
            >
              X / @ASATcoin
            </a>
            <a
              href="https://t.me/ASATcoin"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8CEBFF]"
            >
              Telegram / @ASATcoin
            </a>
            <a
              href={`https://solscan.io/token/${ASAT_MINT}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#8CEBFF]"
            >
              Contract / {shortMint(ASAT_MINT)}
            </a>
          </div>
        </div>

        <div className="mt-8 flex flex-col gap-3 border-t border-white/10 pt-4 text-[11px] uppercase tracking-[0.18em] text-[#6F8399] sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Agent Sats</span>
          <span>Solana mainnet / registry active / protocol surface live</span>
        </div>
      </div>
    </footer>
  );
}

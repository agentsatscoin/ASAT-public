import { AsatLogo } from '@/components/AsatLogo';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT || 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

function shortMint(value: string) {
  if (!value) return '—';
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

export function Footer() {
  return (
    <footer className="bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid gap-10 border-b border-white/10 pb-8 md:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
          <div className="min-w-0">
            <AsatLogo size="md" className="w-fit" />

            <p className="mt-6 max-w-xl text-base leading-8 text-[#C8D2DF]">
              Neutral reserve unit for autonomous machine work and settlement.
            </p>

            <p className="mt-4 max-w-2xl text-sm leading-8 text-[#8FA3BC]">
              Live on Solana. Registry visibility and tier status are derived from verified ASAT
              balance at registration.
            </p>
          </div>

          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">Official</div>

            <div className="mt-4 grid gap-3 text-sm">
              <a
                href="https://x.com/ASATcoin"
                target="_blank"
                rel="noreferrer"
                className="text-[#C8D2DF] transition hover:text-white"
              >
                X / @ASATcoin
              </a>
              <a
                href="https://t.me/ASATcoin"
                target="_blank"
                rel="noreferrer"
                className="text-[#C8D2DF] transition hover:text-white"
              >
                Telegram / @ASATcoin
              </a>
              <a
                href="https://github.com/agentsatscoin/ASAT-public"
                target="_blank"
                rel="noreferrer"
                className="text-[#C8D2DF] transition hover:text-white"
              >
                GitHub / ASAT-public
              </a>
              <a
                href={`https://solscan.io/token/${ASAT_MINT}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#C8D2DF] transition hover:text-white"
              >
                Contract / {shortMint(ASAT_MINT)}
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
          © 2026 Agent Sats · Solana mainnet · Registry active · Protocol surface live
        </div>
      </div>
    </footer>
  );
}

export default Footer;

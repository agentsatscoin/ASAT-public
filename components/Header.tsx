import { AsatLogo } from '@/components/AsatLogo';

const GITHUB_URL = 'https://github.com/agentsatscoin/ASAT-public';
const X_URL = 'https://x.com/ASATcoin';

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#050816]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <a href="#top" className="min-w-0 shrink-0">
          <AsatLogo size="sm" />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm uppercase tracking-[0.22em] text-[#A7B5C7] transition hover:text-white"
          >
            GitHub
          </a>

          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className="text-sm uppercase tracking-[0.22em] text-[#A7B5C7] transition hover:text-white"
          >
            X
          </a>
        </div>

        <a
          href="#registry"
          className="inline-flex shrink-0 items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04] sm:px-6"
        >
          Register
        </a>
      </div>

      <div className="border-t border-white/5 px-4 py-2 text-center text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC] md:hidden">
        <div className="flex items-center justify-center gap-6">
          <a
            href={GITHUB_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            GitHub
          </a>

          <a
            href={X_URL}
            target="_blank"
            rel="noreferrer"
            className="transition hover:text-white"
          >
            X
          </a>
        </div>
      </div>
    </header>
  );
}

export default Header;

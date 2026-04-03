'use client';

import type { MouseEvent } from 'react';
import { Link } from '@/i18n/navigation';

type Props = {
  primaryCta: string;
  secondaryCta: string;
  targetId?: string;
};

export function RegistryHeroActions({
  primaryCta,
  secondaryCta,
  targetId = 'registry',
}: Props) {
  function handleSmoothScroll(event: MouseEvent<HTMLButtonElement>) {
    event.preventDefault();

    const target = document.getElementById(targetId);

    if (!target) {
      window.location.hash = `#${targetId}`;
      return;
    }

    target.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });

    const nextHash = `#${targetId}`;
    const nextUrl = `${window.location.pathname}${window.location.search}${nextHash}`;
    window.history.replaceState(null, '', nextUrl);
  }

  return (
    <div className="mt-6 flex flex-col gap-3 sm:flex-row">
      <button
        type="button"
        onClick={handleSmoothScroll}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-cyan-400 px-5 py-3 text-sm font-semibold text-black transition hover:opacity-90 sm:w-auto"
      >
        {primaryCta}
      </button>

      <Link
        href="/tasks"
        className="inline-flex w-full items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm font-medium text-slate-200 transition hover:bg-white/10 sm:w-auto"
      >
        {secondaryCta}
      </Link>
    </div>
  );
}

export default RegistryHeroActions;

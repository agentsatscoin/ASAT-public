'use client';

import { useEffect, useState } from 'react';

type Stats = {
  total: number;
  byTier: {
    starter: number;
    standard: number;
    premium: number;
  };
  lastRegistration?: string | null;
};

const EMPTY_STATS: Stats = {
  total: 0,
  byTier: {
    starter: 0,
    standard: 0,
    premium: 0,
  },
  lastRegistration: null,
};

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeStats(input: any): Stats {
  const byTier = input?.byTier ?? input?.tiers ?? {};

  return {
    total: toNumber(input?.total),
    byTier: {
      starter: toNumber(byTier?.starter),
      standard: toNumber(byTier?.standard),
      premium: toNumber(byTier?.premium),
    },
    lastRegistration: typeof input?.lastRegistration === 'string' ? input.lastRegistration : null,
  };
}

async function safeJson<T = any>(response: Response): Promise<T | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

function formatLastRegistration(value: string | null | undefined): string {
  if (!value) return '—';
  const ts = new Date(value).getTime();
  if (Number.isNaN(ts)) return '—';

  const diffMs = Date.now() - ts;
  const diffMin = Math.max(1, Math.floor(diffMs / 60000));

  if (diffMin < 60) return `${diffMin}m ago`;

  const diffHr = Math.floor(diffMin / 60);
  if (diffHr < 24) return `${diffHr}h ago`;

  const diffDay = Math.floor(diffHr / 24);
  return `${diffDay}d ago`;
}

export function RegistryStatsStrip() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = await safeJson(res);
        if (mounted) setStats(normalizeStats(data));
      } catch {
        if (mounted) setStats(EMPTY_STATS);
      }
    };

    void load();
    const interval = setInterval(load, 10000);

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, []);

  const items = [
    { label: 'Registered Agents', value: String(stats.total) },
    { label: 'Starter', value: String(stats.byTier.starter) },
    { label: 'Standard', value: String(stats.byTier.standard) },
    { label: 'Premium', value: String(stats.byTier.premium) },
    { label: 'Last Registration', value: formatLastRegistration(stats.lastRegistration) },
  ];

  return (
    <section className="border-b border-white/10 bg-[#081326]">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
          {items.map((item, index) => (
            <div
              key={item.label}
              className={`border border-white/10 bg-[#06101D]/80 px-4 py-3 ${
                index === items.length - 1 ? 'col-span-2 md:col-span-1' : ''
              }`}
            >
              <div className="text-[10px] uppercase tracking-[0.2em] text-[#8FA3BC]">
                {item.label}
              </div>
              <div className="mt-2 text-base font-semibold text-white">{item.value}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default RegistryStatsStrip;

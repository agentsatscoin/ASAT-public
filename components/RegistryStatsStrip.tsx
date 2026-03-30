'use client';

import { useEffect, useState } from 'react';

type Stats = {
  total: number;
  byTier: {
    starter: number;
    standard: number;
    premium: number;
  };
  lastRegistration: string | null;
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

async function safeJson(response: Response): Promise<any | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
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
    lastRegistration:
      typeof input?.lastRegistration === 'string' ? input.lastRegistration : null,
  };
}

function formatLastRegistration(value: string | null) {
  if (!value) return '—';

  const regTime = new Date(value);
  if (Number.isNaN(regTime.getTime())) return '—';

  const now = new Date();
  const diffMs = now.getTime() - regTime.getTime();
  const diffMins = Math.floor(diffMs / 60000);

  if (diffMins < 1) return 'just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h ago`;
  return `${Math.floor(diffMins / 1440)}d ago`;
}

export function RegistryStatsStrip() {
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/stats', { cache: 'no-store' });
        const data = await safeJson(res);
        setStats(normalizeStats(data));
      } catch {
        setStats(EMPTY_STATS);
      } finally {
        setLoading(false);
      }
    };

    void fetchStats();
    const interval = setInterval(() => {
      void fetchStats();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  if (loading && stats.total === 0) return null;

  const lastReg = formatLastRegistration(stats.lastRegistration);

  return (
    <div className="border-y border-white/10 bg-[#081326] px-4 py-3 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] uppercase tracking-[0.18em] sm:gap-6">
          <div className="text-center">
            <span className="text-[#8FA3BC]">Registered Agents</span>
            <span className="ml-2 font-semibold text-[#F4F6F8]">{stats.total}</span>
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="text-center">
            <span className="text-[#8FA3BC]">Starter</span>
            <span className="ml-2 font-semibold text-[#D7E0EA]">
              {stats.byTier.starter}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="text-center">
            <span className="text-[#8FA3BC]">Standard</span>
            <span className="ml-2 font-semibold text-[#8CEBFF]">
              {stats.byTier.standard}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="text-center">
            <span className="text-[#8FA3BC]">Premium</span>
            <span className="ml-2 font-semibold text-[#C8B08A]">
              {stats.byTier.premium}
            </span>
          </div>

          <div className="hidden h-4 w-px bg-white/10 sm:block" />

          <div className="text-center">
            <span className="text-[#8FA3BC]">Last registration</span>
            <span className="ml-2 font-semibold text-[#F4F6F8]">{lastReg}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { NextResponse } from 'next/server';
import { deriveTierKeyFromBalance } from '@/app/lib/tier';

type TierKey = 'starter' | 'standard' | 'premium';
type RoleKey = 'operator' | 'validator' | 'router' | 'scout';
type RewardKey = 'pending' | 'rewarded';

const EMPTY_STATS = {
  total: 0,
  byTier: {
    starter: 0,
    standard: 0,
    premium: 0,
  },
  byRole: {
    operator: 0,
    validator: 0,
    router: 0,
    scout: 0,
  },
  byRewardStatus: {
    pending: 0,
    rewarded: 0,
  },
  pooledAssetsUsd: 0,
  stakedAsat: 0,
  lastRegistration: null as string | null,
};

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTierKey(value: unknown): TierKey {
  const key = String(value ?? '').trim().toLowerCase();

  if (key === 'premium' || key === 'gold' || key === 'elite') return 'premium';
  if (key === 'standard' || key === 'silver') return 'standard';
  return 'starter';
}


function normalizeRoleKey(value: unknown): RoleKey | null {
  const key = String(value ?? '').trim().toLowerCase();

  if (
    key === 'operator' ||
    key === 'validator' ||
    key === 'router' ||
    key === 'scout'
  ) {
    return key;
  }

  return null;
}

function normalizeRewardKey(value: unknown): RewardKey | null {
  const key = String(value ?? '').trim().toLowerCase();

  if (key === 'pending' || key === 'rewarded') {
    return key;
  }

  return null;
}

<<<<<<< HEAD
=======
type TierKey = 'starter' | 'standard' | 'premium';
type RoleKey = 'operator' | 'validator' | 'router' | 'scout';
type RewardKey = 'pending' | 'rewarded';

const EMPTY_STATS = {
  total: 0,
  byTier: {
    starter: 0,
    standard: 0,
    premium: 0,
  },
  byRole: {
    operator: 0,
    validator: 0,
    router: 0,
    scout: 0,
  },
  byRewardStatus: {
    pending: 0,
    rewarded: 0,
  },
  pooledAssetsUsd: 0,
  stakedAsat: 0,
  lastRegistration: null as string | null,
};

function json(payload: unknown, status = 200) {
  return NextResponse.json(payload, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store',
    },
  });
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function normalizeTierKey(value: unknown): TierKey {
  const key = String(value ?? '').trim().toLowerCase();

  if (key === 'premium' || key === 'gold' || key === 'elite') return 'premium';
  if (key === 'standard' || key === 'silver') return 'standard';
  return 'starter';
}

function normalizeRoleKey(value: unknown): RoleKey | null {
  const key = String(value ?? '').trim().toLowerCase();

  if (
    key === 'operator' ||
    key === 'validator' ||
    key === 'router' ||
    key === 'scout'
  ) {
    return key;
  }

  return null;
}

function normalizeRewardKey(value: unknown): RewardKey | null {
  const key = String(value ?? '').trim().toLowerCase();

  if (key === 'pending' || key === 'rewarded') {
    return key;
  }

  return null;
}

>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !anonKey) {
      return json({
        ...EMPTY_STATS,
        error: 'Server not configured',
      });
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/asat_agents?select=id,wallet_address,asat_balance,tier,role,reward_status,created_at`,
      {
        headers: {
          apikey: anonKey,
          Authorization: `Bearer ${anonKey}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const rawText = await res.text();

    let agents: any[] = [];
    try {
      agents = rawText ? JSON.parse(rawText) : [];
    } catch {
      return json({
        ...EMPTY_STATS,
        error: 'Supabase returned non-JSON',
      });
    }

    if (!res.ok || !Array.isArray(agents)) {
      return json({
        ...EMPTY_STATS,
        error: 'Failed to fetch stats from Supabase',
      });
    }

    const stats = {
      ...EMPTY_STATS,
      byTier: { ...EMPTY_STATS.byTier },
      byRole: { ...EMPTY_STATS.byRole },
      byRewardStatus: { ...EMPTY_STATS.byRewardStatus },
    };

    let latestCreatedAt: string | null = null;

    for (const agent of agents) {
      stats.total += 1;
      stats.stakedAsat += toNumber(agent?.asat_balance);

<<<<<<< HEAD
      const tierKey = deriveTierKeyFromBalance(agent?.asat_balance);
=======
      const tierKey = normalizeTierKey(agent?.tier);
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
      stats.byTier[tierKey] += 1;

      const roleKey = normalizeRoleKey(agent?.role);
      if (roleKey) {
        stats.byRole[roleKey] += 1;
      }

      const rewardKey = normalizeRewardKey(agent?.reward_status);
      if (rewardKey) {
        stats.byRewardStatus[rewardKey] += 1;
      }

      const createdAt =
        typeof agent?.created_at === 'string' ? agent.created_at : null;

      if (createdAt) {
        if (!latestCreatedAt) {
          latestCreatedAt = createdAt;
        } else if (
          new Date(createdAt).getTime() > new Date(latestCreatedAt).getTime()
        ) {
          latestCreatedAt = createdAt;
        }
      }
    }

    return json({
      ...stats,
      lastRegistration: latestCreatedAt,
    });
  } catch (error) {
    console.error('Stats error:', error);

    return json({
      ...EMPTY_STATS,
      error: 'Failed to fetch stats',
      message: String(error),
    });
  }
}

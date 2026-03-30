import { NextResponse } from 'next/server';
import { deriveTierKeyFromBalance } from '@/app/lib/tier';

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
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ agents: [], error: 'Server not configured' }, 500);
    }

    const res = await fetch(
      `${supabaseUrl}/rest/v1/asat_agents?select=id,wallet_address,asat_balance,tier,role,x_handle,reward_status,created_at,status,signature&order=created_at.desc&limit=100`,
      {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const data = await res.json();

    if (!res.ok) {
      return json({ agents: [], error: 'Failed to fetch agents', details: data }, 500);
    }

    const agents = Array.isArray(data)
      ? data.map((agent: any) => ({
          ...agent,
          asat_balance: toNumber(agent?.asat_balance),
          tier: deriveTierKeyFromBalance(agent?.asat_balance),
        }))
      : [];

    return json({ agents });
  } catch (error) {
    return json({ agents: [], error: 'Failed to fetch agents', message: String(error) }, 500);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const walletAddress = String(body.walletAddress || body.wallet_address || '').trim();
    const role = String(body.role || '').trim().toLowerCase();
    const xHandle = body.xHandle ?? body.x_handle ?? null;
    const signature = body.signature ?? null;
    const verifiedBalance = toNumber(body.balance ?? body.asat_balance ?? body.asatBalance ?? 0);
    const derivedTier = deriveTierKeyFromBalance(verifiedBalance);

    if (!walletAddress || !role) {
      return json({ error: 'Missing required fields' }, 400);
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return json({ error: 'Server not configured' }, 500);
    }

    const checkRes = await fetch(
      `${supabaseUrl}/rest/v1/asat_agents?wallet_address=eq.${encodeURIComponent(walletAddress)}&select=id`,
      {
        headers: {
          Authorization: `Bearer ${serviceRoleKey}`,
          apikey: serviceRoleKey,
          'Content-Type': 'application/json',
        },
        cache: 'no-store',
      }
    );

    const existing = await checkRes.json();

    if (Array.isArray(existing) && existing.length > 0) {
      return json({ error: 'Wallet already registered', agentId: existing[0].id }, 409);
    }

    const insertRes = await fetch(`${supabaseUrl}/rest/v1/asat_agents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${serviceRoleKey}`,
        apikey: serviceRoleKey,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      },
      body: JSON.stringify({
        wallet_address: walletAddress,
        asat_balance: verifiedBalance,
        tier: derivedTier,
        role,
        x_handle: xHandle,
        signature,
        status: 'registered',
        reward_status: 'pending',
        created_at: new Date().toISOString(),
      }),
    });

    const data = await insertRes.json();

    if (!insertRes.ok) {
      return json({ error: 'Registration failed', details: data }, 400);
    }

    return json({ success: true, agent: Array.isArray(data) ? data[0] : data }, 201);
  } catch (error) {
    return json({ error: 'Registration failed', message: String(error) }, 500);
  }
}

'use client';

import { useEffect, useMemo, useState } from 'react';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT || 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

type TierKey = 'starter' | 'standard' | 'premium';
type RoleKey = 'operator' | 'validator' | 'router' | 'scout';
type RewardKey = 'pending' | 'rewarded';

type Agent = {
  id: string;
  wallet_address: string;
  asat_balance: number;
  tier: string;
  role: string;
  x_handle?: string | null;
  reward_status: string;
  created_at: string;
  status?: string | null;
  signature?: string | null;
};

type Stats = {
  total: number;
  byTier: {
    starter: number;
    standard: number;
    premium: number;
  };
  byRole: {
    operator: number;
    validator: number;
    router: number;
    scout: number;
  };
  byRewardStatus: {
    pending: number;
    rewarded: number;
  };
  pooledAssetsUsd?: number | null;
  stakedAsat?: number | null;
  lastRegistration?: string | null;
};

interface PhantomPublicKey {
  toString(): string;
}

interface PhantomProvider {
  isPhantom?: boolean;
  publicKey?: PhantomPublicKey | null;
  isConnected?: boolean;
  connect: (options?: { onlyIfTrusted?: boolean }) => Promise<any>;
  signMessage?: (message: Uint8Array, display?: 'utf8' | 'hex') => Promise<any>;
  request?: (args: { method: string; params?: any }) => Promise<any>;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  off?: (event: string, handler: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    phantom?: {
      solana?: PhantomProvider;
    };
    solana?: PhantomProvider;
  }
}

const EMPTY_STATS: Stats = {
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
  lastRegistration: null,
};

const ROLE_OPTIONS: Array<{
  id: RoleKey;
  label: string;
  description: string;
}> = [
  { id: 'operator', label: 'Operator', description: 'Run tasks and coordinate work' },
  { id: 'validator', label: 'Validator', description: 'Verify proofs and outcomes' },
  { id: 'router', label: 'Router', description: 'Route flows across systems' },
  { id: 'scout', label: 'Scout', description: 'Discover and surface opportunities' },
];

function getPhantomProvider(): PhantomProvider | null {
  if (typeof window === 'undefined') return null;
  const provider = window.phantom?.solana ?? window.solana;
  return provider?.isPhantom ? provider : null;
}

function bytesToBase64(value: Uint8Array | number[]): string {
  const bytes = value instanceof Uint8Array ? value : new Uint8Array(value);
  let binary = '';
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
  return btoa(binary);
}

function toNumber(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function tierFromBalance(balance: number): TierKey {
  const value = toNumber(balance);
  if (value >= 10_000_000) return 'premium';
  if (value >= 1_000_000) return 'standard';
  return 'starter';
}

function tierLabelFromBalance(balance: number): string {
  const tier = tierFromBalance(balance);
  return tier.charAt(0).toUpperCase() + tier.slice(1);
}

function normalizeRoleKey(value: unknown): RoleKey | null {
  const key = String(value ?? '').trim().toLowerCase();
  if (key === 'operator' || key === 'validator' || key === 'router' || key === 'scout') return key;
  return null;
}

function normalizeRewardKey(value: unknown): RewardKey | null {
  const key = String(value ?? '').trim().toLowerCase();
  if (key === 'pending' || key === 'rewarded') return key;
  return null;
}

function roleLabel(value: string) {
  const role = normalizeRoleKey(value);
  if (!role) return '—';
  return role.charAt(0).toUpperCase() + role.slice(1);
}

function rewardLabel(value: string) {
  const reward = normalizeRewardKey(value);
  if (!reward) return '—';
  return reward.charAt(0).toUpperCase() + reward.slice(1);
}

function formatCompactNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(toNumber(value));
}

function formatAsat(value: number) {
  return `${formatCompactNumber(value)} ASAT`;
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatDate(value: string | null | undefined) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-US', {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
}

function shortWallet(value: string) {
  if (!value) return '—';
  if (value.length <= 16) return value;
  return `${value.slice(0, 8)}...${value.slice(-6)}`;
}

function normalizeStats(input: any): Stats {
  const byTier = input?.byTier ?? input?.tiers ?? {};
  const byRole = input?.byRole ?? input?.roles ?? {};
  const byRewardStatus = input?.byRewardStatus ?? input?.rewardStatus ?? {};

  return {
    total: toNumber(input?.total),
    byTier: {
      starter: toNumber(byTier?.starter),
      standard: toNumber(byTier?.standard),
      premium: toNumber(byTier?.premium),
    },
    byRole: {
      operator: toNumber(byRole?.operator),
      validator: toNumber(byRole?.validator),
      router: toNumber(byRole?.router),
      scout: toNumber(byRole?.scout),
    },
    byRewardStatus: {
      pending: toNumber(byRewardStatus?.pending),
      rewarded: toNumber(byRewardStatus?.rewarded),
    },
    pooledAssetsUsd: input?.pooledAssetsUsd == null ? 0 : toNumber(input?.pooledAssetsUsd),
    stakedAsat: input?.stakedAsat == null ? 0 : toNumber(input?.stakedAsat),
    lastRegistration: typeof input?.lastRegistration === 'string' ? input.lastRegistration : null,
  };
}

function normalizeAgents(input: any): Agent[] {
  if (!Array.isArray(input)) return [];

  return input.map((agent: any, index: number) => ({
    id: String(agent?.id ?? `${agent?.wallet_address ?? 'agent'}-${index}`),
    wallet_address: String(agent?.wallet_address ?? ''),
    asat_balance: toNumber(agent?.asat_balance),
    tier: tierFromBalance(agent?.asat_balance),
    role: String(agent?.role ?? 'operator'),
    x_handle: agent?.x_handle ? String(agent.x_handle) : null,
    reward_status: String(agent?.reward_status ?? 'pending'),
    created_at: String(agent?.created_at ?? new Date().toISOString()),
    status: agent?.status ? String(agent.status) : null,
    signature: agent?.signature ? String(agent.signature) : null,
  }));
}

async function safeJson<T = any>(response: Response): Promise<T | null> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

async function fetchAsatBalance(walletAddress: string): Promise<number> {
  const response = await fetch(`/api/asat-balance?wallet=${encodeURIComponent(walletAddress)}`, {
    method: 'GET',
    cache: 'no-store',
  });

  const payload = await safeJson(response);

  if (!response.ok) {
    throw new Error((payload as any)?.error || 'Failed to fetch ASAT balance.');
  }

  return toNumber((payload as any)?.asatBalance);
}

function buildRegistrationMessage(args: {
  walletAddress: string;
  role: string;
  balance: number;
}) {
  return [
    'Live Agent Registry',
    'Action: Register this wallet as an ASAT agent.',
    `Wallet: ${args.walletAddress}`,
    `Role: ${args.role}`,
    `ASAT Balance: ${args.balance}`,
    `ASAT Mint: ${ASAT_MINT}`,
    `Origin: ${window.location.origin}`,
    `Timestamp: ${new Date().toISOString()}`,
    'This signature does not authorize token transfers.',
  ].join('\n');
}

async function signRegistrationMessage(message: string): Promise<string> {
  const provider = getPhantomProvider();

  if (!provider) throw new Error('Phantom is not available for signing.');

  const encodedMessage = new TextEncoder().encode(message);

  if (typeof provider.signMessage === 'function') {
    const signed = await provider.signMessage(encodedMessage, 'utf8');
    if (!signed?.signature) throw new Error('Phantom returned no signature.');
    return bytesToBase64(signed.signature);
  }

  if (typeof provider.request === 'function') {
    const signed = await provider.request({
      method: 'signMessage',
      params: {
        message: encodedMessage,
        display: 'utf8',
      },
    });

    if (signed?.signature) return bytesToBase64(signed.signature);
  }

  throw new Error('Message signing is unavailable in this Phantom session.');
}

function TierBadge({ balance }: { balance: number }) {
  const tier = tierFromBalance(balance);

  const tone =
    tier === 'premium'
      ? 'border-[#C8B08A]/25 bg-[#C8B08A]/[0.08] text-[#E8D8B8]'
      : tier === 'standard'
        ? 'border-[#8CEBFF]/25 bg-[#8CEBFF]/[0.07] text-[#8CEBFF]'
        : 'border-white/10 bg-white/[0.03] text-[#D7E0EA]';

  return (
    <span className={`inline-flex items-center border px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] ${tone}`}>
      {tierLabelFromBalance(balance)}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-[#081326] p-4">
      <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">{label}</div>
      <div className="mt-2 text-xl font-semibold text-white">{value}</div>
    </div>
  );
}

function EntryCard({ agent }: { agent: Agent }) {
  return (
    <div className="border border-white/10 bg-[#081326] p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Wallet</div>
          <div className="mt-2 break-all font-mono text-sm text-white" title={agent.wallet_address}>
            {shortWallet(agent.wallet_address)}
          </div>
        </div>
        <TierBadge balance={agent.asat_balance} />
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Role</div>
          <div className="mt-2 text-sm text-[#8CEBFF]">{roleLabel(agent.role)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Balance</div>
          <div className="mt-2 text-sm text-white">{formatAsat(agent.asat_balance)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Reward</div>
          <div className="mt-2 text-sm text-white">{rewardLabel(agent.reward_status)}</div>
        </div>
        <div>
          <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Registered</div>
          <div className="mt-2 text-sm text-white">{formatDate(agent.created_at)}</div>
        </div>
      </div>
    </div>
  );
}

export function AsatAgentRegistry() {
  const [connected, setConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');
  const [asatBalance, setAsatBalance] = useState(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const [balanceLoading, setBalanceLoading] = useState(false);
  const [selectedRole, setSelectedRole] = useState<RoleKey | ''>('');
  const [xHandle, setXHandle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [rpcNotice, setRpcNotice] = useState('');
  const [agents, setAgents] = useState<Agent[]>([]);
  const [stats, setStats] = useState<Stats>(EMPTY_STATS);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  const sortedAgents = useMemo(
    () =>
      [...agents].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      ),
    [agents]
  );

  const rewardPoolRows = useMemo(
    () => [...agents].sort((a, b) => b.asat_balance - a.asat_balance).slice(0, 5),
    [agents]
  );

  const latestEntryRows = useMemo(() => [...sortedAgents].slice(0, 5), [sortedAgents]);

  const existingAgent = useMemo(() => {
    if (!walletAddress) return null;
    return agents.find((agent) => agent.wallet_address.trim() === walletAddress.trim()) ?? null;
  }, [agents, walletAddress]);

  const statusItems = useMemo(() => {
    const registeredAsat =
      stats.stakedAsat && stats.stakedAsat > 0
        ? stats.stakedAsat
        : agents.reduce((sum, item) => sum + item.asat_balance, 0);

    return [
      { label: 'Pooled Assets', value: formatUsd(stats.pooledAssetsUsd ?? 0) },
      { label: 'Registered Agents', value: String(stats.total) },
      { label: 'Registered ASAT', value: formatAsat(registeredAsat) },
      { label: 'Reward Queue', value: String(stats.byRewardStatus.pending) },
    ];
  }, [agents, stats]);

  const resetWalletState = () => {
    setConnected(false);
    setWalletAddress('');
    setAsatBalance(0);
    setBalanceLoaded(false);
    setBalanceLoading(false);
  };

  const loadStats = async () => {
    try {
      const response = await fetch('/api/stats', { cache: 'no-store' });
      const data = await safeJson(response);
      setStats(normalizeStats(data));
    } catch {
      setStats(EMPTY_STATS);
    }
  };

  const loadAgents = async () => {
    try {
      const response = await fetch('/api/registry', { cache: 'no-store' });
      const data = await safeJson(response);
      setAgents(normalizeAgents((data as any)?.agents ?? data));
    } catch {
      setAgents([]);
    }
  };

  const refreshBalance = async (address: string): Promise<number | null> => {
    if (!address) return null;

    setBalanceLoading(true);
    setError('');

    try {
      const liveBalance = await fetchAsatBalance(address);
      setAsatBalance(liveBalance);
      setBalanceLoaded(true);
      setRpcNotice('');
      return liveBalance;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : 'Wallet connected, but ASAT balance lookup failed.';
      setAsatBalance(0);
      setBalanceLoaded(false);
      setRpcNotice(message);
      return null;
    } finally {
      setBalanceLoading(false);
    }
  };

  useEffect(() => {
    void loadStats();
    void loadAgents();

    const interval = setInterval(() => {
      void loadStats();
      void loadAgents();
    }, 5000);

    const provider = getPhantomProvider();

    const handleDisconnect = () => {
      resetWalletState();
      setSelectedRole('');
      setXHandle('');
      setError('');
      setRpcNotice('');
    };

    const handleAccountChanged = async (publicKey?: PhantomPublicKey | null) => {
      if (!publicKey) {
        handleDisconnect();
        return;
      }

      const address = publicKey.toString();
      setConnected(true);
      setWalletAddress(address);
      setSelectedRole('');
      setXHandle('');
      await refreshBalance(address);
      await loadAgents();
      await loadStats();
    };

    provider?.on?.('disconnect', handleDisconnect);
    provider?.on?.('accountChanged', handleAccountChanged);

    return () => {
      clearInterval(interval);
      provider?.off?.('disconnect', handleDisconnect);
      provider?.off?.('accountChanged', handleAccountChanged);
    };
  }, []);

  useEffect(() => {
    if (!existingAgent) return;

    const role = normalizeRoleKey(existingAgent.role);
    if (role) setSelectedRole(role);
    if (existingAgent.x_handle) setXHandle(existingAgent.x_handle);
  }, [existingAgent]);

  const connectWallet = async () => {
    setLoading(true);
    setError('');
    setRpcNotice('');

    const provider = getPhantomProvider();

    if (!provider) {
      window.open('https://phantom.app/', '_blank', 'noopener,noreferrer');
      setError('Phantom not detected. Install Phantom and try again.');
      setLoading(false);
      return;
    }

    let address = '';

    try {
      const response = await provider.connect();
      address = response?.publicKey?.toString?.() ?? provider.publicKey?.toString?.() ?? '';

      if (!address) {
        throw new Error('Phantom connected, but no wallet address was returned.');
      }

      setConnected(true);
      setWalletAddress(address);
      setSelectedRole('');
      setXHandle('');

      await refreshBalance(address);
      await loadAgents();
      await loadStats();
    } catch (err: any) {
      if (!address) resetWalletState();

      if (err?.code === 4001) {
        setError('Wallet connection was rejected in Phantom.');
      } else if (err?.code === -32002) {
        setError('Phantom approval window is already open. Approve or close it first.');
      } else if (!address) {
        setError(err instanceof Error ? err.message : 'Failed to connect wallet.');
      }
    } finally {
      setLoading(false);
    }
  };

  const disconnectWallet = () => {
    resetWalletState();
    setSelectedRole('');
    setXHandle('');
    setError('');
    setRpcNotice('');
  };

  const handleRefresh = async () => {
    if (!walletAddress) return;
    setError('');
    await refreshBalance(walletAddress);
    await loadAgents();
    await loadStats();
  };

  const handleRegister = async () => {
    if (!walletAddress || !selectedRole) {
      setError('Please connect a wallet and select a role.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const liveBalance =
        balanceLoaded && !balanceLoading ? asatBalance : await refreshBalance(walletAddress);

      if (liveBalance === null) {
        setError('Wallet connected, but ASAT balance could not be verified yet.');
        return;
      }

      const normalizedXHandle = xHandle.trim()
        ? xHandle.trim().startsWith('@')
          ? xHandle.trim()
          : `@${xHandle.trim()}`
        : null;

      const message = buildRegistrationMessage({
        walletAddress,
        role: selectedRole,
        balance: liveBalance,
      });

      const signature = await signRegistrationMessage(message);

      const response = await fetch('/api/registry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          walletAddress,
          asatBalance: liveBalance,
          role: selectedRole,
          xHandle: normalizedXHandle,
          signature,
        }),
      });

      const data = await safeJson(response);

      if (response.ok) {
        setShowSuccessToast(true);
        window.setTimeout(() => setShowSuccessToast(false), 3500);
        await loadAgents();
        await loadStats();
        return;
      }

      if (response.status === 409) {
        await loadAgents();
        await loadStats();
        setError('This wallet is already registered.');
        return;
      }

      setError((data as any)?.error || 'Registration failed.');
    } catch (err: any) {
      if (err?.code === 4001) {
        setError('Signature request was rejected in Phantom.');
      } else if (err?.code === -32002) {
        setError('Phantom signature window is already open. Approve or close it first.');
      } else {
        setError(err instanceof Error ? err.message : 'Registration failed.');
      }
    } finally {
      setLoading(false);
    }
  };

  const visibleBalance =
    balanceLoaded && connected
      ? asatBalance
      : existingAgent
        ? toNumber(existingAgent.asat_balance)
        : 0;

  const visibleTierLabel =
    balanceLoaded && connected
      ? tierLabelFromBalance(asatBalance)
      : existingAgent
        ? tierLabelFromBalance(existingAgent.asat_balance)
        : 'Unverified';

  return (
    <section id="registry" className="border-b border-white/10 bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        {showSuccessToast ? (
          <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 border border-[#8CEBFF]/25 bg-[#081326] px-4 py-3 text-center text-sm text-[#DFF8FF]">
            Registry entry confirmed
          </div>
        ) : null}

        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
            Live registry / on-chain identity
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            Live Agent Registry
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-lg">
            Register your wallet, secure your tier, and establish your position in the ASAT
            operator registry.
          </p>
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {statusItems.map((item) => (
            <StatCard key={item.label} label={item.label} value={item.value} />
          ))}
        </div>

        <div className="mt-4 flex flex-wrap gap-3">
          <span className="inline-flex items-center border border-white/10 bg-[#081326] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#D7E0EA]">
            Starter: {stats.byTier.starter}
          </span>
          <span className="inline-flex items-center border border-white/10 bg-[#081326] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#8CEBFF]">
            Standard: {stats.byTier.standard}
          </span>
          <span className="inline-flex items-center border border-white/10 bg-[#081326] px-3 py-2 text-[11px] uppercase tracking-[0.2em] text-[#E8D8B8]">
            Premium: {stats.byTier.premium}
          </span>
        </div>

        <div className="mt-8 border border-white/10 bg-[#06101D]/90 p-5 sm:p-6">
          {!connected ? (
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#8FA3BC]">Step 1</div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Connect Wallet</h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#B6C4D5]">
                Connect your Solana wallet to verify ASAT balance and begin registration.
              </p>

              {error ? (
                <div className="mt-5 border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                  {error}
                </div>
              ) : null}

              <div className="mt-6">
                <button
                  id="connect-phantom-btn"
                  type="button"
                  onClick={connectWallet}
                  disabled={loading}
                  className="inline-flex items-center justify-center border border-[#BFEFFF] bg-[#BFEFFF] px-6 py-4 text-sm font-semibold text-[#06101D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Connecting...' : 'Connect Phantom'}
                </button>
              </div>
            </div>
          ) : existingAgent ? (
            <div>
              <div className="border border-[#C8B08A]/20 bg-[#C8B08A]/[0.06] p-4">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#D5C3A0]">
                  Wallet status
                </div>
                <div className="mt-3 text-xl font-semibold text-white">
                  This wallet is already registered
                </div>
                <p className="mt-3 text-sm leading-7 text-[#D6DEEA]">
                  Registered state stays visible here instead of forcing a re-register flow.
                </p>
              </div>

              {(error || rpcNotice) ? (
                <div className="mt-4 grid gap-3">
                  {error ? (
                    <div className="border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}
                  {rpcNotice ? (
                    <div className="border border-amber-400/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100">
                      {rpcNotice}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                <div className="border border-white/10 bg-[#081326] p-4 sm:col-span-2 xl:col-span-3">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Wallet</div>
                  <div className="mt-3 break-all font-mono text-sm text-white">{walletAddress}</div>
                </div>

                <StatCard label="Verified Balance" value={formatAsat(visibleBalance)} />
                <StatCard label="Tier" value={visibleTierLabel} />
                <StatCard label="Role" value={roleLabel(existingAgent.role)} />
                <StatCard label="Registered" value={formatDate(existingAgent.created_at)} />
                <StatCard label="X Handle" value={existingAgent.x_handle || '—'} />
                <StatCard label="Reward Status" value={rewardLabel(existingAgent.reward_status)} />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={balanceLoading}
                  className="inline-flex items-center justify-center border border-[#BFEFFF] bg-[#BFEFFF] px-6 py-4 text-sm font-semibold text-[#06101D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {balanceLoading ? 'Refreshing...' : 'Refresh Balance'}
                </button>

                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          ) : (
            <div>
              <div className="text-[11px] uppercase tracking-[0.25em] text-[#8FA3BC]">Step 2</div>
              <h3 className="mt-4 text-2xl font-semibold text-white">Complete Registration</h3>
              <p className="mt-4 max-w-2xl text-base leading-7 text-[#B6C4D5]">
                Select a role, sign the registry message, and secure your position.
              </p>

              {(error || rpcNotice) ? (
                <div className="mt-5 grid gap-3">
                  {error ? (
                    <div className="border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                      {error}
                    </div>
                  ) : null}
                  {rpcNotice ? (
                    <div className="border border-amber-400/20 bg-amber-500/[0.06] px-4 py-3 text-sm text-amber-100">
                      {rpcNotice}
                    </div>
                  ) : null}
                </div>
              ) : null}

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="border border-white/10 bg-[#081326] p-4 sm:col-span-2">
                  <div className="text-[11px] uppercase tracking-[0.22em] text-[#8FA3BC]">Wallet</div>
                  <div className="mt-3 break-all font-mono text-sm text-white">{walletAddress}</div>
                </div>

                <StatCard
                  label="ASAT Balance"
                  value={
                    balanceLoading
                      ? 'Verifying...'
                      : balanceLoaded
                        ? formatAsat(asatBalance)
                        : 'Unverified'
                  }
                />
                <StatCard label="Tier" value={visibleTierLabel} />
              </div>

              <div className="mt-6">
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#8FA3BC]">
                  Choose Your Role
                </div>

                <div className="mt-4 grid gap-3 sm:grid-cols-2">
                  {ROLE_OPTIONS.map((role) => {
                    const active = selectedRole === role.id;

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setSelectedRole(role.id)}
                        className={`border p-4 text-left transition ${
                          active
                            ? 'border-[#8CEBFF]/40 bg-[#8CEBFF]/[0.08]'
                            : 'border-white/10 bg-[#081326] hover:border-white/20'
                        }`}
                      >
                        <div className="text-sm font-semibold uppercase tracking-[0.18em] text-white">
                          {role.label}
                        </div>
                        <div className="mt-2 text-sm leading-6 text-[#9FB0C5]">
                          {role.description}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="mt-6">
                <label className="text-[11px] uppercase tracking-[0.25em] text-[#8FA3BC]">
                  X Handle (optional)
                </label>
                <input
                  value={xHandle}
                  onChange={(event) => setXHandle(event.target.value)}
                  placeholder="@yourhandle"
                  className="mt-3 w-full border border-white/10 bg-[#081326] px-4 py-4 text-sm text-white outline-none transition placeholder:text-[#60738C] focus:border-[#8CEBFF]/35"
                />
              </div>

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <button
                  type="button"
                  onClick={handleRegister}
                  disabled={loading || balanceLoading || !selectedRole || !balanceLoaded}
                  className="inline-flex items-center justify-center border border-[#BFEFFF] bg-[#BFEFFF] px-6 py-4 text-sm font-semibold text-[#06101D] transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {loading ? 'Signing / Registering...' : 'Sign & Register'}
                </button>

                <button
                  type="button"
                  onClick={handleRefresh}
                  disabled={balanceLoading}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {balanceLoading ? 'Refreshing...' : 'Refresh Balance'}
                </button>

                <button
                  type="button"
                  onClick={disconnectWallet}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-6 py-4 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  Disconnect
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="mt-8 grid gap-6 xl:grid-cols-2">
          <div className="border border-white/10 bg-[#06101D]/90 p-5 sm:p-6">
            <h3 className="text-2xl font-semibold text-white">Early Operator Reward Pool</h3>
            <p className="mt-4 text-base leading-7 text-[#C8D2DF]">
              Top 5 registry entries by ASAT balance.
            </p>

            <div className="mt-6 space-y-4">
              {rewardPoolRows.length === 0 ? (
                <div className="border border-white/10 bg-[#081326] p-4 text-sm text-[#9FB0C5]">
                  No reward-pool rows yet.
                </div>
              ) : (
                rewardPoolRows.map((agent) => <EntryCard key={agent.id} agent={agent} />)
              )}
            </div>
          </div>

          <div className="border border-white/10 bg-[#06101D]/90 p-5 sm:p-6">
            <h3 className="text-2xl font-semibold text-white">Latest Registry Entries</h3>
            <p className="mt-4 text-base leading-7 text-[#C8D2DF]">
              Latest 5 signed entries from the live registry.
            </p>

            <div className="mt-6 space-y-4">
              {latestEntryRows.length === 0 ? (
                <div className="border border-white/10 bg-[#081326] p-4 text-sm text-[#9FB0C5]">
                  No registry entries yet.
                </div>
              ) : (
                latestEntryRows.map((agent) => <EntryCard key={agent.id} agent={agent} />)
              )}
            </div>
          </div>
        </div>

        <div className="mt-8 border border-white/10 bg-[#081326] px-4 py-4 text-sm text-[#8FA3BC]">
          Contract verified on Solana mainnet. Registry tier is derived from live verified ASAT
          balance at registration.
        </div>
      </div>
    </section>
  );
}

export default AsatAgentRegistry;

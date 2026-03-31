'use client';

import { useEffect, useMemo, useState, type ReactNode } from 'react';

const ASAT_MINT =
  process.env.NEXT_PUBLIC_ASAT_MINT || 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';

type TierKey = 'starter' | 'standard' | 'premium';
type RoleKey = 'operator' | 'validator' | 'router' | 'scout';
type RewardKey = 'pending' | 'rewarded';

<<<<<<< HEAD
type Agent = {
=======
interface Agent {
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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
<<<<<<< HEAD
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
=======
  byTier: { starter: 0, standard: 0, premium: 0 },
  byRole: { operator: 0, validator: 0, router: 0, scout: 0 },
  byRewardStatus: { pending: 0, rewarded: 0 },
  pooledAssetsUsd: 0,
  stakedAsat: 0,
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
};

const ROLE_OPTIONS: Array<{
  id: RoleKey;
  label: string;
  description: string;
}> = [
<<<<<<< HEAD
  { id: 'operator', label: 'Operator', description: 'Run tasks and coordinate work' },
  { id: 'validator', label: 'Validator', description: 'Verify proofs and outcomes' },
  { id: 'router', label: 'Router', description: 'Route flows across systems' },
  { id: 'scout', label: 'Scout', description: 'Discover and surface opportunities' },
=======
  {
    id: 'operator',
    label: 'Operator',
    description: 'Run tasks and coordinate work',
  },
  {
    id: 'validator',
    label: 'Validator',
    description: 'Verify task proofs',
  },
  {
    id: 'router',
    label: 'Router',
    description: 'Route and coordinate agents',
  },
  {
    id: 'scout',
    label: 'Scout',
    description: 'Discover and signal opportunities',
  },
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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

<<<<<<< HEAD
function tierFromBalance(balance: number): TierKey {
  const value = toNumber(balance);
  if (value >= 10_000_000) return 'premium';
  if (value >= 1_000_000) return 'standard';
=======
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

function getTierKey(balance: number): TierKey {
  if (balance > 5000) return 'premium';
  if (balance > 1000) return 'standard';
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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
<<<<<<< HEAD
}

function formatLongNumber(value: number) {
  return new Intl.NumberFormat('en-US', {
    maximumFractionDigits: 0,
  }).format(toNumber(value));
}

function formatAsat(value: number) {
  return `${formatCompactNumber(value)} ASAT`;
}

function formatAsatLong(value: number) {
  return `${formatLongNumber(value)} ASAT`;
=======
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
}

function formatUsd(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(toNumber(value));
<<<<<<< HEAD
=======
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
    pooledAssetsUsd:
      input?.pooledAssetsUsd == null ? 0 : toNumber(input?.pooledAssetsUsd),
    stakedAsat: input?.stakedAsat == null ? 0 : toNumber(input?.stakedAsat),
  };
}

function normalizeAgents(input: any): Agent[] {
  if (!Array.isArray(input)) return [];

  return input.map((agent: any, index: number) => ({
    id: String(agent?.id ?? `${agent?.wallet_address ?? 'agent'}-${index}`),
    wallet_address: String(agent?.wallet_address ?? ''),
    asat_balance: toNumber(agent?.asat_balance),
    tier: String(agent?.tier ?? 'starter'),
    role: String(agent?.role ?? 'operator'),
    x_handle: agent?.x_handle ? String(agent.x_handle) : null,
    reward_status: String(agent?.reward_status ?? 'pending'),
    created_at: String(agent?.created_at ?? new Date().toISOString()),
  }));
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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

<<<<<<< HEAD
  return toNumber((payload as any)?.asatBalance);
=======
  return toNumber(payload?.asatBalance);
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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

function SectionCard({
  title,
  children,
  className = '',
}: {
  title?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`border border-white/10 bg-[#06101D]/90 p-6 sm:p-7 ${className}`}>
      {title ? <h3 className="text-2xl font-semibold text-white">{title}</h3> : null}
      {children}
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

<<<<<<< HEAD
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

  const existingAgent = useMemo(() => {
    if (!walletAddress) return null;
    return agents.find((agent) => agent.wallet_address.trim() === walletAddress.trim()) ?? null;
  }, [agents, walletAddress]);

  const tierItems = useMemo(
    () => [
      { label: 'Starter', value: stats.byTier.starter },
      { label: 'Standard', value: stats.byTier.standard },
      { label: 'Premium', value: stats.byTier.premium },
    ],
    [stats]
  );

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

  const rightRailLinks = [
    { label: 'X (Twitter)', value: '@ASATcoin', href: 'https://x.com/ASATcoin' },
    { label: 'Telegram', value: '@ASATcoin', href: 'https://t.me/ASATcoin' },
    {
      label: 'Dexscreener',
      value: 'Live market',
      href: `https://dexscreener.com/search?q=${ASAT_MINT}`,
    },
  ];

=======
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
  const resetWalletState = () => {
    setConnected(false);
    setWalletAddress('');
    setAsatBalance(0);
    setBalanceLoaded(false);
    setBalanceLoading(false);
  };

  const loadStats = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('/api/stats', { cache: 'no-store' });
      const data = await safeJson(response);
      setStats(normalizeStats(data));
    } catch {
=======
      const res = await fetch('/api/stats', { cache: 'no-store' });
      const data = await safeJson(res);
      setStats(normalizeStats(data));
    } catch (err) {
      console.error('Failed to fetch stats:', err);
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
      setStats(EMPTY_STATS);
    }
  };

  const loadAgents = async () => {
    try {
<<<<<<< HEAD
      const response = await fetch('/api/registry', { cache: 'no-store' });
      const data = await safeJson(response);
      setAgents(normalizeAgents((data as any)?.agents ?? data));
    } catch {
=======
      const res = await fetch('/api/registry', { cache: 'no-store' });
      const data = await safeJson(res);
      setAgents(normalizeAgents(data?.agents ?? data));
    } catch (err) {
      console.error('Failed to fetch agents:', err);
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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
<<<<<<< HEAD
    void loadStats();
    void loadAgents();

    const interval = setInterval(() => {
      void loadStats();
      void loadAgents();
=======
    void fetchStats();
    void fetchAgents();

    const interval = setInterval(() => {
      void fetchStats();
      void fetchAgents();
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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
      address =
        response?.publicKey?.toString?.() ??
        provider.publicKey?.toString?.() ??
        '';

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
<<<<<<< HEAD
        window.setTimeout(() => setShowSuccessToast(false), 3500);
        await loadAgents();
        await loadStats();
        return;
=======
        setTimeout(() => setShowSuccessToast(false), 4000);

        if (data?.agent) {
          const normalizedAgent = normalizeAgents([data.agent])[0];
          setAgents((current) => [
            normalizedAgent,
            ...current.filter((agent) => agent.id !== normalizedAgent.id),
          ]);
        }

        await fetchStats();
        await fetchAgents();
      } else if (res.status === 409) {
        setError('This wallet is already registered');
      } else {
        setError(data?.error || 'Registration failed');
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
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

<<<<<<< HEAD
  const visibleTierLabel =
    balanceLoaded && connected
      ? tierLabelFromBalance(asatBalance)
      : existingAgent
        ? tierLabelFromBalance(existingAgent.asat_balance)
        : 'Unverified';
=======
  const totalTrackedAsat = useMemo(() => {
    return agents.reduce((sum, agent) => sum + toNumber(agent.asat_balance), 0);
  }, [agents]);

  const rewardPoolRows = useMemo(() => agents.slice(0, 5), [agents]);

  const pooledAssetsValue =
    typeof stats.pooledAssetsUsd === 'number'
      ? formatUsd(stats.pooledAssetsUsd)
      : '—';

  const stakedAsatValue =
    typeof stats.stakedAsat === 'number'
      ? `${formatCompactNumber(stats.stakedAsat)} ASAT`
      : totalTrackedAsat > 0
      ? `${formatCompactNumber(totalTrackedAsat)} ASAT`
      : '—';

  const statusItems = [
    { label: 'Pooled Assets', value: pooledAssetsValue },
    { label: 'Registered Agents', value: String(toNumber(stats.total)) },
    { label: 'Staked ASAT', value: stakedAsatValue },
    {
      label: 'Pending Rewards',
      value: String(toNumber(stats.byRewardStatus?.pending)),
    },
  ];
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)

  const tierItems = [
    { label: 'Starter', value: toNumber(stats.byTier?.starter), tone: 'text-[#D7E0EA]' },
    { label: 'Standard', value: toNumber(stats.byTier?.standard), tone: 'text-[#8CEBFF]' },
    { label: 'Premium', value: toNumber(stats.byTier?.premium), tone: 'text-[#C8B08A]' },
  ];

  return (
    <section id="registry" className="border-b border-white/10 bg-[#07111F]">
      <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        {showSuccessToast ? (
          <div className="fixed left-1/2 top-4 z-50 w-[calc(100vw-2rem)] max-w-sm -translate-x-1/2 border border-[#8CEBFF]/25 bg-[#081326] px-4 py-3 text-center text-sm text-[#DFF8FF]">
            Registry entry confirmed
          </div>
        ) : null}

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
          <div className="min-w-0">
            <SectionCard className="overflow-hidden">
              <div className="flex h-7 w-7 items-center justify-center border border-white/20 text-[11px] font-semibold text-white">
                A
              </div>

              <h2 className="mt-8 text-4xl font-semibold tracking-[-0.05em] text-white">
                Live Agent Registry
              </h2>

              <p className="mt-4 max-w-3xl text-lg leading-8 text-[#C8D2DF]">
                Register your wallet, secure your tier, and establish your position in the ASAT
                operator registry.
              </p>

              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {tierItems.map((item) => (
<<<<<<< HEAD
                  <div key={item.label} className="border border-white/10 bg-[#081326] p-4">
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#9FB0C5]">
                      {item.label}
                    </div>
                    <div className="mt-3 text-4xl font-semibold tracking-[-0.05em] text-white">
=======
                  <div
                    key={item.label}
                    className="rounded-2xl border border-white/10 bg-[#060B14]/60 p-4"
                  >
                    <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                      {item.label}
                    </div>
                    <div className={`mt-2 text-2xl font-semibold ${item.tone}`}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 rounded-[24px] border border-white/10 bg-[#060B14]/60 p-5 sm:p-6">
                {!connected ? (
                  <div className="space-y-5">
                    {error ? (
                      <div className="rounded-2xl border border-red-500/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    <div>
                      <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8FA3BC]">
                        Step 1
                      </div>
                      <h3 className="mt-2 text-2xl font-semibold text-[#F4F6F8]">
                        Connect Wallet
                      </h3>
                      <p className="mt-3 text-sm leading-7 text-[#AEBBCC]">
                        Connect your Solana wallet to verify ASAT balance and begin
                        registration.
                      </p>
                    </div>

                    <button
                      id="connect-phantom-btn"
                      onClick={connectWallet}
                      disabled={loading}
                      className="rounded-2xl bg-[#A8E8F8] px-6 py-3 text-sm font-semibold text-[#081326] transition hover:bg-[#B9F0FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading ? 'Connecting...' : 'Connect Phantom Wallet'}
                    </button>
                  </div>
                ) : registered ? (
                  <div className="space-y-6">
                    <div className="rounded-2xl border border-[#11D6FF]/25 bg-[#11D6FF]/10 px-4 py-3 text-sm font-medium text-[#8CEBFF]">
                      Registration complete. Your wallet is now in the ASAT operator
                      registry.
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-semibold text-[#F4F6F8]">
                        Registration Successful
                      </h3>
                      <p className="text-sm leading-7 text-[#AEBBCC]">
                        Your wallet has been registered as an early operator. Join
                        the{' '}
                        <a
                          href="https://t.me/ASATcoin"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#8CEBFF] hover:underline"
                        >
                          Telegram community
                        </a>{' '}
                        for Phase 1 updates.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setShowSuccessToast(false);
                        setSelectedRole('');
                        setXHandle('');
                        setError('');
                        setRpcNotice('');
                        resetWalletState();
                      }}
                      className="rounded-2xl border border-white/20 px-5 py-3 text-sm font-semibold text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5"
                    >
                      Register Another Wallet
                    </button>
                  </div>
                ) : (
                  <div className="space-y-8">
                    {error ? (
                      <div className="rounded-2xl border border-red-500/40 bg-red-950/20 px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    {rpcNotice ? (
                      <div className="rounded-2xl border border-amber-500/30 bg-amber-950/20 px-4 py-3 text-sm text-amber-100">
                        {rpcNotice}
                      </div>
                    ) : null}

                    <div className="rounded-2xl border border-white/10 bg-[#081326] p-5">
                      <div className="grid gap-5 md:grid-cols-2">
                        <div>
                          <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                            Wallet Address
                          </div>
                          <div className="mt-2 break-all font-mono text-sm text-[#DDE5EE]">
                            {walletAddress}
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                              ASAT Balance
                            </div>
                            <div className="mt-2 text-lg font-semibold text-[#8CEBFF]">
                              {balanceLoading
                                ? 'Loading...'
                                : balanceLoaded
                                ? `${asatBalance.toLocaleString(undefined, {
                                    maximumFractionDigits: 6,
                                  })} ASAT`
                                : 'Unverified'}
                            </div>
                          </div>

                          <div>
                            <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                              Tier
                            </div>
                            <div
                              className={`mt-2 text-lg font-semibold ${
                                balanceTierLabel === 'Premium'
                                  ? 'text-[#C8B08A]'
                                  : balanceTierLabel === 'Standard'
                                  ? 'text-[#8CEBFF]'
                                  : 'text-[#D7E0EA]'
                              }`}
                            >
                              {balanceTierLabel}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="mt-5 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => refreshBalance(walletAddress)}
                          disabled={balanceLoading || loading}
                          className="rounded-2xl border border-white/20 px-4 py-2.5 text-sm font-medium text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {balanceLoading
                            ? 'Refreshing Balance...'
                            : 'Retry Balance Lookup'}
                        </button>
                      </div>

                      <p className="mt-4 text-xs leading-6 text-[#8FA3BC]">
                        Registration stays locked until ASAT balance is verified and
                        the message is signed in Phantom.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div>
                        <div className="text-sm font-semibold uppercase tracking-[0.14em] text-[#8FA3BC]">
                          Step 2
                        </div>
                        <h3 className="mt-2 text-2xl font-semibold text-[#F4F6F8]">
                          Choose Your Role
                        </h3>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        {ROLE_OPTIONS.map((role) => (
                          <button
                            key={role.id}
                            onClick={() => setSelectedRole(role.id)}
                            className={`rounded-2xl border p-4 text-left transition ${
                              selectedRole === role.id
                                ? 'border-[#11D6FF]/60 bg-[#11D6FF]/10'
                                : 'border-white/10 bg-[#081326] hover:border-[#11D6FF]/35'
                            }`}
                          >
                            <div className="text-lg font-semibold text-[#F4F6F8]">
                              {role.label}
                            </div>
                            <div className="mt-1 text-sm leading-6 text-[#AEBBCC]">
                              {role.description}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="block text-sm font-semibold text-[#F4F6F8]">
                        X Handle (Optional)
                      </label>
                      <input
                        type="text"
                        placeholder="@yourhandle"
                        value={xHandle}
                        onChange={(e) => setXHandle(e.target.value)}
                        className="w-full rounded-2xl border border-white/10 bg-[#081326] px-4 py-3 text-white placeholder:text-[#6F8399] focus:border-[#11D6FF]/50 focus:outline-none"
                      />
                    </div>

                    <button
                      onClick={handleRegister}
                      disabled={
                        !selectedRole || loading || balanceLoading || !balanceLoaded
                      }
                      className="w-full rounded-2xl bg-[#A8E8F8] px-6 py-4 text-base font-semibold text-[#081326] transition hover:bg-[#B9F0FF] disabled:cursor-not-allowed disabled:opacity-60"
                    >
                      {loading
                        ? 'Awaiting Phantom Approval...'
                        : !balanceLoaded
                        ? 'Verify ASAT Balance Before Registering'
                        : 'Sign & Register'}
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 sm:p-8 backdrop-blur-sm">
              <div className="mb-6">
                <h3 className="text-2xl font-semibold text-[#F4F6F8]">
                  Early Operator Reward Pool
                </h3>
                <p className="mt-3 text-sm leading-7 text-[#AEBBCC]">
                  Register your wallet, secure your tier, and establish your
                  position in the ASAT operator registry.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/10">
                <table className="w-full border-collapse">
                  <thead className="bg-white/[0.03] text-left text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                    <tr>
                      <th className="px-4 py-4 font-medium">Wallet</th>
                      <th className="px-4 py-4 font-medium">Role</th>
                      <th className="px-4 py-4 font-medium">Balance</th>
                      <th className="px-4 py-4 font-medium">Tier</th>
                      <th className="px-4 py-4 font-medium">Reward Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rewardPoolRows.length > 0 ? (
                      rewardPoolRows.map((agent) => (
                        <tr
                          key={agent.id}
                          className="border-t border-white/10 text-sm text-[#E8EDF2]"
                        >
                          <td className="px-4 py-4 font-mono text-[#DDE5EE]">
                            {agent.wallet_address.slice(0, 8)}...
                            {agent.wallet_address.slice(-6)}
                          </td>
                          <td className="px-4 py-4 capitalize">{agent.role}</td>
                          <td className="px-4 py-4">
                            {toNumber(agent.asat_balance).toLocaleString()} ASAT
                          </td>
                          <td className="px-4 py-4 capitalize">
                            {normalizeTierKey(agent.tier)}
                          </td>
                          <td className="px-4 py-4">
                            <span className="rounded-full border border-[#11D6FF]/25 bg-[#11D6FF]/10 px-3 py-1 text-xs font-medium capitalize text-[#8CEBFF]">
                              {agent.reward_status}
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr className="border-t border-white/10">
                        <td
                          colSpan={5}
                          className="px-4 py-6 text-sm text-[#AEBBCC]"
                        >
                          Live reward-pool rows will appear here as registry data
                          populates.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {agents.length > 0 ? (
              <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 sm:p-8 backdrop-blur-sm">
                <div className="mb-6">
                  <h3 className="text-2xl font-semibold text-[#F4F6F8]">
                    Recent Registrations
                  </h3>
                  <p className="mt-2 text-sm leading-7 text-[#AEBBCC]">
                    Live registrations pulled from the ASAT registry database.
                  </p>
                </div>

                <div className="space-y-3">
                  {agents.slice(0, 6).map((agent) => (
                    <div
                      key={agent.id}
                      className="rounded-2xl border border-white/10 bg-[#060B14]/50 p-4"
                    >
                      <div className="grid gap-4 text-sm md:grid-cols-6">
                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Wallet
                          </div>
                          <div className="mt-1 font-mono text-[#DDE5EE]">
                            {agent.wallet_address.slice(0, 8)}...
                            {agent.wallet_address.slice(-6)}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Role
                          </div>
                          <div className="mt-1 capitalize text-[#8CEBFF]">
                            {agent.role}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Balance
                          </div>
                          <div className="mt-1 text-[#F4F6F8]">
                            {toNumber(agent.asat_balance).toLocaleString()} ASAT
                          </div>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Tier
                          </div>
                          <div className="mt-1 capitalize text-[#F4F6F8]">
                            {normalizeTierKey(agent.tier)}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Reward
                          </div>
                          <div className="mt-1 capitalize text-[#D7E0EA]">
                            {agent.reward_status}
                          </div>
                        </div>

                        <div>
                          <div className="text-xs uppercase tracking-[0.12em] text-[#8FA3BC]">
                            Registered
                          </div>
                          <div className="mt-1 text-[#D7E0EA]">
                            {new Date(agent.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>

          <div className="space-y-6">
            <div className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 backdrop-blur-sm">
              <div className="mb-6 flex items-center justify-between gap-4">
                <h3 className="text-xl font-semibold text-[#F4F6F8]">
                  Status Rail
                </h3>
                <div className="h-px w-20 bg-gradient-to-r from-[#11D6FF] to-transparent" />
              </div>

              <div className="space-y-4">
                {statusItems.map((item) => (
                  <div
                    key={item.label}
                    className="flex items-center justify-between gap-4 border-b border-white/10 pb-4 last:border-0 last:pb-0"
                  >
                    <span className="text-sm text-[#C9D3DF]">{item.label}</span>
                    <span className="text-2xl font-semibold text-[#F4F6F8]">
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-8 border border-white/10 bg-[#050B16] p-6">
                {!connected ? (
                  <div>
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#9FB0C5]">Step 1</div>
                    <h3 className="mt-4 text-2xl font-semibold text-white">Connect Wallet</h3>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#B6C4D5]">
                      Connect your Solana wallet to verify ASAT balance and begin registration.
                    </p>

                    {error ? (
                      <div className="mt-5 border border-red-400/20 bg-red-500/[0.06] px-4 py-3 text-sm text-red-200">
                        {error}
                      </div>
                    ) : null}

                    <div className="mt-8">
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
                        The frontend now keeps the registered state visible instead of forcing a
                        re-register flow.
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

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="border border-white/10 bg-[#081326] p-4 sm:col-span-2">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Wallet</div>
                        <div className="mt-3 break-all font-mono text-sm text-white">
                          {walletAddress}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">
                          Verified Balance
                        </div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          {balanceLoading ? 'Refreshing...' : formatAsat(visibleBalance)}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Tier</div>
                        <div className="mt-3 text-xl font-semibold text-white">{visibleTierLabel}</div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Role</div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          {roleLabel(existingAgent.role)}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">
                          Registered
                        </div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          {formatDate(existingAgent.created_at)}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">
                          X Handle
                        </div>
                        <div className="mt-3 break-all text-base text-white">
                          {existingAgent.x_handle || '—'}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">
                          Reward Status
                        </div>
                        <div className="mt-3 text-base text-white">
                          {rewardLabel(existingAgent.reward_status)}
                        </div>
                      </div>
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
                    <div className="text-[11px] uppercase tracking-[0.25em] text-[#9FB0C5]">Step 2</div>
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

                    <div className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div className="border border-white/10 bg-[#081326] p-4 sm:col-span-2">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Wallet</div>
                        <div className="mt-3 break-all font-mono text-sm text-white">
                          {walletAddress}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">
                          ASAT Balance
                        </div>
                        <div className="mt-3 text-xl font-semibold text-white">
                          {balanceLoading
                            ? 'Verifying...'
                            : balanceLoaded
                              ? formatAsat(asatBalance)
                              : 'Unverified'}
                        </div>
                      </div>

                      <div className="border border-white/10 bg-[#081326] p-4">
                        <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Tier</div>
                        <div className="mt-3 text-xl font-semibold text-white">{visibleTierLabel}</div>
                      </div>
                    </div>

                    <div className="mt-6">
                      <div className="text-[11px] uppercase tracking-[0.25em] text-[#9FB0C5]">
                        Choose Your Role
                      </div>
                      <div className="mt-4 grid gap-4 sm:grid-cols-2">
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
                      <label className="text-[11px] uppercase tracking-[0.25em] text-[#9FB0C5]">
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
            </SectionCard>

            <div className="mt-8">
              <SectionCard title="Early Operator Reward Pool">
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#C8D2DF]">
                  Register your wallet, secure your tier, and establish your position in the ASAT
                  operator registry.
                </p>

                <div className="mt-6 md:hidden">
                  <div className="space-y-4">
                    {rewardPoolRows.map((agent) => (
                      <div key={agent.id} className="border border-white/10 bg-[#081326] p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Wallet</div>
                            <div className="mt-2 font-mono text-sm text-white">
                              {shortWallet(agent.wallet_address)}
                            </div>
                          </div>
                          <TierBadge balance={agent.asat_balance} />
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Role</div>
                            <div className="mt-2 text-sm text-white">{roleLabel(agent.role)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Balance</div>
                            <div className="mt-2 text-sm text-white">{formatAsat(agent.asat_balance)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Reward</div>
                            <div className="mt-2 text-sm text-white">{rewardLabel(agent.reward_status)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-6 hidden md:block">
                  <div className="overflow-hidden border border-white/10 bg-[#081326]">
                    <table className="w-full table-fixed border-collapse">
                      <thead>
                        <tr className="border-b border-white/10 text-left">
                          <th className="w-[28%] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Wallet</th>
                          <th className="w-[15%] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Role</th>
                          <th className="w-[22%] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Balance</th>
                          <th className="w-[15%] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Tier</th>
                          <th className="w-[20%] px-4 py-4 text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Reward</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rewardPoolRows.map((agent) => (
                          <tr key={agent.id} className="border-b border-white/10 last:border-0">
                            <td className="truncate px-4 py-4 font-mono text-sm text-white">
                              {shortWallet(agent.wallet_address)}
                            </td>
                            <td className="truncate px-4 py-4 text-sm text-white">
                              {roleLabel(agent.role)}
                            </td>
                            <td className="truncate px-4 py-4 text-sm text-white">
                              {formatAsat(agent.asat_balance)}
                            </td>
                            <td className="px-4 py-4">
                              <TierBadge balance={agent.asat_balance} />
                            </td>
                            <td className="px-4 py-4">
                              <span className="inline-flex items-center border border-[#11D6FF]/30 bg-[#11D6FF]/[0.06] px-3 py-1 text-xs font-semibold text-[#B9F6FF]">
                                {rewardLabel(agent.reward_status)}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </SectionCard>
            </div>

            <div className="mt-8">
              <SectionCard title="Latest Registry Entries">
                <p className="mt-4 max-w-3xl text-base leading-7 text-[#C8D2DF]">
                  Recent signed entries pulled from the live ASAT registry.
                </p>

                <div className="mt-6 max-h-[560px] overflow-y-auto pr-1">
                  <div className="grid gap-3 lg:grid-cols-2">
                    {sortedAgents.map((agent) => (
                      <div key={agent.id} className="border border-white/10 bg-[#081326] p-4">
                        <div className="grid gap-3 sm:grid-cols-2">
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Wallet</div>
                            <div className="mt-2 font-mono text-sm text-white">
                              {shortWallet(agent.wallet_address)}
                            </div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Role</div>
                            <div className="mt-2 text-sm text-[#8CEBFF]">{roleLabel(agent.role)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Balance</div>
                            <div className="mt-2 text-sm text-white">{formatAsatLong(agent.asat_balance)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Tier</div>
                            <div className="mt-2 text-sm text-white">{tierLabelFromBalance(agent.asat_balance)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Reward</div>
                            <div className="mt-2 text-sm text-white">{rewardLabel(agent.reward_status)}</div>
                          </div>
                          <div>
                            <div className="text-[11px] uppercase tracking-[0.22em] text-[#9FB0C5]">Registered</div>
                            <div className="mt-2 text-sm text-white">{formatDate(agent.created_at)}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
<<<<<<< HEAD
              </SectionCard>
=======

                <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <span className="text-sm text-[#C9D3DF]">Telegram</span>
                  <a
                    href="https://t.me/ASATcoin"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#8CEBFF] hover:underline"
                  >
                    @ASATcoin
                  </a>
                </div>

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#C9D3DF]">Dexscreener</span>
                  <a
                    href="https://dexscreener.com/solana/humyagubqva6hgp9bnqioicegijvrk2xtsumit4gpump"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-[#8CEBFF] hover:underline"
                  >
                    Live market
                  </a>
                </div>
              </div>
            </div>

            <div
              id="official"
              className="rounded-[28px] border border-white/10 bg-[#081326]/88 p-6 backdrop-blur-sm"
            >
              <div className="text-xs uppercase tracking-[0.14em] text-[#8FA3BC]">
                Solana Mainnet Contract
              </div>

              <div className="mt-4 rounded-2xl border border-white/10 bg-[#060B14] px-4 py-4 font-mono text-sm text-[#DCE7F3]">
                {ASAT_MINT}
              </div>

              <div className="mt-4 flex gap-3">
                <a
                  href={`https://solscan.io/token/${ASAT_MINT}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-2xl border border-white/15 px-4 py-3 text-center text-sm font-medium text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5"
                >
                  View on Solscan
                </a>

                <button
                  onClick={() => {
                    if (typeof navigator !== 'undefined' && navigator.clipboard) {
                      void navigator.clipboard.writeText(ASAT_MINT);
                    }
                  }}
                  className="rounded-2xl border border-white/15 px-4 py-3 text-sm font-medium text-[#F4F6F8] transition hover:border-[#11D6FF]/60 hover:bg-white/5"
                >
                  Copy
                </button>
              </div>

              <p className="mt-4 text-xs leading-6 text-[#8FA3BC]">
                Always verify official links. Check contract before trading.
              </p>
>>>>>>> 2c5a882 (fix: registry tier error + homepage updates)
            </div>
          </div>

          <aside className="min-w-0 lg:sticky lg:top-24">
            <div className="space-y-6">
              <SectionCard title="Status Rail">
                <div className="mt-6 space-y-5">
                  {statusItems.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-white">{item.label}</span>
                      <span className="whitespace-nowrap text-xl font-semibold text-white">{item.value}</span>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard title="Official">
                <div className="mt-6 space-y-5">
                  {rightRailLinks.map((item) => (
                    <div
                      key={item.label}
                      className="flex items-center justify-between gap-4 border-b border-white/10 pb-5 last:border-0 last:pb-0"
                    >
                      <span className="text-sm text-white">{item.label}</span>
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noreferrer"
                        className="text-sm text-[#8CEBFF] transition hover:text-white"
                      >
                        {item.value}
                      </a>
                    </div>
                  ))}
                </div>
              </SectionCard>

              <SectionCard>
                <div className="text-[11px] uppercase tracking-[0.25em] text-[#A7B5C7]">
                  Solana Mainnet Contract
                </div>

                <div className="mt-4 border border-white/10 bg-[#050816] px-4 py-4">
                  <div className="break-all font-mono text-[11px] leading-5 text-white">
                    {ASAT_MINT}
                  </div>
                </div>

                <div className="mt-4 flex flex-col gap-3">
                  <a
                    href={`https://solscan.io/token/${ASAT_MINT}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center justify-center border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                  >
                    View on Solscan
                  </a>
                  <button
                    type="button"
                    onClick={() => navigator.clipboard.writeText(ASAT_MINT)}
                    className="inline-flex items-center justify-center border border-white/10 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                  >
                    Copy
                  </button>
                </div>

                <p className="mt-4 text-sm text-[#9FB0C5]">
                  Always verify official links. Check contract before trading.
                </p>
              </SectionCard>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

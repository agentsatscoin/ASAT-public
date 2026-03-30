export type TierKey = 'starter' | 'standard' | 'premium';

export function toNumber(value: unknown): number {
  const n = Number(value);
  return Number.isFinite(n) ? n : 0;
}

export function normalizeTierKey(value: unknown): TierKey {
  const key = String(value ?? '').trim().toLowerCase();

  if (key === 'premium' || key === 'gold' || key === 'elite') return 'premium';
  if (key === 'standard' || key === 'silver') return 'standard';
  return 'starter';
}

export function deriveTierKeyFromBalance(balanceValue: unknown): TierKey {
  const balance = toNumber(balanceValue);

  if (balance >= 10000000) return 'premium';
  if (balance >= 1000000) return 'standard';
  return 'starter';
}

export function deriveTierLabelFromBalance(
  balanceValue: unknown
): 'Starter' | 'Standard' | 'Premium' {
  const tier = deriveTierKeyFromBalance(balanceValue);

  if (tier === 'premium') return 'Premium';
  if (tier === 'standard') return 'Standard';
  return 'Starter';
}

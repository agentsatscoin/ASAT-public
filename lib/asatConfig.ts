const rawTreasury = process.env.NEXT_PUBLIC_REWARD_WALLET || '';

export const ASAT_CONTRACT = 'HumYaGUBQva6HgP9BNqioicEGijVRK2xtSUMiT4gpump';
export const ASAT_TREASURY = rawTreasury.trim();

if (!ASAT_TREASURY) {
  throw new Error('Missing NEXT_PUBLIC_REWARD_WALLET in .env.local');
}

export const ASAT_TOKEN_SOLSCAN_URL = `https://solscan.io/token/${ASAT_CONTRACT}`;
export const ASAT_TREASURY_SOLSCAN_URL = `https://solscan.io/account/${ASAT_TREASURY}`;
export const ASAT_DEXSCREENER_SEARCH_URL = `https://dexscreener.com/search?q=${ASAT_CONTRACT}`;

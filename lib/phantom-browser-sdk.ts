import { AddressType, BrowserSDK } from '@phantom/browser-sdk';

export type PhantomProvider = 'injected' | 'google' | 'apple';

export type PhantomConnectionOption = {
  id:
    | 'connect-extension'
    | 'continue-google'
    | 'continue-apple'
    | 'open-phantom-browser'
    | 'install-phantom'
    | 'continue-without-wallet';
  label: string;
  description: string;
  provider?: PhantomProvider;
  href?: string;
  external?: boolean;
  recommended?: boolean;
};

type PhantomAddress = {
  address?: string;
  type?: string;
};

type PhantomConnectResult = {
  addresses?: PhantomAddress[];
};

type RawInjectedPublicKey = {
  toString(): string;
};

type RawInjectedConnectResult = {
  publicKey?: RawInjectedPublicKey | null;
};

type RawInjectedPhantomProvider = {
  isPhantom?: boolean;
  publicKey?: RawInjectedPublicKey | null;
  connect: (
    options?: { onlyIfTrusted?: boolean }
  ) => Promise<RawInjectedConnectResult>;
  disconnect?: () => Promise<void> | void;
  on?: (event: string, handler: (...args: any[]) => void) => void;
  off?: (event: string, handler: (...args: any[]) => void) => void;
  signMessage?: (
    message: Uint8Array,
    display?: 'utf8' | 'hex'
  ) => Promise<{ signature?: Uint8Array | number[] }>;
  request?: (args: { method: string; params?: any }) => Promise<any>;
};

let phantomSdk: BrowserSDK | null = null;

function trimTrailingSlash(value: string): string {
  return value.replace(/\/+$/, '');
}

function getWindowOrigin(): string | null {
  if (typeof window === 'undefined' || !window.location?.origin) {
    return null;
  }

  return trimTrailingSlash(window.location.origin);
}

function getFallbackSiteUrl(): string {
  return (
    getWindowOrigin() ??
    (process.env.NODE_ENV === 'production'
      ? 'https://asatcoin.com'
      : 'http://localhost:3000')
  );
}

function buildTargetUrl(pathOrUrl?: string): string {
  const siteUrl = getSiteUrl();

  if (!pathOrUrl || pathOrUrl.trim() === '') {
    return siteUrl;
  }

  const raw = pathOrUrl.trim();

  try {
    const absolute = new URL(raw);
    return absolute.toString();
  } catch {
    // not absolute
  }

  if (raw.startsWith('/')) {
    return `${siteUrl}${raw}`;
  }

  return `${siteUrl}/${raw}`;
}

function getEnabledProviders(): PhantomProvider[] {
  if (hasEmbeddedPhantomAuth()) {
    return ['google', 'apple', 'injected'];
  }

  return ['injected'];
}

function getInjectedPhantomProvider(): RawInjectedPhantomProvider | null {
  if (typeof window === 'undefined') {
    return null;
  }

  const candidate = (
    window as Window & {
      phantom?: { solana?: RawInjectedPhantomProvider };
      solana?: RawInjectedPhantomProvider;
    }
  ).phantom?.solana ??
    (
      window as Window & {
        phantom?: { solana?: RawInjectedPhantomProvider };
        solana?: RawInjectedPhantomProvider;
      }
    ).solana ??
    null;

  return candidate?.isPhantom ? candidate : null;
}

function extractInjectedAddress(
  provider: RawInjectedPhantomProvider,
  response?: RawInjectedConnectResult | null
): string | null {
  return (
    response?.publicKey?.toString?.() ||
    provider.publicKey?.toString?.() ||
    null
  );
}

export function getPhantomAppId(): string {
  return (process.env.NEXT_PUBLIC_PHANTOM_APP_ID ?? '').trim();
}

export function getSiteUrl(): string {
  const envValue = (process.env.NEXT_PUBLIC_SITE_URL ?? '').trim();
  return envValue ? trimTrailingSlash(envValue) : getFallbackSiteUrl();
}

export function getPhantomRedirectUrl(): string {
  const envValue = (process.env.NEXT_PUBLIC_PHANTOM_REDIRECT_URL ?? '').trim();
  return envValue
    ? trimTrailingSlash(envValue)
    : `${getSiteUrl()}/auth/callback`;
}

export function hasEmbeddedPhantomAuth(): boolean {
  return Boolean(getPhantomAppId());
}

export function getPhantomDownloadUrl(): string {
  return 'https://phantom.app/download';
}

export function buildPhantomBrowseDeeplink(pathOrUrl?: string): string {
  const siteUrl = getSiteUrl();
  const targetUrl = buildTargetUrl(pathOrUrl);

  return `https://phantom.app/ul/browse/${encodeURIComponent(
    targetUrl
  )}?ref=${encodeURIComponent(siteUrl)}`;
}

export function isMobileBrowser(): boolean {
  if (typeof navigator === 'undefined') {
    return false;
  }

  return /Android|iPhone|iPad|iPod|IEMobile|Opera Mini|Mobile/i.test(
    navigator.userAgent || ''
  );
}

export function hasInjectedPhantomProvider(): boolean {
  return Boolean(getInjectedPhantomProvider());
}

export function resetPhantomBrowserSdk(): void {
  phantomSdk = null;
}

export function getPhantomBrowserSdk(): BrowserSDK | null {
  if (typeof window === 'undefined') {
    return null;
  }

  if (phantomSdk) {
    return phantomSdk;
  }

  const providers = getEnabledProviders();
  const config: any = {
    providers,
    addressTypes: [AddressType.solana],
    autoConnect: true,
  };

  if (providers.includes('google') || providers.includes('apple')) {
    config.appId = getPhantomAppId();
    config.authOptions = {
      redirectUrl: getPhantomRedirectUrl(),
    };
  }

  phantomSdk = new BrowserSDK(config);
  return phantomSdk;
}

export function extractSolanaAddress(result: unknown): string | null {
  const addresses = (result as PhantomConnectResult | undefined)?.addresses;

  if (!Array.isArray(addresses) || addresses.length === 0) {
    return null;
  }

  const directSolanaMatch = addresses.find(
    (entry) =>
      typeof entry?.address === 'string' &&
      entry.address.length > 0 &&
      entry.type === 'solana'
  );

  if (directSolanaMatch?.address) {
    return directSolanaMatch.address;
  }

  const firstAddress = addresses.find(
    (entry) => typeof entry?.address === 'string' && entry.address.length > 0
  );

  return firstAddress?.address ?? null;
}

export function getPhantomErrorMessage(error: unknown): string {
  if (error instanceof Error && error.message) {
    return error.message;
  }

  if (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as { message?: unknown }).message === 'string'
  ) {
    return (error as { message: string }).message;
  }

  return 'Unknown Phantom error';
}

export async function isPhantomInstalled(): Promise<boolean> {
  if (hasInjectedPhantomProvider()) {
    return true;
  }

  const sdk = getPhantomBrowserSdk();
  if (!sdk) {
    return false;
  }

  try {
    return await (sdk as any).isPhantomInstalled();
  } catch {
    return false;
  }
}

export async function autoConnectPhantom(): Promise<string | null> {
  const rawProvider = getInjectedPhantomProvider();

  if (rawProvider) {
    try {
      const response = await rawProvider.connect({ onlyIfTrusted: true });
      const address = extractInjectedAddress(rawProvider, response);
      if (address) {
        return address;
      }
    } catch {
      // ignore and continue to SDK fallback
    }
  }

  const sdk = getPhantomBrowserSdk();
  if (!sdk) {
    return null;
  }

  try {
    const result = await (sdk as any).autoConnect();
    return extractSolanaAddress(result);
  } catch {
    return null;
  }
}

export async function connectPhantom(
  provider: PhantomProvider
): Promise<string | null> {
  if (provider === 'injected') {
    const rawProvider = getInjectedPhantomProvider();

    if (!rawProvider) {
      throw new Error('Phantom extension not detected.');
    }

    const response = await rawProvider.connect();
    const address = extractInjectedAddress(rawProvider, response);

    if (!address) {
      throw new Error('Failed to connect Phantom extension.');
    }

    return address;
  }

  const sdk = getPhantomBrowserSdk();
  if (!sdk) {
    throw new Error('Phantom SDK is only available in the browser.');
  }

  const result = await (sdk as any).connect({ provider });
  return extractSolanaAddress(result);
}

export async function disconnectPhantom(): Promise<void> {
  const rawProvider = getInjectedPhantomProvider();

  if (rawProvider && typeof rawProvider.disconnect === 'function') {
    try {
      await rawProvider.disconnect();
    } catch {
      // ignore raw disconnect issues
    }
  }

  const sdk = getPhantomBrowserSdk();
  if (!sdk) {
    return;
  }

  try {
    await (sdk as any).disconnect();
  } catch {
    // ignore sdk disconnect issues
  }
}

export function onPhantomEvent(
  eventName: 'connect' | 'disconnect',
  handler: (payload?: unknown) => void
): () => void {
  const rawProvider = getInjectedPhantomProvider();

  if (rawProvider && typeof rawProvider.on === 'function') {
    rawProvider.on(eventName, handler);

    return () => {
      if (typeof rawProvider.off === 'function') {
        rawProvider.off(eventName, handler);
      }
    };
  }

  const sdk = getPhantomBrowserSdk();

  if (!sdk || typeof (sdk as any).on !== 'function') {
    return () => {};
  }

  (sdk as any).on(eventName, handler);

  return () => {
    if (typeof (sdk as any).off === 'function') {
      (sdk as any).off(eventName, handler);
    }
  };
}

export async function getPhantomConnectionOptions(
  currentPathOrUrl?: string
): Promise<PhantomConnectionOption[]> {
  const installed = await isPhantomInstalled();
  const mobile = isMobileBrowser();
  const options: PhantomConnectionOption[] = [];

  if (installed) {
    options.push({
      id: 'connect-extension',
      label: 'Connect Phantom',
      description: 'Use your existing Phantom wallet.',
      provider: 'injected',
      recommended: true,
    });
  }

  if (!installed && mobile) {
    options.push({
      id: 'open-phantom-browser',
      label: 'Open in Phantom',
      description: 'Open this page inside Phantom’s in-app browser.',
      href: buildPhantomBrowseDeeplink(currentPathOrUrl),
      external: true,
      recommended: true,
    });
  }

  if (hasEmbeddedPhantomAuth()) {
    options.push({
      id: 'continue-google',
      label: 'Continue with Google',
      description: 'Create or access a Phantom-connected wallet with Google.',
      provider: 'google',
      recommended: !installed && !mobile,
    });

    options.push({
      id: 'continue-apple',
      label: 'Continue with Apple',
      description: 'Create or access a Phantom-connected wallet with Apple.',
      provider: 'apple',
    });
  }

  if (!installed) {
    options.push({
      id: 'install-phantom',
      label: 'Install Phantom',
      description: 'Install the Phantom extension or mobile app first.',
      href: getPhantomDownloadUrl(),
      external: true,
    });
  }

  options.push({
    id: 'continue-without-wallet',
    label: 'Continue without wallet',
    description: 'Browse the site first and connect later.',
  });

  return options;
}

'use client';

import { useEffect, useState } from 'react';
import { ASAT_CONTRACT } from '@/lib/asatConfig';
import { Link } from '@/i18n/navigation';
import { useLocale, useTranslations } from 'next-intl';

const CONTRACT = ASAT_CONTRACT;

const STORAGE_KEYS = {
  wallets: [
    'asat.registry.walletAddress',
    'asat_wallet_address',
    'asat_registry_wallet',
    'asat_phantom_connected_wallet',
  ] as const,
  role: 'asat.registry.role',
  tier: 'asat.registry.tier',
} as const;

const UI_COPY = {
  en: {
    goToTasks: 'Open Task Layer',
    copyContract: 'Copy Contract',
    copied: 'Copied',
    walletLabel: 'Connected wallet',
    stripChain: 'Solana mainnet',
    stripRegistry: 'Registry live',
    stripContract: 'Contract verified',
    stripTaskLayer: 'Task layer live',
    railModeLabel: 'Registry mode',
    railModeValue:
      'Live registry, verified contract surface, and operator-ready task layer.',
  },
  fr: {
    goToTasks: 'Ouvrir la Task Layer',
    copyContract: 'Copier le contrat',
    copied: 'Copié',
    walletLabel: 'Wallet connecté',
    stripChain: 'Solana mainnet',
    stripRegistry: 'Registre live',
    stripContract: 'Contrat vérifié',
    stripTaskLayer: 'Task Layer live',
    railModeLabel: 'Mode registre',
    railModeValue:
      'Registre live, contrat vérifié, et task layer prête pour les opérateurs.',
  },
  es: {
    goToTasks: 'Abrir Task Layer',
    copyContract: 'Copiar contrato',
    copied: 'Copiado',
    walletLabel: 'Wallet conectada',
    stripChain: 'Solana mainnet',
    stripRegistry: 'Registro live',
    stripContract: 'Contrato verificado',
    stripTaskLayer: 'Task Layer live',
    railModeLabel: 'Modo registro',
    railModeValue:
      'Registro live, superficie de contrato verificada y task layer lista para operadores.',
  },
  ar: {
    goToTasks: 'افتح طبقة المهام',
    copyContract: 'نسخ العقد',
    copied: 'تم النسخ',
    walletLabel: 'المحفظة المتصلة',
    stripChain: 'Solana mainnet',
    stripRegistry: 'السجل live',
    stripContract: 'العقد موثّق',
    stripTaskLayer: 'طبقة المهام live',
    railModeLabel: 'وضع السجل',
    railModeValue:
      'سجل live، سطح عقد موثّق، وطبقة مهام جاهزة للمشغّلين.',
  },
  zh: {
    goToTasks: '打开任务层',
    copyContract: '复制合约',
    copied: '已复制',
    walletLabel: '已连接钱包',
    stripChain: 'Solana 主网',
    stripRegistry: '注册表已上线',
    stripContract: '合约已验证',
    stripTaskLayer: '任务层已上线',
    railModeLabel: '注册模式',
    railModeValue:
      '实时注册表、已验证合约界面，以及面向操作员的任务层。',
  },
} as const;

function readRegisteredWallet() {
  if (typeof window === 'undefined') return '';

  for (const key of STORAGE_KEYS.wallets) {
    const value = window.localStorage.getItem(key)?.trim() || '';
    if (value) return value;
  }

  const role = window.localStorage.getItem(STORAGE_KEYS.role)?.trim() || '';
  const tier = window.localStorage.getItem(STORAGE_KEYS.tier)?.trim() || '';

  if (role || tier) {
    for (const key of STORAGE_KEYS.wallets) {
      const value = window.localStorage.getItem(key)?.trim() || '';
      if (value) return value;
    }
  }

  return '';
}

function shortWallet(wallet: string) {
  const trimmed = wallet.trim();

  if (!trimmed) return '';
  if (trimmed.length <= 16) return trimmed;

  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

async function copyText(value: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.value = value;
  textarea.setAttribute('readonly', '');
  textarea.style.position = 'absolute';
  textarea.style.left = '-9999px';
  document.body.appendChild(textarea);
  textarea.select();
  document.execCommand('copy');
  document.body.removeChild(textarea);
}

function RailCard({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-[#07101F]/88 px-4 py-4">
      <div className="text-[10px] uppercase tracking-[0.22em] text-[#8FA3BC]">
        {label}
      </div>
      <div
        className={`mt-2 text-sm font-semibold text-white ${
          mono ? 'break-all font-mono text-[11px] leading-5' : ''
        }`}
      >
        {value}
      </div>
    </div>
  );
}

function StripPill({
  label,
  accent = false,
}: {
  label: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`inline-flex items-center rounded-full border px-3.5 py-2 text-[13px] ${
        accent
          ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
          : 'border-white/10 bg-[#07101F]/80 text-white'
      }`}
    >
      {label}
    </div>
  );
}

export function Hero() {
  const t = useTranslations('Hero');
  const locale = useLocale() as keyof typeof UI_COPY;
  const ui = UI_COPY[locale] || UI_COPY.en;
  const isRtl = locale === 'ar';

  const [registeredWallet, setRegisteredWallet] = useState('');
  const [copied, setCopied] = useState(false);

  const scrollToRegistry = () => {
    document.getElementById('registry')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    });
  };

  useEffect(() => {
    const syncWalletState = () => {
      setRegisteredWallet(readRegisteredWallet());
    };

    syncWalletState();

    const interval = window.setInterval(syncWalletState, 1200);
    window.addEventListener('storage', syncWalletState);
    window.addEventListener('focus', syncWalletState);
    document.addEventListener('visibilitychange', syncWalletState);

    return () => {
      window.clearInterval(interval);
      window.removeEventListener('storage', syncWalletState);
      window.removeEventListener('focus', syncWalletState);
      document.removeEventListener('visibilitychange', syncWalletState);
    };
  }, []);

  const handleCopyContract = async () => {
    try {
      await copyText(CONTRACT);
      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 2200);
    } catch (error) {
      console.error('Failed to copy contract', error);
    }
  };

  return (
    <section
      id="top"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="relative overflow-hidden border-b border-white/10 bg-[#050816]"
    >
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_10%_18%,rgba(140,235,255,0.12),transparent_24%),radial-gradient(circle_at_88%_82%,rgba(140,235,255,0.08),transparent_22%)]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[linear-gradient(180deg,rgba(17,214,255,0.05),transparent)]" />

      <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
        <div className="grid gap-10 xl:grid-cols-[minmax(0,1.1fr)_minmax(300px,0.9fr)] xl:items-start">
          <div className="min-w-0">
            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-[#081326]/90 px-4 py-2.5 text-[11px] uppercase tracking-[0.26em] text-[#C9D3E0]">
              <span className="flex h-5 w-5 items-center justify-center border border-white/20 text-[11px] font-semibold text-white">
                A
              </span>
              {t('badge')}
            </div>

            <h1 className="mt-6 max-w-[820px] text-4xl font-semibold leading-[0.92] tracking-[-0.06em] text-white sm:text-[56px] lg:text-[72px]">
              {t('title')}
            </h1>

            <p className="mt-5 max-w-[760px] text-base leading-8 text-[#C8D2DF] sm:text-[20px]">
              {t('subtitle')}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={scrollToRegistry}
                className="inline-flex items-center justify-center rounded-[18px] border border-[#F4F0E8] bg-[#F4F0E8] px-5 py-3.5 text-sm font-semibold text-[#050816] transition hover:opacity-90"
              >
                {t('viewRegistry')}
              </button>

              {registeredWallet ? (
                <Link
                  href="/tasks"
                  className="inline-flex items-center justify-center rounded-[18px] border border-emerald-400/25 bg-emerald-400/10 px-5 py-3.5 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-400/15"
                >
                  {ui.goToTasks}
                </Link>
              ) : (
                <a
                  href="#registry"
                  className="inline-flex items-center justify-center rounded-[18px] border border-white/10 bg-transparent px-5 py-3.5 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  {t('registerWallet')}
                </a>
              )}

              <button
                type="button"
                onClick={handleCopyContract}
                className="inline-flex items-center justify-center rounded-[18px] border border-white/10 bg-transparent px-5 py-3.5 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
              >
                {copied ? ui.copied : ui.copyContract}
              </button>
            </div>

            {registeredWallet ? (
              <div className="mt-5 inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-200">
                <span className="h-2 w-2 rounded-full bg-emerald-300" />
                <span className="text-emerald-200/90">{ui.walletLabel}</span>
                <span className="font-medium">{shortWallet(registeredWallet)}</span>
              </div>
            ) : null}

            <div className="mt-8 rounded-[26px] border border-white/10 bg-[#07101F]/58 p-4 sm:p-5">
              <div className="flex flex-wrap gap-2.5">
                <StripPill label={ui.stripChain} />
                <StripPill label={ui.stripRegistry} accent />
                <StripPill label={ui.stripContract} />
                <StripPill label={ui.stripTaskLayer} />
              </div>
            </div>
          </div>

          <div className="min-w-0 xl:pt-2">
            <div className="overflow-hidden rounded-[30px] border border-white/10 bg-[linear-gradient(180deg,rgba(8,19,38,0.96),rgba(5,11,23,0.96))] p-5 shadow-[0_18px_60px_rgba(0,0,0,0.26)] sm:p-6">
              <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
                <div className="text-[10px] uppercase tracking-[0.28em] text-[#D7E0EA]">
                  {t('surfaceTitle')}
                </div>
                <div className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-emerald-200">
                  live
                </div>
              </div>

              <div className="mt-5 grid gap-3">
                <RailCard label={t('statusLabel')} value={t('statusValue')} />
                <RailCard label={t('registryApiLabel')} value="/api/registry" />
                <RailCard label={t('contractBoxLabel')} value={CONTRACT} mono />

                <div className="rounded-[22px] border border-white/10 bg-[#07101F]/88 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#8FA3BC]">
                    {ui.railModeLabel}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-[#D7E0EA]">
                    {ui.railModeValue}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;

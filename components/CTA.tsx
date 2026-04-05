'use client';

import { useEffect, useState } from 'react';
import { Link, usePathname } from '@/i18n/navigation';
import { useLocale } from 'next-intl';

const STORAGE_KEYS = {
  wallets: [
    'asat.registry.walletAddress',
    'asat_wallet_address',
    'asat_registry_wallet',
  ] as const,
  role: 'asat.registry.role',
  tier: 'asat.registry.tier',
} as const;

type CtaCopy = {
  eyebrow: string;
  title: string;
  subtitle: string;
  registerWallet: string;
  goToTasks: string;
  connected: string;
  note: string;
  statusLabel: string;
  statusReady: string;
  statusOpen: string;
  flowLabel: string;
  flowValue: string;
};

const UI_COPY: Record<string, CtaCopy> = {
  en: {
    eyebrow: 'Final Entry',
    title: 'Enter the live operator layer.',
    subtitle:
      'Register a wallet, secure early position, and move through the ASAT task and proof flow from a cleaner protocol surface.',
    registerWallet: 'Register Wallet',
    goToTasks: 'Go to Tasks',
    connected: 'Connected wallet',
    note: 'The goal here is simple: visible participation, clear proof, and stronger operator presence.',
    statusLabel: 'Operator status',
    statusReady: 'Wallet registered. Task layer ready.',
    statusOpen: 'Registry open for early operator positioning.',
    flowLabel: 'Live path',
    flowValue: 'Register → Claim tasks → Submit proof',
  },
  fr: {
    eyebrow: 'Entrée finale',
    title: 'Entre dans la couche opérateur live.',
    subtitle:
      "Enregistre un wallet, prends une position tôt, et avance dans le flux de tâches et de preuve ASAT depuis une surface protocole plus propre.",
    registerWallet: 'Enregistrer wallet',
    goToTasks: 'Aller aux tâches',
    connected: 'Wallet connecté',
    note: "Le but ici est simple : participation visible, preuve claire, et présence opérateur plus forte.",
    statusLabel: 'Statut opérateur',
    statusReady: 'Wallet enregistrée. Task layer prête.',
    statusOpen: 'Le registre est ouvert pour le positionnement opérateur early.',
    flowLabel: 'Chemin live',
    flowValue: 'Enregistrer → Claim des tâches → Soumettre la preuve',
  },
};

function readRegisteredWallet() {
  if (typeof window === 'undefined') return '';

  const primaryWallet =
    window.localStorage.getItem(STORAGE_KEYS.wallets[0])?.trim() || '';
  const fallbackWallet =
    window.localStorage.getItem(STORAGE_KEYS.wallets[1])?.trim() ||
    window.localStorage.getItem(STORAGE_KEYS.wallets[2])?.trim() ||
    '';
  const role = window.localStorage.getItem(STORAGE_KEYS.role)?.trim() || '';
  const tier = window.localStorage.getItem(STORAGE_KEYS.tier)?.trim() || '';

  if (primaryWallet) return primaryWallet;
  if (fallbackWallet && (role || tier)) return fallbackWallet;

  return '';
}

function shortWallet(wallet: string) {
  const trimmed = wallet.trim();

  if (!trimmed) return '';
  if (trimmed.length <= 16) return trimmed;

  return `${trimmed.slice(0, 6)}...${trimmed.slice(-4)}`;
}

export function CTA() {
  const locale = useLocale();
  const pathname = usePathname();
  const ui = UI_COPY[locale] || UI_COPY.en;
  const isRtl = locale === 'ar';

  const [registeredWallet, setRegisteredWallet] = useState('');

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

  const registerHref = pathname === '/' ? '#registry' : '/registry';

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="border-t border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="overflow-hidden rounded-[32px] border border-white/10 bg-[radial-gradient(circle_at_top_left,rgba(140,235,255,0.10),transparent_34%),linear-gradient(180deg,rgba(8,19,38,0.95),rgba(5,8,22,0.95))] px-6 py-10 sm:px-10 sm:py-12">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:items-end">
            <div className="min-w-0">
              <div className="text-[11px] uppercase tracking-[0.28em] text-[#9FB0C5]">
                {ui.eyebrow}
              </div>

              <h2 className="mt-5 max-w-4xl text-4xl font-semibold tracking-[-0.05em] text-white sm:text-6xl">
                {ui.title}
              </h2>

              <p className="mt-5 max-w-3xl text-lg leading-9 text-[#C8D2DF]">
                {ui.subtitle}
              </p>

              <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-center">
                {registeredWallet ? (
                  <>
                    <div
                      title={registeredWallet}
                      className="inline-flex items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 px-6 py-4 text-base font-semibold text-emerald-200"
                    >
                      {shortWallet(registeredWallet)}
                    </div>

                    <Link
                      href="/tasks"
                      className="inline-flex items-center justify-center rounded-2xl border border-white/10 bg-transparent px-6 py-4 text-base font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                    >
                      {ui.goToTasks}
                    </Link>
                  </>
                ) : (
                  <a
                    href={registerHref}
                    className="inline-flex items-center justify-center rounded-2xl border border-[#E8E2D8] bg-[#E8E2D8] px-6 py-4 text-base font-semibold text-[#050816] transition hover:opacity-90"
                  >
                    {ui.registerWallet}
                  </a>
                )}
              </div>
            </div>

            <div className="min-w-0">
              <div className="rounded-[24px] border border-white/10 bg-[#07101F]/78 p-5 sm:p-6">
                <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                  {ui.statusLabel}
                </div>

                <div className="mt-3 text-lg font-semibold text-white">
                  {registeredWallet ? ui.statusReady : ui.statusOpen}
                </div>

                <div className="mt-5 rounded-[18px] border border-white/10 bg-[#050B17]/72 px-4 py-4">
                  <div className="text-[10px] uppercase tracking-[0.22em] text-[#8FA3BC]">
                    {ui.flowLabel}
                  </div>
                  <div className="mt-2 text-sm leading-7 text-[#D7E0EA]">
                    {ui.flowValue}
                  </div>
                </div>

                <div className="mt-5 text-sm leading-7 text-[#9FB0C5]">
                  {registeredWallet
                    ? `${ui.connected}: ${shortWallet(registeredWallet)}`
                    : ui.note}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CTA;

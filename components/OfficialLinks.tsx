'use client';

import type { ReactNode } from 'react';
import { useTranslations } from 'next-intl';
import {
  ASAT_CONTRACT,
  ASAT_DEXSCREENER_SEARCH_URL,
  ASAT_TOKEN_SOLSCAN_URL,
  ASAT_TREASURY,
  ASAT_TREASURY_SOLSCAN_URL,
} from '@/lib/asatConfig';

const copyText = async (value: string) => {
  try {
    await navigator.clipboard.writeText(value);
  } catch {}
};

function shortValue(value: string) {
  if (!value) return '—';
  if (value.length <= 18) return value;
  return `${value.slice(0, 10)}...${value.slice(-8)}`;
}

function InfoCard({
  title,
  value,
  note,
  actions,
}: {
  title: string;
  value: string;
  note: string;
  actions?: ReactNode;
}) {
  return (
    <div className="border border-white/10 bg-[#06101D]/90 p-5 sm:p-6">
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">{title}</div>

      <div className="mt-4 border border-white/10 bg-[#050816] px-4 py-4">
        <div className="break-all font-mono text-[12px] leading-6 text-white">{value}</div>
      </div>

      {actions ? <div className="mt-4 flex flex-col gap-3 sm:flex-row">{actions}</div> : null}

      <p className="mt-4 text-sm leading-7 text-[#9FB0C5]">{note}</p>
    </div>
  );
}

function LinkCard({
  kicker,
  title,
  subtext,
  href,
}: {
  kicker: string;
  title: string;
  subtext: string;
  href: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="border border-white/10 bg-[#06101D]/90 p-5 transition hover:border-[#11D6FF]/35 hover:bg-[#081326]"
    >
      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">{kicker}</div>
      <div className="mt-3 text-xl font-semibold tracking-[-0.04em] text-white">{title}</div>
      <div className="mt-2 text-sm text-[#C8D2DF]">{subtext}</div>
    </a>
  );
}

function ActiveTreasuryStrip() {
  const t = useTranslations('OfficialLinks');

  return (
    <div className="mt-8 border border-emerald-400/20 bg-emerald-400/[0.06] p-4 sm:p-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="min-w-0">
          <div className="text-[11px] uppercase tracking-[0.24em] text-emerald-300">
            {t('activeTreasuryLabel')}
          </div>

          <div className="mt-2 break-all font-mono text-[12px] leading-6 text-white">
            {ASAT_TREASURY}
          </div>

          <div className="mt-2 text-sm text-[#BFD3C8]">
            {t('liveSiteSourceLabel')}: <span className="font-mono text-white">NEXT_PUBLIC_REWARD_WALLET</span>
          </div>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row lg:flex-shrink-0">
          <a
            href={ASAT_TREASURY_SOLSCAN_URL}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center justify-center border border-emerald-300/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.06]"
          >
            {t('viewTreasurySolscan')}
          </a>

          <button
            type="button"
            onClick={() => copyText(ASAT_TREASURY)}
            className="inline-flex items-center justify-center border border-emerald-300/20 bg-transparent px-4 py-3 text-sm font-semibold text-white transition hover:border-emerald-300/40 hover:bg-emerald-300/[0.06]"
          >
            {t('copyActiveWallet')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function OfficialLinks() {
  const t = useTranslations('OfficialLinks');

  return (
    <section id="official-links" className="border-y border-white/10 bg-[#050816]">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
            {t('kicker')}
          </div>
          <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
            {t('title')}
          </h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-[#C8D2DF] sm:text-lg">
            {t('subtitle')}
          </p>
        </div>

        <ActiveTreasuryStrip />

        <div className="mt-8 grid gap-6 lg:grid-cols-2">
          <InfoCard
            title={t('contractTitle')}
            value={ASAT_CONTRACT}
            note={t('contractNote')}
            actions={
              <>
                <a
                  href={ASAT_TOKEN_SOLSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  {t('viewSolscan')}
                </a>
                <button
                  type="button"
                  onClick={() => copyText(ASAT_CONTRACT)}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  {t('copyContract')}
                </button>
              </>
            }
          />

          <InfoCard
            title={t('reserveTitle')}
            value={ASAT_TREASURY}
            note={t('reserveNote')}
            actions={
              <>
                <a
                  href={ASAT_TREASURY_SOLSCAN_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  {t('viewSolscan')}
                </a>
                <button
                  type="button"
                  onClick={() => copyText(ASAT_TREASURY)}
                  className="inline-flex items-center justify-center border border-white/10 bg-transparent px-5 py-3 text-sm font-semibold text-white transition hover:border-[#8CEBFF]/40 hover:bg-[#8CEBFF]/[0.04]"
                >
                  {t('copyWallet')}
                </button>
              </>
            }
          />
        </div>

        <div className="mt-6 grid gap-4 md:grid-cols-3">
          <LinkCard
            kicker={t('marketKicker')}
            title={t('marketTitle')}
            subtext={t('marketSubtext')}
            href={ASAT_DEXSCREENER_SEARCH_URL}
          />
          <LinkCard
            kicker={t('xKicker')}
            title="@ASATcoin"
            subtext={t('xSubtext')}
            href="https://x.com/ASATcoin"
          />
          <LinkCard
            kicker={t('telegramKicker')}
            title="@ASATcoin"
            subtext={t('telegramSubtext')}
            href="https://t.me/ASATcoin"
          />
        </div>

        <div className="mt-6 text-xs uppercase tracking-[0.18em] text-[#6E829B]">
          {t('liveConfigCheck')}: {t('treasuryShort')} {shortValue(ASAT_TREASURY)} · {t('contractShort')} {shortValue(ASAT_CONTRACT)}
        </div>
      </div>
    </section>
  );
}

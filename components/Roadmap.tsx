'use client';

import { useLocale } from 'next-intl';

type Phase = {
  label: string;
  status: string;
  title: string;
  body: string;
  points: string[];
  live?: boolean;
};

type RoadmapCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  phases: Phase[];
};

const UI_COPY: Record<string, RoadmapCopy> = {
  en: {
    kicker: 'Roadmap',
    title: 'Built in phases, from live operator flow to broader coordination.',
    subtitle:
      'ASAT should feel like a real protocol surface: clear live state now, tighter trust next, deeper coordination later.',
    phases: [
      {
        label: 'Live now',
        status: 'Active',
        live: true,
        title: 'Operator loop validated',
        body:
          'The first layer is already working locally: connect wallet, register, claim tasks, submit proof, and preserve submitted state after refresh.',
        points: [
          'Wallet-based registry flow',
          'Operator task board',
          'Task claim and cancel logic',
          'Proof submission state',
          'Operator activity truth layer',
        ],
      },
      {
        label: 'Next',
        status: 'In progress',
        title: 'Production polish and proof surfaces',
        body:
          'Tighten the public-facing product so the live system feels clearer, stronger, and more trustworthy from the first screen.',
        points: [
          'Final production deploy confirmation',
          'Cleaner homepage proof hierarchy',
          'Better reward-state clarity',
          'Stronger public operator history surfaces',
          'Tighter protocol UX consistency',
        ],
      },
      {
        label: 'Later',
        status: 'Planned',
        title: 'Trust, rewards, and expanded network coordination',
        body:
          'Once the live loop is clean, the next step is deeper operator trust, broader task classes, and stronger network coordination logic.',
        points: [
          'Expanded reward flows',
          'Tier and reputation logic',
          'Broader task categories',
          'Deeper proof and review surfaces',
          'Network-level coordination primitives',
        ],
      },
    ],
  },
  fr: {
    kicker: 'Roadmap',
    title:
      'Construit par phases, du flux opérateur live vers une coordination plus large.',
    subtitle:
      "ASAT doit se lire comme une vraie surface protocole : état live clair maintenant, confiance renforcée ensuite, coordination plus profonde plus tard.",
    phases: [
      {
        label: 'Live maintenant',
        status: 'Actif',
        live: true,
        title: 'Boucle opérateur validée',
        body:
          "La première couche fonctionne déjà localement : connecter le wallet, s'inscrire, claim des tâches, soumettre une preuve, et garder l'état après refresh.",
        points: [
          'Flux registre basé wallet',
          'Board de tâches opérateur',
          'Claim et annulation de tâches',
          'État de soumission de preuve',
          "Couche vérité d'activité opérateur",
        ],
      },
      {
        label: 'Ensuite',
        status: 'En cours',
        title: 'Polish production et surfaces de preuve',
        body:
          'Resserre le produit public pour que le système live paraisse plus clair, plus fort et plus crédible dès le premier écran.',
        points: [
          'Confirmation finale du déploiement production',
          'Hiérarchie de preuve homepage plus propre',
          'Clarté des états de récompense',
          "Meilleures surfaces publiques d'historique opérateur",
          'Cohérence UX protocole plus forte',
        ],
      },
      {
        label: 'Plus tard',
        status: 'Planifié',
        title: 'Confiance, récompenses et coordination réseau étendue',
        body:
          'Une fois la boucle live propre, la prochaine étape est une confiance opérateur plus profonde, des tâches plus larges et une coordination réseau plus forte.',
        points: [
          'Flux de récompenses étendus',
          'Logique de tier et réputation',
          'Catégories de tâches plus larges',
          'Surfaces de preuve et review plus profondes',
          'Primitives de coordination réseau',
        ],
      },
    ],
  },
};

export default function Roadmap() {
  const locale = useLocale();
  const ui = UI_COPY[locale] || UI_COPY.en;
  const isRtl = locale === 'ar';

  const railLineSide = isRtl ? 'right-[15px]' : 'left-[15px]';
  const itemPadding = isRtl ? 'pr-10 sm:pr-12' : 'pl-10 sm:pl-12';
  const dotSide = isRtl ? 'right-[8px]' : 'left-[8px]';

  return (
    <section
      id="roadmap"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="border-b border-white/10 bg-[#07111F]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-14">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
              {ui.kicker}
            </div>

            <h2 className="mt-4 max-w-[320px] text-3xl font-semibold tracking-[-0.05em] text-white sm:max-w-none sm:text-5xl">
              {ui.title}
            </h2>

            <p className="mt-5 max-w-[340px] text-base leading-8 text-[#C8D2DF] sm:max-w-none sm:text-lg">
              {ui.subtitle}
            </p>
          </div>

          <div className="relative min-w-0">
            <div className={`absolute ${railLineSide} top-6 bottom-6 w-px bg-white/10`} />

            <div className="space-y-6">
              {ui.phases.map((phase) => (
                <div
                  key={`${phase.label}-${phase.title}`}
                  className={`relative ${itemPadding}`}
                >
                  <span
                    className={`absolute ${dotSide} top-7 h-[15px] w-[15px] rounded-full border border-[#07111F] ${
                      phase.live ? 'bg-emerald-300' : 'bg-[#6C84B4]'
                    }`}
                  />

                  <article className="rounded-[28px] border border-white/10 bg-[#081326]/84 p-6 shadow-[0_16px_40px_rgba(0,0,0,0.18)] sm:p-7">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                        {phase.label}
                      </span>

                      <span
                        className={`inline-flex items-center rounded-full border px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.18em] ${
                          phase.live
                            ? 'border-emerald-400/25 bg-emerald-400/10 text-emerald-200'
                            : 'border-white/10 bg-white/[0.03] text-[#D9E3EF]'
                        }`}
                      >
                        {phase.status}
                      </span>
                    </div>

                    <h3 className="mt-5 text-2xl font-semibold tracking-[-0.04em] text-white">
                      {phase.title}
                    </h3>

                    <p className="mt-4 max-w-3xl text-sm leading-7 text-[#C8D2DF] sm:text-base">
                      {phase.body}
                    </p>

                    <ul className="mt-5 grid gap-2.5">
                      {phase.points.map((point) => (
                        <li
                          key={point}
                          className="flex items-start gap-3 text-sm leading-7 text-[#D7E0EA]"
                        >
                          <span
                            className={`mt-3 h-px w-5 shrink-0 ${
                              phase.live ? 'bg-emerald-300/70' : 'bg-[#8FA3BC]/45'
                            }`}
                          />
                          <span>{point}</span>
                        </li>
                      ))}
                    </ul>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

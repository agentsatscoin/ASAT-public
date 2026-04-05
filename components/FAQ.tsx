'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useLocale } from 'next-intl';

type FaqItem = {
  q: string;
  a: string;
};

type FaqCopy = {
  kicker: string;
  title: string;
  subtitle: string;
  items: FaqItem[];
};

const UI_COPY: Record<string, FaqCopy> = {
  en: {
    kicker: 'FAQ',
    title: 'Launch questions, answered clearly.',
    subtitle:
      'This section should answer the real questions people have when they land on ASAT right now.',
    items: [
      {
        q: 'Is ASAT live already?',
        a: 'Parts of the operator system are already working now. The registry flow, task claim flow, proof submission flow, and submitted-state persistence were validated locally.',
      },
      {
        q: 'What can I do right now?',
        a: 'You can register a wallet, access the operator board, claim tasks, and move through the proof submission flow in the current product loop.',
      },
      {
        q: 'Do I need Phantom?',
        a: 'The current wallet flow is built around Phantom browser support and callback-based session handling.',
      },
      {
        q: 'What is proof-of-task here?',
        a: 'Proof-of-task is the operating model behind ASAT. Operators complete defined work, submit proof, and build visible participation through execution.',
      },
      {
        q: 'Are rewards fully live yet?',
        a: 'The operator activity truth layer is live, but the broader public reward experience is still being refined and expanded.',
      },
      {
        q: 'Is the registry real or just a placeholder?',
        a: 'The registry flow is real. The registration success state and operator-side persistence were already validated in the browser flow.',
      },
      {
        q: 'What happens next?',
        a: 'The near-term focus is production confirmation, cleaner proof surfaces, stronger reward-state clarity, and a tighter protocol homepage experience.',
      },
    ],
  },
  fr: {
    kicker: 'FAQ',
    title: 'Les questions de lancement, répondues clairement.',
    subtitle:
      "Cette section doit répondre aux vraies questions que les gens ont quand ils arrivent sur ASAT maintenant.",
    items: [
      {
        q: 'ASAT est déjà live ?',
        a: "Certaines parties du système opérateur fonctionnent déjà. Le flux registre, le claim de tâches, la soumission de preuve et la persistance d'état ont été validés localement.",
      },
      {
        q: 'Qu’est-ce que je peux faire maintenant ?',
        a: "Tu peux enregistrer un wallet, accéder au board opérateur, claim des tâches et traverser le flux de soumission de preuve dans la boucle produit actuelle.",
      },
      {
        q: 'J’ai besoin de Phantom ?',
        a: "Le flux wallet actuel est construit autour du support Phantom et d'une gestion de session via callback.",
      },
      {
        q: 'C’est quoi le proof-of-task ici ?',
        a: "Le proof-of-task est le modèle opérationnel derrière ASAT. Les opérateurs font un travail défini, soumettent une preuve et construisent une participation visible par l'exécution.",
      },
      {
        q: 'Les récompenses sont totalement live ?',
        a: "La couche vérité de l'activité opérateur est live, mais l'expérience publique plus large des récompenses est encore en train d'être raffinée et étendue.",
      },
      {
        q: 'Le registre est réel ou juste placeholder ?',
        a: "Le flux registre est réel. L'état de succès d'inscription et la persistance côté opérateur ont déjà été validés dans le flux navigateur.",
      },
      {
        q: 'Qu’est-ce qui vient ensuite ?',
        a: "Le focus court terme est la confirmation production, des surfaces de preuve plus propres, plus de clarté sur les états de récompense et une homepage protocole plus solide.",
      },
    ],
  },
};

export default function FAQ() {
  const locale = useLocale();
  const ui = UI_COPY[locale] || UI_COPY.en;
  const isRtl = locale === 'ar';
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section
      id="faq"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="border-t border-white/10 bg-[#081326]"
    >
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 sm:py-20 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,320px)_minmax(0,1fr)] lg:gap-16">
          <div className="min-w-0">
            <div className="text-[11px] uppercase tracking-[0.28em] text-[#8FA3BC]">
              {ui.kicker}
            </div>

            <h2 className="mt-4 text-3xl font-semibold tracking-[-0.05em] text-white sm:text-5xl">
              {ui.title}
            </h2>

            <p className="mt-5 text-base leading-8 text-[#C8D2DF] sm:text-lg">
              {ui.subtitle}
            </p>
          </div>

          <div className="space-y-4">
            {ui.items.map((item, index) => {
              const open = openIndex === index;
              const indexLabel = String(index + 1).padStart(2, '0');

              return (
                <div
                  key={item.q}
                  className={`overflow-hidden rounded-[24px] border transition ${
                    open
                      ? 'border-[#11D6FF]/24 bg-[#07101F]/92'
                      : 'border-white/10 bg-[#07101F]/72'
                  }`}
                >
                  <button
                    type="button"
                    aria-expanded={open}
                    onClick={() => setOpenIndex(open ? -1 : index)}
                    className="flex w-full items-start justify-between gap-6 px-5 py-5 text-left sm:px-6"
                  >
                    <div className="min-w-0">
                      <div className="text-[11px] uppercase tracking-[0.24em] text-[#8FA3BC]">
                        {indexLabel}
                      </div>

                      <div className="mt-3 text-lg font-semibold text-[#F4F6F8] sm:text-[22px]">
                        {item.q}
                      </div>
                    </div>

                    <ChevronDown
                      size={20}
                      className={`mt-1 shrink-0 text-[#8FA3BC] transition-transform ${
                        open ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {open ? (
                    <div className="border-t border-white/10 px-5 pb-5 pt-4 text-sm leading-8 text-[#C9D3DF] sm:px-6 sm:text-base">
                      {item.a}
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

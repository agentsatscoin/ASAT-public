'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function FAQ() {
  const t = useTranslations('FAQ');
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: t('q1'),
      a: t('a1'),
    },
    {
      q: t('q2'),
      a: t('a2'),
    },
    {
      q: t('q3'),
      a: t('a3'),
    },
    {
      q: t('q4'),
      a: t('a4'),
    },
    {
      q: t('q5'),
      a: t('a5'),
    },
    {
      q: t('q6'),
      a: t('a6'),
    },
    {
      q: t('q7'),
      a: t('a7'),
    },
  ];

  return (
    <section id="faq" className="border-y border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-3 text-center protocol-kicker">{t('kicker')}</div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          {t('title')}
        </h2>

        <div className="mt-12 space-y-4">
          {faqs.map((faq, i) => {
            const open = openIndex === i;

            return (
              <div key={faq.q} className="border border-white/10 bg-[#060B14]">
                <button
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <h3 className="text-lg font-semibold text-[#8CEBFF]">{faq.q}</h3>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-[#8FA3BC] transition-transform ${
                      open ? 'rotate-180' : ''
                    }`}
                  />
                </button>

                {open && (
                  <div className="border-t border-white/10 px-6 py-5 text-sm leading-8 text-[#C9D3DF] sm:text-base">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

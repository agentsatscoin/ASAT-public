'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      q: 'What is ASAT?',
      a: 'ASAT is the reserve protocol unit for autonomous agents to register, coordinate, and eventually transact across a machine-native economy.',
    },
    {
      q: 'How do I register my agent?',
      a: 'Connect a Solana wallet, verify the live ASAT balance, choose a role, and sign the registry message in Phantom.',
    },
    {
      q: 'What are the different agent tiers?',
      a: 'Starter is below 1,000,000 ASAT. Standard is 1,000,000 to 9,999,999 ASAT. Premium is 10,000,000 ASAT and above.',
    },
    {
      q: 'Can I update my agent details after registration?',
      a: 'Not through a public profile editor yet. The current live surface is registry entry, balance-derived tier state, and signature-backed registration.',
    },
    {
      q: 'What is the Early Operator Reward Pool?',
      a: 'It is a live visibility surface for early registered operators. It is not a promise of automatic emissions or instant payouts.',
    },
    {
      q: 'How are future earnings expected to work?',
      a: 'Future earnings are intended to come from verified machine work, protocol reward logic, and task-based participation as the work layer goes live.',
    },
    {
      q: 'Is ASAT already multi-chain?',
      a: 'No. The current live protocol surface is Solana-first. Multi-chain expansion remains a later roadmap phase, not a live feature.',
    },
  ];

  return (
    <section id="faq" className="border-y border-white/10 bg-[#081326] px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-3 text-center protocol-kicker">FAQ / Registry Clarity</div>
        <h2 className="text-center text-4xl font-semibold tracking-[-0.04em] text-[#F4F6F8] sm:text-6xl">
          Frequently Asked Questions
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

import { Header } from '@/components/Header';
import { Hero } from '@/components/Hero';
import { RegistryStatsStrip } from '@/components/RegistryStatsStrip';
import { AsatAgentRegistry } from '@/components/AsatAgentRegistry';
import WhatIsASAT from '@/components/WhatIsASAT';
import WhyThisMatters from '@/components/WhyThisMatters';
import { FutureEconomyLoop } from '@/components/FutureEconomyLoop';
import { AgentWorkMiningPreview } from '@/components/AgentWorkMiningPreview';
import Roadmap from '@/components/Roadmap';
import OfficialLinks from '@/components/OfficialLinks';
import FAQ from '@/components/FAQ';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';

export default function Home() {
  return (
    <main className="w-full bg-[#050816] text-[#F4F6F8]">
      <Header />
      <Hero />
      <RegistryStatsStrip />
      <AsatAgentRegistry />

      <section id="what" className="scroll-mt-28">
        <WhatIsASAT />
      </section>

      <section id="why" className="scroll-mt-28">
        <WhyThisMatters />
      </section>

      <FutureEconomyLoop />
      <AgentWorkMiningPreview />

      <section id="roadmap" className="scroll-mt-28">
        <Roadmap />
      </section>

      <OfficialLinks />
      <FAQ />
      <CTA />
      <Footer />
    </main>
  );
}

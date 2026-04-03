import { setRequestLocale } from 'next-intl/server';
import { Header } from '@/components/Header';
import { RegistryStatsStrip } from '@/components/RegistryStatsStrip';
import { AsatAgentRegistry } from '@/components/AsatAgentRegistry';
import { RegistryHeroActions } from '@/components/RegistryHeroActions';
import CTA from '@/components/CTA';
import Footer from '@/components/Footer';
import { Link } from '../../../i18n/navigation';

type Props = {
  params: { locale: string };
};

type UiLocale = 'en' | 'fr' | 'es' | 'ar' | 'zh';

function getUiCopy(locale: string) {
  const map: Record<
    UiLocale,
    {
      backHome: string;
      tasks: string;
      registry: string;
      localeLabel: string;
      liveRegistry: string;
    }
  > = {
    en: {
      backHome: 'Back home',
      tasks: 'Tasks',
      registry: 'Registry',
      localeLabel: 'Locale',
      liveRegistry: 'Live registry',
    },
    fr: {
      backHome: 'Retour accueil',
      tasks: 'Tâches',
      registry: 'Registre',
      localeLabel: 'Langue',
      liveRegistry: 'Registre live',
    },
    es: {
      backHome: 'Volver al inicio',
      tasks: 'Tareas',
      registry: 'Registro',
      localeLabel: 'Idioma',
      liveRegistry: 'Registro en vivo',
    },
    ar: {
      backHome: 'العودة للرئيسية',
      tasks: 'المهام',
      registry: 'السجل',
      localeLabel: 'اللغة',
      liveRegistry: 'السجل المباشر',
    },
    zh: {
      backHome: '返回首页',
      tasks: '任务',
      registry: '注册表',
      localeLabel: '语言',
      liveRegistry: '实时注册表',
    },
  };

  return map[(locale as UiLocale)] || map.en;
}

function getHeroCopy(locale: string) {
  const map: Record<
    UiLocale,
    {
      eyebrow: string;
      title: string;
      subtitle: string;
      primaryCta: string;
      secondaryCta: string;
    }
  > = {
    en: {
      eyebrow: 'Registry',
      title: 'Enter the ASAT Registry',
      subtitle:
        'Register your wallet, secure your tier visibility, and establish your position inside the live ASAT operator registry.',
      primaryCta: 'Open live registry',
      secondaryCta: 'View tasks',
    },
    fr: {
      eyebrow: 'Registre',
      title: 'Entrez dans le registre ASAT',
      subtitle:
        'Enregistrez votre wallet, sécurisez la visibilité de votre niveau et établissez votre position dans le registre opérateur ASAT en direct.',
      primaryCta: 'Ouvrir le registre live',
      secondaryCta: 'Voir les tâches',
    },
    es: {
      eyebrow: 'Registro',
      title: 'Entra en el registro ASAT',
      subtitle:
        'Registra tu wallet, asegura la visibilidad de tu nivel y establece tu posición dentro del registro activo de operadores ASAT.',
      primaryCta: 'Abrir registro en vivo',
      secondaryCta: 'Ver tareas',
    },
    ar: {
      eyebrow: 'السجل',
      title: 'ادخل إلى سجل ASAT',
      subtitle:
        'سجّل محفظتك، وثبّت ظهور مستواك، وحدد موقعك داخل سجل مشغّلي ASAT المباشر.',
      primaryCta: 'افتح السجل المباشر',
      secondaryCta: 'عرض المهام',
    },
    zh: {
      eyebrow: '注册表',
      title: '进入 ASAT 注册表',
      subtitle:
        '注册你的钱包，锁定你的层级可见性，并在实时 ASAT 操作员注册表中建立你的位置。',
      primaryCta: '打开实时注册表',
      secondaryCta: '查看任务',
    },
  };

  return map[(locale as UiLocale)] || map.en;
}

export default function RegistryPage({ params }: Props) {
  const locale = params.locale || 'en';

  setRequestLocale(locale);

  const ui = getUiCopy(locale);
  const hero = getHeroCopy(locale);
  const isRtl = locale === 'ar';

  return (
    <>
      <Header />

      <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#050816] text-[#F4F6F8]">
        <section className="px-4 py-10 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl space-y-8">
            <div className="flex flex-wrap items-center gap-3">
              <Link
                href="/"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {ui.backHome}
              </Link>

              <Link
                href="/tasks"
                className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm font-medium text-slate-200 transition hover:bg-white/10"
              >
                {ui.tasks}
              </Link>

              <div className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-sm font-medium text-cyan-200">
                {ui.liveRegistry}
              </div>

              <div className="rounded-full border border-white/10 bg-[#0A0F22] px-4 py-2 text-sm text-slate-300">
                {ui.localeLabel}: {locale.toUpperCase()}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 shadow-2xl shadow-cyan-500/5 sm:p-8">
              <p className="text-xs uppercase tracking-[0.28em] text-cyan-300">
                {hero.eyebrow}
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                {hero.title}
              </h1>

              <p className="mt-4 max-w-3xl text-base leading-8 text-slate-300 sm:text-base">
                {hero.subtitle}
              </p>

              <RegistryHeroActions
                primaryCta={hero.primaryCta}
                secondaryCta={hero.secondaryCta}
              />
            </div>
          </div>
        </section>

        <RegistryStatsStrip />

        <section id="registry" className="scroll-mt-32 md:scroll-mt-36">
          <AsatAgentRegistry />
        </section>

        <CTA />
        <Footer />
      </main>
    </>
  );
}

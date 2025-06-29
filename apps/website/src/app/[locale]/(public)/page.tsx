import { getTranslations } from 'next-intl/server';

const HeroSection = async () => {
  const t = await getTranslations('LandingPage.hero');

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-transparent to-lime-500/10" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(20,184,166,0.1),transparent_50%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(132,204,22,0.1),transparent_50%)]" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-teal-100 to-lime-100 bg-clip-text text-transparent">
            {t('headline')}
          </h1>
          <p className="text-xl sm:text-2xl text-slate-300 mb-8 max-w-3xl mx-auto leading-relaxed">{t('subheadline')}</p>
          {/* <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              className="bg-teal-600 hover:bg-teal-700 text-white px-8 py-4 text-lg font-semibold group">
              {t('primaryCta')}
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="border-slate-300 text-slate-300 hover:bg-slate-800 px-8 py-4 text-lg font-semibold">
              {t('secondaryCta')}
            </Button>
          </div> */}
        </div>
      </div>
    </section>
  );
};

export default async function LandingPage() {
  return (
    <div className="min-h-screen">
      <HeroSection />
    </div>
  );
}

import { Button } from '@visionarai-one/ui';
import { Brain, Rocket, Sparkles } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('LandingPage');
  return (
    <div className="bg-white text-black font-sans">
      {/* Hero Section */}
      <section className="bg-black text-white px-6 py-24 text-center relative overflow-hidden">
        <div className="absolute -top-10 -left-10 w-80 h-80 bg-lime-400 rounded-full blur-3xl opacity-20"></div>
        <div className="absolute -bottom-10 -right-10 w-80 h-80 bg-teal-400 rounded-full blur-3xl opacity-20"></div>

        <div className="relative z-10 max-w-5xl mx-auto">
          <h1 className="text-6xl font-extrabold mb-4">{t('hero.title')}</h1>
          <p className="text-2xl text-gray-300 mb-6 italic">{t('hero.subtitle')}</p>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto mb-8">{t('hero.description')}</p>
          <Button className="text-black bg-lime-400 hover:bg-lime-300 text-lg px-8 py-4 rounded-full font-semibold shadow-md">{t('hero.cta')}</Button>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="px-6 py-24 bg-gradient-to-br from-white to-gray-50 text-center">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-4xl font-bold mb-10">{t('missionVision.title')}</h2>
          <div className="grid md:grid-cols-2 gap-10 text-left">
            <div>
              <h3 className="text-2xl font-semibold mb-3">{t('missionVision.missionTitle')}</h3>
              <p className="text-gray-700">{t('missionVision.missionText')}</p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-3">{t('missionVision.visionTitle')}</h3>
              <p className="text-gray-700">{t('missionVision.visionText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Offer */}
      <section className="px-6 py-24 bg-white text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-16">{t('offerings.title')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center">
              <Brain className="w-10 h-10 text-teal-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('offerings.consultingTitle')}</h3>
              <p className="text-gray-600 max-w-xs">{t('offerings.consultingText')}</p>
            </div>
            <div className="flex flex-col items-center">
              <Sparkles className="w-10 h-10 text-lime-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('offerings.prototypingTitle')}</h3>
              <p className="text-gray-600 max-w-xs">{t('offerings.prototypingText')}</p>
            </div>
            <div className="flex flex-col items-center">
              <Rocket className="w-10 h-10 text-teal-500 mb-4" />
              <h3 className="text-xl font-bold mb-2">{t('offerings.developmentTitle')}</h3>
              <p className="text-gray-600 max-w-xs">{t('offerings.developmentText')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-lime-400 to-teal-400 text-black text-center px-6 py-20">
        <h2 className="text-4xl font-extrabold mb-4">{t('cta.title')}</h2>
        <p className="mb-8 text-lg">{t('cta.subtitle')}</p>
        <Button className="bg-black text-white hover:bg-gray-900 text-lg px-8 py-4 rounded-full font-semibold">{t('cta.button')}</Button>
      </section>
    </div>
  );
}

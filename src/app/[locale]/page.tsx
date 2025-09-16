import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import LanguageSwitcher from '@/components/LanguageSwitcher';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-20 blur-3xl" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation */}
        <nav className="flex justify-between items-center mb-16 glass rounded-full px-8 py-4">
          <h1 className="text-2xl font-bold text-gradient">{t('navigation.brandName')}</h1>
          <div className="flex gap-4 items-center">
            <LanguageSwitcher />
            <Button variant="secondary" size="sm">{t('navigation.signIn')}</Button>
            <Button variant="primary" size="sm">{t('navigation.getStarted')}</Button>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="text-center mb-20">
          <h2 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <span className="text-white">{t('hero.title.connect')} </span>
            <span className="text-gradient">{t('hero.title.verify')} </span>
            <span className="text-white">{t('hero.title.prosper')}</span>
          </h2>
          <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto">
            {t('hero.subtitle')}
          </p>
          
          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center mb-12">
            <Button variant="primary" size="lg" className="text-lg px-8 py-4">
              {t('hero.cta.joinBusiness')}
            </Button>
            <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
              {t('hero.cta.findPartners')}
            </Button>
          </div>

          {/* Warning Banner */}
          <div className="warning-banner rounded-lg px-6 py-4 inline-block">
            <p className="text-danger font-bold text-lg tracking-wide">
              ⚠️ {t('hero.warning')}
            </p>
          </div>
        </section>

        {/* Stats Section */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <StatCard value={t('stats.businesses.value')} label={t('stats.businesses.label')} />
          <StatCard value={t('stats.procurement.value')} label={t('stats.procurement.label')} />
          <StatCard value={t('stats.verified.value')} label={t('stats.verified.label')} />
        </section>

        {/* Features Preview */}
        <section className="glass rounded-2xl p-12 text-center">
          <h3 className="text-3xl font-bold mb-6 text-gradient">
            {t('features.title')}
          </h3>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            {t('features.description')}
          </p>
        </section>
      </div>

      {/* Footer */}
      <footer className="w-full glass border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-8 py-6 text-center text-gray-400">
          <p>{t('footer.copyright')}</p>
        </div>
      </footer>
    </main>
  );
}
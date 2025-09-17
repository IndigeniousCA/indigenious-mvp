import { Button } from '@/components/ui/Button';
import { StatCard } from '@/components/ui/Card';
import { useTranslations } from 'next-intl';
import { Link } from '@/i18n/routing';
import { Navigation } from '@/components/layout/Navigation';

export default function Home() {
  const t = useTranslations();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-between overflow-hidden">
      {/* Animated Mesh Gradient Background */}
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-20 blur-3xl" />
      
      {/* Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        
        {/* Navigation */}
        <Navigation />

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
            <Link href="/auth/register">
              <Button variant="primary" size="lg" className="text-lg px-8 py-4">
                {t('hero.cta.joinBusiness')}
              </Button>
            </Link>
            <Link href="/search">
              <Button variant="secondary" size="lg" className="text-lg px-8 py-4">
                {t('hero.cta.findPartners')}
              </Button>
            </Link>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-400">
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {locale === 'fr' ? 'Conforme au gouvernement' : 'Government Compliant'}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              {locale === 'fr' ? 'Plateforme de confiance' : 'Trusted Platform'}
            </span>
            <span className="flex items-center gap-2">
              <svg className="w-5 h-5 text-success" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
              </svg>
              {locale === 'fr' ? 'Réseau en croissance' : 'Growing Network'}
            </span>
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
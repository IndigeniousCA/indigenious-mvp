'use client';

import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function NotFound() {
  const locale = useLocale() as 'en' | 'fr';

  const translations = {
    en: {
      title: 'Page Not Found',
      description: 'The page you\'re looking for doesn\'t exist or has been moved.',
      goHome: 'Go Home',
      goBack: 'Go Back',
    },
    fr: {
      title: 'Page non trouvée',
      description: 'La page que vous recherchez n\'existe pas ou a été déplacée.',
      goHome: 'Accueil',
      goBack: 'Retour',
    },
  };

  const t = translations[locale];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-10 blur-3xl" />
      
      <div className="relative z-10 max-w-md w-full text-center">
        {/* 404 Display */}
        <div className="mb-8">
          <h1 className="text-9xl font-bold text-gradient">404</h1>
          <div className="h-1 w-32 mx-auto bg-gradient-primary rounded-full mt-4"></div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-4">{t.title}</h2>
        <p className="text-gray-400 mb-8">{t.description}</p>

        <div className="flex gap-4 justify-center">
          <Link href={`/${locale}`}>
            <Button
              variant="primary"
              size="md"
            >
              {t.goHome}
            </Button>
          </Link>
          
          <Button
            onClick={() => window.history.back()}
            variant="secondary"
            size="md"
          >
            {t.goBack}
          </Button>
        </div>
      </div>
    </div>
  );
}
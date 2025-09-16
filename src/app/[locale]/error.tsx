'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import Link from 'next/link';
import { useLocale } from 'next-intl';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const locale = useLocale() as 'en' | 'fr';

  useEffect(() => {
    console.error(error);
  }, [error]);

  const translations = {
    en: {
      title: 'Something went wrong',
      description: 'We encountered an unexpected error. Please try again or contact support if the problem persists.',
      tryAgain: 'Try Again',
      goHome: 'Go Home',
      errorCode: 'Error Code',
    },
    fr: {
      title: 'Une erreur est survenue',
      description: 'Nous avons rencontré une erreur inattendue. Veuillez réessayer ou contacter le support si le problème persiste.',
      tryAgain: 'Réessayer',
      goHome: 'Accueil',
      errorCode: 'Code d\'erreur',
    },
  };

  const t = translations[locale];

  return (
    <div className="min-h-screen flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-10 blur-3xl" />
      
      <div className="relative z-10 max-w-md w-full text-center">
        {/* Error Icon */}
        <div className="mx-auto w-20 h-20 mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
          <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>

        <h1 className="text-3xl font-bold text-white mb-4">{t.title}</h1>
        <p className="text-gray-400 mb-8">{t.description}</p>

        {error.digest && (
          <p className="text-sm text-gray-500 mb-6">
            {t.errorCode}: {error.digest}
          </p>
        )}

        <div className="flex gap-4 justify-center">
          <Button
            onClick={reset}
            variant="primary"
            size="md"
          >
            {t.tryAgain}
          </Button>
          
          <Link href={`/${locale}`}>
            <Button
              variant="secondary"
              size="md"
            >
              {t.goHome}
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
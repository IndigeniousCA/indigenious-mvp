'use client';

import { useState, useEffect } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { PricingCard } from '@/components/pricing/PricingCard';
import { 
  pricingPlans, 
  getPricingTranslations, 
  getLocalizedPlan,
  BillingPeriod,
  PricingTier 
} from '@/lib/pricing';
import { getStripe } from '@/lib/stripe';
import { PricingCardSkeleton } from '@/components/ui/Skeleton';
import { useToast } from '@/components/ui/ToastContainer';

export default function PricingPage() {
  const locale = useLocale() as 'en' | 'fr';
  const router = useRouter();
  const { showToast } = useToast();
  const translations = getPricingTranslations(locale);
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('yearly');
  const [isLoading, setIsLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPageLoading, setIsPageLoading] = useState(true);

  // Simulate initial loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsPageLoading(false);
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleSelectPlan = async (planId: string) => {
    setIsLoading(planId);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tier: planId,
          billingPeriod,
          locale,
          // These would come from auth context in real implementation
          userId: undefined,
          businessId: undefined,
          email: undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create checkout session');
      }

      const { sessionId, url } = await response.json();

      if (url) {
        // Redirect to Stripe Checkout
        window.location.href = url;
      } else {
        // Fallback to client-side redirect
        const stripe = await getStripe();
        if (!stripe) {
          throw new Error('Stripe failed to load');
        }
        
        const { error } = await stripe.redirectToCheckout({ sessionId });
        if (error) {
          throw error;
        }
      }
    } catch (err) {
      console.error('Checkout error:', err);
      const errorMessage = locale === 'fr' 
        ? 'Une erreur est survenue. Veuillez réessayer.' 
        : 'An error occurred. Please try again.';
      setError(errorMessage);
      showToast(errorMessage, 'error');
      setIsLoading(null);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-mesh-gradient animate-mesh opacity-20 blur-3xl" />
      
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-12 safe-bottom">
        {/* Mobile-optimized Navigation */}
        <nav className="flex justify-between items-center mb-8 sm:mb-16 glass rounded-full px-4 sm:px-8 py-3 sm:py-4">
          <Link href={`/${locale}`}>
            <h1 className="text-xl sm:text-2xl font-bold text-gradient cursor-pointer">Indigenious</h1>
          </Link>
          <div className="flex gap-2 sm:gap-4">
            <Link href={`/${locale}/auth/login`} className="hidden sm:block">
              <button className="px-4 py-2 text-white hover:text-primary-start transition-colors">
                {locale === 'fr' ? 'Connexion' : 'Sign In'}
              </button>
            </Link>
            <Link href={`/${locale}/auth/register`}>
              <button className="px-4 sm:px-6 py-2 bg-gradient-primary text-white rounded-lg hover:opacity-90 transition-opacity text-sm sm:text-base">
                {locale === 'fr' ? 'Commencer' : 'Get Started'}
              </button>
            </Link>
          </div>
        </nav>

        {/* Header */}
        <div className="text-center mb-8 sm:mb-16">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4">
            {translations.title}
          </h1>
          <p className="text-lg sm:text-xl text-gray-300 max-w-2xl mx-auto px-4">
            {translations.subtitle}
          </p>
        </div>

        {/* Billing Toggle */}
        <div className="flex justify-center mb-8 sm:mb-12">
          <div className="glass rounded-full p-1 flex">
            <button
              onClick={() => setBillingPeriod('monthly')}
              className={`
                px-4 sm:px-6 py-3 rounded-full font-medium transition-all text-sm sm:text-base
                touch-target
                ${billingPeriod === 'monthly' 
                  ? 'bg-gradient-primary text-white' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              {translations.monthly}
            </button>
            <button
              onClick={() => setBillingPeriod('yearly')}
              className={`
                px-4 sm:px-6 py-3 rounded-full font-medium transition-all text-sm sm:text-base
                touch-target
                ${billingPeriod === 'yearly' 
                  ? 'bg-gradient-primary text-white' 
                  : 'text-gray-300 hover:text-white'
                }
              `}
            >
              {translations.yearly}
            </button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="max-w-md mx-auto mb-8 p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-center">
            {error}
          </div>
        )}

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-12 sm:mb-20">
          {isPageLoading ? (
            <>
              <PricingCardSkeleton />
              <PricingCardSkeleton />
              <PricingCardSkeleton />
            </>
          ) : (
            (['partner', 'growth', 'corporate'] as PricingTier[]).map((tier) => {
              const plan = getLocalizedPlan(pricingPlans[tier], locale);
              return (
                <PricingCard
                  key={tier}
                  plan={plan}
                  billingPeriod={billingPeriod}
                  locale={locale}
                  translations={translations}
                  onSelectPlan={handleSelectPlan}
                  isLoading={isLoading === tier}
                />
              );
            })
          )}
        </div>

        {/* Features Comparison */}
        <section className="glass rounded-2xl p-6 sm:p-12 text-center">
          <h2 className="text-2xl sm:text-3xl font-bold mb-4 sm:mb-6 text-gradient">
            {locale === 'fr' 
              ? 'Une plateforme conçue pour votre croissance' 
              : 'A platform built for your growth'
            }
          </h2>
          <p className="text-gray-300 text-base sm:text-lg max-w-3xl mx-auto mb-6 sm:mb-8 px-4">
            {locale === 'fr'
              ? 'Peu importe la taille de votre entreprise, nous avons un plan qui correspond à vos besoins. Commencez petit et évoluez au fur et à mesure que votre entreprise grandit.'
              : 'No matter the size of your business, we have a plan that fits your needs. Start small and scale as your business grows.'
            }
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mt-8">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === 'fr' ? 'Vérifié et Sécurisé' : 'Verified & Secure'}
              </h3>
              <p className="text-gray-400 text-sm">
                {locale === 'fr' 
                  ? 'Toutes les entreprises sont vérifiées pour garantir l\'authenticité'
                  : 'All businesses verified to ensure authenticity'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === 'fr' ? 'Croissance Rapide' : 'Fast Growth'}
              </h3>
              <p className="text-gray-400 text-sm">
                {locale === 'fr' 
                  ? 'Connectez-vous instantanément avec des partenaires vérifiés'
                  : 'Connect instantly with verified partners'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">
                {locale === 'fr' ? 'Support Dédié' : 'Dedicated Support'}
              </h3>
              <p className="text-gray-400 text-sm">
                {locale === 'fr' 
                  ? 'Obtenez de l\'aide quand vous en avez besoin'
                  : 'Get help when you need it'
                }
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* Mobile-optimized Footer */}
      <footer className="w-full glass border-t border-white/10 mt-auto">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 py-4 sm:py-6 text-center text-gray-400">
          <p className="text-sm sm:text-base">&copy; 2024 Indigenious. {locale === 'fr' ? 'Bâtir des ponts, honorer l\'héritage.' : 'Building bridges, honoring heritage.'}</p>
        </div>
      </footer>
    </main>
  );
}
'use client';

import { useState } from 'react';
import { useLocale } from 'next-intl';
import { useToast } from '@/components/ui/ToastContainer';
import { Button } from '@/components/ui/Button';

interface StripeCheckoutProps {
  userType: 'indigenous_business' | 'canadian_business';
  priceId?: string;
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function StripeCheckout({ 
  userType, 
  priceId = process.env.NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN,
  onSuccess,
  onCancel 
}: StripeCheckoutProps) {
  const locale = useLocale();
  const { showToast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          priceId,
          userType,
          successUrl: `${window.location.origin}/${locale}/dashboard?setup=complete`,
          cancelUrl: `${window.location.origin}/${locale}/auth/register?payment=cancelled`
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      }
    } catch (error) {
      console.error('Checkout error:', error);
      showToast(
        locale === 'fr' 
          ? 'Erreur lors de la création de la session de paiement' 
          : 'Error creating payment session',
        'error'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const translations = {
    title: locale === 'fr' ? 'Configuration du paiement' : 'Payment Setup',
    description: locale === 'fr' 
      ? 'Les entreprises canadiennes doivent configurer un mode de paiement pour accéder à la plateforme.'
      : 'Canadian businesses must set up a payment method to access the platform.',
    ctaText: locale === 'fr' ? 'Configurer le paiement' : 'Set up payment',
    cancelText: locale === 'fr' ? 'Annuler' : 'Cancel',
    secureText: locale === 'fr' 
      ? '🔒 Paiement sécurisé par Stripe'
      : '🔒 Secure payment powered by Stripe',
    noteText: locale === 'fr'
      ? 'Aucun frais ne sera facturé maintenant. Carte requise pour la vérification uniquement.'
      : 'No charges will be made now. Card required for verification only.'
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">{translations.title}</h3>
        <p className="text-gray-400">{translations.description}</p>
      </div>
      
      <div className="bg-warning/10 border border-warning/30 rounded-lg p-4">
        <p className="text-sm text-warning">
          💳 {translations.noteText}
        </p>
      </div>
      
      <div className="space-y-3">
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full"
          size="lg"
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {locale === 'fr' ? 'Chargement...' : 'Loading...'}
            </span>
          ) : translations.ctaText}
        </Button>
        
        <Button
          onClick={onCancel}
          variant="secondary"
          className="w-full"
          disabled={isLoading}
        >
          {translations.cancelText}
        </Button>
      </div>
      
      <p className="text-center text-xs text-gray-500">
        {translations.secureText}
      </p>
    </div>
  );
}
export type PricingTier = 'partner' | 'growth' | 'corporate';
export type BillingPeriod = 'monthly' | 'yearly';

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface PricingPlan {
  id: PricingTier;
  name: string;
  description: string;
  monthlyPrice: number;
  yearlyPrice: number;
  yearlySavings: number;
  features: {
    searches: string;
    rfqs: string;
    partnerships: string;
    additional: string[];
  };
  badge?: string;
  badgeType?: 'popular' | 'special';
  highlighted?: boolean;
}

export const pricingPlans: Record<PricingTier, PricingPlan> = {
  partner: {
    id: 'partner',
    name: 'Partner',
    description: 'Perfect for small businesses starting their journey',
    monthlyPrice: 149,
    yearlyPrice: 1488,
    yearlySavings: 300,
    features: {
      searches: '100',
      rfqs: '10',
      partnerships: '20',
      additional: [
        'Basic analytics',
        'Email support',
        'Business verification badge',
        'Profile customization'
      ]
    }
  },
  growth: {
    id: 'growth',
    name: 'Growth',
    description: 'Scale your business with advanced features',
    monthlyPrice: 399,
    yearlyPrice: 2990,
    yearlySavings: 1798,
    features: {
      searches: '500',
      rfqs: '50',
      partnerships: '100',
      additional: [
        'Advanced analytics',
        'Priority support',
        'Carbon footprint tracking',
        'Featured listings',
        'Custom branding',
        'Export reports'
      ]
    },
    badge: 'Most Popular',
    badgeType: 'popular',
    highlighted: true
  },
  corporate: {
    id: 'corporate',
    name: 'Corporate',
    description: 'Enterprise-grade features for large organizations',
    monthlyPrice: 1249,
    yearlyPrice: 11988,
    yearlySavings: 3000,
    features: {
      searches: 'Unlimited',
      rfqs: 'Unlimited',
      partnerships: 'Unlimited',
      additional: [
        'Everything in Growth',
        'API access',
        'Dedicated account manager',
        'Custom integrations',
        'White-label options',
        'SLA guarantee',
        'Advanced security features'
      ]
    }
  }
};

export const formatPrice = (price: number, locale: 'en' | 'fr'): string => {
  if (locale === 'fr') {
    return `${price.toLocaleString('fr-CA')}$`;
  }
  return `$${price.toLocaleString('en-CA')}`;
};

export const getPricingTranslations = (locale: 'en' | 'fr') => {
  const translations = {
    en: {
      title: 'Simple, Transparent Pricing',
      subtitle: 'Choose the plan that grows with your business',
      monthly: 'Monthly',
      yearly: 'Yearly',
      month: '/month',
      year: '/year',
      save: 'Save',
      launchSpecial: 'LAUNCH SPECIAL',
      mostPopular: 'Most Popular',
      getStarted: 'Get Started',
      currentPlan: 'Current Plan',
      features: {
        searches: 'Monthly searches',
        rfqs: 'RFQ submissions',
        partnerships: 'Active partnerships',
        included: 'Everything in Partner',
        carbonTracking: 'Carbon footprint tracking'
      },
      partner: {
        name: 'Partner',
        description: 'Perfect for small businesses starting their journey'
      },
      growth: {
        name: 'Growth',
        description: 'Scale your business with advanced features'
      },
      corporate: {
        name: 'Corporate',
        description: 'Enterprise-grade features for large organizations'
      }
    },
    fr: {
      title: 'Tarification simple et transparente',
      subtitle: 'Choisissez le plan qui grandit avec votre entreprise',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      month: '/mois',
      year: '/an',
      save: 'Économisez',
      launchSpecial: 'SPÉCIAL LANCEMENT',
      mostPopular: 'Le plus populaire',
      getStarted: 'Commencer',
      currentPlan: 'Plan actuel',
      features: {
        searches: 'Recherches mensuelles',
        rfqs: 'Soumissions RFQ',
        partnerships: 'Partenariats actifs',
        included: 'Tout dans Partenaire',
        carbonTracking: 'Suivi de l\'empreinte carbone'
      },
      partner: {
        name: 'Partenaire',
        description: 'Parfait pour les petites entreprises qui commencent leur parcours'
      },
      growth: {
        name: 'Croissance',
        description: 'Développez votre entreprise avec des fonctionnalités avancées'
      },
      corporate: {
        name: 'Entreprise',
        description: 'Fonctionnalités de niveau entreprise pour les grandes organisations'
      }
    }
  };

  return translations[locale];
};

export const getLocalizedPlan = (plan: PricingPlan, locale: 'en' | 'fr'): PricingPlan => {
  const translations = getPricingTranslations(locale);
  const tierTranslations = translations[plan.id as keyof typeof translations];
  
  return {
    ...plan,
    name: typeof tierTranslations === 'object' && 'name' in tierTranslations 
      ? tierTranslations.name 
      : plan.name,
    description: typeof tierTranslations === 'object' && 'description' in tierTranslations 
      ? tierTranslations.description 
      : plan.description,
    badge: plan.badge && plan.badgeType === 'popular' 
      ? translations.mostPopular 
      : plan.badge
  };
};
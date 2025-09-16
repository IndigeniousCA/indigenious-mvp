import React from 'react';
import { Button } from '@/components/ui/Button';
import { PricingPlan, BillingPeriod, formatPrice } from '@/lib/pricing';

interface PricingCardProps {
  plan: PricingPlan;
  billingPeriod: BillingPeriod;
  locale: 'en' | 'fr';
  translations: any;
  isCurrentPlan?: boolean;
  isLoading?: boolean;
  onSelectPlan: (planId: string) => void;
}

export const PricingCard: React.FC<PricingCardProps> = ({
  plan,
  billingPeriod,
  locale,
  translations,
  isCurrentPlan = false,
  isLoading = false,
  onSelectPlan
}) => {
  const isYearly = billingPeriod === 'yearly';
  const price = isYearly ? plan.yearlyPrice : plan.monthlyPrice;
  const formattedPrice = formatPrice(price, locale);
  const period = isYearly ? translations.year : translations.month;
  
  // Calculate monthly price for yearly plans
  const monthlyEquivalent = isYearly ? Math.round(plan.yearlyPrice / 12) : plan.monthlyPrice;
  const formattedMonthlyEquivalent = formatPrice(monthlyEquivalent, locale);

  return (
    <div
      className={`
        relative
        ${plan.highlighted ? 'scale-105' : ''}
        transition-all duration-300
      `}
    >
      {/* Badge */}
      {plan.badge && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
          <div className={`
            px-4 py-1 rounded-full text-sm font-bold
            ${plan.badgeType === 'popular' 
              ? 'bg-gradient-primary text-white' 
              : 'bg-success text-dark-start'
            }
          `}>
            {plan.badge}
          </div>
        </div>
      )}

      {/* Special Badge for Growth Yearly */}
      {plan.id === 'growth' && isYearly && (
        <div className="absolute -top-4 right-4 z-10">
          <div className="px-3 py-1 rounded-full text-xs font-bold bg-success text-dark-start animate-pulse">
            {translations.launchSpecial}
          </div>
        </div>
      )}

      <div className={`
        stat-card
        rounded-2xl
        p-6 sm:p-8
        h-full
        flex flex-col
        ${plan.highlighted ? 'border-primary-start' : ''}
      `}>
        {/* Header */}
        <div className="text-center mb-4 sm:mb-6">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{plan.name}</h3>
          <p className="text-gray-400 text-sm">{plan.description}</p>
        </div>

        {/* Price */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-baseline justify-center gap-1">
            <span className="text-3xl sm:text-5xl font-bold text-gradient">{formattedPrice}</span>
            <span className="text-gray-400 text-sm sm:text-base">{period}</span>
          </div>
          
          {isYearly && (
            <div className="mt-2">
              <p className="text-sm text-gray-400">
                {locale === 'fr' ? 'Équivaut à ' : 'Equals '} 
                <span className="text-white font-medium">{formattedMonthlyEquivalent}{translations.month}</span>
              </p>
              <p className="text-sm text-success font-medium">
                {translations.save} {formatPrice(plan.yearlySavings, locale)}
              </p>
            </div>
          )}
        </div>

        {/* Main Features */}
        <div className="space-y-3 sm:space-y-4 mb-6 sm:mb-8">
          <FeatureItem 
            label={translations.features.searches}
            value={plan.features.searches}
          />
          <FeatureItem 
            label={translations.features.rfqs}
            value={plan.features.rfqs}
          />
          <FeatureItem 
            label={translations.features.partnerships}
            value={plan.features.partnerships}
          />
        </div>

        {/* Additional Features */}
        <div className="space-y-2 sm:space-y-3 mb-6 sm:mb-8 flex-grow">
          {plan.features.additional.map((feature, index) => (
            <div key={index} className="flex items-start gap-3">
              <svg 
                className="w-5 h-5 text-success mt-0.5 flex-shrink-0" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
              <span className="text-sm text-gray-300">
                {feature}
              </span>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <Button
          variant={plan.highlighted ? 'primary' : 'secondary'}
          size="lg"
          className="w-full"
          onClick={() => onSelectPlan(plan.id)}
          disabled={isCurrentPlan || isLoading}
        >
          {isLoading 
            ? (locale === 'fr' ? 'Chargement...' : 'Loading...')
            : isCurrentPlan 
              ? translations.currentPlan 
              : translations.getStarted
          }
        </Button>
      </div>
    </div>
  );
};

interface FeatureItemProps {
  label: string;
  value: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ label, value }) => {
  return (
    <div className="flex items-center justify-between py-2 sm:py-3 border-b border-white/10">
      <span className="text-gray-400 text-sm sm:text-base">{label}</span>
      <span className="text-white font-semibold text-sm sm:text-base">{value}</span>
    </div>
  );
};
import Stripe from 'stripe';
import { loadStripe } from '@stripe/stripe-js';

// Server-side Stripe instance
export const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null as any;

// Client-side Stripe instance
export const getStripe = () => {
  return loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
};

// Price IDs for different subscription tiers
export const STRIPE_PRICE_IDS = {
  partner_monthly: process.env.STRIPE_PRICE_PARTNER_MONTHLY || 'price_partner_monthly',
  partner_yearly: process.env.STRIPE_PRICE_PARTNER_YEARLY || 'price_partner_yearly',
  growth_monthly: process.env.STRIPE_PRICE_GROWTH_MONTHLY || 'price_growth_monthly',
  growth_yearly: process.env.STRIPE_PRICE_GROWTH_YEARLY || 'price_growth_yearly',
  corporate_monthly: process.env.STRIPE_PRICE_CORPORATE_MONTHLY || 'price_corporate_monthly',
  corporate_yearly: process.env.STRIPE_PRICE_CORPORATE_YEARLY || 'price_corporate_yearly',
} as const;

export type StripePriceId = keyof typeof STRIPE_PRICE_IDS;

// Get price ID based on tier and billing period
export const getPriceId = (tier: string, billingPeriod: 'monthly' | 'yearly'): string => {
  const key = `${tier}_${billingPeriod}` as StripePriceId;
  return STRIPE_PRICE_IDS[key];
};

// Stripe webhook events we handle
export const WEBHOOK_EVENTS = {
  CHECKOUT_COMPLETED: 'checkout.session.completed',
  PAYMENT_FAILED: 'invoice.payment_failed',
  SUBSCRIPTION_UPDATED: 'customer.subscription.updated',
  SUBSCRIPTION_DELETED: 'customer.subscription.deleted',
} as const;

// Helper to create checkout session metadata
export interface CheckoutMetadata {
  userId?: string;
  businessId?: string;
  tier: string;
  billingPeriod: 'monthly' | 'yearly';
  locale: 'en' | 'fr';
}

// Validate webhook signature
export const validateWebhookSignature = (
  payload: string | Buffer,
  signature: string,
  secret: string
): Stripe.Event => {
  return stripe.webhooks.constructEvent(payload, signature, secret);
};

// Format amount for Stripe (convert dollars to cents)
export const formatAmountForStripe = (amount: number): number => {
  return Math.round(amount * 100);
};

// Format amount from Stripe (convert cents to dollars)
export const formatAmountFromStripe = (amount: number): number => {
  return amount / 100;
};

// Create product data for checkout
export const createProductData = (tier: string, locale: 'en' | 'fr') => {
  const names = {
    partner: locale === 'fr' ? 'Plan Partenaire' : 'Partner Plan',
    growth: locale === 'fr' ? 'Plan Croissance' : 'Growth Plan',
    corporate: locale === 'fr' ? 'Plan Entreprise' : 'Corporate Plan',
  };

  const descriptions = {
    partner: locale === 'fr' 
      ? 'Parfait pour les petites entreprises' 
      : 'Perfect for small businesses',
    growth: locale === 'fr' 
      ? 'Développez votre entreprise avec des fonctionnalités avancées' 
      : 'Scale your business with advanced features',
    corporate: locale === 'fr' 
      ? 'Solutions de niveau entreprise' 
      : 'Enterprise-grade solutions',
  };

  return {
    name: names[tier as keyof typeof names] || tier,
    description: descriptions[tier as keyof typeof descriptions] || '',
  };
};
import { createClient } from '@supabase/supabase-js';

// Database types
export type SubscriptionTier = 'partner' | 'growth' | 'corporate';
export type UserRole = 'admin' | 'business_owner' | 'employee' | 'partner';
export type PartnershipStatus = 'pending' | 'active' | 'declined' | 'terminated';
export type VerificationStatus = 'pending' | 'in_review' | 'verified' | 'rejected';

export interface User {
  id: string;
  email: string;
  full_name: string;
  locale: 'en' | 'fr';
  role: UserRole;
  email_verified: boolean;
  email_verified_at?: string;
  phone?: string;
  phone_verified: boolean;
  created_at: string;
  updated_at: string;
  last_sign_in_at?: string;
  metadata?: Record<string, any>;
}

export interface Business {
  id: string;
  owner_id: string;
  business_name: string;
  legal_name: string;
  business_number?: string;
  indigenous_ownership_percentage: number;
  description?: string;
  website?: string;
  phone?: string;
  email?: string;
  
  // Address
  address_line1?: string;
  address_line2?: string;
  city?: string;
  province_state?: string;
  postal_code?: string;
  country: string;
  
  // Business details
  year_established?: number;
  number_of_employees?: number;
  annual_revenue_range?: string;
  industry_sectors?: string[];
  certifications?: string[];
  
  // Platform features
  open_to_partnership: boolean;
  verification_status: VerificationStatus;
  verified_at?: string;
  verification_documents?: any[];
  
  // Ban management
  is_banned: boolean;
  banned_until?: string;
  ban_reason?: string;
  banned_by?: string;
  banned_at?: string;
  
  // SEO and visibility
  slug: string;
  featured: boolean;
  
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Partnership {
  id: string;
  requester_business_id: string;
  requested_business_id: string;
  status: PartnershipStatus;
  message?: string;
  
  // Partnership details
  partnership_type?: string;
  expected_value?: number;
  start_date?: string;
  end_date?: string;
  
  // Status tracking
  requested_at: string;
  responded_at?: string;
  terminated_at?: string;
  termination_reason?: string;
  
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

export interface Subscription {
  id: string;
  business_id: string;
  tier: SubscriptionTier;
  status: 'active' | 'cancelled' | 'past_due' | 'trialing';
  
  // Pricing (in cents)
  monthly_price_cents: number;
  yearly_price_cents: number;
  is_yearly: boolean;
  
  // Stripe integration
  stripe_subscription_id?: string;
  stripe_customer_id?: string;
  stripe_price_id?: string;
  
  // Subscription lifecycle
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  cancelled_at?: string;
  trial_start?: string;
  trial_end?: string;
  
  // Features
  features: {
    max_partnerships?: number | 'unlimited';
    verified_badge?: boolean;
    priority_support?: boolean;
    featured_listing?: boolean;
    api_access?: boolean;
    custom_branding?: boolean;
  };
  
  created_at: string;
  updated_at: string;
  metadata?: Record<string, any>;
}

// Supabase client configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Create a dummy client for build time
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
  : null as any;

// Helper functions for common queries
export const supabaseHelpers = {
  // Get user by ID
  async getUser(userId: string) {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single();
    
    return { data, error };
  },

  // Get business by slug
  async getBusinessBySlug(slug: string) {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('slug', slug)
      .eq('is_banned', false)
      .single();
    
    return { data, error };
  },

  // Get verified businesses
  async getVerifiedBusinesses() {
    const { data, error } = await supabase
      .from('businesses')
      .select('*')
      .eq('verification_status', 'verified')
      .eq('is_banned', false)
      .eq('open_to_partnership', true)
      .order('created_at', { ascending: false });
    
    return { data, error };
  },

  // Get partnerships for a business
  async getBusinessPartnerships(businessId: string) {
    const { data, error } = await supabase
      .from('partnerships')
      .select('*')
      .or(`requester_business_id.eq.${businessId},requested_business_id.eq.${businessId}`)
      .eq('status', 'active');
    
    return { data, error };
  },

  // Get subscription for a business
  async getBusinessSubscription(businessId: string) {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('business_id', businessId)
      .eq('status', 'active')
      .single();
    
    return { data, error };
  },

  // Ban a business (lifetime ban)
  async banBusiness(businessId: string, reason: string, bannedBy: string) {
    const { data, error } = await supabase
      .from('businesses')
      .update({
        is_banned: true,
        banned_until: '2099-12-31',
        ban_reason: reason,
        banned_by: bannedBy,
        banned_at: new Date().toISOString()
      })
      .eq('id', businessId);
    
    return { data, error };
  }
};
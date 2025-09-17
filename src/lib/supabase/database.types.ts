export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          phone: string | null
          locale: string
          user_type: 'indigenous_business' | 'canadian_business' | 'government_verifier' | 'admin'
          stripe_customer_id: string | null
          payment_method_required: boolean
          subscription_tier: 'free' | 'growth' | 'professional' | 'enterprise'
          subscription_expires_at: string | null
          account_status: 'active' | 'suspended' | 'banned' | 'pending_verification'
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          phone?: string | null
          locale?: string
          user_type: 'indigenous_business' | 'canadian_business' | 'government_verifier' | 'admin'
          stripe_customer_id?: string | null
          payment_method_required?: boolean
          subscription_tier?: 'free' | 'growth' | 'professional' | 'enterprise'
          subscription_expires_at?: string | null
          account_status?: 'active' | 'suspended' | 'banned' | 'pending_verification'
          created_at?: string
          updated_at?: string
        }
        Update: {
          email?: string
          phone?: string | null
          locale?: string
          user_type?: 'indigenous_business' | 'canadian_business' | 'government_verifier' | 'admin'
          stripe_customer_id?: string | null
          payment_method_required?: boolean
          subscription_tier?: 'free' | 'growth' | 'professional' | 'enterprise'
          subscription_expires_at?: string | null
          account_status?: 'active' | 'suspended' | 'banned' | 'pending_verification'
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_number: string | null
          indigenous_owned: boolean
          indigenous_ownership_percentage: number | null
          open_to_partnership: boolean
          description: string | null
          website: string | null
          industry_codes: string[] | null
          province: string | null
          city: string | null
          postal_code: string | null
          verification_status: 'unverified' | 'self_declared' | 'verified' | 'rejected'
          self_declared_at: string | null
          verified_at: string | null
          verification_documents: Json | null
          banned_until: string | null
          ban_reason: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_number?: string | null
          indigenous_owned?: boolean
          indigenous_ownership_percentage?: number | null
          open_to_partnership?: boolean
          description?: string | null
          website?: string | null
          industry_codes?: string[] | null
          province?: string | null
          city?: string | null
          postal_code?: string | null
          verification_status?: 'unverified' | 'self_declared' | 'verified' | 'rejected'
          self_declared_at?: string | null
          verified_at?: string | null
          verification_documents?: Json | null
          banned_until?: string | null
          ban_reason?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          business_name?: string
          business_number?: string | null
          indigenous_owned?: boolean
          indigenous_ownership_percentage?: number | null
          open_to_partnership?: boolean
          description?: string | null
          website?: string | null
          industry_codes?: string[] | null
          province?: string | null
          city?: string | null
          postal_code?: string | null
          verification_status?: 'unverified' | 'self_declared' | 'verified' | 'rejected'
          self_declared_at?: string | null
          verified_at?: string | null
          verification_documents?: Json | null
          banned_until?: string | null
          ban_reason?: string | null
          updated_at?: string
        }
      }
      verification_codes: {
        Row: {
          id: string
          user_id: string
          code: string
          type: 'email' | 'sms'
          used: boolean
          expires_at: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          code: string
          type: 'email' | 'sms'
          used?: boolean
          expires_at: string
          created_at?: string
        }
        Update: {
          used?: boolean
        }
      }
    }
  }
}
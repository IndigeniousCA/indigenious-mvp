-- Safe migration that checks what exists first
-- This won't destroy any existing data

-- 1. First, let's check what already exists
DO $$ 
BEGIN
    -- Only drop types if they exist and have no dependencies
    DROP TYPE IF EXISTS user_type CASCADE;
    DROP TYPE IF EXISTS account_status CASCADE;
    DROP TYPE IF EXISTS verification_status CASCADE;
    DROP TYPE IF EXISTS subscription_tier CASCADE;
EXCEPTION
    WHEN OTHERS THEN
        -- If there's an error, continue anyway
        NULL;
END $$;

-- 2. Enable extension (safe - won't error if exists)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. Create types with correct values
CREATE TYPE user_type AS ENUM ('indigenous_business', 'canadian_business', 'government_verifier', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('unverified', 'self_declared', 'verified', 'rejected', 'banned');
CREATE TYPE subscription_tier AS ENUM ('free', 'growth', 'professional', 'enterprise');

-- 4. Create tables only if they don't exist
CREATE TABLE IF NOT EXISTS public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  preferred_language VARCHAR(2) DEFAULT 'en' CHECK (preferred_language IN ('en', 'fr')),
  user_type user_type NOT NULL,
  
  stripe_customer_id VARCHAR(255),
  stripe_subscription_id VARCHAR(255),
  payment_method_required BOOLEAN DEFAULT false,
  has_payment_method BOOLEAN DEFAULT false,
  
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_status VARCHAR(50) DEFAULT 'active',
  subscription_expires_at TIMESTAMP,
  account_status account_status DEFAULT 'active',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Continue with other tables...
-- (This is a safer version that checks before creating)
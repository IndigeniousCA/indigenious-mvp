-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types
CREATE TYPE subscription_tier AS ENUM ('partner', 'growth', 'corporate');
CREATE TYPE user_role AS ENUM ('admin', 'business_owner', 'employee', 'partner');
CREATE TYPE partnership_status AS ENUM ('pending', 'active', 'declined', 'terminated');
CREATE TYPE verification_status AS ENUM ('pending', 'in_review', 'verified', 'rejected');

-- Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  encrypted_password VARCHAR(255) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  locale VARCHAR(2) DEFAULT 'en' CHECK (locale IN ('en', 'fr')),
  role user_role DEFAULT 'business_owner',
  email_verified BOOLEAN DEFAULT FALSE,
  email_verified_at TIMESTAMP WITH TIME ZONE,
  phone VARCHAR(50),
  phone_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  last_sign_in_at TIMESTAMP WITH TIME ZONE,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Businesses table
CREATE TABLE businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  legal_name VARCHAR(255) NOT NULL,
  business_number VARCHAR(100) UNIQUE,
  indigenous_ownership_percentage DECIMAL(5,2) NOT NULL CHECK (indigenous_ownership_percentage >= 0 AND indigenous_ownership_percentage <= 100),
  description TEXT,
  website VARCHAR(255),
  phone VARCHAR(50),
  email VARCHAR(255),
  
  -- Address fields
  address_line1 VARCHAR(255),
  address_line2 VARCHAR(255),
  city VARCHAR(100),
  province_state VARCHAR(100),
  postal_code VARCHAR(20),
  country VARCHAR(2) DEFAULT 'CA',
  
  -- Business details
  year_established INTEGER,
  number_of_employees INTEGER,
  annual_revenue_range VARCHAR(50),
  industry_sectors TEXT[],
  certifications TEXT[],
  
  -- Platform features
  open_to_partnership BOOLEAN DEFAULT true,
  verification_status verification_status DEFAULT 'pending',
  verified_at TIMESTAMP WITH TIME ZONE,
  verification_documents JSONB DEFAULT '[]'::jsonb,
  
  -- Ban management
  is_banned BOOLEAN DEFAULT FALSE,
  banned_until DATE,
  ban_reason TEXT,
  banned_by UUID REFERENCES users(id),
  banned_at TIMESTAMP WITH TIME ZONE,
  
  -- SEO and visibility
  slug VARCHAR(255) UNIQUE NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  search_vector tsvector,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Create index for full-text search
CREATE INDEX businesses_search_idx ON businesses USING GIN(search_vector);

-- Partnerships table
CREATE TABLE partnerships (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  requester_business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  requested_business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  status partnership_status DEFAULT 'pending',
  message TEXT,
  
  -- Partnership details
  partnership_type VARCHAR(50),
  expected_value DECIMAL(12,2),
  start_date DATE,
  end_date DATE,
  
  -- Status tracking
  requested_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP WITH TIME ZONE,
  terminated_at TIMESTAMP WITH TIME ZONE,
  termination_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb,
  
  CONSTRAINT different_businesses CHECK (requester_business_id != requested_business_id),
  CONSTRAINT unique_partnership UNIQUE (requester_business_id, requested_business_id)
);

-- Subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,
  tier subscription_tier NOT NULL,
  status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'trialing')),
  
  -- Pricing (stored in cents to avoid decimal issues)
  monthly_price_cents INTEGER NOT NULL,
  yearly_price_cents INTEGER NOT NULL,
  is_yearly BOOLEAN DEFAULT FALSE,
  
  -- Stripe integration
  stripe_subscription_id VARCHAR(255) UNIQUE,
  stripe_customer_id VARCHAR(255),
  stripe_price_id VARCHAR(255),
  
  -- Subscription lifecycle
  current_period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  current_period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  cancel_at_period_end BOOLEAN DEFAULT FALSE,
  cancelled_at TIMESTAMP WITH TIME ZONE,
  trial_start TIMESTAMP WITH TIME ZONE,
  trial_end TIMESTAMP WITH TIME ZONE,
  
  -- Features and limits based on tier
  features JSONB DEFAULT '{}'::jsonb,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Audit log table for tracking important actions
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  business_id UUID REFERENCES businesses(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,
  resource_type VARCHAR(50),
  resource_id UUID,
  changes JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX users_email_idx ON users(email);
CREATE INDEX users_locale_idx ON users(locale);
CREATE INDEX businesses_owner_idx ON businesses(owner_id);
CREATE INDEX businesses_slug_idx ON businesses(slug);
CREATE INDEX businesses_banned_idx ON businesses(is_banned) WHERE is_banned = true;
CREATE INDEX businesses_verified_idx ON businesses(verification_status) WHERE verification_status = 'verified';
CREATE INDEX partnerships_requester_idx ON partnerships(requester_business_id);
CREATE INDEX partnerships_requested_idx ON partnerships(requested_business_id);
CREATE INDEX partnerships_status_idx ON partnerships(status);
CREATE INDEX subscriptions_business_idx ON subscriptions(business_id);
CREATE INDEX subscriptions_status_idx ON subscriptions(status);
CREATE INDEX audit_logs_user_idx ON audit_logs(user_id);
CREATE INDEX audit_logs_business_idx ON audit_logs(business_id);
CREATE INDEX audit_logs_created_idx ON audit_logs(created_at);

-- Row Level Security (RLS) Policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE partnerships ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view their own profile" ON users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
  FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Public can view verified businesses" ON businesses
  FOR SELECT USING (verification_status = 'verified' AND is_banned = false);

CREATE POLICY "Business owners can view their own business" ON businesses
  FOR SELECT USING (owner_id = auth.uid());

CREATE POLICY "Business owners can update their own business" ON businesses
  FOR UPDATE USING (owner_id = auth.uid());

-- Partnerships policies
CREATE POLICY "Businesses can view their partnerships" ON partnerships
  FOR SELECT USING (
    requester_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid()) OR
    requested_business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Subscriptions policies
CREATE POLICY "Business owners can view their subscriptions" ON subscriptions
  FOR SELECT USING (
    business_id IN (SELECT id FROM businesses WHERE owner_id = auth.uid())
  );

-- Functions
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partnerships_updated_at BEFORE UPDATE ON partnerships
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to update search vector
CREATE OR REPLACE FUNCTION update_business_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector := 
    setweight(to_tsvector('english', COALESCE(NEW.business_name, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.legal_name, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'C') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.industry_sectors, ' '), '')), 'D');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for search vector
CREATE TRIGGER update_business_search_vector_trigger
  BEFORE INSERT OR UPDATE OF business_name, legal_name, description, industry_sectors
  ON businesses
  FOR EACH ROW
  EXECUTE FUNCTION update_business_search_vector();

-- Function to generate unique slug
CREATE OR REPLACE FUNCTION generate_unique_slug(base_name TEXT, table_name TEXT)
RETURNS TEXT AS $$
DECLARE
  slug TEXT;
  counter INTEGER := 0;
  slug_exists BOOLEAN;
BEGIN
  -- Create base slug
  slug := lower(regexp_replace(base_name, '[^a-zA-Z0-9]+', '-', 'g'));
  slug := trim(both '-' from slug);
  
  LOOP
    IF counter > 0 THEN
      slug := slug || '-' || counter;
    END IF;
    
    EXECUTE format('SELECT EXISTS(SELECT 1 FROM %I WHERE slug = $1)', table_name)
    INTO slug_exists
    USING slug;
    
    EXIT WHEN NOT slug_exists;
    counter := counter + 1;
  END LOOP;
  
  RETURN slug;
END;
$$ LANGUAGE plpgsql;

-- Insert default subscription pricing
INSERT INTO subscriptions (business_id, tier, monthly_price_cents, yearly_price_cents, is_yearly, status, current_period_start, current_period_end, features)
VALUES 
  -- These are template records for reference - actual subscriptions will reference a real business_id
  (uuid_generate_v4(), 'partner', 14900, 148800, false, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month', 
   '{"max_partnerships": 10, "verified_badge": true, "priority_support": false}'::jsonb),
  (uuid_generate_v4(), 'growth', 39900, 299000, false, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month',
   '{"max_partnerships": 50, "verified_badge": true, "priority_support": true, "featured_listing": true}'::jsonb),
  (uuid_generate_v4(), 'corporate', 124900, 1198800, false, 'active', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '1 month',
   '{"max_partnerships": "unlimited", "verified_badge": true, "priority_support": true, "featured_listing": true, "api_access": true, "custom_branding": true}'::jsonb)
ON CONFLICT DO NOTHING;
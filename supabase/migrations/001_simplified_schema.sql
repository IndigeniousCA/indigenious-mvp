-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User types
CREATE TYPE user_type AS ENUM ('indigenous_business', 'canadian_business', 'government_verifier', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('unverified', 'self_declared', 'verified', 'rejected');
CREATE TYPE subscription_tier AS ENUM ('free', 'growth', 'professional', 'enterprise');

-- Simplified users table
CREATE TABLE public.users (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  phone VARCHAR(20),
  locale VARCHAR(2) DEFAULT 'en' CHECK (locale IN ('en', 'fr')),
  user_type user_type NOT NULL,
  
  -- Different card requirements
  stripe_customer_id VARCHAR(255), -- NULL for Indigenous free tier
  payment_method_required BOOLEAN DEFAULT false, -- FALSE for Indigenous free, TRUE for Canadian
  
  subscription_tier subscription_tier DEFAULT 'free',
  subscription_expires_at TIMESTAMP,
  account_status account_status DEFAULT 'active',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Simplified businesses table  
CREATE TABLE public.businesses (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  business_name VARCHAR(255) NOT NULL,
  business_number VARCHAR(50), -- Canadian business number
  
  -- Core fields
  indigenous_owned BOOLEAN DEFAULT false,
  indigenous_ownership_percentage DECIMAL(5,2) CHECK (indigenous_ownership_percentage >= 0 AND indigenous_ownership_percentage <= 100),
  open_to_partnership BOOLEAN DEFAULT false,
  
  -- Profile information
  description TEXT,
  website VARCHAR(255),
  industry_codes VARCHAR(10)[], -- NAICS codes
  number_of_employees VARCHAR(50),
  annual_revenue VARCHAR(50),
  
  -- Location for matching
  province VARCHAR(2),
  city VARCHAR(100),
  postal_code VARCHAR(10),
  
  -- Verification
  verification_status verification_status DEFAULT 'unverified',
  self_declared_at TIMESTAMP,
  verified_at TIMESTAMP,
  verification_documents JSONB,
  
  -- Moderation
  banned_until TIMESTAMP, -- NULL or future date for lifetime ban
  ban_reason TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_user_business UNIQUE(user_id)
);

-- Partnership requests
CREATE TABLE public.partnership_requests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  requester_business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  requested_business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  
  message TEXT,
  status VARCHAR(50) DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'declined', 'expired')),
  
  responded_at TIMESTAMP,
  expires_at TIMESTAMP DEFAULT NOW() + INTERVAL '30 days',
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_partnership_request UNIQUE(requester_business_id, requested_business_id)
);

-- Aggregated external RFQs
CREATE TABLE public.aggregated_rfqs (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  source VARCHAR(50) NOT NULL, -- 'buyandsell', 'merx', 'biddingo', etc.
  external_id VARCHAR(255) NOT NULL,
  external_url TEXT NOT NULL,
  
  title TEXT NOT NULL,
  description TEXT,
  solicitation_number VARCHAR(255),
  
  -- Categorization
  category VARCHAR(100),
  naics_codes VARCHAR(10)[],
  gsin_codes VARCHAR(50)[],
  
  -- Requirements
  location VARCHAR(100),
  delivery_location VARCHAR(100),
  minimum_indigenous_percentage DECIMAL(5,2),
  set_aside_type VARCHAR(50), -- 'ISBP', 'PSIB', null
  
  -- Dates
  published_date TIMESTAMP,
  closing_date TIMESTAMP,
  
  -- Metadata
  buyer_name VARCHAR(255),
  contact_name VARCHAR(255),
  contact_email VARCHAR(255),
  contact_phone VARCHAR(50),
  
  scraped_at TIMESTAMP DEFAULT NOW(),
  last_updated TIMESTAMP DEFAULT NOW(),
  
  CONSTRAINT unique_external_rfq UNIQUE(source, external_id)
);

-- Track RFQ interests
CREATE TABLE public.rfq_interests (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
  rfq_id UUID REFERENCES public.aggregated_rfqs(id) ON DELETE CASCADE,
  
  interested BOOLEAN DEFAULT true,
  notes TEXT,
  
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT unique_rfq_interest UNIQUE(business_id, rfq_id)
);

-- 2FA codes
CREATE TABLE public.verification_codes (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  code VARCHAR(6) NOT NULL,
  type VARCHAR(10) CHECK (type IN ('email', 'sms')),
  used BOOLEAN DEFAULT false,
  expires_at TIMESTAMP NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit log for compliance
CREATE TABLE public.audit_log (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES public.users(id),
  action VARCHAR(100) NOT NULL,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_businesses_province ON public.businesses(province);
CREATE INDEX idx_businesses_city ON public.businesses(city);
CREATE INDEX idx_businesses_indigenous ON public.businesses(indigenous_owned) WHERE indigenous_owned = true;
CREATE INDEX idx_businesses_open_partnership ON public.businesses(open_to_partnership) WHERE open_to_partnership = true;
CREATE INDEX idx_rfqs_closing_date ON public.aggregated_rfqs(closing_date);
CREATE INDEX idx_rfqs_category ON public.aggregated_rfqs(category);
CREATE INDEX idx_partnership_status ON public.partnership_requests(status);

-- Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.partnership_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.aggregated_rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfq_interests ENABLE ROW LEVEL SECURITY;

-- User policies
CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.users
  FOR UPDATE USING (auth.uid() = id);

-- Business policies
CREATE POLICY "Business owners can manage own business" ON public.businesses
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Canadian businesses with open_to_partnership are public" ON public.businesses
  FOR SELECT USING (
    open_to_partnership = true 
    AND indigenous_owned = false
    AND verification_status != 'banned'
  );

CREATE POLICY "Indigenous can search Canadian businesses" ON public.businesses
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.businesses b ON b.user_id = u.id
      WHERE u.id = auth.uid() 
      AND u.user_type = 'indigenous_business'
    )
    AND indigenous_owned = false
    AND open_to_partnership = true
  );

-- Partnership request policies
CREATE POLICY "Can view own partnership requests" ON public.partnership_requests
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.user_id = auth.uid()
      AND (b.id = requester_business_id OR b.id = requested_business_id)
    )
  );

CREATE POLICY "Indigenous businesses can create partnership requests" ON public.partnership_requests
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users u
      JOIN public.businesses b ON b.user_id = u.id
      WHERE u.id = auth.uid() 
      AND u.user_type = 'indigenous_business'
      AND b.id = requester_business_id
    )
  );

-- RFQ policies
CREATE POLICY "Anyone can view RFQs" ON public.aggregated_rfqs
  FOR SELECT USING (closing_date > NOW());

CREATE POLICY "Authenticated users can track RFQ interests" ON public.rfq_interests
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM public.businesses b
      WHERE b.user_id = auth.uid()
      AND b.id = business_id
    )
  );

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check payment requirement
CREATE OR REPLACE FUNCTION check_payment_requirement(p_user_type user_type, p_subscription_tier subscription_tier)
RETURNS BOOLEAN AS $$
BEGIN
  -- Canadian businesses always need payment method
  IF p_user_type = 'canadian_business' THEN
    RETURN TRUE;
  END IF;
  
  -- Indigenous businesses need payment only for paid tiers
  IF p_user_type = 'indigenous_business' AND p_subscription_tier != 'free' THEN
    RETURN TRUE;
  END IF;
  
  -- Indigenous free tier doesn't need payment
  RETURN FALSE;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-set payment requirement
CREATE OR REPLACE FUNCTION update_payment_requirement()
RETURNS TRIGGER AS $$
BEGIN
  NEW.payment_method_required := check_payment_requirement(NEW.user_type, NEW.subscription_tier);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_payment_requirement
  BEFORE INSERT OR UPDATE OF user_type, subscription_tier ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_payment_requirement();

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_businesses_updated_at BEFORE UPDATE ON public.businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
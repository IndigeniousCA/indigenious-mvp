-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User roles enum
CREATE TYPE user_role AS ENUM ('business', 'buyer', 'admin');
CREATE TYPE business_status AS ENUM ('pending', 'verified', 'suspended', 'rejected');
CREATE TYPE rfq_status AS ENUM ('draft', 'published', 'closed', 'awarded');

-- User profiles (extends Supabase auth.users)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    email TEXT UNIQUE NOT NULL,
    phone TEXT,
    role user_role NOT NULL DEFAULT 'business',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Business profiles
CREATE TABLE public.businesses (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    business_name TEXT NOT NULL,
    business_number TEXT,
    indigenous_certification_number TEXT,
    status business_status DEFAULT 'pending',
    verification_date TIMESTAMPTZ,
    description TEXT,
    website TEXT,
    address JSONB,
    capabilities TEXT[],
    certifications JSONB[],
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id)
);

-- RFQs (Request for Quotes)
CREATE TABLE public.rfqs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    buyer_id UUID REFERENCES public.profiles(id),
    title TEXT NOT NULL,
    description TEXT,
    requirements JSONB,
    budget_range JSONB,
    deadline TIMESTAMPTZ,
    status rfq_status DEFAULT 'draft',
    indigenous_only BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    published_at TIMESTAMPTZ
);

-- Bids on RFQs
CREATE TABLE public.bids (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    rfq_id UUID REFERENCES public.rfqs(id) ON DELETE CASCADE,
    business_id UUID REFERENCES public.businesses(id) ON DELETE CASCADE,
    amount DECIMAL(15,2),
    proposal TEXT,
    attachments JSONB[],
    status TEXT DEFAULT 'submitted',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(rfq_id, business_id)
);

-- 2FA verification codes
CREATE TABLE public.verification_codes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
    code TEXT NOT NULL,
    type TEXT NOT NULL, -- 'email' or 'sms'
    expires_at TIMESTAMPTZ NOT NULL,
    used BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rfqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bids ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.verification_codes ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Users can view their own profile" ON public.profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
    FOR UPDATE USING (auth.uid() = id);

-- Businesses policies
CREATE POLICY "Business owners can view their own business" ON public.businesses
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Public can view verified businesses" ON public.businesses
    FOR SELECT USING (status = 'verified');

CREATE POLICY "Business owners can update their own business" ON public.businesses
    FOR UPDATE USING (auth.uid() = user_id);

-- RFQs policies
CREATE POLICY "Buyers can create RFQs" ON public.rfqs
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles 
            WHERE id = auth.uid() AND role = 'buyer'
        )
    );

CREATE POLICY "Anyone can view published RFQs" ON public.rfqs
    FOR SELECT USING (status = 'published');

CREATE POLICY "RFQ owners can view their own RFQs" ON public.rfqs
    FOR SELECT USING (auth.uid() = buyer_id);

-- Functions
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, email)
  VALUES (new.id, new.email);
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
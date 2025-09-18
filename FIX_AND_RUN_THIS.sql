-- Clean up if types already exist (from failed attempt)
DROP TYPE IF EXISTS user_type CASCADE;
DROP TYPE IF EXISTS account_status CASCADE;
DROP TYPE IF EXISTS verification_status CASCADE;
DROP TYPE IF EXISTS subscription_tier CASCADE;

-- Drop tables if they exist
DROP TABLE IF EXISTS public.audit_log CASCADE;
DROP TABLE IF EXISTS public.rfq_interests CASCADE;
DROP TABLE IF EXISTS public.verification_codes CASCADE;
DROP TABLE IF EXISTS public.aggregated_rfqs CASCADE;
DROP TABLE IF EXISTS public.partnership_requests CASCADE;
DROP TABLE IF EXISTS public.businesses CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- User types
CREATE TYPE user_type AS ENUM ('indigenous_business', 'canadian_business', 'government_verifier', 'admin');
CREATE TYPE account_status AS ENUM ('active', 'suspended', 'banned', 'pending_verification');
CREATE TYPE verification_status AS ENUM ('unverified', 'self_declared', 'verified', 'rejected', 'banned');
CREATE TYPE subscription_tier AS ENUM ('free', 'growth', 'professional', 'enterprise');

-- Now run the rest of the migration...
-- (Copy the rest from COPY_THIS_SQL.sql starting from line 10)
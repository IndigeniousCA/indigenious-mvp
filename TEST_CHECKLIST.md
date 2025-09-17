# 🧪 Testing Checklist for Indigenious MVP

## Pre-Test Setup

### 1. Database Migration Status
- [ ] Go to: https://app.supabase.com/project/vpdamevzejawthwlcfvv/sql
- [ ] Run the migration from `supabase/migrations/001_simplified_schema.sql`
- [ ] Run `verify-setup.sql` to confirm tables exist

### 2. Environment Variables in Vercel
Check these are set at: https://vercel.com/jonathans-projects-fd5ed5c9/indigenious-mvp/settings/environment-variables

Required for basic functionality:
- [ ] `NEXT_PUBLIC_SUPABASE_URL` (already set)
- [ ] `NEXT_PUBLIC_SUPABASE_ANON_KEY` (already set)
- [ ] `SUPABASE_SERVICE_ROLE_KEY` (needs to be added)

Required for email:
- [ ] `RESEND_API_KEY` (needs to be added)
- [ ] `EMAIL_FROM` (needs to be added)

Required for payments:
- [ ] `STRIPE_SECRET_KEY` (already set)
- [ ] `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (needs to be added)
- [ ] `STRIPE_WEBHOOK_SECRET` (needs to be added after webhook creation)
- [ ] `NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN` (needs to be added)

## Test Scenarios

### 1. Homepage
- Visit: https://indigenious-mvp.vercel.app
- Should see landing page with "Register" and "Login" buttons
- Language toggle should work (EN/FR)

### 2. Registration Flow (Without Payment Setup)
Since Stripe products aren't configured yet:

**Indigenous Business (Should Work)**
- Go to: https://indigenious-mvp.vercel.app/en/auth/register
- Select "Indigenous Business" 
- Fill form and submit
- Will see error if email service not configured
- But should create user in Supabase

**Canadian Business (Will Need Stripe)**
- Select "Canadian Business"
- Will fail at payment step without Stripe products

### 3. Quick Database Test
Run in Supabase SQL editor:
```sql
-- Check if auth trigger exists
SELECT COUNT(*) FROM auth.users;

-- Check if our tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'businesses', 'verification_codes');
```

## Minimum Viable Test

For a basic test without full setup:
1. Run database migration
2. Add `SUPABASE_SERVICE_ROLE_KEY` to Vercel
3. Try Indigenous business registration
4. Check Supabase dashboard for created user

## Known Limitations Without Full Setup

- ❌ Email verification won't work (no Resend API key)
- ❌ Canadian business registration blocked (no Stripe products)
- ❌ Webhook events won't process (no webhook secret)
- ⚠️ Users will be created but can't verify email
- ⚠️ Dashboard will load but may show errors

## Next Steps After Basic Test

1. Set up Resend for email verification
2. Create Stripe products for payment flow
3. Configure webhook for subscription management
4. Add all remaining environment variables
5. Test complete user journey
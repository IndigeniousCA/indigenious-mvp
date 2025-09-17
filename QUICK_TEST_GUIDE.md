# 🚀 Quick Test Guide

## Current Status
The app is deployed at: https://indigenious-mvp.vercel.app

## What's Working Now
- ✅ Homepage and navigation
- ✅ Language switching (EN/FR)
- ✅ Registration form UI
- ✅ Login form UI
- ⚠️ Registration will fail without database

## Quick Database Setup (5 minutes)

### Step 1: Run Migration
1. Go to: https://app.supabase.com/project/vpdamevzejawthwlcfvv/sql
2. Copy ALL content from: `supabase/migrations/001_simplified_schema.sql`
3. Paste in SQL editor and click "RUN"
4. You should see "Success. No rows returned"

### Step 2: Verify Setup
Run this query to check:
```sql
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'businesses', 'verification_codes', 'partnership_requests');
```
Should return 4 rows.

### Step 3: Add Missing Vercel Variables
Go to: https://vercel.com/jonathans-projects-fd5ed5c9/indigenious-mvp/settings/environment-variables

Add these (copy from your .env file):
1. `SUPABASE_SERVICE_ROLE_KEY`
2. `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`

## Test Without Email/Payment

### Test Indigenous Registration:
1. Visit: https://indigenious-mvp.vercel.app/en/auth/register
2. Select "Indigenous Business"
3. Fill form:
   - Email: test@example.com
   - Phone: (555) 123-4567
   - Password: Test123!
   - Business: Test Business Inc
4. Submit

Expected:
- User created in Supabase
- Error about email (since Resend not configured)
- Check Supabase Auth tab for new user

### Check Supabase:
1. Go to: https://app.supabase.com/project/vpdamevzejawthwlcfvv/auth/users
2. Should see your test user
3. Go to Table Editor > users table
4. Should see user profile

## What Won't Work Yet
- ❌ Email verification (need Resend)
- ❌ Canadian business registration (need Stripe products)
- ❌ Dashboard data (need authenticated session)
- ❌ 2FA codes (need email service)

## Quick Wins to Test More

### Enable Manual Email Confirmation:
1. In Supabase Auth > Users
2. Find your test user
3. Click menu (...) > "Confirm email"
4. Now you can login!

### Test Login:
1. Go to: https://indigenious-mvp.vercel.app/en/auth/login
2. Use your test credentials
3. Should redirect to dashboard (may be empty)

## Next Priority
1. Add Resend API key for email
2. Create Stripe products for payments
3. Test full registration flow
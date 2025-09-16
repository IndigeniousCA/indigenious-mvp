# 🔐 Environment Keys Setup Guide

This guide shows you exactly where to input your environment keys for deployment.

## Option 1: Vercel Dashboard (Recommended)

### Step 1: Deploy to Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Connect your GitHub repo
4. You'll see the "Configure Project" screen

### Step 2: Add Environment Variables in Vercel
On the deployment configuration page, you'll see an "Environment Variables" section.

Add these keys one by one:

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: [paste your Supabase project URL]

Name: NEXT_PUBLIC_SUPABASE_ANON_KEY  
Value: [paste your Supabase anon key]

Name: SUPABASE_SERVICE_ROLE_KEY
Value: [paste your Supabase service role key]

Name: STRIPE_SECRET_KEY
Value: [paste your Stripe secret key]

Name: NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
Value: [paste your Stripe publishable key]

Name: STRIPE_WEBHOOK_SECRET
Value: [paste your webhook secret - you'll get this after deploy]

Name: NEXT_PUBLIC_APP_URL
Value: https://your-project.vercel.app

Name: NODE_ENV
Value: production
```

Click "Deploy" and Vercel will use these keys automatically!

## Option 2: Local Development

Create a `.env` file in your project root:

```bash
# In your project directory
cp .env.example .env
```

Then edit `.env` and add your keys:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://abcdefghijk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe
STRIPE_SECRET_KEY=sk_test_51234567890abcdef...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51234567890abcdef...
STRIPE_WEBHOOK_SECRET=whsec_1234567890abcdef...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

## Where to Get Each Key:

### 1. Supabase Keys
1. Go to [app.supabase.com](https://app.supabase.com)
2. Select your project (or create one)
3. Navigate to: Settings → API
4. You'll see:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Project API keys:
     - anon public → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
     - service_role → `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### 2. Stripe Keys
1. Go to [dashboard.stripe.com](https://dashboard.stripe.com)
2. For API keys: Developers → API keys
   - Publishable key → `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
   - Secret key → `STRIPE_SECRET_KEY` (keep secret!)
3. For webhook (after deployment):
   - Go to Developers → Webhooks
   - Click "Add endpoint"
   - URL: `https://your-domain.vercel.app/api/stripe/webhook`
   - Select events: 
     - `checkout.session.completed`
     - `invoice.payment_failed`
   - After creation, copy signing secret → `STRIPE_WEBHOOK_SECRET`

## 🚨 Important Security Notes:

1. **Never commit `.env` files to GitHub**
2. **Keep these keys secret:**
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `STRIPE_SECRET_KEY`
   - `STRIPE_WEBHOOK_SECRET`
3. **OK to expose these (they're public):**
   - `NEXT_PUBLIC_*` keys

## After Deployment:

1. Update `NEXT_PUBLIC_APP_URL` to your actual domain
2. Create Stripe webhook with your real URL
3. Update `STRIPE_WEBHOOK_SECRET` with the new value
4. Test with Stripe test mode first
5. Switch to live Stripe keys when ready to launch

That's it! Your keys are now configured and your app is ready to deploy! 🚀
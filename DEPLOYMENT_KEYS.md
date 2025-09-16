# 🚀 Deployment Keys Needed for Indigenious Platform

## Required Environment Variables

### 1. Supabase (Database & Auth)
```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...your-anon-key
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...your-service-key
```

**Where to get them:**
1. Go to https://app.supabase.com
2. Select your project (or create one)
3. Go to Settings → API
4. Copy the keys

### 2. Stripe (Payments)
```env
STRIPE_SECRET_KEY=sk_live_...your-secret-key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...your-publishable-key
STRIPE_WEBHOOK_SECRET=whsec_...your-webhook-secret
```

**Where to get them:**
1. Go to https://dashboard.stripe.com
2. API keys: Developers → API keys
3. Webhook secret: Developers → Webhooks → Add endpoint
   - Endpoint URL: `https://your-domain.com/api/stripe/webhook`
   - Events: `checkout.session.completed`, `invoice.payment_failed`

### 3. App Configuration
```env
NEXT_PUBLIC_APP_URL=https://app.indigenious.ca
NODE_ENV=production
```

## Quick Deploy to Vercel

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel**
   - Go to https://vercel.com
   - Import your GitHub repository
   - Add ALL environment variables above
   - Click Deploy

3. **After Deploy**
   - Update Stripe webhook URL to your actual domain
   - Test with Stripe test cards first
   - Switch to live Stripe keys when ready

## Stripe Products Setup

Create these products in Stripe Dashboard:

### Partner Plan
- Monthly: $149 CAD
- Yearly: $1,488 CAD (save $300)

### Growth Plan  
- Monthly: $399 CAD
- Yearly: $2,990 CAD (save $1,798) - LAUNCH SPECIAL

### Corporate Plan
- Monthly: $1,249 CAD
- Yearly: $11,988 CAD (save $3,000)

Then update the price IDs in your environment variables or code.

## 🎉 That's it! Your platform is ready to launch!
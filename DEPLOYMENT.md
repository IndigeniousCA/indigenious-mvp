# Deployment Guide for Indigenious Platform

## Prerequisites

1. **Accounts Needed:**
   - Vercel account (or your preferred hosting)
   - Supabase account
   - Stripe account
   - Domain name (indigenious.ca)

## Environment Variables Setup

### 1. Supabase Keys
1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Create new project
3. Go to Settings → API
4. Copy:
   - `NEXT_PUBLIC_SUPABASE_URL` - Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Anon/Public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Service Role key (keep secret!)

### 2. Stripe Keys
1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Get API keys from Developers → API keys:
   - `STRIPE_SECRET_KEY` - Secret key (use test key for development)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Publishable key
3. Set up webhook endpoint:
   - Go to Developers → Webhooks
   - Add endpoint: `https://your-domain.com/api/stripe/webhook`
   - Select events: `checkout.session.completed`, `invoice.payment_failed`
   - Copy `STRIPE_WEBHOOK_SECRET`

### 3. Create Price IDs in Stripe
Create products and prices for each tier:
- Partner: Monthly $149 CAD, Yearly $1,488 CAD
- Growth: Monthly $399 CAD, Yearly $2,990 CAD  
- Corporate: Monthly $1,249 CAD, Yearly $11,988 CAD

Update price IDs in `src/lib/stripe.ts`

## Database Setup (Supabase)

Run the schema from `supabase/schema.sql` in Supabase SQL Editor

## Deployment Steps

### Deploy to Vercel (Recommended)

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

### Manual Deployment

```bash
# Build the project
npm run build

# Test production build locally
npm run start
```

## Post-Deployment Checklist

- [ ] Test all pages in both languages
- [ ] Test Stripe checkout flow (use test cards)
- [ ] Verify PWA installation works
- [ ] Check mobile responsiveness
- [ ] Test error pages (404, error boundary)
- [ ] Verify environment variables are set
- [ ] Update DNS to point to deployment
- [ ] Set up SSL certificate (automatic on Vercel)
- [ ] Test webhook endpoints
- [ ] Enable Stripe live mode when ready

## Domain Configuration

1. Add custom domain in Vercel
2. Update DNS records:
   - A record: @ → Vercel IP
   - CNAME: www → cname.vercel-dns.com
   - CNAME: app → cname.vercel-dns.com

## Monitoring

- Set up Vercel Analytics
- Configure error tracking (Sentry)
- Monitor Stripe webhook failures
- Check Supabase usage limits

## Security Checklist

- [ ] All API keys are in environment variables
- [ ] Webhook endpoints validate signatures
- [ ] RLS enabled on all Supabase tables
- [ ] CORS configured properly
- [ ] Rate limiting enabled
- [ ] CSP headers configured
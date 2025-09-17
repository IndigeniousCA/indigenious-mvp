# 🚀 Indigenious MVP Launch Setup Guide

## Overview
This guide walks through setting up all the critical components for launching the Indigenious MVP platform.

## 1. Database Setup (Supabase)

Run the setup script:
```bash
./scripts/setup-database.sh
```

Follow **Option 2** (easiest):
1. Go to: https://app.supabase.com/project/vpdamevzejawthwlcfvv/sql
2. Copy the entire contents of `supabase/migrations/001_simplified_schema.sql`
3. Paste and click "Run"

Verify setup:
1. Copy contents of `verify-setup.sql` (created by the script)
2. Run in SQL editor to confirm tables exist

## 2. Stripe Configuration

Run the setup script:
```bash
./scripts/setup-stripe.sh
```

### Create Products in Stripe Dashboard

1. Go to https://dashboard.stripe.com/test/products

2. **Canadian Business Access** (Free but requires card)
   - Price: $0.00 CAD/month
   - Copy Price ID → `NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN`

3. **Growth Plan**
   - Monthly: $49.00 CAD → `STRIPE_PRICE_GROWTH_MONTHLY`
   - Yearly: $490.00 CAD → `STRIPE_PRICE_GROWTH_YEARLY`

4. **Professional Plan**
   - Monthly: $99.00 CAD → `STRIPE_PRICE_PROFESSIONAL_MONTHLY`
   - Yearly: $990.00 CAD → `STRIPE_PRICE_PROFESSIONAL_YEARLY`

5. **Enterprise Plan**
   - Monthly: $299.00 CAD → `STRIPE_PRICE_ENTERPRISE_MONTHLY`

### Setup Webhook
1. Go to https://dashboard.stripe.com/test/webhooks
2. Add endpoint: `https://indigenious-mvp.vercel.app/api/webhooks/stripe`
3. Select events:
   - checkout.session.completed
   - customer.subscription.updated
   - customer.subscription.deleted
   - payment_method.attached
4. Copy signing secret → `STRIPE_WEBHOOK_SECRET`

## 3. Email Service (Resend)

1. Sign up at https://resend.com
2. Add and verify your domain (indigenious.ca)
3. Get API key → `RESEND_API_KEY`
4. Update `EMAIL_FROM` to use your verified domain

## 4. Environment Variables

### Local .env
```bash
# Copy from .env.example
cp .env.example .env
```

Fill in all values from the services above.

### Deploy to Vercel
```bash
# Add each environment variable
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add STRIPE_SECRET_KEY
vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
vercel env add STRIPE_WEBHOOK_SECRET
vercel env add NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN
vercel env add STRIPE_PRICE_GROWTH_MONTHLY
vercel env add STRIPE_PRICE_GROWTH_YEARLY
vercel env add STRIPE_PRICE_PROFESSIONAL_MONTHLY
vercel env add STRIPE_PRICE_PROFESSIONAL_YEARLY
vercel env add STRIPE_PRICE_ENTERPRISE_MONTHLY
vercel env add RESEND_API_KEY
vercel env add EMAIL_FROM
```

## 5. Test the Complete Flow

### Indigenous Business Registration (Free)
1. Go to https://indigenious-mvp.vercel.app/en/auth/register
2. Select "Indigenous Business"
3. Fill form (no payment required)
4. Verify email code
5. Access dashboard

### Canadian Business Registration (Card Required)
1. Go to https://indigenious-mvp.vercel.app/en/auth/register
2. Select "Canadian Business"
3. Fill form
4. Complete Stripe checkout (use test card: 4242 4242 4242 4242)
5. Verify email code
6. Access dashboard

### Test Features
- **Indigenous**: Search for partners, view RFQs
- **Canadian**: Receive partnership requests
- **Both**: Update profile, view dashboard metrics

## 6. Production Checklist

- [ ] Switch Stripe to live mode
- [ ] Update all Stripe API keys and price IDs
- [ ] Enable Supabase Auth email templates
- [ ] Configure custom domain
- [ ] Set up monitoring (Sentry, uptime)
- [ ] Enable Vercel Analytics
- [ ] Create admin account for monitoring

## Common Issues & Solutions

### "User not found" errors
- Run database migrations first
- Check Supabase Auth is enabled

### Payment not working
- Verify all Stripe environment variables
- Check webhook is receiving events
- Use Stripe CLI for local testing

### Email not sending
- Verify Resend domain
- Check API key is correct
- Look for errors in Vercel logs

### 404 on deployment
- Ensure all environment variables are set in Vercel
- Check middleware configuration
- Verify i18n routing

## Support

For issues:
1. Check Vercel Function logs
2. Check Supabase logs
3. Test with Stripe CLI locally
4. Review browser console for errors

---

**Remember**: This is an MVP. Core functionality first, polish later!
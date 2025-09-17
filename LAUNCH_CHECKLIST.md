# 🚀 Indigenious MVP Launch Checklist

## Pre-Launch Setup (1-2 days)

### 1. Supabase Configuration ⏳
- [ ] Create Supabase project
- [ ] Run database migrations (supabase/migrations/001_simplified_schema.sql)
- [ ] Enable Auth with email/password
- [ ] Configure Auth email templates
- [ ] Set up Row Level Security
- [ ] Test auth flow manually

### 2. Stripe Setup ⏳
- [ ] Create Stripe account
- [ ] Create products and prices for each tier:
  - [ ] Growth Monthly/Yearly
  - [ ] Professional Monthly/Yearly  
  - [ ] Enterprise Monthly
- [ ] Add price IDs to .env
- [ ] Configure webhook endpoint
- [ ] Test payment flow in test mode

### 3. Email Service (Resend) ⏳
- [ ] Create Resend account
- [ ] Verify domain (indigenious.ca)
- [ ] Get API key
- [ ] Test email sending

### 4. Environment Variables ⏳
- [ ] Copy all from .env.example
- [ ] Fill in Supabase credentials
- [ ] Fill in Stripe credentials
- [ ] Fill in Resend API key
- [ ] Deploy environment variables to Vercel

### 5. Security & Legal ✅
- [x] Terms of Service page created
- [x] Privacy Policy page created  
- [x] Security headers configured
- [ ] Update registration to link to legal pages
- [ ] Add cookie consent banner

### 6. Connect Core Features ⏳
- [ ] Update registration to use real auth service
- [ ] Connect search to database API
- [ ] Make dashboard show real user data
- [ ] Implement logout functionality
- [ ] Add loading states for async operations

## Launch Day Tasks

### 7. Final Testing
- [ ] Test Indigenous business registration (no card)
- [ ] Test Canadian business registration (requires card)
- [ ] Test login and 2FA flow
- [ ] Test search functionality
- [ ] Test partnership requests
- [ ] Test on mobile devices

### 8. Monitoring Setup
- [ ] Set up Sentry for error tracking
- [ ] Configure Vercel Analytics
- [ ] Set up uptime monitoring (UptimeRobot)
- [ ] Create admin dashboard for metrics

### 9. Go Live
- [ ] Deploy to production
- [ ] Update DNS if using custom domain
- [ ] Test production environment
- [ ] Monitor for first 24 hours

## Post-Launch (Week 1)

### 10. User Feedback
- [ ] Set up feedback collection
- [ ] Monitor support emails
- [ ] Track user behavior
- [ ] Fix critical bugs

### 11. Performance
- [ ] Monitor page load times
- [ ] Optimize images
- [ ] Review database queries
- [ ] Check for memory leaks

## Known Issues to Fix Post-MVP

1. **SMS Integration**: Currently emails verification codes instead of SMS
2. **RFQ Aggregation**: Manual process for now, needs automation
3. **Advanced Search**: Basic search works, needs filters and sorting
4. **Business Verification**: Self-declaration only, needs document upload
5. **Partnership Matching**: No algorithm yet, just manual browsing
6. **Email Templates**: Basic HTML, needs design polish
7. **Dashboard Analytics**: Static data, needs real metrics
8. **Internationalization**: Some hardcoded English strings remain

## Success Metrics

- [ ] 10+ Indigenous businesses registered in first week
- [ ] 5+ Canadian businesses registered
- [ ] 3+ partnership requests sent
- [ ] <3s page load time
- [ ] <0.1% error rate
- [ ] 95%+ uptime

## Emergency Contacts

- **Technical Issues**: tech@indigenious.ca
- **Legal Issues**: legal@indigenious.ca  
- **Payment Issues**: billing@indigenious.ca
- **General Support**: support@indigenious.ca

---

**Remember**: This is an MVP. Focus on core functionality first, polish later!
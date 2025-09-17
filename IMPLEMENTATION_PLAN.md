# Indigenious MVP Implementation Plan

## Current State vs Required State

### Current State:
- Mock authentication (no real user creation)
- No email/SMS sending
- No role-based access control
- No database persistence
- All users see the same features regardless of type

### Required State:
- Real authentication with Supabase
- Email verification & SMS 2FA
- Separate experiences for Business vs Buyer accounts
- Persistent data storage
- Role-based feature access

## Implementation Strategy

### Phase 1: Authentication & User Management (Week 1)

#### 1.1 Supabase Setup
- [x] Create Supabase client configuration
- [x] Create auth service with real authentication
- [ ] Set up email provider (Resend/SendGrid)
- [ ] Set up SMS provider (Twilio)
- [ ] Configure Supabase Auth settings

#### 1.2 Database Schema
- [x] User profiles with roles
- [x] Business profiles
- [x] RFQ tables
- [x] Verification codes table
- [ ] Run migrations on Supabase

#### 1.3 Registration Flow
- [ ] Add user type selection (Business vs Buyer)
- [ ] Implement real registration with Supabase
- [ ] Email verification flow
- [ ] Phone verification for 2FA
- [ ] Redirect to appropriate dashboard

### Phase 2: Role-Based Features (Week 2)

#### 2.1 Business Users Can:
- View their business profile
- Edit business information
- Upload verification documents
- View relevant RFQs
- Submit bids on RFQs
- Track bid status
- Message buyers

#### 2.2 Buyer Users Can:
- Create RFQs
- Set requirements & budgets
- Review incoming bids
- Award contracts
- Message businesses
- View business profiles

#### 2.3 Navigation Updates
- Dynamic menu based on user role
- Hide/show features based on permissions
- Proper error handling for unauthorized access

### Phase 3: Core Features Implementation (Week 3)

#### 3.1 Business Verification
- Document upload system
- Admin review queue
- Verification status tracking
- Badge system for verified businesses

#### 3.2 RFQ System
- RFQ creation form
- Search and filter RFQs
- Bid submission
- Bid comparison tools
- Award process

#### 3.3 Communication
- In-app messaging
- Email notifications
- SMS alerts for urgent items

### Phase 4: Integration & Polish (Week 4)

#### 4.1 Payment Integration
- Stripe setup for premium features
- Subscription management
- Invoice generation

#### 4.2 Analytics & Reporting
- User activity tracking
- Business performance metrics
- RFQ success rates

## Technical Requirements

### Environment Variables Needed:
```env
# Email Service
RESEND_API_KEY=
EMAIL_FROM=noreply@indigenious.ca

# SMS Service  
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_PHONE_NUMBER=

# Already have:
# NEXT_PUBLIC_SUPABASE_URL
# NEXT_PUBLIC_SUPABASE_ANON_KEY
# STRIPE_SECRET_KEY
```

### NPM Packages to Install:
```bash
npm install @supabase/ssr @supabase/supabase-js
npm install resend
npm install twilio
npm install react-hook-form
npm install @hookform/resolvers zod
```

## Immediate Next Steps:

1. **Update Registration Form** - Add user type selection
2. **Connect to Real Auth** - Replace mock functions
3. **Create Role-Based Dashboards** - Separate business/buyer experiences
4. **Implement Email Service** - For verification codes
5. **Add Protected Routes** - Middleware for auth checking

## File Structure Updates Needed:

```
src/
  app/
    [locale]/
      dashboard/
        business/     # Business user dashboard
          profile/
          bids/
          documents/
        buyer/        # Buyer dashboard
          rfqs/
          bids/
          contracts/
  components/
    auth/
      UserTypeSelector.tsx
      VerificationForm.tsx
    business/
      BusinessProfile.tsx
      BidForm.tsx
    buyer/
      RFQForm.tsx
      BidReview.tsx
  lib/
    services/
      email.service.ts
      sms.service.ts
      rfq.service.ts
  middleware.ts       # Add auth checks
```

## Success Metrics:
- Users can register with correct role
- Email verification works
- 2FA SMS codes are sent
- Business users only see business features
- Buyer users only see buyer features
- Data persists across sessions
- Proper error handling throughout
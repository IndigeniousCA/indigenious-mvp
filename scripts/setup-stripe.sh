#!/bin/bash

# Stripe Setup Script for Indigenious MVP
# This script helps create the required products and prices in Stripe

echo "🚀 Setting up Stripe Products and Prices..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${YELLOW}📋 Stripe Configuration Instructions${NC}"
echo ""
echo "1. Go to https://dashboard.stripe.com/test/products"
echo "2. Create the following products:"
echo ""
echo -e "${GREEN}Product 1: Canadian Business Access${NC}"
echo "   - Name: Canadian Business Platform Access"
echo "   - Description: Required for Canadian businesses to access the platform"
echo "   - Price: $0.00 CAD/month (verification only)"
echo "   - Price ID: Copy this for STRIPE_PRICE_FREE_CANADIAN"
echo ""
echo -e "${GREEN}Product 2: Growth Plan${NC}"
echo "   - Name: Growth Plan"
echo "   - Description: For growing Indigenous businesses"
echo "   - Monthly Price: $49.00 CAD/month"
echo "   - Yearly Price: $490.00 CAD/year (save 2 months)"
echo "   - Price IDs: Copy for STRIPE_PRICE_GROWTH_MONTHLY and STRIPE_PRICE_GROWTH_YEARLY"
echo ""
echo -e "${GREEN}Product 3: Professional Plan${NC}"
echo "   - Name: Professional Plan"
echo "   - Description: For established Indigenous businesses"
echo "   - Monthly Price: $99.00 CAD/month"
echo "   - Yearly Price: $990.00 CAD/year (save 2 months)"
echo "   - Price IDs: Copy for STRIPE_PRICE_PROFESSIONAL_MONTHLY and STRIPE_PRICE_PROFESSIONAL_YEARLY"
echo ""
echo -e "${GREEN}Product 4: Enterprise Plan${NC}"
echo "   - Name: Enterprise Plan"
echo "   - Description: For large Indigenous organizations"
echo "   - Monthly Price: $299.00 CAD/month"
echo "   - Price ID: Copy for STRIPE_PRICE_ENTERPRISE_MONTHLY"
echo ""
echo -e "${YELLOW}3. Update your .env file with the price IDs:${NC}"
echo ""
cat << 'EOF'
# Canadian Business (free but requires card)
NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN=price_xxx

# Indigenous Business Paid Tiers
STRIPE_PRICE_GROWTH_MONTHLY=price_xxx
STRIPE_PRICE_GROWTH_YEARLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_MONTHLY=price_xxx
STRIPE_PRICE_PROFESSIONAL_YEARLY=price_xxx
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_xxx
EOF
echo ""
echo -e "${YELLOW}4. Set up the webhook:${NC}"
echo "   - Go to https://dashboard.stripe.com/test/webhooks"
echo "   - Click 'Add endpoint'"
echo "   - Endpoint URL: https://indigenious-mvp.vercel.app/api/webhooks/stripe"
echo "   - Select events:"
echo "     ✓ checkout.session.completed"
echo "     ✓ customer.subscription.updated"
echo "     ✓ customer.subscription.deleted"
echo "     ✓ payment_method.attached"
echo "   - Copy the signing secret to STRIPE_WEBHOOK_SECRET"
echo ""
echo -e "${YELLOW}5. Deploy environment variables to Vercel:${NC}"
echo -e "${GREEN}vercel env add STRIPE_SECRET_KEY${NC}"
echo -e "${GREEN}vercel env add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY${NC}"
echo -e "${GREEN}vercel env add STRIPE_WEBHOOK_SECRET${NC}"
echo -e "${GREEN}vercel env add NEXT_PUBLIC_STRIPE_PRICE_FREE_CANADIAN${NC}"
echo -e "${GREEN}vercel env add STRIPE_PRICE_GROWTH_MONTHLY${NC}"
echo -e "${GREEN}vercel env add STRIPE_PRICE_GROWTH_YEARLY${NC}"
echo -e "${GREEN}vercel env add STRIPE_PRICE_PROFESSIONAL_MONTHLY${NC}"
echo -e "${GREEN}vercel env add STRIPE_PRICE_PROFESSIONAL_YEARLY${NC}"
echo -e "${GREEN}vercel env add STRIPE_PRICE_ENTERPRISE_MONTHLY${NC}"
echo ""
echo -e "${GREEN}✅ Setup instructions complete!${NC}"
#!/bin/bash

# Setup script for Indigenious MVP Database
# This script will:
# 1. Initialize Supabase project
# 2. Run migrations
# 3. Set up Row Level Security
# 4. Create initial data

echo "🚀 Setting up Indigenious MVP Database..."

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${RED}❌ .env file not found! Please create it from .env.example${NC}"
    exit 1
fi

# Load environment variables
source .env

# Check required variables
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "${RED}❌ Missing required environment variables!${NC}"
    echo "Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env"
    exit 1
fi

echo -e "${YELLOW}📋 Using Supabase project: $NEXT_PUBLIC_SUPABASE_URL${NC}"

# Extract project ID from URL (macOS compatible)
PROJECT_ID=$(echo $NEXT_PUBLIC_SUPABASE_URL | sed -E 's/https:\/\/(.*)\.supabase\.co.*/\1/')

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Could not extract project ID from Supabase URL${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Project ID: $PROJECT_ID${NC}"

# Option 1: Using Supabase CLI (recommended)
echo -e "\n${YELLOW}Option 1: Using Supabase CLI${NC}"
echo "Run these commands:"
echo -e "${GREEN}supabase link --project-ref $PROJECT_ID${NC}"
echo -e "${GREEN}supabase db push${NC}"

# Option 2: Direct SQL execution
echo -e "\n${YELLOW}Option 2: Direct SQL execution via Dashboard${NC}"
echo "1. Go to: https://app.supabase.com/project/$PROJECT_ID/sql"
echo "2. Copy and paste the contents of:"
echo "   - supabase/migrations/001_simplified_schema.sql"
echo "3. Click 'Run'"

# Option 3: Using psql
echo -e "\n${YELLOW}Option 3: Using psql (advanced)${NC}"
DB_URL="postgresql://postgres:$SUPABASE_SERVICE_ROLE_KEY@db.$PROJECT_ID.supabase.co:5432/postgres"
echo "Run:"
echo -e "${GREEN}psql \"$DB_URL\" < supabase/migrations/001_simplified_schema.sql${NC}"

# Create a verification script
cat > verify-setup.sql << EOF
-- Verify tables exist
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'businesses', 'partnerships', 'rfqs');

-- Check RLS is enabled
SELECT tablename, rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN ('users', 'businesses', 'partnerships', 'rfqs');

-- Count rows
SELECT 
  (SELECT COUNT(*) FROM public.users) as users_count,
  (SELECT COUNT(*) FROM public.businesses) as businesses_count,
  (SELECT COUNT(*) FROM public.partnerships) as partnerships_count,
  (SELECT COUNT(*) FROM public.rfqs) as rfqs_count;
EOF

echo -e "\n${YELLOW}📝 Created verify-setup.sql to check your database setup${NC}"
echo "Run it in the SQL editor after migration to verify everything is set up correctly."

echo -e "\n${GREEN}✅ Setup instructions complete!${NC}"
echo -e "${YELLOW}Next steps:${NC}"
echo "1. Run the migrations using one of the options above"
echo "2. Verify the setup using verify-setup.sql"
echo "3. Update your .env with any missing variables"
echo "4. Deploy environment variables to Vercel"
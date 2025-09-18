-- CHECK WHAT EXISTS IN YOUR DATABASE
-- Run this FIRST to see current state

-- 1. Check if types exist
SELECT 
    n.nspname as schema,
    t.typname as type_name,
    array_agg(e.enumlabel ORDER BY e.enumsortorder) as enum_values
FROM pg_type t 
JOIN pg_enum e ON t.oid = e.enumtypid  
JOIN pg_catalog.pg_namespace n ON n.oid = t.typnamespace
WHERE n.nspname = 'public'
GROUP BY n.nspname, t.typname
ORDER BY t.typname;

-- 2. Check if tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;

-- 3. Check if there are any users already
SELECT COUNT(*) as user_count FROM auth.users;
-- Verify the migration worked
SELECT 
    'Tables Created' as check_type,
    COUNT(*) as count 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- List all tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
ORDER BY table_name;

-- Check if RLS is enabled
SELECT 
    tablename, 
    rowsecurity as "RLS Enabled"
FROM pg_tables 
WHERE schemaname = 'public' 
ORDER BY tablename;
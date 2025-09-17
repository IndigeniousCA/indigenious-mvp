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

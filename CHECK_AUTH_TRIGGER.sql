-- Check if the auth trigger exists
SELECT COUNT(*) as trigger_exists
FROM information_schema.triggers 
WHERE trigger_schema = 'auth' 
AND event_object_table = 'users';

-- If it doesn't exist, create it
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Also check if we have any auth.users
SELECT COUNT(*) as auth_users_count FROM auth.users;

-- And check if we have any public.users
SELECT COUNT(*) as public_users_count FROM public.users;
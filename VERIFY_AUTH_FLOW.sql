-- 1. Check if we have the handle_new_user function
SELECT proname FROM pg_proc WHERE proname = 'handle_new_user';

-- 2. Check if trigger exists on auth.users
SELECT tgname FROM pg_trigger WHERE tgname = 'on_auth_user_created';

-- 3. If trigger doesn't exist, create it
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'on_auth_user_created') THEN
        CREATE TRIGGER on_auth_user_created
          AFTER INSERT ON auth.users
          FOR EACH ROW EXECUTE FUNCTION handle_new_user();
        RAISE NOTICE 'Trigger created successfully';
    ELSE
        RAISE NOTICE 'Trigger already exists';
    END IF;
END $$;

-- 4. Test by checking counts
SELECT 
    (SELECT COUNT(*) FROM auth.users) as auth_users,
    (SELECT COUNT(*) FROM public.users) as public_users;
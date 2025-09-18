-- THIS FIXES THE REGISTRATION ISSUE
-- The auth trigger is missing, so users get created in auth.users but not public.users

-- Create the trigger that syncs auth.users to public.users
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- Verify it was created
SELECT 'Trigger created!' as status;

-- Check if you have any auth users that aren't in public.users
SELECT 
    au.id,
    au.email,
    au.created_at
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL;

-- If the above returns rows, manually sync them:
INSERT INTO public.users (id, email, user_type, account_status)
SELECT 
    au.id,
    au.email,
    'indigenous_business' as user_type,  -- Default type
    'active' as account_status
FROM auth.users au
LEFT JOIN public.users pu ON au.id = pu.id
WHERE pu.id IS NULL
ON CONFLICT (id) DO NOTHING;
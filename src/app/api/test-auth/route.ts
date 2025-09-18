import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test creating a user directly
    const testEmail = `test-${Date.now()}@example.com`;
    const { data, error } = await supabase.auth.admin.createUser({
      email: testEmail,
      password: 'Test123456!',
      email_confirm: true
    });
    
    if (error) {
      return NextResponse.json({ 
        success: false, 
        error: error.message,
        hint: 'This usually means SUPABASE_SERVICE_ROLE_KEY is missing or incorrect'
      });
    }
    
    // Check if user was created in both tables
    const { data: authUser } = await supabase
      .from('users')
      .select('*')
      .eq('email', testEmail)
      .single();
    
    return NextResponse.json({
      success: true,
      authUserCreated: !!data.user,
      publicUserCreated: !!authUser,
      userId: data.user?.id,
      email: testEmail,
      note: 'Check Supabase Auth and public.users table'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
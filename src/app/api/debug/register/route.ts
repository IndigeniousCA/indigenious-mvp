import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Check environment
    const envCheck = {
      hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
      hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
      hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
    };
    
    // Try to create user
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signUp({
      email: body.email,
      password: body.password,
    });
    
    return NextResponse.json({
      success: !error,
      envCheck,
      error: error?.message,
      data: data?.user ? { id: data.user.id, email: data.user.email } : null,
      // Check if trigger exists
      triggerHint: "If user was created in auth.users but not in public.users, the trigger might be missing"
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    }, { status: 500 });
  }
}
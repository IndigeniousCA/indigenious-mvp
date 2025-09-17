import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET() {
  try {
    const supabase = await createClient();
    
    // Test basic connectivity
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      return NextResponse.json({
        status: 'error',
        message: 'Database connection failed',
        error: error.message,
        hint: 'Make sure migrations have been run'
      }, { status: 500 });
    }
    
    return NextResponse.json({
      status: 'success',
      message: 'Connected to Supabase!',
      environment: {
        hasSupabaseUrl: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
        hasAnonKey: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        hasServiceRole: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
        hasStripeKey: !!process.env.STRIPE_SECRET_KEY,
        hasResendKey: !!process.env.RESEND_API_KEY,
      }
    });
  } catch (error) {
    return NextResponse.json({
      status: 'error',
      message: 'Unexpected error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
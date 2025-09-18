import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '@/lib/services/auth.service';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.email || !body.password || !body.userType) {
      return NextResponse.json({
        success: false,
        message: 'Missing required fields'
      }, { status: 400 });
    }

    // Create auth service instance
    const authService = new AuthService();
    
    // Register the user
    const result = await authService.register({
      email: body.email,
      password: body.password,
      phone: body.phone,
      businessName: body.businessName,
      locale: body.locale || 'en',
      termsAccepted: body.termsAccepted,
      userType: body.userType
    });

    // Return the result
    return NextResponse.json(result);
    
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}
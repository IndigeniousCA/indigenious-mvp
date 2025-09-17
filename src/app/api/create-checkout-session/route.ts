import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';
import { createClient } from '@/lib/supabase/server';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-08-27.basil'
});

export async function POST(request: NextRequest) {
  try {
    const { priceId, userType, successUrl, cancelUrl } = await request.json();
    
    if (!priceId || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    
    // Get authenticated user
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    // Get user's business info
    const { data: userProfile } = await supabase
      .from('users')
      .select('stripe_customer_id, email, user_type')
      .eq('id', user.id)
      .single();
    
    // Create or retrieve Stripe customer
    let customerId = userProfile?.stripe_customer_id;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: userProfile?.email || user.email!,
        metadata: {
          supabaseUserId: user.id,
          userType: userType
        }
      });
      customerId = customer.id;
      
      // Update user with Stripe customer ID
      await supabase
        .from('users')
        .update({ stripe_customer_id: customerId })
        .eq('id', user.id);
    }
    
    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [{
        price: priceId,
        quantity: 1,
      }],
      mode: 'subscription',
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/pricing?payment=cancelled`,
      metadata: {
        userId: user.id,
        userType: userType
      },
      // Only collect payment method for Canadian businesses or paid Indigenous tiers
      payment_method_collection: userType === 'canadian_business' ? 'always' : 'if_required',
      subscription_data: {
        metadata: {
          userId: user.id,
          userType: userType
        },
        // Trial period for Indigenous businesses upgrading from free
        trial_period_days: userType === 'indigenous_business' ? 14 : 0,
      }
    });
    
    return NextResponse.json({ url: session.url });
  } catch (error) {
    console.error('Checkout session error:', error);
    return NextResponse.json({ 
      error: error instanceof Error ? error.message : 'Failed to create checkout session' 
    }, { status: 500 });
  }
}
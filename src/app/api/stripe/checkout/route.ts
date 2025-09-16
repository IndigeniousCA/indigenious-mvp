import { NextRequest, NextResponse } from 'next/server';
import { stripe, getPriceId, createProductData, CheckoutMetadata } from '@/lib/stripe';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      tier, 
      billingPeriod, 
      locale = 'en',
      userId,
      businessId,
      successUrl,
      cancelUrl 
    } = body;

    // Validate required fields
    if (!tier || !billingPeriod) {
      return NextResponse.json(
        { error: 'Missing required fields: tier and billingPeriod' },
        { status: 400 }
      );
    }

    // Get the appropriate price ID
    const priceId = getPriceId(tier, billingPeriod);
    
    // Create metadata for the session
    const metadata: CheckoutMetadata = {
      userId,
      businessId,
      tier,
      billingPeriod,
      locale,
    };

    // Get product information
    const productData = createProductData(tier, locale);

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'subscription',
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      metadata: metadata as any,
      success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard?success=true`,
      cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/pricing?canceled=true`,
      allow_promotion_codes: true,
      billing_address_collection: 'required',
      customer_email: body.email,
      locale: locale === 'fr' ? 'fr' : 'en',
      subscription_data: {
        metadata: metadata as any,
        trial_period_days: tier === 'growth' ? 14 : undefined, // 14-day trial for Growth tier
      },
      // Add custom fields for business information
      custom_fields: [
        {
          key: 'business_name',
          label: {
            type: 'custom',
            custom: locale === 'fr' ? 'Nom de l\'entreprise' : 'Business Name',
          },
          type: 'text',
          text: {
            minimum_length: 2,
            maximum_length: 100,
          },
        },
        {
          key: 'indigenous_certification',
          label: {
            type: 'custom',
            custom: locale === 'fr' 
              ? 'Numéro de certification autochtone (si applicable)' 
              : 'Indigenous Certification Number (if applicable)',
          },
          type: 'text',
          optional: true,
        },
      ],
    });

    return NextResponse.json({ 
      sessionId: session.id,
      url: session.url 
    });
  } catch (error) {
    console.error('Stripe checkout error:', error);
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    );
  }
}

// Handle preflight requests
export async function OPTIONS(req: NextRequest) {
  return new NextResponse(null, { status: 200 });
}
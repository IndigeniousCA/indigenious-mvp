import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import Stripe from 'stripe';
import { stripe, validateWebhookSignature, WEBHOOK_EVENTS } from '@/lib/stripe';
import { supabase } from '@/lib/supabase';

// Disable body parsing, we need raw body for webhook signature
export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const body = await req.text();
  const hdrs = await headers();
  const signature = hdrs.get('stripe-signature');

  if (!signature) {
    console.error('No stripe signature found');
    return NextResponse.json(
      { error: 'No signature found' },
      { status: 400 }
    );
  }

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    console.error('No webhook secret configured');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = validateWebhookSignature(body, signature, webhookSecret);
  } catch (err) {
    console.error('Webhook signature validation failed:', err);
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    );
  }

  // Handle the event
  try {
    switch (event.type) {
      case WEBHOOK_EVENTS.CHECKOUT_COMPLETED: {
        const session = event.data.object as Stripe.Checkout.Session;
        await handleCheckoutCompleted(session);
        break;
      }

      case WEBHOOK_EVENTS.PAYMENT_FAILED: {
        const invoice = event.data.object as Stripe.Invoice;
        await handlePaymentFailed(invoice);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Webhook handler error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    );
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('Processing checkout.session.completed:', session.id);

  const { userId, businessId, tier, billingPeriod, locale } = session.metadata || {};
  
  if (!businessId) {
    console.error('No businessId in session metadata');
    return;
  }

  // Get the subscription details
  let subscription: Stripe.Subscription;
  try {
    subscription = await stripe.subscriptions.retrieve(
      session.subscription as string
    ) as Stripe.Subscription;
  } catch (error) {
    console.error('Failed to retrieve subscription:', error);
    return;
  }

  // Calculate prices in cents
  const monthlyPriceCents = billingPeriod === 'yearly' 
    ? Math.round((subscription.items.data[0].price.unit_amount || 0) / 12)
    : subscription.items.data[0].price.unit_amount || 0;
  
  const yearlyPriceCents = billingPeriod === 'yearly'
    ? subscription.items.data[0].price.unit_amount || 0
    : (subscription.items.data[0].price.unit_amount || 0) * 12;

  // Create subscription record in database
  const { error: subscriptionError } = await supabase
    .from('subscriptions')
    .insert({
      business_id: businessId,
      tier: tier,
      status: subscription.status,
      monthly_price_cents: monthlyPriceCents,
      yearly_price_cents: yearlyPriceCents,
      is_yearly: billingPeriod === 'yearly',
      stripe_subscription_id: subscription.id,
      stripe_customer_id: subscription.customer as string,
      stripe_price_id: subscription.items.data[0].price.id,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      trial_start: (subscription as any).trial_start 
        ? new Date((subscription as any).trial_start * 1000).toISOString() 
        : null,
      trial_end: (subscription as any).trial_end 
        ? new Date((subscription as any).trial_end * 1000).toISOString() 
        : null,
      features: getFeaturesByTier(tier),
    });

  if (subscriptionError) {
    console.error('Failed to create subscription record:', subscriptionError);
    throw subscriptionError;
  }

  // Update user's locale preference if provided
  if (userId && locale) {
    const { error: userError } = await supabase
      .from('users')
      .update({ locale })
      .eq('id', userId);

    if (userError) {
      console.error('Failed to update user locale:', userError);
    }
  }

  // Log the successful subscription
  await supabase.from('audit_logs').insert({
    user_id: userId,
    business_id: businessId,
    action: 'subscription_created',
    resource_type: 'subscription',
    resource_id: subscription.id,
    changes: {
      tier,
      billingPeriod,
      amount: subscription.items.data[0].price.unit_amount,
    },
  });

  console.log(`Subscription created successfully for business ${businessId}`);
}

async function handlePaymentFailed(invoice: Stripe.Invoice) {
  console.log('Processing invoice.payment_failed:', invoice.id);

  const subscriptionId = (invoice as any).subscription as string;
  if (!subscriptionId) return;

  // Update subscription status in database
  const { error } = await supabase
    .from('subscriptions')
    .update({ status: 'past_due' })
    .eq('stripe_subscription_id', subscriptionId);

  if (error) {
    console.error('Failed to update subscription status:', error);
    return;
  }

  // Get business details for the subscription
  const { data: subscription } = await supabase
    .from('subscriptions')
    .select('business_id')
    .eq('stripe_subscription_id', subscriptionId)
    .single();

  if (subscription) {
    // Log the payment failure
    await supabase.from('audit_logs').insert({
      business_id: subscription.business_id,
      action: 'payment_failed',
      resource_type: 'invoice',
      resource_id: invoice.id,
      changes: {
        amount: (invoice as any).amount_due,
        attempt_count: (invoice as any).attempt_count,
      },
    });

    // After 3 failed attempts, suspend the account
    if ((invoice as any).attempt_count && (invoice as any).attempt_count >= 3) {
      await supabase
        .from('businesses')
        .update({ 
          open_to_partnership: false,
          metadata: { suspended_for_payment: true } 
        })
        .eq('id', subscription.business_id);
    }
  }
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.updated:', subscription.id);

  // Update subscription in database
  const { error } = await supabase
    .from('subscriptions')
    .update({
      status: subscription.status,
      current_period_start: new Date((subscription as any).current_period_start * 1000).toISOString(),
      current_period_end: new Date((subscription as any).current_period_end * 1000).toISOString(),
      cancel_at_period_end: (subscription as any).cancel_at_period_end,
      cancelled_at: (subscription as any).canceled_at 
        ? new Date((subscription as any).canceled_at * 1000).toISOString() 
        : null,
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to update subscription:', error);
  }
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('Processing customer.subscription.deleted:', subscription.id);

  // Update subscription status to cancelled
  const { error } = await supabase
    .from('subscriptions')
    .update({ 
      status: 'cancelled',
      cancelled_at: new Date().toISOString(),
    })
    .eq('stripe_subscription_id', subscription.id);

  if (error) {
    console.error('Failed to cancel subscription:', error);
  }

  // Get business details
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('business_id')
    .eq('stripe_subscription_id', subscription.id)
    .single();

  if (sub) {
    // Log the cancellation
    await supabase.from('audit_logs').insert({
      business_id: sub.business_id,
      action: 'subscription_cancelled',
      resource_type: 'subscription',
      resource_id: subscription.id,
    });
  }
}

function getFeaturesByTier(tier: string) {
  const features = {
    partner: {
      max_partnerships: 20,
      verified_badge: true,
      priority_support: false,
      featured_listing: false,
      api_access: false,
      custom_branding: false,
    },
    growth: {
      max_partnerships: 100,
      verified_badge: true,
      priority_support: true,
      featured_listing: true,
      api_access: false,
      custom_branding: true,
      carbon_tracking: true,
    },
    corporate: {
      max_partnerships: 'unlimited',
      verified_badge: true,
      priority_support: true,
      featured_listing: true,
      api_access: true,
      custom_branding: true,
      carbon_tracking: true,
      dedicated_support: true,
      white_label: true,
    },
  };

  return features[tier as keyof typeof features] || features.partner;
}
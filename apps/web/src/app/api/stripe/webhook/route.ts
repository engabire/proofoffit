import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeConfig } from '@/lib/stripe/config'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      stripeConfig.webhookSecret
    )
  } catch (error: any) {
    console.error('Webhook signature verification failed:', error.message)
    return NextResponse.json(
      { error: 'Invalid signature' },
      { status: 400 }
    )
  }

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const userId = session.metadata?.userId
        const planId = session.metadata?.planId

        if (userId && planId) {
          // Update user subscription in database
          await supabase
            .from('user_subscriptions')
            .upsert({
              user_id: userId,
              plan_id: planId,
              stripe_customer_id: session.customer as string,
              stripe_subscription_id: session.subscription as string,
              status: 'active',
              current_period_start: new Date().toISOString(),
              current_period_end: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 days from now
              updated_at: new Date().toISOString(),
            })

          // Log the event
          await supabase
            .from('action_log')
            .insert({
              action: 'subscription_created',
              objType: 'subscription',
              objId: userId,
              payloadHash: `plan_${planId}`,
            })
        }
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as any).metadata?.userId

        if (userId) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: subscription.status,
              current_period_start: new Date(subscription.current_period_start * 1000).toISOString(),
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)

          // Log the event
          await supabase
            .from('action_log')
            .insert({
              action: 'subscription_updated',
              objType: 'subscription',
              objId: userId,
              payloadHash: `status_${subscription.status}`,
            })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as any).metadata?.userId

        if (userId) {
          await supabase
            .from('user_subscriptions')
            .update({
              status: 'canceled',
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userId)

          // Log the event
          await supabase
            .from('action_log')
            .insert({
              action: 'subscription_canceled',
              objType: 'subscription',
              objId: userId,
              payloadHash: 'subscription_canceled',
            })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as any).metadata?.userId

        if (userId) {
          // Log successful payment
          await supabase
            .from('action_log')
            .insert({
              action: 'payment_succeeded',
              objType: 'payment',
              objId: userId,
              payloadHash: `invoice_${invoice.id}`,
            })
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Get user ID from customer metadata
        const customer = await stripe.customers.retrieve(customerId)
        const userId = (customer as any).metadata?.userId

        if (userId) {
          // Log failed payment
          await supabase
            .from('action_log')
            .insert({
              action: 'payment_failed',
              objType: 'payment',
              objId: userId,
              payloadHash: `invoice_${invoice.id}`,
            })
        }
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error: any) {
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}
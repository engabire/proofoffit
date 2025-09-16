import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'
import Stripe from 'stripe'

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Only initialize Stripe if environment variables are available
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2023-10-16' })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET

export async function POST(req: NextRequest) {
  try {
    // Check if required environment variables are available
    if (!stripe || !webhookSecret) {
      console.error('Missing required environment variables for Stripe webhook')
      return NextResponse.json({ error: 'Webhook not configured' }, { status: 503 })
    }

    const body = await req.text()
    const signature = req.headers.get('stripe-signature')!

    let event: Stripe.Event

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret)
    } catch (err: any) {
      console.error('Webhook signature verification failed:', err.message)
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
    }

    // Only create Supabase client if environment variables are available
    let supabase = null
    if (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      try {
        const { createClientComponentClient } = await import('@supabase/auth-helpers-nextjs')
        supabase = createClientComponentClient()
      } catch (error) {
        console.error('Failed to create Supabase client:', error)
        return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
      }
    }

    if (!supabase) {
      console.error('Supabase not configured - webhook cannot process events')
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_email || session.customer_details?.email
        
        if (!customerEmail) {
          console.error('No customer email found in checkout session')
          break
        }

        // Find tenant by email
        const { data: user } = await supabase
          .from('users')
          .select('tenantId')
          .eq('email', customerEmail)
          .single()

        if (!user) {
          console.error('No user found for email:', customerEmail)
          break
        }

        const planId = session.metadata?.planId || 'free'
        const subscriptionId = session.subscription as string

        // Update tenant plan
        await stripeService.updateTenantPlan(user.tenantId, planId, subscriptionId)
        break
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get customer details
        const customer = await stripe.customers.retrieve(customerId)
        if (customer.deleted) break

        const customerEmail = customer.email
        if (!customerEmail) break

        // Find tenant by email
        const { data: user } = await supabase
          .from('users')
          .select('tenantId')
          .eq('email', customerEmail)
          .single()

        if (!user) break

        // Determine plan based on subscription
        const planId = determinePlanFromSubscription(subscription)
        
        // Update tenant plan
        await stripeService.updateTenantPlan(user.tenantId, planId, subscription.id)
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        const customerId = subscription.customer as string

        // Get customer details
        const customer = await stripe.customers.retrieve(customerId)
        if (customer.deleted) break

        const customerEmail = customer.email
        if (!customerEmail) break

        // Find tenant by email
        const { data: user } = await supabase
          .from('users')
          .select('tenantId')
          .eq('email', customerEmail)
          .single()

        if (!user) break

        // Downgrade to free plan
        await stripeService.updateTenantPlan(user.tenantId, 'free')
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        const customerId = invoice.customer as string

        // Get customer details
        const customer = await stripe.customers.retrieve(customerId)
        if (customer.deleted) break

        const customerEmail = customer.email
        if (!customerEmail) break

        // Find tenant by email
        const { data: user } = await supabase
          .from('users')
          .select('tenantId')
          .eq('email', customerEmail)
          .single()

        if (!user) break

        // Log payment failure
        await supabase
          .from('action_log')
          .insert({
            tenantId: user.tenantId,
            actorType: 'system',
            actorId: 'stripe_webhook',
            action: 'payment_failed',
            objType: 'subscription',
            objId: invoice.subscription as string,
            payloadHash: await hashPayload({
              invoiceId: invoice.id,
              amount: invoice.amount_due,
              timestamp: new Date().toISOString()
            })
          })

        // TODO: Send notification email to user
        break
      }

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

function determinePlanFromSubscription(subscription: Stripe.Subscription): string {
  const priceId = subscription.items.data[0]?.price.id
  
  // Map Stripe price IDs to plan IDs
  // In production, you'd store these mappings in your database
  const priceToPlanMap: Record<string, string> = {
    'price_pro_monthly': 'pro',
    'price_pro_plus_monthly': 'pro_plus',
    'price_team_monthly': 'team',
    'price_per_slate': 'per_slate',
  }

  return priceToPlanMap[priceId] || 'free'
}

async function hashPayload(payload: any): Promise<string> {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(payload))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}
import { NextRequest, NextResponse } from 'next/server'
import { stripeService } from '@/lib/stripe'
import { giftingStripe } from '@/lib/gifting/stripe'
import { sendGiftCreatedEmails } from '@/lib/email/send'
import { env } from '@/lib/env'
import Stripe from 'stripe'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering to prevent build-time issues
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

// Only initialize Stripe if environment variables are available
const stripeSecret = process.env.STRIPE_SECRET_KEY || env.stripe.secretKey
const stripe = stripeSecret
  ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' })
  : null

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || env.stripe.webhookSecret

const supabaseUrl = env.supabase.url || process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseServiceRoleKey = env.supabase.serviceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY

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

    if (!supabaseUrl || !supabaseServiceRoleKey) {
      console.error('Missing Supabase service role credentials for Stripe webhook')
      return NextResponse.json({ error: 'Database not configured' }, { status: 503 })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: { persistSession: false },
    })

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session
        const customerEmail = session.customer_email || session.customer_details?.email
        const metadata = (session.metadata ?? {}) as Record<string, string>

        if (metadata['gift_code']) {
          const code = metadata['gift_code']
          const months = parseInt(metadata['gift_months'] || '0', 10)

          if (!code || Number.isNaN(months) || months <= 0) {
            console.error('Invalid gift metadata on checkout session', metadata)
            break
          }

          try {
            const { couponId, promotionCodeId } = await giftingStripe.createGiftPromotion({
              code,
              months,
              metadata: {
                checkout_session_id: session.id,
                sponsor_user_id: metadata['gift_sponsor_user_id'] || '',
                recipient_email: metadata['gift_recipient_email'] || '',
              },
            })

            const amountCents = metadata['gift_amount_cents']
              ? parseInt(metadata['gift_amount_cents'], 10)
              : typeof session.amount_total === 'number'
                ? session.amount_total
                : null

            if (!amountCents || Number.isNaN(amountCents) || amountCents <= 0) {
              console.error('Unable to determine gift amount for session', session.id)
              await giftingStripe.cancelGiftPromotion({
                promotionCodeId,
                couponId,
              })
              break
            }

            const { error: insertError } = await supabase
              .from('gift_codes')
              .insert({
                code,
                months,
                currency: (session.currency || metadata['gift_currency'] || 'usd').toUpperCase(),
                amount_cents: amountCents,
                sponsor_user_id: metadata['gift_sponsor_user_id'] || null,
                recipient_email: metadata['gift_recipient_email'] || null,
                message: metadata['gift_message'] || null,
                stripe_coupon_id: couponId,
                stripe_promotion_code_id: promotionCodeId,
              })

            if (insertError) {
              console.error('Failed to persist gift code:', insertError)
              await giftingStripe.cancelGiftPromotion({
                promotionCodeId,
                couponId,
              })
              break
            }

            if (metadata['gift_sponsor_tenant_id']) {
              const { error: auditError } = await supabase
                .from('action_log')
                .insert({
                  tenantId: metadata['gift_sponsor_tenant_id'],
                  actorType: 'system',
                  actorId: 'stripe_webhook',
                  action: 'gift_code_created',
                  objType: 'gift_code',
                  objId: code,
                  payloadHash: await hashPayload({
                    code,
                    months,
                    amountCents,
                    couponId,
                    promotionCodeId,
                    checkoutSessionId: session.id,
                    createdAt: new Date().toISOString(),
                  }),
                })

              if (auditError) {
                console.error('Failed to write gift creation audit log', auditError)
              }
            }

            if (metadata['gift_sponsor_user_email']) {
              await sendGiftCreatedEmails({
                code,
                months,
                amountCents,
                currency: (session.currency || metadata['gift_currency'] || 'usd').toUpperCase(),
                sponsorEmail: metadata['gift_sponsor_user_email'],
                recipientEmail: metadata['gift_recipient_email'] || null,
                message: metadata['gift_message'] || null,
              })
            }
          } catch (error) {
            console.error('Failed to create Stripe promotion for gift:', error)
          }

          break
        }
        
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

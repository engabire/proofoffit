import { NextRequest, NextResponse } from 'next/server'
import { stripe, stripeServer, subscriptionPlans } from '@/lib/stripe/config'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { planId, userId, userEmail } = await request.json()

    if (!planId || !userId || !userEmail) {
      return NextResponse.json(
        { error: 'Missing required fields: planId, userId, userEmail' },
        { status: 400 }
      )
    }

    // Get plan details
    const plan = Object.values(subscriptionPlans.candidate)
      .concat(Object.values(subscriptionPlans.employer))
      .find(p => p.id === planId)

    if (!plan) {
      return NextResponse.json(
        { error: 'Invalid plan ID' },
        { status: 400 }
      )
    }

    // Get or create Stripe customer
    const customer = await stripeServer.getOrCreateCustomer(userEmail, userId)

    // Create Stripe price if it doesn't exist
    let priceId: string
    if (plan.price === 0) {
      // Free plan - create a $0 price
      const prices = await stripe.prices.list({
        product: plan.id,
        active: true,
        limit: 1,
      })

      if (prices.data.length === 0) {
        const product = await stripe.products.create({
          id: plan.id,
          name: plan.name,
          description: `ProofOfFit ${plan.name} Plan`,
        })

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: 0,
          currency: 'usd',
          recurring: {
            interval: plan.interval as 'month' | 'year',
          },
        })

        priceId = price.id
      } else {
        priceId = prices.data[0].id
      }
    } else {
      // Paid plan - create price
      const prices = await stripe.prices.list({
        product: plan.id,
        active: true,
        limit: 1,
      })

      if (prices.data.length === 0) {
        const product = await stripe.products.create({
          id: plan.id,
          name: plan.name,
          description: `ProofOfFit ${plan.name} Plan`,
        })

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: Math.round(plan.price * 100), // Convert to cents
          currency: 'usd',
          recurring: {
            interval: plan.interval as 'month' | 'year',
          },
        })

        priceId = price.id
      } else {
        priceId = prices.data[0].id
      }
    }

    // Create checkout session
    const session = await stripe.checkout.sessions.create({
      customer: customer.id,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: plan.price === 0 ? 'payment' : 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.proofoffit.com'}/dashboard?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://www.proofoffit.com'}/pricing?canceled=true`,
      metadata: {
        userId: userId,
        planId: planId,
      },
    })

    return NextResponse.json({ sessionId: session.id })

  } catch (error: any) {
    console.error('Stripe checkout session error:', error)
    return NextResponse.json(
      { error: 'Failed to create checkout session' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { giftingStripe } from '@/lib/gifting/stripe'
import { isSupabaseConfigured, env } from '@/lib/env'

const PRICE_PER_MONTH_CENTS = 1200
const MAX_MONTHS = 6

function generateGiftCode() {
  const alphabet = '23456789ABCDEFGHJKLMNPQRSTUVWXYZ'
  const block = () => Array.from({ length: 4 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join('')
  return `PF-${block()}-${block()}`
}

export async function POST(request: NextRequest) {
  if (!env.stripe.secretKey) {
    return NextResponse.json({ error: 'Stripe not configured' }, { status: 503 })
  }

  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  try {
    const { months, recipientEmail, message } = await request.json()

    const monthsInt = typeof months === 'number' ? months : parseInt(months, 10)
    if (!Number.isInteger(monthsInt) || monthsInt < 1 || monthsInt > MAX_MONTHS) {
      return NextResponse.json({ error: 'Invalid months selection' }, { status: 400 })
    }

    if (recipientEmail && typeof recipientEmail !== 'string') {
      return NextResponse.json({ error: 'Invalid recipient email' }, { status: 400 })
    }

    if (message && typeof message !== 'string') {
      return NextResponse.json({ error: 'Invalid message' }, { status: 400 })
    }

    const supabase = createRouteHandlerClient({ cookies })
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user || !user.email) {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
    }

    const { data: sponsorProfile } = await supabase
      .from('users')
      .select('tenantId')
      .eq('id', user.id)
      .single()

    const code = generateGiftCode()
    const origin = request.headers.get('origin') || env.app.url || 'http://localhost:3000'
    const amountCents = monthsInt * PRICE_PER_MONTH_CENTS

    const metadata: Record<string, string> = {
      gift_code: code,
      gift_months: monthsInt.toString(),
      gift_amount_cents: amountCents.toString(),
      gift_currency: 'USD',
      gift_sponsor_user_id: user.id,
      gift_sponsor_user_email: user.email,
    }

    const normalizedRecipient = typeof recipientEmail === 'string' ? recipientEmail.trim().toLowerCase() : ''
    if (normalizedRecipient) {
      metadata.gift_recipient_email = normalizedRecipient
    }

    const normalizedMessage = typeof message === 'string' ? message.trim() : ''
    if (normalizedMessage) {
      metadata.gift_message = normalizedMessage.slice(0, 250)
    }

    if (sponsorProfile?.tenantId) {
      metadata.gift_sponsor_tenant_id = sponsorProfile.tenantId
    }

    const session = await giftingStripe.createGiftCheckoutSession({
      amountCents,
      currency: 'usd',
      sponsorEmail: user.email,
      successUrl: `${origin}/gift/success?code=${code}&months=${monthsInt}`,
      cancelUrl: `${origin}/gift?cancelled=true`,
      metadata,
    })

    if (!session.url) {
      return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
    }

    return NextResponse.json({ checkoutUrl: session.url, code })
  } catch (error) {
    console.error('Failed to start gift checkout:', error)
    return NextResponse.json({ error: 'Failed to create checkout session' }, { status: 500 })
  }
}

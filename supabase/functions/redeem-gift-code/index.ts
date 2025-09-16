import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.38.4?dts'
import Stripe from 'npm:stripe@14.25.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const stripeSecret = Deno.env.get('STRIPE_SECRET_KEY')
const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseServiceRole = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
const proPriceId = Deno.env.get('STRIPE_PRO_PRICE_ID')

const stripe = stripeSecret ? new Stripe(stripeSecret, { apiVersion: '2023-10-16' }) : null

const RATE_LIMIT_WINDOW_MS = 60_000
const RATE_LIMIT_MAX_ATTEMPTS = 5

const limiter = new Map<string, { count: number; resetAt: number }>()

function checkRateLimit(key: string) {
  const now = Date.now()
  const entry = limiter.get(key)
  if (!entry || entry.resetAt < now) {
    limiter.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS })
    return { allowed: true }
  }

  if (entry.count >= RATE_LIMIT_MAX_ATTEMPTS) {
    return { allowed: false, retryAfter: Math.ceil((entry.resetAt - now) / 1000) }
  }

  entry.count += 1
  limiter.set(key, entry)
  return { allowed: true }
}

async function hashPayload(payload: Record<string, unknown>) {
  const encoder = new TextEncoder()
  const data = encoder.encode(JSON.stringify(payload))
  const hashBuffer = await crypto.subtle.digest('SHA-256', data)
  const hashArray = Array.from(new Uint8Array(hashBuffer))
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
}

serve(async req => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { ...corsHeaders, 'Access-Control-Allow-Methods': 'POST,OPTIONS' } })
  }

  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405, headers: corsHeaders })
  }

  if (!stripe || !supabaseUrl || !supabaseServiceRole || !proPriceId) {
    console.error('Redeem gift function missing required configuration')
    return new Response(JSON.stringify({ error: 'Service unavailable' }), {
      status: 503,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const requestBody = await req.json().catch(() => null)
  if (!requestBody || !requestBody.code) {
    return new Response(JSON.stringify({ error: 'Missing gift code' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const supabase = createClient(supabaseUrl, supabaseServiceRole, {
    global: {
      headers: { Authorization: authHeader },
    },
  })

  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser()

  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const requesterEmail = (requestBody.email || user.email || '').toLowerCase()
  const clientIp = req.headers.get('x-forwarded-for') || req.headers.get('cf-connecting-ip') || 'unknown'
  const rateKey = `${user.id}:${clientIp}`
  const rateCheck = checkRateLimit(rateKey)
  if (!rateCheck.allowed) {
    return new Response(JSON.stringify({ error: 'Too many attempts', retryAfter: rateCheck.retryAfter }), {
      status: 429,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const code = String(requestBody.code).trim().toUpperCase()

  const { data: gift, error: giftError } = await supabase
    .from('gift_codes')
    .select('*')
    .eq('code', code)
    .single()

  if (giftError || !gift) {
    return new Response(JSON.stringify({ error: 'Gift code not found' }), {
      status: 404,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (gift.status !== 'active') {
    return new Response(JSON.stringify({ error: 'Gift code is not active' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (gift.expires_at && new Date(gift.expires_at) < new Date()) {
    await supabase
      .from('gift_codes')
      .update({ status: 'expired' })
      .eq('id', gift.id)

    return new Response(JSON.stringify({ error: 'Gift code expired' }), {
      status: 410,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (gift.recipient_email) {
    const expected = gift.recipient_email.toLowerCase()
    const comparison = requesterEmail || expected
    if (expected !== comparison) {
      return new Response(JSON.stringify({ error: 'Gift code reserved for another recipient' }), {
        status: 403,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }
  }

  const { data: existingActive } = await supabase
    .from('gift_codes')
    .select('id')
    .eq('redeemed_by', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (existingActive) {
    return new Response(JSON.stringify({ error: 'You already have an active gift to redeem' }), {
      status: 409,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  if (!gift.stripe_promotion_code_id) {
    return new Response(JSON.stringify({ error: 'Gift promotion missing' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  let customerId: string | undefined
  const lookup = await stripe.customers.list({ email: requesterEmail || user.email || undefined, limit: 1 })
  if (lookup.data.length > 0) {
    customerId = lookup.data[0].id
  } else {
    const created = await stripe.customers.create({
      email: requesterEmail || user.email || undefined,
      metadata: {
        supabase_user_id: user.id,
      },
    })
    customerId = created.id
  }

  let subscription
  const existingSubscriptions = await stripe.subscriptions.list({
    customer: customerId,
    status: 'active',
    limit: 1,
    expand: ['data.items'],
  })

  if (existingSubscriptions.data.length > 0) {
    subscription = await stripe.subscriptions.update(existingSubscriptions.data[0].id, {
      promotion_code: gift.stripe_promotion_code_id,
      proration_behavior: 'none',
    })
  } else {
    subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: proPriceId }],
      promotion_code: gift.stripe_promotion_code_id,
      collection_method: 'charge_automatically',
      payment_behavior: 'allow_incomplete',
    })
  }

  const redeemedAt = new Date().toISOString()
  const { error: updateError } = await supabase
    .from('gift_codes')
    .update({
      status: 'redeemed',
      redeemed_by: user.id,
      redeemed_at: redeemedAt,
      stripe_subscription_id: subscription.id,
    })
    .eq('id', gift.id)

  if (updateError) {
    console.error('Failed to update gift redemption record', updateError)
    return new Response(JSON.stringify({ error: 'Failed to redeem gift' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }

  const { data: redeemerProfile } = await supabase
    .from('users')
    .select('tenantId')
    .eq('id', user.id)
    .single()

  if (redeemerProfile?.tenantId) {
    const payload = {
      code,
      months: gift.months,
      subscriptionId: subscription.id,
      promotionCodeId: gift.stripe_promotion_code_id,
      redeemedAt,
    }

    const payloadHash = await hashPayload(payload)
    const { error: auditError } = await supabase
      .from('action_log')
      .insert({
        tenantId: redeemerProfile.tenantId,
        actorType: 'user',
        actorId: user.id,
        action: 'gift_code_redeemed',
        objType: 'gift_code',
        objId: code,
        payloadHash,
      })

    if (auditError) {
      console.error('Failed to log gift redemption', auditError)
    }
  }

  const entitlementEnd = subscription.current_period_end
    ? new Date(subscription.current_period_end * 1000).toISOString()
    : null

  return new Response(
    JSON.stringify({
      subscriptionId: subscription.id,
      currentPeriodEnd: entitlementEnd,
      monthsGranted: gift.months,
    }),
    {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    },
  )
})

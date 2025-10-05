import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { env, isSupabaseConfigured } from '@/lib/env'

export async function POST(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return NextResponse.json({ error: 'Supabase not configured' }, { status: 503 })
  }

  const supabase = createRouteHandlerClient({ cookies: async () => cookies() })
  const [{ data: sessionData }, { data: userData }] = await Promise.all([
    supabase.auth.getSession(),
    supabase.auth.getUser(),
  ])

  const session = sessionData.session
  if (!session || !userData.user) {
    return NextResponse.json({ error: 'Authentication required' }, { status: 401 })
  }

  let body: { code?: string; email?: string }
  try {
    body = await request.json()
  } catch (error) {
    return NextResponse.json({ error: 'Invalid request payload' }, { status: 400 })
  }

  const code = body.code?.trim().toUpperCase()
  if (!code) {
    return NextResponse.json({ error: 'Gift code required' }, { status: 400 })
  }

  const functionUrl = `${env.supabase.url}/functions/v1/redeem-gift-code`

  try {
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.access_token}`,
        apikey: env.supabase.anonKey,
        'x-client-info': 'gift-redeem-route',
      },
      body: JSON.stringify({
        code,
        email: body.email?.trim() || userData.user.email,
      }),
    })

    const payload = await response.json().catch(() => ({ error: 'Invalid response' }))

    if (!response.ok) {
      return NextResponse.json(payload, { status: response.status })
    }

    return NextResponse.json(payload)
  } catch (error) {
    console.error('Redeem gift API error', error)
    return NextResponse.json({ error: 'Unable to redeem gift' }, { status: 500 })
  }
}

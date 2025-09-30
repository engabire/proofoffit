import { NextRequest, NextResponse } from 'next/server'
import { googleOAuth, isGoogleOAuthConfigured } from '@/lib/auth/google-oauth'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    // Check if Google OAuth is configured
    if (!isGoogleOAuthConfigured()) {
      return NextResponse.json(
        { error: 'Google OAuth is not configured. Please contact support.' },
        { status: 503 }
      )
    }
    const { searchParams } = new URL(request.url)
    const code = searchParams.get('code')
    const state = searchParams.get('state')

    if (!code) {
      return NextResponse.json(
        { error: 'Authorization code is required' },
        { status: 400 }
      )
    }

    // Exchange code for tokens
    const tokens = await googleOAuth.exchangeCodeForTokens(code)
    
    // Get user info from Google
    const userInfo = await googleOAuth.getUserInfo(tokens.access_token)

    // Initialize Supabase client
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Check if user already exists
    const { data: existingUser, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('email', userInfo.email)
      .single()

    let userId: string

    if (existingUser) {
      // Update existing user with Google info
      const { error: updateError } = await supabase
        .from('users')
        .update({
          google_id: userInfo.id,
          avatar_url: userInfo.picture,
          updated_at: new Date().toISOString(),
        })
        .eq('id', existingUser.id)

      if (updateError) {
        console.error('Error updating user:', updateError)
        return NextResponse.json(
          { error: 'Failed to update user' },
          { status: 500 }
        )
      }

      userId = existingUser.id
    } else {
      // Create new user
      const { data: newUser, error: createError } = await supabase
        .from('users')
        .insert({
          email: userInfo.email,
          full_name: userInfo.name,
          avatar_url: userInfo.picture,
          google_id: userInfo.id,
          email_verified: userInfo.verified_email,
          auth_provider: 'google',
        })
        .select()
        .single()

      if (createError) {
        console.error('Error creating user:', createError)
        return NextResponse.json(
          { error: 'Failed to create user' },
          { status: 500 }
        )
      }

      userId = newUser.id
    }

    // Create or update OAuth tokens
    await supabase
      .from('oauth_tokens')
      .upsert({
        user_id: userId,
        provider: 'google',
        access_token: tokens.access_token,
        refresh_token: tokens.refresh_token,
        expires_at: new Date(Date.now() + tokens.expires_in * 1000).toISOString(),
        scope: tokens.scope,
        updated_at: new Date().toISOString(),
      })

    // Log successful authentication
    await supabase
      .from('action_log')
      .insert({
        action: 'oauth_signin_success',
        objType: 'user',
        objId: userId,
        payloadHash: `google_${userInfo.id}`,
      })

    // Redirect to dashboard with success
    const redirectUrl = new URL('/dashboard', request.url)
    redirectUrl.searchParams.set('auth', 'success')
    redirectUrl.searchParams.set('provider', 'google')

    return NextResponse.redirect(redirectUrl)

  } catch (error: any) {
    console.error('Google OAuth error:', error)
    
    // Redirect to sign-in with error
    const redirectUrl = new URL('/auth/signin', request.url)
    redirectUrl.searchParams.set('error', 'oauth_failed')
    redirectUrl.searchParams.set('provider', 'google')

    return NextResponse.redirect(redirectUrl)
  }
}

// Export dynamic configuration to prevent build-time evaluation
export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { generateSSOAuthUrl, exchangeCodeForToken, getSSOProvider } from '@/lib/sso-config'
import { detectEnterpriseDomain } from '@/lib/enterprise-domains'

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const provider = searchParams.get('provider')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  if (!provider || !redirectUri) {
    return NextResponse.json(
      { error: 'Missing required parameters' },
      { status: 400 }
    )
  }

  const ssoProvider = getSSOProvider(provider)
  if (!ssoProvider) {
    return NextResponse.json(
      { error: 'Invalid SSO provider' },
      { status: 400 }
    )
  }

  const authUrl = generateSSOAuthUrl(provider, redirectUri, state || undefined)
  if (!authUrl) {
    return NextResponse.json(
      { error: 'Failed to generate authorization URL' },
      { status: 500 }
    )
  }

  return NextResponse.json({ authUrl })
}

export async function POST(request: NextRequest) {
  try {
    const { provider, code, redirectUri, email } = await request.json()

    if (!provider || !code || !redirectUri) {
      return NextResponse.json(
        { error: 'Missing required parameters' },
        { status: 400 }
      )
    }

    // Exchange code for token and user info
    const result = await exchangeCodeForToken(provider, code, redirectUri)
    if (!result) {
      return NextResponse.json(
        { error: 'Failed to exchange code for token' },
        { status: 400 }
      )
    }

    const { accessToken, userInfo } = result

    // Create Supabase client
    const supabase = createRouteHandlerClient({ cookies })

    // Check if user exists
    const { data: existingUser } = await supabase.auth.getUser()

    if (existingUser.user) {
      // User already authenticated, update their profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          ssoProvider: provider,
          ssoId: userInfo.id || userInfo.sub,
          lastLoginAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        })
        .eq('userId', existingUser.user.id)

      if (updateError) {
        console.error('Error updating user profile:', updateError)
      }
    } else {
      // Create new user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: userInfo.email,
        password: crypto.randomUUID(), // Random password since we're using SSO
        options: {
          data: {
            ssoProvider: provider,
            ssoId: userInfo.id || userInfo.sub,
            role: 'candidate', // Default role, can be updated later
            authMethod: 'sso'
          }
        }
      })

      if (authError) {
        console.error('Error creating user:', authError)
        return NextResponse.json(
          { error: 'Failed to create user account' },
          { status: 500 }
        )
      }

      // Create user profile
      if (authData.user) {
        const enterprise = detectEnterpriseDomain(userInfo.email)
        
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            userId: authData.user.id,
            email: userInfo.email,
            role: 'candidate',
            status: 'active',
            ssoProvider: provider,
            ssoId: userInfo.id || userInfo.sub,
            isEnterprise: !!enterprise,
            enterpriseDomain: enterprise?.domain || null,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          })

        if (profileError) {
          console.error('Error creating user profile:', profileError)
        }
      }
    }

    // Log successful SSO authentication
    try {
      await supabase
        .from('action_log')
        .insert({
          tenantId: existingUser.user?.id || 'new_user',
          actorType: 'user',
          actorId: existingUser.user?.id || 'new_user',
          action: 'sso_auth_success',
          objType: 'user',
          objId: existingUser.user?.id || 'new_user',
          payloadHash: `sso_${provider}_success`
        })
    } catch (error) {
      console.error('Failed to log SSO authentication:', error)
    }

    return NextResponse.json({
      success: true,
      user: userInfo,
      redirectTo: '/dashboard'
    })

  } catch (error) {
    console.error('SSO authentication error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

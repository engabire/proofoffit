import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { generateSSOAuthUrl, exchangeCodeForToken, getSSOProvider } from '@/lib/sso-config'
import { detectEnterpriseDomain } from '@/lib/enterprise-domains'
import { withHandler, UserInputError } from '@/lib/api/withHandler'
import { log } from '@/lib/log'

export const GET = withHandler(async (req: NextRequest) => {
  const { searchParams } = new URL(req.url)
  const provider = searchParams.get('provider')
  const redirectUri = searchParams.get('redirect_uri')
  const state = searchParams.get('state')

  if (!provider || !redirectUri) {
    throw new UserInputError('Missing required parameters')
  }

  const ssoProvider = getSSOProvider(provider)
  if (!ssoProvider) {
    throw new UserInputError('Invalid SSO provider')
  }

  const authUrl = generateSSOAuthUrl(provider, redirectUri, state || undefined)
  if (!authUrl) {
    throw new Error('Failed to generate authorization URL')
  }

  log.info('Generated SSO auth URL', { provider })
  return NextResponse.json({ success: true, authUrl })
})

export const POST = withHandler(async (req: NextRequest) => {
  const body = await req.json().catch(() => ({}))
  const { provider, code, redirectUri } = body || {}

  if (!provider || !code || !redirectUri) {
    throw new UserInputError('Missing required parameters')
  }

  const result = await exchangeCodeForToken(provider, code, redirectUri)
  if (!result) {
    throw new UserInputError('Failed to exchange code for token')
  }

  const { userInfo } = result

  // Provide async cookies accessor to satisfy newer auth-helpers types
  const supabase = createRouteHandlerClient({ cookies: async () => cookies() })
  const { data: existingUser } = await supabase.auth.getUser()

  if (existingUser.user) {
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        ssoProvider: provider,
        ssoId: userInfo.id || userInfo.sub,
        lastLoginAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      })
      .eq('userId', existingUser.user.id)
    if (updateError) {
      log.warn('Failed to update existing SSO user profile', { err: updateError.message })
    }
  } else {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userInfo.email,
      password: crypto.randomUUID(),
      options: {
        data: {
          ssoProvider: provider,
          ssoId: userInfo.id || userInfo.sub,
          role: 'candidate',
          authMethod: 'sso',
        },
      },
    })
    if (authError) {
      throw new Error('Failed to create user account')
    }

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
          updatedAt: new Date().toISOString(),
        })
      if (profileError) {
        log.warn('Failed to create SSO user profile', { err: profileError.message })
      }
    }
  }

  // Best-effort action log; don't block on errors
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
        payloadHash: `sso_${provider}_success`,
      })
  } catch (e: any) {
    log.warn('Failed to write action_log for SSO auth', { err: e.message })
  }

  log.info('SSO authentication success', { provider, email: userInfo.email })
  return NextResponse.json({ success: true, user: userInfo, redirectTo: '/dashboard' })
})

/**
 * SSO Configuration for Enterprise Authentication
 * 
 * This module handles SSO provider configuration and integration
 */

export interface SSOProvider {
  id: string
  name: string
  type: 'oauth' | 'saml' | 'oidc'
  clientId: string
  clientSecret?: string
  authorizationUrl: string
  tokenUrl: string
  userInfoUrl: string
  scopes: string[]
  icon?: string
  primaryColor?: string
}

export const SSO_PROVIDERS: Record<string, SSOProvider> = {
  google: {
    id: 'google',
    name: 'Google',
    type: 'oauth',
    clientId: process.env.GOOGLE_CLIENT_ID || '',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    authorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
    tokenUrl: 'https://oauth2.googleapis.com/token',
    userInfoUrl: 'https://www.googleapis.com/oauth2/v2/userinfo',
    scopes: ['openid', 'email', 'profile'],
    icon: 'google',
    primaryColor: '#4285f4'
  },
  microsoft: {
    id: 'microsoft',
    name: 'Microsoft',
    type: 'oauth',
    clientId: process.env.MICROSOFT_CLIENT_ID || '',
    clientSecret: process.env.MICROSOFT_CLIENT_SECRET,
    authorizationUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/authorize',
    tokenUrl: 'https://login.microsoftonline.com/common/oauth2/v2.0/token',
    userInfoUrl: 'https://graph.microsoft.com/v1.0/me',
    scopes: ['openid', 'email', 'profile'],
    icon: 'microsoft',
    primaryColor: '#0078d4'
  },
  okta: {
    id: 'okta',
    name: 'Okta',
    type: 'oidc',
    clientId: process.env.OKTA_CLIENT_ID || '',
    clientSecret: process.env.OKTA_CLIENT_SECRET,
    authorizationUrl: `${process.env.OKTA_DOMAIN}/oauth2/default/v1/authorize`,
    tokenUrl: `${process.env.OKTA_DOMAIN}/oauth2/default/v1/token`,
    userInfoUrl: `${process.env.OKTA_DOMAIN}/oauth2/default/v1/userinfo`,
    scopes: ['openid', 'email', 'profile'],
    icon: 'okta',
    primaryColor: '#007dc1'
  }
}

/**
 * Get SSO provider configuration
 */
export function getSSOProvider(providerId: string): SSOProvider | null {
  return SSO_PROVIDERS[providerId] || null
}

/**
 * Generate SSO authorization URL
 */
export function generateSSOAuthUrl(providerId: string, redirectUri: string, state?: string): string | null {
  const provider = getSSOProvider(providerId)
  if (!provider) return null

  const params = new URLSearchParams({
    client_id: provider.clientId,
    redirect_uri: redirectUri,
    response_type: 'code',
    scope: provider.scopes.join(' '),
    ...(state && { state })
  })

  return `${provider.authorizationUrl}?${params.toString()}`
}

/**
 * Exchange authorization code for access token
 */
export async function exchangeCodeForToken(
  providerId: string, 
  code: string, 
  redirectUri: string
): Promise<{ accessToken: string; userInfo: any } | null> {
  const provider = getSSOProvider(providerId)
  if (!provider) return null

  try {
    // Exchange code for token
    const tokenResponse = await fetch(provider.tokenUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: provider.clientId,
        client_secret: provider.clientSecret || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    })

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for token')
    }

    const tokenData = await tokenResponse.json()
    const accessToken = tokenData.access_token

    // Get user info
    const userInfoResponse = await fetch(provider.userInfoUrl, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!userInfoResponse.ok) {
      throw new Error('Failed to get user info')
    }

    const userInfo = await userInfoResponse.json()

    return { accessToken, userInfo }
  } catch (error) {
    console.error('SSO token exchange error:', error)
    return null
  }
}

/**
 * Validate SSO configuration
 */
export function validateSSOConfig(): { valid: boolean; errors: string[] } {
  const errors: string[] = []

  Object.entries(SSO_PROVIDERS).forEach(([id, provider]) => {
    if (!provider.clientId) {
      errors.push(`${provider.name}: Missing client ID`)
    }
    if (provider.type === 'oauth' && !provider.clientSecret) {
      errors.push(`${provider.name}: Missing client secret`)
    }
    if (id === 'okta' && !process.env.OKTA_DOMAIN) {
      errors.push('Okta: Missing domain configuration')
    }
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

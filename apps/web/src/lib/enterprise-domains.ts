/**
 * Enterprise Domain Configuration
 * 
 * This module handles enterprise domain detection and SSO provider mapping
 */

export interface EnterpriseDomain {
  domain: string
  name: string
  ssoProvider: 'google' | 'microsoft' | 'okta' | 'custom'
  logo?: string
  primaryColor?: string
  features: {
    sso: boolean
    mfa: boolean
    auditLogs: boolean
    customRoles: boolean
  }
}

export const ENTERPRISE_DOMAINS: EnterpriseDomain[] = [
  {
    domain: 'microsoft.com',
    name: 'Microsoft',
    ssoProvider: 'microsoft',
    primaryColor: '#0078d4',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'google.com',
    name: 'Google',
    ssoProvider: 'google',
    primaryColor: '#4285f4',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'apple.com',
    name: 'Apple',
    ssoProvider: 'okta',
    primaryColor: '#000000',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: false
    }
  },
  {
    domain: 'amazon.com',
    name: 'Amazon',
    ssoProvider: 'okta',
    primaryColor: '#ff9900',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'meta.com',
    name: 'Meta',
    ssoProvider: 'okta',
    primaryColor: '#1877f2',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'netflix.com',
    name: 'Netflix',
    ssoProvider: 'okta',
    primaryColor: '#e50914',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: false
    }
  },
  {
    domain: 'spotify.com',
    name: 'Spotify',
    ssoProvider: 'okta',
    primaryColor: '#1db954',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: false
    }
  },
  {
    domain: 'uber.com',
    name: 'Uber',
    ssoProvider: 'okta',
    primaryColor: '#000000',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'airbnb.com',
    name: 'Airbnb',
    ssoProvider: 'okta',
    primaryColor: '#ff5a5f',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: false
    }
  },
  {
    domain: 'salesforce.com',
    name: 'Salesforce',
    ssoProvider: 'okta',
    primaryColor: '#00a1e0',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'adobe.com',
    name: 'Adobe',
    ssoProvider: 'okta',
    primaryColor: '#ff0000',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  },
  {
    domain: 'oracle.com',
    name: 'Oracle',
    ssoProvider: 'okta',
    primaryColor: '#f80000',
    features: {
      sso: true,
      mfa: true,
      auditLogs: true,
      customRoles: true
    }
  }
]

/**
 * Detect if an email belongs to an enterprise domain
 */
export function detectEnterpriseDomain(email: string): EnterpriseDomain | null {
  const domain = email.split('@')[1]?.toLowerCase()
  if (!domain) return null
  
  return ENTERPRISE_DOMAINS.find(enterprise => 
    enterprise.domain === domain
  ) || null
}

/**
 * Get SSO provider for a given domain
 */
export function getSSOProvider(domain: string): 'google' | 'microsoft' | 'okta' | 'custom' | null {
  const enterprise = ENTERPRISE_DOMAINS.find(e => e.domain === domain)
  return enterprise?.ssoProvider || null
}

/**
 * Check if domain supports specific enterprise features
 */
export function hasEnterpriseFeature(domain: string, feature: keyof EnterpriseDomain['features']): boolean {
  const enterprise = ENTERPRISE_DOMAINS.find(e => e.domain === domain)
  return enterprise?.features[feature] || false
}

/**
 * Get enterprise branding for a domain
 */
export function getEnterpriseBranding(domain: string) {
  const enterprise = ENTERPRISE_DOMAINS.find(e => e.domain === domain)
  return {
    name: enterprise?.name || 'Enterprise',
    primaryColor: enterprise?.primaryColor || '#2563eb',
    logo: enterprise?.logo
  }
}

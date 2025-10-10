'use client'

import React from 'react'
import { SecureAuthGuard } from './secure-auth-guard'

interface SimpleAuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  /**
   * Optional element shown while auth state is being resolved (loading).
   * If omitted a default spinner screen is rendered.
   */
  loadingFallback?: React.ReactNode
}

/**
 * @deprecated Use SecureAuthGuard directly for new implementations
 * This component is kept for backward compatibility
 */
export function SimpleAuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/signin',
  loadingFallback
}: SimpleAuthGuardProps) {
  return (
    <SecureAuthGuard
      requireAuth={requireAuth}
      redirectTo={redirectTo}
      loadingFallback={loadingFallback}
    >
      {children}
    </SecureAuthGuard>
  )
}
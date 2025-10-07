'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { Button } from '@proof-of-fit/ui'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

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

export function SimpleAuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/signin',
  loadingFallback
}: SimpleAuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    // Simple auth check - for now, just check if user is in demo mode
    // In production, this would check actual authentication
    const checkAuth = () => {
      try {
        // Check if we're in demo mode or have a user session
        const isDemo = process.env.NEXT_PUBLIC_DEMO_MODE === 'true' || 
                      process.env.NODE_ENV === 'development'
        const hasUser = typeof window !== 'undefined' && localStorage.getItem('user')
        
        console.log('Auth check:', { isDemo, hasUser, NODE_ENV: process.env.NODE_ENV })
        setIsAuthenticated(isDemo || !!hasUser)
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    }

    // Run auth check immediately
    checkAuth()
  }, [])

  // Show loading state
  if (isLoading) {
    if (loadingFallback) return <>{loadingFallback}</>
    return (
      <div className="min-h-screen flex items-center justify-center" role="status" aria-live="polite">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking session…</p>
        </div>
      </div>
    )
  }

  // Handle redirects in useEffect to prevent infinite loops
  useEffect(() => {
    if (requireAuth && !isAuthenticated && !isLoading) {
      router.push(redirectTo)
    } else if (!requireAuth && isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
      router.push('/dashboard')
    }
  }, [requireAuth, isAuthenticated, isLoading, pathname, redirectTo, router])

  // Redirect if authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Shield className="h-12 w-12 text-blue-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
          <p className="text-gray-600 mb-4">Please sign in to access this page.</p>
          <Button onClick={() => router.push(redirectTo)}>
            Sign In
          </Button>
        </div>
      </div>
    )
  }

  // Redirect if user is authenticated but shouldn't be on auth pages
  if (!requireAuth && isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Redirecting...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}


'use client'

import { useEffect, useState } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { Button } from '@proof-of-fit/ui'
import { Shield, AlertTriangle, Loader2 } from 'lucide-react'

interface AuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  redirectTo?: string
  fallback?: React.ReactNode
}

export function AuthGuard({ 
  children, 
  requireAuth = true, 
  redirectTo = '/auth/signin',
  fallback 
}: AuthGuardProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)
  const router = useRouter()
  const pathname = usePathname()

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClientComponentClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Auth check error:', error)
          setIsAuthenticated(false)
          setUser(null)
        } else {
          setIsAuthenticated(!!user)
          setUser(user)
        }
      } catch (error) {
        console.error('Unexpected auth error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    if (isSupabaseConfigured()) {
      const supabase = createClientComponentClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN') {
            setIsAuthenticated(true)
            setUser(session?.user || null)
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false)
            setUser(null)
            if (requireAuth) {
              router.push(redirectTo)
            }
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [requireAuth, redirectTo, router])

  // Show loading state
  if (isLoading) {
    return fallback || (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Verifying authentication...</p>
        </div>
      </div>
    )
  }

  // Check if authentication is required
  if (requireAuth && !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-red-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
            <p className="text-gray-600 mb-6">
              You need to sign in to access this page. Please authenticate to continue.
            </p>
            
            <div className="space-y-3">
              <Button 
                onClick={() => router.push('/auth/signin')}
                className="w-full"
              >
                Sign In
              </Button>
              <Button 
                variant="outline"
                onClick={() => router.push('/auth/signup')}
                className="w-full"
              >
                Create Account
              </Button>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-sm text-gray-500">
                Having trouble?{' '}
                <button 
                  onClick={() => router.push('/contact')}
                  className="text-blue-600 hover:text-blue-800 underline"
                >
                  Contact Support
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Check if user should be redirected (e.g., already authenticated but on auth pages)
  if (!requireAuth && isAuthenticated && (pathname === '/auth/signin' || pathname === '/auth/signup')) {
    router.push('/dashboard')
    return null
  }

  return <>{children}</>
}

// Hook for checking auth status
export function useAuth() {
  const [isLoading, setIsLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function checkAuth() {
      if (!isSupabaseConfigured()) {
        setIsLoading(false)
        return
      }

      try {
        const supabase = createClientComponentClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error) {
          console.error('Auth check error:', error)
          setIsAuthenticated(false)
          setUser(null)
        } else {
          setIsAuthenticated(!!user)
          setUser(user)
        }
      } catch (error) {
        console.error('Unexpected auth error:', error)
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()

    // Listen for auth state changes
    if (isSupabaseConfigured()) {
      const supabase = createClientComponentClient()
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        (event, session) => {
          if (event === 'SIGNED_IN') {
            setIsAuthenticated(true)
            setUser(session?.user || null)
          } else if (event === 'SIGNED_OUT') {
            setIsAuthenticated(false)
            setUser(null)
          }
        }
      )

      return () => subscription.unsubscribe()
    }
  }, [])

  return { isLoading, isAuthenticated, user }
}

'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { createClientSupabaseClient } from '@/lib/supabase/client'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  })
  
  const supabase = createClientSupabaseClient()
  const router = useRouter()

  const initializeAuth = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      if (!supabase) {
        setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
        return
      }
      
      // Get current session
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        // eslint-disable-next-line no-console
        console.error('Auth initialization error:', error)
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return
      }

      setState(prev => ({
        ...prev,
        user: session?.user ?? null,
        session,
        loading: false
      }))
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Auth initialization failed:', error)
      setState(prev => ({
        ...prev,
        error: 'Failed to initialize authentication',
        loading: false
      }))
    }
  }, [supabase])

  const signIn = useCallback(async (email: string, password: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      if (!supabase) {
        setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
        return { success: false, error: 'Authentication service not available' }
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState(prev => ({
        ...prev,
        user: data.user,
        session: data.session,
        loading: false
      }))

      return { success: true, user: data.user }
    } catch (error) {
      const errorMessage = 'Sign in failed. Please try again.'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [supabase])

  const signUp = useCallback(async (email: string, password: string, metadata?: any) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      if (!supabase) {
        setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
        return { success: false, error: 'Authentication service not available' }
      }
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: metadata
        }
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      // Don't set user/session immediately for signup as email confirmation may be required
      setState(prev => ({ ...prev, loading: false }))

      return { success: true, user: data.user, needsConfirmation: !data.session }
    } catch (error) {
      const errorMessage = 'Sign up failed. Please try again.'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [supabase])

  const signOut = useCallback(async () => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      if (!supabase) {
        setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
        return { success: false, error: 'Authentication service not available' }
      }
      
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState(prev => ({
        ...prev,
        user: null,
        session: null,
        loading: false
      }))

      // Redirect to home page
      router.push('/')
      
      return { success: true }
    } catch (error) {
      const errorMessage = 'Sign out failed. Please try again.'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [supabase, router])

  const sendMagicLink = useCallback(async (email: string) => {
    try {
      setState(prev => ({ ...prev, loading: true, error: null }))
      
      if (!supabase) {
        setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
        return { success: false, error: 'Authentication service not available' }
      }
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) {
        setState(prev => ({ ...prev, error: error.message, loading: false }))
        return { success: false, error: error.message }
      }

      setState(prev => ({ ...prev, loading: false }))
      return { success: true }
    } catch (error) {
      const errorMessage = 'Failed to send magic link. Please try again.'
      setState(prev => ({ ...prev, error: errorMessage, loading: false }))
      return { success: false, error: errorMessage }
    }
  }, [supabase])

  // Initialize auth on mount
  useEffect(() => {
    if (!supabase) {
      setState(prev => ({ ...prev, error: 'Authentication service not available', loading: false }))
      return
    }
    
    initializeAuth()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        // eslint-disable-next-line no-console
        console.log('Auth state changed:', event, session?.user?.email)
        
        setState(prev => ({
          ...prev,
          user: session?.user ?? null,
          session,
          loading: false
        }))

        // Handle specific auth events
        if (event === 'SIGNED_IN' && session) {
          // Redirect based on user metadata or default to dashboard
          const userType = session.user.user_metadata?.user_type || 'seeker'
          if (userType === 'employer') {
            router.push('/employer/dashboard')
          } else {
            router.push('/dashboard')
          }
        } else if (event === 'SIGNED_OUT') {
          router.push('/')
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [initializeAuth, supabase, router])

  return {
    user: state.user,
    session: state.session,
    loading: state.loading,
    error: state.error,
    signIn,
    signUp,
    signOut,
    sendMagicLink,
    isAuthenticated: !!state.user,
    isEmployer: state.user?.user_metadata?.user_type === 'employer',
    isCandidate: state.user?.user_metadata?.user_type === 'candidate' || !state.user?.user_metadata?.user_type
  }
}

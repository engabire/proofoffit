'use client'

import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/use-auth'
import type { User, Session } from '@supabase/supabase-js'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  error: string | null
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string; user?: User }>
  signUp: (email: string, password: string, metadata?: any) => Promise<{ success: boolean; error?: string; user?: User; needsConfirmation?: boolean }>
  signOut: () => Promise<{ success: boolean; error?: string }>
  sendMagicLink: (email: string) => Promise<{ success: boolean; error?: string }>
  isAuthenticated: boolean
  isEmployer: boolean
  isCandidate: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const auth = useAuth()

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}

// Convenience hooks for specific auth states
export function useUser() {
  const { user } = useAuthContext()
  return user
}

export function useSession() {
  const { session } = useAuthContext()
  return session
}

export function useIsAuthenticated() {
  const { isAuthenticated } = useAuthContext()
  return isAuthenticated
}

export function useIsEmployer() {
  const { isEmployer } = useAuthContext()
  return isEmployer
}

export function useIsCandidate() {
  const { isCandidate } = useAuthContext()
  return isCandidate
}

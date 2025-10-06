import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { isSupabaseConfigured } from './env'

export async function getCurrentUser() {
  if (!isSupabaseConfigured()) {
    return null
  }
  
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    return null
  }

  return user
}

export async function requireAuth() {
  const user = await getCurrentUser()
  if (!user) {
    redirect('/auth/signin')
  }
  return user
}

export async function getCurrentUserWithProfile() {
  const user = await getCurrentUser()
  if (!user) return null

  if (!isSupabaseConfigured()) {
    return {
      user,
      profile: null,
    }
  }

  const supabase = createServerComponentClient({ cookies })
  
  // Get user profile from our users table
  const { data: userProfile } = await supabase
    .from('users')
    .select('*')
    .eq('id', user.id)
    .single()

  return {
    user,
    profile: userProfile,
  }
}
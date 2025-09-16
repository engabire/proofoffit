"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'

export default function AuthCallbackPage() {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function exchangeCodeForSession() {
      if (!supabase) {
        router.replace('/auth/signin')
        return
      }
      
      const code = searchParams.get('code')
      if (code) {
        await supabase.auth.exchangeCodeForSession(code)
        router.replace('/dashboard')
      } else {
        router.replace('/auth/signin')
      }
    }
    exchangeCodeForSession()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Signing you in…</p>
    </div>
  )
}
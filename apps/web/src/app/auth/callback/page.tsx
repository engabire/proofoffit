"use client"

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export default function AuthCallbackPage() {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    async function exchangeCodeForSession() {
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
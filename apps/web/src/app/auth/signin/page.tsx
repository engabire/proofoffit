"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { toast } from 'sonner'
import { isSupabaseConfigured } from '@/lib/env'

export default function SignInPage() {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleMagicLink() {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }
    
    try {
      setLoading(true)
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } })
      if (error) throw error
      toast.success('Check your email for a magic link')
    } catch (err: any) {
      toast.error(err.message || 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" />
          </div>
          <Button className="w-full" onClick={handleMagicLink} disabled={!email || loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
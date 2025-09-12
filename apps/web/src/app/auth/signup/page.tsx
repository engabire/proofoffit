"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { RadioGroup, RadioGroupItem } from '@proof-of-fit/ui'
import { toast } from 'sonner'
import Link from 'next/link'

export default function SignUpPage() {
  const supabase = createClientComponentClient()
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [loading, setLoading] = useState(false)

  async function handleSignUp() {
    try {
      setLoading(true)
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { 
          emailRedirectTo: redirectTo,
          data: { role }
        } 
      })
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
          <CardTitle>Get Started</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input 
              id="email" 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="you@example.com" 
            />
          </div>
          
          <div className="space-y-3">
            <Label>I am a...</Label>
            <RadioGroup value={role} onValueChange={(value) => setRole(value as 'candidate' | 'employer')}>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="candidate" id="candidate" />
                <Label htmlFor="candidate">Job Seeker</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="employer" id="employer" />
                <Label htmlFor="employer">Employer</Label>
              </div>
            </RadioGroup>
          </div>

          <Button className="w-full" onClick={handleSignUp} disabled={!email || loading}>
            {loading ? 'Sending...' : 'Send Magic Link'}
          </Button>

          <div className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link href="/auth/signin" className="text-primary hover:underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { detectEnterpriseDomain } from '@/lib/enterprise-domains'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Loader2, CheckCircle, AlertCircle, Building2 } from 'lucide-react'

export default function AuthCallbackPage() {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processing authentication...')
  const [userEmail, setUserEmail] = useState<string | null>(null)
  const [isEnterprise, setIsEnterprise] = useState(false)

  useEffect(() => {
    async function exchangeCodeForSession() {
      if (!supabase) {
        setStatus('error')
        setMessage('Authentication service not available')
        setTimeout(() => router.replace('/auth/signin'), 3000)
        return
      }
      
      try {
        setStatus('loading')
        setMessage('Verifying authentication...')
        
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        
        if (error) {
          throw new Error(`Authentication error: ${error}`)
        }
        
        if (code) {
          const { data, error: exchangeError } = await supabase.auth.exchangeCodeForSession(code)
          
          if (exchangeError) {
            throw exchangeError
          }
          
          if (data.user) {
            setUserEmail(data.user.email || null)
            
            // Check if this is an enterprise user
            if (data.user.email) {
              const enterprise = detectEnterpriseDomain(data.user.email)
              setIsEnterprise(!!enterprise)
            }
            
            setStatus('success')
            setMessage('Authentication successful!')

            try { await import('../../../lib/analytics').then(m => m.track({ name: 'auth_success' })) } catch {}
            
            // Log successful authentication
            try {
                      await supabase
                        .from('action_log')
                .insert({
                  tenantId: data.user.id,
                  actorType: 'user',
                  actorId: data.user.id,
                  action: 'auth_success',
                  objType: 'user',
                  objId: data.user.id,
                  payloadHash: 'auth_success'
                })
            } catch (error) {
              console.error('Failed to log successful authentication:', error)
            }
            
            setTimeout(() => {
              router.replace('/dashboard')
            }, 2000)
          } else {
            throw new Error('No user data received')
          }
        } else {
          throw new Error('No authentication code provided')
        }
      } catch (err: any) {
        console.error('Auth callback error:', err)
        setStatus('error')
        setMessage(err.message || 'Authentication failed')
        
        // Log failed authentication
        if (supabase) {
          try {
            await supabase
              .from('action_log')
              .insert({
                tenantId: 'anonymous',
                actorType: 'system',
                actorId: 'auth_callback',
                action: 'auth_failed',
                objType: 'user',
                objId: 'unknown',
                payloadHash: 'auth_failed'
              })
          } catch (error) {
            console.error('Failed to log failed authentication:', error)
          }
        }
        
        setTimeout(() => {
          router.replace('/auth/signin')
        }, 3000)
      }
    }
    
    exchangeCodeForSession()
  }, [router, searchParams, supabase])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === 'loading' && 'Authenticating...'}
            {status === 'success' && 'Welcome to ProofOfFit!'}
            {status === 'error' && 'Authentication Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-center text-gray-600">{message}</p>
          
          {userEmail && (
            <div className="text-center">
              <p className="text-sm text-gray-500">Signed in as:</p>
              <p className="font-medium">{userEmail}</p>
            </div>
          )}
          
          {isEnterprise && userEmail && (
            <div className="flex items-center justify-center space-x-2 p-3 bg-blue-50 rounded-lg">
              <Building2 className="h-4 w-4 text-blue-600" />
              <Badge variant="secondary" className="text-blue-800">
                Enterprise Account
              </Badge>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Please wait while we verify your credentials...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Redirecting to your dashboard...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                You will be redirected to the sign-in page shortly.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
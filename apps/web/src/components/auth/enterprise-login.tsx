"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { RadioGroup, RadioGroupItem } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Separator } from '@proof-of-fit/ui'
import { Alert, AlertDescription } from '@proof-of-fit/ui'
import { 
  Building2, 
  User, 
  Mail, 
  Shield, 
  ArrowRight, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  EyeOff
} from 'lucide-react'
import { toast } from 'sonner'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'
import { detectEnterpriseDomain, getEnterpriseBranding } from '@/lib/enterprise-domains'

interface EnterpriseLoginProps {
  mode?: 'signup' | 'signin'
  onSuccess?: () => void
}

export function EnterpriseLogin({ mode = 'signup', onSuccess }: EnterpriseLoginProps) {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [password, setPassword] = useState('')
  const [isEnterpriseDomain, setIsEnterpriseDomain] = useState(false)
  const [enterpriseProvider, setEnterpriseProvider] = useState<string | null>(null)
  const [authMethod, setAuthMethod] = useState<'magic' | 'password' | 'sso'>('magic')

  // Detect enterprise domains
  useEffect(() => {
    if (email) {
      const enterprise = detectEnterpriseDomain(email)
      
      if (enterprise) {
        setIsEnterpriseDomain(true)
        setEnterpriseProvider(enterprise.domain)
        setAuthMethod('sso')
      } else {
        setIsEnterpriseDomain(false)
        setEnterpriseProvider(null)
        setAuthMethod('magic')
      }
    }
  }, [email])

  const handleMagicLink = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { 
          emailRedirectTo: redirectTo,
          data: { role, authMethod: 'magic' }
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

  const handlePasswordAuth = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, authMethod: 'password' }
          }
        })
        if (error) throw error
        toast.success('Account created! Please check your email to verify.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password
        })
        if (error) throw error
        toast.success('Signed in successfully!')
        onSuccess?.()
      }
    } catch (err: any) {
      toast.error(err.message || 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSSO = async (provider: 'google' | 'azure' | 'linkedin' | 'github' | 'bitbucket' | 'discord' | 'facebook' | 'twitter' | 'apple' | 'spotify' | 'slack' | 'notion' | 'twitch' | 'workos' | 'zoom') => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        }
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || 'SSO authentication failed')
      setLoading(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (authMethod === 'magic') {
      handleMagicLink()
    } else if (authMethod === 'password') {
      handlePasswordAuth()
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            {mode === 'signup' ? 'Get Started' : 'Welcome Back'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {mode === 'signup' 
              ? 'Join the future of transparent hiring' 
              : 'Sign in to your account'
            }
          </p>
        </div>

        <Card className="shadow-xl border-0">
          <CardHeader className="space-y-1 pb-4">
            <CardTitle className="text-xl text-center">
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <CardDescription className="text-center">
              Choose your preferred authentication method
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Enterprise Domain Detection */}
            {isEnterpriseDomain && (
              <Alert className="border-blue-200 bg-blue-50">
                <Building2 className="h-4 w-4 text-blue-600" />
                <AlertDescription className="text-blue-800">
                  <strong>Enterprise domain detected!</strong> We recommend using your company's SSO for enhanced security.
                </AlertDescription>
              </Alert>
            )}

            {/* Authentication Method Selection */}
            <div className="space-y-3">
              <Label className="text-sm font-medium">Authentication Method</Label>
              <RadioGroup value={authMethod} onValueChange={(value: any) => setAuthMethod(value)}>
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="magic" id="magic" />
                  <Label htmlFor="magic" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4" />
                      <span>Magic Link (Recommended)</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Passwordless, secure email authentication</p>
                  </Label>
                </div>
                
                <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50">
                  <RadioGroupItem value="password" id="password" />
                  <Label htmlFor="password" className="flex-1 cursor-pointer">
                    <div className="flex items-center space-x-2">
                      <Shield className="h-4 w-4" />
                      <span>Email & Password</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">Traditional authentication with password</p>
                  </Label>
                </div>

                {isEnterpriseDomain && (
                  <div className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 border-blue-200 bg-blue-50">
                    <RadioGroupItem value="sso" id="sso" />
                    <Label htmlFor="sso" className="flex-1 cursor-pointer">
                      <div className="flex items-center space-x-2">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span>Enterprise SSO</span>
                        <Badge variant="secondary" className="text-xs">Recommended</Badge>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">Use your company's single sign-on</p>
                    </Label>
                  </div>
                )}
              </RadioGroup>
            </div>

            {/* SSO Buttons */}
            {authMethod === 'sso' && isEnterpriseDomain && (
              <div className="space-y-3">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => handleSSO('google')}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                  </svg>
                  Continue with Google
                </Button>
                
                <Button
                  type="button"
                  variant="outline"
                  className="w-full justify-center"
                  onClick={() => handleSSO('azure')}
                  disabled={loading}
                >
                  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                    <path fill="#F25022" d="M1 1h10v10H1z"/>
                    <path fill="#00A4EF" d="M13 1h10v10H13z"/>
                    <path fill="#7FBA00" d="M1 13h10v10H1z"/>
                    <path fill="#FFB900" d="M13 13h10v10H13z"/>
                  </svg>
                  Continue with Microsoft
                </Button>
              </div>
            )}

            {/* Email/Password Form */}
            {authMethod !== 'sso' && (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email address</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                  {isEnterpriseDomain && (
                    <p className="text-xs text-blue-600 flex items-center">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Enterprise domain detected
                    </p>
                  )}
                </div>

                {authMethod === 'password' && (
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        placeholder="Enter your password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="pr-10"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {mode === 'signup' && (
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">I am a...</Label>
                    <RadioGroup value={role} onValueChange={(value: any) => setRole(value)}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="candidate" id="candidate" />
                        <Label htmlFor="candidate" className="flex items-center space-x-2 cursor-pointer">
                          <User className="h-4 w-4" />
                          <span>Job Seeker</span>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="employer" id="employer" />
                        <Label htmlFor="employer" className="flex items-center space-x-2 cursor-pointer">
                          <Building2 className="h-4 w-4" />
                          <span>Employer</span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>
                )}

                <Button
                  type="submit"
                  className="w-full"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      {authMethod === 'magic' ? 'Sending...' : 'Signing in...'}
                    </>
                  ) : (
                    <>
                      {authMethod === 'magic' ? 'Send Magic Link' : mode === 'signup' ? 'Create Account' : 'Sign In'}
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </>
                  )}
                </Button>
              </form>
            )}

            <Separator />

            <div className="text-center">
              {mode === 'signup' ? (
                <p className="text-sm text-gray-600">
                  Already have an account?{' '}
                  <Link href="/auth/signin" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign in
                  </Link>
                </p>
              ) : (
                <p className="text-sm text-gray-600">
                  Don't have an account?{' '}
                  <Link href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Sign up
                  </Link>
                </p>
              )}
            </div>

            {/* Security Notice */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="h-4 w-4 text-green-600 mt-0.5" />
                <div className="text-xs text-gray-600">
                  <p className="font-medium text-gray-900">Enterprise-grade security</p>
                  <p>Your data is protected with end-to-end encryption and SOC 2 compliance.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

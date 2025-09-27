'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@proof-of-fit/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Alert, AlertDescription } from '@proof-of-fit/ui'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle, 
  CheckCircle,
  Loader2,
  User,
  Building2
} from 'lucide-react'
import { toast } from 'sonner'
import { isSupabaseConfigured } from '@/lib/env'
import { detectEnterpriseDomain } from '@/lib/enterprise-domains'

interface EnhancedEnterpriseLoginProps {
  mode?: 'signin' | 'signup'
  onSuccess?: () => void
  redirectTo?: string
}

type Provider = 'google' | 'github' | 'azure'

export function EnhancedEnterpriseLogin({ 
  mode = 'signup', 
  onSuccess,
  redirectTo 
}: EnhancedEnterpriseLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [emailSent, setEmailSent] = useState(false)
  const [emailSentType, setEmailSentType] = useState<'verification' | 'magic_link' | null>(null)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isEnterprise, setIsEnterprise] = useState(false)
  const [securityChecks, setSecurityChecks] = useState({
    passwordStrength: 0,
    emailValid: false,
    passwordsMatch: false
  })

  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null

  // Get redirect URL from search params
  const redirectUrl = redirectTo || searchParams.get('redirect') || '/dashboard'

  useEffect(() => {
    // Check if email is enterprise domain
    if (email) {
      const enterprise = detectEnterpriseDomain(email)
      setIsEnterprise(!!enterprise)
    } else {
      setIsEnterprise(false)
    }
  }, [email])

  useEffect(() => {
    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    setSecurityChecks(prev => ({
      ...prev,
      emailValid: emailRegex.test(email)
    }))
  }, [email])

  useEffect(() => {
    // Check password strength
    let strength = 0
    if (password.length >= 8) strength += 1
    if (/[A-Z]/.test(password)) strength += 1
    if (/[a-z]/.test(password)) strength += 1
    if (/[0-9]/.test(password)) strength += 1
    if (/[^A-Za-z0-9]/.test(password)) strength += 1

    setSecurityChecks(prev => ({
      ...prev,
      passwordStrength: strength,
      passwordsMatch: mode === 'signup' ? password === confirmPassword : true
    }))
  }, [password, confirmPassword, mode])

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!securityChecks.emailValid) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!password) {
      newErrors.password = 'Password is required'
    } else if (password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters'
    } else if (securityChecks.passwordStrength < 3) {
      newErrors.password = 'Password must contain uppercase, lowercase, and numbers'
    }

    if (mode === 'signup') {
      if (!confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password'
      } else if (!securityChecks.passwordsMatch) {
        newErrors.confirmPassword = 'Passwords do not match'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleMagicLink = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    if (!validateForm()) return

    try {
      setLoading(true)
      setErrors({})

      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
        },
      })

      if (error) throw error

      setEmailSent(true)
      setEmailSentType('magic_link')
      
      toast.success('Magic link sent! Check your email to sign in.')
      
      // Enhanced instructions
      setTimeout(() => {
        toast.info(
          '📧 Check your email and click the magic link to sign in. The link will expire in 1 hour.',
          { duration: 8000 }
        )
      }, 2000)

    } catch (error: any) {
      console.error('Magic link error:', error)
      toast.error(error?.message ?? 'Failed to send magic link')
      setErrors({ general: error?.message ?? 'Failed to send magic link' })
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordAuth = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    if (!validateForm()) return

    try {
      setLoading(true)
      setErrors({})

      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { 
              role, 
              authMethod: 'password',
              isEnterprise: isEnterprise
            },
            emailRedirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
          },
        })
        
        if (error) throw error
        
        setEmailSent(true)
        setEmailSentType('verification')
        
        toast.success('🎉 Account created! Please check your email to verify your account.')
        
        // Enhanced verification message
        setTimeout(() => {
          toast.info(
            '📧 Verification required: Click the link in your email to activate your account.',
            { duration: 10000 }
          )
        }, 2000)

        // Security reminder
        setTimeout(() => {
          toast.info(
            '🔒 For security, please verify your email within 24 hours to keep your account active.',
            { duration: 8000 }
          )
        }, 6000)
        
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email, 
          password 
        })
        
        if (error) throw error
        
        toast.success('Signed in successfully!')
        onSuccess?.()
        
        // Log successful sign in
        try {
          await supabase
            .from('action_log')
            .insert({
              action: 'auth_signin',
              objType: 'user',
              payloadHash: 'signin_success'
            })
        } catch (logError) {
          console.warn('Failed to log sign in event:', logError)
        }
      }
    } catch (error: any) {
      console.error('Password auth error:', error)
      toast.error(error?.message ?? 'Authentication failed')
      setErrors({ general: error?.message ?? 'Authentication failed' })
    } finally {
      setLoading(false)
    }
  }

  const handleSSO = async (provider: Provider) => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      setErrors({})

      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback?redirect=${encodeURIComponent(redirectUrl)}`,
        },
      })

      if (error) throw error
    } catch (error: any) {
      console.error('SSO error:', error)
      toast.error(error?.message ?? `Failed to sign in with ${provider}`)
      setErrors({ general: error?.message ?? `Failed to sign in with ${provider}` })
    } finally {
      setLoading(false)
    }
  }

  const getPasswordStrengthColor = (strength: number) => {
    if (strength < 2) return 'text-red-600'
    if (strength < 4) return 'text-yellow-600'
    return 'text-green-600'
  }

  const getPasswordStrengthText = (strength: number) => {
    if (strength < 2) return 'Weak'
    if (strength < 4) return 'Medium'
    return 'Strong'
  }

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          <Card>
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {emailSentType === 'verification' ? 'Check Your Email' : 'Magic Link Sent'}
              </h2>
              
              <p className="text-gray-600 mb-6">
                {emailSentType === 'verification' 
                  ? 'We\'ve sent a verification link to your email address. Please click the link to activate your account.'
                  : 'We\'ve sent a magic link to your email address. Click the link to sign in.'
                }
              </p>
              
              <div className="space-y-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <p className="text-sm text-blue-800">
                    <strong>Email sent to:</strong> {email}
                  </p>
                </div>
                
                <div className="text-sm text-gray-600">
                  <p>Can't find the email? Check your spam folder or try again.</p>
                </div>
                
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setEmailSent(false)
                      setEmailSentType(null)
                    }}
                    className="flex-1"
                  >
                    Back
                  </Button>
                  <Button
                    onClick={emailSentType === 'verification' ? handlePasswordAuth : handleMagicLink}
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    ) : null}
                    Resend Email
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">
              {mode === 'signup' ? 'Create Account' : 'Sign In'}
            </CardTitle>
            <p className="text-gray-600">
              {mode === 'signup' 
                ? 'Join ProofOfFit to start your journey' 
                : 'Welcome back to ProofOfFit'
              }
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* General Error */}
            {errors.general && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>{errors.general}</AlertDescription>
              </Alert>
            )}

            {/* Enterprise Notice */}
            {isEnterprise && (
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  Enterprise domain detected. You may be eligible for SSO authentication.
                </AlertDescription>
              </Alert>
            )}

            {/* SSO Options */}
            <div className="space-y-3">
              <Button
                variant="outline"
                onClick={() => handleSSO('google')}
                disabled={loading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continue with Google
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleSSO('github')}
                disabled={loading}
                className="w-full"
              >
                <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                Continue with GitHub
              </Button>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or continue with email</span>
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`pl-10 ${errors.email ? 'border-red-500' : ''}`}
                  placeholder="Enter your email"
                  required
                />
              </div>
              {errors.email && (
                <p className="text-sm text-red-600">{errors.email}</p>
              )}
              {securityChecks.emailValid && (
                <p className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Valid email address
                </p>
              )}
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className={`pl-10 pr-10 ${errors.password ? 'border-red-500' : ''}`}
                  placeholder="Enter your password"
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
              {errors.password && (
                <p className="text-sm text-red-600">{errors.password}</p>
              )}
              {password && (
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-sm">
                    <span>Password strength:</span>
                    <span className={getPasswordStrengthColor(securityChecks.passwordStrength)}>
                      {getPasswordStrengthText(securityChecks.passwordStrength)}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        securityChecks.passwordStrength < 2 ? 'bg-red-500' :
                        securityChecks.passwordStrength < 4 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${(securityChecks.passwordStrength / 5) * 100}%` }}
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Confirm Password (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`pl-10 pr-10 ${errors.confirmPassword ? 'border-red-500' : ''}`}
                    placeholder="Confirm your password"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
                {confirmPassword && securityChecks.passwordsMatch && (
                  <p className="text-sm text-green-600 flex items-center">
                    <CheckCircle className="w-4 h-4 mr-1" />
                    Passwords match
                  </p>
                )}
              </div>
            )}

            {/* Role Selection (Sign Up Only) */}
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label>I am a...</Label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole('candidate')}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      role === 'candidate' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <User className="w-5 h-5 mb-2" />
                    <div className="font-medium">Candidate</div>
                    <div className="text-sm text-gray-600">Looking for jobs</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('employer')}
                    className={`p-3 border rounded-lg text-left transition-colors ${
                      role === 'employer' 
                        ? 'border-blue-500 bg-blue-50 text-blue-700' 
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                  >
                    <Building2 className="w-5 h-5 mb-2" />
                    <div className="font-medium">Employer</div>
                    <div className="text-sm text-gray-600">Hiring talent</div>
                  </button>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handlePasswordAuth}
                disabled={loading || !securityChecks.emailValid || !password}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                {mode === 'signup' ? 'Create Account' : 'Sign In'}
              </Button>
              
              <Button
                variant="outline"
                onClick={handleMagicLink}
                disabled={loading || !securityChecks.emailValid}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : (
                  <Mail className="w-4 h-4 mr-2" />
                )}
                Send Magic Link
              </Button>
            </div>

            {/* Switch Mode */}
            <div className="text-center">
              <p className="text-sm text-gray-600">
                {mode === 'signup' ? 'Already have an account?' : "Don't have an account?"}{' '}
                <button
                  onClick={() => router.push(mode === 'signup' ? '/auth/signin' : '/auth/signup')}
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  {mode === 'signup' ? 'Sign In' : 'Sign Up'}
                </button>
              </p>
            </div>

            {/* Security Notice */}
            <div className="p-3 bg-gray-50 rounded-lg">
              <div className="flex items-start space-x-2">
                <Shield className="w-4 h-4 text-gray-600 mt-0.5" />
                <div className="text-sm text-gray-600">
                  <p className="font-medium">Security Notice:</p>
                  <p>We use industry-standard encryption and never store your password in plain text.</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

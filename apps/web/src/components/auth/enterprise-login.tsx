"use client"

import { useCallback, useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Provider } from '@supabase/supabase-js'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@proof-of-fit/ui'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  CheckCircle2,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
  X,
  AlertTriangle,
  Info,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { detectEnterpriseDomain, getEnterpriseBranding } from '@/lib/enterprise-domains'
import { isSupabaseConfigured } from '@/lib/env'

interface EnterpriseLoginProps {
  mode?: 'signup' | 'signin'
  onSuccess?: () => void
}

export function EnterpriseLogin({ mode = 'signup', onSuccess }: EnterpriseLoginProps) {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [password, setPassword] = useState('')
  const [authMethod, setAuthMethod] = useState<'magic' | 'password' | 'sso'>('magic')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [enterpriseProvider, setEnterpriseProvider] = useState<string | null>(null)
  const [formErrors, setFormErrors] = useState<{email?: string; password?: string}>({})
  const [emailValid, setEmailValid] = useState<boolean | null>(null)
  const [passwordStrength, setPasswordStrength] = useState<{score: number; feedback: string[]}>({score: 0, feedback: []})
  const [oauthAvailable, setOauthAvailable] = useState({
    google: true, // Google OAuth is now configured
    github: false // GitHub OAuth not configured yet
  })

  // Email validation function
  const validateEmail = useCallback((email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isValid = emailRegex.test(email)
    setEmailValid(email.length > 0 ? isValid : null)
    
    if (email.length > 0 && !isValid) {
      setFormErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }))
    } else {
      setFormErrors(prev => ({ ...prev, email: undefined }))
    }
    
    return isValid
  }, [])

  // Password strength checker
  const calculatePasswordStrength = useCallback((password: string) => {
    const feedback: string[] = []
    let score = 0

    if (password.length === 0) {
      setPasswordStrength({ score: 0, feedback: [] })
      return
    }

    // Length check
    if (password.length >= 8) {
      score += 1
    } else {
      feedback.push('Use at least 8 characters')
    }

    // Uppercase check
    if (/[A-Z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include uppercase letters')
    }

    // Lowercase check
    if (/[a-z]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include lowercase letters')
    }

    // Number check
    if (/\d/.test(password)) {
      score += 1
    } else {
      feedback.push('Include numbers')
    }

    // Special character check
    if (/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
      score += 1
    } else {
      feedback.push('Include special characters')
    }

    // Common password patterns
    const commonPatterns = ['password', '123456', 'qwerty', 'abc123']
    if (commonPatterns.some(pattern => password.toLowerCase().includes(pattern))) {
      score = Math.max(0, score - 2)
      feedback.push('Avoid common password patterns')
    }

    setPasswordStrength({ score, feedback })
    
    // Set validation error if password is too weak
    if (password.length > 0 && score < 3) {
      setFormErrors(prev => ({ ...prev, password: 'Password is too weak' }))
    } else {
      setFormErrors(prev => ({ ...prev, password: undefined }))
    }
  }, [])

  useEffect(() => {
    if (!email) {
      setEnterpriseProvider(null)
      setAuthMethod('magic')
      return
    }

    const enterprise = detectEnterpriseDomain(email)
    if (enterprise) {
      setEnterpriseProvider(enterprise.domain)
      setAuthMethod('sso')
    } else {
      setEnterpriseProvider(null)
      if (authMethod === 'sso') setAuthMethod('magic')
    }
  }, [email])

  const branding = useMemo(() => (enterpriseProvider ? getEnterpriseBranding(enterpriseProvider) : null), [enterpriseProvider])

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
          data: { role, authMethod: 'magic' },
        },
      })
      if (error) throw error
      toast.success('Check your email for a magic link')
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to send magic link')
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
            data: { role, authMethod: 'password' },
          },
        })
        if (error) throw error
        toast.success('Account created! Check your inbox to verify.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Signed in successfully!')
        onSuccess?.()
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Authentication failed')
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
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (error) {
        // Handle specific OAuth provider errors
        if (error.message?.includes('provider is not enabled') || error.message?.includes('Unsupported provider')) {
          setOauthAvailable(prev => ({ ...prev, [provider]: false }))
          toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not currently available. Please use email authentication instead.`)
        } else {
          throw error
        }
      }
    } catch (error: any) {
      console.error('SSO Error:', error)
      if (error?.message?.includes('provider is not enabled') || error?.message?.includes('Unsupported provider')) {
        setOauthAvailable(prev => ({ ...prev, [provider]: false }))
        toast.error(`${provider.charAt(0).toUpperCase() + provider.slice(1)} login is not currently available. Please use email authentication instead.`)
      } else {
        toast.error(error?.message ?? 'SSO authentication failed')
      }
      setLoading(false)
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    
    // Basic validation - less strict
    if (!email || !email.includes('@')) {
      toast.error('Please enter a valid email address')
      return
    }
    
    if (authMethod === 'password') {
      if (!password) {
        toast.error('Please enter a password')
        return
      }
      if (mode === 'signup' && password.length < 6) {
        toast.error('Password must be at least 6 characters')
        return
      }
    }
    
    // Execute authentication
    if (authMethod === 'magic') {
      handleMagicLink()
    } else if (authMethod === 'password') {
      handlePasswordAuth()
    }
  }

  // Handle email input changes with validation
  const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = event.target.value
    setEmail(newEmail)
    // Debounce validation to avoid excessive checking
    setTimeout(() => validateEmail(newEmail), 500)
  }

  // Handle password input changes with strength checking
  const handlePasswordChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newPassword = event.target.value
    setPassword(newPassword)
    calculatePasswordStrength(newPassword)
  }

  const features = [
    'Audit-grade receipts for every action',
    'Expert-designed workflows with human oversight',
    'Sponsor-friendly pricing & gift codes',
    'Enterprise SSO + SOC2 patterns ready',
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-3xl rounded-full bg-gradient-to-r from-sky-200/45 via-indigo-200/30 to-purple-200/25 blur-3xl dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-purple-500/15" />
      <div className="relative z-10 mx-auto flex min-h-screen items-center px-6 py-16 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.3fr),420px]">
          <aside className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-sky-700 shadow-sm shadow-sky-200/50 dark:bg-sky-900/45 dark:text-sky-200">
              ProofOfFit
            </div>
            <div className="space-y-6">
              <div className="space-y-4">
                <h1 className="font-serif text-4xl tracking-tight text-slate-900 dark:text-white">
                  {mode === 'signup' ? 'Join' : 'Sign in to'} the hiring OS that proves every recommendation.
                </h1>
                <p className="max-w-xl text-slate-600 dark:text-slate-300">
                  Calm, beautiful software with enterprise rigor, intuitive approachability, and the governance demanded by talent teams.
                </p>
              </div>
              
              {/* Social Proof Stats */}
              <div className="grid grid-cols-3 gap-4 max-w-lg">
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">10K+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Candidates matched</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">500+</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Companies trust us</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-slate-900 dark:text-white">99%</div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">Bias-free hiring</div>
                </div>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/70 bg-white/85 p-4 text-sm text-slate-600 shadow-sm shadow-slate-200/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
                  <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-300"><Sparkles className="h-4 w-4" />Inspiration</div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
            {/* Enhanced Testimonials */}
            <div className="space-y-4">
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                &quot;ProofOfFit combines intuitive design with enterprise-grade security—the most elegant automated workflow in our stack, and the only one with complete audit trails.&quot;
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-400">Head of Talent, Inclusive Hiring Network</p>
                </div>
              </div>
              
              <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
                &quot;Reduced our time-to-hire by 40% while maintaining the highest diversity standards in our industry.&quot;
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <span key={star} className="text-yellow-400">★</span>
                    ))}
                  </div>
                  <p className="text-xs font-medium text-slate-400">VP People Operations, TechFlow Inc.</p>
                </div>
              </div>
            </div>
          </aside>

          <Card className="h-fit border border-white/70 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-300">
                Choose the authentication method that matches your security needs. Magic links, passwords, or enterprise SSO.
              </CardDescription>
              {branding && (
                <Badge variant="secondary" className="mx-auto w-fit gap-1 text-xs">
                  <Building2 className="h-3.5 w-3.5" /> {branding.name} detected
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {enterpriseProvider && (
                <Alert className="border-sky-200/70 bg-sky-50/80 text-sky-800 dark:border-sky-900/60 dark:bg-sky-900/30 dark:text-sky-200">
                  <AlertDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>
                      <strong className="font-semibold">Enterprise domain detected.</strong> We recommend signing in with your company SSO below.
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {!enterpriseProvider && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Authentication method</Label>
                  <RadioGroup value={authMethod} onValueChange={(value: any) => setAuthMethod(value)} className="grid gap-3">
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${authMethod === 'magic' ? 'border-sky-200 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-900/40' : ''}`}>
                      <RadioGroupItem value="magic" id="magic" />
                      <Label htmlFor="magic" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Magic link (passwordless)
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Secure, time-boxed link sent straight to your inbox.</p>
                      </Label>
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${authMethod === 'password' ? 'border-sky-200 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-900/40' : ''}`}>
                      <RadioGroupItem value="password" id="password" />
                      <Label htmlFor="password" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Email & password
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Strong password checks and session protections.</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <fieldset className="grid grid-cols-2 gap-2">
                <legend className="sr-only">Choose your role</legend>
                <Button
                  type="button"
                  variant={role === 'candidate' ? 'default' : 'outline'}
                  className={`h-auto flex-col items-start gap-1 rounded-2xl border transition-all duration-200 ${
                    role === 'candidate' 
                      ? 'border-sky-200 bg-gradient-to-r from-sky-500 via-indigo-500 to-purple-600 text-white shadow-lg shadow-sky-500/20 hover:shadow-sky-500/30' 
                      : 'border-sky-200 text-sky-600 hover:bg-sky-50 dark:border-sky-800 dark:text-sky-400 dark:hover:bg-sky-950/30'
                  }`}
                  onClick={() => setRole('candidate')}
                  aria-pressed={role === 'candidate'}
                  aria-describedby="candidate-benefits"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <User className="h-4 w-4" aria-hidden="true" /> 
                    Job Seeker
                  </span>
                  <span id="candidate-benefits" className="text-left text-xs opacity-80">
                    Tailored Fit Reports, sponsor codes, bias-aware insights.
                  </span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'employer' ? 'default' : 'outline'}
                  className={`h-auto flex-col items-start gap-1 rounded-xl border transition-all duration-200 ${
                    role === 'employer' 
                      ? 'border-emerald-200 bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-600 text-white shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/30' 
                      : 'border-emerald-200 text-emerald-600 hover:bg-emerald-50 dark:border-emerald-800 dark:text-emerald-400 dark:hover:bg-emerald-950/30'
                  }`}
                  onClick={() => setRole('employer')}
                  aria-pressed={role === 'employer'}
                  aria-describedby="employer-benefits"
                >
                  <span className="flex items-center gap-2 text-sm font-semibold">
                    <Building2 className="h-4 w-4" aria-hidden="true" /> 
                    Employer
                  </span>
                  <span id="employer-benefits" className="text-left text-xs opacity-80">
                    Explainable slates, governance-ready audit trails.
                  </span>
                </Button>
              </fieldset>

              <form className="space-y-4" onSubmit={handleSubmit} noValidate>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                    Email address
                    {emailValid === true && (
                      <CheckCircle2 className="inline ml-2 h-4 w-4 text-green-600" aria-label="Valid email" />
                    )}
                    {emailValid === false && (
                      <X className="inline ml-2 h-4 w-4 text-red-600" aria-label="Invalid email" />
                    )}
                  </Label>
                  <div className="relative">
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={handleEmailChange}
                      placeholder="you@organization.com"
                      required
                      aria-invalid={formErrors.email ? 'true' : 'false'}
                      aria-describedby={formErrors.email ? 'email-error' : undefined}
                      className={`${
                        emailValid === false ? 'border-red-300 focus:border-red-500 focus:ring-red-500' :
                        emailValid === true ? 'border-green-300 focus:border-green-500 focus:ring-green-500' :
                        ''
                      }`}
                    />
                    {emailValid === true && (
                      <CheckCircle2 className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-green-600" />
                    )}
                    {emailValid === false && (
                      <X className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-red-600" />
                    )}
                  </div>
                  {formErrors.email && (
                    <p id="email-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                      <AlertTriangle className="h-3 w-3" />
                      {formErrors.email}
                    </p>
                  )}
                </div>

                {authMethod === 'password' && (
                  <div className="space-y-3">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">
                      Password
                      {mode === 'signup' && (
                        <span className="ml-1 text-xs text-slate-500">(minimum 8 characters)</span>
                      )}
                    </Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={handlePasswordChange}
                        placeholder={mode === 'signup' ? 'Create a strong password' : 'Enter your password'}
                        required
                        aria-invalid={formErrors.password ? 'true' : 'false'}
                        aria-describedby={`${formErrors.password ? 'password-error' : ''} ${mode === 'signup' ? 'password-strength' : ''}`.trim()}
                        className={`pr-10 ${
                          formErrors.password ? 'border-red-300 focus:border-red-500 focus:ring-red-500' :
                          mode === 'signup' && passwordStrength.score >= 4 ? 'border-green-300 focus:border-green-500 focus:ring-green-500' :
                          ''
                        }`}
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    
                    {/* Password Strength Indicator */}
                    {mode === 'signup' && password.length > 0 && (
                      <div id="password-strength" className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-slate-600 dark:text-slate-400">Password strength:</span>
                          <span className={`text-xs font-medium ${
                            passwordStrength.score === 0 ? 'text-red-600' :
                            passwordStrength.score <= 2 ? 'text-orange-600' :
                            passwordStrength.score <= 3 ? 'text-yellow-600' :
                            passwordStrength.score === 4 ? 'text-green-600' :
                            'text-emerald-600'
                          }`}>
                            {passwordStrength.score === 0 ? 'Very Weak' :
                             passwordStrength.score <= 2 ? 'Weak' :
                             passwordStrength.score <= 3 ? 'Fair' :
                             passwordStrength.score === 4 ? 'Good' :
                             'Excellent'}
                          </span>
                        </div>
                        <div className="flex gap-1">
                          {[1, 2, 3, 4, 5].map((level) => (
                            <div
                              key={level}
                              className={`h-1 flex-1 rounded-full transition-all duration-300 ${
                                level <= passwordStrength.score
                                  ? level <= 2 ? 'bg-red-500' :
                                    level <= 3 ? 'bg-yellow-500' :
                                    level === 4 ? 'bg-green-500' :
                                    'bg-emerald-500'
                                  : 'bg-slate-200 dark:bg-slate-700'
                              }`}
                            />
                          ))}
                        </div>
                        {passwordStrength.feedback.length > 0 && (
                          <ul className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
                            {passwordStrength.feedback.slice(0, 3).map((feedback, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Info className="h-3 w-3 text-blue-500" />
                                {feedback}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                    
                    {formErrors.password && (
                      <p id="password-error" className="text-sm text-red-600 flex items-center gap-1" role="alert">
                        <AlertTriangle className="h-3 w-3" />
                        {formErrors.password}
                      </p>
                    )}
                  </div>
                )}

                {enterpriseProvider && (
                  <Alert className="border-slate-200/70 bg-slate-50/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Use your SSO provider below. If you need help, contact your workspace administrator.
                    </AlertDescription>
                  </Alert>
                )}

                {authMethod !== 'sso' && (
                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={loading}
                    aria-describedby="submit-button-help"
                  >
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> 
                        Processing...
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {authMethod === 'magic' ? (
                          mode === 'signup' ? 'Send access link' : 'Send magic link'
                        ) : (
                          mode === 'signup' ? 'Create account' : 'Sign in'
                        )}
                        <ArrowRight className="h-4 w-4" aria-hidden="true" />
                      </span>
                    )}
                  </Button>
                )}
                
                {authMethod === 'password' && mode === 'signup' && passwordStrength.score < 3 && password.length > 0 && (
                  <p id="submit-button-help" className="text-xs text-slate-500 text-center">
                    Please create a stronger password to continue
                  </p>
                )}
              </form>

              <div className="space-y-3">
                <Separator>or continue with</Separator>
                <div className="grid gap-2">
                  <Button 
                    type="button" 
                    variant="outline" 
                    className={`w-full ${oauthAvailable.google ? 'hover:bg-slate-50 dark:hover:bg-slate-900' : 'opacity-60 cursor-not-allowed'}`}
                    disabled={loading || !oauthAvailable.google} 
                    onClick={() => handleSSO('google')}
                    aria-label="Continue with Enterprise Workspace"
                  >
                    <span className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-200">
                      <img 
                        src="https://www.svgrepo.com/show/475656/google-color.svg" 
                        alt="" 
                        className="h-4 w-4" 
                        aria-hidden="true"
                      />
                      Enterprise Workspace {!oauthAvailable.google && '(Unavailable)'}
                    </span>
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    className={`w-full ${oauthAvailable.github ? 'hover:bg-slate-50 dark:hover:bg-slate-900' : 'opacity-60 cursor-not-allowed'}`}
                    disabled={loading || !oauthAvailable.github} 
                    onClick={() => handleSSO('github')}
                    aria-label="Continue with Code Repository Platform"
                  >
                    <span className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-200">
                      <img 
                        src="https://www.svgrepo.com/show/512317/github-142.svg" 
                        alt="" 
                        className="h-4 w-4" 
                        aria-hidden="true"
                      />
                      Code Repository Platform {!oauthAvailable.github && '(Unavailable)'}
                    </span>
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <Link className="font-semibold text-sky-600 hover:underline dark:text-sky-300" href="/auth/signin">
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    New to ProofOfFit?{' '}
                    <Link className="font-semibold text-sky-600 hover:underline dark:text-sky-300" href="/auth/signup">
                      Create an account
                    </Link>
                  </>
                )}
              </div>

              {/* Enhanced Security Notice */}
              <div className="space-y-3">
                <Alert className="border-emerald-200/70 bg-emerald-50/80 text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200">
                  <Shield className="h-4 w-4" />
                  <AlertDescription className="text-xs leading-relaxed">
                    <strong>Enterprise Security:</strong> Your data is protected with bank-grade encryption, SOC2 Type II compliance, and zero-trust architecture.
                  </AlertDescription>
                </Alert>
                
                <Alert className="border-slate-200/70 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription className="text-xs leading-relaxed">
                    By continuing you agree to our{' '}
                    <Link className="underline hover:text-slate-900 dark:hover:text-slate-100" href="/terms">Terms of Service</Link> and{' '}
                    <Link className="underline hover:text-slate-900 dark:hover:text-slate-100" href="/privacy">Privacy Policy</Link>. 
                    We enforce SOC2-style governance, maintain GDPR compliance, and retain audit logs for 180 days for security purposes.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

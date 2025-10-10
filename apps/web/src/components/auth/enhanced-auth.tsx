'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/use-auth'
import { useCSRFHeaders } from '@/components/security/csrf-provider'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield, 
  AlertTriangle, 
  Loader2,
  User,
  Building2,
  ArrowRight,
  KeyRound,
  ExternalLink,
  Info,
  Users,
  Briefcase,
  CheckCircle
} from 'lucide-react'

// Domain-based SSO provider suggestions
const DOMAIN_ROUTING: Record<string, { key: string; label: string; hint?: string }> = {
  "company.com": { key: "sso", label: "Sign in with Company SSO", hint: "Okta" },
  "acme.io": { key: "google", label: "Continue with Google Workspace" },
  "contoso.com": { key: "microsoft", label: "Continue with Microsoft Entra ID" },
  "gmail.com": { key: "google", label: "Continue with Google" },
  "outlook.com": { key: "microsoft", label: "Continue with Microsoft" },
}

const DEFAULT_PROVIDERS = [
  { key: "sso", label: "Sign in with Company SSO" },
  { key: "google", label: "Continue with Google Workspace" },
  { key: "microsoft", label: "Continue with Microsoft Entra ID" },
]

type Audience = "hirer" | "seeker"

interface EnhancedAuthProps {
  mode?: 'signin' | 'signup'
  defaultAudience?: Audience
  redirectTo?: string
}

function BrandMark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" aria-hidden className={className}>
      <defs>
        <linearGradient id="pf" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="#2563EB" />
          <stop offset="100%" stopColor="#4F46E5" />
        </linearGradient>
      </defs>
      <rect x="2" y="2" width="28" height="28" rx="8" fill="#F6F9FF" />
      <path d="M9 22V10h7.5a4.5 4.5 0 0 1 0 9H14v3H9zm5-7h2.5a1.5 1.5 0 0 0 0-3H14v3z" fill="url(#pf)" />
    </svg>
  )
}

export default function EnhancedAuth({ 
  mode = 'signin', 
  defaultAudience = 'seeker',
  redirectTo = '/dashboard'
}: EnhancedAuthProps) {
  const router = useRouter()
  const { signIn, signUp, sendMagicLink, loading: authLoading, error: authError } = useAuth()
  const csrfHeaders = useCSRFHeaders()
  const [audience, setAudience] = useState<Audience>(defaultAudience)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const [confirmPasswordError, setConfirmPasswordError] = useState('')
  const [isValid, setIsValid] = useState(false)
  const [suggestedProvider, setSuggestedProvider] = useState<{ key: string; label: string; hint?: string } | null>(null)

  // Basic validation rules
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validatePassword = (value: string) => value.length >= 8

  // Watch email to suggest SSO automatically (hirer only)
  useEffect(() => {
    if (audience !== "hirer") { 
      setSuggestedProvider(null)
      return 
    }
    const domain = email?.split("@")[1]?.toLowerCase()
    if (!domain) {
      setSuggestedProvider(null)
      return
    }
    const provider = DOMAIN_ROUTING[domain] ?? null
    setSuggestedProvider(provider)
  }, [email, audience])

  useEffect(() => {
    // Re-validate on changes
    if (email && !validateEmail(email)) {
      setEmailError('Enter a valid email address')
    } else {
      setEmailError('')
    }
    
    if (password && !validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters')
    } else {
      setPasswordError('')
    }
    
    if (mode === 'signup' && confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }
    
    const baseValid = !!email && !!password && validateEmail(email) && validatePassword(password)
    const signupValid = mode === 'signup' ? !!confirmPassword && password === confirmPassword : true
    setIsValid(baseValid && signupValid)
  }, [email, password, confirmPassword, mode])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!isValid) return
    
    setIsLoading(true)
    setError('')
    
    try {
      let result
      
      if (mode === 'signin') {
        result = await signIn(email, password)
      } else {
        result = await signUp(email, password, { user_type: audience })
      }
      
      if (!result.success) {
        setError(result.error || 'Authentication failed. Please try again.')
        return
      }
      
      // Success - the auth hook will handle redirects
      if (mode === 'signup' && 'needsConfirmation' in result && result.needsConfirmation) {
        setError('Please check your email for a confirmation link.')
      }
    } catch (error) {
      setError('Authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleMagicLink = async () => {
    if (!email || !validateEmail(email)) {
      setError('Please enter a valid email address')
      return
    }

    setIsLoading(true)
    setError('')
    
    try {
      const result = await sendMagicLink(email)
      
      if (!result.success) {
        setError(result.error || 'Failed to send magic link. Please try again.')
        return
      }
      
      setError('Magic link sent! Please check your email.')
    } catch (error) {
      setError('Failed to send magic link. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handleSSO = async (providerKey: string) => {
    setIsLoading(true)
    try {
      // Simulate SSO redirect
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('SSO login with:', providerKey)
      // In a real app, you'd redirect to the SSO provider
    } catch (error) {
      setError('SSO authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const handlePasskey = async () => {
    setIsLoading(true)
    try {
      // Simulate passkey authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      console.log('Passkey authentication')
      // In a real app, you'd use WebAuthn API
    } catch (error) {
      setError('Passkey authentication failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isHirer = audience === "hirer"
  const isSignUp = mode === 'signup'

  return (
    <div className="w-full min-h-screen grid md:grid-cols-2 bg-white">
      {/* Left: Brand/Value */}
      <div className="hidden md:flex flex-col justify-between bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-900 p-10 relative overflow-hidden">
        <div>
          <div className="flex items-center gap-3">
            <BrandMark className="h-10 w-10" />
            <h1 className="text-5xl font-extrabold tracking-tight">ProofOfFit</h1>
          </div>
          <div className="h-1 w-28 bg-gradient-to-r from-blue-600 to-indigo-500 my-4 rounded" />
          <p className="max-w-sm text-gray-600">
            {isHirer 
              ? "Hire with confidence. Streamline reviews, collaborate with your team, and prove compliance — fast and secure."
              : "Land interviews with proof. Get evidence-based fit reports and tailored applications that showcase your strengths."
            }
          </p>
        </div>
        <ul className="space-y-3 text-sm text-gray-600">
          <li className="flex items-start gap-2">
            <Shield className="h-5 w-5 mt-0.5" /> 
            {isHirer ? "SSO, MFA, Passkeys." : "Secure, privacy-first authentication."}
          </li>
          <li className="flex items-start gap-2">
            <Building2 className="h-5 w-5 mt-0.5" /> 
            {isHirer ? "Role-based access: Admin, Recruiter, Reviewer." : "Evidence-based job matching."}
          </li>
          <li className="flex items-start gap-2">
            <Info className="h-5 w-5 mt-0.5" /> 
            SOC 2 + GDPR aligned.
          </li>
          <li className="opacity-70 text-xs">© {new Date().getFullYear()} ProofOfFit</li>
        </ul>
        <div className="pointer-events-none absolute inset-0 opacity-20" aria-hidden>
          <div className="absolute -top-24 -right-24 h-72 w-72 rounded-full blur-3xl bg-gradient-to-tr from-blue-600 to-indigo-500" />
        </div>
      </div>

      {/* Right: Actions */}
      <main className="flex items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-xl bg-white rounded-lg shadow-xl border border-gray-200 p-8">
          {/* Audience switcher */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-900">
              {isSignUp ? 'Create your account' : 'Sign in to ProofOfFit'}
            </h2>
            <div className="inline-flex rounded-2xl border border-gray-200 overflow-hidden">
              <button
                type="button"
                onClick={() => setAudience("hirer")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1 transition-colors ${
                  isHirer 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={isHirer}
              >
                <Briefcase className="h-4 w-4" /> Hiring team
              </button>
              <button
                type="button"
                onClick={() => setAudience("seeker")}
                className={`px-3 py-1.5 text-sm flex items-center gap-1 transition-colors ${
                  !isHirer 
                    ? "bg-blue-600 text-white" 
                    : "bg-white text-gray-700 hover:bg-gray-50"
                }`}
                aria-pressed={!isHirer}
              >
                <Users className="h-4 w-4" /> Job seeker
              </button>
            </div>
          </div>
          
          <p className="text-sm text-gray-600 mb-6">
            {isHirer
              ? "Use your work email. If your company has SSO enabled, we'll route you automatically."
              : "Use your email to access your applications and profile. We'll email you a secure sign-in link."}
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {(error || authError) && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error || authError}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  placeholder={isHirer ? "name@yourco.com" : "you@example.com"}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className={`block w-full pl-9 pr-3 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                    emailError ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
              </div>
              {emailError && <p className="text-sm text-red-600">{emailError}</p>}

              {isHirer && suggestedProvider && (
                <p className="text-xs text-gray-600">
                  Detected <span className="font-medium">{suggestedProvider.hint ?? suggestedProvider.label}</span> from your domain — you can continue or use the suggested SSO below.
                </p>
              )}
            </div>

            {!isHirer && (
              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete={isSignUp ? 'new-password' : 'current-password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      passwordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Enter your password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {passwordError && <p className="text-sm text-red-600">{passwordError}</p>}
                <p className="text-xs text-gray-500">Minimum 8 characters.</p>
              </div>
            )}

            {isSignUp && !isHirer && (
              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirm Password
                </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    autoComplete="new-password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className={`block w-full pl-10 pr-10 py-2 border rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${
                      confirmPasswordError ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Confirm your password"
                  />
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4 text-gray-400" />
                    ) : (
                      <Eye className="h-4 w-4 text-gray-400" />
                    )}
                  </button>
                </div>
                {confirmPasswordError && <p className="text-sm text-red-600">{confirmPasswordError}</p>}
              </div>
            )}

            {/* Primary CTA differs by audience */}
            <button
              type="submit"
              disabled={isLoading || authLoading || !isValid}
              className="w-full flex justify-center items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading || authLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Working…
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  {isHirer ? "Continue" : isSignUp ? "Create Account" : "Continue with email"}
                </>
              )}
            </button>

            {/* Divider */}
            <div className="relative text-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">or</span>
              </div>
            </div>

            {/* Audience-specific secondaries */}
            {isHirer ? (
              <div className="grid gap-3">
                {suggestedProvider && (
                  <button
                    type="button"
                    onClick={() => handleSSO(suggestedProvider.key)}
                    disabled={isLoading || authLoading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> {suggestedProvider.label}
                  </button>
                )}
                {DEFAULT_PROVIDERS.filter(p => p.key !== suggestedProvider?.key).map(p => (
                  <button
                    key={p.key}
                    type="button"
                    onClick={() => handleSSO(p.key)}
                    disabled={isLoading || authLoading}
                    className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ExternalLink className="mr-2 h-4 w-4" /> {p.label}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isLoading || authLoading}
                  className="w-full flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Email me a magic link
                </button>
                <button
                  type="button"
                  onClick={handlePasskey}
                  disabled={isLoading || authLoading}
                  className="w-full flex justify-center items-center px-4 py-2 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <KeyRound className="mr-2 h-4 w-4" /> Sign in with a Passkey
                </button>
              </div>
            ) : (
              <div className="grid gap-3">
                <button
                  type="button"
                  onClick={handleMagicLink}
                  disabled={isLoading || authLoading}
                  className="w-full flex justify-center items-center px-4 py-2 bg-gray-100 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Email me a magic link
                </button>
                <button
                  type="button"
                  onClick={handlePasskey}
                  disabled={isLoading || authLoading}
                  className="w-full flex justify-center items-center px-4 py-2 text-gray-600 text-sm font-medium rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  <KeyRound className="mr-2 h-4 w-4" /> Use a Passkey
                </button>
              </div>
            )}
          </form>

          {/* Help + RBAC microcopy */}
          <div className="mt-6 space-y-2 text-xs text-gray-600">
            {isHirer ? (
              <>
                <p>Don't have access? Ask your admin to invite you as <span className="font-medium">Recruiter</span>, <span className="font-medium">Reviewer</span>, or <span className="font-medium">Admin</span>.</p>
                <p>Need help signing in? <a href="/help/sign-in" className="underline">Get support</a>.</p>
              </>
            ) : (
              <>
                <p>No account yet? We'll create one as you sign in and connect your applications automatically.</p>
                <p>Having trouble? <a href="/help/candidates" className="underline">Candidate help</a>.</p>
              </>
            )}
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="text-[11px] leading-relaxed text-gray-500">
              By continuing, you agree to ProofOfFit's <a className="underline" href="/legal/terms">Terms</a> and <a className="underline" href="/legal/privacy">Privacy Policy</a> and our <a className="underline" href="/legal/eeoc">EEOC commitment</a>.
              We only send essential account and security emails.
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
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
  CheckCircle
} from 'lucide-react'

function SignUpPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/onboarding'
  const userType = searchParams.get('type') || 'seeker'
  
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

  // Basic validation rules
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validatePassword = (value: string) => value.length >= 8

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
    
    if (confirmPassword && password !== confirmPassword) {
      setConfirmPasswordError('Passwords do not match')
    } else {
      setConfirmPasswordError('')
    }
    
    setIsValid(
      !!email && 
      !!password && 
      !!confirmPassword &&
      validateEmail(email) && 
      validatePassword(password) &&
      password === confirmPassword
    )
  }, [email, password, confirmPassword])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // For demo purposes, accept any email/password
      if (isValid) {
        // Store user in localStorage for demo
        if (typeof window !== 'undefined') {
          localStorage.setItem('auth-token', 'demo-token')
          localStorage.setItem('user', JSON.stringify({ 
            email, 
            name: email.split('@')[0],
            type: userType
          }))
        }
        
        console.log('Account created successfully!')
        
        // Redirect to onboarding with user type
        router.push(`/onboarding?type=${userType}`)
      } else {
        setError('Fix validation errors before continuing')
      }
    } catch (error) {
      console.error('Auth error:', error)
      setError('Account creation failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  const isEmployer = userType === 'employer'

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            {isEmployer ? (
              <Building2 className="h-8 w-8 text-blue-600" />
            ) : (
              <User className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Create your account
          </h2>
          <p className="text-gray-600">
            {isEmployer 
              ? 'Start building better teams with ProofOfFit' 
              : 'Start your evidence-based job search'
            }
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="mb-6">
            <h3 className="text-xl font-semibold text-gray-900 text-center">
              Sign Up
            </h3>
            <div className="flex items-center justify-center mt-2">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isEmployer 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isEmployer ? (
                  <>
                    <Building2 className="h-4 w-4 mr-1" />
                    Employer Account
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    Job Seeker Account
                  </>
                )}
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-md p-4">
                <div className="flex">
                  <AlertTriangle className="h-5 w-5 text-red-400" />
                  <div className="ml-3">
                    <p className="text-sm text-red-800">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  aria-describedby={emailError ? 'email-error' : undefined}
                  aria-invalid={!!emailError || undefined}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Enter your email"
                />
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              </div>
              {emailError && (
                <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{emailError}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  aria-describedby={passwordError ? 'password-error' : undefined}
                  aria-invalid={!!passwordError || undefined}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Create a password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
              {passwordError && (
                <p id="password-error" className="mt-1 text-sm text-red-600" role="alert">{passwordError}</p>
              )}
              <p className="mt-1 text-xs text-gray-500">Minimum 8 characters.</p>
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  autoComplete="new-password"
                  required
                  aria-describedby={confirmPasswordError ? 'confirm-password-error' : undefined}
                  aria-invalid={!!confirmPasswordError || undefined}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  placeholder="Confirm your password"
                />
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
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
              {confirmPasswordError && (
                <p id="confirm-password-error" className="mt-1 text-sm text-red-600" role="alert">{confirmPasswordError}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || !isValid}
              className="w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  <Shield className="mr-2 h-4 w-4" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => router.push(`/auth/signin?type=${userType}${redirectTo !== '/onboarding' ? `&redirect=${redirectTo}` : ''}`)}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Sign in
              </button>
            </p>
          </div>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Demo Mode</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function SignUpPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sign up...</p>
        </div>
      </div>
    }>
      <SignUpPageContent />
    </Suspense>
  )
}
'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@proof-of-fit/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { 
  Mail, 
  Lock, 
  Eye, 
  EyeOff, 
  Shield
} from 'lucide-react'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')
  const router = useRouter()

  // Validation helpers
  const validateEmail = (value: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
  const validatePassword = (value: string) => value.length >= 8

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    let valid = true
    setError('')

    // Validate email
    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address')
      valid = false
    } else {
      setEmailError('')
    }
    // Validate password
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters')
      valid = false
    } else {
      setPasswordError('')
    }

    if (!valid) return

    setIsLoading(true)
    try {
      // Simulate authentication
      await new Promise(resolve => setTimeout(resolve, 1000))
      // For demo purposes, accept any email/password
      console.log('Sign in attempt:', { email, password })
      // Redirect to dashboard
      router.push('/dashboard')
    } catch (err) {
      setError('Sign in failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  // Blur handlers for immediate validation
  const handleEmailBlur = () => {
    if (!validateEmail(email)) {
      setEmailError('Enter a valid email address')
    } else {
      setEmailError('')
    }
  }
  const handlePasswordBlur = () => {
    if (!validatePassword(password)) {
      setPasswordError('Password must be at least 8 characters')
    } else {
      setPasswordError('')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <Shield className="mx-auto h-12 w-12 text-blue-600" />
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <a href="/auth/signup" className="font-medium text-blue-600 hover:text-blue-500">
              create a new account
            </a>
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Welcome back</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded">
                  {error}
                </div>
              )}
              
              <div>
                <Label htmlFor="email">Email address</Label>
                <div className="mt-1 relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={handleEmailBlur}
                    className="pl-10"
                    placeholder="Enter your email"
                    aria-describedby={emailError ? 'email-error' : undefined}
                    aria-invalid={!!emailError || undefined}
                  />
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                </div>
                {emailError && (
                  <p id="email-error" className="mt-1 text-sm text-red-600" role="alert">{emailError}</p>
                )}
              </div>

              <div>
                <Label htmlFor="password">Password</Label>
                <div className="mt-1 relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={handlePasswordBlur}
                    className="pl-10 pr-10"
                    placeholder="Enter your password"
                    aria-describedby={passwordError ? 'password-error' : undefined}
                    aria-invalid={!!passwordError || undefined}
                  />
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setShowPassword(!showPassword)}
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
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                    Remember me
                  </label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-blue-600 hover:text-blue-500">
                    Forgot your password?
                  </a>
                </div>
              </div>

              <Button
                type="submit"
                disabled={isLoading}
                className="w-full"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
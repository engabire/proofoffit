'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EnhancedAuth from '@/components/auth/enhanced-auth'
import EnterpriseLogin from '@/components/auth/enterprise-login'
import { EnhancedHeader } from '@/components/navigation/enhanced-header'

function SignUpPageContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/onboarding'
  const userType = searchParams.get('type') || 'seeker'
  const variant = searchParams.get('variant') || 'standard'
  
  // Convert userType to audience format
  const defaultAudience = userType === 'employer' ? 'hirer' : 'seeker'

  // Use enterprise login if variant is 'enterprise'
  if (variant === 'enterprise') {
    return <EnterpriseLogin />
  }

  return (
    <div className="min-h-screen">
      <EnhancedHeader variant="minimal" />
      <EnhancedAuth 
        mode="signup"
        defaultAudience={defaultAudience}
        redirectTo={redirectTo}
      />
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
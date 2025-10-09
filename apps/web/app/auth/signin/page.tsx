'use client'

import React, { Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import EnhancedAuth from '@/components/auth/enhanced-auth'

function SignInPageContent() {
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get('redirect') || '/dashboard'
  const userType = searchParams.get('type') || 'seeker'
  
  // Convert userType to audience format
  const defaultAudience = userType === 'employer' ? 'hirer' : 'seeker'

  return (
    <EnhancedAuth 
      mode="signin"
      defaultAudience={defaultAudience}
      redirectTo={redirectTo}
    />
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading sign in...</p>
        </div>
      </div>
    }>
      <SignInPageContent />
    </Suspense>
  )
}
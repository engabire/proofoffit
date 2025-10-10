'use client'

import React from 'react'
import { OnboardingFlow } from '@/components/onboarding/onboarding-flow'
import { SecureAuthGuard } from '@/components/auth/secure-auth-guard'

export default function OnboardingPage() {
  return (
    <SecureAuthGuard requireAuth={true}>
      <OnboardingFlow />
    </SecureAuthGuard>
  )
}
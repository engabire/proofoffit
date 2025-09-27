import Stripe from 'stripe'

import { credentialManager } from '@/lib/security/credential-manager'

// Stripe configuration - SECURE VERSION
export const stripeConfig = {
  apiKey: credentialManager.getCredential('STRIPE_SECRET_KEY'),
  publishableKey: credentialManager.getCredential('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  webhookSecret: credentialManager.getCredential('STRIPE_WEBHOOK_SECRET'),
  connectAccountId: 'acct_1S83Ea5r3cXmAzLD', // Extracted from your connect URL
}

// Initialize Stripe instance
export const stripe = new Stripe(stripeConfig.apiKey, {
  apiVersion: '2024-06-20',
  typescript: true,
})

// Subscription plans
export const subscriptionPlans = {
  candidate: {
    free: {
      id: 'candidate_free',
      name: 'Free',
      price: 0,
      interval: 'month',
      features: [
        'Basic job search',
        '5 applications per month',
        'Basic resume matching',
        'Email support'
      ],
      limits: {
        applications: 5,
        searches: 50,
        resumeDownloads: 1
      }
    },
    pro: {
      id: 'candidate_pro',
      name: 'Pro',
      price: 29.99,
      interval: 'month',
      features: [
        'Unlimited job search',
        'Unlimited applications',
        'AI-powered resume tailoring',
        'Priority support',
        'Advanced analytics',
        'Cover letter generation'
      ],
      limits: {
        applications: -1, // unlimited
        searches: -1,
        resumeDownloads: -1
      }
    }
  },
  employer: {
    starter: {
      id: 'employer_starter',
      name: 'Starter',
      price: 99.99,
      interval: 'month',
      features: [
        'Post up to 5 jobs',
        'Basic candidate matching',
        'Email notifications',
        'Basic analytics'
      ],
      limits: {
        jobPosts: 5,
        candidateViews: 100,
        teamMembers: 2
      }
    },
    professional: {
      id: 'employer_professional',
      name: 'Professional',
      price: 299.99,
      interval: 'month',
      features: [
        'Unlimited job posts',
        'Advanced candidate ranking',
        'Team collaboration',
        'Advanced analytics',
        'API access',
        'Priority support'
      ],
      limits: {
        jobPosts: -1,
        candidateViews: -1,
        teamMembers: 10
      }
    },
    enterprise: {
      id: 'employer_enterprise',
      name: 'Enterprise',
      price: 999.99,
      interval: 'month',
      features: [
        'Everything in Professional',
        'Custom integrations',
        'Dedicated support',
        'Custom branding',
        'Advanced compliance tools',
        'Unlimited team members'
      ],
      limits: {
        jobPosts: -1,
        candidateViews: -1,
        teamMembers: -1
      }
    }
  }
}

// Helper function to get plan by ID
export function getPlanById(planId: string) {
  for (const userType of Object.keys(subscriptionPlans)) {
    for (const plan of Object.values(subscriptionPlans[userType as keyof typeof subscriptionPlans])) {
      if (plan.id === planId) {
        return { ...plan, userType }
      }
    }
  }
  return null
}

// Helper function to get plans by user type
export function getPlansByUserType(userType: 'candidate' | 'employer') {
  return subscriptionPlans[userType]
}

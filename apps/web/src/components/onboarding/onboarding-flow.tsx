'use client'

import React from 'react'
import { Wizard, type WizardStep } from './progress-indicator'
import { useAuth } from '@/hooks/use-auth'
import { useRouter } from 'next/navigation'

// Step 1: Welcome & User Type Selection
function WelcomeStep({ 
  data, 
  onUpdate, 
  onNext 
}: { 
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}) {
  const [userType, setUserType] = React.useState(data?.userType || '')

  React.useEffect(() => {
    onUpdate({ userType })
  }, [userType, onUpdate])

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Welcome to ProofOfFit!
        </h3>
        <p className="text-gray-600">
          Let's get you set up. First, tell us what brings you here.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => setUserType('candidate')}
          className={`
            p-6 border-2 rounded-lg text-left transition-all
            ${userType === 'candidate' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">I'm looking for a job</h4>
              <p className="text-sm text-gray-600">Find opportunities that match your skills and goals</p>
            </div>
          </div>
        </button>

        <button
          onClick={() => setUserType('employer')}
          className={`
            p-6 border-2 rounded-lg text-left transition-all
            ${userType === 'employer' 
              ? 'border-blue-500 bg-blue-50' 
              : 'border-gray-200 hover:border-gray-300'
            }
          `}
        >
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
              </svg>
            </div>
            <div>
              <h4 className="font-medium text-gray-900">I'm hiring</h4>
              <p className="text-sm text-gray-600">Find the best candidates for your team</p>
            </div>
          </div>
        </button>
      </div>

      {userType && (
        <div className="text-center">
          <button
            onClick={onNext}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continue
          </button>
        </div>
      )}
    </div>
  )
}

// Step 2: Profile Setup
function ProfileStep({ 
  data, 
  onUpdate, 
  onNext 
}: { 
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}) {
  const [profile, setProfile] = React.useState(data || {
    firstName: '',
    lastName: '',
    email: '',
    company: '',
    role: ''
  })

  React.useEffect(() => {
    onUpdate(profile)
  }, [profile, onUpdate])

  const isEmployer = data?.userType === 'employer'

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Tell us about yourself
        </h3>
        <p className="text-gray-600">
          This information helps us personalize your experience.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            First Name
          </label>
          <input
            type="text"
            value={profile.firstName}
            onChange={(e) => setProfile(prev => ({ ...prev, firstName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your first name"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Last Name
          </label>
          <input
            type="text"
            value={profile.lastName}
            onChange={(e) => setProfile(prev => ({ ...prev, lastName: e.target.value }))}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter your last name"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email Address
        </label>
        <input
          type="email"
          value={profile.email}
          onChange={(e) => setProfile(prev => ({ ...prev, email: e.target.value }))}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter your email address"
        />
      </div>

      {isEmployer && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Company
            </label>
            <input
              type="text"
              value={profile.company}
              onChange={(e) => setProfile(prev => ({ ...prev, company: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter your company name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              value={profile.role}
              onChange={(e) => setProfile(prev => ({ ...prev, role: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select your role</option>
              <option value="hr-manager">HR Manager</option>
              <option value="recruiter">Recruiter</option>
              <option value="hiring-manager">Hiring Manager</option>
              <option value="ceo">CEO/Founder</option>
              <option value="other">Other</option>
            </select>
          </div>
        </>
      )}

      <div className="text-center">
        <button
          onClick={onNext}
          disabled={!profile.firstName || !profile.lastName || !profile.email}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 3: Preferences
function PreferencesStep({ 
  data, 
  onUpdate, 
  onNext 
}: { 
  data: any
  onUpdate: (data: any) => void
  onNext: () => void
}) {
  const [preferences, setPreferences] = React.useState(data || {
    notifications: true,
    newsletter: false,
    dataSharing: true
  })

  React.useEffect(() => {
    onUpdate(preferences)
  }, [preferences, onUpdate])

  const isEmployer = data?.userType === 'employer'

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          Set your preferences
        </h3>
        <p className="text-gray-600">
          Choose how you'd like to receive updates and notifications.
        </p>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Email Notifications</h4>
            <p className="text-sm text-gray-600">
              {isEmployer 
                ? 'Get notified about new candidates and application updates'
                : 'Get notified about new job matches and application status'
              }
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.notifications}
              onChange={(e) => setPreferences(prev => ({ ...prev, notifications: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Newsletter</h4>
            <p className="text-sm text-gray-600">
              Receive tips, updates, and industry insights
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.newsletter}
              onChange={(e) => setPreferences(prev => ({ ...prev, newsletter: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>

        <div className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
          <div>
            <h4 className="font-medium text-gray-900">Data Sharing</h4>
            <p className="text-sm text-gray-600">
              Help improve our matching algorithms (anonymized)
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={preferences.dataSharing}
              onChange={(e) => setPreferences(prev => ({ ...prev, dataSharing: e.target.checked }))}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </label>
        </div>
      </div>

      <div className="text-center">
        <button
          onClick={onNext}
          className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Continue
        </button>
      </div>
    </div>
  )
}

// Step 4: Completion
function CompletionStep({ 
  data, 
  onNext 
}: { 
  data: any
  onNext: () => void
}) {
  const router = useRouter()
  const { user } = useAuth()

  const handleComplete = () => {
    // Redirect based on user type
    if (data?.userType === 'employer') {
      router.push('/employer/dashboard')
    } else {
      router.push('/dashboard')
    }
  }

  return (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome to ProofOfFit!
        </h3>
        <p className="text-gray-600 max-w-md mx-auto">
          Your account is set up and ready to go. You can always update your preferences in settings.
        </p>
      </div>

      <div className="bg-gray-50 rounded-lg p-6 max-w-md mx-auto">
        <h4 className="font-medium text-gray-900 mb-3">What's next?</h4>
        <ul className="text-sm text-gray-600 space-y-2 text-left">
          {data?.userType === 'employer' ? (
            <>
              <li>• Create your first job posting</li>
              <li>• Set up your team and permissions</li>
              <li>• Configure your hiring workflow</li>
            </>
          ) : (
            <>
              <li>• Complete your profile</li>
              <li>• Upload your resume</li>
              <li>• Start browsing job opportunities</li>
            </>
          )}
        </ul>
      </div>

      <button
        onClick={handleComplete}
        className="px-8 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors font-medium"
      >
        Get Started
      </button>
    </div>
  )
}

// Main Onboarding Flow Component
interface OnboardingFlowProps {
  className?: string
}

export function OnboardingFlow({ className }: OnboardingFlowProps) {
  const router = useRouter()
  const { user } = useAuth()

  const steps: WizardStep[] = [
    {
      id: 'welcome',
      title: 'Welcome',
      description: 'Choose your user type',
      component: WelcomeStep,
      validation: () => {
        // Validation will be handled in the component
        return true
      }
    },
    {
      id: 'profile',
      title: 'Profile',
      description: 'Tell us about yourself',
      component: ProfileStep,
      validation: () => {
        // Validation will be handled in the component
        return true
      }
    },
    {
      id: 'preferences',
      title: 'Preferences',
      description: 'Set your preferences',
      component: PreferencesStep
    },
    {
      id: 'complete',
      title: 'Complete',
      description: 'You\'re all set!',
      component: CompletionStep
    }
  ]

  const handleComplete = (data: any) => {
    console.log('Onboarding completed with data:', data)
    // Here you would typically save the onboarding data to your backend
  }

  const handleStepChange = (stepId: string, data: any) => {
    console.log('Step changed to:', stepId, 'with data:', data)
  }

  // Redirect if user is already authenticated and has completed onboarding
  React.useEffect(() => {
    if (user && user.user_metadata?.onboarding_completed) {
      router.push('/dashboard')
    }
  }, [user, router])

  return (
    <div className={`min-h-screen bg-gray-50 py-12 ${className}`}>
      <div className="max-w-2xl mx-auto px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome to ProofOfFit
          </h1>
          <p className="text-gray-600">
            Let's get you set up in just a few steps
          </p>
        </div>

        <Wizard
          steps={steps}
          onComplete={handleComplete}
          onStepChange={handleStepChange}
          showProgress={true}
          allowSkip={false}
        />
      </div>
    </div>
  )
}

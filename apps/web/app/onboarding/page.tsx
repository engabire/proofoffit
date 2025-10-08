'use client'

import React, { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  UserCheck, 
  Briefcase, 
  ArrowRight, 
  CheckCircle, 
  Target, 
  Shield, 
  Users,
  FileText,
  Sparkles,
  Building2,
  TrendingUp,
  Lock
} from 'lucide-react'

export default function OnboardingPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const userType = searchParams.get('type') || 'seeker'
  const [step, setStep] = useState(1)

  const isSeeker = userType === 'seeker'
  const isEmployer = userType === 'employer'

  const handleGetStarted = () => {
    if (isSeeker) {
      router.push('/app/fit-simple')
    } else {
      router.push('/employer/dashboard')
    }
  }

  const seekerBenefits = [
    {
      icon: <Target className="h-6 w-6 text-blue-600" />,
      title: "Evidence-Based Applications",
      description: "Get detailed fit reports that explain exactly why you match each role, with specific evidence from your experience."
    },
    {
      icon: <TrendingUp className="h-6 w-6 text-green-600" />,
      title: "3.2x More Interviews",
      description: "Our users see a 3.2x increase in interview rates within 30 days of using ProofOfFit."
    },
    {
      icon: <Shield className="h-6 w-6 text-purple-600" />,
      title: "Audit-Ready Applications",
      description: "Every application comes with a shareable audit trail that sets you apart from other candidates."
    }
  ]

  const employerBenefits = [
    {
      icon: <Users className="h-6 w-6 text-blue-600" />,
      title: "Bias-Aware Matching",
      description: "Get ranked candidate slates with transparent explanations for every match, reducing unconscious bias."
    },
    {
      icon: <Lock className="h-6 w-6 text-green-600" />,
      title: "Immutable Audit Trails",
      description: "Every hiring decision has a verifiable URL for compliance, EEOC requirements, and stakeholder transparency."
    },
    {
      icon: <Building2 className="h-6 w-6 text-purple-600" />,
      title: "Team Collaboration",
      description: "Collaboration tools that help hiring managers, compliance, and recruiters stay aligned throughout the process."
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-2">
              {isSeeker ? (
                <UserCheck className="h-5 w-5 text-blue-600" />
              ) : (
                <Briefcase className="h-5 w-5 text-blue-600" />
              )}
              <span className="text-sm font-medium text-gray-700">
                {isSeeker ? 'Job Seeker' : 'Employer'} Onboarding
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Welcome Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6">
            {isSeeker ? (
              <UserCheck className="h-8 w-8 text-blue-600" />
            ) : (
              <Briefcase className="h-8 w-8 text-blue-600" />
            )}
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to ProofOfFit
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {isSeeker 
              ? "Let's get you started with evidence-based job applications that land more interviews."
              : "Let's set up your hiring process with transparent, bias-aware candidate matching."
            }
          </p>
        </div>

        {/* Benefits Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            Here's what you'll get:
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {(isSeeker ? seekerBenefits : employerBenefits).map((benefit, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg mb-4">
                  {benefit.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {benefit.title}
                </h3>
                <p className="text-gray-600 text-sm">
                  {benefit.description}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* How It Works */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
            How it works:
          </h2>
          <div className="grid md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                1
              </div>
              <h3 className="font-semibold mb-2">
                {isSeeker ? 'Build Your Profile' : 'Set Up Your Account'}
              </h3>
              <p className="text-sm text-gray-600">
                {isSeeker 
                  ? 'Import your resume and add project evidence.'
                  : 'Configure your company profile and hiring preferences.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                2
              </div>
              <h3 className="font-semibold mb-2">
                {isSeeker ? 'Find Opportunities' : 'Post Jobs'}
              </h3>
              <p className="text-sm text-gray-600">
                {isSeeker 
                  ? 'Browse jobs and get instant fit analysis.'
                  : 'Create job postings with clear requirements.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                3
              </div>
              <h3 className="font-semibold mb-2">
                {isSeeker ? 'Get Fit Reports' : 'Review Candidates'}
              </h3>
              <p className="text-sm text-gray-600">
                {isSeeker 
                  ? 'Receive detailed match analysis with evidence.'
                  : 'Get ranked slates with transparent explanations.'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-lg font-bold">
                4
              </div>
              <h3 className="font-semibold mb-2">
                {isSeeker ? 'Apply with Confidence' : 'Make Decisions'}
              </h3>
              <p className="text-sm text-gray-600">
                {isSeeker 
                  ? 'Apply knowing exactly why you match.'
                  : 'Make informed decisions with audit trails.'
                }
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <button 
            onClick={handleGetStarted}
            className="inline-flex items-center px-8 py-4 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 transition-colors"
          >
            {isSeeker ? 'Start My Job Search' : 'Start Hiring'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </button>
          <p className="text-sm text-gray-500 mt-4">
            {isSeeker 
              ? 'Get your first fit report in under 2 minutes'
              : 'Set up your first job posting in 5 minutes'
            }
          </p>
        </div>
      </div>
    </div>
  )
}

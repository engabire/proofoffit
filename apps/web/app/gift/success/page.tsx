'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { 
  CheckCircle, 
  Gift, 
  Share2, 
  Calendar, 
  Download, 
  ExternalLink, 
  Users, 
  Trophy, 
  Sparkles,
  Mail,
  Copy,
  Heart,
  ArrowRight,
  Shield,
  Star,
  Target,
  TrendingUp
} from 'lucide-react'

// Simple toast implementation
const toast = {
  // eslint-disable-next-line no-console
  success: (message: string) => console.log('Success:', message),
  // eslint-disable-next-line no-console
  error: (message: string) => console.error('Error:', message)
}

function GiftSuccessPageContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(false)
  
  // Get gift details from URL params
  const months = searchParams.get('months') || '3'
  const recipient = searchParams.get('recipient') || 'Your friend'
  const giftCode = `PROOF-GIFT-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
  
  const handleCopyCode = () => {
    navigator.clipboard.writeText(giftCode)
    toast.success('Gift code copied to clipboard!')
  }

  const handleShareEmail = () => {
    const subject = `You've received a ${months}-month ProofOfFit Pro gift!`
    const body = `Hi ${recipient},

You've been gifted ${months} months of ProofOfFit Pro! 

Your gift code is: ${giftCode}

ProofOfFit Pro helps job seekers get evidence-based job matching, tailored resumes, and cover letters that lead to more interviews.

Redeem your gift at: https://www.proofoffit.com/gift/redeem

Best regards,
The ProofOfFit Team`
    
    const mailtoLink = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    window.open(mailtoLink)
  }

  const handleShareSocial = (platform: string) => {
    const text = `I just gifted ${months} months of ProofOfFit Pro to help someone land their dream job! 🎁 #ProofOfFit #JobSearch`
    const url = 'https://www.proofoffit.com/gift'
    
    let shareUrl = ''
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`
        break
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`
        break
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`
        break
    }
    
    if (shareUrl) {
      window.open(shareUrl, '_blank', 'width=600,height=400')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-4">
              <a href="/" className="text-gray-600 hover:text-gray-900 transition-colors">
                Back to Home
              </a>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success Message */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Gift Sent Successfully! 🎉
          </h1>
          <p className="text-xl text-gray-600 mb-6">
            You've gifted <span className="font-semibold text-blue-600">{months} months</span> of ProofOfFit Pro to <span className="font-semibold">{recipient}</span>
          </p>
          <p className="text-gray-600">
            They'll receive an email with their gift code and instructions to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Gift Details */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gift Details</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center">
                  <Gift className="h-6 w-6 text-blue-600 mr-3" />
                  <div>
                    <p className="font-medium text-gray-900">ProofOfFit Pro</p>
                    <p className="text-sm text-gray-600">{months} month{months !== '1' ? 's' : ''}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">Gift Code</p>
                  <p className="text-sm text-gray-600 font-mono">{giftCode}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900">What they'll get:</h3>
                <ul className="space-y-2">
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Evidence-based job matching with fit scores
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Tailored resume generation for each application
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Personalized cover letter creation
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Interview preparation tools and tips
                  </li>
                  <li className="flex items-center text-sm text-gray-600">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                    Priority support and career guidance
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Share Options */}
          <div className="bg-white rounded-lg shadow-sm border p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Share Your Gift</h2>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Copy Gift Code</h3>
                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={giftCode}
                    readOnly
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-gray-50 font-mono text-sm"
                  />
                  <button
                    onClick={handleCopyCode}
                    className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Send via Email</h3>
                <button
                  onClick={handleShareEmail}
                  className="w-full flex items-center justify-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                >
                  <Mail className="h-4 w-4 mr-2" />
                  Send Email
                </button>
              </div>
              
              <div>
                <h3 className="font-medium text-gray-900 mb-3">Share on Social</h3>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => handleShareSocial('twitter')}
                    className="flex items-center justify-center px-3 py-2 bg-blue-500 text-white text-sm font-medium rounded-md hover:bg-blue-600 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShareSocial('linkedin')}
                    className="flex items-center justify-center px-3 py-2 bg-blue-700 text-white text-sm font-medium rounded-md hover:bg-blue-800 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShareSocial('facebook')}
                    className="flex items-center justify-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Share2 className="h-4 w-4 mr-1" />
                    Facebook
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Impact Section */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              The Impact of Your Gift
            </h2>
            <p className="text-gray-600">
              You're helping someone take control of their job search with evidence-based tools.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Better Targeting</h3>
              <p className="text-gray-600 text-sm">
                They'll apply to jobs that actually match their skills and experience.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">More Interviews</h3>
              <p className="text-gray-600 text-sm">
                Our users see 3.2x more interview requests within 30 days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Heart className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Confidence Boost</h3>
              <p className="text-gray-600 text-sm">
                They'll feel more confident knowing their applications are evidence-based.
              </p>
            </div>
          </div>
        </div>

        {/* Next Steps */}
        <div className="mt-8 text-center">
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Want to help more people?
            </h3>
            <p className="text-gray-600 mb-4">
              Consider gifting ProofOfFit Pro to other job seekers in your network.
            </p>
            <button
              onClick={() => router.push('/gift')}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Gift className="h-4 w-4 mr-2" />
              Send Another Gift
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function GiftSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    }>
      <GiftSuccessPageContent />
    </Suspense>
  )
}
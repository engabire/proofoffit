'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Gift, 
  Heart, 
  Users, 
  Star, 
  CheckCircle, 
  ArrowRight, 
  CreditCard, 
  Shield, 
  Mail, 
  MessageSquare, 
  Calendar, 
  DollarSign,
  Loader2,
  Sparkles,
  Target,
  TrendingUp,
  Award
} from 'lucide-react'

// Simple toast implementation
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

type GiftOption = {
  id: string
  months: number
  price: number
  originalPrice: number
  discount: number
  popular: boolean
  features: string[]
}

export default function GiftPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedOption, setSelectedOption] = useState<string>('3')
  const [recipientEmail, setRecipientEmail] = useState('')
  const [recipientName, setRecipientName] = useState('')
  const [senderName, setSenderName] = useState('')
  const [message, setMessage] = useState('')
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  const giftOptions: GiftOption[] = [
    {
      id: '1',
      months: 1,
      price: 29,
      originalPrice: 29,
      discount: 0,
      popular: false,
      features: [
        'Full access to job matching',
        'Tailored resume generation',
        'Cover letter creation',
        'Fit score analysis'
      ]
    },
    {
      id: '3',
      months: 3,
      price: 75,
      originalPrice: 87,
      discount: 14,
      popular: true,
      features: [
        'Everything in 1 month',
        'Priority support',
        'Advanced analytics',
        'Interview preparation tools'
      ]
    },
    {
      id: '6',
      months: 6,
      price: 135,
      originalPrice: 174,
      discount: 22,
      popular: false,
      features: [
        'Everything in 3 months',
        'Personal career coach',
        'Networking opportunities',
        'Exclusive job board access'
      ]
    },
    {
      id: '12',
      months: 12,
      price: 240,
      originalPrice: 348,
      discount: 31,
      popular: false,
      features: [
        'Everything in 6 months',
        'Lifetime access to updates',
        'Premium job recommendations',
        'Direct employer connections'
      ]
    }
  ]

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          setIsAuthenticated(true)
          const user = localStorage.getItem('user')
          if (user) {
            const userData = JSON.parse(user)
            setSenderName(userData.name || '')
          }
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [])

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  const selectedGift = giftOptions.find(option => option.id === selectedOption)

  const handlePurchase = async () => {
    if (!recipientEmail || !recipientName || !senderName) {
      toast.error('Please fill in all required fields')
      return
    }

    setIsLoading(true)
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // In a real app, you'd process the payment and send the gift
      toast.success('Gift purchased successfully!')
      
      // Redirect to success page
      router.push(`/gift/success?months=${selectedGift?.months}&recipient=${encodeURIComponent(recipientName)}`)
    } catch (error) {
      toast.error('Failed to process gift purchase. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
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

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center rounded-full bg-pink-100 px-4 py-2 text-sm font-medium text-pink-600 mb-6">
            <Heart className="h-4 w-4 mr-2" />
            Gift ProofOfFit Pro
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Help someone land their
            <br />
            <span className="text-blue-600">dream job</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Give the gift of evidence-based job matching. Help a job seeker get tailored resumes, 
            cover letters, and fit analysis that leads to more interviews.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Gift Options */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose Your Gift</h2>
            <div className="space-y-4">
              {giftOptions.map((option) => (
                <div
                  key={option.id}
                  className={`relative border-2 rounded-lg p-6 cursor-pointer transition-all ${
                    selectedOption === option.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedOption(option.id)}
                >
                  {option.popular && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center rounded-full bg-blue-600 px-3 py-1 text-xs font-medium text-white">
                        <Star className="h-3 w-3 mr-1" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {option.months} Month{option.months > 1 ? 's' : ''}
                      </h3>
                      <p className="text-sm text-gray-600">of ProofOfFit Pro</p>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-gray-900">
                        ${option.price}
                      </div>
                      {option.discount > 0 && (
                        <div className="text-sm text-gray-500 line-through">
                          ${option.originalPrice}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {option.features.map((feature, index) => (
                      <li key={index} className="flex items-center text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  {option.discount > 0 && (
                    <div className="mt-4 inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
                      Save {option.discount}%
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Gift Details Form */}
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Gift Details</h2>
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <form onSubmit={(e) => { e.preventDefault(); handlePurchase(); }} className="space-y-6">
                {/* Recipient Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Recipient Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="recipientName" className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Name *
                      </label>
                      <input
                        type="text"
                        id="recipientName"
                        value={recipientName}
                        onChange={(e) => setRecipientName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter recipient's name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="recipientEmail" className="block text-sm font-medium text-gray-700 mb-2">
                        Recipient Email *
                      </label>
                      <input
                        type="email"
                        id="recipientEmail"
                        value={recipientEmail}
                        onChange={(e) => setRecipientEmail(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter recipient's email"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Sender Information */}
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="senderName" className="block text-sm font-medium text-gray-700 mb-2">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="senderName"
                        value={senderName}
                        onChange={(e) => setSenderName(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Enter your name"
                        required
                      />
                    </div>
                    
                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
                        Personal Message
                      </label>
                      <textarea
                        id="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                        placeholder="Add a personal message (optional)"
                      />
                    </div>
                  </div>
                </div>

                {/* Gift Summary */}
                {selectedGift && (
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-3">Gift Summary</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">ProofOfFit Pro</span>
                        <span className="text-gray-900">{selectedGift.months} month{selectedGift.months > 1 ? 's' : ''}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Price</span>
                        <span className="text-gray-900">${selectedGift.price}</span>
                      </div>
                      {selectedGift.discount > 0 && (
                        <div className="flex justify-between text-green-600">
                          <span>Discount</span>
                          <span>-{selectedGift.discount}%</span>
                        </div>
                      )}
                      <div className="border-t border-gray-200 pt-2">
                        <div className="flex justify-between font-semibold">
                          <span>Total</span>
                          <span>${selectedGift.price}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Purchase Button */}
                <button
                  type="submit"
                  disabled={isLoading || !selectedGift}
                  className="w-full flex items-center justify-center px-6 py-3 bg-blue-600 text-white text-lg font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Gift className="h-5 w-5 mr-2" />
                      Purchase Gift
                      <ArrowRight className="h-5 w-5 ml-2" />
                    </>
                  )}
                </button>

                {/* Security Notice */}
                <div className="flex items-start space-x-2 text-sm text-gray-600">
                  <Shield className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span>
                    Your payment is secure and encrypted. The recipient will receive their gift via email 
                    within 24 hours of purchase.
                  </span>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Benefits Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Why Gift ProofOfFit Pro?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Target className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Evidence-Based Matching</h3>
              <p className="text-gray-600">
                Help them get detailed fit reports that explain exactly why they match each role.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">3.2x More Interviews</h3>
              <p className="text-gray-600">
                Our users see a significant increase in interview rates within 30 days.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-8 w-8 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Professional Tools</h3>
              <p className="text-gray-600">
                Tailored resumes, cover letters, and interview preparation materials.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
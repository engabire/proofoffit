'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Check, Star, Zap, Building2, User } from 'lucide-react'
import { subscriptionPlans } from '@/lib/stripe/config'
import { stripeClient } from '@/lib/stripe/client'
// import { useAuth } from '@/components/auth/auth-guard'
// Simple toast implementation
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

export default function PricingPage() {
  const [selectedUserType, setSelectedUserType] = useState<'candidate' | 'employer'>('candidate')
  const [loading, setLoading] = useState<string | null>(null)
  // const { isAuthenticated, user } = useAuth()
  const isAuthenticated = true // Demo mode
  const user = { id: 'demo-user', email: 'demo@example.com' }

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to subscribe')
      return
    }

    setLoading(planId)
    try {
      const { sessionId } = await stripeClient.createCheckoutSession(
        planId,
        user.id,
        user.email || ''
      )

      // Redirect to Stripe Checkout
      window.location.href = `/api/stripe/checkout?session_id=${sessionId}`
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription process')
    } finally {
      setLoading(null)
    }
  }

  const plans = subscriptionPlans[selectedUserType]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Choose Your Plan
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Start your journey with ProofOfFit today
          </p>

          {/* User Type Toggle */}
          <div className="flex justify-center mb-8">
            <div className="bg-white rounded-lg p-1 shadow-sm">
              <button
                onClick={() => setSelectedUserType('candidate')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedUserType === 'candidate'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="w-4 h-4 inline mr-2" />
                Job Seekers
              </button>
              <button
                onClick={() => setSelectedUserType('employer')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedUserType === 'employer'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="w-4 h-4 inline mr-2" />
                Employers
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {Object.entries(plans).map(([key, plan]) => {
            const isPopular = key === 'pro' || key === 'professional'
            const isEnterprise = key === 'enterprise'

            return (
              <Card
                key={plan.id}
                className={`relative ${
                  isPopular
                    ? 'border-blue-500 shadow-lg scale-105'
                    : 'border-gray-200'
                } ${isEnterprise ? 'border-purple-500' : ''}`}
              >
                {isPopular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-blue-600 text-white px-4 py-1">
                      <Star className="w-3 h-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {isEnterprise && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-purple-600 text-white px-4 py-1">
                      <Zap className="w-3 h-3 mr-1" />
                      Enterprise
                    </Badge>
                  </div>
                )}

                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-2xl font-bold text-gray-900">
                    {plan.name}
                  </CardTitle>
                  <div className="mt-4">
                    <span className="text-4xl font-bold text-gray-900">
                      ${plan.price}
                    </span>
                    <span className="text-gray-600 ml-2">
                      /{plan.interval}
                    </span>
                  </div>
                  {plan.price === 0 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Free forever
                    </p>
                  )}
                </CardHeader>

                <CardContent className="space-y-6">
                  {/* Features */}
                  <div className="space-y-3">
                    {plan.features.map((feature: string, index: number) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Limits */}
                  {plan.limits && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">Plan Limits</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {Object.entries(plan.limits).map(([key, value]) => (
                          <div key={key} className="flex justify-between">
                            <span className="capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-medium">
                              {value === -1 ? 'Unlimited' : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* CTA Button */}
                  <Button
                    onClick={() => handleSubscribe(plan.id)}
                    disabled={loading === plan.id}
                    className={`w-full ${
                      isPopular
                        ? 'bg-blue-600 hover:bg-blue-700'
                        : isEnterprise
                        ? 'bg-purple-600 hover:bg-purple-700'
                        : 'bg-gray-900 hover:bg-gray-800'
                    }`}
                  >
                    {loading === plan.id ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    ) : null}
                    {plan.price === 0 ? 'Get Started Free' : 'Subscribe Now'}
                  </Button>

                  {plan.price === 0 && (
                    <p className="text-xs text-gray-500 text-center">
                      No credit card required
                    </p>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ Section */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-center text-gray-900 mb-8">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Can I change my plan anytime?
              </h3>
              <p className="text-gray-600">
                Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and take effect immediately.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, MasterCard, American Express) through our secure Stripe payment processor.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <h3 className="font-semibold text-gray-900 mb-2">
                Is there a free trial?
              </h3>
              <p className="text-gray-600">
                Yes! Our free plan includes basic features with no time limit. You can upgrade to a paid plan whenever you're ready.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

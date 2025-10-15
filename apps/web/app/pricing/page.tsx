'use client'

import React, { useEffect, useMemo, useState } from 'react'
import Link from 'next/link'
import { Badge, Button, Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Building2, Check, Star, User, Zap } from 'lucide-react'
import { toast } from 'sonner'

import {
  subscriptionPlans,
  PlanDefinition,
  PlanInterval,
  getPlanById,
} from '@/lib/stripe/config'
import { stripeClient } from '@/lib/stripe/client'
import {
  NonprofitToggle,
  NonprofitTier,
  nonprofitMultipliers,
} from './components/nonprofit-toggle'

const faqItems = [
  {
    question: 'Can I change my plan at any time?',
    answer:
      'Yes. Upgrades take effect immediately and downgrades apply on the next billing cycle. Nonprofit discounts stay locked while eligibility is valid.',
  },
  {
    question: 'What payment methods do you accept?',
    answer:
      'We process payments via Stripe and accept all major credit cards. Enterprise customers can request invoicing during contract review.',
  },
  {
    question: 'Do nonprofits need proof before launch?',
    answer:
      'Yes. You will submit EIN + org details during onboarding. Discounts apply once eligibility is verified—usually under three seconds.',
  },
]

const formatCurrency = (value: number, interval?: PlanInterval) => {
  const formatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: value % 1 === 0 ? 0 : 2,
  }).format(value)

  if (!interval) return formatted
  return `${formatted}/${interval === 'year' ? 'yr' : 'mo'}`
}

export default function PricingPage() {
  const [selectedUserType, setSelectedUserType] = useState<'candidate' | 'employer'>('candidate')
  const [loading, setLoading] = useState<string | null>(null)
  const [nonprofitTier, setNonprofitTier] = useState<NonprofitTier | null>(null)

  const isAuthenticated = true // Demo mode
  const user = { id: 'demo-user', email: 'demo@example.com' }

  const isEmployerView = selectedUserType === 'employer'
  const plans = subscriptionPlans[selectedUserType] as Record<string, PlanDefinition>

  useEffect(() => {
    if (!isEmployerView && nonprofitTier) {
      setNonprofitTier(null)
    }
  }, [isEmployerView, nonprofitTier])

  const nonprofitMultiplier = useMemo(() => {
    if (!nonprofitTier) return 1
    return nonprofitMultipliers[nonprofitTier]
  }, [nonprofitTier])

  const handleSubscribe = async (planId: string) => {
    if (!isAuthenticated || !user) {
      toast.error('Please sign in to subscribe')
      return
    }

    const plan = getPlanById(planId)
    if (!plan || plan.billing !== 'subscription') {
      toast.error('This plan needs a sales-assisted workflow. Please contact us.')
      return
    }

    setLoading(planId)
    try {
      const { sessionId } = await stripeClient.createCheckoutSession(planId, user.id, user.email || '')
      window.location.href = `/api/stripe/checkout?session_id=${sessionId}`
    } catch (error) {
      console.error('Subscription error:', error)
      toast.error('Failed to start subscription process')
    } finally {
      setLoading(null)
    }
  }

  const handleContactSales = (planName: string) => {
    const subject = encodeURIComponent(`${planName} plan inquiry`)
    window.location.href = `mailto:sales@proofoffit.com?subject=${subject}`
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12 space-y-6">
          <div className="flex justify-center gap-2 mb-6">
            <div className="inline-flex rounded-md bg-white p-1 shadow-sm">
              <button
                onClick={() => setSelectedUserType('candidate')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedUserType === 'candidate'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <User className="mr-2 inline h-4 w-4" />
                Job seekers
              </button>
              <button
                onClick={() => setSelectedUserType('employer')}
                className={`px-6 py-3 rounded-md font-medium transition-colors ${
                  selectedUserType === 'employer'
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <Building2 className="mr-2 inline h-4 w-4" />
                Employers
              </button>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900">Choose your ProofOfFit plan</h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Pricing scales with the evidence you deliver. Nonprofits can lock tailored discounts once
            eligibility is verified—compliance add-ons always stay cost-based.
          </p>
        </div>

        {isEmployerView && (
          <div className="mx-auto mb-12 max-w-4xl">
            <div className="rounded-xl border border-dashed border-blue-300 bg-white/80 p-6 shadow-sm backdrop-blur">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="space-y-3">
                  <h2 className="text-xl font-semibold text-gray-900">
                    Mission-aligned pricing for nonprofits
                  </h2>
                  <p className="text-sm text-gray-600">
                    Submit EIN + org details to auto-lock your tier. Discounts apply to base fees and
                    usage; Fund credits can pull spend even lower for high-impact programs.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Link
                      href="/nonprofit#eligibility"
                      className="inline-flex items-center justify-center rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white shadow hover:bg-blue-700"
                    >
                      Check eligibility
                    </Link>
                    <Link
                      href="/nonprofit"
                      className="inline-flex items-center justify-center rounded-md border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-600 hover:bg-blue-50"
                    >
                      Explore nonprofit program
                    </Link>
                  </div>
                </div>
                <div className="w-full lg:max-w-sm">
                  <NonprofitToggle selectedTier={nonprofitTier} onSelect={setNonprofitTier} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Pricing Cards */}
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {Object.entries(plans).map(([key, plan]) => {
            const isPopular = key === 'pro' || key === 'professional'
            const isEnterprise = key === 'enterprise'
            const isQuote = plan.billing === 'quote'
            const basePrice =
              typeof plan.price === 'number' && plan.price > 0 ? plan.price : plan.price === 0 ? 0 : null
            const nonprofitEligible =
              isEmployerView && nonprofitTier && plan.nonprofitEligible !== false && basePrice !== null

            const computedPrice =
              nonprofitEligible && basePrice !== null
                ? Math.round(basePrice * nonprofitMultiplier * 100) / 100
                : basePrice
            const annualized =
              basePrice !== null && plan.interval === 'year'
                ? Math.round((basePrice / 12) * 100) / 100
                : null
            const nonprofitAnnualized =
              nonprofitEligible && computedPrice !== null && plan.interval === 'year'
                ? Math.round((computedPrice / 12) * 100) / 100
                : null
            const nonprofitLabel =
              nonprofitEligible && computedPrice !== null
                ? formatCurrency(computedPrice, plan.interval)
                : null

            return (
              <Card
                key={plan.id}
                className={`relative h-full ${
                  isPopular ? 'border-blue-500 shadow-lg shadow-blue-100' : 'border-gray-200'
                } ${isEnterprise ? 'border-purple-500' : ''}`}
              >
                {isPopular && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-blue-600 text-white">
                    <Star className="mr-1 h-3 w-3" />
                    Most popular
                  </Badge>
                )}
                {isEnterprise && (
                  <Badge className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-600 text-white">
                    <Zap className="mr-1 h-3 w-3" />
                    Enterprise
                  </Badge>
                )}

                <CardHeader className="text-center">
                  <CardTitle className="text-2xl font-bold text-gray-900">{plan.name}</CardTitle>

                  <div className="mt-4 space-y-1">
                    {basePrice !== null ? (
                      <>
                        <p className="text-sm font-semibold uppercase tracking-wide text-gray-500">
                          {plan.priceLead ?? 'Base price'}
                        </p>
                        <p className="text-4xl font-bold text-gray-900">
                          {formatCurrency(basePrice, plan.interval)}
                        </p>
                        {annualized !== null && (
                          <p className="text-xs text-gray-500">
                            ≈ {formatCurrency(annualized, 'month')} billed annually
                          </p>
                        )}
                        {nonprofitLabel && nonprofitTier && (
                          <p className="text-xs font-semibold text-blue-600">
                            Nonprofit {nonprofitTier} price: {nonprofitLabel}
                            {nonprofitAnnualized !== null && (
                              <> (≈ {formatCurrency(nonprofitAnnualized, 'month')} billed annually)</>
                            )}
                          </p>
                        )}
                      </>
                    ) : (
                      <p className="text-xl font-semibold text-gray-900">Custom pricing</p>
                    )}
                    {plan.price === 0 && (
                      <p className="text-sm text-gray-500">Free forever</p>
                    )}
                    {plan.priceNote && (
                      <p className="text-xs text-gray-500">{plan.priceNote}</p>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <Check className="mt-0.5 h-5 w-5 flex-shrink-0 text-green-500" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {plan.limits && (
                    <div className="rounded-lg bg-gray-50 p-4">
                      <h4 className="mb-2 font-medium text-gray-900">Plan limits</h4>
                      <div className="space-y-1 text-sm text-gray-600">
                        {Object.entries(plan.limits).map(([limitKey, value]) => (
                          <div key={limitKey} className="flex justify-between">
                            <span className="capitalize">
                              {limitKey.replace(/([A-Z])/g, ' $1').trim()}:
                            </span>
                            <span className="font-medium">
                              {value === -1 ? 'Unlimited' : String(value)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {plan.nonprofitSummary && (
                    <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-900">
                      {plan.nonprofitSummary}
                    </div>
                  )}

                  <div className="space-y-2 pt-2">
                    <Button
                      onClick={() =>
                        isQuote ? handleContactSales(plan.name) : handleSubscribe(plan.id)
                      }
                      disabled={!isQuote && loading === plan.id}
                      className="w-full"
                    >
                      {isQuote
                        ? plan.cta ?? 'Talk to sales'
                        : loading === plan.id
                          ? 'Processing...'
                          : plan.price === 0
                            ? 'Get started free'
                            : 'Choose plan'}
                    </Button>
                    <p className="text-center text-xs text-gray-500">
                      {isQuote
                        ? 'We’ll schedule a sizing call with RevOps to finalize volume-tiered pricing.'
                        : 'Billing handled securely via Stripe. Cancel anytime from your dashboard.'}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>

        {/* FAQ */}
        <div className="mx-auto mt-16 max-w-3xl space-y-6">
          <h2 className="text-center text-2xl font-bold text-gray-900">Frequently asked questions</h2>
          {faqItems.map((item) => (
            <div key={item.question} className="rounded-lg bg-white p-6 shadow-sm">
              <h3 className="mb-2 font-semibold text-gray-900">{item.question}</h3>
              <p className="text-gray-600">{item.answer}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

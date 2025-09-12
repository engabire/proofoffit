'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { stripeService, SubscriptionPlan } from '@/lib/stripe'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { CreditCard, Users, FileText } from 'lucide-react'

interface SubscriptionCardProps {
  tenantId: string
}

export function SubscriptionCard({ tenantId }: SubscriptionCardProps) {
  const [plan, setPlan] = useState<SubscriptionPlan | null>(null)
  const [usage, setUsage] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const supabase = createClientComponentClient()

  useEffect(() => {
    async function loadSubscriptionData() {
      try {
        // Get tenant plan
        const { data: tenant } = await supabase
          .from('tenants')
          .select('plan')
          .eq('id', tenantId)
          .single()

        if (tenant) {
          const currentPlan = stripeService.PLANS[tenant.plan]
          setPlan(currentPlan)

          // Get usage stats
          const usageStats = await stripeService.getUsageStats(tenantId)
          setUsage(usageStats)
        }
      } catch (error) {
        console.error('Failed to load subscription data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadSubscriptionData()
  }, [tenantId, supabase])

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-muted rounded w-1/4"></div>
            <div className="h-8 bg-muted rounded w-1/2"></div>
            <div className="space-y-2">
              <div className="h-3 bg-muted rounded"></div>
              <div className="h-3 bg-muted rounded w-3/4"></div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-muted-foreground">Unable to load subscription information</p>
        </CardContent>
      </Card>
    )
  }

  const getUsagePercentage = (current: number, limit: number) => {
    if (limit === -1) return 0 // Unlimited
    if (limit === 0) return 100
    return Math.min((current / limit) * 100, 100)
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="h-5 w-5" />
              {plan.name} Plan
            </CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </div>
          <Badge variant={plan.id === 'free' ? 'secondary' : 'default'}>
            {plan.price === 0 ? 'Free' : `$${plan.price}/${plan.interval}`}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Usage Statistics */}
        {usage && (
          <div className="space-y-4">
            <h4 className="font-medium">Usage This Month</h4>
            
            {/* Applications */}
            {plan.limits.applications !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    <span>Applications</span>
                  </div>
                  <span>
                    {usage.applications.current} / {plan.limits.applications === -1 ? '∞' : plan.limits.applications}
                  </span>
                </div>
                {plan.limits.applications !== -1 && (
                  <Progress 
                    value={getUsagePercentage(usage.applications.current, plan.limits.applications)}
                    className="h-2"
                  />
                )}
              </div>
            )}

            {/* Slates */}
            {plan.limits.slates !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Candidate Slates</span>
                  </div>
                  <span>
                    {usage.slates.current} / {plan.limits.slates === -1 ? '∞' : plan.limits.slates}
                  </span>
                </div>
                {plan.limits.slates !== -1 && (
                  <Progress 
                    value={getUsagePercentage(usage.slates.current, plan.limits.slates)}
                    className="h-2"
                  />
                )}
              </div>
            )}

            {/* Team Members */}
            {plan.limits.teamMembers !== undefined && (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>Team Members</span>
                  </div>
                  <span>
                    {usage.teamMembers.current} / {plan.limits.teamMembers === -1 ? '∞' : plan.limits.teamMembers}
                  </span>
                </div>
                {plan.limits.teamMembers !== -1 && (
                  <Progress 
                    value={getUsagePercentage(usage.teamMembers.current, plan.limits.teamMembers)}
                    className="h-2"
                  />
                )}
              </div>
            )}
          </div>
        )}

        {/* Features */}
        <div className="space-y-2">
          <h4 className="font-medium">Plan Features</h4>
          <ul className="space-y-1 text-sm text-muted-foreground">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <div className="w-1.5 h-1.5 bg-primary rounded-full"></div>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          {plan.id === 'free' ? (
            <Button className="flex-1">
              Upgrade Plan
            </Button>
          ) : (
            <>
              <Button variant="outline" className="flex-1">
                Manage Billing
              </Button>
              <Button variant="outline" className="flex-1">
                Change Plan
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
import Stripe from 'stripe'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '../env'

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!, {
  apiVersion: '2023-10-16',
})

export interface SubscriptionPlan {
  id: string
  name: string
  description: string
  price: number
  interval: 'month' | 'year'
  features: string[]
  limits: {
    applications?: number
    slates?: number
    teamMembers?: number
  }
}

export interface Customer {
  id: string
  email: string
  name?: string
  subscription?: {
    id: string
    status: string
    plan: string
    currentPeriodStart: Date
    currentPeriodEnd: Date
  }
}

export class StripeService {
  private _supabase: any = null

  public readonly PLANS = StripeService.PLANS

  private get supabase() {
    if (!this._supabase) {
      if (isSupabaseConfigured()) {
        this._supabase = createClientComponentClient()
      } else {
        throw new Error('Supabase not configured')
      }
    }
    return this._supabase
  }

  // Available plans
  static readonly PLANS: Record<string, SubscriptionPlan> = {
    free: {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month',
      features: [
        'Up to 10 applications per month',
        'Basic job matching',
        'Simple resume tailoring',
        'Email support'
      ],
      limits: {
        applications: 10
      }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      description: 'For serious job seekers',
      price: 29,
      interval: 'month',
      features: [
        'Unlimited applications',
        'Advanced AI matching',
        'Premium resume tailoring',
        'Priority support',
        'Advanced analytics',
        'Interview scheduling'
      ],
      limits: {
        applications: -1 // unlimited
      }
    },
    pro_plus: {
      id: 'pro_plus',
      name: 'Pro+',
      description: 'For professionals who need comprehensive tools',
      price: 49,
      interval: 'month',
      features: [
        'Everything in Pro',
        'Custom criteria mapping',
        'Advanced bias monitoring',
        'API access',
        'White-label options',
        'Dedicated account manager'
      ],
      limits: {
        applications: -1
      }
    },
    team: {
      id: 'team',
      name: 'Team',
      description: 'For growing companies',
      price: 99,
      interval: 'month',
      features: [
        'Up to 5 team members',
        'Candidate slate generation',
        'Audit trails and compliance',
        'Custom intake forms',
        'Integration with ATS',
        'Priority support'
      ],
      limits: {
        teamMembers: 5,
        slates: -1
      }
    },
    per_slate: {
      id: 'per_slate',
      name: 'Per-Slate',
      description: 'Pay only for what you use',
      price: 15,
      interval: 'month',
      features: [
        'On-demand slate generation',
        'Detailed candidate explanations',
        'Audit URLs for compliance',
        'Email notifications',
        'Basic analytics'
      ],
      limits: {
        slates: 1 // per purchase
      }
    }
  }

  /**
   * Create a Stripe checkout session
   */
  async createCheckoutSession(
    planId: string,
    customerEmail: string,
    successUrl: string,
    cancelUrl: string
  ): Promise<{ url: string }> {
    try {
      const plan = StripeService.PLANS[planId]
      if (!plan) {
        throw new Error('Invalid plan ID')
      }

      const session = await stripe().checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: plan.name,
                description: plan.description,
              },
              unit_amount: plan.price * 100, // Convert to cents
              recurring: plan.interval === 'month' ? {
                interval: 'month'
              } : plan.interval === 'year' ? {
                interval: 'year'
              } : undefined,
            },
            quantity: 1,
          },
        ],
        mode: plan.price === 0 ? 'payment' : 'subscription',
        customer_email: customerEmail,
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          planId,
          customerEmail,
        },
      })

      return { url: session.url! }
    } catch (error) {
      console.error('Stripe checkout error:', error)
      throw error
    }
  }

  /**
   * Create a customer portal session
   */
  async createPortalSession(customerId: string, returnUrl: string): Promise<{ url: string }> {
    try {
      const session = await stripe().billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      })

      return { url: session.url }
    } catch (error) {
      console.error('Stripe portal error:', error)
      throw error
    }
  }

  /**
   * Get customer information
   */
  async getCustomer(customerId: string): Promise<Customer | null> {
    try {
      const customer = await stripe().customers.retrieve(customerId)
      
      if (customer.deleted) {
        return null
      }

      // Get active subscription
      const subscriptions = await stripe().subscriptions.list({
        customer: customerId,
        status: 'active',
        limit: 1,
      })

      const subscription = subscriptions.data[0]

      return {
        id: customer.id,
        email: customer.email || '',
        name: customer.name || undefined,
        subscription: subscription ? {
          id: subscription.id,
          status: subscription.status,
          plan: subscription.items.data[0]?.price.id || '',
          currentPeriodStart: new Date(subscription.current_period_start * 1000),
          currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        } : undefined,
      }
    } catch (error) {
      console.error('Stripe customer error:', error)
      return null
    }
  }

  /**
   * Update tenant plan based on Stripe webhook
   */
  async updateTenantPlan(
    tenantId: string,
    planId: string,
    subscriptionId?: string
  ): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('tenants')
        .update({
          plan: planId,
          subscriptionId: subscriptionId || null,
          updatedAt: new Date().toISOString(),
        })
        .eq('id', tenantId)

      if (error) throw error

      // Log the plan change
      await this.logPlanChange(tenantId, planId, subscriptionId)

      return true
    } catch (error) {
      console.error('Failed to update tenant plan:', error)
      return false
    }
  }

  /**
   * Check if user has access to a feature
   */
  async checkFeatureAccess(
    tenantId: string,
    feature: 'applications' | 'slates' | 'team_members'
  ): Promise<{ allowed: boolean; limit?: number; current?: number }> {
    try {
      // Get tenant plan
      const { data: tenant, error } = await this.supabase
        .from('tenants')
        .select('plan')
        .eq('id', tenantId)
        .single()

      if (error || !tenant) {
        return { allowed: false }
      }

      const plan = StripeService.PLANS[tenant.plan]
      if (!plan) {
        return { allowed: false }
      }

      const limit = plan.limits[feature as keyof typeof plan.limits]
      if (limit === undefined) {
        return { allowed: true } // No limit defined
      }

      if (limit === -1) {
        return { allowed: true } // Unlimited
      }

      // Get current usage
      let current = 0
      switch (feature) {
        case 'applications':
          const { count: appCount } = await this.supabase
            .from('applications')
            .select('*', { count: 'exact', head: true })
            .eq('tenantId', tenantId)
            .gte('createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
          current = appCount || 0
          break
        case 'slates':
          const { count: slateCount } = await this.supabase
            .from('slates')
            .select('*', { count: 'exact', head: true })
            .eq('tenantId', tenantId)
            .gte('createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()) // Last 30 days
          current = slateCount || 0
          break
        case 'team_members':
          const { count: memberCount } = await this.supabase
            .from('users')
            .select('*', { count: 'exact', head: true })
            .eq('tenantId', tenantId)
          current = memberCount || 0
          break
      }

      return {
        allowed: current < limit,
        limit,
        current,
      }
    } catch (error) {
      console.error('Feature access check failed:', error)
      return { allowed: false }
    }
  }

  /**
   * Get usage statistics for a tenant
   */
  async getUsageStats(tenantId: string): Promise<{
    applications: { current: number; limit: number }
    slates: { current: number; limit: number }
    teamMembers: { current: number; limit: number }
  }> {
    try {
      // Get tenant plan
      const { data: tenant } = await this.supabase
        .from('tenants')
        .select('plan')
        .eq('id', tenantId)
        .single()

      const plan = tenant ? StripeService.PLANS[tenant.plan] : StripeService.PLANS.free

      // Get current usage
      const [appResult, slateResult, memberResult] = await Promise.all([
        this.supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('tenantId', tenantId)
          .gte('createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        this.supabase
          .from('slates')
          .select('*', { count: 'exact', head: true })
          .eq('tenantId', tenantId)
          .gte('createdAt', new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()),
        this.supabase
          .from('users')
          .select('*', { count: 'exact', head: true })
          .eq('tenantId', tenantId)
      ])

      return {
        applications: {
          current: appResult.count || 0,
          limit: plan.limits.applications || 0
        },
        slates: {
          current: slateResult.count || 0,
          limit: plan.limits.slates || 0
        },
        teamMembers: {
          current: memberResult.count || 0,
          limit: plan.limits.teamMembers || 0
        }
      }
    } catch (error) {
      console.error('Usage stats failed:', error)
      return {
        applications: { current: 0, limit: 0 },
        slates: { current: 0, limit: 0 },
        teamMembers: { current: 0, limit: 0 }
      }
    }
  }

  /**
   * Log plan change to action log
   */
  private async logPlanChange(
    tenantId: string,
    planId: string,
    subscriptionId?: string
  ): Promise<void> {
    try {
      const payload = {
        planId,
        subscriptionId,
        timestamp: new Date().toISOString()
      }

      const { error } = await this.supabase
        .from('action_log')
        .insert({
          tenantId,
          actorType: 'system',
          actorId: 'stripe_webhook',
          action: 'plan_change',
          objType: 'tenant',
          objId: tenantId,
          payloadHash: await this.hashPayload(payload)
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to log plan change:', error)
    }
  }

  /**
   * Hash payload for action log
   */
  private async hashPayload(payload: any): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(payload))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

// Export singleton instance
export const stripeService = new StripeService()

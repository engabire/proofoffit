import { stripeService } from '@/lib/stripe'

// Mock Stripe
const mockStripe = {
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
  billingPortal: {
    sessions: {
      create: jest.fn(),
    },
  },
  customers: {
    retrieve: jest.fn(),
  },
  subscriptions: {
    list: jest.fn(),
  },
}

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe)
})

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}))

describe('Stripe Service', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('PLANS', () => {
    it('has all required plans defined', () => {
      expect(stripeService.PLANS).toHaveProperty('free')
      expect(stripeService.PLANS).toHaveProperty('pro')
      expect(stripeService.PLANS).toHaveProperty('pro_plus')
      expect(stripeService.PLANS).toHaveProperty('team')
      expect(stripeService.PLANS).toHaveProperty('per_slate')
    })

    it('has correct plan structure', () => {
      const plan = stripeService.PLANS.pro
      expect(plan).toHaveProperty('id')
      expect(plan).toHaveProperty('name')
      expect(plan).toHaveProperty('description')
      expect(plan).toHaveProperty('price')
      expect(plan).toHaveProperty('interval')
      expect(plan).toHaveProperty('features')
      expect(plan).toHaveProperty('limits')
    })

    it('has appropriate limits for each plan', () => {
      expect(stripeService.PLANS.free.limits.applications).toBe(10)
      expect(stripeService.PLANS.pro.limits.applications).toBe(-1) // unlimited
      expect(stripeService.PLANS.team.limits.teamMembers).toBe(5)
    })
  })

  describe('createCheckoutSession', () => {
    it('creates checkout session for valid plan', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        url: 'https://checkout.stripe.com/test-session',
      })

      const result = await stripeService.createCheckoutSession(
        'pro',
        'test@example.com',
        'https://example.com/success',
        'https://example.com/cancel'
      )

      expect(result.url).toBe('https://checkout.stripe.com/test-session')
      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith({
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency: 'usd',
              product_data: {
                name: 'Pro',
                description: 'For serious job seekers',
              },
              unit_amount: 2900, // $29 * 100
              recurring: {
                interval: 'month',
              },
            },
            quantity: 1,
          },
        ],
        mode: 'subscription',
        customer_email: 'test@example.com',
        success_url: 'https://example.com/success',
        cancel_url: 'https://example.com/cancel',
        metadata: {
          planId: 'pro',
          customerEmail: 'test@example.com',
        },
      })
    })

    it('creates payment session for free plan', async () => {
      mockStripe.checkout.sessions.create.mockResolvedValue({
        url: 'https://checkout.stripe.com/free-session',
      })

      const result = await stripeService.createCheckoutSession(
        'free',
        'test@example.com',
        'https://example.com/success',
        'https://example.com/cancel'
      )

      expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(
        expect.objectContaining({
          mode: 'payment',
          line_items: [
            expect.objectContaining({
              price_data: expect.objectContaining({
                unit_amount: 0,
                recurring: undefined,
              }),
            }),
          ],
        })
      )
    })

    it('throws error for invalid plan', async () => {
      await expect(
        stripeService.createCheckoutSession(
          'invalid-plan',
          'test@example.com',
          'https://example.com/success',
          'https://example.com/cancel'
        )
      ).rejects.toThrow('Invalid plan ID')
    })
  })

  describe('createPortalSession', () => {
    it('creates portal session successfully', async () => {
      mockStripe.billingPortal.sessions.create.mockResolvedValue({
        url: 'https://billing.stripe.com/portal-session',
      })

      const result = await stripeService.createPortalSession(
        'cus_test123',
        'https://example.com/return'
      )

      expect(result.url).toBe('https://billing.stripe.com/portal-session')
      expect(mockStripe.billingPortal.sessions.create).toHaveBeenCalledWith({
        customer: 'cus_test123',
        return_url: 'https://example.com/return',
      })
    })
  })

  describe('getCustomer', () => {
    it('retrieves customer with active subscription', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        email: 'test@example.com',
        name: 'Test User',
        deleted: false,
      }

      const mockSubscription = {
        id: 'sub_test123',
        status: 'active',
        items: {
          data: [
            {
              price: {
                id: 'price_pro_monthly',
              },
            },
          ],
        },
        current_period_start: 1640995200, // 2022-01-01
        current_period_end: 1643673600,   // 2022-02-01
      }

      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer)
      mockStripe.subscriptions.list.mockResolvedValue({
        data: [mockSubscription],
      })

      const result = await stripeService.getCustomer('cus_test123')

      expect(result).toEqual({
        id: 'cus_test123',
        email: 'test@example.com',
        name: 'Test User',
        subscription: {
          id: 'sub_test123',
          status: 'active',
          plan: 'price_pro_monthly',
          currentPeriodStart: new Date(1640995200 * 1000),
          currentPeriodEnd: new Date(1643673600 * 1000),
        },
      })
    })

    it('handles customer without subscription', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        email: 'test@example.com',
        deleted: false,
      }

      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer)
      mockStripe.subscriptions.list.mockResolvedValue({
        data: [],
      })

      const result = await stripeService.getCustomer('cus_test123')

      expect(result).toEqual({
        id: 'cus_test123',
        email: 'test@example.com',
        subscription: undefined,
      })
    })

    it('handles deleted customer', async () => {
      const mockCustomer = {
        id: 'cus_test123',
        deleted: true,
      }

      mockStripe.customers.retrieve.mockResolvedValue(mockCustomer)

      const result = await stripeService.getCustomer('cus_test123')

      expect(result).toBeNull()
    })
  })

  describe('checkFeatureAccess', () => {
    it('allows access for unlimited features', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { plan: 'pro' },
        error: null,
      })

      const result = await stripeService.checkFeatureAccess('tenant-1', 'applications')

      expect(result.allowed).toBe(true)
    })

    it('denies access when limit exceeded', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { plan: 'free' },
        error: null,
      })

      // Mock usage count
      mockSupabase.from().select().eq().gte.mockResolvedValue({
        count: 15, // Over the free limit of 10
      })

      const result = await stripeService.checkFeatureAccess('tenant-1', 'applications')

      expect(result.allowed).toBe(false)
      expect(result.limit).toBe(10)
      expect(result.current).toBe(15)
    })

    it('allows access when under limit', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { plan: 'free' },
        error: null,
      })

      // Mock usage count
      mockSupabase.from().select().eq().gte.mockResolvedValue({
        count: 5, // Under the free limit of 10
      })

      const result = await stripeService.checkFeatureAccess('tenant-1', 'applications')

      expect(result.allowed).toBe(true)
      expect(result.limit).toBe(10)
      expect(result.current).toBe(5)
    })
  })

  describe('getUsageStats', () => {
    it('returns usage statistics for all features', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: { plan: 'pro' },
        error: null,
      })

      // Mock usage counts
      mockSupabase.from().select().eq().gte
        .mockResolvedValueOnce({ count: 25 }) // applications
        .mockResolvedValueOnce({ count: 5 })  // slates
        .mockResolvedValueOnce({ count: 2 })  // team members

      const result = await stripeService.getUsageStats('tenant-1')

      expect(result).toEqual({
        applications: { current: 25, limit: -1 },
        slates: { current: 5, limit: -1 },
        teamMembers: { current: 2, limit: -1 },
      })
    })

    it('handles database errors gracefully', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await stripeService.getUsageStats('tenant-1')

      expect(result).toEqual({
        applications: { current: 0, limit: 0 },
        slates: { current: 0, limit: 0 },
        teamMembers: { current: 0, limit: 0 },
      })
    })
  })
})
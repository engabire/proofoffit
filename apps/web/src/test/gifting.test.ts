export {}

const mockStripe = {
  coupons: {
    create: jest.fn(),
    update: jest.fn(),
  },
  promotionCodes: {
    create: jest.fn(),
    update: jest.fn(),
  },
  subscriptions: {
    list: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
  },
  checkout: {
    sessions: {
      create: jest.fn(),
    },
  },
  customers: {
    list: jest.fn(),
    create: jest.fn(),
  },
}

jest.mock('stripe', () => {
  return jest.fn().mockImplementation(() => mockStripe)
})

describe('GiftingStripeService', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    process.env.STRIPE_SECRET_KEY = 'sk_test'
    process.env.STRIPE_PUBLISHABLE_KEY = 'pk_test'
  })

  it('creates gift promotion pair', async () => {
    mockStripe.coupons.create.mockResolvedValue({ id: 'coupon_123' })
    mockStripe.promotionCodes.create.mockResolvedValue({ id: 'promo_123' })

    jest.resetModules()
    const { giftingStripe } = await import('@/lib/gifting/stripe')
    const result = await giftingStripe.createGiftPromotion({ code: 'PF-1234-ABCD', months: 3 })

    expect(mockStripe.coupons.create).toHaveBeenCalledWith(expect.objectContaining({
      duration: 'repeating',
      duration_in_months: 3,
      percent_off: 100,
    }))
    expect(mockStripe.promotionCodes.create).toHaveBeenCalledWith(expect.objectContaining({
      coupon: 'coupon_123',
      code: 'PF-1234-ABCD',
      max_redemptions: 1,
    }))
    expect(result).toEqual({ couponId: 'coupon_123', promotionCodeId: 'promo_123' })
  })

  it('creates checkout session for gift purchase', async () => {
    mockStripe.checkout.sessions.create.mockResolvedValue({ id: 'cs_test', url: 'https://stripe.test/checkout' })

    jest.resetModules()
    const { giftingStripe } = await import('@/lib/gifting/stripe')
    const session = await giftingStripe.createGiftCheckoutSession({
      amountCents: 2400,
      currency: 'usd',
      sponsorEmail: 'sponsor@example.com',
      successUrl: 'https://app.test/success',
      cancelUrl: 'https://app.test/cancel',
      metadata: { gift_code: 'PF-1234-ABCD' },
    })

    expect(mockStripe.checkout.sessions.create).toHaveBeenCalledWith(expect.objectContaining({
      mode: 'payment',
      customer_email: 'sponsor@example.com',
      success_url: 'https://app.test/success',
    }))
    expect(session).toEqual({ id: 'cs_test', url: 'https://stripe.test/checkout' })
  })

  it('disables promotion and coupon on cancel', async () => {
    mockStripe.promotionCodes.update.mockResolvedValue({})
    mockStripe.coupons.update.mockResolvedValue({})

    jest.resetModules()
    const { giftingStripe } = await import('@/lib/gifting/stripe')
    await giftingStripe.cancelGiftPromotion({ promotionCodeId: 'promo_123', couponId: 'coupon_123' })

    expect(mockStripe.promotionCodes.update).toHaveBeenCalledWith('promo_123', { active: false })
    expect(mockStripe.coupons.update).toHaveBeenCalledWith('coupon_123', expect.any(Object))
  })
})

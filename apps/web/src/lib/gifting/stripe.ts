import Stripe from 'stripe'
import { env } from '@/lib/env'

const secretKey = env.stripe.secretKey || process.env.STRIPE_SECRET_KEY
const stripe = secretKey ? new Stripe(secretKey, { apiVersion: '2023-10-16' }) : null

interface GiftPromotionPayload {
  code: string
  months: number
  metadata?: Record<string, string>
}

interface AttachGiftPromotionPayload {
  customerId: string
  promotionCodeId: string
  priceId: string
}

interface CancelGiftPromotionPayload {
  promotionCodeId?: string | null
  couponId?: string | null
}

interface GiftCheckoutPayload {
  amountCents: number
  currency: string
  sponsorEmail: string
  successUrl: string
  cancelUrl: string
  metadata: Record<string, string>
}

export class GiftingStripeService {
  async createGiftPromotion({ code, months, metadata }: GiftPromotionPayload) {
    if (!stripe) {
      throw new Error('Stripe secret key is not configured')
    }
    const coupon = await stripe.coupons.create({
      duration: 'repeating',
      duration_in_months: months,
      percent_off: 100,
      name: `Gift for ${code}`,
      metadata: {
        gift_code: code,
        ...(metadata || {}),
      },
    })

    const promotion = await stripe.promotionCodes.create({
      coupon: coupon.id,
      code,
      max_redemptions: 1,
      active: true,
      metadata: {
        gift_code: code,
        ...(metadata || {}),
      },
    })

    return {
      couponId: coupon.id,
      promotionCodeId: promotion.id,
    }
  }

  async attachGiftPromotion({ customerId, promotionCodeId, priceId }: AttachGiftPromotionPayload) {
    if (!stripe) {
      throw new Error('Stripe secret key is not configured')
    }
    const subscriptions = await stripe.subscriptions.list({
      customer: customerId,
      status: 'active',
      expand: ['data.items'],
      limit: 1,
    })

    if (subscriptions.data.length === 0) {
      return stripe.subscriptions.create({
        customer: customerId,
        items: [{ price: priceId }],
        promotion_code: promotionCodeId,
        collection_method: 'charge_automatically',
        payment_behavior: 'allow_incomplete',
      })
    }

    const currentSubscription = subscriptions.data[0]

    return stripe.subscriptions.update(currentSubscription.id, {
      promotion_code: promotionCodeId,
      proration_behavior: 'none',
    })
  }

  async cancelGiftPromotion({ promotionCodeId, couponId }: CancelGiftPromotionPayload) {
    if (!stripe) {
      throw new Error('Stripe secret key is not configured')
    }
    if (promotionCodeId) {
      await stripe.promotionCodes.update(promotionCodeId, { active: false })
    }

    if (couponId) {
      await stripe.coupons.update(couponId, {
        metadata: {
          cancelled_at: new Date().toISOString(),
        },
      })
    }
  }

  async createGiftCheckoutSession({
    amountCents,
    currency,
    sponsorEmail,
    successUrl,
    cancelUrl,
    metadata,
  }: GiftCheckoutPayload) {
    if (!stripe) {
      throw new Error('Stripe secret key is not configured')
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      customer_email: sponsorEmail,
      line_items: [
        {
          price_data: {
            currency,
            unit_amount: amountCents,
            product_data: {
              name: 'ProofOfFit Pro Gift',
              description: 'Sponsor months of ProofOfFit Pro access',
            },
          },
          quantity: 1,
        },
      ],
      success_url: successUrl,
      cancel_url: cancelUrl,
      metadata,
    })

    return {
      id: session.id,
      url: session.url,
    }
  }
}

export const giftingStripe = new GiftingStripeService()

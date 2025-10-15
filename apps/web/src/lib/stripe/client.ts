import { getStripeConfig, stripe } from "./config";

// Client-side Stripe instance (for frontend)
export const stripeClient = {
  get publishableKey() {
    return getStripeConfig().publishableKey;
  },

  // Create checkout session
  async createCheckoutSession(
    planId: string,
    userId: string,
    userEmail: string,
  ) {
    const response = await fetch("/api/stripe/create-checkout-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        planId,
        userId,
        userEmail,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create checkout session");
    }

    return response.json();
  },

  // Create customer portal session
  async createPortalSession(customerId: string) {
    const response = await fetch("/api/stripe/create-portal-session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        customerId,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create portal session");
    }

    return response.json();
  },

  // Get subscription status
  async getSubscriptionStatus(userId: string) {
    const response = await fetch(
      `/api/stripe/subscription-status?userId=${userId}`,
    );

    if (!response.ok) {
      throw new Error("Failed to get subscription status");
    }

    return response.json();
  },
};

// Server-side Stripe utilities
export const stripeServer = {
  // Create or retrieve customer
  async getOrCreateCustomer(email: string, userId: string) {
    const customers = await stripe().customers.list({
      email: email,
      limit: 1,
    });

    if (customers.data.length > 0) {
      return customers.data[0];
    }

    return await stripe().customers.create({
      email: email,
      metadata: {
        userId: userId,
      },
    });
  },

  // Create subscription
  async createSubscription(customerId: string, priceId: string) {
    return await stripe().subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: "default_incomplete",
      payment_settings: { save_default_payment_method: "on_subscription" },
      expand: ["latest_invoice.payment_intent"],
    });
  },

  // Cancel subscription
  async cancelSubscription(subscriptionId: string) {
    return await stripe().subscriptions.cancel(subscriptionId);
  },

  // Update subscription
  async updateSubscription(subscriptionId: string, newPriceId: string) {
    const subscription = await stripe().subscriptions.retrieve(subscriptionId);

    return await stripe().subscriptions.update(subscriptionId, {
      items: [{
        id: subscription.items.data[0].id,
        price: newPriceId,
      }],
      proration_behavior: "create_prorations",
    });
  },

  // Get subscription
  async getSubscription(subscriptionId: string) {
    return await stripe().subscriptions.retrieve(subscriptionId);
  },

  // List customer subscriptions
  async getCustomerSubscriptions(customerId: string) {
    return await stripe().subscriptions.list({
      customer: customerId,
      status: "all",
    });
  },
};

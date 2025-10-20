import Stripe from "stripe";

type BillingMode = "subscription" | "quote";
export type PlanInterval = "month" | "year";

export type PlanDefinition = {
  id: string;
  name: string;
  price: number | null;
  interval?: PlanInterval;
  features: string[];
  limits?: Record<string, number>;
  billing: BillingMode;
  cta?: string;
  priceLead?: string;
  priceNote?: string;
  nonprofitEligible?: boolean;
  nonprofitSummary?: string;
};

type PlansMap = {
  candidate: Record<string, PlanDefinition>;
  employer: Record<string, PlanDefinition>;
};

// Stripe configuration - SECURE VERSION
export function getStripeConfig() {
  // Use environment variables directly to avoid CredentialManager dependency
  return {
    apiKey: process.env.STRIPE_SECRET_KEY || "",
    publishableKey: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
    webhookSecret: process.env.STRIPE_WEBHOOK_SECRET || "",
    connectAccountId: "acct_1S83Ea5r3cXmAzLD", // Extracted from your connect URL
  };
}

// Initialize Stripe instance lazily
let stripeInstance: Stripe | null = null;
export function getStripe(): Stripe {
  if (!stripeInstance) {
    const config = getStripeConfig();
    stripeInstance = new Stripe(config.apiKey, {
      apiVersion: "2023-10-16",
      typescript: true,
    });
  }
  return stripeInstance;
}

// Export stripe getter function instead of instance
export { getStripe as stripe };

// Subscription plans
export const subscriptionPlans: PlansMap = {
  candidate: {
    free: {
      id: "candidate_free",
      name: "Free",
      price: 0,
      interval: "month",
      billing: "subscription",
      features: [
        "Basic job discovery",
        "5 applications per month",
        "Resume parsing + fit guidance",
        "Email support",
      ],
      limits: {
        applications: 5,
        searches: 50,
        resumeDownloads: 1,
      },
    },
    pro: {
      id: "candidate_pro",
      name: "Pro",
      price: 29.99,
      interval: "month",
      billing: "subscription",
      features: [
        "Unlimited applications & outreach",
        "AI resume & cover letter tailoring",
        "Interview prep library",
        "Priority matching notifications",
        "Advanced analytics & benchmarks",
      ],
      limits: {
        applications: -1,
        searches: -1,
        resumeDownloads: -1,
      },
    },
  },
  employer: {
    starter: {
      id: "employer_starter",
      name: "Starter",
      price: 149,
      interval: "month",
      billing: "subscription",
      nonprofitEligible: true,
      nonprofitSummary: "N1 nonprofits pay $74.50/mo (50% off).",
      features: [
        "2 recruiter seats + 3 active roles",
        "100 talent reach units & 25 verification credits monthly",
        "Core ProofLayers™ matching + interview scheduling",
        "Email support & in-app onboarding guides",
      ],
      limits: {
        jobPosts: 3,
        candidateViews: 200,
        teamMembers: 2,
      },
      priceNote: "Best for emerging teams validating hiring motion.",
    },
    growth: {
      id: "employer_growth",
      name: "Growth",
      price: 699,
      interval: "month",
      billing: "subscription",
      nonprofitEligible: true,
      nonprofitSummary: "N2 nonprofits pay $454.35/mo (35% off).",
      features: [
        "5 recruiter seats + 10 active roles",
        "600 reach units & 150 verification credits monthly",
        "ATS sync (Greenhouse/Lever/Workable) & role collaboration",
        "SSO-lite, audit trails, and SLA-backed support",
        "Eligibility + revalidation workflows surfaced in CRM",
      ],
      limits: {
        jobPosts: 10,
        candidateViews: -1,
        teamMembers: 10,
      },
      priceNote: "Designed for multi-team hiring with governance needs.",
    },
    enterprise: {
      id: "employer_enterprise",
      name: "Enterprise",
      price: 48000,
      interval: "year",
      billing: "quote",
      nonprofitEligible: true,
      nonprofitSummary: "N3 nonprofits start at $36k/yr (25% off).",
      features: [
        "Pooled seats & roles with regional workspaces",
        "Unlimited verification pipelines + advanced ProofLayers™ controls",
        "SCIM/SSO, data residency packs, private networking, SOC 2 portal",
        "Dedicated TAM, 99.9% SLO, bespoke integrations",
        "Granular spend controls + donor-backed credit orchestration",
      ],
      limits: {
        jobPosts: -1,
        candidateViews: -1,
        teamMembers: -1,
      },
      priceLead: "Starts at",
      priceNote:
        "Volume-tiered pricing modeled with RevOps; talk to sales for quotes.",
      cta: "Talk to sales",
    },
  },
};

// Helper function to get plan by ID
export function getPlanById(
  planId: string,
): (PlanDefinition & { userType: "candidate" | "employer" }) | null {
  for (
    const userType of Object.keys(subscriptionPlans) as Array<
      "candidate" | "employer"
    >
  ) {
    for (const plan of Object.values(subscriptionPlans[userType])) {
      if (plan.id === planId) {
        return { ...plan, userType };
      }
    }
  }
  return null;
}

// Helper function to get plans by user type
export function getPlansByUserType(
  userType: "candidate" | "employer",
): Record<string, PlanDefinition> {
  return subscriptionPlans[userType];
}

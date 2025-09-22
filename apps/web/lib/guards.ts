import { limitsByPlan, type Plan } from "@/lib/limits";

export class QuotaExceededError extends Error {
  constructor(
    public quota: string,
    public current: number,
    public limit: number,
    public plan: Plan
  ) {
    super(
      `Quota exceeded: ${quota} (${current}/${limit}) for plan ${plan}. Upgrade to increase limits.`
    );
    this.name = "QuotaExceededError";
  }
}

export async function assertWithinLimits(_userId: string): Promise<void> {
  // TODO: Implement quota checking when target, proof, and auditLink models are available
  // For now, allow all operations to proceed
  return Promise.resolve();
}

export async function getCurrentUsage(_userId: string) {
  // TODO: Implement usage tracking when database models are available
  const plan = "free" as Plan;
  const limits = limitsByPlan[plan];

  return {
    plan,
    limits,
    usage: {
      targets: 0,
      proofs: 0,
      activeLinks: 0,
    },
    isWithinLimits: {
      targets: true,
      proofs: true,
      activeLinks: true,
    },
  };
}



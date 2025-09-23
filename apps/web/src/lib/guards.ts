// Simplified guards - models don't exist in current schema

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

export async function assertWithinLimits(userId: string): Promise<void> {
  // Temporary - no limits checking until models are available
  console.log("Limits check skipped - models not available for user:", userId);
}

export async function checkTargetLimit(userId: string): Promise<void> {
  // Temporary placeholder
  console.log("Target limit check skipped - target model not available");
}

export async function checkProofLimit(userId: string): Promise<void> {
  // Temporary placeholder
  console.log("Proof limit check skipped - proof model not available");
}

export async function checkAuditLinkLimit(userId: string): Promise<void> {
  // Temporary placeholder
  console.log("Audit link limit check skipped - auditLink model not available");
}
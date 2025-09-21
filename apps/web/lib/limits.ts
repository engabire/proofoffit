export const limitsByPlan = {
  FREE: {
    maxTargets: 1,
    maxProofs: 20,
    maxActiveLinks: 1,
  },
  PRO: {
    maxTargets: 3,
    maxProofs: 100,
    maxActiveLinks: 50,
  },
  PREMIUM: {
    maxTargets: 20,
    maxProofs: 500,
    maxActiveLinks: 500,
  },
} as const;

export type Plan = keyof typeof limitsByPlan;

export interface PlanLimits {
  maxTargets: number;
  maxProofs: number;
  maxActiveLinks: number;
}

export function getPlanLimits(plan: Plan): PlanLimits {
  return limitsByPlan[plan];
}

export function isWithinLimits(
  current: { targets: number; proofs: number; activeLinks: number },
  plan: Plan
): boolean {
  const limits = getPlanLimits(plan);
  return (
    current.targets <= limits.maxTargets &&
    current.proofs <= limits.maxProofs &&
    current.activeLinks <= limits.maxActiveLinks
  );
}




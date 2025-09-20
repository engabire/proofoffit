import { prisma } from "@/lib/db";
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
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const plan = user.plan as Plan;
  const { maxTargets, maxProofs, maxActiveLinks } = limitsByPlan[plan];

  const [targets, proofs, links] = await Promise.all([
    prisma.target.count({
      where: { userId, isDeleted: false },
    }),
    prisma.proof.count({
      where: { userId },
    }),
    prisma.auditLink.count({
      where: {
        userId,
        isRevoked: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    }),
  ]);

  if (targets >= maxTargets) {
    throw new QuotaExceededError("targets", targets, maxTargets, plan);
  }

  if (proofs >= maxProofs) {
    throw new QuotaExceededError("proofs", proofs, maxProofs, plan);
  }

  if (links >= maxActiveLinks) {
    throw new QuotaExceededError("activeLinks", links, maxActiveLinks, plan);
  }
}

export async function getCurrentUsage(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { plan: true },
  });

  if (!user) {
    throw new Error("User not found");
  }

  const plan = user.plan as Plan;
  const limits = limitsByPlan[plan];

  const [targets, proofs, activeLinks] = await Promise.all([
    prisma.target.count({
      where: { userId, isDeleted: false },
    }),
    prisma.proof.count({
      where: { userId },
    }),
    prisma.auditLink.count({
      where: {
        userId,
        isRevoked: false,
        OR: [
          { expiresAt: null },
          { expiresAt: { gt: new Date() } },
        ],
      },
    }),
  ]);

  return {
    plan,
    limits,
    usage: {
      targets,
      proofs,
      activeLinks,
    },
    isWithinLimits: {
      targets: targets < limits.maxTargets,
      proofs: proofs < limits.maxProofs,
      activeLinks: activeLinks < limits.maxActiveLinks,
    },
  };
}



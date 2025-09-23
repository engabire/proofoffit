import { prisma } from "@/lib/db";

export interface PlanLimits {
  targets: number;
  proofs: number;
  auditLinks: number;
  monthlyExports: number;
}

const PLAN_LIMITS: Record<string, PlanLimits> = {
  free: {
    targets: 3,
    proofs: 10,
    auditLinks: 5,
    monthlyExports: 1,
  },
  pro: {
    targets: 20,
    proofs: 100,
    auditLinks: 50,
    monthlyExports: 10,
  },
  pro_plus: {
    targets: 100,
    proofs: 500,
    auditLinks: 200,
    monthlyExports: 50,
  },
  team: {
    targets: 500,
    proofs: 2000,
    auditLinks: 1000,
    monthlyExports: 200,
  },
  per_slate: {
    targets: 1000,
    proofs: 5000,
    auditLinks: 2000,
    monthlyExports: 500,
  },
};

export async function assertWithinLimits(
  userId: string,
  resource: keyof PlanLimits,
  currentCount?: number
): Promise<void> {
  try {
    // Get user's tenant and plan
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      throw new Error("User not found");
    }

    const plan = user.tenant.plan;
    const limits = PLAN_LIMITS[plan] || PLAN_LIMITS.free;

    // Get current count if not provided
    let count = currentCount;
    if (count === undefined) {
      switch (resource) {
        case "targets":
          count = await prisma.target.count({
            where: { 
              userId,
              isDeleted: false,
            },
          });
          break;
        case "proofs":
          count = await prisma.proof.count({
            where: { userId },
          });
          break;
        case "auditLinks":
          count = await prisma.auditLink.count({
            where: { userId },
          });
          break;
        case "monthlyExports":
          const startOfMonth = new Date();
          startOfMonth.setDate(1);
          startOfMonth.setHours(0, 0, 0, 0);
          
          count = await prisma.analyticsEvent.count({
            where: {
              userId,
              eventType: "data_export",
              createdAt: {
                gte: startOfMonth,
              },
            },
          });
          break;
        default:
          throw new Error(`Unknown resource: ${resource}`);
      }
    }

    const limit = limits[resource];
    if (count >= limit) {
      throw new Error(
        `Plan limit exceeded for ${resource}. Current: ${count}, Limit: ${limit}. Upgrade your plan to increase limits.`
      );
    }
  } catch (error) {
    if (error instanceof Error && error.message.includes("Plan limit exceeded")) {
      throw error;
    }
    console.error("Error checking plan limits:", error);
    // Don't throw on database errors - allow the operation to proceed
  }
}

export async function getPlanLimits(userId: string): Promise<PlanLimits> {
  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        tenant: true,
      },
    });

    if (!user) {
      return PLAN_LIMITS.free;
    }

    const plan = user.tenant.plan;
    return PLAN_LIMITS[plan] || PLAN_LIMITS.free;
  } catch (error) {
    console.error("Error getting plan limits:", error);
    return PLAN_LIMITS.free;
  }
}

export async function getCurrentUsage(userId: string): Promise<Partial<PlanLimits>> {
  try {
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const [targets, proofs, auditLinks, monthlyExports] = await Promise.all([
      prisma.target.count({
        where: { 
          userId,
          isDeleted: false,
        },
      }),
      prisma.proof.count({
        where: { userId },
      }),
      prisma.auditLink.count({
        where: { userId },
      }),
      prisma.analyticsEvent.count({
        where: {
          userId,
          eventType: "data_export",
          createdAt: {
            gte: startOfMonth,
          },
        },
      }),
    ]);

    return {
      targets,
      proofs,
      auditLinks,
      monthlyExports,
    };
  } catch (error) {
    console.error("Error getting current usage:", error);
    return {};
  }
}
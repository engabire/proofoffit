import { limitsByPlan, isWithinLimits } from "@/lib/limits";

describe("Quota Limits", () => {
  test("should return correct limits for each plan", () => {
    expect(limitsByPlan.FREE).toEqual({
      maxTargets: 1,
      maxProofs: 20,
      maxActiveLinks: 1,
    });

    expect(limitsByPlan.PRO).toEqual({
      maxTargets: 3,
      maxProofs: 100,
      maxActiveLinks: 50,
    });

    expect(limitsByPlan.PREMIUM).toEqual({
      maxTargets: 20,
      maxProofs: 500,
      maxActiveLinks: 500,
    });
  });

  test("should correctly check if usage is within limits", () => {
    const freeUsage = { targets: 1, proofs: 20, activeLinks: 1 };
    const proUsage = { targets: 3, proofs: 100, activeLinks: 50 };
    const premiumUsage = { targets: 20, proofs: 500, activeLinks: 500 };

    expect(isWithinLimits(freeUsage, "FREE")).toBe(true);
    expect(isWithinLimits(proUsage, "PRO")).toBe(true);
    expect(isWithinLimits(premiumUsage, "PREMIUM")).toBe(true);

    // Test exceeding limits
    const exceededUsage = { targets: 2, proofs: 21, activeLinks: 2 };
    expect(isWithinLimits(exceededUsage, "FREE")).toBe(false);
  });

  test("should handle edge cases", () => {
    const zeroUsage = { targets: 0, proofs: 0, activeLinks: 0 };
    expect(isWithinLimits(zeroUsage, "FREE")).toBe(true);
    expect(isWithinLimits(zeroUsage, "PRO")).toBe(true);
    expect(isWithinLimits(zeroUsage, "PREMIUM")).toBe(true);
  });
});





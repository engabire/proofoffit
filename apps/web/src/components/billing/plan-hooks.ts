import { useMemo } from 'react'

type NonprofitTier = 'N1' | 'N2' | 'N3' | 'N4' | 'NONE'

const tierMultipliers: Record<Exclude<NonprofitTier, 'NONE'>, number> = {
  N1: 0.5,
  N2: 0.65,
  N3: 0.75,
  N4: 0.9, // deal desk may override within 0.7–0.9 range
}

export function useNonprofitPricingMultiplier(tier: NonprofitTier) {
  return useMemo(() => {
    if (tier === 'NONE') return 1
    return tierMultipliers[tier]
  }, [tier])
}

export function applyNonprofitMultiplier(amount: number, tier: NonprofitTier) {
  const multiplier = tier === 'NONE' ? 1 : tierMultipliers[tier]
  return Math.round(amount * multiplier * 100) / 100
}

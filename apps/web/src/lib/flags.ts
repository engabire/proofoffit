export function getEnabledFeatures(): Set<string> {
  if (typeof window !== 'undefined') {
    const raw = (window as any).__FEATURES__ || process.env.NEXT_PUBLIC_FEATURES || ''
    return new Set(String(raw).split(',').map(s => s.trim()).filter(Boolean))
  }
  const raw = process.env.NEXT_PUBLIC_FEATURES || ''
  return new Set(String(raw).split(',').map(s => s.trim()).filter(Boolean))
}

export function isEnabled(feature: string): boolean {
  return getEnabledFeatures().has(feature)
}

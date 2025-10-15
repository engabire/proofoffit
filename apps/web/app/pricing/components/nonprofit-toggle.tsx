'use client'

import { useState } from 'react'

type NonprofitTier = 'N1' | 'N2' | 'N3' | 'N4'

const multipliers: Record<NonprofitTier, number> = {
  N1: 0.5,
  N2: 0.65,
  N3: 0.75,
  N4: 0.9,
}

export function NonprofitToggle() {
  const [tier, setTier] = useState<NonprofitTier>('N1')

  return (
    <section className="space-y-3 rounded-lg border p-4">
      <header className="space-y-1">
        <h3 className="text-lg font-medium">Nonprofit pricing multipliers</h3>
        <p className="text-sm text-muted-foreground">
          TODO: connect to live calculator inputs and eligibility status.
        </p>
      </header>
      <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
        {Object.entries(multipliers).map(([key, value]) => (
          <button
            key={key}
            className={`rounded-md border px-3 py-2 text-sm ${
              tier === key ? 'border-primary bg-primary/10' : ''
            }`}
            aria-pressed={tier === key}
            onClick={() => setTier(key as NonprofitTier)}
            type="button"
          >
            <span className="block font-semibold">{key}</span>
            <span className="text-xs text-muted-foreground">x{value}</span>
          </button>
        ))}
      </div>
    </section>
  )
}

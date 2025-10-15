'use client'

import { useState } from 'react'

export default function DataProtectionSettings() {
  const [edhpEnabled, setEdhpEnabled] = useState(false)

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold">Enhanced Data Handling Protocol (EDHP)</h1>
        <p className="text-sm text-muted-foreground">
          Enable EDHP to enforce restricted access, encryption, and audit logging when processing
          minors, PHI, or immigration-related documentation. Toggling EDHP will notify Security and
          update nonprofit eligibility records.
        </p>
      </header>

      <div className="rounded-lg border p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-medium">EDHP status</h2>
            <p className="text-xs text-muted-foreground">
              Current state: {edhpEnabled ? 'Enabled' : 'Disabled'} • Updates eligibility tier and service access immediately.
            </p>
          </div>
          <button
            type="button"
            onClick={() => setEdhpEnabled((value) => !value)}
            className={`inline-flex items-center rounded-full border px-4 py-2 text-xs font-semibold transition ${
              edhpEnabled ? 'border-green-500 bg-green-500/10 text-green-700' : 'border-gray-300'
            }`}
          >
            {edhpEnabled ? 'Disable EDHP' : 'Enable EDHP'}
          </button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          TODO: Replace local toggle with API integration to `/eligibility/attach` once backend is live.
        </p>
      </div>

      <div className="rounded-lg border p-5">
        <h2 className="text-base font-medium">Recent EDHP events</h2>
        <p className="text-xs text-muted-foreground">
          TODO: Fetch event history from Supabase audit log to show who enabled EDHP, when, and for which datasets.
        </p>
      </div>
    </section>
  )
}

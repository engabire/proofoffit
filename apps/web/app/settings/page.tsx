"use client"

import React, { useState } from 'react'

export default function SettingsPage() {
  const [busy, setBusy] = useState(false)
  const exportData = async () => {
    setBusy(true)
    try {
      const res = await fetch('/api/account/export', { method: 'POST' })
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'proofoffit-export.json'
      a.click()
      URL.revokeObjectURL(url)
    } finally { setBusy(false) }
  }
  const requestDelete = async () => {
    setBusy(true)
    try {
      await fetch('/api/account/delete', { method: 'POST' })
      alert('Deletion request received. We\'ll email confirmation shortly.')
    } finally { setBusy(false) }
  }

  return (
    <div className="mx-auto max-w-3xl px-6 py-12 space-y-6">
      <h1 className="text-2xl font-semibold">Settings</h1>
      <div className="rounded-lg border p-4">
        <h2 className="font-medium mb-2">Privacy</h2>
        <div className="flex gap-3">
          <button onClick={exportData} disabled={busy} className="rounded border px-4 py-2 text-sm">Export my data</button>
          <button onClick={requestDelete} disabled={busy} className="rounded border px-4 py-2 text-sm">Delete my data</button>
        </div>
      </div>
    </div>
  )
}

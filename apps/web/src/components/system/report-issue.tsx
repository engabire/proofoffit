"use client"

import React, { useState } from 'react'

export function ReportIssue() {
  const [submitting, setSubmitting] = useState(false)
  const [ok, setOk] = useState(false)

  const submit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        route: typeof window !== 'undefined' ? window.location.pathname : '',
        ua: typeof navigator !== 'undefined' ? navigator.userAgent : '',
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: typeof navigator !== 'undefined' ? navigator.language : '',
      }
      await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      setOk(true)
      setTimeout(() => setOk(false), 2500)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <button
      type="button"
      onClick={submit}
      disabled={submitting}
      className="fixed bottom-4 right-4 z-50 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100"
      aria-label="Report an issue"
    >
      {ok ? 'Thanks! Sent.' : submitting ? 'Sending…' : 'Report issue'}
    </button>
  )
}

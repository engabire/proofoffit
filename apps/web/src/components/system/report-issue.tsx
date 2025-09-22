"use client"

import React, { useState, useEffect } from 'react'

export function ReportIssue() {
  const [submitting, setSubmitting] = useState(false)
  const [ok, setOk] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const submit = async () => {
    setSubmitting(true)
    try {
      const payload = {
        route: window.location.pathname,
        ua: navigator.userAgent,
        tz: Intl.DateTimeFormat().resolvedOptions().timeZone,
        lang: navigator.language,
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

  if (!mounted) {
    return null
  }

  return (
    <button
      type="button"
      onClick={submit}
      disabled={submitting}
      className="fixed bottom-4 left-4 z-50 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm shadow-sm hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 md:left-auto md:right-4"
      aria-label="Report an issue"
    >
      {ok ? 'Thanks! Sent.' : submitting ? 'Sending…' : 'Report issue'}
    </button>
  )
}

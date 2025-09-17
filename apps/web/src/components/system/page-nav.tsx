'use client'

import React from 'react'

type NavLink = { href: string; label: string }

export function PageNav({ prev, next }: { prev?: NavLink; next?: NavLink }) {
  return (
    <nav className="mt-6 flex items-center justify-between">
      <div>
        {prev ? (
          <a
            href={prev.href}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-300 bg-white px-3 py-2 text-slate-900 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            aria-label={`Previous: ${prev.label}`}
          >
            ‹ {prev.label}
          </a>
        ) : <span />}
      </div>
      <div>
        {next ? (
          <a
            href={next.href}
            className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-3 py-2 text-white shadow hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
            aria-label={`Next: ${next.label}`}
          >
            {next.label} ›
          </a>
        ) : <span />}
      </div>
    </nav>
  )
}



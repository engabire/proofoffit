"use client"
import React, { useMemo, useState } from 'react'

export default function ROIPage() {
  const [annualHires, setAnnualHires] = useState(20)
  const [avgSalary, setAvgSalary] = useState(120000)
  const [timeSavedPct, setTimeSavedPct] = useState(0.35)
  const [improvedRetentionPct, setImprovedRetentionPct] = useState(0.1)

  const annualSavings = useMemo(() => {
    const recruiterCostPerHire = 0.2 * avgSalary
    const timeSavings = recruiterCostPerHire * timeSavedPct
    const retentionSavings = avgSalary * improvedRetentionPct
    return Math.round(annualHires * (timeSavings + retentionSavings))
  }, [annualHires, avgSalary, timeSavedPct, improvedRetentionPct])

  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">ROI Calculator</h1>
      <p className="mt-2 text-slate-600 dark:text-slate-300">Estimate savings from faster, higher-confidence hiring with ProofOfFit.</p>

      <div className="mt-8 grid gap-6 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-slate-300">Annual hires</span>
          <input type="number" value={annualHires} onChange={e => setAnnualHires(Number(e.target.value)||0)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-slate-300">Average salary (USD)</span>
          <input type="number" value={avgSalary} onChange={e => setAvgSalary(Number(e.target.value)||0)} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-slate-300">Time saved per hire (%)</span>
          <input type="number" value={Math.round(timeSavedPct*100)} onChange={e => setTimeSavedPct(Math.max(0, Math.min(1, (Number(e.target.value)||0)/100)))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
        </label>
        <label className="block">
          <span className="text-sm text-slate-600 dark:text-slate-300">Improved retention (%)</span>
          <input type="number" value={Math.round(improvedRetentionPct*100)} onChange={e => setImprovedRetentionPct(Math.max(0, Math.min(1, (Number(e.target.value)||0)/100)))} className="mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 dark:border-slate-700 dark:bg-slate-950" />
        </label>
      </div>

      <div className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950">
        <div className="text-sm uppercase tracking-wide text-slate-500">Estimated Annual Savings</div>
        <div className="mt-2 text-4xl font-semibold">${annualSavings.toLocaleString()}</div>
      </div>
    </main>
  )
}



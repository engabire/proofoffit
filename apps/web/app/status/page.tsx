export const dynamic = 'force-dynamic'

async function fetchHealth() {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL || 'https://www.proofoffit.com'}/api/health`, { cache: 'no-store' })
    const ct = res.headers.get('content-type') || ''
    if (!res.ok || !ct.includes('application/json')) {
      return { status: 'error' }
    }
    return await res.json()
  } catch {
    return { status: 'error' }
  }
}

export default async function StatusPage() {
  const health = await fetchHealth()
  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-2xl font-semibold mb-4">System Status</h1>
      <div className={`rounded-lg border p-4 ${health.status === 'ok' ? 'border-emerald-300 bg-emerald-50' : 'border-amber-300 bg-amber-50'}`}>
        <div className="text-sm text-slate-600">Service</div>
        <div className="text-lg font-medium">Web</div>
        <div className="mt-2 text-sm">Status: <span className={health.status === 'ok' ? 'text-emerald-700' : 'text-amber-700'}>{health.status || 'unknown'}</span></div>
        {health.version && <div className="text-sm">Version: {health.version}</div>}
        {health.time && <div className="text-sm">Time: {health.time}</div>}
      </div>
    </div>
  )
}

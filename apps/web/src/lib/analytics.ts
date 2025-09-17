export type AnalyticsEvent = {
  name: string
  ts?: number
  props?: Record<string, any>
}

export async function track(event: AnalyticsEvent) {
  try {
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, ts: event.ts ?? Date.now() })
    })
  } catch {}
}

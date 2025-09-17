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

// Simple client-side timers for OMM and other durations
const timers = new Map<string, number>()

export function startTimer(name: string) {
  timers.set(name, performance.now())
}

export function stopTimer(name: string, props?: Record<string, any>) {
  const start = timers.get(name)
  if (start == null) return
  const durationMs = Math.max(0, performance.now() - start)
  timers.delete(name)
  track({ name: 'timer_complete', props: { timer: name, durationMs, ...props } })
}

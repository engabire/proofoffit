export type AnalyticsEvent = {
  name: string
  ts?: number
  props?: Record<string, any>
}

export async function track(event: AnalyticsEvent) {
  try {
    // Use modern fetch with proper error handling
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 5000) // 5s timeout
    
    await fetch('/api/analytics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...event, ts: event.ts ?? Date.now() }),
      signal: controller.signal,
      keepalive: true // Optimize for analytics
    })
    
    clearTimeout(timeoutId)
  } catch (error) {
    // Silently fail for analytics - don't log to avoid console spam
    if (process.env.NODE_ENV === 'development') {
      console.debug('Analytics tracking failed:', error)
    }
  }
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

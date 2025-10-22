// Simple analytics implementation that doesn't depend on Prisma
export type AnalyticsEventType = 
  | "target_created"
  | "audit_link_created"
  | "audit_view"
  | "proof_click"
  | "jd_fit_run"
  | "claim_generated"
  | "fit_analysis_complete"
  | "resume_import_complete"
  | "document_download"
  | "lane_select"
  | "job_search_performed";

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  userId?: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    // For now, just log analytics events
    // eslint-disable-next-line no-console
    console.log("Analytics event:", event);
    
    // TODO: Implement proper analytics storage when database is ready
    // await prisma.analyticsEvent.create({
    //   data: {
    //     eventType: event.eventType,
    //     userId: event.userId,
    //     targetId: event.targetId,
    //     metadata: event.metadata || {},
    //   },
    // });
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("Failed to track analytics event:", error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

export async function getAnalyticsForTarget(_targetId: string, _days: number = 30) {
  // TODO: Implement when database is ready
  return {
    totalEvents: 0,
    eventsByType: {} as Record<string, number>,
    recentEvents: [],
  };
}

export async function getAnalyticsForUser(_userId: string, _days: number = 30) {
  // TODO: Implement when database is ready
  return {
    totalEvents: 0,
    eventsByType: {} as Record<string, number>,
    eventsByTarget: {} as Record<string, any>,
    recentEvents: [],
  };
}

export async function getAnalyticsSummary(_days: number = 30) {
  // TODO: Implement when database is ready
  return {
    totalEvents: 0,
    uniqueUsers: 0,
    eventsByType: {} as Record<string, number>,
    topTargets: [],
  };
}

// Timer functions for performance tracking
export function startTimer(name: string): number {
  const start = Date.now();
  // eslint-disable-next-line no-console
  console.log(`Timer ${name} started`);
  return start;
}

export function stopTimer(startTime: number, name?: string): number {
  const duration = Date.now() - startTime;
  if (name) {
    // eslint-disable-next-line no-console
    console.log(`Timer ${name}: ${duration}ms`);
  }
  return duration;
}

// Simple track function for basic analytics
export function track(event: { name: string; [key: string]: any }): void {
  // eslint-disable-next-line no-console
  console.log("Track event:", event);
}

// CTA Analytics Bridge
export function setupCtaBridge() {
  if (typeof window === 'undefined') return;
  if ((window as any).__ctaBridge) return;

  window.addEventListener('cta:click', (e: Event) => {
    const detail = (e as CustomEvent).detail || {};
    
    // Log all CTA events for debugging
    // eslint-disable-next-line no-console
    console.log('CTA Event:', detail);
    
    try { 
      // Send to Google Analytics if available
      (window as any).gtag?.('event', 'cta_click', detail); 
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to send CTA event to gtag:', error);
    }
    
    // Track in internal analytics system
    try {
      trackEvent({
        eventType: 'jd_fit_run', // Map CTA clicks to existing event type for now
        metadata: {
          cta_type: 'cta_click',
          ...detail
        }
      });
    } catch (error) {
      // eslint-disable-next-line no-console
      console.warn('Failed to track CTA event internally:', error);
    }
    
    // If you have a first-party tracker, call it here too
    // fetch('/api/track', { method: 'POST', body: JSON.stringify({ type: 'cta_click', detail }) })
  });

  (window as any).__ctaBridge = true;
}

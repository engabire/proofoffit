import { prisma } from "@/lib/db";

export type AnalyticsEventType = 
  | "target_created"
  | "audit_link_created"
  | "audit_view"
  | "proof_click"
  | "jd_fit_run"
  | "claim_generated";

export interface AnalyticsEvent {
  eventType: AnalyticsEventType;
  userId?: string;
  targetId?: string;
  metadata?: Record<string, any>;
}

export async function trackEvent(event: AnalyticsEvent) {
  try {
    await prisma.analyticsEvent.create({
      data: {
        eventType: event.eventType,
        userId: event.userId,
        targetId: event.targetId,
        metadata: event.metadata || {},
      },
    });
  } catch (error) {
    console.error("Failed to track analytics event:", error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

export async function getAnalyticsForTarget(targetId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      targetId,
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    totalEvents: events.length,
    eventsByType: events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentEvents: events.slice(0, 10),
  };
}

export async function getAnalyticsForUser(userId: string, days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const events = await prisma.analyticsEvent.findMany({
    where: {
      userId,
      createdAt: {
        gte: since,
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    totalEvents: events.length,
    eventsByType: events.reduce((acc, event) => {
      acc[event.eventType] = (acc[event.eventType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    eventsByTarget: events.reduce((acc, event) => {
      if (event.targetId) {
        const targetId = event.targetId;
        if (!acc[targetId]) {
          acc[targetId] = {
            title: `Target ${targetId}`,
            count: 0,
            events: [],
          };
        }
        acc[targetId].count++;
        acc[targetId].events.push(event);
      }
      return acc;
    }, {} as Record<string, any>),
    recentEvents: events.slice(0, 10),
  };
}

export async function getAnalyticsSummary(days: number = 30) {
  const since = new Date();
  since.setDate(since.getDate() - days);

  const [totalEvents, uniqueUsers, eventsByType, topTargets] = await Promise.all([
    prisma.analyticsEvent.count({
      where: { createdAt: { gte: since } },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['userId'],
      where: { 
        createdAt: { gte: since },
        userId: { not: null },
      },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['eventType'],
      where: { createdAt: { gte: since } },
      _count: { eventType: true },
    }),
    prisma.analyticsEvent.groupBy({
      by: ['targetId'],
      where: { 
        createdAt: { gte: since },
        targetId: { not: null },
      },
      _count: { targetId: true },
      orderBy: { _count: { targetId: 'desc' } },
      take: 10,
    }),
  ]);

  return {
    totalEvents,
    uniqueUsers: uniqueUsers.length,
    eventsByType: eventsByType.reduce((acc, item) => {
      acc[item.eventType] = item._count.eventType;
      return acc;
    }, {} as Record<string, number>),
    topTargets: topTargets.map(item => ({
      targetId: item.targetId,
      count: item._count.targetId,
    })),
  };
}

// Timer functions for performance tracking
export function startTimer(name: string): number {
  const start = Date.now();
  console.log(`Timer ${name} started`);
  return start;
}

export function stopTimer(startTime: number, name?: string): number {
  const duration = Date.now() - startTime;
  if (name) {
    console.log(`Timer ${name}: ${duration}ms`);
  }
  return duration;
}

// Simple track function for basic analytics
export function track(event: { name: string; [key: string]: any }): void {
  console.log("Track event:", event);
}

// CTA Analytics Bridge
export function setupCtaBridge() {
  if (typeof window === 'undefined') return;
  if ((window as any).__ctaBridge) return;

  window.addEventListener('cta:click', (e: Event) => {
    const detail = (e as CustomEvent).detail || {};
    
    // Log all CTA events for debugging
    console.log('CTA Event:', detail);
    
    try { 
      // Send to Google Analytics if available
      (window as any).gtag?.('event', 'cta_click', detail); 
    } catch (error) {
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
      console.warn('Failed to track CTA event internally:', error);
    }
    
    // If you have a first-party tracker, call it here too
    // fetch('/api/track', { method: 'POST', body: JSON.stringify({ type: 'cta_click', detail }) })
  });

  (window as any).__ctaBridge = true;
}
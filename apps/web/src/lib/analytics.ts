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
    }, {} as Record<string, { title: string; count: number; events: any[] }>),
    recentEvents: events.slice(0, 20),
  };
}

export async function getAuditLinkAnalytics(auditLinkId: string) {
  const link = await prisma.auditLink.findUnique({
    where: { id: auditLinkId },
    include: {
      views: {
        orderBy: {
          createdAt: "desc",
        },
      },
      _count: {
        select: {
          views: true,
        },
      },
    },
  });

  if (!link) {
    return null;
  }

  const views = link.views;
  const uniqueViewers = new Set(views.map(v => v.viewerHash)).size;
  
  return {
    totalViews: link._count.views,
    uniqueViewers,
    viewsByDay: views.reduce((acc, view) => {
      const day = view.createdAt.toISOString().split('T')[0];
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    recentViews: views.slice(0, 10),
  };
}

// Timer functions for performance tracking
export function startTimer(label: string): number {
  return performance.now();
}

export function stopTimer(startTime: number, label: string): number {
  const duration = performance.now() - startTime;
  console.log(`${label}: ${duration.toFixed(2)}ms`);
  return duration;
}

// Simple tracking function for client-side events
export function track(event: { name: string; properties?: Record<string, any> }) {
  console.log('Analytics event:', event);
  // In a real implementation, this would send to analytics service
}

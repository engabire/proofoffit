// Simplified analytics - models don't exist in current schema

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
    // Temporary logging until analyticsEvent model is added
    console.log("Analytics event:", event);
  } catch (error) {
    console.error("Failed to track analytics event:", error);
    // Don't throw - analytics failures shouldn't break the app
  }
}

export async function getAnalyticsForTarget(targetId: string, days: number = 30) {
  // Temporary placeholder
  return {
    totalEvents: 0,
    eventsByType: {},
    recentEvents: [],
  };
}

export async function getAnalyticsForUser(userId: string, days: number = 30) {
  // Temporary placeholder
  return {
    totalEvents: 0,
    eventsByType: {},
    eventsByTarget: {},
    recentEvents: [],
  };
}

export async function getAnalyticsSummary(days: number = 30) {
  // Temporary placeholder
  return {
    totalEvents: 0,
    uniqueUsers: 0,
    eventsByType: {},
    topTargets: [],
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
/**
 * Advanced Analytics System for ProofOfFit
 * Comprehensive tracking, reporting, and insights
 */

import { trackEvent } from '../analytics';

export interface AnalyticsEvent {
  eventType: string;
  userId?: string;
  sessionId?: string;
  targetId?: string;
  metadata?: Record<string, any>;
  timestamp?: number;
  url?: string;
  userAgent?: string;
  ip?: string;
}

export interface UserJourney {
  userId: string;
  sessionId: string;
  events: AnalyticsEvent[];
  startTime: number;
  endTime?: number;
  duration?: number;
  conversionEvents: string[];
  dropoffPoints: string[];
}

export interface AnalyticsInsight {
  type: 'trend' | 'anomaly' | 'recommendation' | 'alert';
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  data: any;
  timestamp: number;
  actionable: boolean;
  actionUrl?: string;
}

export interface PerformanceMetrics {
  pageViews: number;
  uniqueUsers: number;
  bounceRate: number;
  averageSessionDuration: number;
  conversionRate: number;
  topPages: Array<{ url: string; views: number; bounceRate: number }>;
  userFlow: Array<{ from: string; to: string; count: number }>;
  deviceBreakdown: Record<string, number>;
  browserBreakdown: Record<string, number>;
  geographicData: Record<string, number>;
}

export class AdvancedAnalytics {
  private events: AnalyticsEvent[] = [];
  private userJourneys: Map<string, UserJourney> = new Map();
  private insights: AnalyticsInsight[] = [];
  private sessionId: string;
  private userId?: string;

  constructor() {
    this.sessionId = this.generateSessionId();
    this.initializeTracking();
  }

  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private initializeTracking() {
    if (typeof window === 'undefined') return;

    // Track page views
    this.trackPageView();

    // Track user interactions
    this.setupInteractionTracking();

    // Track performance metrics
    this.setupPerformanceTracking();

    // Track errors
    this.setupErrorTracking();

    // Track user engagement
    this.setupEngagementTracking();
  }

  private trackPageView() {
    const event: AnalyticsEvent = {
      eventType: 'page_view',
      sessionId: this.sessionId,
      userId: this.userId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metadata: {
        referrer: document.referrer,
        title: document.title,
        path: window.location.pathname,
        search: window.location.search,
        hash: window.location.hash,
      },
    };

    this.recordEvent(event);
  }

  private setupInteractionTracking() {
    // Track clicks
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (target) {
        this.trackInteraction('click', {
          element: target.tagName,
          id: target.id,
          className: target.className,
          text: target.textContent?.substring(0, 100),
          href: (target as HTMLAnchorElement).href,
        });
      }
    });

    // Track form submissions
    document.addEventListener('submit', (event) => {
      const form = event.target as HTMLFormElement;
      this.trackInteraction('form_submit', {
        formId: form.id,
        formAction: form.action,
        formMethod: form.method,
        fieldCount: form.elements.length,
      });
    });

    // Track scroll depth
    let maxScrollDepth = 0;
    window.addEventListener('scroll', () => {
      const scrollDepth = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) * 100
      );
      
      if (scrollDepth > maxScrollDepth) {
        maxScrollDepth = scrollDepth;
        this.trackInteraction('scroll_depth', {
          depth: maxScrollDepth,
          timestamp: Date.now(),
        });
      }
    });
  }

  private setupPerformanceTracking() {
    // Track Core Web Vitals
    if ('PerformanceObserver' in window) {
      // LCP
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        const lastEntry = entries[entries.length - 1];
        this.trackPerformance('lcp', lastEntry.startTime);
      }).observe({ type: 'largest-contentful-paint', buffered: true });

      // FID
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          this.trackPerformance('fid', entry.processingStart - entry.startTime);
        });
      }).observe({ type: 'first-input', buffered: true });

      // CLS
      let clsValue = 0;
      new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry) => {
          if (!(entry as any).hadRecentInput) {
            clsValue += (entry as any).value;
            this.trackPerformance('cls', clsValue);
          }
        });
      }).observe({ type: 'layout-shift', buffered: true });
    }

    // Track page load time
    window.addEventListener('load', () => {
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      this.trackPerformance('page_load_time', navigation.loadEventEnd - navigation.fetchStart);
      this.trackPerformance('dom_content_loaded', navigation.domContentLoadedEventEnd - navigation.fetchStart);
      this.trackPerformance('time_to_first_byte', navigation.responseStart - navigation.fetchStart);
    });
  }

  private setupErrorTracking() {
    // Track JavaScript errors
    window.addEventListener('error', (event) => {
      this.trackError('javascript_error', {
        message: event.message,
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
        stack: event.error?.stack,
      });
    });

    // Track unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.trackError('unhandled_promise_rejection', {
        reason: event.reason,
        stack: event.reason?.stack,
      });
    });

    // Track fetch errors
    const originalFetch = window.fetch;
    window.fetch = async (...args) => {
      try {
        const response = await originalFetch(...args);
        if (!response.ok) {
          this.trackError('fetch_error', {
            url: args[0],
            status: response.status,
            statusText: response.statusText,
          });
        }
        return response;
      } catch (error) {
        this.trackError('fetch_error', {
          url: args[0],
          error: error.message,
        });
        throw error;
      }
    };
  }

  private setupEngagementTracking() {
    // Track time on page
    const startTime = Date.now();
    let isActive = true;
    let totalActiveTime = 0;
    let lastActiveTime = startTime;

    const updateActiveTime = () => {
      if (isActive) {
        totalActiveTime += Date.now() - lastActiveTime;
      }
      lastActiveTime = Date.now();
    };

    // Track visibility changes
    document.addEventListener('visibilitychange', () => {
      updateActiveTime();
      isActive = !document.hidden;
      
      if (isActive) {
        this.trackEngagement('page_visible', { timestamp: Date.now() });
      } else {
        this.trackEngagement('page_hidden', { 
          timestamp: Date.now(),
          activeTime: totalActiveTime,
        });
      }
    });

    // Track focus changes
    window.addEventListener('focus', () => {
      updateActiveTime();
      this.trackEngagement('window_focus', { timestamp: Date.now() });
    });

    window.addEventListener('blur', () => {
      updateActiveTime();
      this.trackEngagement('window_blur', { 
        timestamp: Date.now(),
        activeTime: totalActiveTime,
      });
    });

    // Track beforeunload
    window.addEventListener('beforeunload', () => {
      updateActiveTime();
      this.trackEngagement('page_unload', {
        timestamp: Date.now(),
        totalActiveTime: totalActiveTime,
        sessionDuration: Date.now() - startTime,
      });
    });
  }

  public setUserId(userId: string) {
    this.userId = userId;
  }

  public trackCustomEvent(eventType: string, metadata?: Record<string, any>) {
    const event: AnalyticsEvent = {
      eventType,
      userId: this.userId,
      sessionId: this.sessionId,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: Date.now(),
      metadata,
    };

    this.recordEvent(event);
  }

  private trackInteraction(type: string, metadata: Record<string, any>) {
    this.trackCustomEvent(`interaction_${type}`, metadata);
  }

  private trackPerformance(metric: string, value: number) {
    this.trackCustomEvent('performance_metric', {
      metric,
      value,
      timestamp: Date.now(),
    });
  }

  private trackError(type: string, metadata: Record<string, any>) {
    this.trackCustomEvent(`error_${type}`, {
      ...metadata,
      severity: this.determineErrorSeverity(type, metadata),
    });
  }

  private trackEngagement(type: string, metadata: Record<string, any>) {
    this.trackCustomEvent(`engagement_${type}`, metadata);
  }

  private determineErrorSeverity(type: string, metadata: Record<string, any>): string {
    if (type === 'javascript_error' && metadata.message?.includes('ChunkLoadError')) {
      return 'high';
    }
    if (type === 'fetch_error' && metadata.status >= 500) {
      return 'high';
    }
    if (type === 'unhandled_promise_rejection') {
      return 'medium';
    }
    return 'low';
  }

  private recordEvent(event: AnalyticsEvent) {
    this.events.push(event);
    
    // Update user journey
    this.updateUserJourney(event);
    
    // Send to analytics service
    this.sendToAnalytics(event);
    
    // Generate insights
    this.generateInsights(event);
  }

  private updateUserJourney(event: AnalyticsEvent) {
    if (!event.userId) return;

    const journeyKey = `${event.userId}_${event.sessionId}`;
    let journey = this.userJourneys.get(journeyKey);

    if (!journey) {
      journey = {
        userId: event.userId,
        sessionId: event.sessionId,
        events: [],
        startTime: event.timestamp || Date.now(),
        conversionEvents: [],
        dropoffPoints: [],
      };
      this.userJourneys.set(journeyKey, journey);
    }

    journey.events.push(event);

    // Track conversion events
    if (this.isConversionEvent(event.eventType)) {
      journey.conversionEvents.push(event.eventType);
    }

    // Update journey end time
    journey.endTime = event.timestamp || Date.now();
    journey.duration = journey.endTime - journey.startTime;
  }

  private isConversionEvent(eventType: string): boolean {
    const conversionEvents = [
      'signup_complete',
      'purchase_complete',
      'subscription_started',
      'target_created',
      'application_submitted',
    ];
    return conversionEvents.includes(eventType);
  }

  private async sendToAnalytics(event: AnalyticsEvent) {
    try {
      await trackEvent({
        eventType: event.eventType,
        userId: event.userId,
        targetId: event.targetId,
        metadata: event.metadata,
      });
    } catch (error) {
      console.error('Failed to send analytics event:', error);
    }
  }

  private generateInsights(event: AnalyticsEvent) {
    // Generate real-time insights based on events
    const insights = this.analyzeEventPatterns(event);
    this.insights.push(...insights);
  }

  private analyzeEventPatterns(event: AnalyticsEvent): AnalyticsInsight[] {
    const insights: AnalyticsInsight[] = [];

    // High bounce rate detection
    if (event.eventType === 'page_view') {
      const recentEvents = this.events.filter(
        e => e.sessionId === event.sessionId && 
        e.timestamp && 
        e.timestamp > (event.timestamp || 0) - 30000 // Last 30 seconds
      );
      
      if (recentEvents.length === 1) {
        insights.push({
          type: 'alert',
          title: 'High Bounce Rate Detected',
          description: 'User left the page within 30 seconds',
          severity: 'medium',
          data: { url: event.url, sessionId: event.sessionId },
          timestamp: Date.now(),
          actionable: true,
          actionUrl: event.url,
        });
      }
    }

    // Error rate monitoring
    if (event.eventType.startsWith('error_')) {
      const recentErrors = this.events.filter(
        e => e.eventType.startsWith('error_') && 
        e.timestamp && 
        e.timestamp > Date.now() - 300000 // Last 5 minutes
      );

      if (recentErrors.length > 10) {
        insights.push({
          type: 'alert',
          title: 'High Error Rate',
          description: `${recentErrors.length} errors in the last 5 minutes`,
          severity: 'high',
          data: { errorCount: recentErrors.length, errors: recentErrors },
          timestamp: Date.now(),
          actionable: true,
        });
      }
    }

    // Performance degradation detection
    if (event.eventType === 'performance_metric') {
      const metric = event.metadata?.metric;
      const value = event.metadata?.value;

      if (metric === 'page_load_time' && value > 5000) {
        insights.push({
          type: 'alert',
          title: 'Slow Page Load',
          description: `Page load time is ${value}ms, above 5s threshold`,
          severity: 'medium',
          data: { metric, value, url: event.url },
          timestamp: Date.now(),
          actionable: true,
          actionUrl: event.url,
        });
      }
    }

    return insights;
  }

  public getInsights(): AnalyticsInsight[] {
    return [...this.insights];
  }

  public getRecentInsights(limit: number = 10): AnalyticsInsight[] {
    return this.insights
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, limit);
  }

  public getUserJourney(userId: string, sessionId?: string): UserJourney | undefined {
    if (sessionId) {
      return this.userJourneys.get(`${userId}_${sessionId}`);
    }
    
    // Return most recent journey for user
    const userJourneys = Array.from(this.userJourneys.values())
      .filter(journey => journey.userId === userId)
      .sort((a, b) => (b.endTime || 0) - (a.endTime || 0));
    
    return userJourneys[0];
  }

  public getPerformanceMetrics(): PerformanceMetrics {
    const now = Date.now();
    const last24Hours = now - (24 * 60 * 60 * 1000);
    
    const recentEvents = this.events.filter(e => (e.timestamp || 0) > last24Hours);
    const pageViews = recentEvents.filter(e => e.eventType === 'page_view');
    const uniqueUsers = new Set(recentEvents.map(e => e.userId).filter(Boolean)).size;
    
    const sessions = new Map<string, AnalyticsEvent[]>();
    recentEvents.forEach(event => {
      if (event.sessionId) {
        if (!sessions.has(event.sessionId)) {
          sessions.set(event.sessionId, []);
        }
        sessions.get(event.sessionId)!.push(event);
      }
    });

    const sessionDurations = Array.from(sessions.values())
      .map(sessionEvents => {
        const timestamps = sessionEvents.map(e => e.timestamp || 0).filter(t => t > 0);
        return timestamps.length > 1 ? Math.max(...timestamps) - Math.min(...timestamps) : 0;
      })
      .filter(duration => duration > 0);

    const averageSessionDuration = sessionDurations.length > 0 
      ? sessionDurations.reduce((sum, duration) => sum + duration, 0) / sessionDurations.length
      : 0;

    const bounceRate = sessions.size > 0 
      ? (Array.from(sessions.values()).filter(session => session.length === 1).length / sessions.size) * 100
      : 0;

    const conversionEvents = recentEvents.filter(e => this.isConversionEvent(e.eventType));
    const conversionRate = sessions.size > 0 ? (conversionEvents.length / sessions.size) * 100 : 0;

    return {
      pageViews: pageViews.length,
      uniqueUsers,
      bounceRate,
      averageSessionDuration,
      conversionRate,
      topPages: this.getTopPages(pageViews),
      userFlow: this.getUserFlow(recentEvents),
      deviceBreakdown: this.getDeviceBreakdown(recentEvents),
      browserBreakdown: this.getBrowserBreakdown(recentEvents),
      geographicData: {}, // Would require IP geolocation
    };
  }

  private getTopPages(pageViews: AnalyticsEvent[]) {
    const pageCounts = new Map<string, { views: number; bounces: number }>();
    
    pageViews.forEach(event => {
      const url = event.url || '';
      if (!pageCounts.has(url)) {
        pageCounts.set(url, { views: 0, bounces: 0 });
      }
      pageCounts.get(url)!.views++;
      
      // Check if this was a bounce (only one event in session)
      const sessionEvents = this.events.filter(e => e.sessionId === event.sessionId);
      if (sessionEvents.length === 1) {
        pageCounts.get(url)!.bounces++;
      }
    });

    return Array.from(pageCounts.entries())
      .map(([url, data]) => ({
        url,
        views: data.views,
        bounceRate: (data.bounces / data.views) * 100,
      }))
      .sort((a, b) => b.views - a.views)
      .slice(0, 10);
  }

  private getUserFlow(events: AnalyticsEvent[]) {
    const flows = new Map<string, number>();
    
    events
      .filter(e => e.eventType === 'page_view')
      .sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0))
      .forEach((event, index, array) => {
        if (index < array.length - 1) {
          const nextEvent = array[index + 1];
          const flow = `${event.url} -> ${nextEvent.url}`;
          flows.set(flow, (flows.get(flow) || 0) + 1);
        }
      });

    return Array.from(flows.entries())
      .map(([flow, count]) => {
        const [from, to] = flow.split(' -> ');
        return { from, to, count };
      })
      .sort((a, b) => b.count - a.count)
      .slice(0, 20);
  }

  private getDeviceBreakdown(events: AnalyticsEvent[]) {
    const devices = new Map<string, number>();
    
    events.forEach(event => {
      const userAgent = event.userAgent || '';
      let device = 'desktop';
      
      if (/mobile|android|iphone|ipad/i.test(userAgent)) {
        device = 'mobile';
      } else if (/tablet|ipad/i.test(userAgent)) {
        device = 'tablet';
      }
      
      devices.set(device, (devices.get(device) || 0) + 1);
    });

    return Object.fromEntries(devices);
  }

  private getBrowserBreakdown(events: AnalyticsEvent[]) {
    const browsers = new Map<string, number>();
    
    events.forEach(event => {
      const userAgent = event.userAgent || '';
      let browser = 'unknown';
      
      if (userAgent.includes('Chrome')) browser = 'Chrome';
      else if (userAgent.includes('Firefox')) browser = 'Firefox';
      else if (userAgent.includes('Safari')) browser = 'Safari';
      else if (userAgent.includes('Edge')) browser = 'Edge';
      
      browsers.set(browser, (browsers.get(browser) || 0) + 1);
    });

    return Object.fromEntries(browsers);
  }

  public exportData() {
      return {
      events: this.events,
      userJourneys: Array.from(this.userJourneys.values()),
      insights: this.insights,
      performanceMetrics: this.getPerformanceMetrics(),
      exportTimestamp: Date.now(),
    };
  }

  public clearData() {
    this.events = [];
    this.userJourneys.clear();
    this.insights = [];
  }
}

// Singleton instance
let analyticsInstance: AdvancedAnalytics | null = null;

export function getAnalytics(): AdvancedAnalytics {
  if (!analyticsInstance) {
    analyticsInstance = new AdvancedAnalytics();
  }
  return analyticsInstance;
}

// React hook for analytics
export function useAnalytics() {
  const [analytics] = React.useState(() => getAnalytics());
  const [insights, setInsights] = React.useState<AnalyticsInsight[]>([]);
  const [metrics, setMetrics] = React.useState<PerformanceMetrics | null>(null);

  React.useEffect(() => {
    const updateData = () => {
      setInsights(analytics.getRecentInsights());
      setMetrics(analytics.getPerformanceMetrics());
    };

    updateData();
    const interval = setInterval(updateData, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, [analytics]);

  return {
    analytics,
    insights,
    metrics,
    trackEvent: (eventType: string, metadata?: Record<string, any>) => 
      analytics.trackCustomEvent(eventType, metadata),
    setUserId: (userId: string) => analytics.setUserId(userId),
  };
}
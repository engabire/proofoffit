import { createClient } from '@supabase/supabase-js'

export interface AnalyticsEvent {
  id?: string
  eventType: string
  eventData: Record<string, any>
  userId?: string
  sessionId?: string
  timestamp: Date
  metadata?: Record<string, any>
}

export interface UserMetrics {
  userId: string
  totalSearches: number
  totalApplications: number
  totalViews: number
  avgSessionDuration: number
  lastActive: Date
  conversionRate: number
  topSkills: string[]
  preferredLocations: string[]
  avgFitScore: number
}

export interface JobMetrics {
  jobId: string
  totalViews: number
  totalApplications: number
  avgFitScore: number
  conversionRate: number
  topCandidateSources: string[]
  timeToFirstApplication: number
  applicationTrends: Array<{
    date: string
    applications: number
    views: number
  }>
}

export interface SystemMetrics {
  totalUsers: number
  activeUsers: number
  totalJobs: number
  activeJobs: number
  totalApplications: number
  avgResponseTime: number
  systemUptime: number
  errorRate: number
  revenue: number
  churnRate: number
}

export class AdvancedAnalytics {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  // Track custom analytics event
  async trackEvent(event: AnalyticsEvent): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('analytics_events')
        .insert({
          event_type: event.eventType,
          event_data: event.eventData,
          user_id: event.userId,
          session_id: event.sessionId,
          metadata: event.metadata,
          created_at: event.timestamp.toISOString()
        })

      if (error) throw error

      return true
    } catch (error) {
      console.error('Error tracking analytics event:', error)
      return false
    }
  }

  // Get user metrics
  async getUserMetrics(userId: string, days: number = 30): Promise<UserMetrics | null> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get user events
      const { data: events, error: eventsError } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('user_id', userId)
        .gte('created_at', startDate.toISOString())

      if (eventsError) throw eventsError

      // Get user applications
      const { data: applications, error: appsError } = await this.supabase
        .from('job_applications')
        .select('*')
        .eq('user_id', userId)
        .gte('applied_at', startDate.toISOString())

      if (appsError) throw appsError

      // Calculate metrics
      const totalSearches = events.filter(e => e.event_type === 'job_search').length
      const totalApplications = applications.length
      const totalViews = events.filter(e => e.event_type === 'job_view').length

      // Calculate session duration
      const sessions = this.groupEventsBySession(events)
      const avgSessionDuration = sessions.reduce((acc, session) => {
        const duration = session.endTime.getTime() - session.startTime.getTime()
        return acc + duration
      }, 0) / sessions.length / 1000 / 60 // Convert to minutes

      // Calculate conversion rate
      const conversionRate = totalSearches > 0 ? (totalApplications / totalSearches) * 100 : 0

      // Get top skills and locations
      const topSkills = this.extractTopSkills(events)
      const preferredLocations = this.extractPreferredLocations(events)

      // Calculate average fit score
      const fitScores = events
        .filter(e => e.event_type === 'job_match' && e.event_data.fitScore)
        .map(e => e.event_data.fitScore)
      const avgFitScore = fitScores.length > 0 
        ? fitScores.reduce((a, b) => a + b, 0) / fitScores.length 
        : 0

      return {
        userId,
        totalSearches,
        totalApplications,
        totalViews,
        avgSessionDuration: Math.round(avgSessionDuration * 100) / 100,
        lastActive: new Date(Math.max(...events.map(e => new Date(e.created_at).getTime()))),
        conversionRate: Math.round(conversionRate * 100) / 100,
        topSkills,
        preferredLocations,
        avgFitScore: Math.round(avgFitScore * 100) / 100
      }
    } catch (error) {
      console.error('Error getting user metrics:', error)
      return null
    }
  }

  // Get job metrics
  async getJobMetrics(jobId: string, days: number = 30): Promise<JobMetrics | null> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get job events
      const { data: events, error: eventsError } = await this.supabase
        .from('analytics_events')
        .select('*')
        .eq('event_data.jobId', jobId)
        .gte('created_at', startDate.toISOString())

      if (eventsError) throw eventsError

      // Get job applications
      const { data: applications, error: appsError } = await this.supabase
        .from('job_applications')
        .select('*')
        .eq('job_id', jobId)
        .gte('applied_at', startDate.toISOString())

      if (appsError) throw appsError

      // Calculate metrics
      const totalViews = events.filter(e => e.event_type === 'job_view').length
      const totalApplications = applications.length
      const conversionRate = totalViews > 0 ? (totalApplications / totalViews) * 100 : 0

      // Calculate average fit score
      const fitScores = events
        .filter(e => e.event_type === 'job_match' && e.event_data.fitScore)
        .map(e => e.event_data.fitScore)
      const avgFitScore = fitScores.length > 0 
        ? fitScores.reduce((a, b) => a + b, 0) / fitScores.length 
        : 0

      // Get top candidate sources
      const topCandidateSources = this.extractTopCandidateSources(applications)

      // Calculate time to first application
      const firstApplication = applications.sort((a, b) => 
        new Date(a.applied_at).getTime() - new Date(b.applied_at).getTime()
      )[0]
      const timeToFirstApplication = firstApplication 
        ? (new Date(firstApplication.applied_at).getTime() - startDate.getTime()) / (1000 * 60 * 60) // hours
        : 0

      // Generate application trends
      const applicationTrends = this.generateApplicationTrends(applications, days)

      return {
        jobId,
        totalViews,
        totalApplications,
        avgFitScore: Math.round(avgFitScore * 100) / 100,
        conversionRate: Math.round(conversionRate * 100) / 100,
        topCandidateSources,
        timeToFirstApplication: Math.round(timeToFirstApplication * 100) / 100,
        applicationTrends
      }
    } catch (error) {
      console.error('Error getting job metrics:', error)
      return null
    }
  }

  // Get system metrics
  async getSystemMetrics(days: number = 30): Promise<SystemMetrics | null> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      // Get user counts
      const { data: users, error: usersError } = await this.supabase
        .from('users')
        .select('id, created_at, last_sign_in_at')

      if (usersError) throw usersError

      // Get job counts
      const { data: jobs, error: jobsError } = await this.supabase
        .from('job_postings')
        .select('id, status, created_at')

      if (jobsError) throw jobsError

      // Get application counts
      const { data: applications, error: appsError } = await this.supabase
        .from('job_applications')
        .select('id, applied_at')
        .gte('applied_at', startDate.toISOString())

      if (appsError) throw appsError

      // Get system health data
      const { data: healthData, error: healthError } = await this.supabase
        .from('system_health')
        .select('*')
        .gte('last_check', startDate.toISOString())

      if (healthError) throw healthError

      // Calculate metrics
      const totalUsers = users.length
      const activeUsers = users.filter(u => 
        u.last_sign_in_at && new Date(u.last_sign_in_at) >= startDate
      ).length

      const totalJobs = jobs.length
      const activeJobs = jobs.filter(j => j.status === 'active').length
      const totalApplications = applications.length

      // Calculate average response time
      const responseTimes = healthData
        .filter(h => h.response_time_ms)
        .map(h => h.response_time_ms)
      const avgResponseTime = responseTimes.length > 0 
        ? responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length 
        : 0

      // Calculate system uptime
      const healthyChecks = healthData.filter(h => h.status === 'healthy').length
      const systemUptime = healthData.length > 0 ? (healthyChecks / healthData.length) * 100 : 100

      // Calculate error rate
      const errorChecks = healthData.filter(h => h.status === 'unhealthy').length
      const errorRate = healthData.length > 0 ? (errorChecks / healthData.length) * 100 : 0

      // Calculate revenue (from subscriptions)
      const { data: subscriptions, error: subError } = await this.supabase
        .from('user_subscriptions')
        .select('*')
        .eq('status', 'active')

      if (subError) throw subError

      const revenue = subscriptions.reduce((acc, sub) => {
        // This would need to be calculated based on actual subscription data
        return acc + 0 // Placeholder
      }, 0)

      // Calculate churn rate
      const churnedUsers = users.filter(u => 
        u.last_sign_in_at && new Date(u.last_sign_in_at) < startDate
      ).length
      const churnRate = totalUsers > 0 ? (churnedUsers / totalUsers) * 100 : 0

      return {
        totalUsers,
        activeUsers,
        totalJobs,
        activeJobs,
        totalApplications,
        avgResponseTime: Math.round(avgResponseTime * 100) / 100,
        systemUptime: Math.round(systemUptime * 100) / 100,
        errorRate: Math.round(errorRate * 100) / 100,
        revenue,
        churnRate: Math.round(churnRate * 100) / 100
      }
    } catch (error) {
      console.error('Error getting system metrics:', error)
      return null
    }
  }

  // Helper methods
  private groupEventsBySession(events: any[]): Array<{ startTime: Date; endTime: Date }> {
    const sessions: Array<{ startTime: Date; endTime: Date }> = []
    const sessionMap = new Map<string, Date[]>()

    events.forEach(event => {
      const sessionId = event.session_id || 'default'
      if (!sessionMap.has(sessionId)) {
        sessionMap.set(sessionId, [])
      }
      sessionMap.get(sessionId)!.push(new Date(event.created_at))
    })

    sessionMap.forEach(timestamps => {
      if (timestamps.length > 0) {
        sessions.push({
          startTime: new Date(Math.min(...timestamps.map(t => t.getTime()))),
          endTime: new Date(Math.max(...timestamps.map(t => t.getTime())))
        })
      }
    })

    return sessions
  }

  private extractTopSkills(events: any[]): string[] {
    const skillCounts = new Map<string, number>()

    events.forEach(event => {
      if (event.event_data.skills && Array.isArray(event.event_data.skills)) {
        event.event_data.skills.forEach((skill: string) => {
          skillCounts.set(skill, (skillCounts.get(skill) || 0) + 1)
        })
      }
    })

    return Array.from(skillCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([skill]) => skill)
  }

  private extractPreferredLocations(events: any[]): string[] {
    const locationCounts = new Map<string, number>()

    events.forEach(event => {
      if (event.event_data.location) {
        const location = event.event_data.location
        locationCounts.set(location, (locationCounts.get(location) || 0) + 1)
      }
    })

    return Array.from(locationCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([location]) => location)
  }

  private extractTopCandidateSources(applications: any[]): string[] {
    const sourceCounts = new Map<string, number>()

    applications.forEach(app => {
      const source = app.source || 'unknown'
      sourceCounts.set(source, (sourceCounts.get(source) || 0) + 1)
    })

    return Array.from(sourceCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([source]) => source)
  }

  private generateApplicationTrends(applications: any[], days: number): Array<{ date: string; applications: number; views: number }> {
    const trends: Array<{ date: string; applications: number; views: number }> = []
    const today = new Date()

    for (let i = days - 1; i >= 0; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split('T')[0]

      const dayApplications = applications.filter(app => 
        app.applied_at.startsWith(dateStr)
      ).length

      trends.push({
        date: dateStr,
        applications: dayApplications,
        views: 0 // This would need to be calculated from view events
      })
    }

    return trends
  }

  // Generate analytics report
  async generateAnalyticsReport(type: 'user' | 'job' | 'system', id?: string, days: number = 30): Promise<any> {
    try {
      let metrics

      switch (type) {
        case 'user':
          if (!id) throw new Error('User ID is required for user analytics')
          metrics = await this.getUserMetrics(id, days)
          break
        case 'job':
          if (!id) throw new Error('Job ID is required for job analytics')
          metrics = await this.getJobMetrics(id, days)
          break
        case 'system':
          metrics = await this.getSystemMetrics(days)
          break
        default:
          throw new Error('Invalid analytics type')
      }

      return {
        type,
        id,
        period: `${days} days`,
        generatedAt: new Date().toISOString(),
        metrics
      }
    } catch (error) {
      console.error('Error generating analytics report:', error)
      return null
    }
  }
}

// Export singleton instance
export const advancedAnalytics = new AdvancedAnalytics()

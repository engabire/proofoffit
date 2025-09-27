import { createClient } from '@supabase/supabase-js'

export interface ErrorContext {
  userId?: string
  sessionId?: string
  requestId?: string
  endpoint?: string
  method?: string
  userAgent?: string
  ip?: string
  timestamp: Date
}

export interface ErrorDetails {
  message: string
  stack?: string
  code?: string
  statusCode?: number
  context: ErrorContext
  metadata?: Record<string, any>
}

export class ErrorManager {
  private supabase: any
  private errorQueue: ErrorDetails[] = []
  private maxQueueSize = 100
  private flushInterval = 30000 // 30 seconds

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    // Start error flushing interval
    setInterval(() => {
      this.flushErrors()
    }, this.flushInterval)
  }

  // Log error with context
  public async logError(error: Error, context: Partial<ErrorContext> = {}): Promise<void> {
    const errorDetails: ErrorDetails = {
      message: error.message,
      stack: error.stack,
      code: (error as any).code,
      statusCode: (error as any).statusCode,
      context: {
        timestamp: new Date(),
        ...context
      },
      metadata: {
        name: error.name,
        cause: (error as any).cause
      }
    }

    // Add to queue
    this.errorQueue.push(errorDetails)

    // Flush if queue is full
    if (this.errorQueue.length >= this.maxQueueSize) {
      await this.flushErrors()
    }

    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error logged:', errorDetails)
    }
  }

  // Log API error
  public async logApiError(
    error: Error,
    endpoint: string,
    method: string,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    await this.logError(error, {
      ...context,
      endpoint,
      method
    })
  }

  // Log database error
  public async logDatabaseError(
    error: Error,
    operation: string,
    table?: string,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    await this.logError(error, {
      ...context,
      metadata: {
        operation,
        table,
        ...context.metadata
      }
    })
  }

  // Log authentication error
  public async logAuthError(
    error: Error,
    userId?: string,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    await this.logError(error, {
      ...context,
      userId,
      metadata: {
        type: 'authentication',
        ...context.metadata
      }
    })
  }

  // Log external service error
  public async logExternalServiceError(
    error: Error,
    service: string,
    endpoint?: string,
    context: Partial<ErrorContext> = {}
  ): Promise<void> {
    await this.logError(error, {
      ...context,
      metadata: {
        type: 'external_service',
        service,
        endpoint,
        ...context.metadata
      }
    })
  }

  // Flush errors to database
  private async flushErrors(): Promise<void> {
    if (this.errorQueue.length === 0) return

    const errorsToFlush = [...this.errorQueue]
    this.errorQueue = []

    try {
      const { error } = await this.supabase
        .from('error_logs')
        .insert(errorsToFlush.map(error => ({
          message: error.message,
          stack: error.stack,
          code: error.code,
          status_code: error.statusCode,
          user_id: error.context.userId,
          session_id: error.context.sessionId,
          request_id: error.context.requestId,
          endpoint: error.context.endpoint,
          method: error.context.method,
          user_agent: error.context.userAgent,
          ip: error.context.ip,
          metadata: error.metadata,
          created_at: error.context.timestamp.toISOString()
        })))

      if (error) {
        console.error('Failed to flush errors to database:', error)
        // Re-add errors to queue if flush failed
        this.errorQueue.unshift(...errorsToFlush)
      }
    } catch (flushError) {
      console.error('Error flushing errors:', flushError)
      // Re-add errors to queue if flush failed
      this.errorQueue.unshift(...errorsToFlush)
    }
  }

  // Get error statistics
  public async getErrorStats(days: number = 7): Promise<{
    total: number
    byType: Record<string, number>
    byEndpoint: Record<string, number>
    recent: ErrorDetails[]
  }> {
    try {
      const startDate = new Date()
      startDate.setDate(startDate.getDate() - days)

      const { data: errors, error } = await this.supabase
        .from('error_logs')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false })

      if (error) {
        throw new Error(`Failed to fetch error stats: ${error.message}`)
      }

      const stats = {
        total: errors.length,
        byType: {} as Record<string, number>,
        byEndpoint: {} as Record<string, number>,
        recent: errors.slice(0, 10).map(error => ({
          message: error.message,
          stack: error.stack,
          code: error.code,
          statusCode: error.status_code,
          context: {
            userId: error.user_id,
            sessionId: error.session_id,
            requestId: error.request_id,
            endpoint: error.endpoint,
            method: error.method,
            userAgent: error.user_agent,
            ip: error.ip,
            timestamp: new Date(error.created_at)
          },
          metadata: error.metadata
        }))
      }

      // Calculate statistics
      errors.forEach(error => {
        // Count by type
        const type = error.metadata?.type || 'unknown'
        stats.byType[type] = (stats.byType[type] || 0) + 1

        // Count by endpoint
        if (error.endpoint) {
          stats.byEndpoint[error.endpoint] = (stats.byEndpoint[error.endpoint] || 0) + 1
        }
      })

      return stats
    } catch (error) {
      console.error('Error getting error stats:', error)
      return {
        total: 0,
        byType: {},
        byEndpoint: {},
        recent: []
      }
    }
  }

  // Create error response for API
  public createErrorResponse(
    error: Error,
    statusCode: number = 500,
    context: Partial<ErrorContext> = {}
  ): {
    error: string
    message: string
    code?: string
    requestId?: string
    timestamp: string
  } {
    const requestId = context.requestId || this.generateRequestId()

    // Log the error
    this.logError(error, { ...context, requestId })

    return {
      error: error.name || 'InternalServerError',
      message: error.message,
      code: (error as any).code,
      requestId,
      timestamp: new Date().toISOString()
    }
  }

  // Generate unique request ID
  private generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  // Handle unhandled promise rejections
  public setupGlobalErrorHandlers(): void {
    // Handle unhandled promise rejections
    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason)
      this.logError(new Error(`Unhandled Promise Rejection: ${reason}`), {
        metadata: { type: 'unhandled_rejection', promise: promise.toString() }
      })
    })

    // Handle uncaught exceptions
    process.on('uncaughtException', (error) => {
      console.error('Uncaught Exception:', error)
      this.logError(error, {
        metadata: { type: 'uncaught_exception' }
      })
      
      // Exit process after logging
      setTimeout(() => {
        process.exit(1)
      }, 1000)
    })
  }
}

// Export singleton instance
export const errorManager = new ErrorManager()

// Setup global error handlers
errorManager.setupGlobalErrorHandlers()

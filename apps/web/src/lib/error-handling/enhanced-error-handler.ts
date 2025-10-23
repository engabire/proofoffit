/**
 * Enhanced Error Handling System
 * 
 * Provides comprehensive error handling, logging, and recovery mechanisms
 * for the ProofOfFit application.
 */

export enum ErrorType {
  VALIDATION = 'VALIDATION',
  AUTHENTICATION = 'AUTHENTICATION',
  AUTHORIZATION = 'AUTHORIZATION',
  NOT_FOUND = 'NOT_FOUND',
  RATE_LIMIT = 'RATE_LIMIT',
  EXTERNAL_SERVICE = 'EXTERNAL_SERVICE',
  DATABASE = 'DATABASE',
  NETWORK = 'NETWORK',
  INTERNAL = 'INTERNAL',
  BUSINESS_LOGIC = 'BUSINESS_LOGIC',
}

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export interface ErrorContext {
  userId?: string;
  sessionId?: string;
  requestId?: string;
  endpoint?: string;
  userAgent?: string;
  ipAddress?: string;
  timestamp: Date;
  environment: string;
}

export interface AppError extends Error {
  type: ErrorType;
  severity: ErrorSeverity;
  code: string;
  context: ErrorContext;
  isOperational: boolean;
  retryable: boolean;
  userMessage?: string;
  technicalDetails?: any;
}

export class EnhancedErrorHandler {
  private static instance: EnhancedErrorHandler;
  private errorLog: AppError[] = [];
  private maxLogSize = 1000;

  static getInstance(): EnhancedErrorHandler {
    if (!EnhancedErrorHandler.instance) {
      EnhancedErrorHandler.instance = new EnhancedErrorHandler();
    }
    return EnhancedErrorHandler.instance;
  }

  /**
   * Creates a standardized application error
   */
  createError(
    type: ErrorType,
    severity: ErrorSeverity,
    message: string,
    context: Partial<ErrorContext> = {},
    options: {
      code?: string;
      isOperational?: boolean;
      retryable?: boolean;
      userMessage?: string;
      technicalDetails?: any;
    } = {}
  ): AppError {
    const error = new Error(message) as AppError;
    
    error.type = type;
    error.severity = severity;
    error.code = options.code || `${type}_${Date.now()}`;
    error.context = {
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
      ...context,
    };
    error.isOperational = options.isOperational ?? true;
    error.retryable = options.retryable ?? false;
    error.userMessage = options.userMessage;
    error.technicalDetails = options.technicalDetails;

    return error;
  }

  /**
   * Handles and logs errors
   */
  handleError(error: Error | AppError, context: Partial<ErrorContext> = {}): AppError {
    let appError: AppError;

    if (this.isAppError(error)) {
      appError = error;
    } else {
      // Convert generic error to AppError
      appError = this.createError(
        ErrorType.INTERNAL,
        ErrorSeverity.MEDIUM,
        error.message,
        context,
        {
          isOperational: false,
          retryable: true,
          technicalDetails: {
            originalError: error.name,
            stack: error.stack,
          },
        }
      );
    }

    // Log the error
    this.logError(appError);

    // Send to external monitoring if configured
    this.sendToMonitoring(appError);

    return appError;
  }

  /**
   * Handles API route errors
   */
  handleApiError(
    error: Error | AppError,
    request: any,
    context: Partial<ErrorContext> = {}
  ): Response {
    const appError = this.handleError(error, {
      ...context,
      endpoint: request?.url,
      userAgent: request?.headers?.get?.('user-agent'),
      ipAddress: this.getClientIP(request),
    });

    // Determine appropriate HTTP status code
    const statusCode = this.getHttpStatusCode(appError);

    // Create user-friendly response
    const response = {
      error: {
        type: appError.type,
        code: appError.code,
        message: appError.userMessage || this.getDefaultUserMessage(appError.type),
        timestamp: appError.context.timestamp.toISOString(),
        requestId: appError.context.requestId,
      },
      ...(process.env.NODE_ENV === 'development' && {
        technicalDetails: appError.technicalDetails,
        stack: appError.stack,
      }),
    };

    return new Response(JSON.stringify(response), {
      status: statusCode,
      headers: {
        'Content-Type': 'application/json',
        'X-Error-Type': appError.type,
        'X-Error-Code': appError.code,
      },
    });
  }

  /**
   * Circuit breaker for external services
   */
  private circuitBreakers = new Map<string, {
    failures: number;
    lastFailure: Date;
    state: 'CLOSED' | 'OPEN' | 'HALF_OPEN';
  }>();

  async withCircuitBreaker<T>(
    serviceName: string,
    operation: () => Promise<T>,
    options: {
      failureThreshold?: number;
      timeout?: number;
      resetTimeout?: number;
    } = {}
  ): Promise<T> {
    const {
      failureThreshold = 5,
      timeout = 30000,
      resetTimeout = 60000,
    } = options;

    const breaker = this.circuitBreakers.get(serviceName) || {
      failures: 0,
      lastFailure: new Date(0),
      state: 'CLOSED' as const,
    };

    // Check if circuit is open
    if (breaker.state === 'OPEN') {
      if (Date.now() - breaker.lastFailure.getTime() > resetTimeout) {
        breaker.state = 'HALF_OPEN';
      } else {
        throw this.createError(
          ErrorType.EXTERNAL_SERVICE,
          ErrorSeverity.HIGH,
          `Service ${serviceName} is temporarily unavailable`,
          {},
          {
            code: 'CIRCUIT_BREAKER_OPEN',
            userMessage: 'This service is temporarily unavailable. Please try again later.',
            retryable: true,
          }
        );
      }
    }

    try {
      const result = await Promise.race([
        operation(),
        new Promise<never>((_, reject) =>
          setTimeout(() => reject(new Error('Operation timeout')), timeout)
        ),
      ]);

      // Reset circuit breaker on success
      if (breaker.state === 'HALF_OPEN') {
        breaker.state = 'CLOSED';
        breaker.failures = 0;
      }

      return result;
    } catch (error) {
      breaker.failures++;
      breaker.lastFailure = new Date();

      if (breaker.failures >= failureThreshold) {
        breaker.state = 'OPEN';
      }

      this.circuitBreakers.set(serviceName, breaker);

      throw this.handleError(error as Error, {
        technicalDetails: {
          serviceName,
          circuitBreakerState: breaker.state,
          failureCount: breaker.failures,
        },
      });
    }
  }

  /**
   * Retry mechanism with exponential backoff
   */
  async withRetry<T>(
    operation: () => Promise<T>,
    options: {
      maxRetries?: number;
      baseDelay?: number;
      maxDelay?: number;
      retryable?: (error: Error) => boolean;
    } = {}
  ): Promise<T> {
    const {
      maxRetries = 3,
      baseDelay = 1000,
      maxDelay = 10000,
      retryable = () => true,
    } = options;

    let lastError: Error;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error as Error;

        if (attempt === maxRetries || !retryable(lastError)) {
          break;
        }

        const delay = Math.min(baseDelay * Math.pow(2, attempt), maxDelay);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }

    throw this.handleError(lastError!, {
      technicalDetails: {
        maxRetries,
        attempts: maxRetries + 1,
      },
    });
  }

  /**
   * Logs error to internal log
   */
  private logError(error: AppError): void {
    this.errorLog.push(error);

    // Maintain log size
    if (this.errorLog.length > this.maxLogSize) {
      this.errorLog = this.errorLog.slice(-this.maxLogSize);
    }

    // Log to console based on severity
    const logLevel = this.getLogLevel(error.severity);
    console[logLevel](`[${error.type}] ${error.message}`, {
      code: error.code,
      severity: error.severity,
      context: error.context,
      technicalDetails: error.technicalDetails,
    });
  }

  /**
   * Sends error to external monitoring service
   */
  private sendToMonitoring(error: AppError): void {
    // Only send high/critical errors to external monitoring
    if (error.severity === ErrorSeverity.HIGH || error.severity === ErrorSeverity.CRITICAL) {
      // Here you would integrate with services like Sentry, DataDog, etc.
      // For now, we'll just log it
      console.warn('Sending to external monitoring:', {
        type: error.type,
        severity: error.severity,
        code: error.code,
        message: error.message,
      });
    }
  }

  /**
   * Gets recent errors for monitoring
   */
  getRecentErrors(limit: number = 50): AppError[] {
    return this.errorLog.slice(-limit);
  }

  /**
   * Gets error statistics
   */
  getErrorStats(): {
    total: number;
    byType: Record<ErrorType, number>;
    bySeverity: Record<ErrorSeverity, number>;
    recent: number;
  } {
    const now = new Date();
    const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000);

    const byType = {} as Record<ErrorType, number>;
    const bySeverity = {} as Record<ErrorSeverity, number>;

    for (const error of this.errorLog) {
      byType[error.type] = (byType[error.type] || 0) + 1;
      bySeverity[error.severity] = (bySeverity[error.severity] || 0) + 1;
    }

    const recent = this.errorLog.filter(
      error => error.context.timestamp > oneHourAgo
    ).length;

    return {
      total: this.errorLog.length,
      byType,
      bySeverity,
      recent,
    };
  }

  // Helper methods
  private isAppError(error: any): error is AppError {
    return error && typeof error.type === 'string' && typeof error.severity === 'string';
  }

  private getHttpStatusCode(error: AppError): number {
    const statusMap = {
      [ErrorType.VALIDATION]: 400,
      [ErrorType.AUTHENTICATION]: 401,
      [ErrorType.AUTHORIZATION]: 403,
      [ErrorType.NOT_FOUND]: 404,
      [ErrorType.RATE_LIMIT]: 429,
      [ErrorType.EXTERNAL_SERVICE]: 502,
      [ErrorType.DATABASE]: 503,
      [ErrorType.NETWORK]: 503,
      [ErrorType.INTERNAL]: 500,
      [ErrorType.BUSINESS_LOGIC]: 400,
    };

    return statusMap[error.type] || 500;
  }

  private getDefaultUserMessage(type: ErrorType): string {
    const messages = {
      [ErrorType.VALIDATION]: 'The request contains invalid data',
      [ErrorType.AUTHENTICATION]: 'Authentication required',
      [ErrorType.AUTHORIZATION]: 'Access denied',
      [ErrorType.NOT_FOUND]: 'Resource not found',
      [ErrorType.RATE_LIMIT]: 'Too many requests, please try again later',
      [ErrorType.EXTERNAL_SERVICE]: 'External service temporarily unavailable',
      [ErrorType.DATABASE]: 'Database temporarily unavailable',
      [ErrorType.NETWORK]: 'Network error, please try again',
      [ErrorType.INTERNAL]: 'An internal error occurred',
      [ErrorType.BUSINESS_LOGIC]: 'Invalid operation',
    };

    return messages[type] || 'An error occurred';
  }

  private getLogLevel(severity: ErrorSeverity): 'log' | 'warn' | 'error' {
    switch (severity) {
      case ErrorSeverity.LOW:
        return 'log';
      case ErrorSeverity.MEDIUM:
        return 'warn';
      case ErrorSeverity.HIGH:
      case ErrorSeverity.CRITICAL:
        return 'error';
      default:
        return 'log';
    }
  }

  private getClientIP(request: any): string {
    return (
      request?.headers?.get?.('x-forwarded-for')?.split(',')[0] ||
      request?.headers?.get?.('x-real-ip') ||
      request?.ip ||
      'unknown'
    );
  }
}

// Export singleton instance
export const errorHandler = EnhancedErrorHandler.getInstance();

// Export convenience functions
export function createError(
  type: ErrorType,
  severity: ErrorSeverity,
  message: string,
  context?: Partial<ErrorContext>,
  options?: any
): AppError {
  return errorHandler.createError(type, severity, message, context, options);
}

export function handleError(error: Error | AppError, context?: Partial<ErrorContext>): AppError {
  return errorHandler.handleError(error, context);
}

export function handleApiError(error: Error | AppError, request: any, context?: Partial<ErrorContext>): Response {
  return errorHandler.handleApiError(error, request, context);
}

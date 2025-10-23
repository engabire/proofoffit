/**
 * Common API Utilities
 * 
 * Provides shared utilities for API routes to reduce code duplication
 * and ensure consistent error handling and response formatting.
 */

import { NextRequest, NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { env, isSupabaseConfigured } from '@/lib/env';
import { errorHandler, ErrorType, ErrorSeverity } from '@/lib/error-handling/enhanced-error-handler';

export interface ApiResponse<T = any> {
  data?: T;
  error?: string;
  message?: string;
  timestamp: string;
  requestId?: string;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  offset?: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

/**
 * Creates a standardized API response
 */
export function createApiResponse<T>(
  data?: T,
  error?: string,
  status: number = 200,
  options: {
    message?: string;
    requestId?: string;
    headers?: Record<string, string>;
  } = {}
): NextResponse<ApiResponse<T>> {
  const response: ApiResponse<T> = {
    timestamp: new Date().toISOString(),
    ...(data !== undefined && { data }),
    ...(error && { error }),
    ...(options.message && { message: options.message }),
    ...(options.requestId && { requestId: options.requestId }),
  };

  return NextResponse.json(response, {
    status,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      ...options.headers,
    },
  });
}

/**
 * Creates a paginated API response
 */
export function createPaginatedResponse<T>(
  data: T[],
  total: number,
  pagination: PaginationParams,
  options: {
    message?: string;
    requestId?: string;
  } = {}
): NextResponse<PaginatedResponse<T>> {
  const page = pagination.page || 1;
  const limit = pagination.limit || 10;
  const totalPages = Math.ceil(total / limit);

  const response: PaginatedResponse<T> = {
    data,
    timestamp: new Date().toISOString(),
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
    ...(options.message && { message: options.message }),
    ...(options.requestId && { requestId: options.requestId }),
  };

  return NextResponse.json(response, {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
    },
  });
}

/**
 * Handles API errors consistently
 */
export function handleApiError(
  error: Error | unknown,
  request: NextRequest,
  context: {
    endpoint?: string;
    userId?: string;
    operation?: string;
  } = {}
): NextResponse<ApiResponse> {
  return errorHandler.handleApiError(
    error as Error,
    request,
    {
      endpoint: context.endpoint,
      userId: context.userId,
      requestId: generateRequestId(),
    }
  );
}

/**
 * Validates request body and returns parsed JSON
 */
export async function validateRequestBody<T>(
  request: NextRequest,
  schema?: (data: any) => T
): Promise<{ data: T; error?: NextResponse }> {
  try {
    const body = await request.json();
    
    if (schema) {
      const validatedData = schema(body);
      return { data: validatedData };
    }
    
    return { data: body };
  } catch (error) {
    const errorResponse = createApiResponse(
      undefined,
      'Invalid request payload',
      400
    );
    return { data: null as any, error: errorResponse };
  }
}

/**
 * Validates query parameters
 */
export function validateQueryParams(
  request: NextRequest,
  validParams: string[]
): { params: URLSearchParams; error?: NextResponse } {
  const url = new URL(request.url);
  const params = url.searchParams;
  
  // Check for invalid parameters
  const invalidParams = Array.from(params.keys()).filter(
    key => !validParams.includes(key)
  );
  
  if (invalidParams.length > 0) {
    const errorResponse = createApiResponse(
      undefined,
      `Invalid query parameters: ${invalidParams.join(', ')}`,
      400
    );
    return { params, error: errorResponse };
  }
  
  return { params };
}

/**
 * Gets authenticated user from request
 */
export async function getAuthenticatedUser(request: NextRequest): Promise<{
  user: any;
  session: any;
  error?: NextResponse;
}> {
  if (!isSupabaseConfigured()) {
    const errorResponse = createApiResponse(
      undefined,
      'Authentication service not configured',
      503
    );
    return { user: null, session: null, error: errorResponse };
  }

  try {
    const supabase = createRouteHandlerClient({ cookies });
    const [{ data: sessionData }, { data: userData }] = await Promise.all([
      supabase.auth.getSession(),
      supabase.auth.getUser(),
    ]);

    const session = sessionData.session;
    const user = userData.user;

    if (!session || !user) {
      const errorResponse = createApiResponse(
        undefined,
        'Authentication required',
        401
      );
      return { user: null, session: null, error: errorResponse };
    }

    return { user, session, error: undefined };
  } catch (error) {
    const errorResponse = createApiResponse(
      undefined,
      'Authentication error',
      500
    );
    return { user: null, session: null, error: errorResponse };
  }
}

/**
 * Validates user permissions
 */
export function validateUserPermission(
  user: any,
  requiredRole?: string,
  requiredPermissions?: string[]
): { isValid: boolean; error?: NextResponse } {
  if (requiredRole && user.user_metadata?.role !== requiredRole) {
    const errorResponse = createApiResponse(
      undefined,
      'Insufficient permissions',
      403
    );
    return { isValid: false, error: errorResponse };
  }

  if (requiredPermissions) {
    const userPermissions = user.user_metadata?.permissions || [];
    const hasAllPermissions = requiredPermissions.every(permission =>
      userPermissions.includes(permission)
    );

    if (!hasAllPermissions) {
      const errorResponse = createApiResponse(
        undefined,
        'Missing required permissions',
        403
      );
      return { isValid: false, error: errorResponse };
    }
  }

  return { isValid: true };
}

/**
 * Generates a unique request ID
 */
export function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Extracts pagination parameters from request
 */
export function extractPaginationParams(request: NextRequest): PaginationParams {
  const url = new URL(request.url);
  const page = parseInt(url.searchParams.get('page') || '1');
  const limit = Math.min(parseInt(url.searchParams.get('limit') || '10'), 100); // Max 100 items per page
  const offset = (page - 1) * limit;

  return { page, limit, offset };
}

/**
 * Creates a health check response
 */
export function createHealthResponse(
  status: 'healthy' | 'degraded' | 'unhealthy',
  details: Record<string, any> = {},
  responseTime?: number
): NextResponse {
  const healthData = {
    status,
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    ...(responseTime && { response_time_ms: responseTime }),
    ...details,
  };

  const httpStatus = status === 'healthy' ? 200 : status === 'degraded' ? 200 : 503;

  return NextResponse.json(healthData, {
    status: httpStatus,
    headers: {
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
    },
  });
}

/**
 * Rate limiting helper
 */
export class RateLimiter {
  private static requests = new Map<string, { count: number; resetTime: number }>();

  static checkLimit(
    identifier: string,
    limit: number = 100,
    windowMs: number = 60000
  ): { allowed: boolean; remaining: number; resetTime: number } {
    const now = Date.now();
    const key = identifier;
    const current = this.requests.get(key);

    if (!current || now > current.resetTime) {
      // Reset or create new window
      this.requests.set(key, {
        count: 1,
        resetTime: now + windowMs,
      });
      return {
        allowed: true,
        remaining: limit - 1,
        resetTime: now + windowMs,
      };
    }

    if (current.count >= limit) {
      return {
        allowed: false,
        remaining: 0,
        resetTime: current.resetTime,
      };
    }

    current.count++;
    return {
      allowed: true,
      remaining: limit - current.count,
      resetTime: current.resetTime,
    };
  }
}

/**
 * API route wrapper with common functionality
 */
export function withApiWrapper<T extends any[]>(
  handler: (request: NextRequest, ...args: T) => Promise<NextResponse>,
  options: {
    requireAuth?: boolean;
    requiredRole?: string;
    requiredPermissions?: string[];
    rateLimit?: { limit: number; windowMs: number };
    validateBody?: (data: any) => any;
  } = {}
) {
  return async (request: NextRequest, ...args: T): Promise<NextResponse> => {
    const startTime = Date.now();
    const requestId = generateRequestId();

    try {
      // Rate limiting
      if (options.rateLimit) {
        const clientIP = request.headers.get('x-forwarded-for') || 'unknown';
        const rateLimit = RateLimiter.checkLimit(
          clientIP,
          options.rateLimit.limit,
          options.rateLimit.windowMs
        );

        if (!rateLimit.allowed) {
          return createApiResponse(
            undefined,
            'Rate limit exceeded',
            429,
            {
              headers: {
                'X-RateLimit-Limit': options.rateLimit.limit.toString(),
                'X-RateLimit-Remaining': '0',
                'X-RateLimit-Reset': rateLimit.resetTime.toString(),
              },
            }
          );
        }
      }

      // Authentication
      if (options.requireAuth) {
        const { user, session, error } = await getAuthenticatedUser(request);
        if (error) return error;

        // Permission validation
        if (options.requiredRole || options.requiredPermissions) {
          const { isValid, error: permError } = validateUserPermission(
            user,
            options.requiredRole,
            options.requiredPermissions
          );
          if (!isValid && permError) return permError;
        }
      }

      // Body validation
      if (options.validateBody && request.method !== 'GET') {
        const { data, error } = await validateRequestBody(request, options.validateBody);
        if (error) return error;
      }

      // Call the actual handler
      const response = await handler(request, ...args);

      // Add performance headers
      response.headers.set('X-Response-Time', `${Date.now() - startTime}ms`);
      response.headers.set('X-Request-ID', requestId);

      return response;
    } catch (error) {
      return handleApiError(error, request, {
        requestId,
        operation: handler.name,
      });
    }
  };
}

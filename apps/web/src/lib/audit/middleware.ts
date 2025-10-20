import { NextRequest, NextResponse } from 'next/server';
import { auditLogger, AUDIT_ACTIONS } from './audit-log';
import { rateLimiter, RATE_LIMIT_CONFIGS, generateRateLimitKey } from './rate-limit';

/**
 * Extract client information from request
 */
function extractClientInfo(req: NextRequest) {
  return {
    ipAddress: req.headers.get('x-forwarded-for') || req.headers.get('x-real-ip') || req.headers.get('x-client-ip') || 'unknown',
    userAgent: req.headers.get('user-agent') || 'unknown',
  };
}

/**
 * Extract user ID from request (from auth headers, cookies, etc.)
 */
function extractUserId(req: NextRequest): string | null {
  // Try to get user ID from various sources
  const authHeader = req.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    // In a real implementation, you'd decode the JWT token here
    // For now, we'll return null
    return null;
  }

  // Check for user ID in cookies
  const userIdCookie = req.cookies.get('userId');
  if (userIdCookie) {
    return userIdCookie.value;
  }

  return null;
}

/**
 * Determine the appropriate rate limit configuration based on the route
 */
function getRateLimitConfig(pathname: string): typeof RATE_LIMIT_CONFIGS[keyof typeof RATE_LIMIT_CONFIGS] {
  // Authentication routes
  if (pathname.startsWith('/api/auth/')) {
    return RATE_LIMIT_CONFIGS.AUTH;
  }
  
  // Upload routes
  if (pathname.includes('/upload') || pathname.includes('/file')) {
    return RATE_LIMIT_CONFIGS.UPLOAD;
  }
  
  // Admin routes
  if (pathname.startsWith('/api/admin/')) {
    return RATE_LIMIT_CONFIGS.STRICT;
  }
  
  // Default API rate limit
  if (pathname.startsWith('/api/')) {
    return RATE_LIMIT_CONFIGS.API;
  }
  
  // No rate limiting for other routes
  return RATE_LIMIT_CONFIGS.API;
}

/**
 * Log API request to audit system
 */
function logApiRequest(req: NextRequest, response: NextResponse, userId: string | null) {
  const { ipAddress, userAgent } = extractClientInfo(req);
  const method = req.method;
  const pathname = req.nextUrl.pathname;
  
  // Determine action based on method and path
  let action: string;
  let resource: string;
  
  if (pathname.startsWith('/api/auth/')) {
    if (pathname.includes('/login')) {
      action = AUDIT_ACTIONS.USER_LOGIN;
    } else if (pathname.includes('/logout')) {
      action = AUDIT_ACTIONS.USER_LOGOUT;
    } else if (pathname.includes('/signup')) {
      action = AUDIT_ACTIONS.USER_SIGNUP;
    } else {
      action = 'AUTH_REQUEST';
    }
    resource = 'auth';
  } else if (pathname.startsWith('/api/profile/')) {
    if (method === 'POST') {
      action = AUDIT_ACTIONS.PROFILE_CREATE;
    } else if (method === 'PUT' || method === 'PATCH') {
      action = AUDIT_ACTIONS.PROFILE_UPDATE;
    } else if (method === 'DELETE') {
      action = AUDIT_ACTIONS.PROFILE_DELETE;
    } else {
      action = 'PROFILE_REQUEST';
    }
    resource = 'profile';
  } else if (pathname.startsWith('/api/jobs/')) {
    if (pathname.includes('/save')) {
      action = AUDIT_ACTIONS.JOB_SAVE;
    } else if (pathname.includes('/unsave')) {
      action = AUDIT_ACTIONS.JOB_UNSAVE;
    } else {
      action = 'JOB_REQUEST';
    }
    resource = 'job';
  } else if (pathname.startsWith('/api/applications/')) {
    if (method === 'POST') {
      action = AUDIT_ACTIONS.APPLICATION_CREATE;
    } else if (method === 'PUT' || method === 'PATCH') {
      action = AUDIT_ACTIONS.APPLICATION_UPDATE;
    } else if (method === 'DELETE') {
      action = AUDIT_ACTIONS.APPLICATION_WITHDRAW;
    } else {
      action = 'APPLICATION_REQUEST';
    }
    resource = 'application';
  } else if (pathname.startsWith('/api/admin/')) {
    action = AUDIT_ACTIONS.ADMIN_ACTION;
    resource = 'admin';
  } else {
    action = `${method}_REQUEST`;
    resource = 'api';
  }

  // Extract resource ID from path if available
  const pathSegments = pathname.split('/');
  const resourceId = pathSegments[pathSegments.length - 1] || null;

  // Create audit log entry
  auditLogger.createEntry({
    userId,
    action,
    resource,
    resourceId,
    details: {
      method,
      pathname,
      statusCode: response.status,
      responseTime: Date.now(), // This would be calculated in real implementation
    },
    ipAddress,
    userAgent,
  });
}

/**
 * Apply rate limiting to request
 */
function applyRateLimit(req: NextRequest): NextResponse | null {
  const config = getRateLimitConfig(req.nextUrl.pathname);
  const key = generateRateLimitKey(req, config);
  const { allowed, info } = rateLimiter.checkLimit(key, config);

  if (!allowed) {
    return NextResponse.json(
      {
        error: 'Too many requests',
        retryAfter: info.retryAfter?.toISOString(),
      },
      {
        status: 429,
        headers: {
          'X-RateLimit-Limit': info.limit.toString(),
          'X-RateLimit-Remaining': info.remaining.toString(),
          'X-RateLimit-Reset': Math.ceil(info.reset.getTime() / 1000).toString(),
        },
      }
    );
  }

  return null;
}

/**
 * Main audit middleware function
 */
export function auditMiddleware(req: NextRequest): NextResponse | null {
  // Only apply to API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return null;
  }

  // Apply rate limiting
  const rateLimitResponse = applyRateLimit(req);
  if (rateLimitResponse) {
    return rateLimitResponse;
  }

  // Extract user information
  const userId = extractUserId(req);

  // For now, we'll return null to continue processing
  // In a real implementation, you'd wrap the response to log it
  return null;
}

/**
 * Log response after processing
 */
export function logResponse(req: NextRequest, response: NextResponse) {
  // Only log API routes
  if (!req.nextUrl.pathname.startsWith('/api/')) {
    return;
  }

  const userId = extractUserId(req);
  logApiRequest(req, response, userId);
}

/**
 * Create a wrapper for API route handlers that includes audit logging
 */
export function withAuditLogging(handler: Function) {
  return async function (req: NextRequest, ...args: any[]) {
    // Apply rate limiting
    const rateLimitResponse = applyRateLimit(req);
    if (rateLimitResponse) {
      return rateLimitResponse;
    }

    // Call the original handler
    const response = await handler(req, ...args);

    // Log the response
    if (response instanceof NextResponse) {
      logResponse(req, response);
    }

    return response;
  };
}

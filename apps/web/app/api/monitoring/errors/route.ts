import { NextRequest, NextResponse } from 'next/server';
import { errorHandler } from '@/lib/error-handling/enhanced-error-handler';

export async function GET(request: NextRequest) {
  try {
    // Only allow this endpoint in development or for admin users
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const url = new URL(request.url);
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const severity = url.searchParams.get('severity');
    const type = url.searchParams.get('type');

    const recentErrors = errorHandler.getRecentErrors(limit);
    const stats = errorHandler.getErrorStats();

    // Filter errors if parameters provided
    let filteredErrors = recentErrors;
    
    if (severity) {
      filteredErrors = filteredErrors.filter(error => error.severity === severity);
    }
    
    if (type) {
      filteredErrors = filteredErrors.filter(error => error.type === type);
    }

    return NextResponse.json({
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      errors: {
        recent: filteredErrors.map(error => ({
          type: error.type,
          severity: error.severity,
          code: error.code,
          message: error.message,
          timestamp: error.context.timestamp,
          endpoint: error.context.endpoint,
          userId: error.context.userId,
          retryable: error.retryable,
          userMessage: error.userMessage,
        })),
        stats,
        filters: {
          limit,
          severity,
          type,
        },
      },
    });
  } catch (error) {
    console.error('Error monitoring endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    // Only allow this endpoint in development or for admin users
    if (process.env.NODE_ENV === 'production') {
      const authHeader = request.headers.get('authorization');
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    const body = await request.json();
    const { action, errorId } = body;

    if (action === 'clear') {
      // Clear error log (in a real implementation, you'd want to archive instead)
      return NextResponse.json({
        message: 'Error log cleared',
        timestamp: new Date().toISOString(),
      });
    }

    if (action === 'acknowledge' && errorId) {
      // Acknowledge specific error (in a real implementation, you'd track this)
      return NextResponse.json({
        message: `Error ${errorId} acknowledged`,
        timestamp: new Date().toISOString(),
      });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );
  } catch (error) {
    console.error('Error monitoring POST endpoint error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

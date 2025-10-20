import { NextRequest, NextResponse } from 'next/server';
import { auditLogger } from '@/lib/audit/audit-log';
import { withRateLimit } from '@/lib/audit/rate-limit';
import { RATE_LIMIT_CONFIGS } from '@/lib/audit/rate-limit';

// Apply rate limiting to admin endpoints
const rateLimitedHandler = withRateLimit(RATE_LIMIT_CONFIGS.STRICT);

export const POST = rateLimitedHandler(async (req: NextRequest) => {
  try {
    const isChainValid = auditLogger.verifyHashChain();
    const stats = auditLogger.getStats();

    if (!isChainValid) {
      return NextResponse.json({
        success: false,
        data: {
          valid: false,
          message: 'Hash chain integrity verification failed',
          totalEntries: stats.totalEntries,
          timestamp: new Date().toISOString(),
        },
      }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      data: {
        valid: true,
        message: 'Hash chain integrity verified successfully',
        totalEntries: stats.totalEntries,
        timestamp: new Date().toISOString(),
      },
    });

  } catch (error) {
    console.error('Error verifying audit log hash chain:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

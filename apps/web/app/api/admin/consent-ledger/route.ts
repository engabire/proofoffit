import { NextRequest, NextResponse } from 'next/server';
import { consentLedger } from '@/lib/audit/consent-ledger';
import { withRateLimit } from '@/lib/audit/rate-limit';
import { RATE_LIMIT_CONFIGS } from '@/lib/audit/rate-limit';

// Apply rate limiting to admin endpoints
const rateLimitedHandler = withRateLimit(RATE_LIMIT_CONFIGS.STRICT);

export const GET = rateLimitedHandler(async (req: NextRequest) => {
  try {
    const { searchParams } = new URL(req.url);
    
    // Parse query parameters
    const userId = searchParams.get('userId') || undefined;
    const packageId = searchParams.get('packageId') || undefined;
    const consentId = searchParams.get('consentId') || undefined;
    const action = searchParams.get('action') || undefined;
    const startDate = searchParams.get('startDate') ? new Date(searchParams.get('startDate')!) : undefined;
    const endDate = searchParams.get('endDate') ? new Date(searchParams.get('endDate')!) : undefined;
    const limit = searchParams.get('limit') ? parseInt(searchParams.get('limit')!) : undefined;

    // Validate parameters
    if (limit && (limit < 1 || limit > 1000)) {
      return NextResponse.json(
        { error: 'Limit must be between 1 and 1000' },
        { status: 400 }
      );
    }

    if (startDate && isNaN(startDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid startDate format' },
        { status: 400 }
      );
    }

    if (endDate && isNaN(endDate.getTime())) {
      return NextResponse.json(
        { error: 'Invalid endDate format' },
        { status: 400 }
      );
    }

    // Get filtered consent ledger entries
    const entries = consentLedger.getEntries({
      userId,
      packageId,
      consentId,
      action,
      startDate,
      endDate,
      limit,
    });

    return NextResponse.json({
      success: true,
      data: {
        entries,
        count: entries.length,
        filters: {
          userId,
          packageId,
          consentId,
          action,
          startDate: startDate?.toISOString(),
          endDate: endDate?.toISOString(),
          limit,
        },
      },
    });

  } catch (error) {
    console.error('Error fetching consent ledger entries:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
});

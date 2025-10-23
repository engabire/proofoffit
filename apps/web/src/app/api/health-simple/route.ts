import { NextRequest } from 'next/server';
import { createHealthResponse, withApiWrapper } from '@/lib/api/api-utils';

/**
 * Simple health endpoint that doesn't depend on database tables
 * Use this as a temporary fix while the system_health table is being created
 */
async function healthCheck(req: NextRequest) {
  const startTime = Date.now();
  
  // Basic health check without database dependency
  const healthData = {
    services: {
      system: {
        status: 'healthy',
        message: 'Basic health check passed'
      }
    },
    uptime: process.uptime(),
    memory: {
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024),
      external: Math.round(process.memoryUsage().external / 1024 / 1024)
    }
  };
  
  return createHealthResponse('healthy', healthData, Date.now() - startTime);
}

export const GET = withApiWrapper(healthCheck);

export const dynamic = 'force-dynamic'

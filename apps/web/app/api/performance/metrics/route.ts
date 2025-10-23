import { NextRequest, NextResponse } from 'next/server';

// Mock performance metrics - in production, these would come from monitoring systems
export async function GET(request: NextRequest) {
  try {
    // Simulate performance metrics
    const metrics = {
      responseTime: Math.floor(Math.random() * 300) + 100, // 100-400ms
      databaseQueries: Math.floor(Math.random() * 50) + 20, // 20-70 queries/min
      cacheHitRate: Math.floor(Math.random() * 20) + 80, // 80-100%
      errorRate: Math.floor(Math.random() * 3), // 0-3%
      throughput: Math.floor(Math.random() * 500) + 800, // 800-1300 req/min
      memoryUsage: Math.floor(Math.random() * 20) + 60, // 60-80%
    };

    // Add some realistic variation based on time of day
    const hour = new Date().getHours();
    if (hour >= 9 && hour <= 17) {
      // Business hours - higher load
      metrics.throughput += 200;
      metrics.databaseQueries += 30;
      metrics.responseTime += 50;
    }

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching performance metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch performance metrics' },
      { status: 500 }
    );
  }
}

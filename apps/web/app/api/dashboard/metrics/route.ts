import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // In production, this would fetch real data from the database
    // For now, we'll return mock data with some realistic variation
    
    const metrics = {
      totalApplications: Math.floor(Math.random() * 20) + 15, // 15-35
      activeJobs: Math.floor(Math.random() * 100) + 100, // 100-200
      fitScore: Math.floor(Math.random() * 20) + 80, // 80-100
      interviewsScheduled: Math.floor(Math.random() * 8) + 2, // 2-10
      profileCompleteness: Math.floor(Math.random() * 20) + 80, // 80-100
      weeklyApplications: Math.floor(Math.random() * 10) + 3, // 3-13
      responseRate: Math.floor(Math.random() * 30) + 50, // 50-80
      averageResponseTime: Math.random() * 3 + 1, // 1-4 days
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching dashboard metrics:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard metrics' },
      { status: 500 }
    );
  }
}

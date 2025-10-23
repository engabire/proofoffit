import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock recent activity data
    const activities = [
      {
        id: '1',
        type: 'application',
        title: 'Applied to Senior Developer at TechCorp',
        description: 'Your application was submitted successfully',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: '2',
        type: 'interview',
        title: 'Interview scheduled with InnovateLabs',
        description: 'Technical interview scheduled for tomorrow at 2 PM',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        status: 'info',
      },
      {
        id: '3',
        type: 'message',
        title: 'New message from recruiter',
        description: 'Sarah from TalentCo sent you a message',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        status: 'pending',
      },
      {
        id: '4',
        type: 'profile_update',
        title: 'Profile updated',
        description: 'You added new skills to your profile',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        status: 'success',
      },
      {
        id: '5',
        type: 'application',
        title: 'Application status updated',
        description: 'Your application at StartupXYZ moved to review stage',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
        status: 'info',
      },
    ];

    return NextResponse.json(activities);
  } catch (error) {
    console.error('Error fetching dashboard activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard activity' },
      { status: 500 }
    );
  }
}

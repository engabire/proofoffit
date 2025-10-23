import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock job matches data
    const matches = [
      {
        id: '1',
        title: 'Senior Full Stack Developer',
        company: 'TechCorp',
        fitScore: 94,
        location: 'San Francisco, CA',
        salary: '$120k - $150k',
        postedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
      },
      {
        id: '2',
        title: 'Lead Frontend Engineer',
        company: 'InnovateLabs',
        fitScore: 89,
        location: 'Remote',
        salary: '$110k - $140k',
        postedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'applied',
      },
      {
        id: '3',
        title: 'React Developer',
        company: 'StartupXYZ',
        fitScore: 76,
        location: 'New York, NY',
        salary: '$90k - $120k',
        postedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
      },
      {
        id: '4',
        title: 'Full Stack Engineer',
        company: 'DataFlow Inc',
        fitScore: 82,
        location: 'Austin, TX',
        salary: '$100k - $130k',
        postedDate: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'interview',
      },
      {
        id: '5',
        title: 'Senior React Developer',
        company: 'CloudTech',
        fitScore: 91,
        location: 'Seattle, WA',
        salary: '$115k - $145k',
        postedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        status: 'new',
      },
    ];

    return NextResponse.json(matches);
  } catch (error) {
    console.error('Error fetching dashboard matches:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard matches' },
      { status: 500 }
    );
  }
}

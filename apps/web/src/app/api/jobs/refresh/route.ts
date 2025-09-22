import { NextRequest, NextResponse } from 'next/server'
import { jobFeedManager } from '@/lib/job-feeds'
import { prisma } from '@/lib/db'

export async function POST(req: NextRequest) {
  try {
    // This could be protected with admin authentication
    const authorization = req.headers.get('authorization')

    // Simple API key check (in production, use proper authentication)
    if (authorization !== `Bearer ${process.env.ADMIN_API_KEY}`) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    
    console.log('Starting job feed refresh...')
    await jobFeedManager.refreshJobFeeds()
    
    return NextResponse.json({
      message: 'Job feeds refreshed successfully',
      timestamp: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error refreshing job feeds:', error)
    return NextResponse.json(
      { error: 'Failed to refresh job feeds' },
      { status: 500 }
    )
  }
}

// GET endpoint to check job feed status
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const source = searchParams.get('source')
    
    // Get job counts by source
    const jobCounts = await prisma.job.groupBy({
      by: ['source'],
      _count: {
        id: true
      },
      orderBy: {
        _count: {
          id: 'desc'
        }
      }
    })

    const totalJobs = jobCounts.reduce(
      (sum: number, { _count }: { _count: { id: number } }) => sum + _count.id,
      0
    )
    
    return NextResponse.json({
      totalJobs,
      sources: jobCounts.map(group => ({
        source: group.source,
        count: group._count.id
      })),
      lastUpdated: new Date().toISOString()
    })
    
  } catch (error) {
    console.error('Error getting job feed status:', error)
    return NextResponse.json(
      { error: 'Failed to get job feed status' },
      { status: 500 }
    )
  }
}

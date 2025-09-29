import { NextRequest, NextResponse } from 'next/server'
import { applicationAutomation } from '@/lib/application-automation/auto-apply'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')
    const limit = parseInt(searchParams.get('limit') || '50')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get application history
    const applications = await applicationAutomation.getApplicationHistory(userId, limit)

    // Get application statistics
    const stats = await applicationAutomation.getApplicationStats(userId)

    return NextResponse.json({
      applications,
      stats,
      total: applications.length
    })

  } catch (error: any) {
    console.error('Application history error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch application history' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { applicationId, status, source = 'manual' } = body

    if (!applicationId || !status) {
      return NextResponse.json(
        { error: 'Application ID and status are required' },
        { status: 400 }
      )
    }

    const success = await applicationAutomation.updateApplicationStatus(applicationId, status, source)

    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update application status' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Application status updated successfully'
    })

  } catch (error: any) {
    console.error('Application status update error:', error)
    return NextResponse.json(
      { error: 'Failed to update application status' },
      { status: 500 }
    )
  }
}

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const filter = searchParams.get('filter') || 'all'
    const limit = parseInt(searchParams.get('limit') || '50')

    // Mock notifications data
    const notifications = [
      {
        id: '1',
        type: 'warning',
        title: 'WIP Limit Exceeded',
        message: 'Current WIP (8) exceeds limit (6). Consider finishing items before starting new ones.',
        timestamp: new Date().toISOString(),
        priority: 'high',
        category: 'wip',
        actionable: true,
        actionUrl: '/agile-cockpit',
        actionText: 'Review WIP',
        dismissed: false
      },
      {
        id: '2',
        type: 'warning',
        title: 'Velocity Declining',
        message: 'Team velocity (8.5) is below target (10) and declining. Review sprint planning.',
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
        priority: 'medium',
        category: 'velocity',
        actionable: true,
        actionUrl: '/agile-cockpit/velocity',
        actionText: 'Analyze Velocity',
        dismissed: false
      },
      {
        id: '3',
        type: 'error',
        title: 'Cycle Time Too High',
        message: 'Average cycle time (3.2 days) is significantly above target (2.0 days).',
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
        priority: 'high',
        category: 'cycle-time',
        actionable: true,
        actionUrl: '/agile-cockpit/cycle-time',
        actionText: 'Review Process',
        dismissed: false
      },
      {
        id: '4',
        type: 'warning',
        title: 'Blocked Items Detected',
        message: '2 items have been blocked for more than 24 hours. Immediate attention required.',
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
        priority: 'critical',
        category: 'blocked',
        actionable: true,
        actionUrl: '/agile-cockpit/blocked',
        actionText: 'Resolve Blockers',
        dismissed: false
      },
      {
        id: '5',
        type: 'success',
        title: 'Sprint Goal Achieved',
        message: 'Great job! The team has successfully completed the sprint goal with 2 days to spare.',
        timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
        priority: 'low',
        category: 'velocity',
        actionable: false,
        dismissed: false
      }
    ]

    // Apply filters
    let filteredNotifications = notifications
    if (filter !== 'all') {
      filteredNotifications = notifications.filter(notification => {
        switch (filter) {
          case 'unread': return !notification.dismissed
          case 'critical': return notification.priority === 'critical'
          case 'wip': return notification.category === 'wip'
          case 'velocity': return notification.category === 'velocity'
          case 'blocked': return notification.category === 'blocked'
          default: return true
        }
      })
    }

    // Apply limit
    filteredNotifications = filteredNotifications.slice(0, limit)

    return NextResponse.json({
      success: true,
      data: filteredNotifications,
      metadata: {
        total: notifications.length,
        filtered: filteredNotifications.length,
        filter,
        limit
      }
    })

  } catch (error) {
    console.error('Error fetching notifications:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch notifications' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, notificationId } = body

    if (action === 'dismiss' && notificationId) {
      // In production, update the notification in the database
      return NextResponse.json({
        success: true,
        message: 'Notification dismissed successfully'
      })
    }

    if (action === 'mark_all_read') {
      // In production, mark all notifications as read in the database
      return NextResponse.json({
        success: true,
        message: 'All notifications marked as read'
      })
    }

    return NextResponse.json(
      { success: false, error: 'Invalid action' },
      { status: 400 }
    )

  } catch (error) {
    console.error('Error processing notification action:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process notification action' },
      { status: 500 }
    )
  }
}

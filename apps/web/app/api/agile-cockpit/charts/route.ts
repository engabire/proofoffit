import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    const url = new URL(request.url)
    const { searchParams } = url
    const chartType = searchParams.get('type') || 'velocity'
    const period = searchParams.get('period') || 'month'

    // Mock chart data - in production, fetch from database
    const chartData = {
      velocity: {
        labels: ['Sprint 1', 'Sprint 2', 'Sprint 3', 'Sprint 4', 'Sprint 5'],
        datasets: [
          {
            label: 'Completed',
            data: [8, 12, 9, 11, 10],
            backgroundColor: 'rgba(59, 130, 246, 0.8)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2
          },
          {
            label: 'Planned',
            data: [10, 10, 10, 10, 10],
            backgroundColor: 'rgba(156, 163, 175, 0.8)',
            borderColor: 'rgba(156, 163, 175, 1)',
            borderWidth: 2
          }
        ]
      },
      cycleTime: {
        labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
        datasets: [
          {
            label: 'Average Cycle Time',
            data: [2.5, 2.1, 1.8, 2.3],
            backgroundColor: 'rgba(34, 197, 94, 0.8)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2
          }
        ]
      },
      wip: {
        labels: ['Backlog', 'This Sprint', 'In Progress', 'Done'],
        datasets: [
          {
            label: 'Items',
            data: [15, 5, 3, 12],
            backgroundColor: [
              'rgba(156, 163, 175, 0.8)',
              'rgba(59, 130, 246, 0.8)',
              'rgba(245, 158, 11, 0.8)',
              'rgba(34, 197, 94, 0.8)'
            ],
            borderColor: [
              'rgba(156, 163, 175, 1)',
              'rgba(59, 130, 246, 1)',
              'rgba(245, 158, 11, 1)',
              'rgba(34, 197, 94, 1)'
            ],
            borderWidth: 2
          }
        ]
      },
      burndown: {
        labels: Array.from({ length: 14 }, (_, i) => `Day ${i + 1}`),
        datasets: [
          {
            label: 'Ideal Burndown',
            data: Array.from({ length: 14 }, (_, i) => 20 - (20 / 14) * i),
            backgroundColor: 'rgba(59, 130, 246, 0.3)',
            borderColor: 'rgba(59, 130, 246, 1)',
            borderWidth: 2,
            fill: false
          },
          {
            label: 'Actual Burndown',
            data: [20, 18, 17, 15, 14, 12, 11, 10, 9, 8, 7, 6, 4, 2],
            backgroundColor: 'rgba(34, 197, 94, 0.3)',
            borderColor: 'rgba(34, 197, 94, 1)',
            borderWidth: 2,
            fill: false
          }
        ]
      }
    }

    return NextResponse.json({
      success: true,
      data: chartData[chartType as keyof typeof chartData] || chartData.velocity,
      metadata: {
        chartType,
        period,
        lastUpdated: new Date().toISOString()
      }
    })

  } catch (error) {
    console.error('Error fetching chart data:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch chart data' },
      { status: 500 }
    )
  }
}

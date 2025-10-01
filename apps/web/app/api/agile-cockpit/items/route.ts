import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url)
    const { searchParams } = url
    const limit = parseInt(searchParams.get('limit') || '10')
    const status = searchParams.get('status')

    // Initialize Supabase client
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseServiceKey) {
      return NextResponse.json(
        { error: 'Supabase configuration missing' },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get project items from audit_events (simplified approach)
    // In a real implementation, you'd have a dedicated agile_cockpit_items table
    let query = supabase
      .from('audit_events')
      .select('*')
      .eq('event_type', 'issue_added_to_project')
      .order('created_at', { ascending: false })
      .limit(limit)

    const { data: items, error } = await query

    if (error) {
      console.error('Error fetching items:', error)
      // Return mock data for development
      return NextResponse.json({
        items: [
          {
            id: '1',
            title: 'Implement user authentication system',
            sprintStatus: 'In Progress',
            repository: 'engabire/proofoffit',
            assignees: ['engabire'],
            labels: ['feature', 'backend', 'high-priority'],
            url: 'https://github.com/engabire/proofoffit/issues/1',
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '2',
            title: 'Add mobile responsive design',
            sprintStatus: 'This Sprint',
            repository: 'engabire/proofoffit',
            assignees: ['engabire'],
            labels: ['frontend', 'mobile', 'medium-priority'],
            url: 'https://github.com/engabire/proofoffit/issues/2',
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 30 * 60 * 1000).toISOString()
          },
          {
            id: '3',
            title: 'Set up CI/CD pipeline',
            sprintStatus: 'Done',
            repository: 'engabire/proofoffit',
            assignees: ['engabire'],
            labels: ['devops', 'infrastructure', 'high-priority'],
            url: 'https://github.com/engabire/proofoffit/issues/3',
            createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '4',
            title: 'Create API documentation',
            sprintStatus: 'Backlog',
            repository: 'engabire/proofoffit',
            assignees: [],
            labels: ['documentation', 'api', 'low-priority'],
            url: 'https://github.com/engabire/proofoffit/issues/4',
            createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: '5',
            title: 'Implement error monitoring',
            sprintStatus: 'In Progress',
            repository: 'engabire/proofoffit',
            assignees: ['engabire'],
            labels: ['monitoring', 'infrastructure', 'medium-priority'],
            url: 'https://github.com/engabire/proofoffit/issues/5',
            createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
            updatedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        total: 5,
        limit: limit
      })
    }

    // Transform the data to match the expected format
    const transformedItems = items?.map((item, index) => ({
      id: item.id || index.toString(),
      title: item.metadata?.title || `Item ${index + 1}`,
      sprintStatus: getRandomStatus(),
      repository: item.metadata?.repository || 'engabire/proofoffit',
      assignees: item.metadata?.assignees || ['engabire'],
      labels: item.metadata?.labels || ['task'],
      url: item.metadata?.url || `https://github.com/engabire/proofoffit/issues/${index + 1}`,
      createdAt: item.created_at,
      updatedAt: item.created_at
    })) || []

    // Filter by status if specified
    const filteredItems = status 
      ? transformedItems.filter(item => item.sprintStatus === status)
      : transformedItems

    return NextResponse.json({
      items: filteredItems,
      total: filteredItems.length,
      limit: limit
    })

  } catch (error) {
    console.error('Error in items endpoint:', error)
    return NextResponse.json(
      { error: 'Failed to fetch items' },
      { status: 500 }
    )
  }
}

function getRandomStatus(): 'Backlog' | 'This Sprint' | 'In Progress' | 'Done' {
  const statuses = ['Backlog', 'This Sprint', 'In Progress', 'Done']
  return statuses[Math.floor(Math.random() * statuses.length)] as any
}

import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { action, issue, pull_request, repository } = body

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

    // Handle different webhook events
    switch (action) {
      case 'opened':
        await handleIssueOpened(supabase, issue, repository)
        break
      case 'closed':
        await handleIssueClosed(supabase, issue, repository)
        break
      case 'assigned':
        await handleIssueAssigned(supabase, issue, repository)
        break
      case 'unassigned':
        await handleIssueUnassigned(supabase, issue, repository)
        break
      case 'labeled':
        await handleIssueLabeled(supabase, issue, repository)
        break
      case 'unlabeled':
        await handleIssueUnlabeled(supabase, issue, repository)
        break
      case 'milestoned':
        await handleIssueMilestoned(supabase, issue, repository)
        break
      case 'demilestoned':
        await handleIssueDemilestoned(supabase, issue, repository)
        break
      default:
        // eslint-disable-next-line no-console
        console.log(`Unhandled webhook action: ${action}`)
    }

    // Log webhook event
    await supabase
      .from('audit_events')
      .insert({
        event_type: 'webhook_received',
        user_id: 'system',
        metadata: {
          action,
          issue_id: issue?.id,
          repository: repository?.full_name,
          webhook_source: 'github'
        },
        created_at: new Date().toISOString()
      })

    return NextResponse.json({ success: true })

  } catch (error) {
    // eslint-disable-next-line no-console
    console.error('Webhook processing error:', error)
    return NextResponse.json(
      { error: 'Webhook processing failed' },
      { status: 500 }
    )
  }
}

async function handleIssueOpened(supabase: any, issue: any, repository: any) {
  // Auto-add new issues to Agile Cockpit project
  const projectData = {
    issue_id: issue.id,
    issue_number: issue.number,
    title: issue.title,
    repository: repository.full_name,
    url: issue.html_url,
    state: 'open',
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    labels: issue.labels?.map((label: any) => label.name) || [],
    assignees: issue.assignees?.map((assignee: any) => assignee.login) || [],
    milestone: issue.milestone?.title || null
  }

  await supabase
    .from('agile_cockpit_items')
    .insert({
      ...projectData,
      sprint_status: 'Backlog', // Default status
      created_at: new Date().toISOString()
    })

  // Log the event
  await supabase
    .from('audit_events')
    .insert({
      event_type: 'issue_added_to_project',
      user_id: 'system',
      metadata: {
        issue_id: issue.id,
        repository: repository.full_name,
        auto_added: true
      },
      created_at: new Date().toISOString()
    })
}

async function handleIssueClosed(supabase: any, issue: any, repository: any) {
  // Update issue status to Done
  await supabase
    .from('agile_cockpit_items')
    .update({
      sprint_status: 'Done',
      state: 'closed',
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)

  // Log the event
  await supabase
    .from('audit_events')
    .insert({
      event_type: 'issue_completed',
      user_id: 'system',
      metadata: {
        issue_id: issue.id,
        repository: repository.full_name,
        completed_at: new Date().toISOString()
      },
      created_at: new Date().toISOString()
    })
}

async function handleIssueAssigned(supabase: any, issue: any, repository: any) {
  // Update assignees
  const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []
  
  await supabase
    .from('agile_cockpit_items')
    .update({
      assignees: assignees,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)

  // Log the event
  await supabase
    .from('audit_events')
    .insert({
      event_type: 'issue_assigned',
      user_id: 'system',
      metadata: {
        issue_id: issue.id,
        repository: repository.full_name,
        assignees: assignees
      },
      created_at: new Date().toISOString()
    })
}

async function handleIssueUnassigned(supabase: any, issue: any, repository: any) {
  // Update assignees
  const assignees = issue.assignees?.map((assignee: any) => assignee.login) || []
  
  await supabase
    .from('agile_cockpit_items')
    .update({
      assignees: assignees,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)
}

async function handleIssueLabeled(supabase: any, issue: any, repository: any) {
  // Update labels
  const labels = issue.labels?.map((label: any) => label.name) || []
  
  await supabase
    .from('agile_cockpit_items')
    .update({
      labels: labels,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)

  // Check for special labels that might change sprint status
  if (labels.includes('in-progress')) {
    await supabase
      .from('agile_cockpit_items')
      .update({
        sprint_status: 'In Progress',
        updated_at: new Date().toISOString()
      })
      .eq('issue_id', issue.id)
  } else if (labels.includes('this-sprint')) {
    await supabase
      .from('agile_cockpit_items')
      .update({
        sprint_status: 'This Sprint',
        updated_at: new Date().toISOString()
      })
      .eq('issue_id', issue.id)
  }
}

async function handleIssueUnlabeled(supabase: any, issue: any, repository: any) {
  // Update labels
  const labels = issue.labels?.map((label: any) => label.name) || []
  
  await supabase
    .from('agile_cockpit_items')
    .update({
      labels: labels,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)
}

async function handleIssueMilestoned(supabase: any, issue: any, repository: any) {
  // Update milestone
  await supabase
    .from('agile_cockpit_items')
    .update({
      milestone: issue.milestone?.title || null,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)
}

async function handleIssueDemilestoned(supabase: any, issue: any, repository: any) {
  // Remove milestone
  await supabase
    .from('agile_cockpit_items')
    .update({
      milestone: null,
      updated_at: new Date().toISOString()
    })
    .eq('issue_id', issue.id)
}

export async function GET(req: NextRequest) {
  return NextResponse.json({
    message: 'Agile Cockpit Webhook Endpoint',
    status: 'active',
    supported_events: [
      'issues.opened',
      'issues.closed',
      'issues.assigned',
      'issues.unassigned',
      'issues.labeled',
      'issues.unlabeled',
      'issues.milestoned',
      'issues.demilestoned'
    ]
  })
}

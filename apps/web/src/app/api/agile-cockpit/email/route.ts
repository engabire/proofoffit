import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { templateId, recipients, data } = body

    if (!templateId || !recipients || !Array.isArray(recipients)) {
      return NextResponse.json(
        { success: false, error: 'Template ID and recipients are required' },
        { status: 400 }
      )
    }

    // Mock email sending - in production, integrate with your email service
    const emailResult = {
      id: Date.now().toString(),
      templateId,
      recipients,
      status: 'sent',
      sentAt: new Date().toISOString(),
      messageId: `msg_${Date.now()}`
    }

    return NextResponse.json({
      success: true,
      data: emailResult
    })

  } catch (error) {
    console.error('Error sending email:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to send email' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const templateId = searchParams.get('templateId')

    // Mock email templates
    const templates = [
      {
        id: '1',
        name: 'Daily Sprint Update',
        subject: 'Daily Sprint Update - {date}',
        content: `Hi Team,

Here's your daily sprint update:

**Sprint Progress:**
• Completed: {completed_items} items
• In Progress: {in_progress_items} items
• Remaining: {remaining_items} items
• Velocity: {velocity} points

**Today's Focus:**
{priority_items}

**Blockers:**
{blockers}

Keep up the great work!

Best regards,
Agile Cockpit`,
        variables: ['date', 'completed_items', 'in_progress_items', 'remaining_items', 'velocity', 'priority_items', 'blockers']
      },
      {
        id: '2',
        name: 'Weekly Sprint Report',
        subject: 'Weekly Sprint Report - Week of {week_start}',
        content: `Hi Team,

Here's your weekly sprint report:

**Sprint Summary:**
• Sprint Goal: {sprint_goal}
• Completed: {completed_stories} stories ({completed_points} points)
• Velocity: {velocity} points (Target: {target_velocity})
• Success Rate: {success_rate}%

**Key Achievements:**
{achievements}

**Areas for Improvement:**
{improvements}

Great work this week!

Best regards,
Agile Cockpit`,
        variables: ['week_start', 'sprint_goal', 'completed_stories', 'completed_points', 'velocity', 'target_velocity', 'success_rate', 'achievements', 'improvements']
      }
    ]

    if (templateId) {
      const template = templates.find(t => t.id === templateId)
      if (!template) {
        return NextResponse.json(
          { success: false, error: 'Template not found' },
          { status: 404 }
        )
      }
      return NextResponse.json({
        success: true,
        data: template
      })
    }

    return NextResponse.json({
      success: true,
      data: templates
    })

  } catch (error) {
    console.error('Error fetching email templates:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to fetch email templates' },
      { status: 500 }
    )
  }
}

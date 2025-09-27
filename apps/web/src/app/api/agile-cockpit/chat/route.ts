import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, context } = body

    if (!message) {
      return NextResponse.json(
        { success: false, error: 'Message is required' },
        { status: 400 }
      )
    }

    // Simple AI response generation based on message content
    const response = generateAIResponse(message.toLowerCase(), context)

    return NextResponse.json({
      success: true,
      data: {
        id: Date.now().toString(),
        type: 'assistant',
        content: response.content,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions,
        data: response.data
      }
    })

  } catch (error) {
    console.error('Error processing chat message:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to process chat message' },
      { status: 500 }
    )
  }
}

function generateAIResponse(message: string, context?: any) {
  if (message.includes('velocity') || message.includes('performance')) {
    return {
      content: `Based on your recent sprint data, here's what I found:

**Velocity Analysis:**
• Current velocity: 8.5 story points
• 3-sprint average: 9.2 story points
• Trend: Slight decline (-7.6%)

**Key Insights:**
• Your team is consistently delivering but showing a small downward trend
• Consider reviewing story sizing or team capacity
• The decline might be due to increased complexity in recent sprints

**Recommendations:**
• Review the last 3 sprints for common blockers
• Consider breaking down larger stories
• Check if team capacity has changed`,
      suggestions: [
        "Show me specific sprint breakdowns",
        "What's causing the velocity decline?",
        "Help me improve our story sizing"
      ],
      data: {
        velocity: 8.5,
        average: 9.2,
        trend: -7.6
      }
    }
  }
  
  if (message.includes('wip') || message.includes('work in progress')) {
    return {
      content: `**Current WIP Status:**
• Total items in progress: 8
• WIP limit: 6
• Status: ⚠️ Over limit

**Breakdown:**
• Backlog: 15 items
• This Sprint: 5 items
• In Progress: 8 items (3 over limit)
• Done: 12 items

**Recommendations:**
• Focus on completing 2-3 items before starting new work
• Consider if any in-progress items can be paused
• Review if WIP limit should be adjusted based on team size`,
      suggestions: [
        "Which items should I prioritize?",
        "How can I reduce WIP?",
        "Show me blocked items"
      ],
      data: {
        wip: 8,
        limit: 6,
        overLimit: true
      }
    }
  }
  
  if (message.includes('sprint') && message.includes('plan')) {
    return {
      content: `**Sprint Planning Recommendations:**

**Capacity Planning:**
• Team velocity: 8.5 points
• Available capacity: 85%
• Recommended sprint scope: 7-8 points

**Story Selection:**
• High priority: 3 stories (5 points)
• Medium priority: 2 stories (2.5 points)
• Buffer: 1 story (1 point)

**Risk Factors:**
• 2 items currently blocked
• 1 team member on vacation next week
• 1 high-complexity story needs technical spike

**Action Items:**
• Resolve blockers before sprint start
• Consider reducing scope by 1-2 points
• Schedule technical spike early in sprint`,
      suggestions: [
        "Help me select the right stories",
        "What about the blocked items?",
        "Show me team capacity details"
      ],
      data: {
        recommendedScope: 7.5,
        riskLevel: 'medium',
        blockers: 2
      }
    }
  }
  
  if (message.includes('blocked') || message.includes('blocker')) {
    return {
      content: `**Blocked Items Analysis:**

**Current Blockers:**
1. **Story #123** - Waiting for API access (3 days)
   - Impact: High
   - Owner: John
   - Action: Contact API team lead

2. **Story #145** - Design review pending (1 day)
   - Impact: Medium
   - Owner: Sarah
   - Action: Schedule design review

**Blocking Patterns:**
• 60% of blockers are external dependencies
• Average resolution time: 2.3 days
• Most common: API/Integration issues

**Recommendations:**
• Create escalation process for external dependencies
• Add buffer time for integration stories
• Consider parallel work streams`,
      suggestions: [
        "How can I escalate these blockers?",
        "Show me historical blocker data",
        "Help me prevent future blockers"
      ],
      data: {
        totalBlockers: 2,
        avgResolutionTime: 2.3,
        externalDependencies: 60
      }
    }
  }
  
  // Default response
  return {
    content: `I understand you're asking about "${message}". I can help you with:

• **Velocity Analysis** - Track team performance trends
• **WIP Management** - Monitor work in progress limits
• **Sprint Planning** - Get recommendations for upcoming sprints
• **Blocked Items** - Identify and resolve blockers
• **Team Performance** - Analyze productivity metrics

What specific aspect would you like to explore?`,
    suggestions: [
      "How is our team performing?",
      "What should I focus on this sprint?",
      "Show me our velocity trends",
      "Help me plan the next sprint"
    ]
  }
}

"use client"

import React, { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { MessageCircle, Send, Bot, User, Loader2, Lightbulb, TrendingUp, AlertTriangle } from 'lucide-react'

interface ChatMessage {
  id: string
  type: 'user' | 'assistant'
  content: string
  timestamp: Date
  suggestions?: string[]
  data?: any
}

interface QuickAction {
  id: string
  label: string
  description: string
  action: () => void
  icon: React.ReactNode
}

export function AIChatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      type: 'assistant',
      content: "Hi! I'm your Agile Cockpit AI assistant. I can help you with sprint planning, velocity analysis, WIP management, and more. What would you like to know?",
      timestamp: new Date(),
      suggestions: [
        "How is our team performing?",
        "What should I focus on this sprint?",
        "Show me our velocity trends",
        "Help me plan the next sprint"
      ]
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const quickActions: QuickAction[] = [
    {
      id: 'velocity-analysis',
      label: 'Velocity Analysis',
      description: 'Analyze team velocity trends',
      action: () => handleQuickAction('velocity-analysis'),
      icon: <TrendingUp className="w-4 h-4" />
    },
    {
      id: 'wip-review',
      label: 'WIP Review',
      description: 'Review work in progress',
      action: () => handleQuickAction('wip-review'),
      icon: <AlertTriangle className="w-4 h-4" />
    },
    {
      id: 'sprint-planning',
      label: 'Sprint Planning',
      description: 'Get sprint planning advice',
      action: () => handleQuickAction('sprint-planning'),
      icon: <Lightbulb className="w-4 h-4" />
    }
  ]

  const handleQuickAction = async (actionId: string) => {
    let query = ''
    
    switch (actionId) {
      case 'velocity-analysis':
        query = 'Analyze our team velocity trends and provide insights'
        break
      case 'wip-review':
        query = 'Review our current work in progress and suggest improvements'
        break
      case 'sprint-planning':
        query = 'Help me plan the next sprint based on our current performance'
        break
    }
    
    setInput(query)
    await handleSendMessage(query)
  }

  const handleSendMessage = async (message?: string) => {
    const userMessage = message || input.trim()
    if (!userMessage) return

    const newUserMessage: ChatMessage = {
      id: Date.now().toString(),
      type: 'user',
      content: userMessage,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, newUserMessage])
    setInput('')
    setIsLoading(true)

    try {
      // Simulate AI response
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const aiResponse = generateAIResponse(userMessage)
      
      const newAIMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: aiResponse.content,
        timestamp: new Date(),
        suggestions: aiResponse.suggestions,
        data: aiResponse.data
      }

      setMessages(prev => [...prev, newAIMessage])
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const generateAIResponse = (userMessage: string) => {
    const message = userMessage.toLowerCase()
    
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
      content: `I understand you're asking about "${userMessage}". I can help you with:

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          onClick={() => setIsMinimized(false)}
          className="rounded-full w-12 h-12 shadow-lg"
        >
          <MessageCircle className="w-5 h-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="fixed bottom-4 right-4 w-96 h-[600px] z-50">
      <Card className="h-full flex flex-col shadow-xl">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="w-5 h-5 text-blue-500" />
              <CardTitle className="text-lg">Agile Assistant</CardTitle>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMinimized(true)}
            >
              ✕
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 flex flex-col p-0">
          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.type === 'user'
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 text-gray-900'
                  }`}
                >
                  <div className="flex items-start space-x-2">
                    {message.type === 'assistant' && (
                      <Bot className="w-4 h-4 mt-0.5 text-blue-500 flex-shrink-0" />
                    )}
                    {message.type === 'user' && (
                      <User className="w-4 h-4 mt-0.5 text-white flex-shrink-0" />
                    )}
                    <div className="flex-1">
                      <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                      {message.data && (
                        <div className="mt-2 space-y-1">
                          {message.data.velocity && (
                            <Badge variant="outline" className="text-xs">
                              Velocity: {message.data.velocity}
                            </Badge>
                          )}
                          {message.data.wip && (
                            <Badge variant="outline" className="text-xs">
                              WIP: {message.data.wip}/{message.data.limit}
                            </Badge>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {message.suggestions && message.suggestions.length > 0 && (
                    <div className="mt-3 space-y-1">
                      {message.suggestions.map((suggestion, index) => (
                        <button
                          key={index}
                          onClick={() => handleSendMessage(suggestion)}
                          className="block w-full text-left text-xs p-2 bg-white bg-opacity-20 rounded hover:bg-opacity-30 transition-colors"
                        >
                          {suggestion}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 rounded-lg p-3">
                  <div className="flex items-center space-x-2">
                    <Bot className="w-4 h-4 text-blue-500" />
                    <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                    <span className="text-sm text-gray-600">Thinking...</span>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
          
          {/* Quick Actions */}
          <div className="p-4 border-t">
            <div className="grid grid-cols-3 gap-2 mb-3">
              {quickActions.map((action) => (
                <Button
                  key={action.id}
                  variant="outline"
                  size="sm"
                  onClick={action.action}
                  className="flex flex-col items-center p-2 h-auto"
                >
                  {action.icon}
                  <span className="text-xs mt-1">{action.label}</span>
                </Button>
              ))}
            </div>
            
            {/* Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me anything about your Agile process..."
                className="flex-1 p-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                disabled={isLoading}
              />
              <Button
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || isLoading}
                size="sm"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

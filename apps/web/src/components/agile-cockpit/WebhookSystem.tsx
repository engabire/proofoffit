"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Webhook, 
  Plus, 
  Edit, 
  Trash2, 
  Copy, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Settings,
  Zap
} from 'lucide-react'

interface WebhookConfig {
  id: string
  name: string
  url: string
  events: string[]
  secret: string
  status: 'active' | 'inactive' | 'error'
  lastTriggered?: Date
  successCount: number
  failureCount: number
  description: string
  headers: Record<string, string>
}

interface WebhookEvent {
  id: string
  webhookId: string
  event: string
  status: 'success' | 'failed' | 'pending'
  responseCode?: number
  responseTime?: number
  timestamp: Date
  payload: any
  error?: string
}

export function WebhookSystem() {
  const [webhooks, setWebhooks] = useState<WebhookConfig[]>([])
  const [events, setEvents] = useState<WebhookEvent[]>([])
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [selectedWebhook, setSelectedWebhook] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'webhooks' | 'events' | 'test'>('webhooks')

  useEffect(() => {
    loadWebhooks()
    loadEvents()
  }, [])

  const loadWebhooks = () => {
    const mockWebhooks: WebhookConfig[] = [
      {
        id: '1',
        name: 'Slack Notifications',
        url: 'https://hooks.slack.com/services/T00000000/B00000000/XXXXXXXXXXXXXXXXXXXXXXXX',
        events: ['sprint.completed', 'issue.blocked', 'velocity.alert'],
        secret: 'whsec_1234567890abcdef',
        status: 'active',
        lastTriggered: new Date(Date.now() - 2 * 60 * 60 * 1000),
        successCount: 45,
        failureCount: 2,
        description: 'Send notifications to Slack channel for important events',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'Agile-Cockpit-Webhook/1.0'
        }
      },
      {
        id: '2',
        name: 'Email Alerts',
        url: 'https://api.emailservice.com/webhook',
        events: ['sprint.overdue', 'wip.exceeded'],
        secret: 'whsec_abcdef1234567890',
        status: 'active',
        lastTriggered: new Date(Date.now() - 4 * 60 * 60 * 1000),
        successCount: 12,
        failureCount: 0,
        description: 'Send email alerts for critical events',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Bearer token123'
        }
      },
      {
        id: '3',
        name: 'Analytics Tracking',
        url: 'https://analytics.example.com/track',
        events: ['sprint.started', 'sprint.completed', 'issue.created', 'issue.resolved'],
        secret: 'whsec_9876543210fedcba',
        status: 'error',
        lastTriggered: new Date(Date.now() - 24 * 60 * 60 * 1000),
        successCount: 156,
        failureCount: 8,
        description: 'Track analytics events for reporting',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'analytics-key-123'
        }
      }
    ]
    setWebhooks(mockWebhooks)
  }

  const loadEvents = () => {
    const mockEvents: WebhookEvent[] = [
      {
        id: '1',
        webhookId: '1',
        event: 'sprint.completed',
        status: 'success',
        responseCode: 200,
        responseTime: 245,
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
        payload: { sprint: 'Sprint 1', velocity: 8.5, completed: 12 }
      },
      {
        id: '2',
        webhookId: '2',
        event: 'wip.exceeded',
        status: 'success',
        responseCode: 200,
        responseTime: 189,
        timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
        payload: { current: 8, limit: 6, items: ['Story 1', 'Story 2'] }
      },
      {
        id: '3',
        webhookId: '3',
        event: 'issue.created',
        status: 'failed',
        responseCode: 500,
        responseTime: 5000,
        timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
        payload: { issue: 'Issue #123', title: 'New feature request' },
        error: 'Connection timeout'
      }
    ]
    setEvents(mockEvents)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'error': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'inactive': return <XCircle className="w-4 h-4 text-gray-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getEventStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-100 text-green-800'
      case 'failed': return 'bg-red-100 text-red-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const testWebhook = async (webhookId: string) => {
    const webhook = webhooks.find(w => w.id === webhookId)
    if (!webhook) return

    // Simulate webhook test
    const testEvent: WebhookEvent = {
      id: Date.now().toString(),
      webhookId,
      event: 'test.event',
      status: 'pending',
      timestamp: new Date(),
      payload: { test: true, message: 'This is a test webhook' }
    }

    setEvents(prev => [testEvent, ...prev])

    // Simulate response
    setTimeout(() => {
      setEvents(prev => prev.map(event => 
        event.id === testEvent.id 
          ? { 
              ...event, 
              status: 'success', 
              responseCode: 200, 
              responseTime: Math.floor(Math.random() * 500) + 100 
            }
          : event
      ))
    }, 2000)
  }

  const renderWebhooks = () => (
    <div className="space-y-4">
      {webhooks.map(webhook => (
        <Card key={webhook.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Webhook className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">{webhook.name}</h3>
                  <Badge className={getStatusColor(webhook.status)}>
                    {webhook.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-2">{webhook.description}</p>
                
                <div className="space-y-1 text-sm text-gray-500">
                  <div className="flex items-center space-x-2">
                    <span>URL:</span>
                    <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                      {webhook.url.substring(0, 50)}...
                    </code>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(webhook.url)}
                    >
                      <Copy className="w-3 h-3" />
                    </Button>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <span>Events:</span>
                    <div className="flex flex-wrap gap-1">
                      {webhook.events.map((event, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {event}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-4">
                    <span>Success: {webhook.successCount}</span>
                    <span>Failures: {webhook.failureCount}</span>
                    {webhook.lastTriggered && (
                      <span>Last: {webhook.lastTriggered.toLocaleString()}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => testWebhook(webhook.id)}
                >
                  <Zap className="w-4 h-4 mr-1" />
                  Test
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderEvents = () => (
    <div className="space-y-4">
      {events.map(event => (
        <Card key={event.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Webhook className="w-4 h-4 text-gray-500" />
                  <h3 className="font-medium">{event.event}</h3>
                  <Badge className={getEventStatusColor(event.status)}>
                    {event.status}
                  </Badge>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Webhook:</span>
                    <div>{webhooks.find(w => w.id === event.webhookId)?.name}</div>
                  </div>
                  
                  <div>
                    <span className="font-medium">Time:</span>
                    <div>{event.timestamp.toLocaleString()}</div>
                  </div>
                  
                  {event.responseCode && (
                    <div>
                      <span className="font-medium">Response:</span>
                      <div>{event.responseCode}</div>
                    </div>
                  )}
                  
                  {event.responseTime && (
                    <div>
                      <span className="font-medium">Duration:</span>
                      <div>{event.responseTime}ms</div>
                    </div>
                  )}
                </div>
                
                {event.error && (
                  <div className="mt-2 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
                    Error: {event.error}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderTest = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Webhook Testing</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Test URL</label>
              <input
                type="url"
                placeholder="https://example.com/webhook"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Test Payload</label>
              <textarea
                rows={6}
                placeholder='{"event": "test", "data": "sample"}'
                className="w-full p-2 border border-gray-300 rounded-md font-mono text-sm"
              />
            </div>
            
            <div className="flex space-x-2">
              <Button>
                <Zap className="w-4 h-4 mr-2" />
                Send Test
              </Button>
              <Button variant="outline">
                <Copy className="w-4 h-4 mr-2" />
                Copy Payload
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Available Events</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { event: 'sprint.started', description: 'Triggered when a new sprint begins' },
              { event: 'sprint.completed', description: 'Triggered when a sprint is completed' },
              { event: 'sprint.overdue', description: 'Triggered when a sprint exceeds its deadline' },
              { event: 'issue.created', description: 'Triggered when a new issue is created' },
              { event: 'issue.resolved', description: 'Triggered when an issue is resolved' },
              { event: 'issue.blocked', description: 'Triggered when an issue becomes blocked' },
              { event: 'wip.exceeded', description: 'Triggered when WIP limit is exceeded' },
              { event: 'velocity.alert', description: 'Triggered when velocity drops below threshold' }
            ].map((event, index) => (
              <div key={index} className="p-3 border rounded-lg">
                <div className="font-medium text-sm">{event.event}</div>
                <div className="text-xs text-gray-600">{event.description}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Webhook System</h2>
          <p className="text-gray-600">Configure webhooks for external integrations</p>
        </div>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Webhook
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'webhooks', label: 'Webhooks', icon: <Webhook className="w-4 h-4" /> },
          { key: 'events', label: 'Events', icon: <Eye className="w-4 h-4" /> },
          { key: 'test', label: 'Test', icon: <Zap className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'webhooks' && renderWebhooks()}
      {activeTab === 'events' && renderEvents()}
      {activeTab === 'test' && renderTest()}

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>Webhook Setup Guide</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Create Webhook Endpoint</h4>
                <p className="text-sm text-gray-600">Set up an HTTP endpoint in your application to receive webhook payloads</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Events</h4>
                <p className="text-sm text-gray-600">Select which events should trigger your webhook</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Test and Monitor</h4>
                <p className="text-sm text-gray-600">Test your webhook and monitor the event logs for successful delivery</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

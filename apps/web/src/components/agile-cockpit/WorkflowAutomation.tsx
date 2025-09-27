"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Workflow, 
  Plus, 
  Play, 
  Pause, 
  Edit, 
  Trash2, 
  Settings,
  Zap,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react'

interface AutomationRule {
  id: string
  name: string
  description: string
  trigger: {
    type: 'event' | 'schedule' | 'condition'
    event?: string
    schedule?: string
    condition?: string
  }
  actions: {
    type: 'notification' | 'assignment' | 'status_change' | 'webhook' | 'email'
    config: any
  }[]
  status: 'active' | 'inactive' | 'error'
  lastExecuted?: Date
  executionCount: number
  successRate: number
  createdAt: Date
  createdBy: string
}

interface WorkflowTemplate {
  id: string
  name: string
  description: string
  category: 'sprint' | 'issue' | 'team' | 'notification'
  rules: Omit<AutomationRule, 'id' | 'createdAt' | 'createdBy'>[]
  popularity: number
  tags: string[]
}

export function WorkflowAutomation() {
  const [rules, setRules] = useState<AutomationRule[]>([])
  const [templates, setTemplates] = useState<WorkflowTemplate[]>([])
  const [activeTab, setActiveTab] = useState<'rules' | 'templates' | 'logs' | 'builder'>('rules')
  const [selectedRule, setSelectedRule] = useState<string | null>(null)
  const [showBuilder, setShowBuilder] = useState(false)

  useEffect(() => {
    loadAutomationData()
  }, [])

  const loadAutomationData = () => {
    // Mock automation rules
    const mockRules: AutomationRule[] = [
      {
        id: '1',
        name: 'Auto-assign blocked issues',
        description: 'Automatically assign blocked issues to the team lead',
        trigger: {
          type: 'event',
          event: 'issue.blocked'
        },
        actions: [
          {
            type: 'assignment',
            config: { assignee: 'team-lead' }
          },
          {
            type: 'notification',
            config: { message: 'Issue has been blocked and assigned to team lead' }
          }
        ],
        status: 'active',
        lastExecuted: new Date(Date.now() - 2 * 60 * 60 * 1000),
        executionCount: 15,
        successRate: 100,
        createdAt: new Date('2024-01-10'),
        createdBy: 'engabire'
      },
      {
        id: '2',
        name: 'Daily standup reminder',
        description: 'Send daily standup reminders at 9 AM',
        trigger: {
          type: 'schedule',
          schedule: '0 9 * * 1-5'
        },
        actions: [
          {
            type: 'notification',
            config: { 
              message: 'Daily standup in 15 minutes!',
              channel: 'team-channel'
            }
          }
        ],
        status: 'active',
        lastExecuted: new Date(Date.now() - 1 * 60 * 60 * 1000),
        executionCount: 45,
        successRate: 98,
        createdAt: new Date('2024-01-05'),
        createdBy: 'engabire'
      },
      {
        id: '3',
        name: 'Sprint completion celebration',
        description: 'Send celebration message when sprint is completed',
        trigger: {
          type: 'event',
          event: 'sprint.completed'
        },
        actions: [
          {
            type: 'notification',
            config: { 
              message: '🎉 Sprint completed! Great work team!',
              channel: 'team-channel'
            }
          },
          {
            type: 'webhook',
            config: { 
              url: 'https://api.example.com/celebration',
              payload: { event: 'sprint_completed' }
            }
          }
        ],
        status: 'active',
        lastExecuted: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        executionCount: 8,
        successRate: 100,
        createdAt: new Date('2024-01-08'),
        createdBy: 'engabire'
      },
      {
        id: '4',
        name: 'WIP limit alert',
        description: 'Alert when WIP limit is exceeded',
        trigger: {
          type: 'condition',
          condition: 'wip_count > wip_limit'
        },
        actions: [
          {
            type: 'notification',
            config: { 
              message: '⚠️ WIP limit exceeded! Please finish some items.',
              priority: 'high'
            }
          },
          {
            type: 'email',
            config: { 
              template: 'wip_alert',
              recipients: ['team@company.com']
            }
          }
        ],
        status: 'error',
        lastExecuted: new Date(Date.now() - 6 * 60 * 60 * 1000),
        executionCount: 3,
        successRate: 67,
        createdAt: new Date('2024-01-12'),
        createdBy: 'engabire'
      }
    ]

    // Mock workflow templates
    const mockTemplates: WorkflowTemplate[] = [
      {
        id: '1',
        name: 'Sprint Management Workflow',
        description: 'Complete workflow for managing sprints from start to finish',
        category: 'sprint',
        popularity: 95,
        tags: ['sprint', 'automation', 'management'],
        rules: [
          {
            name: 'Sprint start notification',
            description: 'Notify team when sprint starts',
            trigger: { type: 'event', event: 'sprint.started' },
            actions: [
              { type: 'notification', config: { message: 'New sprint started!' } }
            ],
            status: 'active',
            executionCount: 0,
            successRate: 0
          },
          {
            name: 'Daily progress check',
            description: 'Check sprint progress daily',
            trigger: { type: 'schedule', schedule: '0 10 * * 1-5' },
            actions: [
              { type: 'notification', config: { message: 'Daily progress check' } }
            ],
            status: 'active',
            executionCount: 0,
            successRate: 0
          }
        ]
      },
      {
        id: '2',
        name: 'Issue Lifecycle Workflow',
        description: 'Automated workflow for managing issue lifecycle',
        category: 'issue',
        popularity: 88,
        tags: ['issue', 'lifecycle', 'automation'],
        rules: [
          {
            name: 'Auto-assign new issues',
            description: 'Assign new issues based on labels',
            trigger: { type: 'event', event: 'issue.created' },
            actions: [
              { type: 'assignment', config: { assignee: 'auto' } }
            ],
            status: 'active',
            executionCount: 0,
            successRate: 0
          }
        ]
      }
    ]

    setRules(mockRules)
    setTemplates(mockTemplates)
  }

  const toggleRuleStatus = (ruleId: string) => {
    setRules(prev => prev.map(rule => 
      rule.id === ruleId 
        ? { 
            ...rule, 
            status: rule.status === 'active' ? 'inactive' : 'active' 
          }
        : rule
    ))
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
      case 'inactive': return <Pause className="w-4 h-4 text-gray-500" />
      case 'error': return <AlertTriangle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const renderRules = () => (
    <div className="space-y-4">
      {rules.map(rule => (
        <Card key={rule.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Workflow className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">{rule.name}</h3>
                  <Badge className={getStatusColor(rule.status)}>
                    {rule.status}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{rule.description}</p>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Trigger:</span>
                    <div className="capitalize">{rule.trigger.type}</div>
                  </div>
                  <div>
                    <span className="font-medium">Actions:</span>
                    <div>{rule.actions.length}</div>
                  </div>
                  <div>
                    <span className="font-medium">Executions:</span>
                    <div>{rule.executionCount}</div>
                  </div>
                  <div>
                    <span className="font-medium">Success Rate:</span>
                    <div className={rule.successRate >= 95 ? 'text-green-600' : rule.successRate >= 80 ? 'text-yellow-600' : 'text-red-600'}>
                      {rule.successRate}%
                    </div>
                  </div>
                </div>
                
                {rule.lastExecuted && (
                  <div className="text-xs text-gray-500 mt-2">
                    Last executed: {rule.lastExecuted.toLocaleString()}
                  </div>
                )}
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => toggleRuleStatus(rule.id)}
                >
                  {rule.status === 'active' ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
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

  const renderTemplates = () => (
    <div className="space-y-4">
      {templates.map(template => (
        <Card key={template.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Workflow className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">{template.name}</h3>
                  <Badge variant="outline">{template.category}</Badge>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <TrendingUp className="w-4 h-4" />
                    <span>{template.popularity}% popular</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Zap className="w-4 h-4" />
                    <span>{template.rules.length} rules</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-1">
                  {template.tags.map((tag, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Use Template
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderLogs = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Automation Execution Logs</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { rule: 'Auto-assign blocked issues', status: 'success', time: '2 hours ago', details: 'Assigned issue #123 to team lead' },
              { rule: 'Daily standup reminder', status: 'success', time: '1 hour ago', details: 'Sent reminder to team channel' },
              { rule: 'WIP limit alert', status: 'failed', time: '6 hours ago', details: 'Failed to send email notification' },
              { rule: 'Sprint completion celebration', status: 'success', time: '3 days ago', details: 'Sent celebration message' }
            ].map((log, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {log.status === 'success' ? (
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-500" />
                  )}
                  <div>
                    <div className="font-medium text-sm">{log.rule}</div>
                    <div className="text-xs text-gray-500">{log.details}</div>
                  </div>
                </div>
                <div className="text-xs text-gray-500">{log.time}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderBuilder = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Workflow Builder</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium mb-1">Rule Name</label>
              <input
                type="text"
                placeholder="Enter rule name"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <textarea
                rows={3}
                placeholder="Describe what this rule does"
                className="w-full p-2 border border-gray-300 rounded-md"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Trigger</label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Zap className="w-4 h-4 text-blue-500" />
                    <span className="font-medium">Event</span>
                  </div>
                  <p className="text-sm text-gray-600">Triggered by specific events</p>
                </div>
                
                <div className="p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="w-4 h-4 text-green-500" />
                    <span className="font-medium">Schedule</span>
                  </div>
                  <p className="text-sm text-gray-600">Triggered by time/schedule</p>
                </div>
                
                <div className="p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="w-4 h-4 text-purple-500" />
                    <span className="font-medium">Condition</span>
                  </div>
                  <p className="text-sm text-gray-600">Triggered by conditions</p>
                </div>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Actions</label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: <Users className="w-4 h-4" />, name: 'Assignment', desc: 'Assign to team member' },
                  { icon: <Zap className="w-4 h-4" />, name: 'Notification', desc: 'Send notification' },
                  { icon: <Settings className="w-4 h-4" />, name: 'Status Change', desc: 'Change item status' },
                  { icon: <Workflow className="w-4 h-4" />, name: 'Webhook', desc: 'Call external API' },
                  { icon: <Calendar className="w-4 h-4" />, name: 'Email', desc: 'Send email' }
                ].map((action, index) => (
                  <div key={index} className="p-3 border rounded-lg cursor-pointer hover:border-blue-500">
                    <div className="flex items-center space-x-2 mb-2">
                      {action.icon}
                      <span className="font-medium">{action.name}</span>
                    </div>
                    <p className="text-sm text-gray-600">{action.desc}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Rule
              </Button>
              <Button variant="outline">
                Save as Template
              </Button>
            </div>
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
          <h2 className="text-2xl font-bold">Workflow Automation</h2>
          <p className="text-gray-600">Create and manage automated workflows for your agile processes</p>
        </div>
        <Button onClick={() => setShowBuilder(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Rule
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Workflow className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{rules.length}</div>
                <div className="text-sm text-gray-600">Active Rules</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {rules.reduce((sum, rule) => sum + rule.executionCount, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Executions</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <TrendingUp className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">
                  {Math.round(rules.reduce((sum, rule) => sum + rule.successRate, 0) / rules.length)}%
                </div>
                <div className="text-sm text-gray-600">Success Rate</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Zap className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">{templates.length}</div>
                <div className="text-sm text-gray-600">Templates</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'rules', label: 'Rules', icon: <Workflow className="w-4 h-4" /> },
          { key: 'templates', label: 'Templates', icon: <Settings className="w-4 h-4" /> },
          { key: 'logs', label: 'Logs', icon: <Clock className="w-4 h-4" /> },
          { key: 'builder', label: 'Builder', icon: <Plus className="w-4 h-4" /> }
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
      {activeTab === 'rules' && renderRules()}
      {activeTab === 'templates' && renderTemplates()}
      {activeTab === 'logs' && renderLogs()}
      {activeTab === 'builder' && renderBuilder()}
    </div>
  )
}

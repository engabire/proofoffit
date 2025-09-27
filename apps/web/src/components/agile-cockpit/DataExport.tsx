"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Download, 
  FileText, 
  Database, 
  Calendar, 
  Users, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from 'lucide-react'

interface ExportTemplate {
  id: string
  name: string
  description: string
  type: 'csv' | 'json' | 'xlsx' | 'pdf'
  category: 'metrics' | 'issues' | 'team' | 'reports'
  fields: string[]
  lastExported?: Date
  size?: string
}

interface ExportJob {
  id: string
  template: string
  status: 'pending' | 'processing' | 'completed' | 'failed'
  progress: number
  createdAt: Date
  completedAt?: Date
  downloadUrl?: string
  error?: string
}

export function DataExport() {
  const [templates, setTemplates] = useState<ExportTemplate[]>([])
  const [exportJobs, setExportJobs] = useState<ExportJob[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [dateRange, setDateRange] = useState({ start: '', end: '' })
  const [filters, setFilters] = useState({
    team: '',
    project: '',
    status: ''
  })

  React.useEffect(() => {
    loadTemplates()
    loadExportJobs()
  }, [])

  const loadTemplates = () => {
    const mockTemplates: ExportTemplate[] = [
      {
        id: '1',
        name: 'Sprint Metrics',
        description: 'Velocity, cycle time, and WIP data for selected sprints',
        type: 'csv',
        category: 'metrics',
        fields: ['sprint', 'velocity', 'cycle_time', 'wip_count', 'completed_items'],
        lastExported: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
        size: '2.3 MB'
      },
      {
        id: '2',
        name: 'Team Performance',
        description: 'Individual and team performance metrics over time',
        type: 'xlsx',
        category: 'team',
        fields: ['team_member', 'velocity', 'quality_score', 'satisfaction', 'efficiency'],
        lastExported: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
        size: '1.8 MB'
      },
      {
        id: '3',
        name: 'Issue Tracking',
        description: 'All issues with status, assignees, and resolution times',
        type: 'csv',
        category: 'issues',
        fields: ['issue_id', 'title', 'status', 'assignee', 'created_date', 'resolved_date'],
        lastExported: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
        size: '4.1 MB'
      },
      {
        id: '4',
        name: 'Monthly Report',
        description: 'Comprehensive monthly report with charts and analysis',
        type: 'pdf',
        category: 'reports',
        fields: ['executive_summary', 'metrics', 'charts', 'recommendations'],
        lastExported: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
        size: '5.2 MB'
      },
      {
        id: '5',
        name: 'Raw Data Export',
        description: 'Complete dataset in JSON format for custom analysis',
        type: 'json',
        category: 'metrics',
        fields: ['all_fields'],
        lastExported: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
        size: '12.7 MB'
      }
    ]
    setTemplates(mockTemplates)
  }

  const loadExportJobs = () => {
    const mockJobs: ExportJob[] = [
      {
        id: '1',
        template: 'Sprint Metrics',
        status: 'completed',
        progress: 100,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
        downloadUrl: '/exports/sprint-metrics-2024-01-15.csv'
      },
      {
        id: '2',
        template: 'Team Performance',
        status: 'processing',
        progress: 65,
        createdAt: new Date(Date.now() - 30 * 60 * 1000)
      },
      {
        id: '3',
        template: 'Issue Tracking',
        status: 'failed',
        progress: 0,
        createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        error: 'Insufficient permissions to access issue data'
      }
    ]
    setExportJobs(mockJobs)
  }

  const startExport = async (templateId: string) => {
    const template = templates.find(t => t.id === templateId)
    if (!template) return

    const newJob: ExportJob = {
      id: Date.now().toString(),
      template: template.name,
      status: 'pending',
      progress: 0,
      createdAt: new Date()
    }

    setExportJobs(prev => [newJob, ...prev])

    // Simulate export process
    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, status: 'processing', progress: 25 }
          : job
      ))
    }, 1000)

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { ...job, progress: 75 }
          : job
      ))
    }, 3000)

    setTimeout(() => {
      setExportJobs(prev => prev.map(job => 
        job.id === newJob.id 
          ? { 
              ...job, 
              status: 'completed', 
              progress: 100, 
              completedAt: new Date(),
              downloadUrl: `/exports/${template.name.toLowerCase().replace(/\s+/g, '-')}-${new Date().toISOString().split('T')[0]}.${template.type}`
            }
          : job
      ))
    }, 5000)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800'
      case 'processing': return 'bg-blue-100 text-blue-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'processing': return <Clock className="w-4 h-4 text-blue-500" />
      case 'pending': return <Clock className="w-4 h-4 text-yellow-500" />
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileText className="w-4 h-4 text-green-500" />
      case 'xlsx': return <FileText className="w-4 h-4 text-blue-500" />
      case 'pdf': return <FileText className="w-4 h-4 text-red-500" />
      case 'json': return <Database className="w-4 h-4 text-purple-500" />
      default: return <FileText className="w-4 h-4 text-gray-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Data Export</h2>
          <p className="text-gray-600">Export your Agile Cockpit data in various formats</p>
        </div>
        <Button>
          <Download className="w-4 h-4 mr-2" />
          Bulk Export
        </Button>
      </div>

      {/* Export Templates */}
      <Card>
        <CardHeader>
          <CardTitle>Export Templates</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {templates.map(template => (
              <div
                key={template.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedTemplate === template.id 
                    ? 'border-blue-500 bg-blue-50' 
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedTemplate(template.id)}
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-2">
                    {getTypeIcon(template.type)}
                    <h3 className="font-medium">{template.name}</h3>
                  </div>
                  <Badge variant="outline">{template.type.toUpperCase()}</Badge>
                </div>
                
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                
                <div className="space-y-2 text-xs text-gray-500">
                  <div>Fields: {template.fields.length} columns</div>
                  {template.lastExported && (
                    <div>Last exported: {template.lastExported.toLocaleDateString()}</div>
                  )}
                  {template.size && (
                    <div>Size: {template.size}</div>
                  )}
                </div>
                
                <div className="mt-3">
                  <Button
                    size="sm"
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation()
                      startExport(template.id)
                    }}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Export Options */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle>Export Options</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Date Range</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Start Date</label>
                    <input
                      type="date"
                      value={dateRange.start}
                      onChange={(e) => setDateRange(prev => ({ ...prev, start: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">End Date</label>
                    <input
                      type="date"
                      value={dateRange.end}
                      onChange={(e) => setDateRange(prev => ({ ...prev, end: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Filters</h4>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm font-medium mb-1">Team</label>
                    <select
                      value={filters.team}
                      onChange={(e) => setFilters(prev => ({ ...prev, team: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Teams</option>
                      <option value="engineering">Engineering</option>
                      <option value="product">Product</option>
                      <option value="design">Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Project</label>
                    <select
                      value={filters.project}
                      onChange={(e) => setFilters(prev => ({ ...prev, project: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Projects</option>
                      <option value="proofoffit">ProofOfFit</option>
                      <option value="agile-dashboard">Agile Dashboard</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Status</label>
                    <select
                      value={filters.status}
                      onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
                      className="w-full p-2 border border-gray-300 rounded-md"
                    >
                      <option value="">All Statuses</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="archived">Archived</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Export Jobs */}
      <Card>
        <CardHeader>
          <CardTitle>Export History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {exportJobs.length === 0 ? (
              <div className="text-center py-8">
                <Download className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Exports Yet</h3>
                <p className="text-gray-600">Start an export to see your history here.</p>
              </div>
            ) : (
              exportJobs.map(job => (
                <div key={job.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(job.status)}
                    <div>
                      <div className="font-medium text-sm">{job.template}</div>
                      <div className="text-xs text-gray-500">
                        Started: {job.createdAt.toLocaleString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    <Badge className={getStatusColor(job.status)}>
                      {job.status}
                    </Badge>
                    
                    {job.status === 'processing' && (
                      <div className="text-sm text-gray-600">
                        {job.progress}%
                      </div>
                    )}
                    
                    {job.status === 'completed' && job.downloadUrl && (
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4 mr-1" />
                        Download
                      </Button>
                    )}
                    
                    {job.status === 'failed' && job.error && (
                      <div className="text-xs text-red-600 max-w-xs">
                        {job.error}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Export Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Export Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">💡</span>
              </div>
              <div>
                <h4 className="font-medium">Large Datasets</h4>
                <p className="text-sm text-gray-600">For large exports, consider using date filters to reduce file size and processing time.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">📊</span>
              </div>
              <div>
                <h4 className="font-medium">Format Selection</h4>
                <p className="text-sm text-gray-600">CSV for spreadsheet analysis, JSON for custom processing, PDF for reports, XLSX for complex data.</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">⏰</span>
              </div>
              <div>
                <h4 className="font-medium">Scheduled Exports</h4>
                <p className="text-sm text-gray-600">Set up automated exports for regular reporting and data backup.</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

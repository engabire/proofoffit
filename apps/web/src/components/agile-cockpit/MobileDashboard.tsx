"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { Alert, AlertDescription } from '@proof-of-fit/ui'

interface AgileMetrics {
  totalItems: number
  backlogItems: number
  sprintItems: number
  inProgressItems: number
  doneItems: number
  wipTotal: number
  completionRate: number
  velocity: number
  cycleTime: number
}

interface ProjectItem {
  id: string
  title: string
  sprintStatus: 'Backlog' | 'This Sprint' | 'In Progress' | 'Done'
  repository: string
  assignees: string[]
  labels: string[]
  url: string
  createdAt: string
  updatedAt: string
}

export function MobileDashboard() {
  const [metrics, setMetrics] = useState<AgileMetrics | null>(null)
  const [recentItems, setRecentItems] = useState<ProjectItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'overview' | 'items' | 'metrics'>('overview')

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      setLoading(true)
      
      // Fetch metrics
      const metricsResponse = await fetch('/api/agile-cockpit/metrics')
      if (metricsResponse.ok) {
        const metricsData = await metricsResponse.json()
        setMetrics(metricsData)
      }

      // Fetch recent items
      const itemsResponse = await fetch('/api/agile-cockpit/items?limit=10')
      if (itemsResponse.ok) {
        const itemsData = await itemsResponse.json()
        setRecentItems(itemsData.items || [])
      }

    } catch (err) {
      setError('Failed to load dashboard data')
      console.error('Dashboard fetch error:', err)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Backlog': return 'bg-gray-100 text-gray-800'
      case 'This Sprint': return 'bg-blue-100 text-blue-800'
      case 'In Progress': return 'bg-yellow-100 text-yellow-800'
      case 'Done': return 'bg-green-100 text-green-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getWipStatus = () => {
    if (!metrics) return { status: 'unknown', message: 'No data' }
    
    if (metrics.wipTotal <= 5) {
      return { status: 'healthy', message: 'WIP is healthy' }
    } else if (metrics.wipTotal <= 8) {
      return { status: 'warning', message: 'WIP approaching limit' }
    } else {
      return { status: 'critical', message: 'WIP limit exceeded' }
    }
  }

  if (loading) {
    return (
      <div className="p-4 space-y-4">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <Button onClick={fetchDashboardData} className="mt-4">
          Retry
        </Button>
      </div>
    )
  }

  const wipStatus = getWipStatus()

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Agile Cockpit</h1>
        <p className="text-gray-600">Mobile Dashboard</p>
      </div>

      {/* WIP Status Alert */}
      {wipStatus.status !== 'healthy' && (
        <Alert className={`mb-4 ${
          wipStatus.status === 'critical' ? 'border-red-200 bg-red-50' : 'border-yellow-200 bg-yellow-50'
        }`}>
          <AlertDescription>
            {wipStatus.message} ({metrics?.wipTotal}/8)
          </AlertDescription>
        </Alert>
      )}

      {/* Tab Navigation */}
      <div className="flex space-x-1 mb-6 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('overview')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'overview'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Overview
        </button>
        <button
          onClick={() => setActiveTab('items')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'items'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Items
        </button>
        <button
          onClick={() => setActiveTab('metrics')}
          className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'metrics'
              ? 'bg-white text-gray-900 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          Metrics
        </button>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-4">
          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-600">
                  {metrics?.totalItems || 0}
                </div>
                <div className="text-sm text-gray-600">Total Items</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-600">
                  {metrics?.doneItems || 0}
                </div>
                <div className="text-sm text-gray-600">Completed</div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Sprint Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Completion Rate</span>
                  <span>{metrics?.completionRate || 0}%</span>
                </div>
                <Progress value={metrics?.completionRate || 0} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Status Breakdown */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Status Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                    <span className="text-sm">Backlog</span>
                  </div>
                  <Badge variant="secondary">{metrics?.backlogItems || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                    <span className="text-sm">This Sprint</span>
                  </div>
                  <Badge variant="secondary">{metrics?.sprintItems || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <span className="text-sm">In Progress</span>
                  </div>
                  <Badge variant="secondary">{metrics?.inProgressItems || 0}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <span className="text-sm">Done</span>
                  </div>
                  <Badge variant="secondary">{metrics?.doneItems || 0}</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Items Tab */}
      {activeTab === 'items' && (
        <div className="space-y-4">
          {recentItems.map((item) => (
            <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="space-y-2">
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {item.title}
                    </h3>
                    <Badge className={`ml-2 ${getStatusColor(item.sprintStatus)}`}>
                      {item.sprintStatus}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {item.repository}
                  </div>
                  {item.assignees.length > 0 && (
                    <div className="text-sm text-gray-500">
                      👤 {item.assignees.join(', ')}
                    </div>
                  )}
                  {item.labels.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {item.labels.slice(0, 3).map((label) => (
                        <Badge key={label} variant="outline" className="text-xs">
                          {label}
                        </Badge>
                      ))}
                      {item.labels.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{item.labels.length - 3}
                        </Badge>
                      )}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
          
          {recentItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="text-gray-500">No items found</div>
              </CardContent>
            </Card>
          )}
        </div>
      )}

      {/* Metrics Tab */}
      {activeTab === 'metrics' && (
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Velocity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {metrics?.velocity || 0}
              </div>
              <div className="text-sm text-gray-600">Items per sprint</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Cycle Time</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {metrics?.cycleTime || 0}
              </div>
              <div className="text-sm text-gray-600">Days average</div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">WIP Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Current WIP</span>
                  <span>{metrics?.wipTotal || 0}/8</span>
                </div>
                <Progress 
                  value={(metrics?.wipTotal || 0) * 12.5} 
                  className="h-2"
                />
                <div className={`text-sm ${
                  wipStatus.status === 'healthy' ? 'text-green-600' :
                  wipStatus.status === 'warning' ? 'text-yellow-600' :
                  'text-red-600'
                }`}>
                  {wipStatus.message}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Refresh Button */}
      <div className="mt-6">
        <Button 
          onClick={fetchDashboardData} 
          className="w-full"
          disabled={loading}
        >
          {loading ? 'Refreshing...' : 'Refresh Data'}
        </Button>
      </div>
    </div>
  )
}

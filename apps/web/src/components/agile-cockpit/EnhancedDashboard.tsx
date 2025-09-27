"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { 
  BarChart3, 
  Bell, 
  MessageCircle, 
  Building2, 
  Target, 
  Settings,
  TrendingUp,
  Users,
  Activity,
  Zap
} from 'lucide-react'
import { AdvancedCharts } from './AdvancedCharts'
import { SmartNotifications } from './SmartNotifications'
import { AIChatbot } from './AIChatbot'
import { MultiTenantDashboard } from './MultiTenantDashboard'
import { GoalTracking } from './GoalTracking'
import { BusinessIntelligence } from './BusinessIntelligence'

type DashboardView = 
  | 'overview' 
  | 'charts' 
  | 'notifications' 
  | 'chatbot' 
  | 'tenants' 
  | 'goals' 
  | 'business-intelligence'

export function EnhancedDashboard() {
  const [activeView, setActiveView] = useState<DashboardView>('overview')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const navigationItems = [
    {
      id: 'overview' as DashboardView,
      label: 'Overview',
      icon: <Activity className="w-5 h-5" />,
      description: 'Dashboard summary and key metrics'
    },
    {
      id: 'charts' as DashboardView,
      label: 'Advanced Charts',
      icon: <BarChart3 className="w-5 h-5" />,
      description: 'Velocity, cycle time, and WIP visualizations'
    },
    {
      id: 'notifications' as DashboardView,
      label: 'Smart Notifications',
      icon: <Bell className="w-5 h-5" />,
      description: 'Intelligent alerts and notifications'
    },
    {
      id: 'chatbot' as DashboardView,
      label: 'AI Assistant',
      icon: <MessageCircle className="w-5 h-5" />,
      description: 'AI-powered project management help'
    },
    {
      id: 'tenants' as DashboardView,
      label: 'Multi-Tenant',
      icon: <Building2 className="w-5 h-5" />,
      description: 'Organization and team management'
    },
    {
      id: 'goals' as DashboardView,
      label: 'Goal Tracking',
      icon: <Target className="w-5 h-5" />,
      description: 'OKRs and objective management'
    },
    {
      id: 'business-intelligence' as DashboardView,
      label: 'Business Intelligence',
      icon: <TrendingUp className="w-5 h-5" />,
      description: 'Advanced analytics and insights'
    }
  ]

  const renderOverview = () => (
    <div className="space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">8.5</div>
                <div className="text-sm text-gray-600">Velocity (points/sprint)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <Activity className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">2.3</div>
                <div className="text-sm text-gray-600">Cycle Time (days)</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Users className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">8</div>
                <div className="text-sm text-gray-600">WIP Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-purple-100 rounded-lg">
                <Zap className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">94%</div>
                <div className="text-sm text-gray-600">Quality Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {navigationItems.slice(1).map(item => (
              <Button
                key={item.id}
                variant="outline"
                className="h-auto p-4 flex flex-col items-center space-y-2"
                onClick={() => setActiveView(item.id)}
              >
                {item.icon}
                <span className="text-sm font-medium">{item.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { action: 'Sprint completed', time: '2 hours ago', status: 'success' },
              { action: 'WIP limit exceeded', time: '4 hours ago', status: 'warning' },
              { action: 'New objective added', time: '1 day ago', status: 'info' },
              { action: 'Team velocity updated', time: '2 days ago', status: 'info' }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-green-500' :
                    activity.status === 'warning' ? 'bg-yellow-500' : 'bg-blue-500'
                  }`}></div>
                  <span className="text-sm font-medium">{activity.action}</span>
                </div>
                <span className="text-xs text-gray-500">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderActiveView = () => {
    switch (activeView) {
      case 'overview':
        return renderOverview()
      case 'charts':
        return <AdvancedCharts />
      case 'notifications':
        return <SmartNotifications />
      case 'chatbot':
        return (
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-blue-500 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">AI Assistant</h3>
            <p className="text-gray-600 mb-4">The AI chatbot is available in the bottom-right corner of your screen.</p>
            <Button onClick={() => setActiveView('overview')}>
              Back to Overview
            </Button>
          </div>
        )
      case 'tenants':
        return <MultiTenantDashboard />
      case 'goals':
        return <GoalTracking />
      case 'business-intelligence':
        return <BusinessIntelligence />
      default:
        return renderOverview()
    }
  }

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`${sidebarCollapsed ? 'w-16' : 'w-64'} bg-white shadow-lg transition-all duration-300 flex flex-col`}>
        <div className="p-4 border-b">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold text-gray-900">Agile Cockpit</h1>
            )}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              <Settings className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map(item => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 p-3 rounded-lg transition-colors ${
                  activeView === item.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                title={sidebarCollapsed ? item.label : undefined}
              >
                {item.icon}
                {!sidebarCollapsed && (
                  <div className="flex-1 text-left">
                    <div className="font-medium">{item.label}</div>
                    <div className="text-xs text-gray-500">{item.description}</div>
                  </div>
                )}
              </button>
            ))}
          </div>
        </nav>
        
        {!sidebarCollapsed && (
          <div className="p-4 border-t">
            <div className="text-xs text-gray-500">
              <div>Agile Cockpit v2.0</div>
              <div>Enhanced Dashboard</div>
            </div>
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 capitalize">
                {activeView.replace('-', ' ')}
              </h2>
              <p className="text-gray-600">
                {navigationItems.find(item => item.id === activeView)?.description}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                All Systems Operational
              </Badge>
              <Button variant="outline" size="sm">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </Button>
            </div>
          </div>
        </header>
        
        <main className="flex-1 overflow-y-auto p-6">
          {renderActiveView()}
        </main>
      </div>

      {/* AI Chatbot - Always available */}
      <AIChatbot />
    </div>
  )
}

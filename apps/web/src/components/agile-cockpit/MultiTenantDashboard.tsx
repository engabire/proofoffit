"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { 
  Building2, 
  Users, 
  BarChart3, 
  Settings, 
  Plus, 
  Eye, 
  Edit, 
  Trash2,
  Shield,
  Globe,
  Lock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react'

interface Tenant {
  id: string
  name: string
  domain: string
  status: 'active' | 'inactive' | 'suspended'
  plan: 'free' | 'pro' | 'enterprise'
  users: number
  maxUsers: number
  projects: number
  lastActivity: Date
  createdAt: Date
  features: string[]
  usage: {
    apiCalls: number
    storage: number
    bandwidth: number
  }
  limits: {
    apiCalls: number
    storage: number
    bandwidth: number
  }
}

interface Project {
  id: string
  name: string
  tenantId: string
  status: 'active' | 'archived'
  teamSize: number
  velocity: number
  lastSprint: Date
}

export function MultiTenantDashboard() {
  const [tenants, setTenants] = useState<Tenant[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [selectedTenant, setSelectedTenant] = useState<string | null>(null)
  const [showCreateTenant, setShowCreateTenant] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchTenantData()
  }, [])

  const fetchTenantData = async () => {
    try {
      setLoading(true)
      
      // Mock tenant data
      const mockTenants: Tenant[] = [
        {
          id: '1',
          name: 'Acme Corporation',
          domain: 'acme.com',
          status: 'active',
          plan: 'enterprise',
          users: 45,
          maxUsers: 100,
          projects: 8,
          lastActivity: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          createdAt: new Date('2024-01-15'),
          features: ['Advanced Analytics', 'Custom Fields', 'API Access', 'Priority Support'],
          usage: {
            apiCalls: 125000,
            storage: 2.5,
            bandwidth: 15.8
          },
          limits: {
            apiCalls: 500000,
            storage: 10,
            bandwidth: 100
          }
        },
        {
          id: '2',
          name: 'TechStart Inc',
          domain: 'techstart.io',
          status: 'active',
          plan: 'pro',
          users: 12,
          maxUsers: 25,
          projects: 3,
          lastActivity: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
          createdAt: new Date('2024-02-20'),
          features: ['Advanced Analytics', 'Custom Fields'],
          usage: {
            apiCalls: 45000,
            storage: 0.8,
            bandwidth: 3.2
          },
          limits: {
            apiCalls: 100000,
            storage: 5,
            bandwidth: 25
          }
        },
        {
          id: '3',
          name: 'DevTeam Solutions',
          domain: 'devteam.dev',
          status: 'active',
          plan: 'free',
          users: 3,
          maxUsers: 5,
          projects: 1,
          lastActivity: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
          createdAt: new Date('2024-03-10'),
          features: ['Basic Analytics'],
          usage: {
            apiCalls: 8500,
            storage: 0.2,
            bandwidth: 0.8
          },
          limits: {
            apiCalls: 10000,
            storage: 1,
            bandwidth: 5
          }
        },
        {
          id: '4',
          name: 'Global Systems',
          domain: 'globalsys.com',
          status: 'suspended',
          plan: 'pro',
          users: 0,
          maxUsers: 50,
          projects: 0,
          lastActivity: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          createdAt: new Date('2024-01-05'),
          features: ['Advanced Analytics', 'Custom Fields', 'API Access'],
          usage: {
            apiCalls: 0,
            storage: 0,
            bandwidth: 0
          },
          limits: {
            apiCalls: 200000,
            storage: 10,
            bandwidth: 50
          }
        }
      ]

      const mockProjects: Project[] = [
        { id: '1', name: 'E-commerce Platform', tenantId: '1', status: 'active', teamSize: 8, velocity: 12, lastSprint: new Date() },
        { id: '2', name: 'Mobile App', tenantId: '1', status: 'active', teamSize: 6, velocity: 9, lastSprint: new Date() },
        { id: '3', name: 'API Gateway', tenantId: '2', status: 'active', teamSize: 4, velocity: 7, lastSprint: new Date() },
        { id: '4', name: 'Web Dashboard', tenantId: '3', status: 'active', teamSize: 3, velocity: 5, lastSprint: new Date() }
      ]

      setTenants(mockTenants)
      setProjects(mockProjects)

    } catch (error) {
      console.error('Error fetching tenant data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800'
      case 'inactive': return 'bg-gray-100 text-gray-800'
      case 'suspended': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan: string) => {
    switch (plan) {
      case 'enterprise': return 'bg-purple-100 text-purple-800'
      case 'pro': return 'bg-blue-100 text-blue-800'
      case 'free': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getUsagePercentage = (usage: number, limit: number) => {
    return Math.min((usage / limit) * 100, 100)
  }

  const getUsageColor = (percentage: number) => {
    if (percentage >= 90) return 'text-red-600'
    if (percentage >= 75) return 'text-yellow-600'
    return 'text-green-600'
  }

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const selectedTenantData = tenants.find(t => t.id === selectedTenant)
  const selectedTenantProjects = projects.filter(p => p.tenantId === selectedTenant)

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Multi-Tenant Management</h2>
          <p className="text-gray-600">Manage organizations, teams, and projects across all tenants</p>
        </div>
        <Button onClick={() => setShowCreateTenant(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Tenant
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Building2 className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{tenants.length}</div>
                <div className="text-sm text-gray-600">Total Tenants</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Users className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {tenants.reduce((sum, tenant) => sum + tenant.users, 0)}
                </div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <BarChart3 className="w-8 h-8 text-purple-500" />
              <div>
                <div className="text-2xl font-bold">{projects.length}</div>
                <div className="text-sm text-gray-600">Active Projects</div>
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
                  {tenants.filter(t => t.status === 'active').length}
                </div>
                <div className="text-sm text-gray-600">Active Tenants</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tenants List */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {tenants.map(tenant => (
                  <div
                    key={tenant.id}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedTenant === tenant.id ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedTenant(tenant.id)}
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <Building2 className="w-5 h-5 text-gray-500" />
                        <div>
                          <h3 className="font-medium">{tenant.name}</h3>
                          <p className="text-sm text-gray-600">{tenant.domain}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getStatusColor(tenant.status)}>
                          {tenant.status}
                        </Badge>
                        <Badge className={getPlanColor(tenant.plan)}>
                          {tenant.plan}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Users</div>
                        <div className="font-medium">{tenant.users}/{tenant.maxUsers}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Projects</div>
                        <div className="font-medium">{tenant.projects}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Last Activity</div>
                        <div className="font-medium">
                          {tenant.lastActivity.toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tenant Details */}
        <div>
          {selectedTenantData ? (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Building2 className="w-5 h-5" />
                    <span>{selectedTenantData.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Status</span>
                      <Badge className={getStatusColor(selectedTenantData.status)}>
                        {selectedTenantData.status}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Plan</span>
                      <Badge className={getPlanColor(selectedTenantData.plan)}>
                        {selectedTenantData.plan}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Created</span>
                      <span className="text-sm">{selectedTenantData.createdAt.toLocaleDateString()}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Last Activity</span>
                      <span className="text-sm">{selectedTenantData.lastActivity.toLocaleDateString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Usage & Limits</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>API Calls</span>
                        <span className={getUsageColor(getUsagePercentage(selectedTenantData.usage.apiCalls, selectedTenantData.limits.apiCalls))}>
                          {selectedTenantData.usage.apiCalls.toLocaleString()}/{selectedTenantData.limits.apiCalls.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(selectedTenantData.usage.apiCalls, selectedTenantData.limits.apiCalls)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Storage</span>
                        <span className={getUsageColor(getUsagePercentage(selectedTenantData.usage.storage, selectedTenantData.limits.storage))}>
                          {formatBytes(selectedTenantData.usage.storage * 1024 * 1024 * 1024)}/{formatBytes(selectedTenantData.limits.storage * 1024 * 1024 * 1024)}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(selectedTenantData.usage.storage, selectedTenantData.limits.storage)} className="h-2" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Bandwidth</span>
                        <span className={getUsageColor(getUsagePercentage(selectedTenantData.usage.bandwidth, selectedTenantData.limits.bandwidth))}>
                          {formatBytes(selectedTenantData.usage.bandwidth * 1024 * 1024 * 1024)}/{formatBytes(selectedTenantData.limits.bandwidth * 1024 * 1024 * 1024)}
                        </span>
                      </div>
                      <Progress value={getUsagePercentage(selectedTenantData.usage.bandwidth, selectedTenantData.limits.bandwidth)} className="h-2" />
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {selectedTenantData.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Edit className="w-4 h-4 mr-2" />
                      Edit Settings
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Manage Users
                    </Button>
                    {selectedTenantData.status === 'active' ? (
                      <Button variant="outline" size="sm" className="w-full text-orange-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Suspend
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="w-full text-green-600">
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Activate
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Building2 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Select a Tenant</h3>
                <p className="text-gray-600">Choose an organization to view details and manage settings.</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Projects for Selected Tenant */}
      {selectedTenantData && (
        <Card>
          <CardHeader>
            <CardTitle>Projects - {selectedTenantData.name}</CardTitle>
          </CardHeader>
          <CardContent>
            {selectedTenantProjects.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedTenantProjects.map(project => (
                  <div key={project.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium">{project.name}</h4>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Team Size</span>
                        <span>{project.teamSize} members</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Velocity</span>
                        <span>{project.velocity} points/sprint</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Last Sprint</span>
                        <span>{project.lastSprint.toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <BarChart3 className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No Projects</h3>
                <p className="text-gray-600">This organization doesn't have any projects yet.</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

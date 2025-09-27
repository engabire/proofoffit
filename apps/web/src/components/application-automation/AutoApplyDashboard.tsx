'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Switch } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { 
  Settings, 
  Play, 
  Pause, 
  BarChart3, 
  Clock, 
  CheckCircle, 
  XCircle,
  AlertCircle,
  TrendingUp,
  Target,
  MapPin,
  DollarSign,
  Filter
} from 'lucide-react'
import { useAuth } from '@/components/auth/auth-guard'
import { toast } from 'sonner'

interface AutoApplyConfig {
  userId: string
  enabled: boolean
  preferences: {
    jobTypes: string[]
    locations: string[]
    salaryMin?: number
    salaryMax?: number
    remoteOnly: boolean
    keywords: string[]
    excludeKeywords: string[]
    maxApplicationsPerDay: number
    maxApplicationsPerWeek: number
  }
  resumeTemplate: {
    id: string
    customizations: Record<string, any>
  }
  coverLetterTemplate: {
    id: string
    customizations: Record<string, any>
  }
  notificationSettings: {
    email: boolean
    inApp: boolean
    dailySummary: boolean
  }
}

interface ApplicationStats {
  total: number
  pending: number
  submitted: number
  reviewed: number
  interview: number
  rejected: number
  accepted: number
  thisWeek: number
  thisMonth: number
}

export function AutoApplyDashboard() {
  const { user } = useAuth()
  const [config, setConfig] = useState<AutoApplyConfig | null>(null)
  const [stats, setStats] = useState<ApplicationStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  useEffect(() => {
    if (user) {
      fetchAutoApplyData()
    }
  }, [user])

  const fetchAutoApplyData = async () => {
    try {
      const response = await fetch(`/api/applications/auto-apply?userId=${user?.id}`)
      const data = await response.json()
      
      if (data.config) {
        setConfig(data.config)
      } else {
        // Create default configuration
        const defaultConfig: AutoApplyConfig = {
          userId: user?.id || '',
          enabled: false,
          preferences: {
            jobTypes: ['full-time'],
            locations: [],
            remoteOnly: false,
            keywords: [],
            excludeKeywords: [],
            maxApplicationsPerDay: 5,
            maxApplicationsPerWeek: 20
          },
          resumeTemplate: {
            id: 'default',
            customizations: {}
          },
          coverLetterTemplate: {
            id: 'default',
            customizations: {}
          },
          notificationSettings: {
            email: true,
            inApp: true,
            dailySummary: true
          }
        }
        setConfig(defaultConfig)
      }
      
      setStats(data.stats)
    } catch (error) {
      console.error('Error fetching auto-apply data:', error)
      toast.error('Failed to load auto-apply data')
    } finally {
      setLoading(false)
    }
  }

  const saveConfiguration = async () => {
    if (!config) return

    setSaving(true)
    try {
      const response = await fetch('/api/applications/auto-apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_config',
          userId: user?.id,
          config
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success('Auto-apply configuration saved successfully')
        setShowSettings(false)
      } else {
        toast.error(data.error || 'Failed to save configuration')
      }
    } catch (error) {
      console.error('Error saving configuration:', error)
      toast.error('Failed to save configuration')
    } finally {
      setSaving(false)
    }
  }

  const toggleAutoApply = async () => {
    if (!config) return

    const updatedConfig = {
      ...config,
      enabled: !config.enabled
    }
    
    setConfig(updatedConfig)
    
    try {
      const response = await fetch('/api/applications/auto-apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'update_config',
          userId: user?.id,
          config: updatedConfig
        })
      })

      const data = await response.json()
      
      if (data.success) {
        toast.success(`Auto-apply ${updatedConfig.enabled ? 'enabled' : 'disabled'}`)
      } else {
        toast.error(data.error || 'Failed to update configuration')
        // Revert the change
        setConfig(config)
      }
    } catch (error) {
      console.error('Error toggling auto-apply:', error)
      toast.error('Failed to update configuration')
      setConfig(config)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (!config) {
    return (
      <div className="text-center p-8">
        <p className="text-gray-600">Failed to load auto-apply configuration</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Application Automation</h2>
          <p className="text-gray-600">Automatically apply to jobs that match your criteria</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Switch
              checked={config.enabled}
              onCheckedChange={toggleAutoApply}
            />
            <Label className="text-sm font-medium">
              {config.enabled ? 'Enabled' : 'Disabled'}
            </Label>
          </div>
          <Button
            variant="outline"
            onClick={() => setShowSettings(!showSettings)}
          >
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Status Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.total || 0}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.submitted || 0}</div>
                <div className="text-sm text-gray-600">Submitted</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.thisWeek || 0}</div>
                <div className="text-sm text-gray-600">This Week</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.thisMonth || 0}</div>
                <div className="text-sm text-gray-600">This Month</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card>
          <CardHeader>
            <CardTitle>Auto-Apply Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Job Preferences */}
            <div className="space-y-4">
              <h3 className="font-semibold">Job Preferences</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="salaryMin">Minimum Salary</Label>
                  <Input
                    id="salaryMin"
                    type="number"
                    value={config.preferences.salaryMin || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        salaryMin: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="e.g., 50000"
                  />
                </div>
                
                <div>
                  <Label htmlFor="salaryMax">Maximum Salary</Label>
                  <Input
                    id="salaryMax"
                    type="number"
                    value={config.preferences.salaryMax || ''}
                    onChange={(e) => setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        salaryMax: e.target.value ? parseInt(e.target.value) : undefined
                      }
                    })}
                    placeholder="e.g., 100000"
                  />
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  checked={config.preferences.remoteOnly}
                  onCheckedChange={(checked) => setConfig({
                    ...config,
                    preferences: {
                      ...config.preferences,
                      remoteOnly: checked
                    }
                  })}
                />
                <Label>Remote jobs only</Label>
              </div>
            </div>

            {/* Application Limits */}
            <div className="space-y-4">
              <h3 className="font-semibold">Application Limits</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="maxDaily">Max Applications Per Day</Label>
                  <Input
                    id="maxDaily"
                    type="number"
                    value={config.preferences.maxApplicationsPerDay}
                    onChange={(e) => setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        maxApplicationsPerDay: parseInt(e.target.value)
                      }
                    })}
                    min="1"
                    max="20"
                  />
                </div>
                
                <div>
                  <Label htmlFor="maxWeekly">Max Applications Per Week</Label>
                  <Input
                    id="maxWeekly"
                    type="number"
                    value={config.preferences.maxApplicationsPerWeek}
                    onChange={(e) => setConfig({
                      ...config,
                      preferences: {
                        ...config.preferences,
                        maxApplicationsPerWeek: parseInt(e.target.value)
                      }
                    })}
                    min="1"
                    max="100"
                  />
                </div>
              </div>
            </div>

            {/* Notification Settings */}
            <div className="space-y-4">
              <h3 className="font-semibold">Notifications</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.notificationSettings.email}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificationSettings: {
                        ...config.notificationSettings,
                        email: checked
                      }
                    })}
                  />
                  <Label>Email notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.notificationSettings.inApp}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificationSettings: {
                        ...config.notificationSettings,
                        inApp: checked
                      }
                    })}
                  />
                  <Label>In-app notifications</Label>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={config.notificationSettings.dailySummary}
                    onCheckedChange={(checked) => setConfig({
                      ...config,
                      notificationSettings: {
                        ...config.notificationSettings,
                        dailySummary: checked
                      }
                    })}
                  />
                  <Label>Daily summary</Label>
                </div>
              </div>
            </div>

            {/* Save Button */}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowSettings(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={saveConfiguration}
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Save Settings'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Current Status */}
      <Card>
        <CardHeader>
          <CardTitle>Current Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              {config.enabled ? (
                <Play className="w-5 h-5 text-green-600" />
              ) : (
                <Pause className="w-5 h-5 text-gray-400" />
              )}
              <span className="font-medium">
                Auto-apply is {config.enabled ? 'active' : 'inactive'}
              </span>
            </div>
            
            {config.enabled && (
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>
                    {config.preferences.remoteOnly ? 'Remote only' : 'All locations'}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <DollarSign className="w-4 h-4" />
                  <span>
                    {config.preferences.salaryMin && config.preferences.salaryMax
                      ? `$${config.preferences.salaryMin.toLocaleString()} - $${config.preferences.salaryMax.toLocaleString()}`
                      : 'Any salary'
                    }
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  <Filter className="w-4 h-4" />
                  <span>
                    {config.preferences.maxApplicationsPerDay} per day
                  </span>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

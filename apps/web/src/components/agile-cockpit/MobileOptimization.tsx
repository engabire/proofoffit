"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Smartphone, 
  Download, 
  Wifi, 
  WifiOff, 
  Battery, 
  BatteryLow,
  Sun,
  Moon,
  Eye,
  EyeOff,
  Volume2,
  VolumeX,
  Settings,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface PWACapabilities {
  installable: boolean
  offlineSupport: boolean
  pushNotifications: boolean
  backgroundSync: boolean
  cameraAccess: boolean
  geolocation: boolean
  deviceOrientation: boolean
}

interface MobileMetrics {
  performance: number
  accessibility: number
  pwaScore: number
  mobileUsability: number
  loadTime: number
  bundleSize: number
}

interface OfflineData {
  lastSync: Date
  cachedItems: number
  pendingActions: number
  storageUsed: number
  storageLimit: number
}

export function MobileOptimization() {
  const [capabilities, setCapabilities] = useState<PWACapabilities>({
    installable: false,
    offlineSupport: false,
    pushNotifications: false,
    backgroundSync: false,
    cameraAccess: false,
    geolocation: false,
    deviceOrientation: false
  })
  const [metrics, setMetrics] = useState<MobileMetrics>({
    performance: 0,
    accessibility: 0,
    pwaScore: 0,
    mobileUsability: 0,
    loadTime: 0,
    bundleSize: 0
  })
  const [offlineData, setOfflineData] = useState<OfflineData>({
    lastSync: new Date(),
    cachedItems: 0,
    pendingActions: 0,
    storageUsed: 0,
    storageLimit: 0
  })
  const [activeTab, setActiveTab] = useState<'pwa' | 'performance' | 'offline' | 'accessibility'>('pwa')
  const [isInstalled, setIsInstalled] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    loadMobileData()
    checkPWACapabilities()
    setupOnlineStatus()
  }, [])

  const loadMobileData = () => {
    // Mock mobile metrics
    const mockMetrics: MobileMetrics = {
      performance: 92,
      accessibility: 88,
      pwaScore: 95,
      mobileUsability: 90,
      loadTime: 1.2,
      bundleSize: 2.4
    }

    // Mock offline data
    const mockOfflineData: OfflineData = {
      lastSync: new Date(Date.now() - 30 * 60 * 1000),
      cachedItems: 156,
      pendingActions: 3,
      storageUsed: 45.2,
      storageLimit: 100
    }

    setMetrics(mockMetrics)
    setOfflineData(mockOfflineData)
  }

  const checkPWACapabilities = () => {
    // Mock PWA capabilities check
    const mockCapabilities: PWACapabilities = {
      installable: true,
      offlineSupport: true,
      pushNotifications: true,
      backgroundSync: true,
      cameraAccess: false,
      geolocation: false,
      deviceOrientation: true
    }

    setCapabilities(mockCapabilities)
  }

  const setupOnlineStatus = () => {
    setIsOnline(navigator.onLine)
    
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)
    
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }

  const installPWA = async () => {
    // Mock PWA installation
    try {
      // In a real implementation, you would use the beforeinstallprompt event
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsInstalled(true)
    } catch (error) {
      console.error('Failed to install PWA:', error)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreIcon = (score: number) => {
    if (score >= 90) return <CheckCircle className="w-4 h-4 text-green-500" />
    if (score >= 70) return <AlertTriangle className="w-4 h-4 text-yellow-500" />
    return <AlertTriangle className="w-4 h-4 text-red-500" />
  }

  const renderPWA = () => (
    <div className="space-y-4">
      {/* Installation Status */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Installation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Smartphone className="w-8 h-8 text-blue-500" />
              <div>
                <div className="font-medium">
                  {isInstalled ? 'App Installed' : 'Install Agile Cockpit'}
                </div>
                <div className="text-sm text-gray-600">
                  {isInstalled ? 'Ready to use offline' : 'Install for better mobile experience'}
                </div>
              </div>
            </div>
            {!isInstalled && (
              <Button onClick={installPWA}>
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* PWA Capabilities */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Capabilities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(capabilities).map(([key, enabled]) => (
              <div key={key} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  {enabled ? (
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-gray-400" />
                  )}
                  <span className="font-medium capitalize">
                    {key.replace(/([A-Z])/g, ' $1').trim()}
                  </span>
                </div>
                <Badge variant={enabled ? "default" : "secondary"}>
                  {enabled ? 'Enabled' : 'Disabled'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* PWA Features */}
      <Card>
        <CardHeader>
          <CardTitle>PWA Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { feature: 'Offline Support', description: 'Access core features without internet' },
              { feature: 'Push Notifications', description: 'Get real-time updates and alerts' },
              { feature: 'Background Sync', description: 'Sync data when connection is restored' },
              { feature: 'App-like Experience', description: 'Native app feel with web technology' },
              { feature: 'Fast Loading', description: 'Optimized for quick startup and navigation' }
            ].map((item, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                <div>
                  <div className="font-medium">{item.feature}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderPerformance = () => (
    <div className="space-y-4">
      {/* Performance Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Performance</span>
              {getScoreIcon(metrics.performance)}
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.performance)}`}>
              {metrics.performance}
            </div>
            <div className="text-xs text-gray-600">Lighthouse Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Accessibility</span>
              {getScoreIcon(metrics.accessibility)}
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.accessibility)}`}>
              {metrics.accessibility}
            </div>
            <div className="text-xs text-gray-600">A11y Score</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">PWA Score</span>
              {getScoreIcon(metrics.pwaScore)}
            </div>
            <div className={`text-2xl font-bold ${getScoreColor(metrics.pwaScore)}`}>
              {metrics.pwaScore}
            </div>
            <div className="text-xs text-gray-600">PWA Checklist</div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Details */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Load Time</span>
              <span className="text-sm text-gray-600">{metrics.loadTime}s</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Bundle Size</span>
              <span className="text-sm text-gray-600">{metrics.bundleSize} MB</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Mobile Usability</span>
              <span className="text-sm text-gray-600">{metrics.mobileUsability}%</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Optimization Tips</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { tip: 'Enable service worker for offline support', status: 'completed' },
              { tip: 'Optimize images and assets', status: 'completed' },
              { tip: 'Implement lazy loading', status: 'completed' },
              { tip: 'Add manifest.json for PWA', status: 'completed' },
              { tip: 'Minimize JavaScript bundle size', status: 'in-progress' },
              { tip: 'Implement code splitting', status: 'pending' }
            ].map((item, index) => (
              <div key={index} className="flex items-center space-x-3">
                {item.status === 'completed' ? (
                  <CheckCircle className="w-5 h-5 text-green-500" />
                ) : item.status === 'in-progress' ? (
                  <AlertTriangle className="w-5 h-5 text-yellow-500" />
                ) : (
                  <Info className="w-5 h-5 text-gray-400" />
                )}
                <span className="text-sm">{item.tip}</span>
                <Badge variant="outline" className="ml-auto">
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderOffline = () => (
    <div className="space-y-4">
      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {isOnline ? (
                <Wifi className="w-8 h-8 text-green-500" />
              ) : (
                <WifiOff className="w-8 h-8 text-red-500" />
              )}
              <div>
                <div className="font-medium">
                  {isOnline ? 'Online' : 'Offline'}
                </div>
                <div className="text-sm text-gray-600">
                  {isOnline ? 'Connected to internet' : 'Working offline'}
                </div>
              </div>
            </div>
            <Badge variant={isOnline ? "default" : "destructive"}>
              {isOnline ? 'Connected' : 'Offline'}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Offline Data */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Data</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Sync</span>
              <span className="text-sm text-gray-600">
                {offlineData.lastSync.toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Cached Items</span>
              <span className="text-sm text-gray-600">{offlineData.cachedItems}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Pending Actions</span>
              <span className="text-sm text-gray-600">{offlineData.pendingActions}</span>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Storage Used</span>
                <span>{offlineData.storageUsed} MB / {offlineData.storageLimit} MB</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-600 h-2 rounded-full" 
                  style={{ width: `${(offlineData.storageUsed / offlineData.storageLimit) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Offline Features */}
      <Card>
        <CardHeader>
          <CardTitle>Offline Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { feature: 'View Sprint Data', available: true },
              { feature: 'Check Team Status', available: true },
              { feature: 'Read Messages', available: true },
              { feature: 'Create Issues', available: false },
              { feature: 'Update Progress', available: false },
              { feature: 'Send Messages', available: false }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.feature}</span>
                <Badge variant={item.available ? "default" : "secondary"}>
                  {item.available ? 'Available' : 'Online Only'}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderAccessibility = () => (
    <div className="space-y-4">
      {/* Accessibility Score */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Score</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center">
            <div className={`text-4xl font-bold ${getScoreColor(metrics.accessibility)} mb-2`}>
              {metrics.accessibility}
            </div>
            <div className="text-sm text-gray-600 mb-4">Lighthouse Accessibility Score</div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-green-600 h-3 rounded-full" 
                style={{ width: `${metrics.accessibility}%` }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Features */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Features</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              { feature: 'Screen Reader Support', status: 'enabled' },
              { feature: 'Keyboard Navigation', status: 'enabled' },
              { feature: 'High Contrast Mode', status: 'enabled' },
              { feature: 'Large Text Support', status: 'enabled' },
              { feature: 'Voice Commands', status: 'disabled' },
              { feature: 'Gesture Navigation', status: 'enabled' }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <span className="text-sm">{item.feature}</span>
                <Badge variant={item.status === 'enabled' ? "default" : "secondary"}>
                  {item.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Accessibility Settings */}
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">High Contrast</span>
              <Button variant="outline" size="sm">
                <Sun className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Large Text</span>
              <Button variant="outline" size="sm">
                <Eye className="w-4 h-4" />
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Sound Effects</span>
              <Button variant="outline" size="sm">
                <Volume2 className="w-4 h-4" />
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
          <h2 className="text-2xl font-bold">Mobile Optimization</h2>
          <p className="text-gray-600">PWA features, performance, and accessibility for mobile devices</p>
        </div>
        <div className="flex items-center space-x-2">
          <Badge variant={isOnline ? "default" : "destructive"}>
            {isOnline ? 'Online' : 'Offline'}
          </Badge>
          <Button variant="outline">
            <Settings className="w-4 h-4 mr-2" />
            Settings
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'pwa', label: 'PWA', icon: <Smartphone className="w-4 h-4" /> },
          { key: 'performance', label: 'Performance', icon: <Battery className="w-4 h-4" /> },
          { key: 'offline', label: 'Offline', icon: <WifiOff className="w-4 h-4" /> },
          { key: 'accessibility', label: 'Accessibility', icon: <Eye className="w-4 h-4" /> }
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
      {activeTab === 'pwa' && renderPWA()}
      {activeTab === 'performance' && renderPerformance()}
      {activeTab === 'offline' && renderOffline()}
      {activeTab === 'accessibility' && renderAccessibility()}
    </div>
  )
}

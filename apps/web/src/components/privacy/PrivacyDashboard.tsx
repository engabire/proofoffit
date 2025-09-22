'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Shield, 
  Download, 
  Trash2, 
  Edit, 
  Eye, 
  Lock, 
  Globe, 
  Database,
  Clock,
  CheckCircle,
  AlertTriangle,
  Info
} from 'lucide-react'

interface PrivacyData {
  dataCategories: {
    account: { collected: boolean; shared: boolean; retention: string }
    profile: { collected: boolean; shared: boolean; retention: string }
    applications: { collected: boolean; shared: boolean; retention: string }
    usage: { collected: boolean; shared: boolean; retention: string }
    technical: { collected: boolean; shared: boolean; retention: string }
  }
  dataRequests: Array<{
    id: string
    type: string
    status: string
    date: string
    estimatedCompletion: string
  }>
  consentStatus: {
    analytics: boolean
    marketing: boolean
    automatedDecisions: boolean
    dataSharing: boolean
  }
  dataExports: Array<{
    id: string
    date: string
    format: string
    size: string
    downloadUrl: string
  }>
}

export default function PrivacyDashboard() {
  const [privacyData, setPrivacyData] = useState<PrivacyData>({
    dataCategories: {
      account: { collected: true, shared: false, retention: '7 years' },
      profile: { collected: true, shared: true, retention: '7 years' },
      applications: { collected: true, shared: true, retention: '3 years' },
      usage: { collected: true, shared: false, retention: '1 year' },
      technical: { collected: true, shared: false, retention: '1 year' }
    },
    dataRequests: [
      {
        id: 'DSR-20250115-001',
        type: 'export',
        status: 'completed',
        date: '2025-01-10',
        estimatedCompletion: '2025-01-24'
      }
    ],
    consentStatus: {
      analytics: true,
      marketing: false,
      automatedDecisions: true,
      dataSharing: true
    },
    dataExports: [
      {
        id: 'EXPORT-001',
        date: '2025-01-10',
        format: 'JSON',
        size: '2.3 MB',
        downloadUrl: '/api/download/export-001'
      }
    ]
  })

  const [loading, setLoading] = useState(false)

  const handleDataRequest = async (type: string) => {
    setLoading(true)
    try {
      const response = await fetch('/api/dsr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          type,
          reason: `User requested ${type} via privacy dashboard`
        })
      })
      
      if (response.ok) {
        const result = await response.json()
        alert(`Data request submitted successfully. Ticket ID: ${result.ticket_id}`)
        // Refresh data requests
        loadPrivacyData()
      } else {
        throw new Error('Failed to submit data request')
      }
    } catch (error) {
      console.error('Error submitting data request:', error)
      alert('Failed to submit data request. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const loadPrivacyData = async () => {
    try {
      // Replace with actual API calls
      // const [dataRequests, dataExports, consentStatus] = await Promise.all([
      //   fetch('/api/privacy/data-requests').then(r => r.json()),
      //   fetch('/api/privacy/data-exports').then(r => r.json()),
      //   fetch('/api/privacy/consent-status').then(r => r.json())
      // ])
      // setPrivacyData(prev => ({ ...prev, dataRequests, dataExports, consentStatus }))
    } catch (error) {
      console.error('Error loading privacy data:', error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'pending':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Info className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in_progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'pending':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-blue-100 text-blue-800'
    }
  }

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Privacy Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your personal data and privacy preferences
        </p>
      </div>

      <div className="grid gap-6">
        {/* Data Overview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5" />
              Your Data Overview
            </CardTitle>
            <CardDescription>
              Summary of the personal data we have about you
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {Object.entries(privacyData.dataCategories).map(([category, data]) => (
                <div key={category} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500" />
                    <span className="font-medium capitalize">{category} Data</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {data.shared && (
                      <Badge variant="outline" className="text-xs">
                        Shared
                      </Badge>
                    )}
                    <span className="text-sm text-muted-foreground">
                      Retained: {data.retention}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Data Rights Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your Data Rights
            </CardTitle>
            <CardDescription>
              Exercise your rights regarding your personal data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button
                variant="outline"
                onClick={() => handleDataRequest('export')}
                disabled={loading}
                className="justify-start"
              >
                <Download className="h-4 w-4 mr-2" />
                Export My Data
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleDataRequest('rectify')}
                disabled={loading}
                className="justify-start"
              >
                <Edit className="h-4 w-4 mr-2" />
                Correct My Data
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleDataRequest('restrict')}
                disabled={loading}
                className="justify-start"
              >
                <Lock className="h-4 w-4 mr-2" />
                Restrict Processing
              </Button>
              
              <Button
                variant="outline"
                onClick={() => handleDataRequest('object')}
                disabled={loading}
                className="justify-start"
              >
                <AlertTriangle className="h-4 w-4 mr-2" />
                Object to Processing
              </Button>
              
              <Button
                variant="destructive"
                onClick={() => handleDataRequest('delete')}
                disabled={loading}
                className="justify-start"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete My Account
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Requests Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Data Requests
            </CardTitle>
            <CardDescription>
              Track the status of your data subject requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            {privacyData.dataRequests.length > 0 ? (
              <div className="space-y-3">
                {privacyData.dataRequests.map((request) => (
                  <div key={request.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(request.status)}
                      <div>
                        <div className="font-medium">{request.id}</div>
                        <div className="text-sm text-muted-foreground">
                          {request.type} • {request.date}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(request.status)}>
                        {request.status}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Due: {request.estimatedCompletion}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No data requests submitted yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Data Exports */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data Exports
            </CardTitle>
            <CardDescription>
              Download your previously exported data
            </CardDescription>
          </CardHeader>
          <CardContent>
            {privacyData.dataExports.length > 0 ? (
              <div className="space-y-3">
                {privacyData.dataExports.map((export_) => (
                  <div key={export_.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="font-medium">{export_.id}</div>
                      <div className="text-sm text-muted-foreground">
                        {export_.format} • {export_.size} • {export_.date}
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(export_.downloadUrl, '_blank')}
                    >
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">
                No data exports available yet
              </div>
            )}
          </CardContent>
        </Card>

        {/* Consent Management */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Consent Management
            </CardTitle>
            <CardDescription>
              Manage your consent preferences
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(privacyData.consentStatus).map(([consent, status]) => (
                <div key={consent} className="flex items-center justify-between">
                  <div>
                    <div className="font-medium capitalize">
                      {consent.replace(/([A-Z])/g, ' $1').trim()}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {consent === 'analytics' && 'Allow us to analyze your usage to improve our services'}
                      {consent === 'marketing' && 'Send you marketing communications and updates'}
                      {consent === 'automatedDecisions' && 'Use AI to make automated decisions about your job matches'}
                      {consent === 'dataSharing' && 'Share your data with job board partners and employers'}
                    </div>
                  </div>
                  <Badge variant={status ? 'default' : 'secondary'}>
                    {status ? 'Enabled' : 'Disabled'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Privacy Resources */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Privacy Resources
            </CardTitle>
            <CardDescription>
              Learn more about your privacy rights and our practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              <Button
                variant="outline"
                onClick={() => window.open('/legal/privacy', '_blank')}
                className="justify-start"
              >
                <Info className="h-4 w-4 mr-2" />
                Privacy Notice
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/legal/ai-governance', '_blank')}
                className="justify-start"
              >
                <Shield className="h-4 w-4 mr-2" />
                AI Governance Policy
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/legal/terms-of-service', '_blank')}
                className="justify-start"
              >
                <Lock className="h-4 w-4 mr-2" />
                Terms of Service
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

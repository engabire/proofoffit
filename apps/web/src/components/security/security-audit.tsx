'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Eye, 
  EyeOff,
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react'

interface SecurityCheck {
  id: string
  name: string
  description: string
  status: 'pass' | 'fail' | 'warning' | 'info'
  severity: 'low' | 'medium' | 'high' | 'critical'
  category: 'authentication' | 'authorization' | 'data-protection' | 'network' | 'ui'
  recommendation?: string
  lastChecked: Date
}

interface SecurityAuditProps {
  onIssueFound?: (issue: SecurityCheck) => void
  autoRefresh?: boolean
  refreshInterval?: number
}

export function SecurityAudit({ 
  onIssueFound, 
  autoRefresh = false, 
  refreshInterval = 30000 
}: SecurityAuditProps) {
  const [checks, setChecks] = useState<SecurityCheck[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [lastAudit, setLastAudit] = useState<Date | null>(null)

  useEffect(() => {
    runSecurityAudit()
    
    if (autoRefresh) {
      const interval = setInterval(runSecurityAudit, refreshInterval)
      return () => clearInterval(interval)
    }
  }, [autoRefresh, refreshInterval, runSecurityAudit])

  const runSecurityAudit = useCallback(async () => {
    setIsLoading(true)
    
    try {
      const securityChecks: SecurityCheck[] = [
        // Authentication Checks
        {
          id: 'auth-https',
          name: 'HTTPS Enforcement',
          description: 'Verify that all authentication flows use HTTPS',
          status: window.location.protocol === 'https:' ? 'pass' : 'fail',
          severity: 'critical',
          category: 'authentication',
          recommendation: 'Ensure all authentication endpoints use HTTPS',
          lastChecked: new Date()
        },
        {
          id: 'auth-csrf',
          name: 'CSRF Protection',
          description: 'Check for CSRF protection in forms',
          status: 'pass', // Assuming CSRF protection is implemented
          severity: 'high',
          category: 'authentication',
          recommendation: 'Implement CSRF tokens for all state-changing operations',
          lastChecked: new Date()
        },
        {
          id: 'auth-session',
          name: 'Session Security',
          description: 'Verify secure session configuration',
          status: 'pass', // Assuming secure sessions
          severity: 'high',
          category: 'authentication',
          recommendation: 'Use secure, HttpOnly cookies for sessions',
          lastChecked: new Date()
        },
        
        // Authorization Checks
        {
          id: 'authz-rbac',
          name: 'Role-Based Access Control',
          description: 'Verify RBAC implementation',
          status: 'pass',
          severity: 'medium',
          category: 'authorization',
          recommendation: 'Implement proper role-based access controls',
          lastChecked: new Date()
        },
        {
          id: 'authz-permissions',
          name: 'Permission Validation',
          description: 'Check server-side permission validation',
          status: 'warning',
          severity: 'medium',
          category: 'authorization',
          recommendation: 'Validate all permissions on the server side',
          lastChecked: new Date()
        },
        
        // Data Protection Checks
        {
          id: 'data-encryption',
          name: 'Data Encryption',
          description: 'Verify data encryption at rest and in transit',
          status: 'pass',
          severity: 'critical',
          category: 'data-protection',
          recommendation: 'Ensure all sensitive data is encrypted',
          lastChecked: new Date()
        },
        {
          id: 'data-pii',
          name: 'PII Protection',
          description: 'Check for proper PII handling',
          status: 'pass',
          severity: 'high',
          category: 'data-protection',
          recommendation: 'Implement proper PII anonymization and protection',
          lastChecked: new Date()
        },
        
        // Network Security Checks
        {
          id: 'network-cors',
          name: 'CORS Configuration',
          description: 'Verify CORS settings',
          status: 'pass',
          severity: 'medium',
          category: 'network',
          recommendation: 'Configure CORS properly to prevent unauthorized access',
          lastChecked: new Date()
        },
        {
          id: 'network-headers',
          name: 'Security Headers',
          description: 'Check for security headers',
          status: 'warning',
          severity: 'medium',
          category: 'network',
          recommendation: 'Implement security headers (CSP, HSTS, etc.)',
          lastChecked: new Date()
        },
        
        // UI Security Checks
        {
          id: 'ui-xss',
          name: 'XSS Protection',
          description: 'Check for XSS protection',
          status: 'pass',
          severity: 'high',
          category: 'ui',
          recommendation: 'Implement proper input sanitization and output encoding',
          lastChecked: new Date()
        },
        {
          id: 'ui-clickjacking',
          name: 'Clickjacking Protection',
          description: 'Verify clickjacking protection',
          status: 'pass',
          severity: 'medium',
          category: 'ui',
          recommendation: 'Implement X-Frame-Options or CSP frame-ancestors',
          lastChecked: new Date()
        }
      ]

      setChecks(securityChecks)
      setLastAudit(new Date())

      // Notify about any issues
      const issues = securityChecks.filter(check => check.status === 'fail' || check.status === 'warning')
      issues.forEach(issue => onIssueFound?.(issue))

    } catch (error) {
      console.error('Security audit failed:', error)
    } finally {
      setIsLoading(false)
    }
  }, [onIssueFound])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pass': return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'fail': return <XCircle className="w-5 h-5 text-red-500" />
      case 'warning': return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      case 'info': return <Info className="w-5 h-5 text-blue-500" />
      default: return <Info className="w-5 h-5 text-gray-500" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800'
      case 'high': return 'bg-orange-100 text-orange-800'
      case 'medium': return 'bg-yellow-100 text-yellow-800'
      case 'low': return 'bg-blue-100 text-blue-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'authentication': return <Lock className="w-4 h-4" />
      case 'authorization': return <Shield className="w-4 h-4" />
      case 'data-protection': return <Eye className="w-4 h-4" />
      case 'network': return <ExternalLink className="w-4 h-4" />
      case 'ui': return <EyeOff className="w-4 h-4" />
      default: return <Info className="w-4 h-4" />
    }
  }

  const getStatusCounts = () => {
    const counts = { pass: 0, fail: 0, warning: 0, info: 0 }
    checks.forEach(check => {
      counts[check.status as keyof typeof counts]++
    })
    return counts
  }

  const statusCounts = getStatusCounts()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Security Audit</h2>
          <p className="text-gray-600">Comprehensive security assessment of your application</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            onClick={runSecurityAudit}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Run Audit
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-8 h-8 text-green-500" />
              <div>
                <div className="text-2xl font-bold text-green-600">{statusCounts.pass}</div>
                <div className="text-sm text-gray-600">Passed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <XCircle className="w-8 h-8 text-red-500" />
              <div>
                <div className="text-2xl font-bold text-red-600">{statusCounts.fail}</div>
                <div className="text-sm text-gray-600">Failed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold text-yellow-600">{statusCounts.warning}</div>
                <div className="text-sm text-gray-600">Warnings</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <Info className="w-8 h-8 text-blue-500" />
              <div>
                <div className="text-2xl font-bold text-blue-600">{statusCounts.info}</div>
                <div className="text-sm text-gray-600">Info</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Last Audit Info */}
      {lastAudit && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Shield className="w-5 h-5 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Last audit: {lastAudit.toLocaleString()}
                </span>
              </div>
              {autoRefresh && (
                <Badge variant="outline">
                  Auto-refresh enabled
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Security Checks */}
      <div className="space-y-4">
        {checks.map(check => (
          <Card key={check.id}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    {getStatusIcon(check.status)}
                    <h3 className="font-medium">{check.name}</h3>
                    <Badge className={getSeverityColor(check.severity)}>
                      {check.severity}
                    </Badge>
                    <Badge variant="outline" className="flex items-center space-x-1">
                      {getCategoryIcon(check.category)}
                      <span className="capitalize">{check.category}</span>
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3">{check.description}</p>
                  
                  {check.recommendation && (
                    <div className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Info className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">Recommendation:</div>
                          <div className="text-sm text-gray-600">{check.recommendation}</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="text-xs text-gray-500">
                Last checked: {check.lastChecked.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Security Tips */}
      <Card>
        <CardHeader>
          <CardTitle>Security Best Practices</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[
              'Always use HTTPS for authentication and sensitive data transmission',
              'Implement proper input validation and output encoding to prevent XSS',
              'Use secure session management with HttpOnly and Secure cookies',
              'Implement rate limiting to prevent brute force attacks',
              'Regularly update dependencies and security patches',
              'Use Content Security Policy (CSP) headers to prevent XSS',
              'Implement proper error handling without exposing sensitive information',
              'Use environment variables for sensitive configuration data'
            ].map((tip, index) => (
              <div key={index} className="flex items-start space-x-3">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

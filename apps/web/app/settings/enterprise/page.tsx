import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Switch } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Separator } from '@proof-of-fit/ui'
import { 
  Building2, 
  Shield, 
  Users, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Key,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { detectEnterpriseDomain, getEnterpriseBranding } from '@/lib/enterprise-domains'
import { isSupabaseConfigured } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function EnterpriseSettingsPage() {
  const userData = await getCurrentUserWithProfile()
  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies: async () => cookies() }) : null

  if (!userData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-12">
            <AlertCircle className="h-12 w-12 mx-auto text-red-500 mb-4" />
            <h3 className="text-lg font-medium mb-2">Authentication Required</h3>
            <p className="text-gray-600">Please sign in to access enterprise settings.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { user, profile } = userData
  const isEnterprise = user.email ? detectEnterpriseDomain(user.email) : null
  const enterpriseBranding = user.email ? getEnterpriseBranding(user.email) : null

  // Get user's enterprise settings
  const { data: enterpriseSettings } = supabase ? await supabase
    .from('enterprise_settings')
    .select('*')
    .eq('userId', user.id)
    .single() : { data: null }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Enterprise Settings</h1>
        <p className="text-muted-foreground">
          Manage your enterprise account and security preferences
        </p>
      </div>

      {/* Enterprise Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-blue-100">
              <Building2 className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <CardTitle>Enterprise Account Status</CardTitle>
              <CardDescription>
                Your account's enterprise configuration and benefits
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isEnterprise ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <div>
                    <p className="font-medium text-green-900">Enterprise Account Verified</p>
                    <p className="text-sm text-green-700">
                      {enterpriseBranding?.name} domain detected
                    </p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">
                  Active
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Enterprise Domain</Label>
                  <p className="text-sm text-gray-600">{isEnterprise.domain}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Company Name</Label>
                  <p className="text-sm text-gray-600">{isEnterprise.name}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">SSO Provider</Label>
                  <p className="text-sm text-gray-600 capitalize">{isEnterprise.ssoProvider}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Account Type</Label>
                  <p className="text-sm text-gray-600 capitalize">{profile?.role}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-between p-4 bg-yellow-50 rounded-lg">
              <div className="flex items-center space-x-3">
                <AlertCircle className="h-5 w-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Personal Account</p>
                  <p className="text-sm text-yellow-700">
                    Upgrade to enterprise for advanced features
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Upgrade to Enterprise
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Security Settings */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-red-100">
              <Shield className="h-6 w-6 text-red-600" />
            </div>
            <div>
              <CardTitle>Security & Authentication</CardTitle>
              <CardDescription>
                Manage your account security and authentication methods
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Multi-Factor Authentication */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Multi-Factor Authentication</Label>
                <p className="text-sm text-gray-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <Switch 
                checked={profile?.mfaEnabled || false}
                disabled={!isEnterprise}
              />
            </div>
            
            {!isEnterprise && (
              <div className="p-3 bg-yellow-50 rounded-lg">
                <p className="text-sm text-yellow-800">
                  MFA is available for enterprise accounts only. Upgrade to enable this feature.
                </p>
              </div>
            )}
          </div>

          <Separator />

          {/* SSO Configuration */}
          {isEnterprise && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label className="text-base font-medium">Single Sign-On (SSO)</Label>
                  <p className="text-sm text-gray-600">
                    Use your company's SSO for secure authentication
                  </p>
                </div>
                <Badge variant="secondary">
                  {isEnterprise.ssoProvider.toUpperCase()}
                </Badge>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">SSO Provider</Label>
                  <p className="text-sm text-gray-600 capitalize">{isEnterprise.ssoProvider}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">Last SSO Login</Label>
                  <p className="text-sm text-gray-600">
                    {profile?.lastLoginAt 
                      ? new Date(profile.lastLoginAt).toLocaleDateString()
                      : 'Never'
                    }
                  </p>
                </div>
              </div>
            </div>
          )}

          <Separator />

          {/* Session Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Session Management</Label>
                <p className="text-sm text-gray-600">
                  Control your active sessions and login history
                </p>
              </div>
              <Button variant="outline" size="sm">
                View Sessions
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Team Management */}
      {profile?.role === 'employer' && (
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-lg bg-purple-100">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage your team members and their access levels
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label className="text-base font-medium">Team Members</Label>
                <p className="text-sm text-gray-600">
                  Invite and manage team members for your organization
                </p>
              </div>
              <Button size="sm">
                Invite Members
              </Button>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">5</p>
                <p className="text-sm text-gray-600">Active Members</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">2</p>
                <p className="text-sm text-gray-600">Pending Invites</p>
              </div>
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-2xl font-bold">10</p>
                <p className="text-sm text-gray-600">Available Seats</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance & Audit */}
      <Card>
        <CardHeader>
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Lock className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <CardTitle>Compliance & Audit</CardTitle>
              <CardDescription>
                View audit logs and compliance reports for your organization
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Audit Logs</Label>
              <p className="text-sm text-gray-600">
                View all actions performed in your account
              </p>
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Logs
              </Button>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Compliance Reports</Label>
              <p className="text-sm text-gray-600">
                Download compliance and security reports
              </p>
              <Button variant="outline" size="sm">
                <Key className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

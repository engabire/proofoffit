import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  CheckCircle,
  Clock,
  XCircle,
  ExternalLink,
  Download,
  Eye,
  RefreshCw,
  FileText,
  Calendar,
  Building2,
  MapPin,
  DollarSign,
  Target
} from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function ApplicationsPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies: async () => cookies() }) : null

  // Get candidate applications
  const { data: applications } = supabase ? await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(*)
    `)
    .eq('candidateId', userData.profile?.id)
    .order('appliedAt', { ascending: false }) : { data: [] }

  // Mock application data for demo
  const mockApplications = [
    {
      id: 'app-1',
      job: {
        id: 'job-1',
        title: 'Senior Software Engineer',
        org: 'TechCorp',
        location: 'San Francisco, CA',
        source: 'usajobs',
        workType: 'remote',
        pay: { min: 120000, max: 180000, currency: 'USD' }
      },
      status: 'submitted',
      appliedAt: new Date('2024-01-15'),
      source: 'auto-apply',
      documents: {
        resume: 'tailored-resume.pdf',
        coverLetter: 'cover-letter.pdf'
      },
      externalId: 'usajobs-12345',
      metadata: {
        autoApplied: true,
        fitScore: 94
      }
    },
    {
      id: 'app-2',
      job: {
        id: 'job-2',
        title: 'Data Analyst',
        org: 'Metropolitan Council',
        location: 'Minneapolis, MN',
        source: 'usajobs',
        workType: 'onsite',
        pay: { min: 65000, max: 85000, currency: 'USD' }
      },
      status: 'pending',
      appliedAt: new Date('2024-01-12'),
      source: 'auto-apply',
      documents: {
        resume: 'tailored-resume.pdf',
        coverLetter: 'cover-letter.pdf'
      },
      externalId: 'usajobs-12346',
      metadata: {
        autoApplied: true,
        fitScore: 87
      }
    },
    {
      id: 'app-3',
      job: {
        id: 'job-3',
        title: 'Frontend Developer',
        org: 'StartupXYZ',
        location: 'Remote',
        source: 'linkedin',
        workType: 'remote',
        pay: { min: 80000, max: 120000, currency: 'USD' }
      },
      status: 'failed',
      appliedAt: new Date('2024-01-10'),
      source: 'manual',
      documents: {
        resume: 'generic-resume.pdf',
        coverLetter: 'cover-letter.pdf'
      },
      metadata: {
        autoApplied: false,
        fitScore: 82,
        error: 'Application submission failed'
      }
    }
  ]

  const allApplications = applications || mockApplications

  // Calculate statistics
  const totalApplications = allApplications.length
  const submittedApplications = allApplications.filter(app => app.status === 'submitted').length
  const pendingApplications = allApplications.filter(app => app.status === 'pending').length
  const failedApplications = allApplications.filter(app => app.status === 'failed').length
  const autoAppliedCount = allApplications.filter(app => app.metadata?.autoApplied).length

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'pending':
        return <Clock className="h-4 w-4 text-amber-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      default:
        return <Clock className="h-4 w-4 text-gray-600" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Badge variant="default" className="bg-green-100 text-green-800">Submitted</Badge>
      case 'pending':
        return <Badge variant="secondary" className="bg-amber-100 text-amber-800">Pending</Badge>
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>
      default:
        return <Badge variant="outline">Unknown</Badge>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Applications</h1>
          <p className="text-muted-foreground">
            Track your job applications and their status
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href="/candidate/matches">
              <Target className="h-4 w-4 mr-2" />
              Find More Jobs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/app/fit">
              <RefreshCw className="h-4 w-4 mr-2" />
              Create Fit Report
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Applications</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalApplications}</div>
            <p className="text-xs text-muted-foreground">
              All time
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Submitted</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{submittedApplications}</div>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 ? Math.round((submittedApplications / totalApplications) * 100) : 0}% success rate
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Applied</CardTitle>
            <RefreshCw className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{autoAppliedCount}</div>
            <p className="text-xs text-muted-foreground">
              {totalApplications > 0 ? Math.round((autoAppliedCount / totalApplications) * 100) : 0}% automated
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{pendingApplications}</div>
            <p className="text-xs text-muted-foreground">
              Awaiting response
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {allApplications.map((application) => (
          <Card key={application.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="space-y-3 flex-1">
                  <div className="flex items-center space-x-3">
                    {getStatusIcon(application.status)}
                    <h3 className="text-lg font-semibold">{application.job?.title}</h3>
                    {getStatusBadge(application.status)}
                    {application.metadata?.autoApplied && (
                      <Badge variant="outline" className="text-xs">
                        Auto-Applied
                      </Badge>
                    )}
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {application.job?.org}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.job?.location}
                    </div>
                    {application.job?.pay && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        ${application.job.pay.min?.toLocaleString()} - ${application.job.pay.max?.toLocaleString()}
                      </div>
                    )}
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {new Date(application.appliedAt).toLocaleDateString()}
                    </div>
                  </div>

                  {application.metadata?.fitScore && (
                    <div className="flex items-center space-x-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="text-sm font-medium">
                        Fit Score: {application.metadata.fitScore}%
                      </span>
                    </div>
                  )}

                  {application.status === 'failed' && application.metadata?.error && (
                    <div className="text-sm text-red-600 bg-red-50 p-2 rounded">
                      Error: {application.metadata.error}
                    </div>
                  )}

                  {application.externalId && (
                    <div className="text-sm text-muted-foreground">
                      External ID: {application.externalId}
                    </div>
                  )}
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <Button variant="outline" size="sm">
                    <Eye className="h-4 w-4 mr-2" />
                    View Job
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Documents
                  </Button>
                  {application.job?.source === 'usajobs' && application.externalId && (
                    <Button variant="outline" size="sm" asChild>
                      <Link 
                        href={`https://www.usajobs.gov/GetJob/ViewDetails/${application.externalId}`}
                        target="_blank"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        USAJOBS
                      </Link>
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {allApplications.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Start by finding jobs that match your profile
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button asChild>
                <Link href="/candidate/matches">Find Jobs</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/app/fit">Create Fit Report</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  Clock, 
  Target, 
  Plus,
  Eye,
  Download,
  ExternalLink,
  BarChart3,
  Calendar,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function EmployerDashboard() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies }) : null

  // Get employer statistics
  const { data: intakes } = supabase ? await supabase
    .from('employer_intakes')
    .select(`
      *,
      job:jobs(*),
      slates(*)
    `)
    .order('createdAt', { ascending: false }) : { data: [] }

  const { data: jobs } = supabase ? await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(10) : { data: [] }

  // Calculate statistics
  const totalIntakes = intakes?.length || 0
  const totalSlates = intakes?.reduce((sum, intake) => sum + (intake.slates?.length || 0), 0) || 0
  const totalCandidates = totalSlates * 5 // Assuming 5 candidates per slate on average
  const activeJobs = jobs?.filter(job => 
    new Date(job.createdAt) > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
  ).length || 0

  // Recent activity
  const recentIntakes = intakes?.slice(0, 3) || []
  const recentJobs = jobs?.slice(0, 5) || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Employer Dashboard</h1>
          <p className="text-muted-foreground">
            Manage your job postings and candidate slates
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href="/employer/jobs">
              <Briefcase className="h-4 w-4 mr-2" />
              Manage Jobs
            </Link>
          </Button>
          <Button asChild>
            <Link href="/employer/intake">
              <Plus className="h-4 w-4 mr-2" />
              Create Intake
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Intakes</CardTitle>
            <Briefcase className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalIntakes}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Candidate Slates</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSlates}</div>
            <p className="text-xs text-muted-foreground">
              {totalCandidates} total candidates
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Jobs</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              Posted in last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg. Fit Score</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">87%</div>
            <p className="text-xs text-muted-foreground">
              +5% from last month
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Intakes */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Clock className="h-5 w-5 mr-2" />
              Recent Intakes
            </CardTitle>
            <CardDescription>
              Your latest job intake requests
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentIntakes.map((intake) => (
                <div key={intake.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{intake.job?.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {intake.job?.org} • {intake.job?.location}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {intake.slates?.length || 0} slates
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {new Date(intake.createdAt).toLocaleDateString()}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/slates/${intake.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
              {recentIntakes.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Briefcase className="h-8 w-8 mx-auto mb-2" />
                  <p>No intakes yet</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/employer/intake">Create First Intake</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Recent Jobs */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="h-5 w-5 mr-2" />
              Recent Jobs
            </CardTitle>
            <CardDescription>
              Latest job postings in the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentJobs.map((job) => (
                <div key={job.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{job.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {job.org} • {job.location}
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {job.source}
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        {job.workType}
                      </Badge>
                      <Badge 
                        variant={job.tos?.allowed ? "default" : "destructive"} 
                        className="text-xs"
                      >
                        {job.tos?.allowed ? "Auto-apply" : "Manual"}
                      </Badge>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/employer/jobs/${job.id}`}>
                        <Eye className="h-4 w-4" />
                      </Link>
                    </Button>
                    {job.tos?.allowed && (
                      <Button variant="outline" size="sm">
                        <CheckCircle className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </div>
              ))}
              {recentJobs.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
                  <Target className="h-8 w-8 mx-auto mb-2" />
                  <p>No jobs found</p>
                  <Button variant="outline" size="sm" className="mt-2" asChild>
                    <Link href="/employer/jobs">Browse Jobs</Link>
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common tasks and shortcuts
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/employer/intake">
                <Plus className="h-6 w-6 mb-2" />
                Create Job Intake
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/employer/slates">
                <Users className="h-6 w-6 mb-2" />
                View Slates
              </Link>
            </Button>
            <Button variant="outline" className="h-20 flex-col" asChild>
              <Link href="/employer/analytics">
                <BarChart3 className="h-6 w-6 mb-2" />
                View Analytics
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


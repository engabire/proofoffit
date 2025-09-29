import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

type JobRecord = {
  id: string
  source: string
  org: string
  title: string
  location: string
  workType: string
  pay: { min?: number; max?: number; currency?: string } | null
  description: string
  requirements: { must_have?: string[]; preferred?: string[] } | null
  constraints: Record<string, unknown> | null
  tos: { allowed?: boolean; captcha?: boolean } | null
  createdAt: string
  fetchedAt?: string | null
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies }) : null

  // Get all jobs with pagination
  const { data: jobs, error } = supabase ? await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(50) : { data: [], error: null }

  if (error) {
    console.error('Error fetching jobs:', error)
  }

  const jobList: JobRecord[] = (jobs as JobRecord[] | null) ?? []

  // Group jobs by source for filtering
  const jobsBySource = jobList.reduce((acc, job) => {
    if (!acc[job.source]) {
      acc[job.source] = []
    }
    acc[job.source].push(job)
    return acc
  }, {} as Record<string, JobRecord[]>)

  const totalJobs = jobList.length
  const autoApplyJobs = jobList.filter(job => job.tos?.allowed).length
  const manualJobs = totalJobs - autoApplyJobs

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Job Management</h1>
          <p className="text-muted-foreground">
            Browse and manage job postings from various sources
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" asChild>
            <Link href="/employer/intake">
              <Plus className="h-4 w-4 mr-2" />
              Post New Job
            </Link>
          </Button>
          <Button asChild>
            <Link href="/api/jobs/refresh">
              <ExternalLink className="h-4 w-4 mr-2" />
              Refresh Feeds
            </Link>
          </Button>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalJobs}</div>
            <p className="text-xs text-muted-foreground">
              From {Object.keys(jobsBySource).length} sources
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Auto-Apply Jobs</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{autoApplyJobs}</div>
            <p className="text-xs text-muted-foreground">
              {totalJobs > 0 ? Math.round((autoApplyJobs / totalJobs) * 100) : 0}% of total
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Manual Jobs</CardTitle>
            <AlertCircle className="h-4 w-4 text-amber-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{manualJobs}</div>
            <p className="text-xs text-muted-foreground">
              Require manual application
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="h-5 w-5 mr-2" />
            Search Jobs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                placeholder="Search by title, company, or location..."
                className="w-full"
              />
            </div>
            <Button variant="outline">
              <Filter className="h-4 w-4 mr-2" />
              Filter
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Jobs by Source */}
      <div className="space-y-6">
        {Object.entries(jobsBySource).map(([source, sourceJobs]) => (
          <Card key={source}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center">
                    <Building2 className="h-5 w-5 mr-2" />
                    {source.charAt(0).toUpperCase() + source.slice(1)} Jobs
                  </CardTitle>
                  <CardDescription>
                    {sourceJobs.length} job{sourceJobs.length !== 1 ? 's' : ''} from {source}
                  </CardDescription>
                </div>
                <Badge variant="outline">
                  {sourceJobs.filter(job => job.tos?.allowed).length} auto-apply
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sourceJobs.slice(0, 5).map((job) => (
                  <div key={job.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-3">
                        <h3 className="font-semibold">{job.title}</h3>
                        <Badge 
                          variant={job.tos?.allowed ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {job.tos?.allowed ? "Auto-Apply" : "Manual"}
                        </Badge>
                        <Badge variant="outline" className="text-xs">
                          {job.workType}
                        </Badge>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.org}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        {job.pay && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            ${job.pay.min?.toLocaleString()} - ${job.pay.max?.toLocaleString()}
                          </div>
                        )}
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(job.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {job.description}
                      </p>
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
                      <Button variant="outline" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                {sourceJobs.length > 5 && (
                  <div className="text-center pt-4">
                    <Button variant="outline">
                      View All {sourceJobs.length} Jobs
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {totalJobs === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No jobs found</h3>
            <p className="text-muted-foreground mb-4">
              Start by refreshing job feeds or posting a new job
            </p>
            <div className="flex items-center justify-center space-x-3">
              <Button asChild>
                <Link href="/employer/intake">Post New Job</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/api/jobs/refresh">Refresh Feeds</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

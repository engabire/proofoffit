import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Building, MapPin, Clock, FileText, Eye, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function ApplicationsPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  // Only create Supabase client if environment variables are configured
  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies }) : null

  // Get candidate profile
  const { data: profile } = supabase ? await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('userId', userData.user.id)
    .single() : { data: null }

  // Get applications
  const { data: applications } = supabase ? await supabase
    .from('applications')
    .select(`
      *,
      job:jobs(*)
    `)
    .eq('candidateId', profile?.id)
    .order('createdAt', { ascending: false }) : { data: null }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300'
      case 'interview':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'declined':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      case 'hired':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300'
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return '📤'
      case 'interview':
        return '🎯'
      case 'declined':
        return '❌'
      case 'hired':
        return '🎉'
      default:
        return '⏳'
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Applications</h1>
        <p className="text-muted-foreground">
          Track your job applications and their status
        </p>
      </div>

      <div className="grid gap-6">
        {applications?.map((application) => (
          <Card key={application.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    {application.job?.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{application.job?.org}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{application.job?.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>
                        Applied {new Date(application.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{getStatusIcon(application.status)}</span>
                  <Badge className={getStatusColor(application.status)}>
                    {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2">Application Details</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Channel:</span>
                      <span className="capitalize">{application.channel.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Policy Decision:</span>
                      <span className="capitalize">
                        {application.policyDecision?.allowed ? 'Auto-apply' : 'Manual review'}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Last Updated:</span>
                      <span>{new Date(application.updatedAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="font-medium mb-2">Documents</h4>
                  <div className="space-y-2">
                    {application.documents?.resume && (
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Tailored Resume</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                    {application.documents?.coverLetter && (
                      <div className="flex items-center justify-between p-2 bg-muted rounded">
                        <div className="flex items-center space-x-2">
                          <FileText className="h-4 w-4" />
                          <span className="text-sm">Cover Letter</span>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Eye className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/candidate/applications/${application.id}`}>
                      View Details
                    </Link>
                  </Button>
                  {application.job && (
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/jobs/${application.job.id}`}>
                        <ExternalLink className="h-3 w-3 mr-2" />
                        View Job
                      </Link>
                    </Button>
                  )}
                </div>
                {application.status === 'interview' && (
                  <Button size="sm">
                    Schedule Interview
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {(!applications || applications.length === 0) && (
        <Card>
          <CardContent className="text-center py-12">
            <FileText className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No applications yet</h3>
            <p className="text-muted-foreground mb-4">
              Start applying to jobs to track your progress here
            </p>
            <Button asChild>
              <Link href="/candidate/matches">
                Find Jobs
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
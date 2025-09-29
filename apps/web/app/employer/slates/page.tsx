import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Users, Eye, Download, ExternalLink, Clock, Target } from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function SlatesPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  // Only create Supabase client if environment variables are configured
  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies }) : null

  // Get employer intakes with their slates
  const { data: intakes } = supabase ? await supabase
    .from('employer_intakes')
    .select(`
      *,
      job:jobs(*),
      slates(*)
    `)
    .order('createdAt', { ascending: false }) : { data: null }

  // Mock slate data (in real app, this would come from the slate service)
  const mockSlates = intakes?.map((intake) => ({
    id: `slate-${intake.id}`,
    intake,
    candidates: [
      {
        id: 'candidate-1',
        name: 'Sarah Johnson',
        email: 'sarah.j@example.com',
        fitScore: 94,
        explanations: [
          { criterion: 'React Experience', evidence: '6+ years React', score: 98 },
          { criterion: 'TypeScript', evidence: 'Advanced TypeScript', score: 92 },
          { criterion: 'Team Leadership', evidence: 'Led 8-person team', score: 89 }
        ],
        status: 'pending'
      },
      {
        id: 'candidate-2',
        name: 'Michael Chen',
        email: 'michael.c@example.com',
        fitScore: 87,
        explanations: [
          { criterion: 'React Experience', evidence: '4+ years React', score: 85 },
          { criterion: 'TypeScript', evidence: 'Intermediate TypeScript', score: 78 },
          { criterion: 'Healthcare Domain', evidence: '2 years healthcare', score: 95 }
        ],
        status: 'pending'
      },
      {
        id: 'candidate-3',
        name: 'Emily Rodriguez',
        email: 'emily.r@example.com',
        fitScore: 82,
        explanations: [
          { criterion: 'React Experience', evidence: '3+ years React', score: 80 },
          { criterion: 'TypeScript', evidence: 'Basic TypeScript', score: 70 },
          { criterion: 'UI/UX Design', evidence: 'Strong design skills', score: 95 }
        ],
        status: 'pending'
      }
    ],
    createdAt: new Date(),
    auditUrl: `https://audit.proofoffit.com/slates/slate-${intake.id}`
  })) || []

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Candidate Slates</h1>
          <p className="text-muted-foreground">
            AI-generated candidate recommendations with explanations
          </p>
        </div>
        <Button asChild>
          <Link href="/employer/intake">
            Create New Intake
          </Link>
        </Button>
      </div>

      <div className="grid gap-6">
        {mockSlates.map((slate) => (
          <Card key={slate.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">
                    {slate.intake.job?.title}
                  </CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <span>{slate.intake.job?.org}</span>
                    <span>•</span>
                    <span>{slate.intake.job?.location}</span>
                    <span>•</span>
                    <span>{slate.candidates.length} candidates</span>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge variant="secondary">
                    <Clock className="h-3 w-3 mr-1" />
                    {new Date(slate.createdAt).toLocaleDateString()}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Top Candidates */}
              <div>
                <h4 className="font-medium mb-3">Top Candidates</h4>
                <div className="space-y-3">
                  {slate.candidates.slice(0, 3).map((candidate, index) => (
                    <div key={candidate.id} className="p-4 border rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center space-x-2">
                            <span className="font-medium">{candidate.name}</span>
                            <Badge variant="outline" className="text-xs">
                              #{index + 1}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{candidate.email}</p>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            {candidate.explanations.slice(0, 2).map((exp, idx) => (
                              <span key={idx}>
                                {exp.criterion}: {exp.score}%
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-2">
                            <Target className="h-4 w-4 text-primary" />
                            <span className="text-lg font-bold text-primary">
                              {candidate.fitScore}%
                            </span>
                          </div>
                          <Badge 
                            variant={candidate.status === 'pending' ? 'secondary' : 'default'}
                            className="text-xs mt-1"
                          >
                            {candidate.status}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={`/employer/slates/${slate.id}`}>
                      <Eye className="h-4 w-4 mr-2" />
                      View Full Slate
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm">
                    <Download className="h-4 w-4 mr-2" />
                    Download Report
                  </Button>
                </div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" asChild>
                    <Link href={slate.auditUrl} target="_blank">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Audit Trail
                    </Link>
                  </Button>
                  <Button size="sm">
                    Schedule Interviews
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockSlates.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Users className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No slates yet</h3>
            <p className="text-muted-foreground mb-4">
              Create a job intake to generate your first candidate slate
            </p>
            <Button asChild>
              <Link href="/employer/intake">
                Create Job Intake
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { MapPin, Building, DollarSign, Clock, Target, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function JobMatchesPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  // Only create Supabase client if environment variables are configured
  const supabase = isSupabaseConfigured() ? createServerComponentClient({ cookies: async () => cookies() }) : null

  // Get candidate profile
  const { data: profile } = supabase ? await supabase
    .from('candidate_profiles')
    .select('*')
    .eq('userId', userData.user.id)
    .single() : { data: null }

  // Get recent jobs (in a real app, this would be filtered by matching algorithm)
  const { data: jobs } = supabase ? await supabase
    .from('jobs')
    .select('*')
    .order('createdAt', { ascending: false })
    .limit(10) : { data: null }

  // Mock matching scores (in real app, this would come from the ranker service)
  const mockMatches = jobs?.map((job, index) => {
    // Use deterministic scoring based on job ID to avoid hydration mismatch
    const seed = job.id.toString().charCodeAt(0) + index
    const deterministicScore = (seed % 40) + 60
    return {
      job,
      fitScore: deterministicScore, // 60-100%
      explanations: [
      {
        criterion: 'Frontend Development',
        evidence: '5+ years React experience',
        score: 95,
        strength: true
      },
      {
        criterion: 'TypeScript',
        evidence: 'Advanced TypeScript skills',
        score: 88,
        strength: true
      },
      {
        criterion: 'Team Leadership',
        evidence: 'Led team of 8 engineers',
        score: 92,
        strength: true
      }
    ],
    strengths: ['Strong technical background', 'Leadership experience', 'Modern tech stack'],
    gaps: ['Healthcare domain experience']
    }
  }) || []

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground">
          AI-powered job recommendations based on your profile
        </p>
      </div>

      <div className="grid gap-6">
        {mockMatches.map((match, index) => (
          <Card key={match.job.id} className="relative">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-xl">{match.job.title}</CardTitle>
                  <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                    <div className="flex items-center space-x-1">
                      <Building className="h-4 w-4" />
                      <span>{match.job.org}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <MapPin className="h-4 w-4" />
                      <span>{match.job.location}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{match.job.workType}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-2 mb-2">
                    <Target className="h-4 w-4 text-primary" />
                    <span className="text-2xl font-bold text-primary">{match.fitScore}%</span>
                  </div>
                  <Progress value={match.fitScore} className="w-24" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {match.job.description}
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                {/* Why This Match */}
                <div>
                  <h4 className="font-medium mb-2 flex items-center">
                    <CheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    Why This Match
                  </h4>
                  <div className="space-y-2">
                    {match.explanations.map((explanation, idx) => (
                      <div key={idx} className="p-2 bg-green-50 dark:bg-green-950 rounded">
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-medium">{explanation.criterion}</span>
                          <Badge variant="secondary" className="text-xs">
                            {explanation.score}%
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          {explanation.evidence}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Strengths & Gaps */}
                <div className="space-y-3">
                  <div>
                    <h4 className="font-medium mb-2 text-green-600">Strengths</h4>
                    <div className="space-y-1">
                      {match.strengths.map((strength, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                          <span className="text-sm">{strength}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2 text-amber-600">Areas to Highlight</h4>
                    <div className="space-y-1">
                      {match.gaps.map((gap, idx) => (
                        <div key={idx} className="flex items-center space-x-2">
                          <div className="w-1.5 h-1.5 bg-amber-500 rounded-full"></div>
                          <span className="text-sm">{gap}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t">
                <div className="flex items-center space-x-4">
                  <Button variant="outline" size="sm">
                    Save Job
                  </Button>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
                <Button asChild>
                  <Link href={`/candidate/apply/${match.job.id}`}>
                    Apply Now
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {mockMatches.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Target className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-lg font-medium mb-2">No matches yet</h3>
            <p className="text-muted-foreground mb-4">
              Complete your profile to get personalized job recommendations
            </p>
            <Button asChild>
              <Link href="/candidate/profile">
                Complete Profile
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
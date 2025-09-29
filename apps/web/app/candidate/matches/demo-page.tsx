import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Progress } from '@proof-of-fit/ui'
import { MapPin, Building, DollarSign, Clock, Target, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { demoMatches } from '@/lib/demo-data'

export default function JobMatchesDemoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Job Matches</h1>
        <p className="text-muted-foreground">
          AI-powered job recommendations based on your profile
        </p>
      </div>

      <div className="grid gap-6">
        {demoMatches.map((match, index) => (
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

      {/* Demo Notice */}
      <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950">
        <CardHeader>
          <CardTitle className="text-blue-800 dark:text-blue-200">AI-Powered Matching</CardTitle>
          <CardDescription className="text-blue-600 dark:text-blue-300">
            This demonstrates the ProofOfFit job matching algorithm
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-blue-700 dark:text-blue-300">
            The system analyzes your profile evidence bullets against job requirements to generate 
            fit scores and explanations. It identifies strengths and areas to highlight, helping 
            you understand why you're a good match for each position.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Users, Briefcase, TrendingUp, FileText } from 'lucide-react'

export default async function DashboardPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  const { user, profile } = userData
  const isCandidate = profile?.role === 'candidate'
  const isEmployer = profile?.role === 'employer'

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Welcome back, {user.email}</h1>
        <p className="text-muted-foreground">
          {isCandidate && "Let's find your next opportunity"}
          {isEmployer && "Let's find your next great hire"}
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {isCandidate && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Job Matches</CardTitle>
                <Briefcase className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +2 from last week
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Applications</CardTitle>
                <FileText className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">
                  3 pending review
                </p>
              </CardContent>
            </Card>
          </>
        )}

        {isEmployer && (
          <>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Slates</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  2 ready for review
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Interviews</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">12</div>
                <p className="text-xs text-muted-foreground">
                  +4 this week
                </p>
              </CardContent>
            </Card>
          </>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>
              Your latest updates and notifications
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Profile updated</p>
                  <p className="text-xs text-muted-foreground">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
                <div className="flex-1">
                  <p className="text-sm font-medium">New job match found</p>
                  <p className="text-xs text-muted-foreground">4 hours ago</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Common tasks and shortcuts
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {isCandidate && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    Update my profile
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    View job matches
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    Check applications
                  </button>
                </>
              )}
              {isEmployer && (
                <>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    Create job intake
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    Review candidate slates
                  </button>
                  <button className="w-full text-left p-2 rounded hover:bg-muted">
                    View analytics
                  </button>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
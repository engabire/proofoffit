import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { QuickActions } from '@/components/dashboard/quick-actions'
import Link from 'next/link'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Users, Briefcase, TrendingUp, FileText, Target, Megaphone, Clock3, Sparkles, GraduationCap, HelpingHand } from 'lucide-react'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    return <div>Loading...</div>
  }

  const { user, profile } = userData
  const isCandidate = profile?.role === 'candidate'
  const isEmployer = profile?.role === 'employer'

  const discoveryItems = [
    {
      title: 'Find New Clients',
      description: 'Match your services to open roles and curated buyers.',
      href: '/targets',
      icon: Target,
    },
    {
      title: 'Post a Job',
      description: 'Spin up a compliant intake form for your next hire.',
      href: '/employer/intake',
      icon: Briefcase,
    },
    {
      title: 'Promote a Slate',
      description: 'Share ranked candidates with stakeholders in one link.',
      href: '/analytics',
      icon: Megaphone,
    },
  ] as const

  const analyticsMetrics = [
    {
      label: 'Profile views',
      value: '24',
      change: '+12% vs last week',
      icon: Users,
    },
    {
      label: 'Slate engagement',
      value: '68%',
      change: '+8 pts on average',
      icon: TrendingUp,
    },
    {
      label: 'Response time',
      value: '2.3 hrs',
      change: '-30% faster replies',
      icon: Clock3,
    },
  ] as const

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
            <QuickActions role={isCandidate ? 'candidate' : isEmployer ? 'employer' : undefined} />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Opportunity Discovery</CardTitle>
            <CardDescription>
              Borrow LinkedIn-style discovery to jump into revenue and recruiting workflows.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
              {discoveryItems.map((item) => (
                <div
                  key={item.title}
                  className="rounded-lg border bg-muted/20 p-4 transition-colors hover:border-primary"
                >
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <item.icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
                  <Button asChild variant="outline" size="sm" className="mt-3">
                    <Link href={item.href}>Open</Link>
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Get started with Premium</CardTitle>
            <CardDescription>
              Unlock automation, advanced analytics, and white-glove support.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 rounded-lg border border-primary/50 bg-primary/10 p-3">
              <Sparkles className="h-5 w-5 text-primary" aria-hidden="true" />
              <div>
                <p className="text-sm font-medium">Premium Autopilot</p>
                <p className="text-xs text-muted-foreground">
                  Bring criteria-driven scoring, audit coverage, and dedicated advisors to every search.
                </p>
              </div>
            </div>
            <Button asChild className="w-full">
              <Link href="/pricing">Explore Premium plans</Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link href="/contact">Talk with our team</Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Performance Analytics</CardTitle>
            <CardDescription>
              Monitor visibility and engagement across your ProofOfFit footprint.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              {analyticsMetrics.map((metric) => (
                <div key={metric.label} className="rounded-lg border bg-background p-4 shadow-sm">
                  <div className="flex items-center justify-between text-sm font-medium">
                    {metric.label}
                    <metric.icon className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <div className="mt-2 text-2xl font-semibold">{metric.value}</div>
                  <div className="text-xs text-muted-foreground">{metric.change}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Learning & Partnerships</CardTitle>
            <CardDescription>
              Extend your team with curated experts and structured lessons.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-3 rounded-lg border p-3">
              <HelpingHand className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium">Services Marketplace</p>
                <p className="text-xs text-muted-foreground">
                  Pair with vetted consultants to accelerate hiring programs.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/contact">Meet specialists</Link>
                </Button>
              </div>
            </div>
            <div className="flex gap-3 rounded-lg border p-3">
              <GraduationCap className="h-5 w-5 text-primary" aria-hidden="true" />
              <div className="flex-1">
                <p className="text-sm font-medium">Learning Paths</p>
                <p className="text-xs text-muted-foreground">
                  Work through compliance, structured interviewing, and ROI playbooks.
                </p>
                <Button asChild variant="outline" size="sm" className="mt-2">
                  <Link href="/fairness">Browse playbooks</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

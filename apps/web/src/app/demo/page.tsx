import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { 
  Users, 
  Target, 
  FileText, 
  Shield, 
  Zap, 
  CheckCircle,
  ArrowRight,
  Building,
  User,
  Settings,
  BarChart3
} from 'lucide-react'
import Link from 'next/link'

export default function DemoPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PF</span>
            </div>
            <span className="font-bold text-xl">ProofOfFit</span>
          </div>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary">Demo Mode</Badge>
            <Button asChild>
              <Link href="/">Back to Landing</Link>
            </Button>
          </div>
        </div>
      </header>

      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center space-y-6 mb-16">
          <h1 className="text-4xl font-bold tracking-tight">
            ProofOfFit.com Demo
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Experience the future of hiring with AI-powered matching, explainable results, and bias-free recruitment.
          </p>
          <div className="flex justify-center gap-4">
            <Button size="lg" asChild>
              <Link href="/demo/candidate">
                <User className="h-4 w-4 mr-2" />
                Try as Candidate
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link href="/demo/employer">
                <Building className="h-4 w-4 mr-2" />
                Try as Employer
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3 mb-16">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Target className="h-5 w-5 text-primary" />
                <CardTitle>AI-Powered Matching</CardTitle>
              </div>
              <CardDescription>
                Advanced algorithms match candidates to jobs with explainable fit scores
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Evidence-based matching</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Fit score explanations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Strength identification</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <FileText className="h-5 w-5 text-primary" />
                <CardTitle>Document Tailoring</CardTitle>
              </div>
              <CardDescription>
                AI generates tailored resumes and cover letters for each application
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Job-specific resumes</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Evidence citations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Professional formatting</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-5 w-5 text-primary" />
                <CardTitle>Compliance & Audit</CardTitle>
              </div>
              <CardDescription>
                Built-in compliance checking and immutable audit trails
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Policy enforcement</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Audit trails</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Bias monitoring</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5 text-primary" />
                <CardTitle>Candidate Slates</CardTitle>
              </div>
              <CardDescription>
                Employers get ranked candidate recommendations with explanations
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Ranked recommendations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Match explanations</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Audit URLs</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-5 w-5 text-primary" />
                <CardTitle>Automation Engine</CardTitle>
              </div>
              <CardDescription>
                Smart automation with human oversight and policy compliance
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Auto-apply decisions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>CAPTCHA detection</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Prep-and-confirm flows</span>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BarChart3 className="h-5 w-5 text-primary" />
                <CardTitle>Analytics & Insights</CardTitle>
              </div>
              <CardDescription>
                Comprehensive analytics for both candidates and employers
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Application tracking</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Performance metrics</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Usage analytics</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Demo Sections */}
        <div className="space-y-12">
          <div className="text-center">
            <h2 className="text-3xl font-bold mb-4">Try the Demo</h2>
            <p className="text-muted-foreground mb-8">
              Experience the key features of ProofOfFit.com
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            {/* Candidate Demo */}
            <Card className="border-green-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-green-600" />
                  <CardTitle className="text-green-800">Candidate Experience</CardTitle>
                </div>
                <CardDescription>
                  See how candidates manage their profiles and find matching jobs
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Features to explore:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Profile management with evidence bullets</li>
                    <li>• AI-powered job matching with fit scores</li>
                    <li>• Application tracking and status updates</li>
                    <li>• Resume tailoring and document generation</li>
                  </ul>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/demo/candidate">
                    Try Candidate Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>

            {/* Employer Demo */}
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center space-x-2">
                  <Building className="h-5 w-5 text-blue-600" />
                  <CardTitle className="text-blue-800">Employer Experience</CardTitle>
                </div>
                <CardDescription>
                  See how employers create job intakes and receive candidate slates
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <h4 className="font-medium">Features to explore:</h4>
                  <ul className="text-sm space-y-1">
                    <li>• Job intake creation with requirements</li>
                    <li>• AI-generated candidate slates</li>
                    <li>• Match explanations and audit trails</li>
                    <li>• Analytics and performance tracking</li>
                  </ul>
                </div>
                <Button className="w-full" asChild>
                  <Link href="/demo/employer">
                    Try Employer Demo
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Technical Details */}
        <Card className="mt-16 border-purple-200 bg-purple-50 dark:bg-purple-950">
          <CardHeader>
            <CardTitle className="text-purple-800 dark:text-purple-200">Technical Architecture</CardTitle>
            <CardDescription className="text-purple-600 dark:text-purple-300">
              Built with modern technologies and best practices
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <h4 className="font-medium mb-2">Frontend</h4>
                <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• Next.js 14 with App Router</li>
                  <li>• React Server Components</li>
                  <li>• Tailwind CSS + shadcn/ui</li>
                  <li>• TypeScript for type safety</li>
                </ul>
              </div>
              <div>
                <h4 className="font-medium mb-2">Backend</h4>
                <ul className="text-sm space-y-1 text-purple-700 dark:text-purple-300">
                  <li>• Supabase (PostgreSQL + Auth)</li>
                  <li>• Row-level security (RLS)</li>
                  <li>• Immutable action logs</li>
                  <li>• Multi-tenant architecture</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Textarea } from '@proof-of-fit/ui'
import { 
  Plus, 
  Users, 
  Briefcase, 
  TrendingUp, 
  Eye, 
  MessageSquare,
  Star,
  Filter,
  Search,
  Download,
  Settings,
  BarChart3,
  Clock,
  CheckCircle,
  AlertCircle
} from 'lucide-react'
// import { useAuth } from '@/components/auth/auth-guard'
import { toast } from 'sonner'

interface JobPosting {
  id: string
  title: string
  company: string
  location: string
  type: string
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  benefits: string[]
  postedAt: Date
  status: 'draft' | 'active' | 'paused' | 'closed'
  applications: number
  views: number
  matches: number
}

interface Candidate {
  id: string
  name: string
  email: string
  title: string
  location: string
  experience: string
  skills: string[]
  fitScore: number
  appliedAt: Date
  status: 'new' | 'reviewed' | 'interview' | 'rejected' | 'hired'
  resumeUrl: string
  coverLetterUrl?: string
}

interface EmployerStats {
  totalJobs: number
  activeJobs: number
  totalApplications: number
  newApplications: number
  interviews: number
  hires: number
  avgFitScore: number
  responseTime: number
}

type BadgeVariant = React.ComponentProps<typeof Badge>['variant']

export function EmployerDashboard() {
  // const { user } = useAuth()
  const user = { id: 'demo-user', email: 'demo@example.com' }
  const [activeTab, setActiveTab] = useState<'overview' | 'jobs' | 'candidates' | 'analytics'>('overview')
  const [jobs, setJobs] = useState<JobPosting[]>([])
  const [candidates, setCandidates] = useState<Candidate[]>([])
  const [stats, setStats] = useState<EmployerStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [showJobForm, setShowJobForm] = useState(false)
  const [selectedJob, setSelectedJob] = useState<JobPosting | null>(null)

  // Mock data for demonstration
  useEffect(() => {
    const mockJobs: JobPosting[] = [
      {
        id: '1',
        title: 'Senior Software Engineer',
        company: 'TechCorp',
        location: 'San Francisco, CA',
        type: 'full-time',
        remote: true,
        salary: { min: 120000, max: 180000, currency: 'USD' },
        description: 'We are looking for a senior software engineer to join our team...',
        requirements: ['5+ years experience', 'React/Node.js', 'Cloud platforms'],
        benefits: ['Health insurance', 'Stock options', 'Remote work'],
        postedAt: new Date('2024-01-15'),
        status: 'active',
        applications: 45,
        views: 234,
        matches: 12
      },
      {
        id: '2',
        title: 'Product Manager',
        company: 'TechCorp',
        location: 'New York, NY',
        type: 'full-time',
        remote: false,
        salary: { min: 100000, max: 140000, currency: 'USD' },
        description: 'Lead product development for our core platform...',
        requirements: ['3+ years PM experience', 'Technical background', 'Analytics skills'],
        benefits: ['Health insurance', '401k', 'Flexible PTO'],
        postedAt: new Date('2024-01-20'),
        status: 'active',
        applications: 23,
        views: 156,
        matches: 8
      }
    ]

    const mockCandidates: Candidate[] = [
      {
        id: '1',
        name: 'John Smith',
        email: 'john@example.com',
        title: 'Senior Software Engineer',
        location: 'San Francisco, CA',
        experience: '6 years',
        skills: ['React', 'Node.js', 'AWS', 'TypeScript'],
        fitScore: 92,
        appliedAt: new Date('2024-01-22'),
        status: 'new',
        resumeUrl: '/resumes/john-smith.pdf',
        coverLetterUrl: '/cover-letters/john-smith.pdf'
      },
      {
        id: '2',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        title: 'Product Manager',
        location: 'New York, NY',
        experience: '4 years',
        skills: ['Product Management', 'Analytics', 'Agile', 'User Research'],
        fitScore: 88,
        appliedAt: new Date('2024-01-21'),
        status: 'reviewed',
        resumeUrl: '/resumes/sarah-johnson.pdf'
      }
    ]

    const mockStats: EmployerStats = {
      totalJobs: 2,
      activeJobs: 2,
      totalApplications: 68,
      newApplications: 12,
      interviews: 3,
      hires: 0,
      avgFitScore: 85,
      responseTime: 2.5
    }

    setJobs(mockJobs)
    setCandidates(mockCandidates)
    setStats(mockStats)
    setLoading(false)
  }, [])

  const getStatusBadgeStyle = (status: string): { variant: BadgeVariant; className?: string } => {
    switch (status) {
      case 'active':
      case 'hired':
        return { variant: 'outline', className: 'border-green-500 text-green-600 bg-green-50' }
      case 'paused':
      case 'interview':
        return { variant: 'outline', className: 'border-amber-400 text-amber-600 bg-amber-50' }
      case 'reviewed':
        return { variant: 'outline', className: 'border-blue-400 text-blue-600 bg-blue-50' }
      case 'closed':
      case 'rejected':
        return { variant: 'destructive' }
      case 'new':
        return { variant: 'default' }
      case 'draft':
      default:
        return { variant: 'secondary' }
    }
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Employer Dashboard</h2>
          <p className="text-gray-600">Manage your job postings and candidates</p>
        </div>
        <Button onClick={() => setShowJobForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Post New Job
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.activeJobs || 0}</div>
                <div className="text-sm text-gray-600">Active Jobs</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.totalApplications || 0}</div>
                <div className="text-sm text-gray-600">Total Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.newApplications || 0}</div>
                <div className="text-sm text-gray-600">New Applications</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">{stats?.avgFitScore || 0}%</div>
                <div className="text-sm text-gray-600">Avg Fit Score</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b">
        <nav className="flex space-x-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'jobs', label: 'Jobs', icon: Briefcase },
            { id: 'candidates', label: 'Candidates', icon: Users },
            { id: 'analytics', label: 'Analytics', icon: TrendingUp }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center space-x-2 py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Applications */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Applications</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {candidates.slice(0, 5).map((candidate) => (
                  <div key={candidate.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium">{candidate.name}</div>
                        <div className="text-sm text-gray-600">{candidate.title}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const { variant, className } = getStatusBadgeStyle(candidate.status)
                        return (
                          <Badge variant={variant} className={className}>
                            {candidate.status}
                          </Badge>
                        )
                      })()}
                      <span className={`text-sm font-medium ${getFitScoreColor(candidate.fitScore)}`}>
                        {candidate.fitScore}%
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Job Performance */}
          <Card>
            <CardHeader>
              <CardTitle>Job Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobs.map((job) => (
                  <div key={job.id} className="p-4 border rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium">{job.title}</h3>
                      {(() => {
                        const { variant, className } = getStatusBadgeStyle(job.status)
                        return (
                          <Badge variant={variant} className={className}>
                            {job.status}
                          </Badge>
                        )
                      })()}
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <div className="text-gray-600">Applications</div>
                        <div className="font-medium">{job.applications}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Views</div>
                        <div className="font-medium">{job.views}</div>
                      </div>
                      <div>
                        <div className="text-gray-600">Matches</div>
                        <div className="font-medium">{job.matches}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {activeTab === 'jobs' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Job Postings</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search jobs..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-lg">{job.title}</h3>
                      <p className="text-gray-600">{job.location} • {job.type}</p>
                    </div>
                    <div className="flex items-center space-x-2">
                      {(() => {
                        const { variant, className } = getStatusBadgeStyle(job.status)
                        return (
                          <Badge variant={variant} className={className}>
                            {job.status}
                          </Badge>
                        )
                      })()}
                      <Button variant="outline" size="sm">
                        <Settings className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4 mb-3">
                    <div>
                      <div className="text-sm text-gray-600">Applications</div>
                      <div className="font-medium">{job.applications}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Views</div>
                      <div className="font-medium">{job.views}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-600">Match Rate</div>
                      <div className="font-medium">
                        {job.views > 0 ? Math.round((job.matches / job.views) * 100) : 0}%
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Posted {job.postedAt.toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                      <Button variant="outline" size="sm">
                        <Download className="w-4 h-4 mr-2" />
                        Export
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'candidates' && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Candidates</CardTitle>
              <div className="flex items-center space-x-2">
                <div className="relative">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search candidates..."
                    className="pl-10 w-64"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {candidates.map((candidate) => (
                <div key={candidate.id} className="p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium">
                          {candidate.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <h3 className="font-semibold">{candidate.name}</h3>
                        <p className="text-gray-600">{candidate.title} • {candidate.location}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`text-lg font-bold ${getFitScoreColor(candidate.fitScore)}`}>
                        {candidate.fitScore}%
                      </span>
                      {(() => {
                        const { variant, className } = getStatusBadgeStyle(candidate.status)
                        return (
                          <Badge variant={variant} className={className}>
                            {candidate.status}
                          </Badge>
                        )
                      })()}
                    </div>
                  </div>
                  
                  <div className="mb-3">
                    <div className="text-sm text-gray-600 mb-1">Skills</div>
                    <div className="flex flex-wrap gap-1">
                      {candidate.skills.map((skill, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-600">
                      Applied {candidate.appliedAt.toLocaleDateString()}
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        View Resume
                      </Button>
                      <Button variant="outline" size="sm">
                        <MessageSquare className="w-4 h-4 mr-2" />
                        Contact
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === 'analytics' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Application Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Analytics charts would be implemented here
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Candidate Quality</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                Quality metrics would be displayed here
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

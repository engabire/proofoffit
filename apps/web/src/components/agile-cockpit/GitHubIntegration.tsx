"use client"

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { 
  Github, 
  GitBranch, 
  GitCommit, 
  GitPullRequest, 
  AlertTriangle, 
  Star,
  Users,
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  ExternalLink,
  GitMerge
} from 'lucide-react'

interface GitHubRepo {
  id: number
  name: string
  fullName: string
  description: string
  language: string
  stars: number
  forks: number
  openAlertTriangles: number
  lastUpdated: Date
  url: string
  isPrivate: boolean
}

interface GitHubAlertTriangle {
  id: number
  number: number
  title: string
  body: string
  state: 'open' | 'closed'
  labels: string[]
  assignees: string[]
  milestone: string | null
  createdAt: Date
  updatedAt: Date
  url: string
}

interface GitHubPR {
  id: number
  number: number
  title: string
  state: 'open' | 'closed' | 'merged'
  author: string
  reviewers: string[]
  createdAt: Date
  updatedAt: Date
  url: string
  filesChanged: number
  additions: number
  deletions: number
}

interface GitHubStats {
  totalCommits: number
  totalPRs: number
  totalAlertTriangles: number
  activeContributors: number
  averagePRSize: number
  averageCycleTime: number
  mergeRate: number
}

export function GitHubIntegration() {
  const [repos, setRepos] = useState<GitHubRepo[]>([])
  const [issues, setAlertTriangles] = useState<GitHubAlertTriangle[]>([])
  const [pullRequests, setPullRequests] = useState<GitHubPR[]>([])
  const [stats, setStats] = useState<GitHubStats | null>(null)
  const [selectedRepo, setSelectedRepo] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState<'repos' | 'issues' | 'prs' | 'stats'>('repos')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadGitHubData()
  }, [selectedRepo])

  const loadGitHubData = async () => {
    setLoading(true)
    try {
      // Mock GitHub data
      const mockRepos: GitHubRepo[] = [
        {
          id: 1,
          name: 'proofoffit',
          fullName: 'engabire/proofoffit',
          description: 'Agile project management and proof-of-concept platform',
          language: 'TypeScript',
          stars: 12,
          forks: 3,
          openAlertTriangles: 5,
          lastUpdated: new Date(Date.now() - 2 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit',
          isPrivate: false
        },
        {
          id: 2,
          name: 'agile-dashboard',
          fullName: 'engabire/agile-dashboard',
          description: 'React-based agile project dashboard',
          language: 'JavaScript',
          stars: 8,
          forks: 2,
          openAlertTriangles: 2,
          lastUpdated: new Date(Date.now() - 5 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/agile-dashboard',
          isPrivate: true
        }
      ]

      const mockAlertTriangles: GitHubAlertTriangle[] = [
        {
          id: 1,
          number: 123,
          title: 'Implement advanced charts for velocity tracking',
          body: 'We need to add more sophisticated charts to track team velocity over time...',
          state: 'open',
          labels: ['enhancement', 'frontend'],
          assignees: ['engabire'],
          milestone: 'Sprint 1',
          createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit/issues/123'
        },
        {
          id: 2,
          number: 124,
          title: 'Fix authentication bug in mobile app',
          body: 'Users are experiencing login issues on mobile devices...',
          state: 'open',
          labels: ['bug', 'mobile'],
          assignees: ['engabire'],
          milestone: 'Sprint 1',
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 30 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit/issues/124'
        },
        {
          id: 3,
          number: 125,
          title: 'Add email notifications for sprint updates',
          body: 'Team members should receive email notifications for sprint progress...',
          state: 'closed',
          labels: ['feature', 'backend'],
          assignees: ['engabire'],
          milestone: 'Sprint 1',
          createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit/issues/125'
        }
      ]

      const mockPRs: GitHubPR[] = [
        {
          id: 1,
          number: 45,
          title: 'feat: implement advanced Agile Cockpit features',
          state: 'open',
          author: 'engabire',
          reviewers: ['reviewer1'],
          createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit/pull/45',
          filesChanged: 22,
          additions: 5305,
          deletions: 1
        },
        {
          id: 2,
          number: 44,
          title: 'fix: resolve authentication issues',
          state: 'merged',
          author: 'engabire',
          reviewers: ['reviewer1', 'reviewer2'],
          createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
          updatedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
          url: 'https://github.com/engabire/proofoffit/pull/44',
          filesChanged: 8,
          additions: 245,
          deletions: 67
        }
      ]

      const mockStats: GitHubStats = {
        totalCommits: 156,
        totalPRs: 45,
        totalAlertTriangles: 23,
        activeContributors: 3,
        averagePRSize: 12.5,
        averageCycleTime: 2.3,
        mergeRate: 87.5
      }

      setRepos(mockRepos)
      setAlertTriangles(mockAlertTriangles)
      setPullRequests(mockPRs)
      setStats(mockStats)

    } catch (error) {
      console.error('Error loading GitHub data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStateColor = (state: string) => {
    switch (state) {
      case 'open': return 'bg-green-100 text-green-800'
      case 'closed': return 'bg-gray-100 text-gray-800'
      case 'merged': return 'bg-purple-100 text-purple-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStateIcon = (state: string) => {
    switch (state) {
      case 'open': return <AlertCircle className="w-4 h-4 text-green-500" />
      case 'closed': return <CheckCircle className="w-4 h-4 text-gray-500" />
      case 'merged': return <GitMerge className="w-4 h-4 text-purple-500" />
      default: return <Clock className="w-4 h-4 text-gray-500" />
    }
  }

  const renderRepos = () => (
    <div className="space-y-4">
      {repos.map(repo => (
        <Card key={repo.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <Github className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">{repo.name}</h3>
                  {repo.isPrivate && (
                    <Badge variant="outline">Private</Badge>
                  )}
                </div>
                <p className="text-sm text-gray-600 mb-2">{repo.description}</p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>{repo.language}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4" />
                    <span>{repo.stars}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <GitBranch className="w-4 h-4" />
                    <span>{repo.forks}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{repo.openAlertTriangles}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedRepo(repo.name)}
                >
                  Select
                </Button>
                <Button variant="outline" size="sm">
                  <ExternalLink className="w-4 h-4" />
                </Button>
              </div>
            </div>
            
            <div className="text-xs text-gray-500">
              Last updated: {repo.lastUpdated.toLocaleDateString()}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderAlertTriangles = () => (
    <div className="space-y-4">
      {issues.map(issue => (
        <Card key={issue.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <AlertTriangle className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">#{issue.number}</h3>
                  <Badge className={getStateColor(issue.state)}>
                    {issue.state}
                  </Badge>
                </div>
                <h4 className="font-medium mb-2">{issue.title}</h4>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {issue.body}
                </p>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{issue.assignees.join(', ')}</span>
                  </div>
                  {issue.milestone && (
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{issue.milestone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{issue.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                {issue.labels.length > 0 && (
                  <div className="flex flex-wrap gap-1 mt-2">
                    {issue.labels.map((label, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {label}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderPRs = () => (
    <div className="space-y-4">
      {pullRequests.map(pr => (
        <Card key={pr.id}>
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <GitPullRequest className="w-5 h-5 text-gray-500" />
                  <h3 className="font-medium">#{pr.number}</h3>
                  <Badge className={getStateColor(pr.state)}>
                    {pr.state}
                  </Badge>
                </div>
                <h4 className="font-medium mb-2">{pr.title}</h4>
                
                <div className="flex items-center space-x-4 text-sm text-gray-500 mb-3">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>by {pr.author}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4" />
                    <span>{pr.reviewers.length} reviewers</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{pr.createdAt.toLocaleDateString()}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4 text-sm">
                  <div className="flex items-center space-x-1">
                    <span className="text-green-600">+{pr.additions}</span>
                    <span className="text-red-600">-{pr.deletions}</span>
                  </div>
                  <div className="text-gray-500">
                    {pr.filesChanged} files changed
                  </div>
                </div>
              </div>
              
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )

  const renderStats = () => (
    <div className="space-y-6">
      {stats && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <GitCommit className="w-8 h-8 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalCommits}</div>
                    <div className="text-sm text-gray-600">Total Commits</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <GitPullRequest className="w-8 h-8 text-green-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalPRs}</div>
                    <div className="text-sm text-gray-600">Pull Requests</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-8 h-8 text-orange-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.totalAlertTriangles}</div>
                    <div className="text-sm text-gray-600">AlertTriangles</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center space-x-3">
                  <Users className="w-8 h-8 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">{stats.activeContributors}</div>
                    <div className="text-sm text-gray-600">Contributors</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>PR Metrics</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Average PR Size</span>
                    <span className="font-medium">{stats.averagePRSize} files</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Merge Rate</span>
                    <span className="font-medium">{stats.mergeRate}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Cycle Time</span>
                    <span className="font-medium">{stats.averageCycleTime} days</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Activity Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">Commits this week: 12</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">PRs merged: 8</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <TrendingUp className="w-4 h-4 text-green-500" />
                    <span className="text-sm">AlertTriangles closed: 5</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Team Performance</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">Code Review Time</span>
                    <span className="font-medium">1.2 days</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Response Time</span>
                    <span className="font-medium">4.5 hours</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Quality Score</span>
                    <span className="font-medium">94%</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">GitHub Integration</h2>
          <p className="text-gray-600">Connect and manage your GitHub repositories</p>
        </div>
        <Button>
          <Github className="w-4 h-4 mr-2" />
          Connect GitHub
        </Button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        {[
          { key: 'repos', label: 'Repositories', icon: <Github className="w-4 h-4" /> },
          { key: 'issues', label: 'AlertTriangles', icon: <AlertTriangle className="w-4 h-4" /> },
          { key: 'prs', label: 'Pull Requests', icon: <GitPullRequest className="w-4 h-4" /> },
          { key: 'stats', label: 'Statistics', icon: <TrendingUp className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key as any)}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              activeTab === tab.key
                ? 'bg-white text-gray-900 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Content */}
      {activeTab === 'repos' && renderRepos()}
      {activeTab === 'issues' && renderAlertTriangles()}
      {activeTab === 'prs' && renderPRs()}
      {activeTab === 'stats' && renderStats()}

      {/* Setup Guide */}
      <Card>
        <CardHeader>
          <CardTitle>GitHub Integration Setup</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">1</span>
              </div>
              <div>
                <h4 className="font-medium">Create GitHub App</h4>
                <p className="text-sm text-gray-600">Create a GitHub App in your organization settings to enable integration</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">2</span>
              </div>
              <div>
                <h4 className="font-medium">Configure Permissions</h4>
                <p className="text-sm text-gray-600">Grant read access to repositories, issues, and pull requests</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <span className="text-blue-600 text-sm font-medium">3</span>
              </div>
              <div>
                <h4 className="font-medium">Install and Connect</h4>
                <p className="text-sm text-gray-600">Install the app on your repositories and connect to Agile Cockpit</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

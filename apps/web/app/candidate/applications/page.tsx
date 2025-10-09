'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  FileText, 
  Calendar, 
  Building2, 
  MapPin, 
  DollarSign, 
  Target, 
  CheckCircle, 
  Clock, 
  XCircle, 
  ExternalLink, 
  Download, 
  Eye, 
  RefreshCw, 
  Shield,
  User,
  TrendingUp,
  Award,
  Star,
  Bookmark,
  Send,
  AlertCircle,
  Loader2
} from 'lucide-react'

// Simple toast implementation
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

type Application = {
  id: string
  jobTitle: string
  company: string
  location: string
  appliedDate: string
  status: 'submitted' | 'under_review' | 'interview_scheduled' | 'interview_completed' | 'offer' | 'rejected' | 'withdrawn'
  fitScore: number
  salary?: string
  nextStep?: string
  interviewDate?: string
  notes?: string
  documents: {
    resume: string
    coverLetter: string
    portfolio?: string
  }
}

export default function ApplicationsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  
  // Filter state
  const [statusFilter, setStatusFilter] = useState('all')
  
  // Applications data
  const [applications, setApplications] = useState<Application[]>([
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      appliedDate: '2024-01-15',
      status: 'interview_scheduled',
      fitScore: 92,
      salary: '$120,000 - $160,000',
      nextStep: 'Technical interview scheduled for Jan 25th',
      interviewDate: '2024-01-25',
      notes: 'Great cultural fit, excited about the technical challenges',
      documents: {
        resume: 'senior_frontend_developer_resume.pdf',
        coverLetter: 'techcorp_cover_letter.pdf',
        portfolio: 'portfolio_showcase.pdf'
      }
    },
    {
      id: '2',
      jobTitle: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      appliedDate: '2024-01-12',
      status: 'under_review',
      fitScore: 87,
      salary: '$100,000 - $140,000',
      nextStep: 'Awaiting initial screening call',
      notes: 'Remote-first culture aligns with my preferences',
      documents: {
        resume: 'full_stack_engineer_resume.pdf',
        coverLetter: 'startupxyz_cover_letter.pdf'
      }
    },
    {
      id: '3',
      jobTitle: 'React Developer',
      company: 'Digital Agency Co.',
      location: 'New York, NY',
      appliedDate: '2024-01-10',
      status: 'interview_completed',
      fitScore: 78,
      salary: '$80 - $120/hour',
      nextStep: 'Awaiting feedback from final interview',
      interviewDate: '2024-01-20',
      notes: 'Final interview went well, discussed project portfolio',
      documents: {
        resume: 'react_developer_resume.pdf',
        coverLetter: 'digital_agency_cover_letter.pdf',
        portfolio: 'react_projects_showcase.pdf'
      }
    },
    {
      id: '4',
      jobTitle: 'Frontend Engineer',
      company: 'E-commerce Giant',
      location: 'Seattle, WA',
      appliedDate: '2024-01-08',
      status: 'offer',
      fitScore: 85,
      salary: '$130,000 - $180,000',
      nextStep: 'Reviewing offer details',
      notes: 'Received offer! Considering compensation package',
      documents: {
        resume: 'frontend_engineer_resume.pdf',
        coverLetter: 'ecommerce_giant_cover_letter.pdf'
      }
    },
    {
      id: '5',
      jobTitle: 'Software Engineer',
      company: 'BigTech Corp',
      location: 'Austin, TX',
      appliedDate: '2024-01-05',
      status: 'rejected',
      fitScore: 72,
      salary: '$110,000 - $150,000',
      nextStep: 'Application not selected for next round',
      notes: 'Position filled internally, will keep in touch for future opportunities',
      documents: {
        resume: 'software_engineer_resume.pdf',
        coverLetter: 'bigtech_cover_letter.pdf'
      }
    }
  ])

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          setIsAuthenticated(true)
        } else {
          router.push('/auth/signin?redirect=/candidate/applications&type=seeker')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/signin?redirect=/candidate/applications&type=seeker')
      } finally {
        setIsCheckingAuth(false)
      }
    }

    checkAuth()
  }, [router])

  // Show loading while checking authentication
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Don't render the main content if not authenticated
  if (!isAuthenticated) {
    return null
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-800'
      case 'under_review':
        return 'bg-yellow-100 text-yellow-800'
      case 'interview_scheduled':
        return 'bg-purple-100 text-purple-800'
      case 'interview_completed':
        return 'bg-indigo-100 text-indigo-800'
      case 'offer':
        return 'bg-green-100 text-green-800'
      case 'rejected':
        return 'bg-red-100 text-red-800'
      case 'withdrawn':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'submitted':
        return <Send className="h-4 w-4" />
      case 'under_review':
        return <Eye className="h-4 w-4" />
      case 'interview_scheduled':
        return <Calendar className="h-4 w-4" />
      case 'interview_completed':
        return <CheckCircle className="h-4 w-4" />
      case 'offer':
        return <Award className="h-4 w-4" />
      case 'rejected':
        return <XCircle className="h-4 w-4" />
      case 'withdrawn':
        return <XCircle className="h-4 w-4" />
      default:
        return <Clock className="h-4 w-4" />
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'Submitted'
      case 'under_review':
        return 'Under Review'
      case 'interview_scheduled':
        return 'Interview Scheduled'
      case 'interview_completed':
        return 'Interview Completed'
      case 'offer':
        return 'Offer Received'
      case 'rejected':
        return 'Not Selected'
      case 'withdrawn':
        return 'Withdrawn'
      default:
        return 'Unknown'
    }
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  const handleWithdrawApplication = async (applicationId: string) => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setApplications(apps => 
        apps.map(app => 
          app.id === applicationId 
            ? { ...app, status: 'withdrawn' as const }
            : app
        )
      )
      toast.success('Application withdrawn successfully')
    } catch (error) {
      toast.error('Failed to withdraw application')
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadDocument = (documentName: string) => {
    // Simulate document download
    toast.success(`Downloading ${documentName}...`)
  }

  const filteredApplications = statusFilter === 'all' 
    ? applications 
    : applications.filter(app => app.status === statusFilter)

  const getStatusStats = () => {
    const stats = {
      total: applications.length,
      submitted: applications.filter(app => app.status === 'submitted').length,
      under_review: applications.filter(app => app.status === 'under_review').length,
      interview_scheduled: applications.filter(app => app.status === 'interview_scheduled').length,
      offer: applications.filter(app => app.status === 'offer').length,
      rejected: applications.filter(app => app.status === 'rejected').length
    }
    return stats
  }

  const stats = getStatusStats()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-sm font-medium text-gray-700">
                Demo Mode
              </span>
              <button className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors">
                <User className="h-4 w-4 mr-2" />
                Profile
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Applications</h1>
          <p className="text-gray-600">Track your job applications and their progress</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.submitted}</p>
              <p className="text-sm text-gray-600">Submitted</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.under_review}</p>
              <p className="text-sm text-gray-600">Under Review</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.interview_scheduled}</p>
              <p className="text-sm text-gray-600">Interviews</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.offer}</p>
              <p className="text-sm text-gray-600">Offers</p>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{stats.rejected}</p>
              <p className="text-sm text-gray-600">Not Selected</p>
            </div>
          </div>
        </div>

        {/* Filter */}
        <div className="bg-white rounded-lg shadow-sm border p-4 mb-6">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-gray-700">Filter by status:</span>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="all">All Applications</option>
              <option value="submitted">Submitted</option>
              <option value="under_review">Under Review</option>
              <option value="interview_scheduled">Interview Scheduled</option>
              <option value="interview_completed">Interview Completed</option>
              <option value="offer">Offers</option>
              <option value="rejected">Not Selected</option>
              <option value="withdrawn">Withdrawn</option>
            </select>
          </div>
        </div>

        {/* Applications List */}
        <div className="space-y-4">
          {filteredApplications.map((application) => (
            <div key={application.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{application.jobTitle}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${getFitScoreColor(application.fitScore)}`}>
                      {application.fitScore}% Fit
                    </span>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${getStatusColor(application.status)}`}>
                      {getStatusIcon(application.status)}
                      <span className="ml-1">{getStatusLabel(application.status)}</span>
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {application.company}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {application.location}
                    </div>
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Applied {new Date(application.appliedDate).toLocaleDateString()}
                    </div>
                    {application.salary && (
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-1" />
                        {application.salary}
                      </div>
                    )}
                  </div>
                  
                  {application.nextStep && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Next Step:</span> {application.nextStep}
                      </p>
                    </div>
                  )}
                  
                  {application.interviewDate && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Interview Date:</span> {new Date(application.interviewDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  
                  {application.notes && (
                    <div className="mb-3">
                      <p className="text-sm text-gray-700">
                        <span className="font-medium">Notes:</span> {application.notes}
                      </p>
                    </div>
                  )}
                  
                  {/* Documents */}
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => handleDownloadDocument(application.documents.resume)}
                      className="inline-flex items-center px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-md hover:bg-blue-200 transition-colors"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Resume
                    </button>
                    <button
                      onClick={() => handleDownloadDocument(application.documents.coverLetter)}
                      className="inline-flex items-center px-3 py-1 bg-green-100 text-green-800 text-sm font-medium rounded-md hover:bg-green-200 transition-colors"
                    >
                      <Download className="h-3 w-3 mr-1" />
                      Cover Letter
                    </button>
                    {application.documents.portfolio && (
                      <button
                        onClick={() => handleDownloadDocument(application.documents.portfolio)}
                        className="inline-flex items-center px-3 py-1 bg-purple-100 text-purple-800 text-sm font-medium rounded-md hover:bg-purple-200 transition-colors"
                      >
                        <Download className="h-3 w-3 mr-1" />
                        Portfolio
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => router.push(`/app/fit-simple?job=${application.id}`)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {application.status !== 'withdrawn' && application.status !== 'rejected' && application.status !== 'offer' && (
                    <button
                      onClick={() => handleWithdrawApplication(application.id)}
                      disabled={isLoading}
                      className="inline-flex items-center px-4 py-2 border border-red-300 text-red-700 text-sm font-medium rounded-md hover:bg-red-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      ) : (
                        <XCircle className="h-4 w-4 mr-2" />
                      )}
                      Withdraw
                    </button>
                  )}
                  
                  {application.status === 'offer' && (
                    <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors">
                      <Award className="h-4 w-4 mr-2" />
                      Review Offer
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredApplications.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12">
            <div className="text-center">
              <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
              <p className="text-gray-600 mb-4">
                {statusFilter === 'all' 
                  ? "You haven't submitted any applications yet. Start by finding job matches that interest you."
                  : `No applications found with status "${getStatusLabel(statusFilter)}".`
                }
              </p>
              {statusFilter === 'all' && (
                <button
                  onClick={() => router.push('/candidate/matches')}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  <Target className="h-4 w-4 mr-2" />
                  Find Job Matches
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
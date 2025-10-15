'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Eye, 
  Download, 
  ExternalLink, 
  Clock, 
  Target,
  ArrowLeft,
  LogOut,
  Building2,
  CheckCircle,
  AlertCircle,
  Star,
  TrendingUp,
  Calendar,
  Filter,
  Search
} from 'lucide-react'

function EmployerSlatesPageContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem('auth-token')
        const userData = localStorage.getItem('user')
        
        if (!token || !userData) {
          router.push('/auth/signin?type=employer')
          return
        }

        const parsedUser = JSON.parse(userData)
        if (parsedUser.type !== 'employer') {
          router.push('/dashboard')
          return
        }

        setUser(parsedUser)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth check failed:', error)
        router.push('/auth/signin?type=employer')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('auth-token')
    localStorage.removeItem('user')
    router.push('/')
  }

  const handleViewSlate = (slateId: string) => {
    router.push(`/employer/slates/${slateId}`)
  }

  const handleDownloadSlate = (slateId: string) => {
    // eslint-disable-next-line no-console
    console.log('Download slate', slateId)
  }

  // Mock slate data
  const mockSlates = [
    {
      id: '1',
      jobTitle: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      status: 'ready',
      candidates: 8,
      avgFitScore: 85,
      topFitScore: 92,
      createdAt: '2024-01-15',
      lastUpdated: '2024-01-16',
      description: 'Top candidates for our senior frontend developer position'
    },
    {
      id: '2',
      jobTitle: 'Product Manager',
      company: 'TechCorp Inc.',
      status: 'reviewing',
      candidates: 5,
      avgFitScore: 78,
      topFitScore: 88,
      createdAt: '2024-01-10',
      lastUpdated: '2024-01-12',
      description: 'Product management candidates with strong technical backgrounds'
    },
    {
      id: '3',
      jobTitle: 'UX Designer',
      company: 'TechCorp Inc.',
      status: 'ready',
      candidates: 12,
      avgFitScore: 82,
      topFitScore: 95,
      createdAt: '2024-01-05',
      lastUpdated: '2024-01-08',
      description: 'UX designers with portfolio and user research experience'
    }
  ]

  const filteredSlates = mockSlates.filter(slate => {
    const matchesSearch = slate.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         slate.company.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === 'all' || slate.status === filterStatus
    return matchesSearch && matchesFilter
  })

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate slates...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/employer/dashboard')}
                className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Building2 className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-gray-900">ProofOfFit</span>
                <span className="text-sm text-gray-500">Employer Portal</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                <Building2 className="h-4 w-4 mr-1" />
                Employer
              </span>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Candidate Slates</h1>
          <p className="text-gray-600 mt-2">
            Review ranked candidate slates with evidence-based fit scores and transparent explanations
          </p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search slates by job title or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              >
                <option value="all">All Status</option>
                <option value="ready">Ready for Review</option>
                <option value="reviewing">Under Review</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        {/* Slates List */}
        <div className="space-y-4">
          {filteredSlates.map((slate) => (
            <div key={slate.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{slate.jobTitle}</h3>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      slate.status === 'ready' 
                        ? 'bg-green-100 text-green-800' 
                        : slate.status === 'reviewing'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {slate.status === 'ready' && <CheckCircle className="h-3 w-3 mr-1" />}
                      {slate.status === 'reviewing' && <Clock className="h-3 w-3 mr-1" />}
                      {slate.status.charAt(0).toUpperCase() + slate.status.slice(1)}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                    <div className="flex items-center">
                      <Building2 className="h-4 w-4 mr-1" />
                      {slate.company}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {slate.candidates} candidates
                    </div>
                    <div className="flex items-center">
                      <Target className="h-4 w-4 mr-1" />
                      Avg Fit: {slate.avgFitScore}%
                    </div>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 mr-1" />
                      Top Fit: {slate.topFitScore}%
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">
                    {slate.description}
                  </p>

                  <div className="flex items-center space-x-6 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      Created {new Date(slate.createdAt).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      Updated {new Date(slate.lastUpdated).toLocaleDateString()}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleViewSlate(slate.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    Review Slate
                  </button>
                  <button
                    onClick={() => handleDownloadSlate(slate.id)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </button>
                </div>
              </div>

              {/* Fit Score Visualization */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fit Score Distribution</span>
                  <span className="text-gray-500">{slate.candidates} candidates</span>
                </div>
                <div className="mt-2 flex items-center space-x-2">
                  <div className="flex-1 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-blue-500 h-2 rounded-full"
                      style={{ width: `${slate.avgFitScore}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-medium text-gray-700">{slate.avgFitScore}%</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredSlates.length === 0 && (
          <div className="text-center py-12">
            <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No candidate slates found</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create a job intake to generate your first candidate slate.'
              }
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button
                onClick={() => router.push('/employer/intake')}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                <Target className="h-4 w-4 mr-2" />
                Create Job Intake
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default function EmployerSlatesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading candidate slates...</p>
        </div>
      </div>
    }>
      <EmployerSlatesPageContent />
    </Suspense>
  )
}
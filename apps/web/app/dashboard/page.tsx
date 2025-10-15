'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Users, 
  Briefcase, 
  TrendingUp, 
  FileText, 
  Target, 
  Megaphone, 
  Clock3, 
  Sparkles, 
  GraduationCap, 
  HelpingHand,
  User,
  Building2,
  ArrowRight,
  CheckCircle,
  AlertCircle,
  Calendar,
  BarChart3,
  Settings,
  LogOut
} from 'lucide-react'

function DashboardPageContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [userType, setUserType] = useState<'seeker' | 'employer' | null>(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Check authentication
        const token = localStorage.getItem('auth-token')
        const userData = localStorage.getItem('user')
        
        if (!token || !userData) {
          router.push('/auth/signin')
          return
        }

        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        setUserType(parsedUser.type || 'seeker')
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth check failed:', error)
        router.push('/auth/signin')
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

  const handleQuickAction = (action: string, href?: string) => {
    if (href) {
      router.push(href)
    } else {
      // eslint-disable-next-line no-console
      console.log(`Action: ${action}`)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user || !userType) {
    return null
  }

  const isEmployer = userType === 'employer'
  const isSeeker = userType === 'seeker'

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                {isEmployer ? (
                  <Building2 className="h-5 w-5 text-white" />
                ) : (
                  <User className="h-5 w-5 text-white" />
                )}
              </div>
              <span className="text-xl font-bold text-gray-900">ProofOfFit</span>
            </div>
            <div className="flex items-center space-x-4">
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                isEmployer 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-green-100 text-green-800'
              }`}>
                {isEmployer ? (
                  <>
                    <Building2 className="h-4 w-4 mr-1" />
                    Employer
                  </>
                ) : (
                  <>
                    <User className="h-4 w-4 mr-1" />
                    Job Seeker
                  </>
                )}
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user.name}!
          </h1>
          <p className="text-gray-600">
            {isEmployer 
              ? 'Here\'s your hiring dashboard with candidate insights and team collaboration tools.'
              : 'Here\'s your job search dashboard with fit reports and application tracking.'
            }
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Target className="h-5 w-5 text-blue-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {isEmployer ? 'Active Jobs' : 'Applications'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isEmployer ? '12' : '8'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {isEmployer ? 'Interviews' : 'Interviews'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isEmployer ? '24' : '3'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {isEmployer ? 'Fit Score Avg' : 'Fit Score Avg'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isEmployer ? '78%' : '85%'}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-orange-600" />
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">
                  {isEmployer ? 'This Week' : 'This Week'}
                </p>
                <p className="text-2xl font-semibold text-gray-900">
                  {isEmployer ? '5' : '2'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Quick Actions */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-2">
                {isEmployer ? (
                  <>
                    <button
                      onClick={() => handleQuickAction('Create job intake', '/employer/intake')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Briefcase className="h-4 w-4 mr-3 text-blue-600" />
                        Create job intake
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleQuickAction('Review candidate slates', '/employer/slates')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-3 text-green-600" />
                        Review candidate slates
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleQuickAction('Save hiring plan')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <FileText className="h-4 w-4 mr-3 text-purple-600" />
                        Save hiring plan
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleQuickAction('Review my profile', '/candidate/profile')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <User className="h-4 w-4 mr-3 text-blue-600" />
                        Review my profile
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleQuickAction('View job matches', '/candidate/matches')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Target className="h-4 w-4 mr-3 text-green-600" />
                        View job matches
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleQuickAction('Get Fit Report', '/app/fit-simple')}
                      className="w-full flex items-center justify-between px-4 py-3 text-left text-sm border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center">
                        <Sparkles className="h-4 w-4 mr-3 text-purple-600" />
                        Get Fit Report
                      </div>
                      <ArrowRight className="h-4 w-4 text-gray-400" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-4">
                {isEmployer ? (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">New candidate applied for Senior Developer position</p>
                        <p className="text-xs text-gray-500">2 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Interview scheduled with Sarah Johnson</p>
                        <p className="text-xs text-gray-500">4 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Fit report generated for 3 candidates</p>
                        <p className="text-xs text-gray-500">1 day ago</p>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Application submitted to TechCorp</p>
                        <p className="text-xs text-gray-500">1 hour ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Fit report generated for Senior Developer role</p>
                        <p className="text-xs text-gray-500">3 hours ago</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">Profile updated with new skills</p>
                        <p className="text-xs text-gray-500">2 days ago</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Performance Insights */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {isEmployer ? 'Hiring Insights' : 'Job Search Insights'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-blue-900">
                        {isEmployer ? 'Response Rate' : 'Interview Rate'}
                      </p>
                      <p className="text-2xl font-bold text-blue-600">
                        {isEmployer ? '68%' : '42%'}
                      </p>
                    </div>
                    <BarChart3 className="h-8 w-8 text-blue-600" />
                  </div>
                </div>
                <div className="p-4 bg-green-50 rounded-lg">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-green-900">
                        {isEmployer ? 'Time to Hire' : 'Time to Interview'}
                      </p>
                      <p className="text-2xl font-bold text-green-600">
                        {isEmployer ? '12 days' : '5 days'}
                      </p>
                    </div>
                    <Clock3 className="h-8 w-8 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    }>
      <DashboardPageContent />
    </Suspense>
  )
}
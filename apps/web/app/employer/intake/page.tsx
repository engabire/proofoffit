'use client'

import React, { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  Plus, 
  Trash2, 
  Save, 
  ArrowLeft,
  LogOut,
  Building2,
  CheckCircle,
  AlertCircle,
  ChevronRight,
  Home
} from 'lucide-react'

function EmployerIntakePageContent() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [loading, setLoading] = useState(false)
  
  const [formData, setFormData] = useState({
    jobTitle: '',
    company: '',
    location: '',
    workType: 'hybrid',
    salaryMin: '',
    salaryMax: '',
    description: '',
    mustHave: [] as string[],
    preferred: [] as string[],
    constraints: {
      workAuth: 'any',
      clearance: '',
      languages: [] as string[]
    }
  })

  const [newMustHave, setNewMustHave] = useState('')
  const [newPreferred, setNewPreferred] = useState('')

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

  const addRequirement = (type: 'mustHave' | 'preferred', value: string) => {
    if (!value.trim()) return
    
    setFormData(prev => ({
      ...prev,
      [type]: [...prev[type], value.trim()]
    }))
    
    if (type === 'mustHave') {
      setNewMustHave('')
    } else {
      setNewPreferred('')
    }
  }

  const removeRequirement = (type: 'mustHave' | 'preferred', index: number) => {
    setFormData(prev => ({
      ...prev,
      [type]: prev[type].filter((_, i) => i !== index)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // eslint-disable-next-line no-console
      console.log('Job intake created:', formData)
      // eslint-disable-next-line no-console
      console.log('Success: Job intake created successfully!')
      
      // Redirect to slates page
      router.push('/employer/slates')
    } catch (error: any) {
      // eslint-disable-next-line no-console
      console.error('Failed to create job intake:', error)
    } finally {
      setLoading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job intake form...</p>
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Page Header with Breadcrumbs */}
        <div className="mb-8">
          {/* Breadcrumb Navigation */}
          <nav className="flex items-center space-x-1 text-sm text-gray-500 mb-4">
            <Link
              href="/"
              className="flex items-center space-x-1 hover:text-gray-700 transition-colors"
            >
              <Home className="h-4 w-4" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-4 w-4" />
            <Link
              href="/employer/dashboard"
              className="hover:text-gray-700 transition-colors"
            >
              Employer Dashboard
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium" aria-current="page">
              Create Job Intake
            </span>
          </nav>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">Create Job Intake</h1>
            <p className="text-gray-600 text-lg">
              Define your hiring requirements to generate evidence-based candidate slates
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Job Details */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Job Details</h2>
              <p className="text-gray-600 text-sm mt-1">
                Basic information about the position
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="jobTitle" className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title *
                </label>
                <input
                  id="jobTitle"
                  type="text"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                  Company *
                </label>
                <input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., TechCorp Inc."
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <div>
                <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2">
                  Location *
                </label>
                <input
                  id="location"
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                  required
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="workType" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Type
                </label>
                <select
                  id="workType"
                  value={formData.workType}
                  onChange={(e) => setFormData(prev => ({ ...prev, workType: e.target.value }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="remote">Remote</option>
                  <option value="hybrid">Hybrid</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 mt-6">
              <div>
                <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Salary
                </label>
                <input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                  placeholder="80000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <div>
                <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Salary
                </label>
                <input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                  placeholder="120000"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>

            <div className="mt-6">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Job Description *
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                rows={4}
                required
                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Requirements */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Requirements</h2>
              <p className="text-gray-600 text-sm mt-1">
                Define must-have and preferred qualifications
              </p>
            </div>

            {/* Must Have Requirements */}
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Must Have Requirements
              </label>
              <div className="space-y-3">
                {formData.mustHave.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-red-50 border border-red-200 rounded-md">
                      <span className="text-sm text-red-800">{req}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirement('mustHave', index)}
                      className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newMustHave}
                    onChange={(e) => setNewMustHave(e.target.value)}
                    placeholder="e.g., 5+ years React experience"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement('mustHave', newMustHave))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addRequirement('mustHave', newMustHave)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Preferred Requirements */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Preferred Requirements
              </label>
              <div className="space-y-3">
                {formData.preferred.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 p-3 bg-blue-50 border border-blue-200 rounded-md">
                      <span className="text-sm text-blue-800">{req}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeRequirement('preferred', index)}
                      className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={newPreferred}
                    onChange={(e) => setNewPreferred(e.target.value)}
                    placeholder="e.g., Healthcare domain experience"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement('preferred', newPreferred))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => addRequirement('preferred', newPreferred)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Constraints */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Constraints</h2>
              <p className="text-gray-600 text-sm mt-1">
                Additional requirements and restrictions
              </p>
            </div>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div>
                <label htmlFor="workAuth" className="block text-sm font-medium text-gray-700 mb-2">
                  Work Authorization
                </label>
                <select
                  id="workAuth"
                  value={formData.constraints.workAuth}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    constraints: { ...prev.constraints, workAuth: e.target.value }
                  }))}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  <option value="any">Any</option>
                  <option value="US_citizen_or_green_card">US Citizen or Green Card</option>
                  <option value="US_citizen_only">US Citizen Only</option>
                </select>
              </div>
              
              <div>
                <label htmlFor="clearance" className="block text-sm font-medium text-gray-700 mb-2">
                  Security Clearance
                </label>
                <input
                  id="clearance"
                  type="text"
                  value={formData.constraints.clearance}
                  onChange={(e) => setFormData(prev => ({ 
                    ...prev, 
                    constraints: { ...prev.constraints, clearance: e.target.value }
                  }))}
                  placeholder="e.g., Secret, Top Secret, None"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Create Job Intake
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function EmployerIntakePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading job intake form...</p>
        </div>
      </div>
    }>
      <EmployerIntakePageContent />
    </Suspense>
  )
}
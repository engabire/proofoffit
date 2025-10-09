'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Upload,
  FileText,
  Search,
  Sparkles,
  CheckCircle,
  AlertCircle,
  Download,
  Share2,
  Lock,
  Shield,
  Star,
  TrendingUp,
  User,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Copy,
  Eye,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Target,
  ArrowRight,
  Check,
  X,
  Plus,
  Edit,
  Trash2,
  Save,
  RefreshCw
} from 'lucide-react'
// Simple toast implementation
const toast = {
  error: (message: string) => console.error('Error:', message),
  success: (message: string) => console.log('Success:', message)
}

export default function SimpleFitPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [fitScore, setFitScore] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // In a real app, you'd check with your auth service
        // For now, we'll simulate checking localStorage or cookies
        const token = localStorage.getItem('auth-token')
        if (token) {
          setIsAuthenticated(true)
        } else {
          // Redirect to sign-in with return URL and user type
          router.push('/auth/signin?redirect=/app/fit-simple&type=seeker')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/auth/signin?redirect=/app/fit-simple&type=seeker')
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

  const handleAnalyze = async () => {
    if (!jobDescription.trim()) {
      toast.error('Please enter a job description')
      return
    }

    setIsLoading(true)
    
    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis results
      const mockScore = Math.floor(Math.random() * 40) + 60 // 60-100
      const mockAnalysis = {
        score: mockScore,
        strengths: [
          'Strong technical background in relevant technologies',
          'Proven experience with similar projects',
          'Excellent communication skills',
          'Leadership experience in team environments'
        ],
        gaps: [
          'Specific certification mentioned in job requirements',
          'Experience with particular industry domain',
          'Advanced knowledge of specific tools'
        ],
        recommendations: [
          'Highlight relevant project experience in your resume',
          'Consider obtaining the mentioned certification',
          'Emphasize transferable skills from similar roles'
        ]
      }
      
      setFitScore(mockScore)
      setAnalysis(mockAnalysis)
      toast.success('Analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Fit Analysis</h1>
          <p className="text-gray-600">Analyze how well you match a specific job opportunity</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="rounded-lg border bg-white shadow-sm p-6">
            <div className="flex items-center mb-6">
              <FileText className="h-5 w-5 mr-2" />
              <h3 className="text-lg font-semibold">Job Description</h3>
            </div>
            <div className="space-y-4">
              <div>
                <label htmlFor="job-description" className="block text-sm font-medium text-gray-700 mb-2">
                  Paste the job description here
                </label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={12}
                  placeholder="Paste the complete job description, including requirements, responsibilities, and qualifications..."
                />
              </div>
              
              <button 
                onClick={handleAnalyze} 
                disabled={isLoading || !jobDescription.trim()}
                className="w-full inline-flex items-center justify-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-4 w-4" />
                    Analyze Fit
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {fitScore !== null && analysis && (
              <>
                {/* Fit Score */}
                <div className="rounded-lg border bg-white shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <Target className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Fit Score</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {fitScore}
                    </div>
                    <div className="text-lg text-gray-600 mb-4">
                      {fitScore >= 80 ? 'Excellent Match' : 
                       fitScore >= 60 ? 'Good Match' : 
                       fitScore >= 40 ? 'Fair Match' : 'Poor Match'}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      fitScore >= 80 ? 'bg-green-100 text-green-800' : 
                      fitScore >= 60 ? 'bg-blue-100 text-blue-800' : 
                      fitScore >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {fitScore >= 80 ? 'Highly Recommended' : 
                       fitScore >= 60 ? 'Recommended' : 
                       fitScore >= 40 ? 'Consider Applying' : 'Not Recommended'}
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="rounded-lg border bg-white shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="rounded-lg border bg-white shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-600">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.gaps.map((gap: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <X className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="rounded-lg border bg-white shadow-sm p-6">
                  <div className="flex items-center mb-6">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}

            {!analysis && (
              <div className="rounded-lg border bg-white shadow-sm p-6">
                <div className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600">
                    Paste a job description in the left panel and click "Analyze Fit" to get started.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


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
  RefreshCw,
  Filter,
  Bookmark,
  Send,
  FileCheck,
  PenTool,
  Briefcase,
  Clock,
  DollarSign,
  Users,
  Globe
} from 'lucide-react'

// Simple toast implementation
const toast = {
  error: (message: string) => console.error('Error:', message),
  success: (message: string) => console.log('Success:', message)
}

type Job = {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  postedDate: string
  description: string
  requirements: string[]
  benefits: string[]
  fitScore?: number
}

type AnalysisResult = {
  score: number
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  tailoredResume?: string
  coverLetter?: string
}

export default function SimpleFitPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  
  // Job search state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedJob, setSelectedJob] = useState<Job | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [isSearching, setIsSearching] = useState(false)
  
  // Analysis state
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  
  // Application state
  const [showTailoredResume, setShowTailoredResume] = useState(false)
  const [showCoverLetter, setShowCoverLetter] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  
  // Active tab
  const [activeTab, setActiveTab] = useState<'search' | 'analyze' | 'apply'>('search')

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('auth-token')
        if (token) {
          setIsAuthenticated(true)
          // Load sample jobs on authentication
          loadSampleJobs()
        } else {
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

  // Load sample jobs
  const loadSampleJobs = () => {
    const sampleJobs: Job[] = [
      {
        id: '1',
        title: 'Senior Frontend Developer',
        company: 'TechCorp Inc.',
        location: 'San Francisco, CA',
        type: 'Full-time',
        salary: '$120,000 - $160,000',
        postedDate: '2 days ago',
        description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies.',
        requirements: [
          '5+ years of experience with React and TypeScript',
          'Strong understanding of modern JavaScript (ES6+)',
          'Experience with state management libraries (Redux, Zustand)',
          'Proficiency in CSS and responsive design',
          'Experience with testing frameworks (Jest, React Testing Library)',
          'Knowledge of build tools (Webpack, Vite)',
          'Experience with version control (Git)',
          'Strong problem-solving and communication skills'
        ],
        benefits: [
          'Competitive salary and equity',
          'Health, dental, and vision insurance',
          '401(k) with company matching',
          'Flexible work arrangements',
          'Professional development budget'
        ]
      },
      {
        id: '2',
        title: 'Full Stack Engineer',
        company: 'StartupXYZ',
        location: 'Remote',
        type: 'Full-time',
        salary: '$100,000 - $140,000',
        postedDate: '1 week ago',
        description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend systems, building scalable web applications and APIs.',
        requirements: [
          '3+ years of full-stack development experience',
          'Proficiency in React and Node.js',
          'Experience with databases (PostgreSQL, MongoDB)',
          'Knowledge of cloud platforms (AWS, GCP)',
          'Experience with RESTful APIs and GraphQL',
          'Understanding of DevOps practices',
          'Strong analytical and problem-solving skills'
        ],
        benefits: [
          'Remote-first culture',
          'Stock options',
          'Health insurance',
          'Unlimited PTO',
          'Learning and development budget'
        ]
      },
      {
        id: '3',
        title: 'React Developer',
        company: 'Digital Agency Co.',
        location: 'New York, NY',
        type: 'Contract',
        salary: '$80 - $120/hour',
        postedDate: '3 days ago',
        description: 'We are seeking a talented React Developer to work on various client projects. You will collaborate with designers and backend developers to create exceptional user experiences.',
        requirements: [
          '2+ years of React development experience',
          'Strong JavaScript and TypeScript skills',
          'Experience with modern CSS frameworks',
          'Knowledge of responsive design principles',
          'Experience with API integration',
          'Portfolio demonstrating React projects',
          'Excellent communication skills'
        ],
        benefits: [
          'Flexible schedule',
          'Diverse project portfolio',
          'Professional growth opportunities',
          'Competitive hourly rate'
        ]
      }
    ]
    setJobs(sampleJobs)
  }

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

  const handleJobSearch = async () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search query')
      return
    }

    setIsSearching(true)
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // Filter jobs based on search query
      const filteredJobs = jobs.filter(job => 
        job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        job.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
      
      setJobs(filteredJobs)
      toast.success(`Found ${filteredJobs.length} jobs matching "${searchQuery}"`)
    } catch (error) {
      console.error('Search error:', error)
      toast.error('Search failed. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const handleAnalyzeJob = async (job: Job) => {
    setSelectedJob(job)
    setIsAnalyzing(true)
    setActiveTab('analyze')
    
    try {
      // Simulate analysis
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock analysis results based on job
      const mockScore = Math.floor(Math.random() * 40) + 60 // 60-100
      const mockAnalysis: AnalysisResult = {
        score: mockScore,
        strengths: [
          `Strong experience with ${job.requirements[0]?.split(' ')[0] || 'relevant technologies'}`,
          'Proven track record of delivering high-quality code',
          'Excellent problem-solving and analytical skills',
          'Strong communication and collaboration abilities',
          'Experience with modern development practices'
        ],
        gaps: [
          job.requirements.find(req => req.includes('certification')) || 'Specific certification mentioned in requirements',
          job.requirements.find(req => req.includes('years')) || 'Additional years of experience in specific area',
          'Experience with specific tools or technologies mentioned'
        ],
        recommendations: [
          'Highlight relevant project experience in your resume',
          'Emphasize transferable skills from similar roles',
          'Consider obtaining relevant certifications',
          'Prepare specific examples of your achievements'
        ]
      }
      
      setAnalysis(mockAnalysis)
      toast.success('Job analysis completed successfully!')
    } catch (error) {
      console.error('Analysis error:', error)
      toast.error('Analysis failed. Please try again.')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateApplication = async () => {
    if (!selectedJob || !analysis) return

    setIsGenerating(true)
    setActiveTab('apply')
    
    try {
      // Simulate generating tailored resume and cover letter
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      const tailoredResume = `# John Doe - ${selectedJob.title}

## Professional Summary
Experienced software developer with 5+ years of expertise in ${selectedJob.requirements[0]?.split(' ')[0] || 'modern web technologies'}. Proven track record of delivering high-quality, scalable applications and leading development teams.

## Technical Skills
- ${selectedJob.requirements.slice(0, 3).join('\n- ')}
- Strong problem-solving and analytical abilities
- Excellent communication and collaboration skills

## Professional Experience

### Senior Developer | TechCorp (2020-2024)
- Led development of React-based applications serving 100K+ users
- Implemented modern state management solutions
- Collaborated with cross-functional teams to deliver projects on time

### Frontend Developer | StartupXYZ (2018-2020)
- Built responsive web applications using React and TypeScript
- Optimized application performance resulting in 40% faster load times
- Mentored junior developers and conducted code reviews

## Education
Bachelor of Science in Computer Science | University of Technology (2018)

## Certifications
- AWS Certified Developer
- React Professional Certification`

      const coverLetter = `Dear Hiring Manager,

I am writing to express my strong interest in the ${selectedJob.title} position at ${selectedJob.company}. With my extensive experience in ${selectedJob.requirements[0]?.split(' ')[0] || 'software development'} and proven track record of delivering high-quality solutions, I am confident that I would be a valuable addition to your team.

In my current role, I have successfully:
- Led development of scalable web applications using modern technologies
- Collaborated with cross-functional teams to deliver projects on time and within budget
- Implemented best practices for code quality and performance optimization

I am particularly excited about this opportunity because:
- The role aligns perfectly with my expertise in ${selectedJob.requirements[0]?.split(' ')[0] || 'relevant technologies'}
- ${selectedJob.company}'s mission and values resonate with my professional goals
- I am eager to contribute to innovative projects and grow with the team

I would welcome the opportunity to discuss how my skills and experience can contribute to ${selectedJob.company}'s continued success. Thank you for considering my application.

Best regards,
John Doe`

      setAnalysis(prev => prev ? {
        ...prev,
        tailoredResume,
        coverLetter
      } : null)
      
      toast.success('Tailored application materials generated successfully!')
    } catch (error) {
      console.error('Generation error:', error)
      toast.error('Failed to generate application materials. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownloadResume = () => {
    if (!analysis?.tailoredResume) return
    
    const blob = new Blob([analysis.tailoredResume], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedJob?.title.replace(/\s+/g, '_')}_tailored_resume.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Resume downloaded successfully!')
  }

  const handleDownloadCoverLetter = () => {
    if (!analysis?.coverLetter) return
    
    const blob = new Blob([analysis.coverLetter], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${selectedJob?.title.replace(/\s+/g, '_')}_cover_letter.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    
    toast.success('Cover letter downloaded successfully!')
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Search & Fit Analysis</h1>
          <p className="text-gray-600">Find opportunities, analyze your fit, and generate tailored applications</p>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('search')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'search'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Search className="h-4 w-4 inline mr-2" />
              Job Search
            </button>
            <button
              onClick={() => setActiveTab('analyze')}
              disabled={!selectedJob}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'analyze'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <Target className="h-4 w-4 inline mr-2" />
              Fit Analysis
            </button>
            <button
              onClick={() => setActiveTab('apply')}
              disabled={!analysis}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'apply'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 disabled:opacity-50 disabled:cursor-not-allowed'
              }`}
            >
              <PenTool className="h-4 w-4 inline mr-2" />
              Generate Application
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === 'search' && (
          <div className="space-y-6">
            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for jobs (e.g., 'React Developer', 'Frontend Engineer')"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    onKeyPress={(e) => e.key === 'Enter' && handleJobSearch()}
                  />
                </div>
                <button
                  onClick={handleJobSearch}
                  disabled={isSearching}
                  className="inline-flex items-center px-6 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSearching ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Search className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Job Listings */}
            <div className="space-y-4">
              {jobs.map((job) => (
                <div key={job.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900">{job.title}</h3>
                        <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
                          {job.type}
                        </span>
                      </div>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center">
                          <Building2 className="h-4 w-4 mr-1" />
                          {job.company}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {job.location}
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 mr-1" />
                          {job.postedDate}
                        </div>
                        {job.salary && (
                          <div className="flex items-center">
                            <DollarSign className="h-4 w-4 mr-1" />
                            {job.salary}
                          </div>
                        )}
                      </div>
                      <p className="text-gray-700 mb-4 line-clamp-2">{job.description}</p>
                      <div className="flex flex-wrap gap-2 mb-4">
                        {job.requirements.slice(0, 3).map((req, index) => (
                          <span key={index} className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            {req.split(' ')[0]} {req.split(' ')[1]}
                          </span>
                        ))}
                        {job.requirements.length > 3 && (
                          <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-1 text-xs font-medium text-gray-800">
                            +{job.requirements.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="ml-4 flex flex-col space-y-2">
                      <button
                        onClick={() => handleAnalyzeJob(job)}
                        className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                      >
                        <Target className="h-4 w-4 mr-2" />
                        Analyze Fit
                      </button>
                      <button className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'analyze' && selectedJob && (
          <div className="space-y-6">
            {/* Selected Job Info */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-xl font-semibold text-gray-900">{selectedJob.title}</h3>
                  <p className="text-gray-600">{selectedJob.company} • {selectedJob.location}</p>
                </div>
                <button
                  onClick={() => setActiveTab('search')}
                  className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                >
                  ← Back to Search
                </button>
              </div>
            </div>

            {/* Analysis Results */}
            {isAnalyzing ? (
              <div className="bg-white rounded-lg shadow-sm border p-12">
                <div className="text-center">
                  <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Analyzing Job Fit</h3>
                  <p className="text-gray-600">We&apos;re analyzing how well you match this position...</p>
                </div>
              </div>
            ) : analysis ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Fit Score */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-6">
                    <Target className="h-5 w-5 mr-2" />
                    <h3 className="text-lg font-semibold">Fit Score</h3>
                  </div>
                  <div className="text-center">
                    <div className="text-6xl font-bold text-blue-600 mb-2">
                      {analysis.score}
                    </div>
                    <div className="text-lg text-gray-600 mb-4">
                      {analysis.score >= 80 ? 'Excellent Match' : 
                       analysis.score >= 60 ? 'Good Match' : 
                       analysis.score >= 40 ? 'Fair Match' : 'Poor Match'}
                    </div>
                    <span className={`inline-flex items-center rounded-full px-3 py-1 text-sm font-medium ${
                      analysis.score >= 80 ? 'bg-green-100 text-green-800' : 
                      analysis.score >= 60 ? 'bg-blue-100 text-blue-800' : 
                      analysis.score >= 40 ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {analysis.score >= 80 ? 'Highly Recommended' : 
                       analysis.score >= 60 ? 'Recommended' : 
                       analysis.score >= 40 ? 'Consider Applying' : 'Not Recommended'}
                    </span>
                  </div>
                </div>

                {/* Strengths */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-6">
                    <CheckCircle className="h-5 w-5 mr-2 text-green-600" />
                    <h3 className="text-lg font-semibold text-green-600">Strengths</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.strengths.map((strength, index) => (
                      <li key={index} className="flex items-start">
                        <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{strength}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Gaps */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-6">
                    <AlertCircle className="h-5 w-5 mr-2 text-orange-600" />
                    <h3 className="text-lg font-semibold text-orange-600">Areas for Improvement</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.gaps.map((gap, index) => (
                      <li key={index} className="flex items-start">
                        <X className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{gap}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Recommendations */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-6">
                    <Sparkles className="h-5 w-5 mr-2 text-blue-600" />
                    <h3 className="text-lg font-semibold text-blue-600">Recommendations</h3>
                  </div>
                  <ul className="space-y-2">
                    {analysis.recommendations.map((rec, index) => (
                      <li key={index} className="flex items-start">
                        <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{rec}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border p-12">
                <div className="text-center">
                  <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600 mb-4">
                    Click &ldquo;Analyze Fit&rdquo; on a job listing to see how well you match the position.
                  </p>
                  <button
                    onClick={() => setActiveTab('search')}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Browse Jobs
                  </button>
                </div>
              </div>
            )}

            {/* Generate Application Button */}
            {analysis && (
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="text-center">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Apply?</h3>
                  <p className="text-gray-600 mb-4">
                    Generate a tailored resume and cover letter for this position.
                  </p>
                  <button
                    onClick={handleGenerateApplication}
                    disabled={isGenerating}
                    className="inline-flex items-center px-6 py-3 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <PenTool className="h-4 w-4 mr-2" />
                    )}
                    Generate Application Materials
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'apply' && analysis && (
          <div className="space-y-6">
            {/* Application Materials */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">Application Materials</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={() => setShowTailoredResume(!showTailoredResume)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showTailoredResume ? 'Hide' : 'View'} Resume
                  </button>
                  <button
                    onClick={() => setShowCoverLetter(!showCoverLetter)}
                    className="inline-flex items-center px-3 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    {showCoverLetter ? 'Hide' : 'View'} Cover Letter
                  </button>
                </div>
              </div>

              {/* Tailored Resume */}
              {showTailoredResume && analysis.tailoredResume && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Tailored Resume</h4>
                    <button
                      onClick={handleDownloadResume}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800 font-mono">
                      {analysis.tailoredResume}
                    </pre>
                  </div>
                </div>
              )}

              {/* Cover Letter */}
              {showCoverLetter && analysis.coverLetter && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-lg font-medium text-gray-900">Cover Letter</h4>
                    <button
                      onClick={handleDownloadCoverLetter}
                      className="inline-flex items-center px-3 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </button>
                  </div>
                  <div className="bg-gray-50 rounded-md p-4 max-h-96 overflow-y-auto">
                    <pre className="whitespace-pre-wrap text-sm text-gray-800">
                      {analysis.coverLetter}
                    </pre>
                  </div>
                </div>
              )}
            </div>

            {/* Application Actions */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="text-center">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Apply?</h3>
                <p className="text-gray-600 mb-4">
                  Download your tailored materials and apply directly to the position.
                </p>
                <div className="flex justify-center space-x-4">
                  <button className="inline-flex items-center px-6 py-3 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Apply Now
                  </button>
                  <button className="inline-flex items-center px-6 py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors">
                    <Share2 className="h-4 w-4 mr-2" />
                    Share Analysis
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
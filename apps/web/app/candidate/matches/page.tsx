'use client'

import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Target, 
  MapPin, 
  Building2, 
  DollarSign, 
  Clock, 
  CheckCircle, 
  Star, 
  Eye, 
  Bookmark, 
  ExternalLink, 
  Filter, 
  Search, 
  Shield,
  User,
  TrendingUp,
  Award,
  Calendar,
  Users,
  Globe,
  Loader2
} from 'lucide-react'

// Simple toast implementation
const toast = {
  // eslint-disable-next-line no-console
  success: (message: string) => console.log('Success:', message),
  // eslint-disable-next-line no-console
  error: (message: string) => console.error('Error:', message)
}

type JobMatch = {
  id: string
  title: string
  company: string
  location: string
  type: string
  salary?: string
  postedDate: string
  fitScore: number
  description: string
  requirements: string[]
  benefits: string[]
  isBookmarked: boolean
  matchReasons: string[]
  applicationStatus?: 'applied' | 'viewed' | 'none'
}

export default function JobMatchesPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isCheckingAuth, setIsCheckingAuth] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  
  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilters, setSelectedFilters] = useState({
    minScore: 0,
    jobType: 'all',
    location: 'all'
  })
  
  // Job matches data
  const [jobMatches, setJobMatches] = useState<JobMatch[]>([
    {
      id: '1',
      title: 'Senior Frontend Developer',
      company: 'TechCorp Inc.',
      location: 'San Francisco, CA',
      type: 'Full-time',
      salary: '$120,000 - $160,000',
      postedDate: '2 days ago',
      fitScore: 92,
      description: 'We are looking for a Senior Frontend Developer to join our growing team. You will be responsible for building and maintaining our web applications using React, TypeScript, and modern frontend technologies.',
      requirements: [
        '5+ years of experience with React and TypeScript',
        'Strong understanding of modern JavaScript (ES6+)',
        'Experience with state management libraries (Redux, Zustand)',
        'Proficiency in CSS and responsive design',
        'Experience with testing frameworks (Jest, React Testing Library)'
      ],
      benefits: [
        'Competitive salary and equity',
        'Health, dental, and vision insurance',
        '401(k) with company matching',
        'Flexible work arrangements'
      ],
      isBookmarked: false,
      matchReasons: [
        'Strong match with React and TypeScript experience',
        'Excellent fit for senior-level responsibilities',
        'Location aligns with your preferences',
        'Salary range matches your expectations'
      ],
      applicationStatus: 'none'
    },
    {
      id: '2',
      title: 'Full Stack Engineer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'Full-time',
      salary: '$100,000 - $140,000',
      postedDate: '1 week ago',
      fitScore: 87,
      description: 'Join our fast-growing startup as a Full Stack Engineer. You will work on both frontend and backend systems, building scalable web applications and APIs.',
      requirements: [
        '3+ years of full-stack development experience',
        'Proficiency in React and Node.js',
        'Experience with databases (PostgreSQL, MongoDB)',
        'Knowledge of cloud platforms (AWS, GCP)',
        'Experience with RESTful APIs and GraphQL'
      ],
      benefits: [
        'Remote-first culture',
        'Stock options',
        'Health insurance',
        'Unlimited PTO'
      ],
      isBookmarked: true,
      matchReasons: [
        'Perfect match for full-stack development skills',
        'Remote work aligns with your preferences',
        'Startup environment matches your career goals',
        'Strong technical requirements match'
      ],
      applicationStatus: 'viewed'
    },
    {
      id: '3',
      title: 'React Developer',
      company: 'Digital Agency Co.',
      location: 'New York, NY',
      type: 'Contract',
      salary: '$80 - $120/hour',
      postedDate: '3 days ago',
      fitScore: 78,
      description: 'We are seeking a talented React Developer to work on various client projects. You will collaborate with designers and backend developers to create exceptional user experiences.',
      requirements: [
        '2+ years of React development experience',
        'Strong JavaScript and TypeScript skills',
        'Experience with modern CSS frameworks',
        'Knowledge of responsive design principles',
        'Experience with API integration'
      ],
      benefits: [
        'Flexible schedule',
        'Diverse project portfolio',
        'Professional growth opportunities',
        'Competitive hourly rate'
      ],
      isBookmarked: false,
      matchReasons: [
        'Good match with React development skills',
        'Contract work offers flexibility',
        'Diverse project experience opportunity',
        'Strong hourly rate'
      ],
      applicationStatus: 'applied'
    },
    {
      id: '4',
      title: 'Frontend Engineer',
      company: 'E-commerce Giant',
      location: 'Seattle, WA',
      type: 'Full-time',
      salary: '$130,000 - $180,000',
      postedDate: '5 days ago',
      fitScore: 85,
      description: 'Join our frontend team to build the next generation of e-commerce experiences. Work with cutting-edge technologies and scale to millions of users.',
      requirements: [
        '4+ years of frontend development experience',
        'Expert knowledge of React and modern JavaScript',
        'Experience with performance optimization',
        'Knowledge of accessibility best practices',
        'Experience with large-scale applications'
      ],
      benefits: [
        'Top-tier compensation package',
        'Comprehensive health benefits',
        'Stock options and RSUs',
        'Professional development budget'
      ],
      isBookmarked: false,
      matchReasons: [
        'Excellent match for frontend expertise',
        'High compensation package',
        'Large-scale application experience',
        'Strong company reputation'
      ],
      applicationStatus: 'none'
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
          router.push('/auth/signin?redirect=/candidate/matches&type=seeker')
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Auth check failed:', error)
        router.push('/auth/signin?redirect=/candidate/matches&type=seeker')
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

  const handleBookmark = (jobId: string) => {
    setJobMatches(jobs => 
      jobs.map(job => 
        job.id === jobId 
          ? { ...job, isBookmarked: !job.isBookmarked }
          : job
      )
    )
    toast.success('Bookmark updated!')
  }

  const handleApply = (jobId: string) => {
    setJobMatches(jobs => 
      jobs.map(job => 
        job.id === jobId 
          ? { ...job, applicationStatus: 'applied' as const }
          : job
      )
    )
    toast.success('Application submitted successfully!')
  }

  const handleViewJob = (jobId: string) => {
    setJobMatches(jobs => 
      jobs.map(job => 
        job.id === jobId 
          ? { ...job, applicationStatus: job.applicationStatus === 'none' ? 'viewed' as const : job.applicationStatus }
          : job
      )
    )
    // In a real app, you'd navigate to the job details page
    router.push(`/app/fit-simple?job=${jobId}`)
  }

  const getFitScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600 bg-green-100'
    if (score >= 80) return 'text-blue-600 bg-blue-100'
    if (score >= 70) return 'text-yellow-600 bg-yellow-100'
    return 'text-orange-600 bg-orange-100'
  }

  const getFitScoreLabel = (score: number) => {
    if (score >= 90) return 'Excellent Match'
    if (score >= 80) return 'Great Match'
    if (score >= 70) return 'Good Match'
    return 'Fair Match'
  }

  const getApplicationStatusBadge = (status?: string) => {
    switch (status) {
      case 'applied':
        return (
          <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-1 text-xs font-medium text-green-800">
            <CheckCircle className="h-3 w-3 mr-1" />
            Applied
          </span>
        )
      case 'viewed':
        return (
          <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-800">
            <Eye className="h-3 w-3 mr-1" />
            Viewed
          </span>
        )
      default:
        return null
    }
  }

  const filteredJobs = jobMatches.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         job.description.toLowerCase().includes(searchQuery.toLowerCase())
    
    const matchesScore = job.fitScore >= selectedFilters.minScore
    const matchesType = selectedFilters.jobType === 'all' || job.type.toLowerCase() === selectedFilters.jobType.toLowerCase()
    const matchesLocation = selectedFilters.location === 'all' || 
                           job.location.toLowerCase().includes(selectedFilters.location.toLowerCase())
    
    return matchesSearch && matchesScore && matchesType && matchesLocation
  })

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
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Job Matches</h1>
          <p className="text-gray-600">Discover opportunities that match your skills and preferences</p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search jobs, companies, or keywords..."
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>
            
            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4">
      <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Min Fit Score</label>
                <select
                  value={selectedFilters.minScore}
                  onChange={(e) => setSelectedFilters({...selectedFilters, minScore: parseInt(e.target.value)})}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value={0}>All Scores</option>
                  <option value={70}>70+</option>
                  <option value={80}>80+</option>
                  <option value={90}>90+</option>
                </select>
      </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Job Type</label>
                <select
                  value={selectedFilters.jobType}
                  onChange={(e) => setSelectedFilters({...selectedFilters, jobType: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Types</option>
                  <option value="full-time">Full-time</option>
                  <option value="contract">Contract</option>
                  <option value="part-time">Part-time</option>
                </select>
                    </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <select
                  value={selectedFilters.location}
                  onChange={(e) => setSelectedFilters({...selectedFilters, location: e.target.value})}
                  className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
                >
                  <option value="all">All Locations</option>
                  <option value="remote">Remote</option>
                  <option value="san francisco">San Francisco</option>
                  <option value="new york">New York</option>
                  <option value="seattle">Seattle</option>
                </select>
                    </div>
                    </div>
                  </div>
                </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Total Matches</p>
                <p className="text-2xl font-bold text-gray-900">{filteredJobs.length}</p>
              </div>
                  </div>
                </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <Star className="h-8 w-8 text-yellow-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">High Matches (90+)</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredJobs.filter(job => job.fitScore >= 90).length}
                </p>
              </div>
            </div>
          </div>
            
          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <Bookmark className="h-8 w-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm font-medium text-gray-600">Bookmarked</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredJobs.filter(job => job.isBookmarked).length}
                </p>
              </div>
            </div>
              </div>

          <div className="bg-white rounded-lg shadow-sm border p-4">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-purple-600 mr-3" />
                <div>
                <p className="text-sm font-medium text-gray-600">Applied</p>
                <p className="text-2xl font-bold text-gray-900">
                  {filteredJobs.filter(job => job.applicationStatus === 'applied').length}
                        </p>
                      </div>
            </div>
          </div>
        </div>

        {/* Job Matches */}
        <div className="space-y-4">
          {filteredJobs.map((job) => (
            <div key={job.id} className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900">{job.title}</h3>
                    <span className={`inline-flex items-center rounded-full px-2 py-1 text-sm font-medium ${getFitScoreColor(job.fitScore)}`}>
                      {job.fitScore}% {getFitScoreLabel(job.fitScore)}
                    </span>
                    {getApplicationStatusBadge(job.applicationStatus)}
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
                  
                  {/* Match Reasons */}
                  <div className="mb-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">Why this is a great match:</h4>
                    <ul className="space-y-1">
                      {job.matchReasons.slice(0, 2).map((reason, index) => (
                        <li key={index} className="flex items-start text-sm text-gray-600">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {reason}
                        </li>
                      ))}
                    </ul>
                    </div>
                  
                  {/* Requirements Preview */}
                  <div className="flex flex-wrap gap-2">
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

                <div className="ml-6 flex flex-col space-y-2">
                  <button
                    onClick={() => handleViewJob(job.id)}
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                  >
                    <Eye className="h-4 w-4 mr-2" />
                    View Details
                  </button>
                  
                  {job.applicationStatus !== 'applied' && (
                    <button
                      onClick={() => handleApply(job.id)}
                      className="inline-flex items-center px-4 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors"
                    >
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Apply Now
                    </button>
                  )}
                  
                  <button
                    onClick={() => handleBookmark(job.id)}
                    className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                      job.isBookmarked
                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                        : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Bookmark className={`h-4 w-4 mr-2 ${job.isBookmarked ? 'fill-current' : ''}`} />
                    {job.isBookmarked ? 'Bookmarked' : 'Bookmark'}
                  </button>
                </div>
              </div>
            </div>
        ))}
      </div>

        {filteredJobs.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm border p-12">
            <div className="text-center">
              <Target className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No matches found</h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search criteria or filters to find more opportunities.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('')
                  setSelectedFilters({ minScore: 0, jobType: 'all', location: 'all' })
                }}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
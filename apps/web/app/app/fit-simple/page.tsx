'use client'

import React, { useState } from 'react'
import { Button } from '@proof-of-fit/ui'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Alert, AlertDescription } from '@proof-of-fit/ui'
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
  const [isLoading, setIsLoading] = useState(false)
  const [jobDescription, setJobDescription] = useState('')
  const [fitScore, setFitScore] = useState<number | null>(null)
  const [analysis, setAnalysis] = useState<any>(null)

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
              <Badge variant="secondary">Demo Mode</Badge>
              <Button variant="outline" size="sm">
                <User className="h-4 w-4 mr-2" />
                Profile
              </Button>
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
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                Job Description
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="job-description">Paste the job description here</Label>
                <textarea
                  id="job-description"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                  rows={12}
                  placeholder="Paste the complete job description, including requirements, responsibilities, and qualifications..."
                />
              </div>
              
              <Button 
                onClick={handleAnalyze} 
                disabled={isLoading || !jobDescription.trim()}
                className="w-full"
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
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {fitScore !== null && analysis && (
              <>
                {/* Fit Score */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Target className="h-5 w-5 mr-2" />
                      Fit Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-6xl font-bold text-blue-600 mb-2">
                        {fitScore}
                      </div>
                      <div className="text-lg text-gray-600 mb-4">
                        {fitScore >= 80 ? 'Excellent Match' : 
                         fitScore >= 60 ? 'Good Match' : 
                         fitScore >= 40 ? 'Fair Match' : 'Poor Match'}
                      </div>
                      <Badge variant={fitScore >= 80 ? 'default' : fitScore >= 60 ? 'secondary' : 'destructive'}>
                        {fitScore >= 80 ? 'Highly Recommended' : 
                         fitScore >= 60 ? 'Recommended' : 
                         fitScore >= 40 ? 'Consider Applying' : 'Not Recommended'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Strengths */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-green-600">
                      <CheckCircle className="h-5 w-5 mr-2" />
                      Strengths
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.strengths.map((strength: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <Check className="h-4 w-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{strength}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Gaps */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-orange-600">
                      <AlertCircle className="h-5 w-5 mr-2" />
                      Areas for Improvement
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.gaps.map((gap: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <X className="h-4 w-4 text-orange-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{gap}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>

                {/* Recommendations */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center text-blue-600">
                      <Sparkles className="h-5 w-5 mr-2" />
                      Recommendations
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((rec: string, index: number) => (
                        <li key={index} className="flex items-start">
                          <ArrowRight className="h-4 w-4 text-blue-500 mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-sm text-gray-700">{rec}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </>
            )}

            {!analysis && (
              <Card>
                <CardContent className="text-center py-12">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Ready to Analyze</h3>
                  <p className="text-gray-600">
                    Paste a job description in the left panel and click "Analyze Fit" to get started.
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


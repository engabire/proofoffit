'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Info, Settings, Shield, Eye, Users, Zap } from 'lucide-react'

interface AIPreferences {
  jobMatching: boolean
  resumeOptimization: boolean
  automatedApplications: boolean
  careerInsights: boolean
  humanReview: boolean
  explanationLevel: 'basic' | 'detailed' | 'full'
}

export default function AIPreferences() {
  const [preferences, setPreferences] = useState<AIPreferences>({
    jobMatching: true,
    resumeOptimization: true,
    automatedApplications: false,
    careerInsights: true,
    humanReview: true,
    explanationLevel: 'detailed'
  })

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    // Load user preferences from API
    loadPreferences()
  }, [])

  const loadPreferences = async () => {
    try {
      // Replace with actual API call
      // const response = await fetch('/api/ai/preferences')
      // const data = await response.json()
      // setPreferences(data)
    } catch (error) {
      console.error('Error loading AI preferences:', error)
    }
  }

  const savePreferences = async () => {
    setLoading(true)
    try {
      // Replace with actual API call
      // await fetch('/api/ai/preferences', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(preferences)
      // })
      
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      console.error('Error saving AI preferences:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatePreference = (key: keyof AIPreferences, value: boolean | string) => {
    setPreferences(prev => ({ ...prev, [key]: value }))
  }

  const requestHumanReview = async () => {
    try {
      // Replace with actual API call
      // await fetch('/api/ai/human-review', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ type: 'general_review' })
      // })
      
      alert('Human review requested. We will contact you within 7-14 business days.')
    } catch (error) {
      console.error('Error requesting human review:', error)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">AI Preferences</h1>
        <p className="text-muted-foreground">
          Control how our AI systems work with your data and make decisions
        </p>
      </div>

      {saved && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            Your AI preferences have been saved successfully.
          </AlertDescription>
        </Alert>
      )}

      <div className="grid gap-6">
        {/* AI Features */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5" />
              AI Features
            </CardTitle>
            <CardDescription>
              Enable or disable specific AI-powered features
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Job Matching</h4>
                <p className="text-sm text-muted-foreground">
                  AI-powered job recommendations based on your profile
                </p>
              </div>
              <Switch
                checked={preferences.jobMatching}
                onCheckedChange={(checked) => updatePreference('jobMatching', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Resume Optimization</h4>
                <p className="text-sm text-muted-foreground">
                  AI suggestions to improve your resume for better job matching
                </p>
              </div>
              <Switch
                checked={preferences.resumeOptimization}
                onCheckedChange={(checked) => updatePreference('resumeOptimization', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Automated Applications</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically submit applications to jobs matching your criteria
                </p>
              </div>
              <Switch
                checked={preferences.automatedApplications}
                onCheckedChange={(checked) => updatePreference('automatedApplications', checked)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Career Insights</h4>
                <p className="text-sm text-muted-foreground">
                  AI-generated insights about your career path and opportunities
                </p>
              </div>
              <Switch
                checked={preferences.careerInsights}
                onCheckedChange={(checked) => updatePreference('careerInsights', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Transparency Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Transparency Settings
            </CardTitle>
            <CardDescription>
              Control how much information you receive about AI decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Explanation Level</label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="explanationLevel"
                    value="basic"
                    checked={preferences.explanationLevel === 'basic'}
                    onChange={(e) => updatePreference('explanationLevel', e.target.value)}
                    className="rounded"
                  />
                  <span className="text-sm">Basic - Simple explanations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="explanationLevel"
                    value="detailed"
                    checked={preferences.explanationLevel === 'detailed'}
                    onChange={(e) => updatePreference('explanationLevel', e.target.value)}
                    className="rounded"
                  />
                  <span className="text-sm">Detailed - Comprehensive explanations</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="explanationLevel"
                    value="full"
                    checked={preferences.explanationLevel === 'full'}
                    onChange={(e) => updatePreference('explanationLevel', e.target.value)}
                    className="rounded"
                  />
                  <span className="text-sm">Full - Technical details and reasoning</span>
                </label>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Human Review</h4>
                <p className="text-sm text-muted-foreground">
                  Automatically request human review for important AI decisions
                </p>
              </div>
              <Switch
                checked={preferences.humanReview}
                onCheckedChange={(checked) => updatePreference('humanReview', checked)}
              />
            </div>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Your AI Rights
            </CardTitle>
            <CardDescription>
              Exercise your rights regarding AI-powered decisions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              <Button
                variant="outline"
                onClick={requestHumanReview}
                className="justify-start"
              >
                <Users className="h-4 w-4 mr-2" />
                Request Human Review
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/legal/ai-governance', '_blank')}
                className="justify-start"
              >
                <Info className="h-4 w-4 mr-2" />
                View AI Governance Policy
              </Button>
              
              <Button
                variant="outline"
                onClick={() => window.open('/api/dsr', '_blank')}
                className="justify-start"
              >
                <Settings className="h-4 w-4 mr-2" />
                Submit Data Request
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* AI Model Information */}
        <Card>
          <CardHeader>
            <CardTitle>AI Model Information</CardTitle>
            <CardDescription>
              Current information about our AI systems
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Job Matching Model</span>
                <Badge variant="secondary">v2.1</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Resume Optimization Model</span>
                <Badge variant="secondary">v1.3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Last Updated</span>
                <span className="text-sm text-muted-foreground">January 2025</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Accuracy Rate</span>
                <span className="text-sm text-muted-foreground">78%</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={savePreferences} disabled={loading}>
          {loading ? 'Saving...' : 'Save Preferences'}
        </Button>
      </div>
    </div>
  )
}

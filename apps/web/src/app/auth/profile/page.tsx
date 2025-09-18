"use client"

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { Card, CardContent, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Loader2, CheckCircle, AlertCircle, User, Building2, Briefcase, GraduationCap } from 'lucide-react'

interface ProfileData {
  name: string
  email: string
  headline: string
  location: string
  industry: string
  experience: Array<{
    title: string
    company: string
    duration: string
    description: string
  }>
  education: Array<{
    degree: string
    institution: string
    year: string
  }>
  skills: string[]
  summary: string
}

export default function ProfileAuthPage() {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const router = useRouter()
  const searchParams = useSearchParams()
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'connecting'>('loading')
  const [message, setMessage] = useState('Initializing professional profile connection...')
  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeoutId: NodeJS.Timeout
    
    async function handleProfileAuth() {
      // Add a small delay to ensure the component is fully mounted
      await new Promise(resolve => setTimeout(resolve, 100))
      
      // Set a timeout to prevent hanging
      timeoutId = setTimeout(() => {
        if (status === 'loading' || status === 'connecting') {
          setStatus('error')
          setError('Connection timeout. Please try again.')
          setMessage('Profile connection timed out')
        }
      }, 30000) // 30 second timeout
      
      if (!supabase) {
        setStatus('error')
        setMessage('Authentication service not available')
        setTimeout(() => router.replace('/auth/signin'), 3000)
        return
      }
      
      try {
        setStatus('connecting')
        setMessage('Connecting to professional profile service...')
        
        const code = searchParams.get('code')
        const error = searchParams.get('error')
        const state = searchParams.get('state')
        
        if (error) {
          throw new Error(`Profile connection error: ${error}`)
        }
        
        if (code && state) {
          // Simulate professional profile data fetching
          // In a real implementation, this would call the actual OAuth provider
          setMessage('Fetching your professional profile data...')
          
          // Simulate API call delay
          await new Promise(resolve => setTimeout(resolve, 2000))
          
          // Mock profile data - in real implementation, this would come from the OAuth provider
          const mockProfileData: ProfileData = {
            name: "John Doe",
            email: "john.doe@example.com",
            headline: "Senior Software Engineer",
            location: "San Francisco, CA",
            industry: "Technology",
            experience: [
              {
                title: "Senior Software Engineer",
                company: "Tech Company Inc.",
                duration: "2020 - Present",
                description: "Led development of scalable web applications using modern technologies"
              },
              {
                title: "Software Engineer",
                company: "StartupXYZ",
                duration: "2018 - 2020",
                description: "Developed full-stack applications and contributed to product architecture"
              }
            ],
            education: [
              {
                degree: "Bachelor of Science in Computer Science",
                institution: "University of California",
                year: "2018"
              }
            ],
            skills: ["JavaScript", "TypeScript", "React", "Node.js", "Python", "AWS", "Docker"],
            summary: "Experienced software engineer with 5+ years of experience building scalable web applications. Passionate about clean code, system design, and mentoring junior developers."
          }
          
          setProfileData(mockProfileData)
          setStatus('success')
          setMessage('Professional profile imported successfully!')
          
          // Track successful profile import
          try { 
            await import('../../../lib/analytics').then(m => m.track({ name: 'profile_import_success' })) 
          } catch {}
          
          // Log successful profile import
          try {
            await supabase
              .from('action_log')
              .insert({
                tenantId: 'current_user',
                actorType: 'user',
                actorId: 'profile_import',
                action: 'profile_import_success',
                objType: 'profile',
                objId: 'professional_profile',
                payloadHash: 'profile_import_success'
              })
          } catch (error) {
            console.error('Failed to log profile import:', error)
          }
          
          // Redirect to fit report with imported data after 3 seconds
          setTimeout(() => {
            router.replace('/app/fit?profile_imported=true')
          }, 3000)
          
        } else {
          // No code provided, redirect to profile connection
          setStatus('connecting')
          setMessage('Redirecting to professional profile service...')
          
          // In a real implementation, this would redirect to the actual OAuth provider
          // For now, we'll simulate the OAuth flow with a more realistic delay
          setTimeout(() => {
            // Simulate OAuth redirect with realistic parameters
            const mockCode = 'mock_oauth_code_' + Date.now()
            const mockState = 'mock_state_' + Date.now()
            router.replace(`/auth/profile?code=${mockCode}&state=${mockState}`)
          }, 1500)
        }
      } catch (err: any) {
        console.error('Profile auth error:', err)
        setStatus('error')
        setError(err.message || 'Failed to connect professional profile')
        setMessage('Profile connection failed')
        
        // Log failed profile import
        if (supabase) {
          try {
            await supabase
              .from('action_log')
              .insert({
                tenantId: 'anonymous',
                actorType: 'system',
                actorId: 'profile_auth',
                action: 'profile_import_failed',
                objType: 'profile',
                objId: 'professional_profile',
                payloadHash: 'profile_import_failed'
              })
          } catch (error) {
            console.error('Failed to log profile import failure:', error)
          }
        }
        
        setTimeout(() => {
          router.replace('/app/fit')
        }, 5000)
      }
    }
    
    handleProfileAuth()
    
    // Cleanup timeout on unmount
    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId)
      }
    }
  }, [router, searchParams, supabase, status])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'loading' && (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            )}
            {status === 'connecting' && (
              <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-8 w-8 text-green-600" />
            )}
            {status === 'error' && (
              <AlertCircle className="h-8 w-8 text-red-600" />
            )}
          </div>
          <CardTitle className="text-xl">
            {status === 'loading' && 'Professional Profile Connection'}
            {status === 'connecting' && 'Connecting to Professional Profile'}
            {status === 'success' && 'Profile Imported Successfully!'}
            {status === 'error' && 'Connection Failed'}
          </CardTitle>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <p className="text-center text-gray-600">{message}</p>
          
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}
          
          {profileData && status === 'success' && (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                <h3 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Profile Data Imported
                </h3>
                <div className="text-sm text-green-700 space-y-1">
                  <p><strong>Name:</strong> {profileData.name}</p>
                  <p><strong>Headline:</strong> {profileData.headline}</p>
                  <p><strong>Location:</strong> {profileData.location}</p>
                  <p><strong>Industry:</strong> {profileData.industry}</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <h4 className="font-medium text-blue-800 mb-2 flex items-center gap-2">
                    <Briefcase className="h-4 w-4" />
                    Experience
                  </h4>
                  <p className="text-sm text-blue-700">{profileData.experience.length} positions</p>
                </div>
                
                <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                  <h4 className="font-medium text-purple-800 mb-2 flex items-center gap-2">
                    <GraduationCap className="h-4 w-4" />
                    Education
                  </h4>
                  <p className="text-sm text-purple-700">{profileData.education.length} degrees</p>
                </div>
              </div>
              
              <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Skills</h4>
                <div className="flex flex-wrap gap-2">
                  {profileData.skills.slice(0, 6).map((skill, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                  {profileData.skills.length > 6 && (
                    <Badge variant="outline" className="text-xs">
                      +{profileData.skills.length - 6} more
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {status === 'loading' && (
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-500">
                Please wait while we initialize the connection...
              </p>
              <div className="flex justify-center">
                <div className="animate-pulse bg-blue-100 rounded-lg p-3">
                  <p className="text-xs text-blue-600">Initializing secure connection...</p>
                </div>
              </div>
            </div>
          )}
          
          {status === 'connecting' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Redirecting to professional profile service...
              </p>
            </div>
          )}
          
          {status === 'success' && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Redirecting to Fit Report with imported data...
              </p>
            </div>
          )}
          
          {status === 'error' && (
            <div className="text-center space-y-3">
              <p className="text-xs text-gray-500">
                You will be redirected to the Fit Report page shortly.
              </p>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => {
                    setStatus('loading')
                    setError(null)
                    setMessage('Retrying profile connection...')
                    // Retry the connection
                    setTimeout(() => {
                      const mockCode = 'mock_oauth_code_' + Date.now()
                      const mockState = 'mock_state_' + Date.now()
                      router.replace(`/auth/profile?code=${mockCode}&state=${mockState}`)
                    }, 1000)
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  Try Again
                </button>
                <button
                  onClick={() => router.replace('/app/fit')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
                >
                  Skip & Continue
                </button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

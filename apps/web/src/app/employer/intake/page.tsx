"use client"

export const dynamic = 'force-dynamic'
export const revalidate = 0
export const fetchCache = 'force-no-store'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Textarea } from '@proof-of-fit/ui'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@proof-of-fit/ui'
import { Checkbox } from '@proof-of-fit/ui'
import { Plus, Trash2, Save } from 'lucide-react'
// Simple toast implementation
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

export default function JobIntakePage() {
  const router = useRouter()
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
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

    if (!supabase) {
      toast.error('Database not configured. Please contact support.')
      setLoading(false)
      return
    }

    try {
      // First create a job entry
      const { data: job, error: jobError } = await supabase
        .from('jobs')
        .insert({
          source: 'manual',
          org: formData.company,
          title: formData.jobTitle,
          location: formData.location,
          workType: formData.workType,
          pay: {
            min: formData.salaryMin ? parseInt(formData.salaryMin) : null,
            max: formData.salaryMax ? parseInt(formData.salaryMax) : null,
            currency: 'USD'
          },
          description: formData.description,
          requirements: {
            must_have: formData.mustHave,
            preferred: formData.preferred
          },
          constraints: formData.constraints,
          tos: {
            allowed: true,
            captcha: false,
            notes: 'Manual job posting'
          }
        })
        .select()
        .single()

      if (jobError) throw jobError

      // Then create the employer intake
      const { data: intake, error: intakeError } = await supabase
        .from('employer_intakes')
        .insert({
          jobRef: job.id,
          mustHave: formData.mustHave,
          preferred: formData.preferred,
          preferenceOrder: formData.mustHave.concat(formData.preferred),
          weights: {
            must_have: 1.0,
            preferred: 0.7
          },
          constraints: formData.constraints,
          terms: {
            autoApply: false,
            requireApproval: true
          }
        })
        .select()
        .single()

      if (intakeError) throw intakeError

      toast.success('Job intake created successfully!')
      router.push(`/employer/slates/${intake.id}`)
    } catch (error: any) {
      toast.error(error.message || 'Failed to create job intake')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Create Job Intake</h1>
        <p className="text-muted-foreground">
          Define your hiring requirements to generate candidate slates
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Job Details</CardTitle>
            <CardDescription>
              Basic information about the position
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <Input
                  id="jobTitle"
                  value={formData.jobTitle}
                  onChange={(e) => setFormData(prev => ({ ...prev, jobTitle: e.target.value }))}
                  placeholder="e.g., Senior Frontend Developer"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., TechCorp Inc."
                  required
                />
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="workType">Work Type</Label>
                <Select value={formData.workType} onValueChange={(value) => setFormData(prev => ({ ...prev, workType: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="remote">Remote</SelectItem>
                    <SelectItem value="hybrid">Hybrid</SelectItem>
                    <SelectItem value="onsite">On-site</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="salaryMin">Minimum Salary</Label>
                <Input
                  id="salaryMin"
                  type="number"
                  value={formData.salaryMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                  placeholder="80000"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="salaryMax">Maximum Salary</Label>
                <Input
                  id="salaryMax"
                  type="number"
                  value={formData.salaryMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                  placeholder="120000"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Job Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Requirements</CardTitle>
            <CardDescription>
              Define must-have and preferred qualifications
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Must Have Requirements */}
            <div className="space-y-3">
              <Label>Must Have Requirements</Label>
              <div className="space-y-2">
                {formData.mustHave.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-red-50 dark:bg-red-950 rounded border">
                      <span className="text-sm">{req}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement('mustHave', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={newMustHave}
                    onChange={(e) => setNewMustHave(e.target.value)}
                    placeholder="e.g., 5+ years React experience"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement('mustHave', newMustHave))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addRequirement('mustHave', newMustHave)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Preferred Requirements */}
            <div className="space-y-3">
              <Label>Preferred Requirements</Label>
              <div className="space-y-2">
                {formData.preferred.map((req, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <div className="flex-1 p-2 bg-blue-50 dark:bg-blue-950 rounded border">
                      <span className="text-sm">{req}</span>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRequirement('preferred', index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex space-x-2">
                  <Input
                    value={newPreferred}
                    onChange={(e) => setNewPreferred(e.target.value)}
                    placeholder="e.g., Healthcare domain experience"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addRequirement('preferred', newPreferred))}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => addRequirement('preferred', newPreferred)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Constraints</CardTitle>
            <CardDescription>
              Additional requirements and restrictions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="workAuth">Work Authorization</Label>
              <Select 
                value={formData.constraints.workAuth} 
                onValueChange={(value) => setFormData(prev => ({ 
                  ...prev, 
                  constraints: { ...prev.constraints, workAuth: value }
                }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="any">Any</SelectItem>
                  <SelectItem value="US_citizen_or_green_card">US Citizen or Green Card</SelectItem>
                  <SelectItem value="US_citizen_only">US Citizen Only</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="clearance">Security Clearance</Label>
              <Input
                id="clearance"
                value={formData.constraints.clearance}
                onChange={(e) => setFormData(prev => ({ 
                  ...prev, 
                  constraints: { ...prev.constraints, clearance: e.target.value }
                }))}
                placeholder="e.g., Secret, Top Secret, None"
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Creating...' : 'Create Job Intake'}
          </Button>
        </div>
      </form>
    </div>
  )
}
"use client"

import { useState, useCallback, useRef, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { isSupabaseConfigured } from '@/lib/env'
import { Card, CardContent, CardHeader, CardTitle, Badge, Button, Input, Label, Textarea } from '@proof-of-fit/ui'
import { Loader2, CheckCircle, User, Building2, Briefcase, GraduationCap, Plus, X, Save, ArrowLeft, Upload, Sparkles, FileText, FileImage, FileVideo, Trash2 } from 'lucide-react'

interface ExperienceEntry {
  title: string
  company: string
  duration: string
  description: string
}

interface EducationEntry {
  degree: string
  institution: string
  year: string
}

type UploadedAssetType = 'resume' | 'cover_letter' | 'document' | 'image' | 'video' | 'other'

interface ExtractedProfileData {
  name?: string
  email?: string
  headline?: string
  location?: string
  industry?: string
  summary?: string
  skills?: string[]
  experience?: ExperienceEntry[]
  education?: EducationEntry[]
}

interface UploadedAsset {
  id: string
  name: string
  size: number
  type: UploadedAssetType
  uploadedAt: Date
  status: 'processing' | 'ready' | 'error'
  extractedData?: ExtractedProfileData | null
  message?: string
  error?: string
}

const formatFileSize = (bytes: number) => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  let size = bytes
  let unitIndex = 0

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024
    unitIndex += 1
  }

  return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`
}

const detectAssetType = (file: File): UploadedAssetType => {
  const extension = file.name.split('.').pop()?.toLowerCase() ?? ''
  const mime = file.type.toLowerCase()

  if (mime.startsWith('image/') || ['png', 'jpg', 'jpeg', 'gif', 'webp'].includes(extension)) {
    return 'image'
  }

  if (mime.startsWith('video/') || ['mp4', 'mov', 'avi', 'webm'].includes(extension)) {
    return 'video'
  }

  if (['pdf', 'doc', 'docx', 'txt', 'rtf', 'md'].includes(extension)) {
    if (/cover/i.test(file.name)) return 'cover_letter'
    if (/(resume|cv)/i.test(file.name)) return 'resume'
    return 'document'
  }

  if (mime.includes('pdf') || mime.includes('word') || mime.includes('text')) {
    if (/cover/i.test(file.name)) return 'cover_letter'
    if (/(resume|cv)/i.test(file.name)) return 'resume'
    return 'document'
  }

  return 'other'
}

const createAssetId = () => (
  typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(16).slice(2)}`
)

const mergeExperienceEntries = (existing: ExperienceEntry[], incoming: ExperienceEntry[]) => {
  const combined = [...existing]

  incoming.forEach(entry => {
    const exists = combined.some(
      item =>
        item.title.trim().toLowerCase() === entry.title.trim().toLowerCase() &&
        item.company.trim().toLowerCase() === entry.company.trim().toLowerCase() &&
        item.duration.trim().toLowerCase() === entry.duration.trim().toLowerCase()
    )

    if (!exists) {
      combined.push(entry)
    }
  })

  return combined
}

const mergeEducationEntries = (existing: EducationEntry[], incoming: EducationEntry[]) => {
  const combined = [...existing]

  incoming.forEach(entry => {
    const exists = combined.some(
      item =>
        item.degree.trim().toLowerCase() === entry.degree.trim().toLowerCase() &&
        item.institution.trim().toLowerCase() === entry.institution.trim().toLowerCase() &&
        item.year.trim().toLowerCase() === entry.year.trim().toLowerCase()
    )

    if (!exists) {
      combined.push(entry)
    }
  })

  return combined
}

const extractProfileDataFromFile = async (file: File, assetType: UploadedAssetType): Promise<ExtractedProfileData | null> => {
  if (assetType === 'image' || assetType === 'video' || assetType === 'other') {
    return null
  }

  let rawText = ''

  try {
    rawText = await file.text()
  } catch (err) {
    console.error('Failed to read uploaded file for autofill', err)
    return null
  }

  if (!rawText || rawText.trim().length === 0) {
    return null
  }

  const sanitized = rawText
    .replace(/\0/g, ' ')
    .replace(/\r/g, '\n')
    .replace(/[\u2022\u25CF]/g, '•')

  const letterCount = (sanitized.match(/[A-Za-z]/g) || []).length
  if (letterCount < 40) {
    return null
  }

  const normalizedText = sanitized.replace(/\n{3,}/g, '\n\n')
  const lines = normalizedText
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean)

  if (lines.length === 0) {
    return null
  }

  const profile: ExtractedProfileData = {}

  const nameIndex = lines.findIndex((line) => {
    if (line.length > 60) return false
    if (!/[A-Za-z]/.test(line)) return false
    if (line.includes('@')) return false
    const words = line.split(/\s+/)
    return words.length >= 2 && words.length <= 4
  })

  if (nameIndex >= 0) {
    profile.name = lines[nameIndex]
    const headlineCandidate = lines[nameIndex + 1]
    if (headlineCandidate && headlineCandidate.length <= 70 && !headlineCandidate.includes('@')) {
      profile.headline = headlineCandidate
    }
  }

  const emailMatch = normalizedText.match(/[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}/)
  if (emailMatch) {
    profile.email = emailMatch[0]
  }

  const locationMatch = normalizedText.match(/\b([A-Z][a-zA-Z]+(?:[\s-][A-Z][a-zA-Z]+)*,?\s+(?:[A-Z]{2}|[A-Z][a-zA-Z]+))(?:\s|$)/)
  if (locationMatch) {
    profile.location = locationMatch[1].replace(/\s+/g, ' ').replace(/,$/, '')
  }

  const industryMatch = normalizedText.match(/Industry\s*[:\-]\s*(.+)/i)
  if (industryMatch) {
    profile.industry = industryMatch[1].split(/\n|\r/)[0].trim()
  }

  const summaryMatch = normalizedText.match(/(?:Professional Summary|Summary|Profile)\s*[:\-]?\s*([\s\S]{0,600})/i)
  if (summaryMatch) {
    const section = summaryMatch[1]
      .split(/\n{2,}|(?:Experience|Work History|Education|Skills)/i)[0]
      .trim()
    if (section.length > 0) {
      profile.summary = section.replace(/\n+/g, ' ').slice(0, 600)
    }
  } else if (lines.length >= 3) {
    profile.summary = lines.slice(1, 4).join(' ').slice(0, 600)
  }

  const skillsMatch = normalizedText.match(/(?:Skills|Core Competencies|Technical Skills|Key Skills)\s*[:\-]?\s*([\s\S]{0,500})/i)
  if (skillsMatch) {
    const skillsSection = skillsMatch[1]
      .split(/\n{2,}|(?:Experience|Work History|Education|Certifications)/i)[0]
    const skills = skillsSection
      .split(/[,•\n;]+/)
      .map(skill => skill.trim())
      .filter(skill => skill.length >= 2 && skill.length <= 40)

    if (skills.length > 0) {
      profile.skills = Array.from(new Set(skills)).slice(0, 18)
    }
  }

  const expMatch = normalizedText.match(/(?:Experience|Professional Experience|Work History)\s*[:\-]?\s*([\s\S]+)/i)
  if (expMatch) {
    const experienceSection = expMatch[1]
      .split(/(?:Education|Skills|Certifications|Projects|Awards)/i)[0]

    const rawEntries = experienceSection
      .split(/\n{2,}/)
      .map(entry => entry.trim())
      .filter(entry => entry.length > 0)

    const experienceEntries: ExperienceEntry[] = []

    rawEntries.slice(0, 4).forEach(entry => {
      const entryLines = entry.split(/\n/).map(line => line.trim()).filter(Boolean)
      if (entryLines.length === 0) return

      let titleLine = entryLines[0]
      let company = ''
      let title = titleLine
      const headerParts = titleLine.split(/\s+(?:at|@)\s+/i)

      if (headerParts.length > 1) {
        title = headerParts[0].trim()
        company = headerParts[1].trim()
      } else if (entryLines.length > 1) {
        company = entryLines[1]
      }

      const durationMatch = entry.match(/(\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b\s*(?:-|to|–|—)?\s*(?:Present|\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Sept|Oct|Nov|Dec)[a-z]*\.?\s+\d{4}\b|\d{4}))/i)
        || entry.match(/\b\d{4}\b\s*(?:-|to|–|—)\s*(?:Present|\d{4})/i)

      const description = entryLines
        .slice(1)
        .join(' ')
        .replace(/•/g, ' • ')
        .replace(/\s+/g, ' ')
        .trim()

      if (title.length === 0 && description.length === 0) {
        return
      }

      experienceEntries.push({
        title: title.slice(0, 120) || 'Role',
        company: company.slice(0, 120) || 'Company',
        duration: durationMatch ? durationMatch[0].replace(/\s+/g, ' ') : '',
        description: description.slice(0, 320)
      })
    })

    if (experienceEntries.length > 0) {
      profile.experience = experienceEntries
    }
  }

  const eduMatch = normalizedText.match(/Education\s*[:\-]?\s*([\s\S]+)/i)
  if (eduMatch) {
    const educationSection = eduMatch[1]
      .split(/(?:Experience|Work History|Skills|Certifications|Projects)/i)[0]

    const rawEducationEntries = educationSection
      .split(/\n{2,}/)
      .map(entry => entry.trim())
      .filter(entry => entry.length > 0)

    const educationEntries: EducationEntry[] = []

    rawEducationEntries.slice(0, 3).forEach(entry => {
      const entryLines = entry.split(/\n/).map(line => line.trim()).filter(Boolean)
      if (entryLines.length === 0) return

      const degreeLine = entryLines[0]
      const institutionLine = entryLines[1] ?? ''
      const yearMatch = entry.match(/\b(19|20)\d{2}\b/)

      educationEntries.push({
        degree: degreeLine.slice(0, 120),
        institution: institutionLine.slice(0, 120) || 'Institution',
        year: yearMatch ? yearMatch[0] : ''
      })
    })

    if (educationEntries.length > 0) {
      profile.education = educationEntries
    }
  }

  if (
    !profile.name &&
    !profile.email &&
    !profile.summary &&
    (!profile.skills || profile.skills.length === 0) &&
    (!profile.experience || profile.experience.length === 0) &&
    (!profile.education || profile.education.length === 0)
  ) {
    return null
  }

  return profile
}

const assetTypeLabels: Record<UploadedAssetType, string> = {
  resume: 'Resume',
  cover_letter: 'Cover Letter',
  document: 'Document',
  image: 'Image',
  video: 'Video',
  other: 'File'
}

export default function ProfileAuthPage() {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const router = useRouter()
  const [status, setStatus] = useState<'form' | 'success' | 'error'>('form')
  const [message, setMessage] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const [uploadedAssets, setUploadedAssets] = useState<UploadedAsset[]>([])
  const [uploadFeedback, setUploadFeedback] = useState<string | null>(null)
  const [autofillFeedback, setAutofillFeedback] = useState<string | null>(null)
  const [autofillingAssetId, setAutofillingAssetId] = useState<string | null>(null)
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    headline: '',
    location: '',
    industry: '',
    summary: '',
    skills: [] as string[],
    experience: [] as ExperienceEntry[],
    education: [] as EducationEntry[]
  })
  
  const [newSkill, setNewSkill] = useState('')
  const [newExperience, setNewExperience] = useState<ExperienceEntry>({
    title: '',
    company: '',
    duration: '',
    description: ''
  })
  const [newEducation, setNewEducation] = useState<EducationEntry>({
    degree: '',
    institution: '',
    year: ''
  })

  const readyAutofillAsset = useMemo(
    () => uploadedAssets.find(asset => asset.status === 'ready' && asset.extractedData),
    [uploadedAssets]
  )

  const triggerFileDialog = useCallback(() => {
    fileInputRef.current?.click()
  }, [])

  const removeUploadedAsset = useCallback((assetId: string) => {
    setUploadedAssets(prev => prev.filter(asset => asset.id !== assetId))
  }, [])

  const processUploadedFile = useCallback(async (file: File) => {
    const id = createAssetId()
    const type = detectAssetType(file)

    setUploadedAssets(prev => [
      {
        id,
        name: file.name,
        size: file.size,
        type,
        uploadedAt: new Date(),
        status: 'processing'
      },
      ...prev
    ])

    try {
      const extracted = await extractProfileDataFromFile(file, type)

      setUploadedAssets(prev => prev.map(asset => asset.id === id ? {
        ...asset,
        status: 'ready',
        extractedData: extracted,
        message: extracted
          ? 'Structured profile info detected'
          : 'Stored for quick reference'
      } : asset))

      setUploadFeedback(`Uploaded ${file.name}${extracted ? ' and captured details you can drop into the form.' : '.'}`)
    } catch (err: any) {
      setUploadedAssets(prev => prev.map(asset => asset.id === id ? {
        ...asset,
        status: 'error',
        error: err?.message || 'Unable to read file'
      } : asset))
      setUploadFeedback(`We could not process ${file.name}. Try a different file or format.`)
    }
  }, [])

  const handleFileSelection = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files

    if (!files || files.length === 0) return

    setAutofillFeedback(null)
    Array.from(files).forEach(file => {
      processUploadedFile(file)
    })

    // reset so selecting the same file again triggers onChange
    event.target.value = ''
  }, [processUploadedFile])

  const applyAutofillFromAsset = useCallback(async (asset: UploadedAsset) => {
    if (!asset.extractedData) {
      setAutofillFeedback('No structured information available from this upload yet.')
      return
    }

    setAutofillingAssetId(asset.id)
    setAutofillFeedback(null)

    try {
      await new Promise(resolve => setTimeout(resolve, 250))

      setFormData(prev => ({
        ...prev,
        name: asset.extractedData?.name ?? prev.name,
        email: asset.extractedData?.email ?? prev.email,
        headline: asset.extractedData?.headline ?? prev.headline,
        location: asset.extractedData?.location ?? prev.location,
        industry: asset.extractedData?.industry ?? prev.industry,
        summary: asset.extractedData?.summary ?? prev.summary,
        skills: asset.extractedData?.skills
          ? Array.from(new Set([...prev.skills, ...asset.extractedData.skills.filter(skill => skill.trim().length > 0)]))
          : prev.skills,
        experience: asset.extractedData?.experience?.length
          ? mergeExperienceEntries(prev.experience, asset.extractedData.experience)
          : prev.experience,
        education: asset.extractedData?.education?.length
          ? mergeEducationEntries(prev.education, asset.extractedData.education)
          : prev.education
      }))

      setAutofillFeedback(`Imported details from ${asset.name}. Double-check everything before saving.`)
    } finally {
      setAutofillingAssetId(null)
    }
  }, [])

  // Helper functions
  const addSkill = useCallback(() => {
    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData(prev => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()]
      }))
      setNewSkill('')
    }
  }, [newSkill, formData.skills])

  const removeSkill = useCallback((skillToRemove: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter(skill => skill !== skillToRemove)
    }))
  }, [])

  const addExperience = useCallback(() => {
    if (newExperience.title.trim() && newExperience.company.trim()) {
      setFormData(prev => ({
        ...prev,
        experience: [...prev.experience, { ...newExperience }]
      }))
      setNewExperience({ title: '', company: '', duration: '', description: '' })
    }
  }, [newExperience])

  const removeExperience = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }))
  }, [])

  const addEducation = useCallback(() => {
    if (newEducation.degree.trim() && newEducation.institution.trim()) {
      setFormData(prev => ({
        ...prev,
        education: [...prev.education, { ...newEducation }]
      }))
      setNewEducation({ degree: '', institution: '', year: '' })
    }
  }, [newEducation])

  const removeEducation = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }))
  }, [])

  const renderAssetIcon = (type: UploadedAssetType) => {
    switch (type) {
      case 'resume':
        return <FileText className="w-5 h-5 text-blue-500" />
      case 'cover_letter':
        return <FileText className="w-5 h-5 text-indigo-500" />
      case 'document':
        return <FileText className="w-5 h-5 text-slate-500" />
      case 'image':
        return <FileImage className="w-5 h-5 text-purple-500" />
      case 'video':
        return <FileVideo className="w-5 h-5 text-amber-500" />
      default:
        return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const handleSaveProfile = async () => {
    if (!formData.name.trim() || !formData.email.trim()) {
      setError('Name and email are required')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Save profile data to Supabase
      if (supabase) {
        const { data: { user } } = await supabase.auth.getUser()
        if (user) {
          await supabase
            .from('action_log')
            .insert({
              tenantId: user.id,
              actorType: 'user',
              actorId: user.id,
              action: 'profile_created',
              objType: 'profile',
              objId: user.id,
              payloadHash: JSON.stringify(formData)
            })
        }
      }

      setStatus('success')
      setMessage('Professional profile saved successfully!')

      // Track successful profile creation
      try { 
        await import('../../../lib/analytics').then(m => m.track({ name: 'profile_created' })) 
      } catch {}

      // Redirect to fit report after 2 seconds
      setTimeout(() => {
        router.replace('/app/fit?profile_imported=true')
      }, 2000)

    } catch (err: any) {
      console.error('Profile save error:', err)
      setError(err.message || 'Failed to save profile')
      setSaving(false)
    }
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-xl text-green-800">Profile Created Successfully!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-center text-gray-600">{message}</p>
            <div className="text-center">
              <p className="text-sm text-gray-500">
                Redirecting to Fit Report with your profile data...
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="container mx-auto max-w-4xl py-8">
        {/* Header */}
        <div className="mb-8">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-gray-900">Create Your Professional Profile</h1>
          <p className="text-gray-600 mt-2">
            Fill out your professional information to get personalized Fit Reports
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5" />
                  Basic Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="headline">Professional Headline</Label>
                  <Input
                    id="headline"
                    value={formData.headline}
                    onChange={(e) => setFormData(prev => ({ ...prev, headline: e.target.value }))}
                    placeholder="Senior Software Engineer"
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={formData.location}
                      onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                      placeholder="San Francisco, CA"
                    />
                  </div>
                  <div>
                    <Label htmlFor="industry">Industry</Label>
                    <Input
                      id="industry"
                      value={formData.industry}
                      onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                      placeholder="Technology"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={formData.summary}
                    onChange={(e) => setFormData(prev => ({ ...prev, summary: e.target.value }))}
                    placeholder="Brief description of your professional background and expertise..."
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex gap-2">
                  <Input
                    value={newSkill}
                    onChange={(e) => setNewSkill(e.target.value)}
                    placeholder="Add a skill"
                    onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                  />
                  <Button onClick={addSkill} disabled={!newSkill.trim()}>
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                {formData.skills.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {formData.skills.map((skill, index) => (
                      <Badge key={index} variant="secondary" className="flex items-center gap-1">
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          className="ml-1 hover:text-red-600"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Experience */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Building2 className="w-5 h-5" />
                  Work Experience
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-medium">{exp.title}</h4>
                        <p className="text-sm text-gray-600">{exp.company} • {exp.duration}</p>
                      </div>
                      <button
                        onClick={() => removeExperience(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                    <p className="text-sm text-gray-700">{exp.description}</p>
                  </div>
                ))}
                
                <div className="space-y-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-medium">Add New Experience</h4>
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      value={newExperience.title}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, title: e.target.value }))}
                      placeholder="Job Title"
                    />
                    <Input
                      value={newExperience.company}
                      onChange={(e) => setNewExperience(prev => ({ ...prev, company: e.target.value }))}
                      placeholder="Company"
                    />
                  </div>
                  <Input
                    value={newExperience.duration}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, duration: e.target.value }))}
                    placeholder="Duration (e.g., 2020 - Present)"
                  />
                  <Textarea
                    value={newExperience.description}
                    onChange={(e) => setNewExperience(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Job description and key achievements..."
                    rows={2}
                  />
                  <Button onClick={addExperience} disabled={!newExperience.title.trim() || !newExperience.company.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Experience
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  Education
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {formData.education.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-lg bg-gray-50">
                    <div className="flex justify-between items-start">
                      <div>
                        <h4 className="font-medium">{edu.degree}</h4>
                        <p className="text-sm text-gray-600">{edu.institution} • {edu.year}</p>
                      </div>
                      <button
                        onClick={() => removeEducation(index)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
                
                <div className="space-y-3 p-4 border-2 border-dashed border-gray-300 rounded-lg">
                  <h4 className="font-medium">Add Education</h4>
                  <Input
                    value={newEducation.degree}
                    onChange={(e) => setNewEducation(prev => ({ ...prev, degree: e.target.value }))}
                    placeholder="Degree (e.g., Bachelor of Science in Computer Science)"
                  />
                  <div className="grid md:grid-cols-2 gap-3">
                    <Input
                      value={newEducation.institution}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, institution: e.target.value }))}
                      placeholder="Institution"
                    />
                    <Input
                      type="number"
                      inputMode="numeric"
                      min="1950"
                      max="2100"
                      value={newEducation.year}
                      onChange={(e) => setNewEducation(prev => ({ ...prev, year: e.target.value }))}
                      placeholder="Year (e.g., 2024)"
                    />
                  </div>
                  <Button onClick={addEducation} disabled={!newEducation.degree.trim() || !newEducation.institution.trim()}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Education
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5" />
                  Autofill from Uploads
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Upload a resume, cover letter, supporting document, or even media. We&apos;ll pull any structured details we can into your profile.
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" onClick={triggerFileDialog}>
                    <Upload className="w-4 h-4 mr-2" />
                    Upload files
                  </Button>
                  {readyAutofillAsset && (
                    <Button
                      onClick={() => applyAutofillFromAsset(readyAutofillAsset)}
                      disabled={autofillingAssetId === readyAutofillAsset.id}
                    >
                      {autofillingAssetId === readyAutofillAsset.id ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Applying...
                        </>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Autofill latest
                        </>
                      )}
                    </Button>
                  )}
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  className="hidden"
                  accept=".pdf,.doc,.docx,.txt,.rtf,.md,.png,.jpg,.jpeg,.gif,.webp,.mp4,.mov,.avi,.webm"
                  multiple
                  onChange={handleFileSelection}
                />
                {uploadFeedback && (
                  <div className="text-xs text-gray-500 bg-gray-100 border border-gray-200 rounded-md p-2">
                    {uploadFeedback}
                  </div>
                )}
                {autofillFeedback && (
                  <div className="text-xs text-blue-700 bg-blue-50 border border-blue-100 rounded-md p-2">
                    {autofillFeedback}
                  </div>
                )}
                {uploadedAssets.length === 0 ? (
                  <div className="rounded-md border border-dashed border-gray-300 bg-gray-50 p-4 text-center text-sm text-gray-500">
                    No uploads yet. Drop in anything you&apos;d like and we&apos;ll keep it handy.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {uploadedAssets.map(asset => (
                      <div key={asset.id} className="border border-gray-200 rounded-lg p-3 bg-white shadow-sm">
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-start gap-3">
                            <div className="mt-0.5">
                              {renderAssetIcon(asset.type)}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="text-sm font-medium text-gray-900">{asset.name}</p>
                                <Badge variant="outline">{assetTypeLabels[asset.type]}</Badge>
                              </div>
                              <p className="text-xs text-gray-500 mt-1">{formatFileSize(asset.size)} • Uploaded {asset.uploadedAt.toLocaleTimeString()}</p>
                              {asset.message && (
                                <p className="text-xs text-gray-500 mt-1">{asset.message}</p>
                              )}
                              {asset.status === 'error' && asset.error && (
                                <p className="text-xs text-red-600 mt-1">{asset.error}</p>
                              )}
                              {asset.extractedData && (
                                <div className="grid gap-2 mt-2 text-xs text-gray-600 md:grid-cols-2">
                                  {asset.extractedData.name && (
                                    <div><span className="font-medium text-gray-700">Name:</span> {asset.extractedData.name}</div>
                                  )}
                                  {asset.extractedData.email && (
                                    <div><span className="font-medium text-gray-700">Email:</span> {asset.extractedData.email}</div>
                                  )}
                                  {asset.extractedData.headline && (
                                    <div><span className="font-medium text-gray-700">Headline:</span> {asset.extractedData.headline}</div>
                                  )}
                                  {asset.extractedData.skills && asset.extractedData.skills.length > 0 && (
                                    <div className="md:col-span-2">
                                      <span className="font-medium text-gray-700">Skills:</span> {asset.extractedData.skills.slice(0, 6).join(', ')}
                                      {asset.extractedData.skills.length > 6 && '…'}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="flex flex-col items-end gap-2">
                            {asset.status === 'processing' ? (
                              <Badge variant="secondary" className="flex items-center gap-1">
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Processing
                              </Badge>
                            ) : asset.status === 'ready' && asset.extractedData ? (
                              <Button
                                size="sm"
                                onClick={() => applyAutofillFromAsset(asset)}
                                disabled={autofillingAssetId === asset.id}
                              >
                                {autofillingAssetId === asset.id ? (
                                  <>
                                    <Loader2 className="w-4 h-4 mr-1 animate-spin" />
                                    Applying
                                  </>
                                ) : (
                                  <>
                                    <Sparkles className="w-4 h-4 mr-1" />
                                    Use details
                                  </>
                                )}
                              </Button>
                            ) : asset.status === 'ready' ? (
                              <Badge variant="outline">No structured data found</Badge>
                            ) : (
                              <Badge variant="destructive">Failed</Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Remove ${asset.name}`}
                              onClick={() => removeUploadedAsset(asset.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
            {/* Save Button */}
            <Card>
              <CardContent className="p-6">
                <Button
                  onClick={handleSaveProfile}
                  disabled={saving || !formData.name.trim() || !formData.email.trim()}
                  className="w-full"
                  size="lg"
                >
                  {saving ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Save Profile
                    </>
                  )}
                </Button>
                {error && (
                  <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-800 text-sm">{error}</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Profile Completion</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Basic Info</span>
                    <span>{formData.name && formData.email ? '✓' : '○'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Skills</span>
                    <span>{formData.skills.length > 0 ? '✓' : '○'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Experience</span>
                    <span>{formData.experience.length > 0 ? '✓' : '○'}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Education</span>
                    <span>{formData.education.length > 0 ? '✓' : '○'}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-gray-600">
                <p>• Include specific skills relevant to your target roles</p>
                <p>• Quantify achievements in your experience descriptions</p>
                <p>• Keep your professional summary concise but impactful</p>
                <p>• You can always edit this information later</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

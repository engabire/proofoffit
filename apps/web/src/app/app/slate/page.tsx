"use client"

import React, { useState, useEffect, useCallback } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
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
  MessageSquare,
} from "lucide-react"
import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Input,
  Textarea,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Progress,
  Label,
  RadioGroup,
  RadioGroupItem,
  Checkbox,
} from "@proof-of-fit/ui"

// Types
interface JobDescription {
  id: string
  title: string
  company: string
  location: string
  type: 'full-time' | 'part-time' | 'contract' | 'internship'
  remote: boolean
  salary?: {
    min: number
    max: number
    currency: string
  }
  description: string
  requirements: string[]
  niceToHave: string[]
  benefits: string[]
  responsibilities: string[]
  qualifications: string[]
  experienceLevel: 'entry' | 'mid' | 'senior' | 'executive'
  department: string
  teamSize?: number
  reportingTo?: string
  budget?: number
  urgency: 'low' | 'medium' | 'high'
  diversityGoals?: {
    targetPercentage: number
    currentPercentage: number
    focusAreas: string[]
  }
  complianceRequirements: string[]
  createdAt: Date
  updatedAt: Date
}

interface Candidate {
  id: string
  name: string
  email: string
  phone?: string
  location: string
  currentRole: string
  currentCompany: string
  experience: number
  education: string
  skills: string[]
  certifications: string[]
  portfolio?: string
  linkedin?: string
  github?: string
  resumeUrl?: string
  fitScore: number
  strengths: string[]
  concerns: string[]
  interviewReadiness: 'ready' | 'needs-prep' | 'not-ready'
  diversityFactors: {
    gender?: string
    ethnicity?: string
    veteran?: boolean
    disability?: boolean
    firstGeneration?: boolean
  }
  salaryExpectation?: number
  availability: 'immediate' | '2-weeks' | '1-month' | 'negotiable'
  relocation: boolean
  remote: boolean
  lastActive: Date
  source: 'database' | 'referral' | 'application' | 'sourcing'
}

interface CandidateSlate {
  id: string
  jobId: string
  candidates: Candidate[]
  generatedAt: Date
  auditTrail: {
    id: string
    hash: string
    immutable: boolean
    version: string
  }
  biasAnalysis: {
    detected: boolean
    factors: string[]
    mitigation: string[]
    diversityScore: number
  }
  recommendations: {
    topCandidate: string
    interviewOrder: string[]
    focusAreas: string[]
    redFlags: string[]
  }
  compliance: {
    eeocCompliant: boolean
    auditReady: boolean
    documentation: string[]
  }
}

// Mock data
const mockCandidates: Candidate[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@email.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    currentRole: 'Senior Software Engineer',
    currentCompany: 'TechCorp',
    experience: 6,
    education: 'MS Computer Science, Stanford',
    skills: ['Python', 'React', 'AWS', 'Docker', 'Kubernetes'],
    certifications: ['AWS Certified Solutions Architect'],
    portfolio: 'https://sarahchen.dev',
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    fitScore: 92,
    strengths: ['Strong technical skills', 'Leadership experience', 'Cultural fit'],
    concerns: ['Salary expectations may be high'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'female',
      ethnicity: 'asian',
      firstGeneration: true
    },
    salaryExpectation: 160000,
    availability: '2-weeks',
    relocation: false,
    remote: true,
    lastActive: new Date('2024-01-10'),
    source: 'database'
  },
  {
    id: '2',
    name: 'Marcus Johnson',
    email: 'marcus.j@email.com',
    location: 'Austin, TX',
    currentRole: 'Full Stack Developer',
    currentCompany: 'StartupXYZ',
    experience: 4,
    education: 'BS Computer Science, UT Austin',
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'GraphQL'],
    certifications: ['Google Cloud Professional'],
    linkedin: 'https://linkedin.com/in/marcusjohnson',
    github: 'https://github.com/marcusj',
    fitScore: 85,
    strengths: ['Fast learner', 'Startup experience', 'Strong communication'],
    concerns: ['Less senior experience'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'male',
      ethnicity: 'african-american',
      veteran: true
    },
    salaryExpectation: 120000,
    availability: 'immediate',
    relocation: true,
    remote: true,
    lastActive: new Date('2024-01-12'),
    source: 'application'
  }
]

// Components
function StepIndicator({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) {
  return (
    <div className="flex items-center justify-center space-x-2 mb-8">
      {Array.from({ length: totalSteps }, (_, i) => (
        <div key={i} className="flex items-center">
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              i < currentStep
                ? 'bg-green-500 text-white'
                : i === currentStep
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 text-gray-600'
            }`}
          >
            {i < currentStep ? <Check className="w-4 h-4" /> : i + 1}
          </div>
          {i < totalSteps - 1 && (
            <div
              className={`w-12 h-1 mx-2 ${
                i < currentStep ? 'bg-green-500' : 'bg-gray-200'
              }`}
            />
          )}
        </div>
      ))}
    </div>
  )
}

function JobDescriptionStep({ onComplete }: { onComplete: (job: JobDescription) => void }) {
  const [job, setJob] = useState<Partial<JobDescription>>({
    title: '',
    company: '',
    location: '',
    type: 'full-time',
    remote: false,
    description: '',
    requirements: [],
    niceToHave: [],
    benefits: [],
    responsibilities: [],
    qualifications: [],
    experienceLevel: 'mid',
    department: '',
    urgency: 'medium',
    complianceRequirements: []
  })

  const [currentRequirement, setCurrentRequirement] = useState('')
  const [currentNiceToHave, setCurrentNiceToHave] = useState('')

  const addRequirement = () => {
    if (currentRequirement.trim()) {
      setJob(prev => ({
        ...prev,
        requirements: [...(prev.requirements || []), currentRequirement.trim()]
      }))
      setCurrentRequirement('')
    }
  }

  const addNiceToHave = () => {
    if (currentNiceToHave.trim()) {
      setJob(prev => ({
        ...prev,
        niceToHave: [...(prev.niceToHave || []), currentNiceToHave.trim()]
      }))
      setCurrentNiceToHave('')
    }
  }

  const removeRequirement = (index: number) => {
    setJob(prev => ({
      ...prev,
      requirements: prev.requirements?.filter((_, i) => i !== index) || []
    }))
  }

  const removeNiceToHave = (index: number) => {
    setJob(prev => ({
      ...prev,
      niceToHave: prev.niceToHave?.filter((_, i) => i !== index) || []
    }))
  }

  const handleSubmit = () => {
    const completeJob: JobDescription = {
      id: '1',
      title: job.title || '',
      company: job.company || '',
      location: job.location || '',
      type: job.type || 'full-time',
      remote: job.remote || false,
      salary: job.salary,
      description: job.description || '',
      requirements: job.requirements || [],
      niceToHave: job.niceToHave || [],
      benefits: job.benefits || [],
      responsibilities: job.responsibilities || [],
      qualifications: job.qualifications || [],
      experienceLevel: job.experienceLevel || 'mid',
      department: job.department || '',
      teamSize: job.teamSize,
      reportingTo: job.reportingTo,
      budget: job.budget,
      urgency: job.urgency || 'medium',
      diversityGoals: job.diversityGoals,
      complianceRequirements: job.complianceRequirements || [],
      createdAt: new Date(),
      updatedAt: new Date()
    }
    onComplete(completeJob)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Define Your Job Requirements</h2>
        <p className="text-gray-600">
          Tell us about the position you're hiring for
        </p>
      </div>

      <Card>
        <CardContent className="p-8">
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title">Job Title *</Label>
                <Input
                  id="title"
                  value={job.title}
                  onChange={(e) => setJob(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior Software Engineer"
                />
              </div>
              <div>
                <Label htmlFor="company">Company *</Label>
                <Input
                  id="company"
                  value={job.company}
                  onChange={(e) => setJob(prev => ({ ...prev, company: e.target.value }))}
                  placeholder="Your company name"
                />
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="location">Location *</Label>
                <Input
                  id="location"
                  value={job.location}
                  onChange={(e) => setJob(prev => ({ ...prev, location: e.target.value }))}
                  placeholder="e.g., San Francisco, CA"
                />
              </div>
              <div>
                <Label htmlFor="type">Job Type</Label>
                <Select value={job.type} onValueChange={(value: any) => setJob(prev => ({ ...prev, type: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="full-time">Full-time</SelectItem>
                    <SelectItem value="part-time">Part-time</SelectItem>
                    <SelectItem value="contract">Contract</SelectItem>
                    <SelectItem value="internship">Internship</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="experience">Experience Level</Label>
                <Select value={job.experienceLevel} onValueChange={(value: any) => setJob(prev => ({ ...prev, experienceLevel: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entry">Entry Level</SelectItem>
                    <SelectItem value="mid">Mid Level</SelectItem>
                    <SelectItem value="senior">Senior Level</SelectItem>
                    <SelectItem value="executive">Executive</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Job Description */}
            <div>
              <Label htmlFor="description">Job Description *</Label>
              <Textarea
                id="description"
                value={job.description}
                onChange={(e) => setJob(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the role, responsibilities, and what makes it exciting..."
                rows={4}
              />
            </div>

            {/* Requirements */}
            <div>
              <Label>Required Skills & Qualifications *</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={currentRequirement}
                    onChange={(e) => setCurrentRequirement(e.target.value)}
                    placeholder="e.g., 5+ years Python experience"
                    onKeyPress={(e) => e.key === 'Enter' && addRequirement()}
                  />
                  <Button onClick={addRequirement} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.requirements?.map((req, index) => (
                    <Badge key={index} variant="default" className="flex items-center gap-1">
                      {req}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeRequirement(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Nice to Have */}
            <div>
              <Label>Nice to Have</Label>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={currentNiceToHave}
                    onChange={(e) => setCurrentNiceToHave(e.target.value)}
                    placeholder="e.g., Experience with microservices"
                    onKeyPress={(e) => e.key === 'Enter' && addNiceToHave()}
                  />
                  <Button onClick={addNiceToHave} variant="outline">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {job.niceToHave?.map((item, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      {item}
                      <X
                        className="w-3 h-3 cursor-pointer"
                        onClick={() => removeNiceToHave(index)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Remote Work */}
            <div className="flex items-center space-x-2">
              <Checkbox
                id="remote"
                checked={job.remote}
                onCheckedChange={(checked) => setJob(prev => ({ ...prev, remote: !!checked }))}
              />
              <Label htmlFor="remote">Remote work allowed</Label>
            </div>

            {/* Urgency */}
            <div>
              <Label>Hiring Urgency</Label>
              <RadioGroup value={job.urgency} onValueChange={(value: any) => setJob(prev => ({ ...prev, urgency: value }))}>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="low" />
                  <Label htmlFor="low">Low - Can wait for the right candidate</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="medium" />
                  <Label htmlFor="medium">Medium - Standard timeline</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="high" />
                  <Label htmlFor="high">High - Need to fill quickly</Label>
                </div>
              </RadioGroup>
            </div>

            <div className="flex justify-end">
              <Button
                onClick={handleSubmit}
                disabled={!job.title || !job.company || !job.location || !job.description || (job.requirements?.length || 0) === 0}
                className="bg-gradient-to-r from-emerald-600 to-teal-600"
              >
                Generate Candidate Slate
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function SlateGenerationStep({ job, onComplete }: { 
  job: JobDescription; 
  onComplete: (slate: CandidateSlate) => void 
}) {
  const [generating, setGenerating] = useState(false)
  const [slate, setSlate] = useState<CandidateSlate | null>(null)

  const generateSlate = async () => {
    setGenerating(true)
    
    // Simulate slate generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const mockSlate: CandidateSlate = {
      id: 'slate_123',
      jobId: job.id,
      candidates: mockCandidates,
      generatedAt: new Date(),
      auditTrail: {
        id: 'audit_slate_123',
        hash: 'def456ghi789',
        immutable: true,
        version: '1.0'
      },
      biasAnalysis: {
        detected: false,
        factors: [],
        mitigation: ['Blind resume review', 'Skills-based assessment', 'Diverse interview panel'],
        diversityScore: 85
      },
      recommendations: {
        topCandidate: '1',
        interviewOrder: ['1', '2'],
        focusAreas: ['Technical skills', 'Cultural fit', 'Leadership potential'],
        redFlags: []
      },
      compliance: {
        eeocCompliant: true,
        auditReady: true,
        documentation: ['Selection criteria', 'Scoring methodology', 'Bias analysis']
      }
    }
    
    setSlate(mockSlate)
    setGenerating(false)
    onComplete(mockSlate)
  }

  useEffect(() => {
    generateSlate()
  }, [])

  if (generating) {
    return (
      <div className="max-w-4xl mx-auto text-center">
        <div className="space-y-6">
          <div>
            <Loader2 className="w-16 h-16 mx-auto animate-spin text-emerald-500" />
          </div>
          <div>
            <h2 className="text-3xl font-bold mb-4">Generating Your Candidate Slate</h2>
            <p className="text-gray-600 mb-6">
              Our AI is analyzing candidates and creating a ranked slate...
            </p>
          </div>
          <div className="max-w-md mx-auto">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Candidate Matching</span>
                <span className="text-sm">92%</span>
              </div>
              <Progress value={92} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Bias Analysis</span>
                <span className="text-sm">100%</span>
              </div>
              <Progress value={100} />
              
              <div className="flex items-center justify-between">
                <span className="text-sm">Compliance Check</span>
                <span className="text-sm">100%</span>
              </div>
              <Progress value={100} />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!slate) return null

  return (
    <div className="max-w-6xl mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold mb-4">Your Candidate Slate</h2>
        <p className="text-gray-600">
          Ranked candidates for {job.title} at {job.company}
        </p>
      </div>

      {/* Slate Summary */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-2">
                {slate.candidates.length} Candidates Found
              </h3>
              <p className="text-gray-600">
                Diversity Score: <span className="font-semibold text-emerald-600">{slate.biasAnalysis.diversityScore}%</span>
              </p>
            </div>
            <div className="text-right">
              <Badge variant="outline" className="mb-2">
                <Shield className="w-4 h-4 mr-1" />
                EEOC Compliant
              </Badge>
              <p className="text-sm text-gray-500">
                Audit ID: {slate.auditTrail.id}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Candidates */}
      <div className="space-y-6">
        {slate.candidates.map((candidate, index) => (
          <Card key={candidate.id} className="relative">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center">
                      <span className="text-white font-medium text-lg">
                        {candidate.name.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold">{candidate.name}</h3>
                      <p className="text-gray-600">{candidate.currentRole} at {candidate.currentCompany}</p>
                    </div>
                    <Badge variant="outline" className="ml-auto">
                      #{index + 1} Rank
                    </Badge>
                  </div>

                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Fit Score</h4>
                      <div className="flex items-center space-x-2">
                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-gradient-to-r from-emerald-500 to-teal-500 h-2 rounded-full"
                            style={{ width: `${candidate.fitScore}%` }}
                          />
                        </div>
                        <span className="font-semibold">{candidate.fitScore}%</span>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Experience</h4>
                      <p className="text-gray-600">{candidate.experience} years</p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Location</h4>
                      <p className="text-gray-600">{candidate.location}</p>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-gray-700 mb-2">Key Skills</h4>
                    <div className="flex flex-wrap gap-2">
                      {candidate.skills.map((skill) => (
                        <Badge key={skill} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-green-700 mb-2">Strengths</h4>
                      <ul className="space-y-1">
                        {candidate.strengths.map((strength, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <Check className="w-3 h-3 mr-2 text-green-600" />
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-orange-700 mb-2">Considerations</h4>
                      <ul className="space-y-1">
                        {candidate.concerns.map((concern, i) => (
                          <li key={i} className="flex items-center text-sm">
                            <AlertCircle className="w-3 h-3 mr-2 text-orange-600" />
                            {concern}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="ml-6 flex flex-col space-y-2">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button variant="outline" size="sm">
                    <FileText className="w-4 h-4 mr-2" />
                    View Resume
                  </Button>
                  <Button size="sm" className="bg-gradient-to-r from-emerald-600 to-teal-600">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Contact
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Compliance Notice */}
      <Card className="mt-8 bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-emerald-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">Compliance & Fairness</h4>
              <p className="text-emerald-800 text-sm">
                This slate was generated using bias-reducing algorithms and maintains an immutable audit trail. 
                All selection decisions are explainable and verifiable through our audit system.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Main Component
export default function CandidateSlatePage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [job, setJob] = useState<JobDescription | null>(null)
  const [slate, setSlate] = useState<CandidateSlate | null>(null)

  const totalSteps = 2

  const handleJobComplete = (jobData: JobDescription) => {
    setJob(jobData)
    setCurrentStep(2)
  }

  const handleSlateComplete = (slateData: CandidateSlate) => {
    setSlate(slateData)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <AnimatePresence mode="wait">
          {currentStep === 1 && (
            <motion.div
              key="step-1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <JobDescriptionStep onComplete={handleJobComplete} />
            </motion.div>
          )}
          
          {currentStep === 2 && job && (
            <motion.div
              key="step-2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <SlateGenerationStep
                job={job}
                onComplete={handleSlateComplete}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
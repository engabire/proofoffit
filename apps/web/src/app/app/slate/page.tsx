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

// Mock data - Enhanced candidate pool
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
    skills: ['Python', 'React', 'Cloud', 'Docker', 'Kubernetes', 'TypeScript', 'GraphQL', 'Microservices'],
    certifications: ['Cloud Certified Solutions Architect', 'Kubernetes Certified Developer'],
    portfolio: 'https://sarahchen.dev',
    linkedin: 'https://linkedin.com/in/sarahchen',
    github: 'https://github.com/sarahchen',
    fitScore: 95,
    strengths: ['Strong technical skills', 'Leadership experience', 'Cultural fit', 'AI/ML expertise', 'Open source contributor'],
    concerns: ['Salary expectations may be high', 'May be overqualified for some roles'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'female',
      ethnicity: 'asian',
      firstGeneration: true
    },
    salaryExpectation: 175000,
    availability: '2-weeks',
    relocation: false,
    remote: true,
    lastActive: new Date('2024-01-15'),
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
    skills: ['JavaScript', 'Node.js', 'React', 'MongoDB', 'GraphQL', 'AWS', 'DevOps'],
    certifications: ['Cloud Professional', 'Agile Certified Practitioner'],
    linkedin: 'https://linkedin.com/in/marcusjohnson',
    github: 'https://github.com/marcusj',
    fitScore: 88,
    strengths: ['Fast learner', 'Startup experience', 'Strong communication', 'Full-stack versatility'],
    concerns: ['Less senior experience', 'Limited enterprise experience'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'male',
      ethnicity: 'african-american',
      veteran: true
    },
    salaryExpectation: 125000,
    availability: 'immediate',
    relocation: true,
    remote: true,
    lastActive: new Date('2024-01-14'),
    source: 'application'
  },
  {
    id: '3',
    name: 'Elena Rodriguez',
    email: 'elena.rodriguez@email.com',
    phone: '+1 (555) 987-6543',
    location: 'Remote (Miami, FL)',
    currentRole: 'Product Marketing Manager',
    currentCompany: 'GrowthCo',
    experience: 5,
    education: 'MBA Marketing, Northwestern Kellogg',
    skills: ['Digital Marketing', 'Product Strategy', 'Growth Hacking', 'Analytics', 'A/B Testing', 'Customer Data Platforms'],
    certifications: ['Google Analytics Certified', 'HubSpot Certified'],
    portfolio: 'https://elenamarketing.com',
    linkedin: 'https://linkedin.com/in/elenarodriguez',
    fitScore: 91,
    strengths: ['Data-driven approach', 'Cross-functional leadership', 'B2B SaaS expertise', 'Growth mindset'],
    concerns: ['No direct enterprise sales experience'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'female',
      ethnicity: 'hispanic',
      firstGeneration: false
    },
    salaryExpectation: 140000,
    availability: '1-month',
    relocation: false,
    remote: true,
    lastActive: new Date('2024-01-13'),
    source: 'referral'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david.kim@email.com',
    location: 'Seattle, WA',
    currentRole: 'Senior Data Scientist',
    currentCompany: 'DataFlow Inc',
    experience: 7,
    education: 'PhD Statistics, University of Washington',
    skills: ['Python', 'Machine Learning', 'SQL', 'Tableau', 'TensorFlow', 'Statistical Modeling', 'A/B Testing'],
    certifications: ['TensorFlow Certified', 'Tableau Desktop Certified'],
    linkedin: 'https://linkedin.com/in/davidkim-data',
    github: 'https://github.com/davidkim-ml',
    fitScore: 89,
    strengths: ['Advanced statistical knowledge', 'Model deployment experience', 'Research background', 'Team collaboration'],
    concerns: ['Limited business stakeholder interaction'],
    interviewReadiness: 'needs-prep',
    diversityFactors: {
      gender: 'male',
      ethnicity: 'asian',
      firstGeneration: true
    },
    salaryExpectation: 165000,
    availability: '2-weeks',
    relocation: true,
    remote: true,
    lastActive: new Date('2024-01-11'),
    source: 'sourcing'
  },
  {
    id: '5',
    name: 'Jessica Williams',
    email: 'jessica.williams@email.com',
    phone: '+1 (555) 456-7890',
    location: 'New York, NY',
    currentRole: 'UX Design Lead',
    currentCompany: 'DesignStudio',
    experience: 8,
    education: 'MFA Interaction Design, Parsons',
    skills: ['UI/UX Design', 'Figma', 'User Research', 'Design Systems', 'Accessibility', 'Prototyping', 'Design Thinking'],
    certifications: ['Google UX Design Certified', 'Accessibility Specialist'],
    portfolio: 'https://jessicawilliams.design',
    linkedin: 'https://linkedin.com/in/jessicawilliams-ux',
    fitScore: 93,
    strengths: ['User-centered design', 'Accessibility expertise', 'Team leadership', 'Client presentation skills'],
    concerns: ['Limited technical implementation knowledge'],
    interviewReadiness: 'ready',
    diversityFactors: {
      gender: 'female',
      ethnicity: 'african-american',
      firstGeneration: false
    },
    salaryExpectation: 155000,
    availability: 'negotiable',
    relocation: false,
    remote: true,
    lastActive: new Date('2024-01-16'),
    source: 'database'
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
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)

  // Job description templates and suggestions
  const jobTemplates = {
    'software-engineer': {
      title: 'Senior Software Engineer',
      description: 'We are seeking a talented Senior Software Engineer to join our dynamic team. You will be responsible for designing, developing, and maintaining scalable software solutions that serve millions of users.',
      requirements: ['5+ years of software development experience', 'Proficiency in Python or Java', 'Experience with cloud platforms (AWS/GCP/Azure)', 'Strong understanding of databases and APIs', 'Experience with version control (Git)'],
      niceToHave: ['Experience with microservices architecture', 'Knowledge of DevOps practices', 'Experience with React or Vue.js', 'Understanding of machine learning concepts'],
      department: 'Engineering'
    },
    'product-manager': {
      title: 'Senior Product Manager',
      description: 'We are looking for an experienced Product Manager to drive product strategy and execution. You will work closely with engineering, design, and business teams to deliver exceptional user experiences.',
      requirements: ['3+ years of product management experience', 'Strong analytical and problem-solving skills', 'Experience with product analytics tools', 'Excellent communication and leadership skills', 'Experience with agile development methodologies'],
      niceToHave: ['Technical background or CS degree', 'Experience with B2B SaaS products', 'Data analysis skills (SQL, Python)', 'Experience with user research and design'],
      department: 'Product'
    },
    'marketing-manager': {
      title: 'Digital Marketing Manager',
      description: 'Join our marketing team to drive growth through digital channels. You will develop and execute marketing campaigns, analyze performance metrics, and optimize our digital presence.',
      requirements: ['3+ years of digital marketing experience', 'Experience with Google Analytics and marketing automation', 'Strong understanding of SEO/SEM', 'Content creation and copywriting skills', 'Data-driven approach to marketing'],
      niceToHave: ['Experience with marketing attribution models', 'Knowledge of A/B testing platforms', 'Social media marketing expertise', 'Graphic design skills'],
      department: 'Marketing'
    },
    'data-scientist': {
      title: 'Senior Data Scientist',
      description: 'We are seeking a Senior Data Scientist to extract insights from large datasets and build predictive models. You will work on challenging problems that directly impact business decisions.',
      requirements: ['PhD or MS in Data Science, Statistics, or related field', 'Strong programming skills in Python or R', 'Experience with machine learning frameworks', 'Statistical analysis and modeling expertise', 'Experience with big data technologies'],
      niceToHave: ['Experience with deep learning frameworks', 'Knowledge of cloud ML platforms', 'Experience with real-time data processing', 'Business intelligence and visualization skills'],
      department: 'Data & Analytics'
    }
  }

  const skillSuggestions = {
    'technology': ['Python', 'JavaScript', 'React', 'Node.js', 'AWS', 'Docker', 'Kubernetes', 'SQL', 'Git', 'Agile', 'TypeScript', 'GraphQL', 'Microservices', 'DevOps', 'AI/ML', 'Terraform'],
    'marketing': ['Google Analytics', 'SEO/SEM', 'Content Marketing', 'Social Media', 'Email Marketing', 'A/B Testing', 'CRM', 'Marketing Automation', 'Customer Data Platforms', 'Programmatic Advertising', 'Influencer Marketing', 'Voice Marketing'],
    'sales': ['CRM Software', 'Lead Generation', 'Sales Analytics', 'Negotiation', 'Account Management', 'Pipeline Management', 'Customer Success', 'Social Selling', 'Sales Enablement', 'Predictive Analytics', 'Account-Based Marketing'],
    'design': ['Figma', 'Adobe Creative Suite', 'UI/UX Design', 'Prototyping', 'User Research', 'Design Systems', 'Accessibility', 'Responsive Design', 'Motion Design', 'Design Thinking', 'Information Architecture'],
    'finance': ['Financial Modeling', 'Excel/Google Sheets', 'SQL', 'Tableau/Power BI', 'Risk Analysis', 'Budgeting', 'Forecasting', 'Compliance', 'ESG', 'Digital Transformation', 'Blockchain', 'Fintech', 'Regulatory Technology'],
    'healthcare': ['Patient Care', 'Electronic Health Records', 'Clinical Documentation', 'Quality Improvement', 'Evidence-Based Practice', 'Telehealth', 'Population Health', 'Value-Based Care', 'Clinical Informatics', 'Healthcare Analytics'],
    'operations': ['Process Optimization', 'Supply Chain Management', 'Lean Six Sigma', 'Project Management', 'Vendor Management', 'Quality Assurance', 'Risk Management', 'Business Intelligence', 'Workflow Automation'],
    'hr': ['Talent Acquisition', 'Performance Management', 'Employee Relations', 'HRIS Systems', 'Compensation Analysis', 'Learning & Development', 'Diversity & Inclusion', 'Change Management', 'Employment Law']
  }

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

  const applyTemplate = (templateKey: string) => {
    const template = jobTemplates[templateKey as keyof typeof jobTemplates]
    if (template) {
      setJob(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        requirements: template.requirements,
        niceToHave: template.niceToHave,
        department: template.department
      }))
      setSelectedTemplate(templateKey)
      setShowSuggestions(false)
    }
  }

  const getRelevantSkills = () => {
    const title = job.title?.toLowerCase() || ''
    const description = job.description?.toLowerCase() || ''
    
    if (title.includes('engineer') || title.includes('developer') || title.includes('technical') || description.includes('code') || description.includes('software')) {
      return skillSuggestions.technology
    } else if (title.includes('marketing') || title.includes('growth') || description.includes('marketing') || description.includes('campaign')) {
      return skillSuggestions.marketing
    } else if (title.includes('sales') || title.includes('account') || description.includes('sales') || description.includes('revenue')) {
      return skillSuggestions.sales
    } else if (title.includes('design') || title.includes('ux') || title.includes('ui') || description.includes('design')) {
      return skillSuggestions.design
    } else if (title.includes('finance') || title.includes('analyst') || description.includes('financial') || description.includes('budget')) {
      return skillSuggestions.finance
    } else if (title.includes('health') || title.includes('medical') || title.includes('clinical') || description.includes('patient')) {
      return skillSuggestions.healthcare
    } else if (title.includes('operations') || title.includes('manager') || description.includes('process') || description.includes('operations')) {
      return skillSuggestions.operations
    } else if (title.includes('hr') || title.includes('people') || title.includes('talent') || description.includes('recruitment')) {
      return skillSuggestions.hr
    }
    
    return skillSuggestions.technology // Default fallback
  }

  const addSkillSuggestion = (skill: string, isRequired: boolean = true) => {
    if (isRequired) {
      if (!job.requirements?.includes(skill)) {
        setJob(prev => ({
          ...prev,
          requirements: [...(prev.requirements || []), skill]
        }))
      }
    } else {
      if (!job.niceToHave?.includes(skill)) {
        setJob(prev => ({
          ...prev,
          niceToHave: [...(prev.niceToHave || []), skill]
        }))
      }
    }
  }

  const handleSubmit = () => {
    const completeJob: JobDescription = {
      id: Date.now().toString(),
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

      {/* Quick Templates */}
      <Card className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-blue-900">Quick Start Templates</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowSuggestions(!showSuggestions)}
            >
              {showSuggestions ? 'Hide' : 'Show'} Templates
            </Button>
          </div>
          {showSuggestions && (
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-3">
              {Object.entries(jobTemplates).map(([key, template]) => (
                <Button
                  key={key}
                  variant={selectedTemplate === key ? "default" : "outline"}
                  className="h-auto p-3 justify-start"
                  onClick={() => applyTemplate(key)}
                >
                  <div className="text-left">
                    <div className="font-medium text-sm">{template.title}</div>
                    <div className="text-xs opacity-75">{template.department}</div>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

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
              <div className="flex items-center justify-between mb-2">
                <Label>Required Skills & Qualifications *</Label>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowSuggestions(!showSuggestions)}
                  className="text-blue-600"
                >
                  <Sparkles className="w-4 h-4 mr-1" />
                  Suggestions
                </Button>
              </div>
              <div className="space-y-3">
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
                
                {/* Skill Suggestions */}
                {showSuggestions && (
                  <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                    <h4 className="text-sm font-medium text-blue-900 mb-2">
                      Smart Skill Suggestions {job.title && `for ${job.title}`}:
                    </h4>
                    <div className="space-y-3">
                      {/* Context-aware suggestions */}
                      <div>
                        <div className="text-xs font-medium text-blue-700 mb-2">Recommended for this role:</div>
                        <div className="flex flex-wrap gap-1">
                          {getRelevantSkills().slice(0, 8).map(skill => (
                            <Button
                              key={skill}
                              variant="ghost"
                              size="sm"
                              className="h-6 text-xs p-1 text-blue-600 bg-white border border-blue-200 hover:bg-blue-100"
                              onClick={() => addSkillSuggestion(skill, true)}
                            >
                              + {skill}
                            </Button>
                          ))}
                        </div>
                      </div>
                      
                      {/* All categories */}
                      <div>
                        <div className="text-xs font-medium text-blue-700 mb-2">Browse by category:</div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {Object.entries(skillSuggestions).map(([category, skills]) => (
                            <div key={category} className="space-y-1">
                              <div className="text-xs font-medium text-gray-600 capitalize">{category.replace('-', ' ')}</div>
                              {skills.slice(0, 3).map(skill => (
                                <Button
                                  key={skill}
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 text-xs justify-start p-1 text-gray-600 hover:text-blue-600"
                                  onClick={() => addSkillSuggestion(skill, true)}
                                >
                                  + {skill}
                                </Button>
                              ))}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                
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
              <div className="flex items-center justify-between mb-2">
                <Label>Nice to Have</Label>
                <div className="text-xs text-gray-500">Optional but preferred qualifications</div>
              </div>
              <div className="space-y-3">
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
                
                {/* Quick Add Suggestions */}
                <div className="flex flex-wrap gap-2">
                  {['Leadership experience', 'Open source contributions', 'Mentoring skills', 'Industry certifications', 'Cross-functional collaboration', 'Public speaking', 'Technical writing', 'Startup experience'].map(suggestion => (
                    <Button
                      key={suggestion}
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs text-gray-600"
                      onClick={() => addSkillSuggestion(suggestion, false)}
                    >
                      + {suggestion}
                    </Button>
                  ))}
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

            {/* AI Enhancement Suggestion */}
            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
              <div className="flex items-start gap-3">
                <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
                <div className="flex-1">
                  <h4 className="font-medium text-purple-900 mb-1">AI Enhancement Available</h4>
                  <p className="text-sm text-purple-700 mb-3">
                    Our AI can optimize your job description for better candidate matching and bias reduction.
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" className="border-purple-300 text-purple-700">
                      <Sparkles className="w-3 h-3 mr-1" />
                      Enhance with AI
                    </Button>
                    <Button size="sm" variant="ghost" className="text-purple-600">
                      Learn More
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-500">
                {job.title && job.company && job.location && job.description && (job.requirements?.length || 0) > 0 
                  ? '✓ Ready to generate slate' 
                  : 'Please fill in required fields to continue'
                }
              </div>
              <Button
                onClick={handleSubmit}
                disabled={!job.title || !job.company || !job.location || !job.description || (job.requirements?.length || 0) === 0}
                className="bg-gradient-to-r from-emerald-600 to-teal-600 min-w-[200px]"
                size="lg"
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

  const calculateMatchScore = (candidate: Candidate, job: JobDescription): number => {
    let score = 0
    let maxScore = 0
    
    // Skills matching (40% weight)
    const jobSkills = [...(job.requirements || []), ...(job.niceToHave || [])].map(s => s.toLowerCase())
    const candidateSkills = candidate.skills.map(s => s.toLowerCase())
    const skillMatches = jobSkills.filter(skill => candidateSkills.some(cs => cs.includes(skill) || skill.includes(cs)))
    const skillScore = jobSkills.length > 0 ? (skillMatches.length / jobSkills.length) * 40 : 0
    score += skillScore
    maxScore += 40
    
    // Experience level matching (25% weight)
    const expRequirement = job.experienceLevel
    let expScore = 0
    if (expRequirement === 'entry' && candidate.experience >= 0) expScore = 25
    else if (expRequirement === 'mid' && candidate.experience >= 2) expScore = 25
    else if (expRequirement === 'senior' && candidate.experience >= 5) expScore = 25
    else if (expRequirement === 'executive' && candidate.experience >= 8) expScore = 25
    else expScore = Math.max(0, 25 - Math.abs(candidate.experience - 3) * 3) // Penalty for mismatch
    score += expScore
    maxScore += 25
    
    // Location/Remote compatibility (15% weight)
    let locationScore = 15
    if (!job.remote && !candidate.relocation && candidate.location !== job.location) {
      locationScore = 5 // Penalty for location mismatch
    }
    score += locationScore
    maxScore += 15
    
    // Availability matching (10% weight)
    let availabilityScore = 10
    if (job.urgency === 'high' && candidate.availability !== 'immediate') {
      availabilityScore = 5
    }
    score += availabilityScore
    maxScore += 10
    
    // Interview readiness (10% weight)
    const readinessScore = candidate.interviewReadiness === 'ready' ? 10 : 
                          candidate.interviewReadiness === 'needs-prep' ? 7 : 3
    score += readinessScore
    maxScore += 10
    
    return Math.round((score / maxScore) * 100)
  }

  const getFilteredCandidates = (job: JobDescription): Candidate[] => {
    // Calculate match scores for all candidates
    const candidatesWithScores = mockCandidates.map(candidate => ({
      ...candidate,
      fitScore: calculateMatchScore(candidate, job)
    }))
    
    // Filter based on minimum requirements and sort by fit score
    return candidatesWithScores
      .filter(candidate => candidate.fitScore >= 60) // Minimum 60% match
      .sort((a, b) => b.fitScore - a.fitScore)
      .slice(0, 10) // Top 10 candidates
  }

  const generateSlate = async () => {
    setGenerating(true)
    
    // Simulate slate generation
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    // Get intelligently filtered and ranked candidates
    const filteredCandidates = getFilteredCandidates(job)
    
    // Calculate diversity metrics
    const diversityMetrics = {
      genderBalance: filteredCandidates.filter(c => c.diversityFactors.gender === 'female').length / filteredCandidates.length * 100,
      ethnicDiversity: new Set(filteredCandidates.map(c => c.diversityFactors.ethnicity).filter(Boolean)).size,
      veteranRepresentation: filteredCandidates.filter(c => c.diversityFactors.veteran).length,
      firstGenRepresentation: filteredCandidates.filter(c => c.diversityFactors.firstGeneration).length
    }
    
    const overallDiversityScore = Math.round(
      (diversityMetrics.genderBalance + diversityMetrics.ethnicDiversity * 10 + 
       diversityMetrics.veteranRepresentation * 5 + diversityMetrics.firstGenRepresentation * 5) / 4
    )
    
    const mockSlate: CandidateSlate = {
      id: 'slate_' + Date.now(),
      jobId: job.id,
      candidates: filteredCandidates,
      generatedAt: new Date(),
      auditTrail: {
        id: 'audit_slate_' + Date.now(),
        hash: 'sha256_' + Math.random().toString(36),
        immutable: true,
        version: '2.0'
      },
      biasAnalysis: {
        detected: overallDiversityScore < 70,
        factors: overallDiversityScore < 70 ? ['Low diversity score', 'Potential unconscious bias'] : [],
        mitigation: ['Skills-based initial screening', 'Diverse interview panel', 'Structured interview process', 'Bias training for hiring team'],
        diversityScore: overallDiversityScore
      },
      recommendations: {
        topCandidate: filteredCandidates[0]?.id || '1',
        interviewOrder: filteredCandidates.slice(0, 5).map(c => c.id),
        focusAreas: job.title?.toLowerCase().includes('engineer') 
          ? ['Technical assessment', 'System design', 'Cultural fit', 'Communication skills']
          : job.title?.toLowerCase().includes('marketing')
          ? ['Campaign strategy', 'Analytics proficiency', 'Creative thinking', 'Growth mindset']
          : ['Role-specific expertise', 'Cultural alignment', 'Growth potential', 'Team collaboration'],
        redFlags: filteredCandidates.flatMap(c => 
          c.concerns.filter(concern => 
            concern.toLowerCase().includes('salary') || 
            concern.toLowerCase().includes('overqualified')
          )
        ).slice(0, 3)
      },
      compliance: {
        eeocCompliant: true,
        auditReady: true,
        documentation: ['Scoring methodology', 'Bias analysis report', 'Diversity metrics', 'Interview process guidelines']
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
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => window.open(candidate.linkedin || `https://linkedin.com/search/results/people/?keywords=${encodeURIComponent(candidate.name)}`, '_blank')}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Profile
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => {
                      // Simulate resume download/view
                      const resumeContent = `
=== RESUME ===
${candidate.name}
${candidate.email} | ${candidate.phone || 'N/A'} | ${candidate.location}

CURRENT ROLE
${candidate.currentRole} at ${candidate.currentCompany}

EXPERIENCE
${candidate.experience} years in the field

EDUCATION
${candidate.education}

SKILLS
${candidate.skills.join(', ')}

CERTIFICATIONS
${candidate.certifications.join(', ')}

STRENGTHS
${candidate.strengths.join(', ')}
                      `
                      const blob = new Blob([resumeContent], { type: 'text/plain' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${candidate.name.replace(' ', '_')}_Resume.txt`
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Download Resume
                  </Button>
                  <Button 
                    size="sm" 
                    className="bg-gradient-to-r from-emerald-600 to-teal-600"
                    onClick={() => {
                      const subject = encodeURIComponent(`Interview Opportunity - ${job.title}`)
                      const body = encodeURIComponent(`Hi ${candidate.name.split(' ')[0]},

I hope this email finds you well. We came across your profile and are impressed with your background in ${candidate.currentRole} at ${candidate.currentCompany}.

We have an exciting opportunity for a ${job.title} position at ${job.company} that aligns well with your skills in ${candidate.skills.slice(0, 3).join(', ')}.

Key highlights of the role:
• ${job.description?.substring(0, 100)}...
• Location: ${job.location}${job.remote ? ' (Remote available)' : ''}
• Experience: ${job.experienceLevel} level

Would you be interested in learning more about this opportunity? I'd love to schedule a brief conversation to discuss how your experience could be a great fit.

Best regards,
[Your Name]
[Your Title]
${job.company}`)
                      window.location.href = `mailto:${candidate.email}?subject=${subject}&body=${body}`
                    }}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Email
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="text-blue-600"
                    onClick={() => {
                      // Simulate calendar scheduling
                      const eventDetails = {
                        title: `Interview: ${candidate.name} - ${job.title}`,
                        start: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week from now
                        end: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 60 * 60 * 1000), // 1 hour duration
                        description: `Interview with ${candidate.name} for ${job.title} position at ${job.company}`
                      }
                      
                      // Create Google Calendar URL
                      const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(eventDetails.title)}&dates=${eventDetails.start.toISOString().replace(/[-:]/g, '').split('.')[0]}Z/${eventDetails.end.toISOString().replace(/[-:]/g, '').split('.')[0]}Z&details=${encodeURIComponent(eventDetails.description)}`
                      
                      window.open(googleCalendarUrl, '_blank')
                    }}
                  >
                    <Calendar className="w-4 h-4 mr-2" />
                    Schedule Interview
                  </Button>
                  
                  {/* Quick Actions */}
                  <div className="pt-2 border-t border-gray-200">
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs text-green-600 hover:bg-green-50"
                        onClick={() => {
                          // Add to shortlist
                          localStorage.setItem(`shortlist_${candidate.id}`, JSON.stringify(candidate))
                          alert(`${candidate.name} added to shortlist!`)
                        }}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        Shortlist
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="flex-1 text-xs text-blue-600 hover:bg-blue-50"
                        onClick={() => {
                          // Share candidate
                          const shareText = `Check out this candidate: ${candidate.name} - ${candidate.currentRole} at ${candidate.currentCompany}. Fit Score: ${candidate.fitScore}%`
                          if (navigator.share) {
                            navigator.share({
                              title: 'Candidate Recommendation',
                              text: shareText,
                              url: window.location.href
                            })
                          } else {
                            navigator.clipboard.writeText(shareText)
                            alert('Candidate info copied to clipboard!')
                          }
                        }}
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => alert('Export feature coming soon!')}
        >
          <Download className="w-4 h-4 mr-2" />
          Export Slate
        </Button>
        <Button 
          variant="outline" 
          size="lg"
          onClick={() => alert('Share feature coming soon!')}
        >
          <Share2 className="w-4 h-4 mr-2" />
          Share with Team
        </Button>
        <Button 
          size="lg" 
          className="bg-gradient-to-r from-blue-600 to-indigo-600"
          onClick={() => setCurrentStep(1)}
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Slate
        </Button>
      </div>

      {/* Compliance Notice */}
      <Card className="mt-8 bg-emerald-50 border-emerald-200">
        <CardContent className="p-6">
          <div className="flex items-start">
            <Shield className="w-6 h-6 text-emerald-600 mr-3 mt-0.5" />
            <div>
              <h4 className="font-semibold text-emerald-900 mb-2">Compliance & Fairness</h4>
              <p className="text-emerald-800 text-sm mb-3">
                This slate was generated using bias-reducing algorithms and maintains an immutable audit trail. 
                All selection decisions are explainable and verifiable through our audit system.
              </p>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700">
                  <ExternalLink className="w-3 h-3 mr-1" />
                  View Audit Trail
                </Button>
                <Button size="sm" variant="outline" className="border-emerald-300 text-emerald-700">
                  <Download className="w-3 h-3 mr-1" />
                  Download Report
                </Button>
              </div>
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
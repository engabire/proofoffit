// Database types (generated from Prisma schema)
export interface User {
  id: string
  tenantId: string
  email: string
  role: 'candidate' | 'employer' | 'admin'
  locale: string
  createdAt: Date
  updatedAt: Date
}

export interface Tenant {
  id: string
  name: string
  plan: 'free' | 'pro' | 'pro_plus' | 'team' | 'per_slate'
  createdAt: Date
  updatedAt: Date
}

export interface CandidateProfile {
  id: string
  tenantId: string
  userId: string
  preferences: Record<string, any>
  contactPolicy: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

export interface Job {
  id: string
  source: string
  org: string
  title: string
  location: string
  workType: string
  pay?: Record<string, any>
  description: string
  requirements: Record<string, any>
  constraints: Record<string, any>
  tos: Record<string, any>
  fetchedAt: Date
  createdAt: Date
  updatedAt: Date
  // Additional fields for job matching
  company?: string
  remote?: boolean
  salaryMin?: number
  salaryMax?: number
  experienceRequired?: number
  requiredSkills?: string[]
  educationRequired?: string[]
  industry?: string
  jobType?: string
  postedAt?: string
}

export interface Slate {
  id: string
  tenantId: string
  employerId: string
  jobRef: string
  weights: Record<string, any>
  candidates: Array<{
    candidate_id: string
    fit: number
    explanations: Array<{
      criterion: string
      evidence_ref: string
      snippet: string
      link?: string
    }>
    status: string
  }>
  auditUrl?: string
  createdAt: Date
  updatedAt: Date
}

export interface Application {
  id: string
  tenantId: string
  candidateId: string
  jobRef: string
  channel: 'auto' | 'prep_confirm' | 'manual'
  status: 'pending' | 'submitted' | 'interview' | 'declined' | 'hired'
  policyDecision: Record<string, any>
  documents: Record<string, any>
  timestamps: Record<string, any>
  createdAt: Date
  updatedAt: Date
}

// UI Component types
export interface MatchExplanation {
  criterion: string
  evidence: string
  score: number
  link?: string
}

export interface JobMatch {
  job: Job
  fitScore: number
  explanations: MatchExplanation[]
  strengths: string[]
  gaps: string[]
}

export interface CandidateBullet {
  id: string
  text: string
  tags: {
    criterion: string
    evidence_type: string
    metric?: number
    scope?: string
    tool?: string
    link?: string
  }
}

// Form types
export interface SignUpForm {
  email: string
  password: string
  confirmPassword: string
  role: 'candidate' | 'employer'
  acceptTerms: boolean
}

export interface SignInForm {
  email: string
  password: string
}

export interface ProfileForm {
  firstName: string
  lastName: string
  email: string
  phone?: string
  location?: string
  preferences: Record<string, any>
}

// API Response types
export interface ApiResponse<T = any> {
  data?: T
  error?: string
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

// Error types
export interface AppError {
  code: string
  message: string
  details?: Record<string, any>
}

// Feature flag types
export interface FeatureFlags {
  enableTailorEngine: boolean
  enableCarbonAware: boolean
  enableBiasMonitoring: boolean
  enableAdvancedAnalytics: boolean
}

// Subscription types
export interface Subscription {
  id: string
  plan: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodStart: Date
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
}

// Job matching and recommendation types
export interface UserProfile {
  id: string
  name: string
  email: string
  experience: number
  skills: string[]
  education: string[]
  location: string
  preferences: {
    salaryRange: [number, number]
    jobTypes: string[]
    industries: string[]
    remote: boolean
  }
}

export interface FitScore {
  overall: number
  skills: number
  experience: number
  location: number
  salary: number
  education: number
  industry: number
  confidence: number
}

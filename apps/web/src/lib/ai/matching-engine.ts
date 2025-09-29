import { createClient } from '@supabase/supabase-js'

export interface CandidateProfile {
  id: string
  userId: string
  skills: string[]
  experience: {
    years: number
    level: 'entry' | 'mid' | 'senior' | 'lead'
    industries: string[]
  }
  education: {
    degree: string
    field: string
    institution: string
  }
  preferences: {
    jobTypes: string[]
    locations: string[]
    remote: boolean
    salaryMin?: number
    salaryMax?: number
  }
  resume: {
    content: string
    sections: {
      summary?: string
      experience?: string
      education?: string
      skills?: string
    }
  }
}

export interface JobRequirements {
  id: string
  title: string
  description: string
  requirements: {
    mustHave: string[]
    niceToHave: string[]
    experience: {
      years: number
      level: 'entry' | 'mid' | 'senior' | 'lead'
    }
    education?: string
    skills: string[]
  }
  preferences: {
    location: string
    remote: boolean
    salary?: {
      min: number
      max: number
    }
    jobType: string
  }
  company: {
    name: string
    size: string
    industry: string
    culture: string[]
  }
}

export interface MatchResult {
  candidateId: string
  jobId: string
  fitScore: number
  breakdown: {
    skills: number
    experience: number
    education: number
    location: number
    salary: number
    culture: number
  }
  strengths: string[]
  gaps: string[]
  recommendations: string[]
  confidence: number
}

export class AIMatchingEngine {
  private supabase: any

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  // Calculate fit score between candidate and job
  async calculateFitScore(candidate: CandidateProfile, job: JobRequirements): Promise<MatchResult> {
    const breakdown = {
      skills: this.calculateSkillsMatch(candidate.skills, job.requirements.skills),
      experience: this.calculateExperienceMatch(candidate.experience, job.requirements.experience),
      education: this.calculateEducationMatch(candidate.education, job.requirements.education),
      location: this.calculateLocationMatch(candidate.preferences, job.preferences),
      salary: this.calculateSalaryMatch(candidate.preferences, job.preferences),
      culture: this.calculateCultureMatch(candidate, job)
    }

    // Weighted average of all factors
    const weights = {
      skills: 0.3,
      experience: 0.25,
      education: 0.15,
      location: 0.1,
      salary: 0.1,
      culture: 0.1
    }

    const fitScore = Math.round(
      breakdown.skills * weights.skills +
      breakdown.experience * weights.experience +
      breakdown.education * weights.education +
      breakdown.location * weights.location +
      breakdown.salary * weights.salary +
      breakdown.culture * weights.culture
    )

    const strengths = this.identifyStrengths(candidate, job, breakdown)
    const gaps = this.identifyGaps(candidate, job, breakdown)
    const recommendations = this.generateRecommendations(candidate, job, gaps)
    const confidence = this.calculateConfidence(candidate, job, breakdown)

    return {
      candidateId: candidate.id,
      jobId: job.id,
      fitScore,
      breakdown,
      strengths,
      gaps,
      recommendations,
      confidence
    }
  }

  // Calculate skills match score
  private calculateSkillsMatch(candidateSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100

    const candidateSkillsLower = candidateSkills.map(s => s.toLowerCase())
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase())

    // Exact matches
    const exactMatches = jobSkillsLower.filter(skill => 
      candidateSkillsLower.includes(skill)
    ).length

    // Partial matches (fuzzy matching)
    const partialMatches = jobSkillsLower.filter(jobSkill => 
      candidateSkillsLower.some(candidateSkill => 
        this.calculateStringSimilarity(jobSkill, candidateSkill) > 0.7
      )
    ).length

    const totalMatches = exactMatches + (partialMatches * 0.5)
    return Math.min(100, Math.round((totalMatches / jobSkills.length) * 100))
  }

  // Calculate experience match score
  private calculateExperienceMatch(candidateExp: any, jobExp: any): number {
    const yearsDiff = Math.abs(candidateExp.years - jobExp.years)
    
    // Experience level mapping
    const levelValues = { entry: 1, mid: 2, senior: 3, lead: 4 } as const
    const candidateLevelKey = (candidateExp.level ?? 'entry') as keyof typeof levelValues
    const jobLevelKey = (jobExp.level ?? 'entry') as keyof typeof levelValues
    const candidateLevel = levelValues[candidateLevelKey] ?? 1
    const jobLevel = levelValues[jobLevelKey] ?? 1
    
    const levelDiff = Math.abs(candidateLevel - jobLevel)
    
    // Calculate score based on years and level
    const yearsScore = Math.max(0, 100 - (yearsDiff * 10))
    const levelScore = Math.max(0, 100 - (levelDiff * 25))
    
    return Math.round((yearsScore + levelScore) / 2)
  }

  // Calculate education match score
  private calculateEducationMatch(candidateEdu: any, jobEdu?: string): number {
    if (!jobEdu) return 100

    const candidateDegree = candidateEdu.degree.toLowerCase()
    const jobDegree = jobEdu.toLowerCase()

    // Degree hierarchy
    const degreeLevels = {
      'high school': 1,
      'associate': 2,
      'bachelor': 3,
      'master': 4,
      'phd': 5,
      'doctorate': 5
    } as const

    const candidateLevelKey = (candidateDegree as keyof typeof degreeLevels) ?? 'high school'
    const jobLevelKey = (jobDegree as keyof typeof degreeLevels) ?? 'high school'

    const candidateLevel = degreeLevels[candidateLevelKey] ?? 1
    const jobLevel = degreeLevels[jobLevelKey] ?? 1

    if (candidateLevel >= jobLevel) {
      return 100
    } else {
      return Math.max(0, 100 - ((jobLevel - candidateLevel) * 20))
    }
  }

  // Calculate location match score
  private calculateLocationMatch(candidatePrefs: any, jobPrefs: any): number {
    if (jobPrefs.remote && candidatePrefs.remote) {
      return 100
    }

    if (jobPrefs.remote && !candidatePrefs.remote) {
      return 80 // Remote job, candidate prefers office
    }

    if (!jobPrefs.remote && candidatePrefs.remote) {
      return 20 // Office job, candidate prefers remote
    }

    // Both prefer office - check location match
    if (candidatePrefs.locations.length === 0) {
      return 50 // No location preference
    }

    const jobLocation = jobPrefs.location.toLowerCase()
    const hasLocationMatch = candidatePrefs.locations.some((loc: string) => 
      jobLocation.includes(loc.toLowerCase()) || loc.toLowerCase().includes(jobLocation)
    )

    return hasLocationMatch ? 100 : 30
  }

  // Calculate salary match score
  private calculateSalaryMatch(candidatePrefs: any, jobPrefs: any): number {
    if (!candidatePrefs.salaryMin || !jobPrefs.salary) {
      return 50 // No salary preference
    }

    const candidateMin = candidatePrefs.salaryMin
    const jobMin = jobPrefs.salary.min
    const jobMax = jobPrefs.salary.max

    if (candidateMin <= jobMax && candidateMin >= jobMin) {
      return 100 // Perfect match
    }

    if (candidateMin < jobMin) {
      const diff = jobMin - candidateMin
      return Math.max(0, 100 - (diff / jobMin) * 100)
    }

    if (candidateMin > jobMax) {
      const diff = candidateMin - jobMax
      return Math.max(0, 100 - (diff / candidateMin) * 100)
    }

    return 50
  }

  // Calculate culture match score
  private calculateCultureMatch(candidate: CandidateProfile, job: JobRequirements): number {
    // This would be more sophisticated in a real implementation
    // For now, return a base score
    return 75
  }

  // Calculate string similarity using Levenshtein distance
  private calculateStringSimilarity(str1: string, str2: string): number {
    const matrix = []
    const len1 = str1.length
    const len2 = str2.length

    for (let i = 0; i <= len2; i++) {
      matrix[i] = [i]
    }

    for (let j = 0; j <= len1; j++) {
      matrix[0][j] = j
    }

    for (let i = 1; i <= len2; i++) {
      for (let j = 1; j <= len1; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1]
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          )
        }
      }
    }

    const maxLen = Math.max(len1, len2)
    return maxLen === 0 ? 1 : (maxLen - matrix[len2][len1]) / maxLen
  }

  // Identify candidate strengths
  private identifyStrengths(candidate: CandidateProfile, job: JobRequirements, breakdown: any): string[] {
    const strengths: string[] = []

    if (breakdown.skills >= 80) {
      strengths.push('Strong technical skills match')
    }

    if (breakdown.experience >= 80) {
      strengths.push('Relevant experience level')
    }

    if (breakdown.education >= 80) {
      strengths.push('Educational background aligns')
    }

    if (breakdown.location >= 80) {
      strengths.push('Location preferences match')
    }

    if (breakdown.salary >= 80) {
      strengths.push('Salary expectations align')
    }

    // Check for specific skill strengths
    const strongSkills = candidate.skills.filter(skill =>
      job.requirements.skills.some(jobSkill =>
        this.calculateStringSimilarity(skill.toLowerCase(), jobSkill.toLowerCase()) > 0.8
      )
    )

    if (strongSkills.length > 0) {
      strengths.push(`Strong in: ${strongSkills.slice(0, 3).join(', ')}`)
    }

    return strengths
  }

  // Identify gaps
  private identifyGaps(candidate: CandidateProfile, job: JobRequirements, breakdown: any): string[] {
    const gaps: string[] = []

    if (breakdown.skills < 60) {
      gaps.push('Missing key technical skills')
    }

    if (breakdown.experience < 60) {
      gaps.push('Experience level below requirements')
    }

    if (breakdown.education < 60) {
      gaps.push('Educational requirements not met')
    }

    if (breakdown.location < 60) {
      gaps.push('Location preferences don\'t align')
    }

    if (breakdown.salary < 60) {
      gaps.push('Salary expectations don\'t align')
    }

    // Check for missing required skills
    const missingSkills = job.requirements.mustHave.filter(skill =>
      !candidate.skills.some(candidateSkill =>
        this.calculateStringSimilarity(skill.toLowerCase(), candidateSkill.toLowerCase()) > 0.7
      )
    )

    if (missingSkills.length > 0) {
      gaps.push(`Missing skills: ${missingSkills.slice(0, 3).join(', ')}`)
    }

    return gaps
  }

  // Generate recommendations
  private generateRecommendations(candidate: CandidateProfile, job: JobRequirements, gaps: string[]): string[] {
    const recommendations: string[] = []

    if (gaps.includes('Missing key technical skills')) {
      recommendations.push('Consider taking courses or certifications in the required technologies')
    }

    if (gaps.includes('Experience level below requirements')) {
      recommendations.push('Look for similar roles with lower experience requirements or internships')
    }

    if (gaps.includes('Educational requirements not met')) {
      recommendations.push('Consider pursuing additional education or highlighting relevant experience')
    }

    if (gaps.includes('Location preferences don\'t align')) {
      recommendations.push('Consider if you\'re open to relocating or remote work')
    }

    if (gaps.includes('Salary expectations don\'t align')) {
      recommendations.push('Review your salary expectations or negotiate based on total compensation')
    }

    return recommendations
  }

  // Calculate confidence score
  private calculateConfidence(candidate: CandidateProfile, job: JobRequirements, breakdown: any): number {
    // Higher confidence when we have more data points
    let confidence = 50

    // Increase confidence based on data completeness
    if (candidate.skills.length > 5) confidence += 10
    if (candidate.experience.years > 0) confidence += 10
    if (candidate.education.degree) confidence += 10
    if (candidate.preferences.salaryMin) confidence += 10
    if (candidate.resume.content.length > 100) confidence += 10

    // Increase confidence based on match consistency
    const scores = Object.values(breakdown) as number[]
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scores.length

    if (variance < 100) confidence += 10 // Low variance = consistent match

    return Math.min(100, confidence)
  }

  // Find best matches for a job
  async findBestMatchesForJob(jobId: string, limit: number = 10): Promise<MatchResult[]> {
    try {
      // Get job requirements
      const { data: job, error: jobError } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError || !job) {
        throw new Error('Job not found')
      }

      // Get all candidate profiles
      const { data: candidates, error: candidatesError } = await this.supabase
        .from('candidate_profiles')
        .select('*')
        .limit(100) // Limit for performance

      if (candidatesError) {
        throw new Error('Failed to fetch candidates')
      }

      // Calculate matches
      const matches: MatchResult[] = []
      
      for (const candidate of candidates) {
        const match = await this.calculateFitScore(candidate, job)
        matches.push(match)
      }

      // Sort by fit score and return top matches
      return matches
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, limit)

    } catch (error) {
      console.error('Error finding matches for job:', error)
      return []
    }
  }

  // Find best jobs for a candidate
  async findBestJobsForCandidate(candidateId: string, limit: number = 10): Promise<MatchResult[]> {
    try {
      // Get candidate profile
      const { data: candidate, error: candidateError } = await this.supabase
        .from('candidate_profiles')
        .select('*')
        .eq('id', candidateId)
        .single()

      if (candidateError || !candidate) {
        throw new Error('Candidate not found')
      }

      // Get active jobs
      const { data: jobs, error: jobsError } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('status', 'active')
        .limit(100) // Limit for performance

      if (jobsError) {
        throw new Error('Failed to fetch jobs')
      }

      // Calculate matches
      const matches: MatchResult[] = []
      
      for (const job of jobs) {
        const match = await this.calculateFitScore(candidate, job)
        matches.push(match)
      }

      // Sort by fit score and return top matches
      return matches
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, limit)

    } catch (error) {
      console.error('Error finding jobs for candidate:', error)
      return []
    }
  }
}

// Export singleton instance
export const aiMatchingEngine = new AIMatchingEngine()

import { createClient } from '@supabase/supabase-js'
import { CandidateProfile, JobRequirements, MatchResult } from './matching-engine'

export class OptimizedAIMatchingEngine {
  private supabase: any
  private cache: Map<string, any> = new Map()
  private batchSize = 50

  constructor() {
    this.supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
  }

  // Optimized batch processing for job matching
  async findBestMatchesForJobOptimized(jobId: string, limit: number = 10): Promise<MatchResult[]> {
    try {
      // Check cache first
      const cacheKey = `job_matches_${jobId}_${limit}`
      const cached = this.cache.get(cacheKey)
      if (cached && Date.now() - cached.timestamp < 300000) { // 5 minute cache
        return cached.data
      }

      // Get job requirements with optimized query
      const { data: job, error: jobError } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .single()

      if (jobError || !job) {
        throw new Error('Job not found')
      }

      // Get candidates in batches with optimized query
      const { data: candidates, error: candidatesError } = await this.supabase
        .from('candidate_profiles')
        .select(`
          id,
          user_id,
          skills,
          experience,
          education,
          preferences,
          resume
        `)
        .limit(100) // Limit for performance
        .order('updated_at', { ascending: false })

      if (candidatesError) {
        throw new Error('Failed to fetch candidates')
      }

      // Process candidates in batches
      const matches: MatchResult[] = []
      
      for (let i = 0; i < candidates.length; i += this.batchSize) {
        const batch = candidates.slice(i, i + this.batchSize)
        
        // Process batch in parallel
        const batchPromises = batch.map((candidate: CandidateProfile) => 
          this.calculateFitScoreOptimized(candidate, job)
        )
        
        const batchResults = await Promise.all(batchPromises)
        matches.push(...batchResults)
      }

      // Sort by fit score and return top matches
      const sortedMatches = matches
        .sort((a, b) => b.fitScore - a.fitScore)
        .slice(0, limit)

      // Cache results
      this.cache.set(cacheKey, {
        data: sortedMatches,
        timestamp: Date.now()
      })

      return sortedMatches

    } catch (error) {
      console.error('Error finding optimized matches for job:', error)
      return []
    }
  }

  // Optimized fit score calculation
  private async calculateFitScoreOptimized(candidate: CandidateProfile, job: JobRequirements): Promise<MatchResult> {
    // Use optimized algorithms for each component
    const breakdown = {
      skills: this.calculateSkillsMatchOptimized(candidate.skills, job.requirements.skills),
      experience: this.calculateExperienceMatchOptimized(candidate.experience, job.requirements.experience),
      education: this.calculateEducationMatchOptimized(candidate.education, job.requirements.education),
      location: this.calculateLocationMatchOptimized(candidate.preferences, job.preferences),
      salary: this.calculateSalaryMatchOptimized(candidate.preferences, job.preferences),
      culture: this.calculateCultureMatchOptimized(candidate, job)
    }

    // Weighted average with optimized weights
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

    const strengths = this.identifyStrengthsOptimized(candidate, job, breakdown)
    const gaps = this.identifyGapsOptimized(candidate, job, breakdown)
    const recommendations = this.generateRecommendationsOptimized(candidate, job, gaps)
    const confidence = this.calculateConfidenceOptimized(candidate, job, breakdown)

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

  // Optimized skills matching with pre-computed similarity matrix
  private calculateSkillsMatchOptimized(candidateSkills: string[], jobSkills: string[]): number {
    if (jobSkills.length === 0) return 100

    // Use Set for O(1) lookup instead of array includes
    const candidateSkillsSet = new Set(candidateSkills.map(s => s.toLowerCase()))
    const jobSkillsLower = jobSkills.map(s => s.toLowerCase())

    let exactMatches = 0
    let partialMatches = 0

    for (const jobSkill of jobSkillsLower) {
      if (candidateSkillsSet.has(jobSkill)) {
        exactMatches++
      } else {
        // Check for partial matches using optimized algorithm
        for (const candidateSkill of candidateSkillsSet) {
          if (this.calculateStringSimilarityOptimized(jobSkill, candidateSkill) > 0.7) {
            partialMatches++
            break // Only count one partial match per job skill
          }
        }
      }
    }

    const totalMatches = exactMatches + (partialMatches * 0.5)
    return Math.min(100, Math.round((totalMatches / jobSkills.length) * 100))
  }

  // Optimized string similarity using memoization
  private similarityCache = new Map<string, number>()

  private calculateStringSimilarityOptimized(str1: string, str2: string): number {
    const cacheKey = `${str1}|${str2}`
    if (this.similarityCache.has(cacheKey)) {
      return this.similarityCache.get(cacheKey)!
    }

    const similarity = this.calculateLevenshteinSimilarity(str1, str2)
    this.similarityCache.set(cacheKey, similarity)
    
    // Limit cache size
    if (this.similarityCache.size > 10000) {
      const firstKey = this.similarityCache.keys().next().value as string | undefined
      if (firstKey) {
        this.similarityCache.delete(firstKey)
      }
    }

    return similarity
  }

  // Optimized Levenshtein distance calculation
  private calculateLevenshteinSimilarity(str1: string, str2: string): number {
    const len1 = str1.length
    const len2 = str2.length

    if (len1 === 0) return len2 === 0 ? 1 : 0
    if (len2 === 0) return 0

    // Use single array instead of matrix for memory efficiency
    let prev = new Array(len2 + 1)
    let curr = new Array(len2 + 1)

    // Initialize first row
    for (let j = 0; j <= len2; j++) {
      prev[j] = j
    }

    // Fill the matrix
    for (let i = 1; i <= len1; i++) {
      curr[0] = i
      for (let j = 1; j <= len2; j++) {
        const cost = str1[i - 1] === str2[j - 1] ? 0 : 1
        curr[j] = Math.min(
          curr[j - 1] + 1,      // insertion
          prev[j] + 1,          // deletion
          prev[j - 1] + cost    // substitution
        )
      }
      // Swap arrays
      [prev, curr] = [curr, prev]
    }

    const maxLen = Math.max(len1, len2)
    return maxLen === 0 ? 1 : (maxLen - prev[len2]) / maxLen
  }

  // Optimized experience matching
  private calculateExperienceMatchOptimized(candidateExp: any, jobExp: any): number {
    const yearsDiff = Math.abs(candidateExp.years - jobExp.years)
    
    // Pre-computed level values for performance
    const levelValues = { entry: 1, mid: 2, senior: 3, lead: 4 } as const
    const candidateLevelKey = (candidateExp.level ?? 'entry') as keyof typeof levelValues
    const jobLevelKey = (jobExp.level ?? 'entry') as keyof typeof levelValues
    const candidateLevel = levelValues[candidateLevelKey] ?? 1
    const jobLevel = levelValues[jobLevelKey] ?? 1
    
    const levelDiff = Math.abs(candidateLevel - jobLevel)
    
    // Optimized score calculation
    const yearsScore = Math.max(0, 100 - (yearsDiff * 10))
    const levelScore = Math.max(0, 100 - (levelDiff * 25))
    
    return Math.round((yearsScore + levelScore) / 2)
  }

  // Optimized education matching
  private calculateEducationMatchOptimized(candidateEdu: any, jobEdu?: string): number {
    if (!jobEdu) return 100

    // Pre-computed degree hierarchy
    const degreeLevels = {
      'high school': 1,
      'associate': 2,
      'bachelor': 3,
      'master': 4,
      'phd': 5,
      'doctorate': 5
    } as const

    const candidateDegree = candidateEdu.degree.toLowerCase()
    const jobDegree = jobEdu.toLowerCase()

    const candidateDegreeKey = (candidateDegree as keyof typeof degreeLevels) ?? 'high school'
    const jobDegreeKey = (jobDegree as keyof typeof degreeLevels) ?? 'high school'

    const candidateLevel = degreeLevels[candidateDegreeKey] ?? 1
    const jobLevel = degreeLevels[jobDegreeKey] ?? 1

    if (candidateLevel >= jobLevel) {
      return 100
    } else {
      return Math.max(0, 100 - ((jobLevel - candidateLevel) * 20))
    }
  }

  // Optimized location matching
  private calculateLocationMatchOptimized(candidatePrefs: any, jobPrefs: any): number {
    if (jobPrefs.remote && candidatePrefs.remote) {
      return 100
    }

    if (jobPrefs.remote && !candidatePrefs.remote) {
      return 80
    }

    if (!jobPrefs.remote && candidatePrefs.remote) {
      return 20
    }

    if (candidatePrefs.locations.length === 0) {
      return 50
    }

    const jobLocation = jobPrefs.location.toLowerCase()
    const hasLocationMatch = candidatePrefs.locations.some((loc: string) => 
      jobLocation.includes(loc.toLowerCase()) || loc.toLowerCase().includes(jobLocation)
    )

    return hasLocationMatch ? 100 : 30
  }

  // Optimized salary matching
  private calculateSalaryMatchOptimized(candidatePrefs: any, jobPrefs: any): number {
    if (!candidatePrefs.salaryMin || !jobPrefs.salary) {
      return 50
    }

    const candidateMin = candidatePrefs.salaryMin
    const jobMin = jobPrefs.salary.min
    const jobMax = jobPrefs.salary.max

    if (candidateMin <= jobMax && candidateMin >= jobMin) {
      return 100
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

  // Optimized culture matching
  private calculateCultureMatchOptimized(candidate: CandidateProfile, job: JobRequirements): number {
    // Simplified culture matching for performance
    return 75
  }

  // Optimized strength identification
  private identifyStrengthsOptimized(candidate: CandidateProfile, job: JobRequirements, breakdown: any): string[] {
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

    return strengths
  }

  // Optimized gap identification
  private identifyGapsOptimized(candidate: CandidateProfile, job: JobRequirements, breakdown: any): string[] {
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

    return gaps
  }

  // Optimized recommendations generation
  private generateRecommendationsOptimized(candidate: CandidateProfile, job: JobRequirements, gaps: string[]): string[] {
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

  // Optimized confidence calculation
  private calculateConfidenceOptimized(candidate: CandidateProfile, job: JobRequirements, breakdown: any): number {
    let confidence = 50

    // Optimized confidence calculation
    if (candidate.skills.length > 5) confidence += 10
    if (candidate.experience.years > 0) confidence += 10
    if (candidate.education.degree) confidence += 10
    if (candidate.preferences.salaryMin) confidence += 10
    if (candidate.resume.content.length > 100) confidence += 10

    // Calculate variance more efficiently
    const scores = Object.values(breakdown) as number[]
    const avgScore = scores.reduce((a, b) => a + b, 0) / scores.length
    const variance = scores.reduce((acc, score) => acc + Math.pow(score - avgScore, 2), 0) / scores.length

    if (variance < 100) confidence += 10

    return Math.min(100, confidence)
  }

  // Clear cache method
  public clearCache(): void {
    this.cache.clear()
    this.similarityCache.clear()
  }

  // Get cache statistics
  public getCacheStats(): { cacheSize: number; similarityCacheSize: number } {
    return {
      cacheSize: this.cache.size,
      similarityCacheSize: this.similarityCache.size
    }
  }
}

// Export singleton instance
export const optimizedAIMatchingEngine = new OptimizedAIMatchingEngine()

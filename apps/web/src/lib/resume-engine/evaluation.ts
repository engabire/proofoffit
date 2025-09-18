// Intelligent resume evaluation and improvement engine

export interface ResumeEvaluation {
  overallScore: number
  atsCompatibility: number
  contentQuality: number
  marketTrends: number
  sections: SectionEvaluation[]
  improvements: ImprovementSuggestion[]
  industryAlignment: IndustryAlignment
  competitiveAnalysis: CompetitiveAnalysis
}

export interface SectionEvaluation {
  sectionId: string
  name: string
  score: number
  issues: EvaluationIssue[]
  strengths: string[]
  improvements: string[]
  wordCount: number
  optimalRange: [number, number]
}

export interface EvaluationIssue {
  type: 'critical' | 'warning' | 'suggestion'
  category: 'ats' | 'content' | 'format' | 'keywords' | 'metrics'
  message: string
  solution: string
  impact: number
}

export interface ImprovementSuggestion {
  priority: 'high' | 'medium' | 'low'
  category: 'keywords' | 'metrics' | 'formatting' | 'content' | 'structure'
  title: string
  description: string
  implementation: string
  expectedImpact: string
  examples?: string[]
}

export interface IndustryAlignment {
  industry: string
  alignmentScore: number
  missingKeywords: string[]
  trendingSkills: string[]
  obsoleteSkills: string[]
  certificationGaps: string[]
}

export interface CompetitiveAnalysis {
  benchmarkScore: number
  topPerformerGap: number
  industryAverageComparison: number
  keyDifferentiators: string[]
  commonWeaknesses: string[]
  marketPositioning: string
}

// Industry-specific evaluation criteria
export const industryEvaluationCriteria = {
  technology: {
    keywordWeight: 0.3,
    metricsWeight: 0.25,
    projectsWeight: 0.2,
    skillsWeight: 0.25,
    requiredSections: ['technical-skills', 'projects', 'experience'],
    criticalKeywords: ['agile', 'ci/cd', 'cloud', 'scalability', 'security'],
    trendingSkills2024: ['AI/ML', 'kubernetes', 'terraform', 'rust', 'go', 'microservices', 'DevOps', 'React', 'TypeScript', 'GraphQL']
  },
  finance: {
    keywordWeight: 0.25,
    metricsWeight: 0.35,
    achievementsWeight: 0.25,
    certificationsWeight: 0.15,
    requiredSections: ['executive-summary', 'core-competencies', 'education-credentials'],
    criticalKeywords: ['P&L', 'ROI', 'risk management', 'compliance', 'financial modeling'],
    trendingSkills2024: ['ESG', 'digital transformation', 'blockchain', 'fintech', 'data analytics', 'regulatory technology']
  },
  healthcare: {
    keywordWeight: 0.2,
    certificationsWeight: 0.3,
    experienceWeight: 0.3,
    outcomeWeight: 0.2,
    requiredSections: ['licenses-certifications', 'clinical-experience'],
    criticalKeywords: ['patient care', 'quality improvement', 'evidence-based', 'interdisciplinary'],
    trendingSkills2024: ['telehealth', 'electronic health records', 'population health', 'value-based care', 'clinical informatics']
  },
  marketing: {
    keywordWeight: 0.25,
    creativityWeight: 0.3,
    metricsWeight: 0.25,
    portfolioWeight: 0.2,
    requiredSections: ['portfolio-projects', 'creative-skills'],
    criticalKeywords: ['ROI', 'conversion', 'brand awareness', 'customer acquisition', 'digital marketing'],
    trendingSkills2024: ['AI marketing', 'customer data platforms', 'programmatic advertising', 'influencer marketing', 'voice marketing']
  },
  sales: {
    keywordWeight: 0.2,
    metricsWeight: 0.4,
    achievementsWeight: 0.25,
    relationshipWeight: 0.15,
    requiredSections: ['key-achievements', 'sales-experience'],
    criticalKeywords: ['quota attainment', 'revenue growth', 'pipeline management', 'customer retention'],
    trendingSkills2024: ['social selling', 'sales enablement', 'predictive analytics', 'account-based marketing', 'CRM automation']
  }
}

// ATS optimization rules
export const atsOptimizationRules = {
  formatting: {
    maxScore: 25,
    rules: [
      { check: 'useStandardFonts', weight: 5, message: 'Use ATS-friendly fonts (Arial, Calibri, Times New Roman)' },
      { check: 'avoidGraphics', weight: 5, message: 'Avoid images, graphics, and charts that ATS cannot read' },
      { check: 'useStandardHeadings', weight: 5, message: 'Use standard section headings (Experience, Education, Skills)' },
      { check: 'properFormatting', weight: 5, message: 'Use consistent formatting and avoid complex layouts' },
      { check: 'fileFormat', weight: 5, message: 'Submit as .docx or .pdf for best ATS compatibility' }
    ]
  },
  keywords: {
    maxScore: 30,
    rules: [
      { check: 'industryKeywords', weight: 10, message: 'Include relevant industry keywords throughout resume' },
      { check: 'skillKeywords', weight: 10, message: 'Match skills from job description exactly' },
      { check: 'actionVerbs', weight: 5, message: 'Use strong action verbs to start bullet points' },
      { check: 'keywordDensity', weight: 5, message: 'Maintain 2-3% keyword density without stuffing' }
    ]
  },
  content: {
    maxScore: 25,
    rules: [
      { check: 'quantifiedAchievements', weight: 10, message: 'Include specific metrics and quantified results' },
      { check: 'relevantExperience', weight: 8, message: 'Prioritize most relevant experience for the role' },
      { check: 'conciseness', weight: 4, message: 'Keep bullet points concise and impactful' },
      { check: 'recentExperience', weight: 3, message: 'Focus on last 10-15 years of experience' }
    ]
  },
  structure: {
    maxScore: 20,
    rules: [
      { check: 'logicalOrder', weight: 5, message: 'Organize sections in logical, expected order' },
      { check: 'consistentDates', weight: 5, message: 'Use consistent date formatting throughout' },
      { check: 'contactInfo', weight: 5, message: 'Include complete, professional contact information' },
      { check: 'appropriateLength', weight: 5, message: 'Maintain appropriate length (1-2 pages for most roles)' }
    ]
  }
}

// Content quality evaluation
export function evaluateContent(resumeText: string, jobDescription: string, industry: string): ResumeEvaluation {
  const sections = parseResumeSections(resumeText)
  const jobKeywords = extractJobKeywords(jobDescription)
  const industryData = industryEvaluationCriteria[industry as keyof typeof industryEvaluationCriteria]
  
  // Evaluate each section
  const sectionEvaluations = sections.map(section => evaluateSection(section, jobKeywords, industryData))
  
  // Calculate overall scores
  const atsScore = calculateATSScore(resumeText, jobKeywords)
  const contentScore = calculateContentScore(sectionEvaluations)
  const trendScore = calculateTrendAlignment(resumeText, industryData)
  
  const overallScore = Math.round((atsScore * 0.3 + contentScore * 0.4 + trendScore * 0.3))
  
  // Generate improvement suggestions
  const improvements = generateImprovements(sectionEvaluations, jobKeywords, industryData)
  
  // Industry alignment analysis
  const industryAlignment = analyzeIndustryAlignment(resumeText, industry, industryData)
  
  // Competitive analysis
  const competitiveAnalysis = performCompetitiveAnalysis(overallScore, industry)
  
  return {
    overallScore,
    atsCompatibility: atsScore,
    contentQuality: contentScore,
    marketTrends: trendScore,
    sections: sectionEvaluations,
    improvements,
    industryAlignment,
    competitiveAnalysis
  }
}

function parseResumeSections(resumeText: string): Array<{id: string, name: string, content: string}> {
  // Implementation would parse resume into sections
  // This is a simplified version
  return [
    { id: 'summary', name: 'Professional Summary', content: extractSection(resumeText, 'summary') },
    { id: 'experience', name: 'Experience', content: extractSection(resumeText, 'experience') },
    { id: 'skills', name: 'Skills', content: extractSection(resumeText, 'skills') },
    { id: 'education', name: 'Education', content: extractSection(resumeText, 'education') }
  ]
}

function extractSection(resumeText: string, sectionType: string): string {
  // Implementation would extract specific sections
  return resumeText.substring(0, 200) // Simplified
}

function extractJobKeywords(jobDescription: string): string[] {
  // Implementation would extract relevant keywords from job description
  return ['javascript', 'react', 'node.js', 'aws', 'agile', 'leadership'] // Simplified
}

function evaluateSection(
  section: {id: string, name: string, content: string}, 
  jobKeywords: string[], 
  industryData: any
): SectionEvaluation {
  const wordCount = section.content.split(' ').length
  const issues: EvaluationIssue[] = []
  const strengths: string[] = []
  const improvements: string[] = []
  
  // Check for keywords
  const foundKeywords = jobKeywords.filter(keyword => 
    section.content.toLowerCase().includes(keyword.toLowerCase())
  )
  
  if (foundKeywords.length < jobKeywords.length * 0.3) {
    issues.push({
      type: 'warning',
      category: 'keywords',
      message: 'Missing relevant keywords from job description',
      solution: `Include keywords: ${jobKeywords.slice(0, 3).join(', ')}`,
      impact: 15
    })
  }
  
  // Check for metrics
  const hasMetrics = /\d+%|\$\d+|[0-9]+x|[0-9]+\+/.test(section.content)
  if (!hasMetrics && section.id === 'experience') {
    issues.push({
      type: 'critical',
      category: 'metrics',
      message: 'No quantified achievements found',
      solution: 'Add specific numbers, percentages, or dollar amounts to show impact',
      impact: 20
    })
  }
  
  // Calculate section score
  let score = 100
  issues.forEach(issue => {
    score -= issue.impact
  })
  
  score = Math.max(0, Math.min(100, score))
  
  return {
    sectionId: section.id,
    name: section.name,
    score,
    issues,
    strengths,
    improvements,
    wordCount,
    optimalRange: getOptimalWordCount(section.id)
  }
}

function getOptimalWordCount(sectionId: string): [number, number] {
  const ranges = {
    summary: [75, 150],
    experience: [200, 400],
    skills: [50, 100],
    education: [30, 80]
  }
  return ranges[sectionId as keyof typeof ranges] || [50, 200]
}

function calculateATSScore(resumeText: string, jobKeywords: string[]): number {
  let score = 100
  
  // Check formatting issues
  if (resumeText.includes('□') || resumeText.includes('●')) score -= 10 // Special characters
  if (resumeText.length < 500) score -= 15 // Too short
  if (resumeText.length > 3000) score -= 10 // Too long
  
  // Check keyword presence
  const keywordMatches = jobKeywords.filter(keyword => 
    resumeText.toLowerCase().includes(keyword.toLowerCase())
  ).length
  
  const keywordScore = (keywordMatches / jobKeywords.length) * 30
  score = score - 30 + keywordScore
  
  return Math.max(0, Math.min(100, score))
}

function calculateContentScore(sectionEvaluations: SectionEvaluation[]): number {
  const totalScore = sectionEvaluations.reduce((sum, section) => sum + section.score, 0)
  return Math.round(totalScore / sectionEvaluations.length)
}

function calculateTrendAlignment(resumeText: string, industryData: any): number {
  if (!industryData?.trendingSkills2024) return 75
  
  const trendingSkillsFound = industryData.trendingSkills2024.filter((skill: string) =>
    resumeText.toLowerCase().includes(skill.toLowerCase())
  ).length
  
  const trendScore = (trendingSkillsFound / industryData.trendingSkills2024.length) * 100
  return Math.min(100, trendScore + 25) // Base score of 25
}

function generateImprovements(
  sectionEvaluations: SectionEvaluation[], 
  jobKeywords: string[], 
  industryData: any
): ImprovementSuggestion[] {
  const improvements: ImprovementSuggestion[] = []
  
  // High priority improvements
  const criticalIssues = sectionEvaluations.flatMap(section => 
    section.issues.filter(issue => issue.type === 'critical')
  )
  
  if (criticalIssues.length > 0) {
    improvements.push({
      priority: 'high',
      category: 'metrics',
      title: 'Add Quantified Achievements',
      description: 'Your resume lacks specific metrics that demonstrate your impact',
      implementation: 'Replace vague statements with specific numbers, percentages, or dollar amounts',
      expectedImpact: 'Increase ATS score by 15-20 points',
      examples: [
        'Instead of "Improved sales" → "Increased sales by 35% ($2.1M) in Q3 2023"',
        'Instead of "Led team" → "Led team of 12 engineers across 3 product lines"',
        'Instead of "Reduced costs" → "Reduced operational costs by $500K annually through process optimization"'
      ]
    })
  }
  
  // Keyword optimization
  improvements.push({
    priority: 'high',
    category: 'keywords',
    title: 'Optimize for Job-Specific Keywords',
    description: 'Include more keywords from the job description to improve ATS matching',
    implementation: `Naturally incorporate these keywords: ${jobKeywords.slice(0, 5).join(', ')}`,
    expectedImpact: 'Improve ATS compatibility by 10-25%',
    examples: [
      'Add keywords to your professional summary',
      'Include them in your skills section',
      'Use them when describing relevant experience'
    ]
  })
  
  // Industry trends
  if (industryData?.trendingSkills2024) {
    improvements.push({
      priority: 'medium',
      category: 'content',
      title: 'Include Trending Industry Skills',
      description: 'Add current, in-demand skills to stay competitive',
      implementation: `Consider adding: ${industryData.trendingSkills2024.slice(0, 3).join(', ')}`,
      expectedImpact: 'Improve market competitiveness by 15-20%'
    })
  }
  
  return improvements
}

function analyzeIndustryAlignment(resumeText: string, industry: string, industryData: any): IndustryAlignment {
  const text = resumeText.toLowerCase()
  
  const missingKeywords = industryData?.criticalKeywords?.filter((keyword: string) => 
    !text.includes(keyword.toLowerCase())
  ) || []
  
  const trendingSkills = industryData?.trendingSkills2024?.filter((skill: string) =>
    text.includes(skill.toLowerCase())
  ) || []
  
  const alignmentScore = Math.round(
    ((industryData?.criticalKeywords?.length - missingKeywords.length) / 
     (industryData?.criticalKeywords?.length || 1)) * 100
  )
  
  return {
    industry,
    alignmentScore,
    missingKeywords,
    trendingSkills,
    obsoleteSkills: [], // Would be populated with outdated skills
    certificationGaps: [] // Would analyze missing certifications
  }
}

function performCompetitiveAnalysis(overallScore: number, industry: string): CompetitiveAnalysis {
  // Industry benchmarks (these would come from real data)
  const benchmarks = {
    technology: { average: 78, topPerformer: 92 },
    finance: { average: 82, topPerformer: 95 },
    healthcare: { average: 80, topPerformer: 93 },
    marketing: { average: 75, topPerformer: 89 },
    sales: { average: 77, topPerformer: 91 }
  }
  
  const benchmark = benchmarks[industry as keyof typeof benchmarks] || benchmarks.technology
  
  return {
    benchmarkScore: benchmark.average,
    topPerformerGap: benchmark.topPerformer - overallScore,
    industryAverageComparison: overallScore - benchmark.average,
    keyDifferentiators: [],
    commonWeaknesses: [],
    marketPositioning: overallScore >= benchmark.topPerformer ? 'Top Tier' :
                      overallScore >= benchmark.average ? 'Above Average' :
                      overallScore >= benchmark.average - 10 ? 'Average' : 'Below Average'
  }
}
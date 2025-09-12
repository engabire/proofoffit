import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface TailoredDocument {
  id: string
  type: 'resume' | 'cover_letter' | 'email'
  content: string
  citations: Citation[]
  metadata: {
    jobId: string
    candidateId: string
    createdAt: Date
    version: string
  }
}

export interface Citation {
  id: string
  bulletId: string
  text: string
  criterion: string
  evidenceType: string
  link?: string
}

export interface TailorRequest {
  jobId: string
  candidateId: string
  documentType: 'resume' | 'cover_letter' | 'email'
  preferences?: {
    tone?: 'professional' | 'casual' | 'enthusiastic'
    length?: 'short' | 'medium' | 'long'
    focus?: string[]
  }
}

export class TailorEngine {
  private supabase = createClientComponentClient()

  /**
   * Generate a tailored document for a specific job
   */
  async tailorDocument(request: TailorRequest): Promise<TailoredDocument> {
    try {
      // Get job details
      const { data: job, error: jobError } = await this.supabase
        .from('jobs')
        .select('*')
        .eq('id', request.jobId)
        .single()

      if (jobError || !job) {
        throw new Error('Job not found')
      }

      // Get candidate profile and bullets
      const { data: profile, error: profileError } = await this.supabase
        .from('candidate_profiles')
        .select(`
          *,
          bullets(*)
        `)
        .eq('id', request.candidateId)
        .single()

      if (profileError || !profile) {
        throw new Error('Candidate profile not found')
      }

      // Get relevant bullets based on job requirements
      const relevantBullets = this.selectRelevantBullets(
        profile.bullets,
        job.requirements
      )

      // Generate document content
      const content = await this.generateDocumentContent(
        request.documentType,
        job,
        profile,
        relevantBullets,
        request.preferences
      )

      // Create citations
      const citations = this.createCitations(relevantBullets)

      // Save tailored document
      const tailoredDoc: TailoredDocument = {
        id: `tailored-${Date.now()}`,
        type: request.documentType,
        content,
        citations,
        metadata: {
          jobId: request.jobId,
          candidateId: request.candidateId,
          createdAt: new Date(),
          version: '1.0'
        }
      }

      // Store in database
      await this.saveTailoredDocument(tailoredDoc)

      return tailoredDoc
    } catch (error) {
      console.error('Tailor engine error:', error)
      throw error
    }
  }

  /**
   * Select relevant bullets based on job requirements
   */
  private selectRelevantBullets(bullets: any[], requirements: any): any[] {
    const mustHave = requirements.must_have || []
    const preferred = requirements.preferred || []
    const allRequirements = [...mustHave, ...preferred]

    return bullets
      .map(bullet => {
        let relevanceScore = 0
        const matchedCriteria: string[] = []

        // Check against job requirements
        allRequirements.forEach(req => {
          const reqLower = req.toLowerCase()
          const bulletText = bullet.text.toLowerCase()
          const bulletTags = Object.values(bullet.tags).join(' ').toLowerCase()

          // Direct text match
          if (bulletText.includes(reqLower) || bulletTags.includes(reqLower)) {
            relevanceScore += 10
            matchedCriteria.push(req)
          }

          // Criterion match
          if (bullet.tags.criterion) {
            const criterionLower = bullet.tags.criterion.toLowerCase()
            if (criterionLower.includes(reqLower) || reqLower.includes(criterionLower)) {
              relevanceScore += 8
              matchedCriteria.push(req)
            }
          }

          // Evidence type bonus
          if (bullet.tags.evidence_type === 'result' && bullet.tags.metric) {
            relevanceScore += 5
          }
        })

        return {
          ...bullet,
          relevanceScore,
          matchedCriteria
        }
      })
      .filter(bullet => bullet.relevanceScore > 0)
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 8) // Top 8 most relevant bullets
  }

  /**
   * Generate document content based on type
   */
  private async generateDocumentContent(
    type: string,
    job: any,
    profile: any,
    bullets: any[],
    preferences?: any
  ): Promise<string> {
    switch (type) {
      case 'resume':
        return this.generateResumeContent(job, profile, bullets, preferences)
      case 'cover_letter':
        return this.generateCoverLetterContent(job, profile, bullets, preferences)
      case 'email':
        return this.generateEmailContent(job, profile, bullets, preferences)
      default:
        throw new Error(`Unsupported document type: ${type}`)
    }
  }

  /**
   * Generate tailored resume content
   */
  private generateResumeContent(
    job: any,
    profile: any,
    bullets: any[],
    preferences?: any
  ): string {
    const topBullets = bullets.slice(0, 6)
    
    let content = `# ${profile.user?.email || 'Professional Resume'}\n\n`
    content += `## Professional Summary\n`
    content += `Experienced professional with expertise in ${this.extractKeySkills(job, bullets)}. ` +
               `Proven track record of delivering results in ${this.extractDomain(job)}.\n\n`
    
    content += `## Key Achievements\n`
    topBullets.forEach((bullet, index) => {
      content += `• ${bullet.text}\n`
    })
    
    content += `\n## Technical Skills\n`
    const skills = this.extractTechnicalSkills(job, bullets)
    content += skills.join(' • ') + '\n\n'
    
    content += `## Experience Highlights\n`
    content += `• ${this.generateExperienceSummary(bullets)}\n`
    content += `• ${this.generateLeadershipSummary(bullets)}\n`
    content += `• ${this.generateResultsSummary(bullets)}\n`

    return content
  }

  /**
   * Generate cover letter content
   */
  private generateCoverLetterContent(
    job: any,
    profile: any,
    bullets: any[],
    preferences?: any
  ): string {
    const tone = preferences?.tone || 'professional'
    
    let content = `Dear Hiring Manager,\n\n`
    
    content += `I am writing to express my strong interest in the ${job.title} position at ${job.org}. ` +
               `With my background in ${this.extractKeySkills(job, bullets)}, ` +
               `I am confident that I would be a valuable addition to your team.\n\n`
    
    content += `## Why I'm a Great Fit\n\n`
    
    const topBullets = bullets.slice(0, 3)
    topBullets.forEach((bullet, index) => {
      content += `${index + 1}. ${bullet.text} This experience directly aligns with your requirement for ${this.mapToRequirement(bullet, job)}.\n\n`
    })
    
    content += `## What I Bring to ${job.org}\n\n`
    content += `• ${this.generateValueProposition(bullets)}\n`
    content += `• ${this.generateInnovationSummary(bullets)}\n`
    content += `• ${this.generateCollaborationSummary(bullets)}\n\n`
    
    content += `I am excited about the opportunity to contribute to ${job.org}'s mission and would welcome the chance to discuss how my experience can help drive your team's success.\n\n`
    content += `Best regards,\n[Your Name]`

    return content
  }

  /**
   * Generate email content
   */
  private generateEmailContent(
    job: any,
    profile: any,
    bullets: any[],
    preferences?: any
  ): string {
    const tone = preferences?.tone || 'professional'
    
    let content = `Subject: Application for ${job.title} Position\n\n`
    content += `Hi [Hiring Manager Name],\n\n`
    
    content += `I hope this email finds you well. I came across the ${job.title} position at ${job.org} and was immediately drawn to the opportunity. ` +
               `My experience in ${this.extractKeySkills(job, bullets)} makes me an ideal candidate for this role.\n\n`
    
    content += `## Quick Highlights\n`
    const topBullets = bullets.slice(0, 2)
    topBullets.forEach((bullet, index) => {
      content += `• ${bullet.text}\n`
    })
    
    content += `\nI've attached my tailored resume and would love to schedule a brief conversation to discuss how I can contribute to your team's success.\n\n`
    content += `Looking forward to hearing from you!\n\n`
    content += `Best regards,\n[Your Name]\n[Your Contact Information]`

    return content
  }

  /**
   * Create citations for the tailored document
   */
  private createCitations(bullets: any[]): Citation[] {
    return bullets.map((bullet, index) => ({
      id: `citation-${index}`,
      bulletId: bullet.id,
      text: bullet.text,
      criterion: bullet.tags.criterion || 'General',
      evidenceType: bullet.tags.evidence_type || 'experience',
      link: bullet.tags.link
    }))
  }

  /**
   * Save tailored document to database
   */
  private async saveTailoredDocument(doc: TailoredDocument): Promise<void> {
    try {
      const { error } = await this.supabase
        .from('tailored_documents')
        .insert({
          id: doc.id,
          candidateId: doc.metadata.candidateId,
          jobId: doc.metadata.jobId,
          type: doc.type,
          content: doc.content,
          citations: doc.citations,
          metadata: doc.metadata
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to save tailored document:', error)
      throw error
    }
  }

  // Helper methods for content generation
  private extractKeySkills(job: any, bullets: any[]): string {
    const skills = new Set<string>()
    bullets.forEach(bullet => {
      if (bullet.tags.tool) {
        skills.add(bullet.tags.tool)
      }
    })
    return Array.from(skills).slice(0, 3).join(', ')
  }

  private extractDomain(job: any): string {
    return job.org || 'technology'
  }

  private extractTechnicalSkills(job: any, bullets: any[]): string[] {
    const skills = new Set<string>()
    bullets.forEach(bullet => {
      if (bullet.tags.tool) {
        skills.add(bullet.tags.tool)
      }
    })
    return Array.from(skills)
  }

  private generateExperienceSummary(bullets: any[]): string {
    const experienceBullets = bullets.filter(b => b.tags.evidence_type === 'result')
    if (experienceBullets.length > 0) {
      return experienceBullets[0].text
    }
    return 'Delivered measurable results across multiple projects'
  }

  private generateLeadershipSummary(bullets: any[]): string {
    const leadershipBullets = bullets.filter(b => 
      b.tags.criterion?.toLowerCase().includes('leadership') ||
      b.text.toLowerCase().includes('led') ||
      b.text.toLowerCase().includes('managed')
    )
    if (leadershipBullets.length > 0) {
      return leadershipBullets[0].text
    }
    return 'Demonstrated strong leadership and team collaboration skills'
  }

  private generateResultsSummary(bullets: any[]): string {
    const resultBullets = bullets.filter(b => b.tags.metric)
    if (resultBullets.length > 0) {
      return resultBullets[0].text
    }
    return 'Consistently exceeded performance expectations'
  }

  private mapToRequirement(bullet: any, job: any): string {
    const requirements = [...(job.requirements.must_have || []), ...(job.requirements.preferred || [])]
    const bulletText = bullet.text.toLowerCase()
    
    for (const req of requirements) {
      if (bulletText.includes(req.toLowerCase())) {
        return req
      }
    }
    return 'relevant experience'
  }

  private generateValueProposition(bullets: any[]): string {
    const valueBullets = bullets.filter(b => b.tags.evidence_type === 'result')
    if (valueBullets.length > 0) {
      return valueBullets[0].text
    }
    return 'Proven ability to drive results and exceed expectations'
  }

  private generateInnovationSummary(bullets: any[]): string {
    const innovationBullets = bullets.filter(b => 
      b.text.toLowerCase().includes('innovative') ||
      b.text.toLowerCase().includes('improved') ||
      b.text.toLowerCase().includes('optimized')
    )
    if (innovationBullets.length > 0) {
      return innovationBullets[0].text
    }
    return 'Track record of implementing innovative solutions'
  }

  private generateCollaborationSummary(bullets: any[]): string {
    const collabBullets = bullets.filter(b => 
      b.text.toLowerCase().includes('team') ||
      b.text.toLowerCase().includes('collaborat') ||
      b.text.toLowerCase().includes('cross-functional')
    )
    if (collabBullets.length > 0) {
      return collabBullets[0].text
    }
    return 'Strong collaboration and communication skills'
  }
}

// Export singleton instance
export const tailorEngine = new TailorEngine()
import { demoUser, demoProfile, demoBullets, demoJobs, demoMatches, demoApplications, demoSlates, demoPolicySources } from './demo-data'

// Demo helpers for ProofOfFit.com demonstration
export class DemoAuthHelpers {
  static async getCurrentUserWithProfile() {
    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      user: demoUser,
      profile: demoProfile
    }
  }
}

export class DemoSupabase {
  static async from(table: string) {
    return {
      select: (columns: string) => ({
        eq: (column: string, value: any) => ({
          single: async () => {
            await new Promise(resolve => setTimeout(resolve, 100))
            
            switch (table) {
              case 'candidate_profiles':
                return { data: demoProfile, error: null }
              case 'bullets':
                return { data: demoBullets, error: null }
              case 'jobs':
                return { data: demoJobs, error: null }
              case 'applications':
                return { data: demoApplications, error: null }
              case 'slates':
                return { data: demoSlates, error: null }
              case 'policy_sources':
                return { data: demoPolicySources, error: null }
              default:
                return { data: null, error: null }
            }
          }
        }),
        order: (orderBy: string) => ({
          limit: (count: number) => ({
            then: (callback: (result: any) => void) => {
              setTimeout(() => {
                let data: any[] = []
                switch (table) {
                  case 'jobs':
                    data = demoJobs.slice(0, count)
                    break
                  case 'applications':
                    data = demoApplications.slice(0, count)
                    break
                  case 'slates':
                    data = demoSlates.slice(0, count)
                    break
                  case 'policy_sources':
                    data = demoPolicySources
                    break
                }
                callback({ data, error: null })
              }, 100)
            }
          })
        })
      }),
      insert: (data: any) => ({
        select: () => ({
          single: async () => {
            await new Promise(resolve => setTimeout(resolve, 200))
            return { data: { id: 'demo-id', ...data }, error: null }
          }
        })
      }),
      update: (data: any) => ({
        eq: (column: string, value: any) => ({
          then: (callback: (result: any) => void) => {
            setTimeout(() => {
              callback({ data: { id: value, ...data }, error: null })
            }, 100)
          }
        })
      })
    }
  }
}

export class DemoPolicyEngine {
  static async checkJobSourcePolicy(domain: string) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const policy = demoPolicySources.find(p => p.domain === domain)
    if (!policy) {
      return {
        allowed: false,
        captcha: true,
        notes: 'No policy found for this domain',
        action: 'deny' as const
      }
    }

    let action: 'auto_apply' | 'prep_confirm' | 'deny'
    if (!policy.allowed) {
      action = 'deny'
    } else if (policy.captcha) {
      action = 'prep_confirm'
    } else {
      action = 'auto_apply'
    }

    return {
      allowed: policy.allowed,
      captcha: policy.captcha,
      notes: policy.notes,
      action
    }
  }

  static async validateJobCompliance(job: any) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    const violations: string[] = []
    const warnings: string[] = []

    if (!job.title || job.title.trim().length < 3) {
      violations.push('Job title is too short or missing')
    }

    if (!job.description || job.description.trim().length < 50) {
      violations.push('Job description is too short or missing')
    }

    if (job.description?.toLowerCase().includes('work from home') && 
        job.description?.toLowerCase().includes('no experience')) {
      warnings.push('Potential scam indicators detected')
    }

    return {
      compliant: violations.length === 0,
      violations,
      warnings
    }
  }
}

export class DemoTailorEngine {
  static async tailorDocument(request: any) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const job = demoJobs.find(j => j.id === request.jobId)
    const relevantBullets = demoBullets.slice(0, 3)
    
    let content = ''
    switch (request.documentType) {
      case 'resume':
        content = this.generateResumeContent(job, relevantBullets)
        break
      case 'cover_letter':
        content = this.generateCoverLetterContent(job, relevantBullets)
        break
      case 'email':
        content = this.generateEmailContent(job, relevantBullets)
        break
    }

    const citations = relevantBullets.map((bullet, index) => ({
      id: `citation-${index}`,
      bulletId: bullet.id,
      text: bullet.text,
      criterion: bullet.tags.criterion || 'General',
      evidenceType: bullet.tags.evidence_type || 'experience'
    }))

    return {
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
  }

  private static generateResumeContent(job: any, bullets: any[]) {
    return `# Demo Candidate Resume

## Professional Summary
Experienced frontend developer with expertise in React and TypeScript. Proven track record of delivering results in healthcare technology.

## Key Achievements
${bullets.map(bullet => `• ${bullet.text}`).join('\n')}

## Technical Skills
React • TypeScript • JavaScript • HTML/CSS • Git

## Experience Highlights
• Delivered measurable results across multiple projects
• Demonstrated strong leadership and team collaboration skills
• Consistently exceeded performance expectations`
  }

  private static generateCoverLetterContent(job: any, bullets: any[]) {
    return `Dear Hiring Manager,

I am writing to express my strong interest in the ${job?.title} position at ${job?.org}. With my background in React and TypeScript, I am confident that I would be a valuable addition to your team.

## Why I'm a Great Fit

1. ${bullets[0]?.text} This experience directly aligns with your requirement for React expertise.

2. ${bullets[1]?.text} This demonstrates my commitment to code quality and testing.

3. ${bullets[2]?.text} This shows my ability to optimize performance and deliver results.

## What I Bring to ${job?.org}

• Proven ability to drive results and exceed expectations
• Track record of implementing innovative solutions
• Strong collaboration and communication skills

I am excited about the opportunity to contribute to ${job?.org}'s mission and would welcome the chance to discuss how my experience can help drive your team's success.

Best regards,
[Your Name]`
  }

  private static generateEmailContent(job: any, bullets: any[]) {
    return `Subject: Application for ${job?.title} Position

Hi [Hiring Manager Name],

I hope this email finds you well. I came across the ${job?.title} position at ${job?.org} and was immediately drawn to the opportunity. My experience in React and TypeScript makes me an ideal candidate for this role.

## Quick Highlights
• ${bullets[0]?.text}
• ${bullets[1]?.text}

I've attached my tailored resume and would love to schedule a brief conversation to discuss how I can contribute to your team's success.

Looking forward to hearing from you!

Best regards,
[Your Name]
[Your Contact Information]`
  }
}

export class DemoStripeService {
  static PLANS = {
    free: {
      id: 'free',
      name: 'Free',
      description: 'Perfect for getting started',
      price: 0,
      interval: 'month' as const,
      features: [
        'Up to 10 applications per month',
        'Basic job matching',
        'Simple resume tailoring',
        'Email support'
      ],
      limits: {
        applications: 10
      }
    },
    pro: {
      id: 'pro',
      name: 'Pro',
      description: 'For serious job seekers',
      price: 29,
      interval: 'month' as const,
      features: [
        'Unlimited applications',
        'Advanced AI matching',
        'Premium resume tailoring',
        'Priority support',
        'Advanced analytics',
        'Interview scheduling'
      ],
      limits: {
        applications: -1
      }
    }
  }

  static async getUsageStats(tenantId: string) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      applications: { current: 7, limit: 10 },
      slates: { current: 0, limit: 0 },
      teamMembers: { current: 1, limit: 0 }
    }
  }

  static async checkFeatureAccess(tenantId: string, feature: string) {
    await new Promise(resolve => setTimeout(resolve, 100))
    
    return {
      allowed: true,
      limit: 10,
      current: 7
    }
  }
}
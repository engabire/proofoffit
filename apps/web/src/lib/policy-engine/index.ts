import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export interface PolicyDecision {
  allowed: boolean
  captcha: boolean
  notes: string
  action: 'auto_apply' | 'prep_confirm' | 'deny'
}

export interface JobSource {
  domain: string
  allowed: boolean
  captcha: boolean
  notes: string
  version: string
}

export class PolicyEngine {
  private supabase = createClientComponentClient()

  /**
   * Check if a job source is allowed for automation
   */
  async checkJobSourcePolicy(domain: string): Promise<PolicyDecision> {
    try {
      const { data: policy, error } = await this.supabase
        .from('policy_sources')
        .select('*')
        .eq('domain', domain)
        .single()

      if (error || !policy) {
        // Default to deny if no policy found
        return {
          allowed: false,
          captcha: true,
          notes: 'No policy found for this domain',
          action: 'deny'
        }
      }

      // Determine action based on policy
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
        notes: policy.notes || '',
        action
      }
    } catch (error) {
      console.error('Policy check failed:', error)
      return {
        allowed: false,
        captcha: true,
        notes: 'Policy check failed',
        action: 'deny'
      }
    }
  }

  /**
   * Check if a job URL requires CAPTCHA
   */
  async checkCaptchaRequirement(url: string): Promise<boolean> {
    try {
      const domain = new URL(url).hostname
      const { data: policy } = await this.supabase
        .from('policy_sources')
        .select('captcha')
        .eq('domain', domain)
        .single()

      return policy?.captcha || false
    } catch (error) {
      console.error('CAPTCHA check failed:', error)
      return true // Default to requiring CAPTCHA if check fails
    }
  }

  /**
   * Get all policy sources
   */
  async getPolicySources(): Promise<JobSource[]> {
    try {
      const { data: policies, error } = await this.supabase
        .from('policy_sources')
        .select('*')
        .order('domain')

      if (error) throw error
      return policies || []
    } catch (error) {
      console.error('Failed to fetch policy sources:', error)
      return []
    }
  }

  /**
   * Update a policy source
   */
  async updatePolicySource(domain: string, updates: Partial<JobSource>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('policy_sources')
        .update(updates)
        .eq('domain', domain)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to update policy source:', error)
      return false
    }
  }

  /**
   * Add a new policy source
   */
  async addPolicySource(policy: Omit<JobSource, 'version'>): Promise<boolean> {
    try {
      const { error } = await this.supabase
        .from('policy_sources')
        .insert({
          ...policy,
          version: '1.0'
        })

      if (error) throw error
      return true
    } catch (error) {
      console.error('Failed to add policy source:', error)
      return false
    }
  }

  /**
   * Validate job posting compliance
   */
  async validateJobCompliance(job: {
    source: string
    org: string
    title: string
    description: string
    url?: string
  }): Promise<{
    compliant: boolean
    violations: string[]
    warnings: string[]
  }> {
    const violations: string[] = []
    const warnings: string[] = []

    // Check source policy
    const policyDecision = await this.checkJobSourcePolicy(job.source)
    if (!policyDecision.allowed) {
      violations.push(`Source ${job.source} is not allowed for automation`)
    }

    // Check for required fields
    if (!job.title || job.title.trim().length < 3) {
      violations.push('Job title is too short or missing')
    }

    if (!job.description || job.description.trim().length < 50) {
      violations.push('Job description is too short or missing')
    }

    // Check for suspicious patterns
    if (job.description.toLowerCase().includes('work from home') && 
        job.description.toLowerCase().includes('no experience')) {
      warnings.push('Potential scam indicators detected')
    }

    // Check for pay transparency compliance
    if (job.source === 'usajobs' && !job.description.includes('$')) {
      warnings.push('Federal jobs should include salary information')
    }

    return {
      compliant: violations.length === 0,
      violations,
      warnings
    }
  }

  /**
   * Log policy decision to action log
   */
  async logPolicyDecision(
    tenantId: string,
    decision: PolicyDecision,
    context: {
      jobId?: string
      source: string
      url?: string
    }
  ): Promise<void> {
    try {
      const payload = {
        decision,
        context,
        timestamp: new Date().toISOString()
      }

      const { error } = await this.supabase
        .from('action_log')
        .insert({
          tenantId,
          actorType: 'system',
          actorId: 'policy_engine',
          action: 'policy_decision',
          objType: 'job',
          objId: context.jobId || 'unknown',
          payloadHash: await this.hashPayload(payload)
        })

      if (error) throw error
    } catch (error) {
      console.error('Failed to log policy decision:', error)
    }
  }

  /**
   * Hash payload for action log
   */
  private async hashPayload(payload: any): Promise<string> {
    const encoder = new TextEncoder()
    const data = encoder.encode(JSON.stringify(payload))
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }
}

// Export singleton instance
export const policyEngine = new PolicyEngine()
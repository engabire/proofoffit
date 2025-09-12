import { policyEngine } from '@/lib/policy-engine'

// Mock Supabase
const mockSupabase = {
  from: jest.fn(() => ({
    select: jest.fn().mockReturnThis(),
    insert: jest.fn().mockReturnThis(),
    update: jest.fn().mockReturnThis(),
    delete: jest.fn().mockReturnThis(),
    eq: jest.fn().mockReturnThis(),
    single: jest.fn(),
  })),
}

jest.mock('@supabase/auth-helpers-nextjs', () => ({
  createClientComponentClient: () => mockSupabase,
}))

describe('Policy Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('checkJobSourcePolicy', () => {
    it('returns auto-apply for allowed domains without captcha', async () => {
      mockSupabase.from().single.mockResolvedValue({
        data: {
          domain: 'usajobs.gov',
          allowed: true,
          captcha: false,
          notes: 'Government jobs are safe for automation',
        },
        error: null,
      })

      const result = await policyEngine.checkJobSourcePolicy('usajobs.gov')

      expect(result).toEqual({
        allowed: true,
        captcha: false,
        notes: 'Government jobs are safe for automation',
        action: 'auto_apply',
      })
    })

    it('returns prep-confirm for allowed domains with captcha', async () => {
      mockSupabase.from().single.mockResolvedValue({
        data: {
          domain: 'linkedin.com',
          allowed: true,
          captcha: true,
          notes: 'Requires CAPTCHA verification',
        },
        error: null,
      })

      const result = await policyEngine.checkJobSourcePolicy('linkedin.com')

      expect(result).toEqual({
        allowed: true,
        captcha: true,
        notes: 'Requires CAPTCHA verification',
        action: 'prep_confirm',
      })
    })

    it('returns deny for disallowed domains', async () => {
      mockSupabase.from().single.mockResolvedValue({
        data: {
          domain: 'sketchy-jobs.com',
          allowed: false,
          captcha: true,
          notes: 'Domain not trusted for automation',
        },
        error: null,
      })

      const result = await policyEngine.checkJobSourcePolicy('sketchy-jobs.com')

      expect(result).toEqual({
        allowed: false,
        captcha: true,
        notes: 'Domain not trusted for automation',
        action: 'deny',
      })
    })

    it('returns deny when no policy found', async () => {
      mockSupabase.from().single.mockResolvedValue({
        data: null,
        error: { message: 'No policy found' },
      })

      const result = await policyEngine.checkJobSourcePolicy('unknown-domain.com')

      expect(result).toEqual({
        allowed: false,
        captcha: true,
        notes: 'No policy found for this domain',
        action: 'deny',
      })
    })
  })

  describe('validateJobCompliance', () => {
    it('validates compliant job posting', async () => {
      const job = {
        source: 'usajobs.gov',
        org: 'Department of Defense',
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer with 5+ years of experience in React and TypeScript. The role involves building modern web applications and working with cross-functional teams.',
      }

      // Mock policy check
      mockSupabase.from().single.mockResolvedValue({
        data: { allowed: true, captcha: false },
        error: null,
      })

      const result = await policyEngine.validateJobCompliance(job)

      expect(result.compliant).toBe(true)
      expect(result.violations).toHaveLength(0)
    })

    it('detects non-compliant job posting', async () => {
      const job = {
        source: 'sketchy-jobs.com',
        org: 'Unknown Company',
        title: 'SW',
        description: 'Work from home, no experience needed!',
      }

      // Mock policy check
      mockSupabase.from().single.mockResolvedValue({
        data: { allowed: false, captcha: true },
        error: null,
      })

      const result = await policyEngine.validateJobCompliance(job)

      expect(result.compliant).toBe(false)
      expect(result.violations).toContain('Source sketchy-jobs.com is not allowed for automation')
      expect(result.violations).toContain('Job title is too short or missing')
      expect(result.violations).toContain('Job description is too short or missing')
      expect(result.warnings).toContain('Potential scam indicators detected')
    })

    it('detects federal job without salary information', async () => {
      const job = {
        source: 'usajobs',
        org: 'Department of Defense',
        title: 'Software Engineer',
        description: 'We are looking for a skilled software engineer with 5+ years of experience in React and TypeScript.',
      }

      // Mock policy check
      mockSupabase.from().single.mockResolvedValue({
        data: { allowed: true, captcha: false },
        error: null,
      })

      const result = await policyEngine.validateJobCompliance(job)

      expect(result.compliant).toBe(true)
      expect(result.warnings).toContain('Federal jobs should include salary information')
    })
  })

  describe('getPolicySources', () => {
    it('returns all policy sources', async () => {
      const mockPolicies = [
        {
          domain: 'usajobs.gov',
          allowed: true,
          captcha: false,
          notes: 'Government jobs',
          version: '1.0',
        },
        {
          domain: 'linkedin.com',
          allowed: true,
          captcha: true,
          notes: 'Professional network',
          version: '1.0',
        },
      ]

      mockSupabase.from().order.mockResolvedValue({
        data: mockPolicies,
        error: null,
      })

      const result = await policyEngine.getPolicySources()

      expect(result).toEqual(mockPolicies)
    })

    it('handles database error gracefully', async () => {
      mockSupabase.from().order.mockResolvedValue({
        data: null,
        error: { message: 'Database error' },
      })

      const result = await policyEngine.getPolicySources()

      expect(result).toEqual([])
    })
  })

  describe('updatePolicySource', () => {
    it('updates policy source successfully', async () => {
      mockSupabase.from().update().eq.mockResolvedValue({
        data: {},
        error: null,
      })

      const result = await policyEngine.updatePolicySource('usajobs.gov', {
        allowed: false,
        captcha: true,
        notes: 'Updated policy',
      })

      expect(result).toBe(true)
      expect(mockSupabase.from).toHaveBeenCalledWith('policy_sources')
    })

    it('handles update error', async () => {
      mockSupabase.from().update().eq.mockResolvedValue({
        data: null,
        error: { message: 'Update failed' },
      })

      const result = await policyEngine.updatePolicySource('usajobs.gov', {
        allowed: false,
      })

      expect(result).toBe(false)
    })
  })
})
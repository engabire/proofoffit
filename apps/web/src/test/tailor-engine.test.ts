// Mock Supabase before any imports
type QueryBuilderMock = {
  select: jest.Mock<QueryBuilderMock, []>
  insert: jest.Mock<QueryBuilderMock, []>
  update: jest.Mock<QueryBuilderMock, []>
  delete: jest.Mock<QueryBuilderMock, []>
  eq: jest.Mock<any, []>
  order: jest.Mock<QueryBuilderMock, []>
  single: jest.Mock<Promise<any>, []>
}

const createQueryBuilderMock = (): QueryBuilderMock => {
  const builder = {} as QueryBuilderMock
  builder.select = jest.fn(() => builder)
  builder.insert = jest.fn(() => builder)
  builder.update = jest.fn(() => builder)
  builder.delete = jest.fn(() => builder)
  builder.eq = jest.fn(() => builder)
  builder.order = jest.fn(() => builder)
  builder.single = jest.fn<Promise<any>, []>()
  return builder
}

const mockQueryBuilder = createQueryBuilderMock()


const mockSupabase = {
  from: jest.fn(() => mockQueryBuilder),
}

beforeAll(() => {
  jest.mock('@supabase/auth-helpers-nextjs', () => ({
    createClientComponentClient: () => mockSupabase,
  }))
})

const { tailorEngine } = require('@/lib/tailor-engine')

describe('Tailor Engine', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockJob = {
    id: 'job-1',
    title: 'Senior Frontend Developer',
    org: 'TechCorp',
    location: 'San Francisco, CA',
    workType: 'hybrid',
    description: 'We are looking for a senior frontend developer with 5+ years of React experience and strong TypeScript skills.',
    requirements: {
      must_have: ['React', 'TypeScript', '5+ years experience'],
      preferred: ['Healthcare domain', 'Team leadership', 'UI/UX design'],
    },
  }

  const mockProfile = {
    id: 'profile-1',
    userId: 'user-1',
    user: { email: 'test@example.com' },
    bullets: [
      {
        id: 'bullet-1',
        text: 'Led a team of 8 engineers to deliver a React-based healthcare application',
        tags: {
          criterion: 'Team Leadership',
          tool: 'React',
          evidence_type: 'result',
          metric: '8 engineers',
          domain: 'Healthcare',
        },
      },
      {
        id: 'bullet-2',
        text: 'Built advanced TypeScript components with 95% test coverage',
        tags: {
          criterion: 'TypeScript',
          tool: 'TypeScript',
          evidence_type: 'result',
          metric: '95% coverage',
        },
      },
      {
        id: 'bullet-3',
        text: 'Improved application performance by 40% using React optimization techniques',
        tags: {
          criterion: 'Performance',
          tool: 'React',
          evidence_type: 'result',
          metric: '40% improvement',
        },
      },
    ],
  }

  describe('tailorDocument', () => {
    it('generates tailored resume successfully', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: mockProfile, error: null }) // Profile query
        .mockResolvedValueOnce({ data: {}, error: null }) // Save document

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'resume' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      expect(result).toMatchObject({
        type: 'resume',
        metadata: {
          jobId: 'job-1',
          candidateId: 'profile-1',
          version: '1.0',
        },
      })

      expect(result.content).toContain('Professional Summary')
      expect(result.content).toContain('Key Achievements')
      expect(result.content).toContain('Technical Skills')
      expect(result.citations).toHaveLength(3)
    })

    it('generates tailored cover letter successfully', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: mockProfile, error: null }) // Profile query
        .mockResolvedValueOnce({ data: {}, error: null }) // Save document

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'cover_letter' as const,
        preferences: {
          tone: 'professional' as const,
          length: 'medium' as const,
        },
      }

      const result = await tailorEngine.tailorDocument(request)

      expect(result).toMatchObject({
        type: 'cover_letter',
        metadata: {
          jobId: 'job-1',
          candidateId: 'profile-1',
          version: '1.0',
        },
      })

      expect(result.content).toContain('Dear Hiring Manager')
      expect(result.content).toContain('Why I\'m a Great Fit')
      expect(result.content).toContain('TechCorp')
    })

    it('generates email template successfully', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: mockProfile, error: null }) // Profile query
        .mockResolvedValueOnce({ data: {}, error: null }) // Save document

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'email' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      expect(result).toMatchObject({
        type: 'email',
        metadata: {
          jobId: 'job-1',
          candidateId: 'profile-1',
          version: '1.0',
        },
      })

      expect(result.content).toContain('Subject: Application for')
      expect(result.content).toContain('Hi [Hiring Manager Name]')
      expect(result.content).toContain('Quick Highlights')
    })

    it('handles job not found error', async () => {
      mockSupabase.from().select().eq().single.mockResolvedValue({
        data: null,
        error: { message: 'Job not found' },
      })

      const request = {
        jobId: 'nonexistent-job',
        candidateId: 'profile-1',
        documentType: 'resume' as const,
      }

      await expect(tailorEngine.tailorDocument(request)).rejects.toThrow('Job not found')
    })

    it('handles profile not found error', async () => {
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: null, error: { message: 'Profile not found' } }) // Profile query

      const request = {
        jobId: 'job-1',
        candidateId: 'nonexistent-profile',
        documentType: 'resume' as const,
      }

      await expect(tailorEngine.tailorDocument(request)).rejects.toThrow('Candidate profile not found')
    })

    it('selects relevant bullets based on job requirements', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: mockProfile, error: null }) // Profile query
        .mockResolvedValueOnce({ data: {}, error: null }) // Save document

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'resume' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      // Should select bullets that match job requirements
      expect(result.citations).toHaveLength(3)
      
      // Check that relevant bullets are included
      const bulletTexts = result.citations.map(c => c.text)
      expect(bulletTexts).toContain('Led a team of 8 engineers to deliver a React-based healthcare application')
      expect(bulletTexts).toContain('Built advanced TypeScript components with 95% test coverage')
    })

    it('creates proper citations with metadata', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null }) // Job query
        .mockResolvedValueOnce({ data: mockProfile, error: null }) // Profile query
        .mockResolvedValueOnce({ data: {}, error: null }) // Save document

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'resume' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      expect(result.citations[0]).toMatchObject({
        bulletId: 'bullet-1',
        text: 'Led a team of 8 engineers to deliver a React-based healthcare application',
        criterion: 'Team Leadership',
        evidenceType: 'result',
      })
    })
  })

  describe('content generation', () => {
    it('generates resume with proper structure', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null })
        .mockResolvedValueOnce({ data: mockProfile, error: null })
        .mockResolvedValueOnce({ data: {}, error: null })

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'resume' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      const content = result.content
      expect(content).toContain('# test@example.com')
      expect(content).toContain('## Professional Summary')
      expect(content).toContain('## Key Achievements')
      expect(content).toContain('## Technical Skills')
      expect(content).toContain('## Experience Highlights')
    })

    it('generates cover letter with proper structure', async () => {
      // Mock database calls
      mockSupabase.from().select().eq().single
        .mockResolvedValueOnce({ data: mockJob, error: null })
        .mockResolvedValueOnce({ data: mockProfile, error: null })
        .mockResolvedValueOnce({ data: {}, error: null })

      const request = {
        jobId: 'job-1',
        candidateId: 'profile-1',
        documentType: 'cover_letter' as const,
      }

      const result = await tailorEngine.tailorDocument(request)

      const content = result.content
      expect(content).toContain('Dear Hiring Manager,')
      expect(content).toContain('## Why I\'m a Great Fit')
      expect(content).toContain('## What I Bring to TechCorp')
      expect(content).toContain('Best regards,')
    })
  })
})

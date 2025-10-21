import { logger } from '@/lib/utils/logger'

// USAJOBS API integration
export interface USAJobsJob {
  id: string
  title: string
  organization: string
  location: string
  salaryMin?: number
  salaryMax?: number
  salaryBasis?: string
  workSchedule?: string
  positionType?: string
  description: string
  requirements: string
  qualifications: string
  url: string
  postedDate: string
  closingDate?: string
  department: string
  agency: string
}

export interface USAJobsSearchParams {
  keyword?: string
  location?: string
  organization?: string
  positionType?: string
  workSchedule?: string
  salaryMin?: number
  salaryMax?: number
  page?: number
  resultsPerPage?: number
}

export class USAJobsAPI {
  private baseUrl = 'https://data.usajobs.gov/api/search'
  private apiKey: string

  constructor(apiKey?: string) {
    this.apiKey = apiKey || process.env.USAJOBS_API_KEY || ''
  }

  async searchJobs(params: USAJobsSearchParams): Promise<USAJobsJob[]> {
    try {
      const searchParams = new URLSearchParams()
      
      if (params.keyword) searchParams.append('Keyword', params.keyword)
      if (params.location) searchParams.append('LocationName', params.location)
      if (params.organization) searchParams.append('Organization', params.organization)
      if (params.positionType) searchParams.append('PositionScheduleTypeCode', params.positionType)
      if (params.workSchedule) searchParams.append('WorkSchedule', params.workSchedule)
      if (params.salaryMin) searchParams.append('SalaryMinimum', params.salaryMin.toString())
      if (params.salaryMax) searchParams.append('SalaryMaximum', params.salaryMax.toString())
      
      searchParams.append('ResultsPerPage', (params.resultsPerPage || 25).toString())
      searchParams.append('Page', (params.page || 1).toString())

      const response = await fetch(`${this.baseUrl}?${searchParams.toString()}`, {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'ProofOfFit/1.0 (contact@proofoffit.com)',
          'Authorization-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`USAJOBS API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return this.transformJobs(data.SearchResult.SearchResultItems || [])
    } catch (error) {
      logger.error('USAJOBS API error:', error)
      return []
    }
  }

  private transformJobs(jobs: any[]): USAJobsJob[] {
    return jobs.map(job => {
      const jobData = job.MatchedObjectDescriptor
      const position = jobData.PositionTitle
      const organization = jobData.OrganizationName
      const location = jobData.PositionLocationDisplay
      const salary = jobData.PositionRemuneration?.[0]
      
      return {
        id: job.MatchedObjectId,
        title: position,
        organization: organization,
        location: location,
        salaryMin: salary?.MinimumRange,
        salaryMax: salary?.MaximumRange,
        salaryBasis: salary?.RateIntervalCode,
        workSchedule: jobData.PositionSchedule?.[0]?.Name,
        positionType: jobData.PositionOfferingType?.[0]?.Name,
        description: jobData.QualificationSummary || jobData.UserArea?.Details?.JobSummary || '',
        requirements: jobData.QualificationSummary || '',
        qualifications: jobData.QualificationSummary || '',
        url: jobData.ApplyURI?.[0] || `https://www.usajobs.gov/GetJob/ViewDetails/${job.MatchedObjectId}`,
        postedDate: jobData.PublicationStartDate,
        closingDate: jobData.ApplicationCloseDate,
        department: jobData.DepartmentName,
        agency: organization,
      }
    })
  }

  // Get job details by ID
  async getJobDetails(jobId: string): Promise<USAJobsJob | null> {
    try {
      const response = await fetch(`${this.baseUrl}/${jobId}`, {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'ProofOfFit/1.0 (contact@proofoffit.com)',
          'Authorization-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`USAJOBS API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      const jobs = this.transformJobs([data])
      return jobs[0] || null
    } catch (error) {
      console.error('USAJOBS API error:', error)
      return null
    }
  }

  // Get organizations list
  async getOrganizations(): Promise<string[]> {
    try {
      const response = await fetch('https://data.usajobs.gov/api/codelist/agencies', {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'ProofOfFit/1.0 (contact@proofoffit.com)',
          'Authorization-Key': this.apiKey,
        },
      })

      if (!response.ok) {
        throw new Error(`USAJOBS API error: ${response.status} ${response.statusText}`)
      }

      const data = await response.json()
      return data.CodeList?.[0]?.ValidValue?.map((item: any) => item.Value) || []
    } catch (error) {
      console.error('USAJOBS API error:', error)
      return []
    }
  }
}

// Mock data for development/testing
export const mockUSAJobsData: USAJobsJob[] = [
  {
    id: 'mock-1',
    title: 'Software Engineer',
    organization: 'Department of Defense',
    location: 'Washington, DC',
    salaryMin: 75000,
    salaryMax: 95000,
    salaryBasis: 'Per Year',
    workSchedule: 'Full-time',
    positionType: 'Permanent',
    description: 'Develop and maintain software systems for defense applications.',
    requirements: 'Bachelor\'s degree in Computer Science or related field. 3+ years experience.',
    qualifications: 'Experience with modern web technologies, databases, and cloud platforms.',
    url: 'https://www.usajobs.gov/GetJob/ViewDetails/mock-1',
    postedDate: '2024-01-15',
    closingDate: '2024-02-15',
    department: 'Department of Defense',
    agency: 'Department of Defense',
  },
  {
    id: 'mock-2',
    title: 'Data Analyst',
    organization: 'Department of Health and Human Services',
    location: 'Atlanta, GA',
    salaryMin: 65000,
    salaryMax: 85000,
    salaryBasis: 'Per Year',
    workSchedule: 'Full-time',
    positionType: 'Permanent',
    description: 'Analyze health data to support policy decisions and program evaluation.',
    requirements: 'Master\'s degree in Statistics, Economics, or related field. 2+ years experience.',
    qualifications: 'Proficiency in R, Python, SQL, and statistical analysis methods.',
    url: 'https://www.usajobs.gov/GetJob/ViewDetails/mock-2',
    postedDate: '2024-01-20',
    closingDate: '2024-02-20',
    department: 'Department of Health and Human Services',
    agency: 'Department of Health and Human Services',
  },
]

// Export singleton instance
export const usajobsAPI = new USAJobsAPI()

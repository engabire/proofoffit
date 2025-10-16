import { prisma } from '@/lib/db'

export interface JobFeedResult {
  jobs: any[]
  source: string
  fetchedAt: Date
  totalFound: number
}

export interface JobFeedConnector {
  name: string
  fetchJobs: (params: any) => Promise<JobFeedResult>
  normalizeJob: (rawJob: any) => any
}

// USAJOBS API connector
export class USAJobsConnector implements JobFeedConnector {
  name = 'usajobs'
  
  async fetchJobs(params: { keywords?: string; location?: string; limit?: number }): Promise<JobFeedResult> {
    const { keywords = '', location = '', limit = 50 } = params
    
    try {
      // USAJOBS API endpoint
      const apiUrl = new URL('https://data.usajobs.gov/api/search')
      apiUrl.searchParams.set('Keyword', keywords)
      apiUrl.searchParams.set('LocationName', location)
      apiUrl.searchParams.set('ResultsPerPage', limit.toString())
      
      const response = await fetch(apiUrl.toString(), {
        headers: {
          'Host': 'data.usajobs.gov',
          'User-Agent': 'ProofOfFit/1.0 (contact@proofoffit.com)',
          'Authorization-Key': process.env.USAJOBS_API_KEY || ''
        }
      })
      
      if (!response.ok) {
        throw new Error(`USAJOBS API error: ${response.status}`)
      }
      
      const data = await response.json()
      const jobs = data.SearchResult?.SearchResultItems?.map((item: any) => 
        this.normalizeJob(item.MatchedObjectDescriptor)
      ) || []
      
      return {
        jobs,
        source: 'usajobs',
        fetchedAt: new Date(),
        totalFound: data.SearchResult?.SearchResultCountAll || 0
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error fetching from USAJOBS:', error)
      return {
        jobs: [],
        source: 'usajobs',
        fetchedAt: new Date(),
        totalFound: 0
      }
    }
  }
  
  normalizeJob(rawJob: any): any {
    return {
      source: 'usajobs',
      org: rawJob.OrganizationName,
      title: rawJob.PositionTitle,
      location: rawJob.PositionLocationDisplay,
      workType: 'onsite', // Most government jobs are onsite
      pay: rawJob.PositionRemuneration ? {
        min: rawJob.PositionRemuneration[0]?.MinimumRange,
        max: rawJob.PositionRemuneration[0]?.MaximumRange,
        currency: 'USD'
      } : null,
      description: rawJob.QualificationSummary || rawJob.UserArea?.Details?.JobSummary,
      requirements: this.extractRequirements(rawJob.QualificationSummary),
      constraints: {
        clearance: rawJob.SecurityClearanceRequired,
        workAuth: 'citizen' // Government jobs typically require citizenship
      },
      tos: {
        allowed: true,
        captcha: false,
        notes: 'Government job - auto-apply allowed'
      },
      externalId: rawJob.PublicationStartDate,
      externalUrl: rawJob.ApplyURI?.[0]
    }
  }
  
  private extractRequirements(qualificationText: string): { must_have: string[], preferred: string[] } {
    if (!qualificationText) return { must_have: [], preferred: [] }
    
    const mustHave: string[] = []
    const preferred: string[] = []
    
    // Simple keyword extraction - could be enhanced with NLP
    const commonRequirements = [
      'bachelor', 'master', 'phd', 'degree', 'certification', 'license',
      'experience', 'years', 'skills', 'proficiency', 'knowledge'
    ]
    
    const sentences = qualificationText.split(/[.!?]+/).filter(s => s.trim())
    
    sentences.forEach(sentence => {
      const lowerSentence = sentence.toLowerCase()
      if (commonRequirements.some(req => lowerSentence.includes(req))) {
        if (lowerSentence.includes('preferred') || lowerSentence.includes('desired')) {
          preferred.push(sentence.trim())
        } else {
          mustHave.push(sentence.trim())
        }
      }
    })
    
    return { must_have: mustHave, preferred }
  }
}

// LinkedIn Jobs connector (simplified - would need proper API access)
export class LinkedInConnector implements JobFeedConnector {
  name = 'linkedin'
  
  async fetchJobs(params: { keywords?: string; location?: string; limit?: number }): Promise<JobFeedResult> {
    // This would require LinkedIn API access or web scraping
    // For now, return empty results
    return {
      jobs: [],
      source: 'linkedin',
      fetchedAt: new Date(),
      totalFound: 0
    }
  }
  
  normalizeJob(rawJob: any): any {
    return {
      source: 'linkedin',
      org: rawJob.company,
      title: rawJob.title,
      location: rawJob.location,
      workType: rawJob.workType || 'hybrid',
      pay: rawJob.salary,
      description: rawJob.description,
      requirements: rawJob.requirements || { must_have: [], preferred: [] },
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: 'LinkedIn job - requires manual application'
      },
      externalId: rawJob.id,
      externalUrl: rawJob.url
    }
  }
}

// Indeed connector (simplified)
export class IndeedConnector implements JobFeedConnector {
  name = 'indeed'
  
  async fetchJobs(params: { keywords?: string; location?: string; limit?: number }): Promise<JobFeedResult> {
    // This would require Indeed API access or web scraping
    // For now, return empty results
    return {
      jobs: [],
      source: 'indeed',
      fetchedAt: new Date(),
      totalFound: 0
    }
  }
  
  normalizeJob(rawJob: any): any {
    return {
      source: 'indeed',
      org: rawJob.company,
      title: rawJob.title,
      location: rawJob.location,
      workType: rawJob.workType || 'hybrid',
      pay: rawJob.salary,
      description: rawJob.description,
      requirements: rawJob.requirements || { must_have: [], preferred: [] },
      constraints: {},
      tos: {
        allowed: false,
        captcha: true,
        notes: 'Indeed job - requires manual application'
      },
      externalId: rawJob.id,
      externalUrl: rawJob.url
    }
  }
}

// Job feed manager
export class JobFeedManager {
  private connectors: JobFeedConnector[] = [
    new USAJobsConnector(),
    new LinkedInConnector(),
    new IndeedConnector()
  ]
  
  async fetchAllJobs(params: { keywords?: string; location?: string; limit?: number }): Promise<JobFeedResult[]> {
    const results = await Promise.allSettled(
      this.connectors.map(connector => connector.fetchJobs(params))
    )
    
    return results
      .filter((result): result is PromiseFulfilledResult<JobFeedResult> => 
        result.status === 'fulfilled'
      )
      .map(result => result.value)
  }
  
  async saveJobsToDatabase(jobResults: JobFeedResult[]): Promise<void> {
    const allJobs = jobResults.flatMap(result => result.jobs)
    
    for (const job of allJobs) {
      try {
        const jobId = `${job.source}-${job.title}-${job.org}`.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase()

        await prisma.job.upsert({
          where: {
            // Use a combination of source, title, and org as unique identifier
            id: jobId,
          },
          update: {
            description: job.description,
            requirements: job.requirements,
            constraints: job.constraints,
            tos: job.tos,
            fetchedAt: new Date()
          },
          create: {
            id: jobId,
            source: job.source,
            org: job.org,
            title: job.title,
            location: job.location,
            workType: job.workType,
            pay: job.pay,
            description: job.description,
            requirements: job.requirements,
            constraints: job.constraints,
            tos: job.tos,
            fetchedAt: new Date()
          }
        })
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error saving job:', error)
      }
    }
  }
  
  async refreshJobFeeds(): Promise<void> {
    // eslint-disable-next-line no-console
    console.log('Starting job feed refresh...')
    
    const commonSearches = [
      { keywords: 'software engineer', location: '' },
      { keywords: 'data analyst', location: '' },
      { keywords: 'project manager', location: '' },
      { keywords: 'marketing manager', location: '' },
      { keywords: 'product manager', location: '' }
    ]
    
    for (const search of commonSearches) {
      try {
        const results = await this.fetchAllJobs(search)
        await this.saveJobsToDatabase(results)
        // eslint-disable-next-line no-console
        console.log(`Fetched ${results.reduce((sum, r) => sum + r.jobs.length, 0)} jobs for "${search.keywords}"`)
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error(`Error fetching jobs for "${search.keywords}":`, error)
      }
    }
    
    // eslint-disable-next-line no-console
    
    // eslint-disable-next-line no-console
    console.log('Job feed refresh completed')
  }
}

export const jobFeedManager = new JobFeedManager()

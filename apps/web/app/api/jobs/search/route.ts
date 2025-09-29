import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/env'
import { jobSearchService } from '@/lib/job-search'
import { usajobsAPI, USAJobsSearchParams } from '@/lib/job-feeds/usajobs'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const workType = searchParams.get('workType') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Try USAJOBS API first for government jobs
    if (query.trim()) {
      try {
        console.log('Searching USAJOBS API...')
        const searchParams: USAJobsSearchParams = {
          keyword: query,
          location: location,
          page: 1,
          resultsPerPage: limit,
        }

        const usajobsResults = await usajobsAPI.searchJobs(searchParams)
        
        if (usajobsResults.length > 0) {
          // Transform USAJOBS data to our format
          const transformedJobs = usajobsResults.map(job => ({
            id: job.id,
            title: job.title,
            company: job.organization,
            location: job.location,
            type: 'full-time',
            remote: false,
            salary: job.salaryMin && job.salaryMax ? {
              min: job.salaryMin,
              max: job.salaryMax,
              currency: 'USD'
            } : undefined,
            description: job.description,
            requirements: job.requirements ? [job.requirements] : [],
            niceToHaves: [],
            benefits: ['Government benefits', 'Retirement plan', 'Health insurance'],
            postedAt: new Date(job.postedDate),
            companyLogo: undefined,
            companySize: '1000+',
            industry: 'Government',
            experienceLevel: 'mid',
            source: 'USAJOBS',
            constraints: {},
            tos: { allowed: true, captcha: false, notes: 'Government position - auto-apply eligible' },
            url: job.url,
            applyUrl: job.url,
            department: job.department,
            agency: job.agency,
            workSchedule: job.workSchedule,
            positionType: job.positionType,
            closingDate: job.closingDate
          }))

          return NextResponse.json({
            jobs: transformedJobs,
            total: transformedJobs.length,
            hasMore: false,
            source: 'usajobs'
          })
        }
      } catch (usajobsError) {
        console.error('USAJOBS API failed, trying enhanced search:', usajobsError)
      }
    }

    // Try enhanced job search as fallback
    if (query.trim()) {
      try {
        console.log('Using enhanced job search service...')
        const enhancedJobs = await jobSearchService.searchJobs({
          query,
          location,
          remote: workType === 'remote',
          limit,
          experienceLevel: 'mid',
          jobType: 'full-time'
        })

        if (enhancedJobs.length > 0) {
          // Transform enhanced jobs to match expected format
          const transformedJobs = enhancedJobs.map(job => ({
            id: job.id,
            title: job.title,
            company: job.company,
            location: job.location,
            type: job.employmentType || 'full-time',
            remote: job.isRemote,
            salary: job.salary ? {
              min: job.salaryMin || 0,
              max: job.salaryMax || 0,
              currency: 'USD'
            } : undefined,
            description: job.description,
            requirements: job.skills || [],
            niceToHaves: [],
            benefits: job.benefits || [],
            postedAt: job.postedDate,
            companyLogo: undefined,
            companySize: job.companySize,
            industry: job.industry,
            experienceLevel: job.experienceLevel || 'mid',
            source: job.source,
            constraints: {},
            tos: { allowed: job.source === 'governmentjobs', captcha: false, notes: `${job.source} job posting` },
            url: job.url,
            applyUrl: job.applyUrl
          }))

          return NextResponse.json({
            jobs: transformedJobs,
            total: transformedJobs.length,
            hasMore: false,
            source: 'enhanced'
          })
        }
      } catch (enhancedError) {
        console.error('Enhanced job search failed, falling back:', enhancedError)
      }
    }

    // Fallback to Supabase or mock data
    if (!isSupabaseConfigured() || !supabaseAdmin) {
      return NextResponse.json({
        jobs: getMockJobs(query, location, workType, limit),
        total: 6,
        hasMore: false,
        source: 'mock'
      })
    }

    // Build Supabase query
    let supabaseQuery = supabaseAdmin
      .from('jobs')
      .select('*')
      .order('createdAt', { ascending: false })
      .range(offset, offset + limit - 1)

    // Add text search filters
    if (query.trim()) {
      supabaseQuery = supabaseQuery.or(`title.ilike.%${query}%,org.ilike.%${query}%,location.ilike.%${query}%,description.ilike.%${query}%`)
    }

    // Location filter
    if (location.trim()) {
      supabaseQuery = supabaseQuery.ilike('location', `%${location}%`)
    }

    // Work type filter
    if (workType && workType !== 'all') {
      supabaseQuery = supabaseQuery.eq('workType', workType)
    }

    // Execute query
    const { data: jobs, error } = await supabaseQuery

    if (error) {
      console.error('Supabase query error:', error)
      // Fallback to mock data
      return NextResponse.json({
        jobs: getMockJobs(query, location, workType, limit),
        total: 6,
        hasMore: false,
        source: 'mock'
      })
    }

    // Transform to match the expected format
    const transformedJobs = jobs.map(job => ({
      id: job.id,
      title: job.title,
      company: job.org,
      location: job.location,
      type: job.workType === 'remote' ? 'full-time' : 'full-time',
      remote: job.workType === 'remote',
      salary: job.pay ? {
        min: job.pay.min || 0,
        max: job.pay.max || 0,
        currency: job.pay.currency || 'USD'
      } : undefined,
      description: job.description,
      requirements: job.requirements?.must_have || [],
      niceToHaves: job.requirements?.preferred || [],
      benefits: [], // Could be added to schema later
      postedAt: new Date(job.fetchedAt || job.createdAt),
      companyLogo: undefined,
      companySize: undefined,
      industry: undefined,
      experienceLevel: 'mid', // Could be determined from requirements
      source: job.source,
      constraints: job.constraints,
      tos: job.tos
    }))

    return NextResponse.json({
      jobs: transformedJobs,
      total: transformedJobs.length,
      hasMore: transformedJobs.length === limit,
      source: 'supabase'
    })

  } catch (error) {
    console.error('Error searching jobs:', error)
    // Fallback to mock data on any error
    return NextResponse.json({
      jobs: getMockJobs('', '', '', 20),
      total: 6,
      hasMore: false,
      source: 'mock'
    })
  }
}

// POST endpoint to add jobs from external sources
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { jobs } = body

    if (!Array.isArray(jobs)) {
      return NextResponse.json(
        { error: 'Jobs must be an array' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      message: 'Jobs would be created successfully',
      jobs: jobs
    })

  } catch (error) {
    console.error('Error creating jobs:', error)
    return NextResponse.json(
      { error: 'Failed to create jobs' },
      { status: 500 }
    )
  }
}

// Mock jobs data for fallback
function getMockJobs(query: string, location: string, workType: string, limit: number) {
  const mockJobs = [
    {
      id: '1',
      title: 'Data Analyst',
      company: 'Metropolitan Council',
      location: 'Minneapolis, MN',
      type: 'full-time',
      remote: false,
      salary: { min: 65000, max: 85000, currency: 'USD' },
      description: 'Analyze transportation data to support regional planning decisions. Work with large datasets and create visualizations for policy makers.',
      requirements: ['Bachelor\'s degree in Data Science or related field', '3+ years experience with SQL and Python', 'Experience with data visualization tools'],
      niceToHaves: ['Master\'s degree', 'Experience with transportation planning', 'Knowledge of GIS systems'],
      benefits: ['Health insurance', 'Retirement plan', 'Flexible schedule'],
      postedAt: new Date('2024-01-15'),
      companyLogo: undefined,
      companySize: '1000-5000',
      industry: 'Government',
      experienceLevel: 'mid',
      source: 'USAJOBS',
      constraints: {},
      tos: { allowed: true, captcha: false, notes: 'Government position - auto-apply eligible' }
    },
    {
      id: '2',
      title: 'Project Manager',
      company: 'Metropolitan Council',
      location: 'St. Paul, MN',
      type: 'full-time',
      remote: false,
      salary: { min: 70000, max: 95000, currency: 'USD' },
      description: 'Lead infrastructure projects for regional development. Coordinate with multiple stakeholders and ensure project delivery on time and budget.',
      requirements: ['Bachelor\'s degree in Engineering or Project Management', '5+ years project management experience', 'PMP certification preferred'],
      niceToHaves: ['Experience with government contracts', 'Knowledge of environmental regulations', 'Strong communication skills'],
      benefits: ['Health insurance', 'Retirement plan', 'Professional development'],
      postedAt: new Date('2024-01-10'),
      companyLogo: undefined,
      companySize: '1000-5000',
      industry: 'Government',
      experienceLevel: 'senior',
      source: 'USAJOBS',
      constraints: {},
      tos: { allowed: true, captcha: false, notes: 'Government position - auto-apply eligible' }
    },
    {
      id: '3',
      title: 'Software Engineer',
      company: 'TechCorp Solutions',
      location: 'San Francisco, CA',
      type: 'full-time',
      remote: true,
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'Build scalable web applications using modern technologies. Work with a talented team to deliver high-quality software solutions.',
      requirements: ['Bachelor\'s degree in Computer Science', '3+ years experience with React and Node.js', 'Experience with cloud platforms'],
      niceToHaves: ['TypeScript experience', 'DevOps knowledge', 'Open source contributions'],
      benefits: ['Health insurance', 'Stock options', 'Remote work', 'Learning budget'],
      postedAt: new Date('2024-01-20'),
      companyLogo: undefined,
      companySize: '100-500',
      industry: 'Technology',
      experienceLevel: 'mid',
      source: 'LinkedIn',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'Requires manual application' }
    },
    {
      id: '4',
      title: 'Marketing Manager',
      company: 'GrowthCo',
      location: 'New York, NY',
      type: 'full-time',
      remote: false,
      salary: { min: 80000, max: 120000, currency: 'USD' },
      description: 'Develop and execute marketing strategies to drive business growth. Lead a team of marketing professionals and manage campaigns across multiple channels.',
      requirements: ['Bachelor\'s degree in Marketing or related field', '5+ years marketing experience', 'Experience with digital marketing tools'],
      niceToHaves: ['MBA', 'Experience with B2B marketing', 'Analytics expertise'],
      benefits: ['Health insurance', '401k', 'Flexible PTO'],
      postedAt: new Date('2024-01-18'),
      companyLogo: undefined,
      companySize: '50-200',
      industry: 'Marketing',
      experienceLevel: 'senior',
      source: 'Indeed',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'Requires manual application' }
    },
    {
      id: '5',
      title: 'UX Designer',
      company: 'DesignStudio',
      location: 'Austin, TX',
      type: 'full-time',
      remote: true,
      salary: { min: 75000, max: 110000, currency: 'USD' },
      description: 'Create intuitive user experiences for web and mobile applications. Conduct user research and collaborate with development teams.',
      requirements: ['Bachelor\'s degree in Design or related field', '3+ years UX design experience', 'Proficiency in Figma and Adobe Creative Suite'],
      niceToHaves: ['Experience with user research', 'Knowledge of front-end development', 'Portfolio of successful projects'],
      benefits: ['Health insurance', 'Remote work', 'Design tools budget'],
      postedAt: new Date('2024-01-22'),
      companyLogo: undefined,
      companySize: '20-100',
      industry: 'Design',
      experienceLevel: 'mid',
      source: 'LinkedIn',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'Requires manual application' }
    },
    {
      id: '6',
      title: 'Data Scientist',
      company: 'AnalyticsPro',
      location: 'Seattle, WA',
      type: 'full-time',
      remote: true,
      salary: { min: 100000, max: 150000, currency: 'USD' },
      description: 'Apply machine learning and statistical analysis to solve complex business problems. Work with large datasets and build predictive models.',
      requirements: ['Master\'s degree in Data Science or related field', '3+ years experience with Python and R', 'Experience with machine learning frameworks'],
      niceToHaves: ['PhD', 'Experience with deep learning', 'Knowledge of cloud platforms'],
      benefits: ['Health insurance', 'Stock options', 'Conference budget'],
      postedAt: new Date('2024-01-25'),
      companyLogo: undefined,
      companySize: '100-500',
      industry: 'Technology',
      experienceLevel: 'senior',
      source: 'Indeed',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'Requires manual application' }
    }
  ]

  // Filter jobs based on search criteria
  let filteredJobs = mockJobs

  if (query.trim()) {
    const searchTerm = query.toLowerCase()
    filteredJobs = filteredJobs.filter(job => 
      job.title.toLowerCase().includes(searchTerm) ||
      job.company.toLowerCase().includes(searchTerm) ||
      job.location.toLowerCase().includes(searchTerm) ||
      job.description.toLowerCase().includes(searchTerm) ||
      job.requirements.some(req => req.toLowerCase().includes(searchTerm))
    )
  }

  if (location.trim()) {
    const locationTerm = location.toLowerCase()
    filteredJobs = filteredJobs.filter(job => 
      job.location.toLowerCase().includes(locationTerm)
    )
  }

  if (workType && workType !== 'all') {
    filteredJobs = filteredJobs.filter(job => 
      workType === 'remote' ? job.remote : !job.remote
    )
  }

  return filteredJobs.slice(0, limit)
}

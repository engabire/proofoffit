import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isSupabaseConfigured } from '@/lib/env'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const workType = searchParams.get('workType') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!isSupabaseConfigured() || !supabaseAdmin) {
      // Return mock data if Supabase is not configured
      return NextResponse.json({
        jobs: getMockJobs(query, location, workType, limit),
        total: 6,
        hasMore: false
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
        hasMore: false
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
      hasMore: transformedJobs.length === limit
    })

  } catch (error) {
    console.error('Error searching jobs:', error)
    // Fallback to mock data on any error
    return NextResponse.json({
      jobs: getMockJobs('', '', '', 20),
      total: 6,
      hasMore: false
    })
  }
}

// Mock jobs function for fallback
function getMockJobs(query: string, location: string, workType: string, limit: number) {
  const mockJobs = [
    {
      id: '1',
      title: 'Senior Software Engineer',
      company: 'TechCorp',
      location: 'San Francisco, CA',
      type: 'full-time',
      remote: true,
      salary: { min: 120000, max: 180000, currency: 'USD' },
      description: 'We are looking for a senior software engineer to join our team...',
      requirements: ['Python', 'React', 'Cloud', '5+ years experience'],
      niceToHaves: ['TypeScript', 'AWS', 'Docker'],
      benefits: ['Health insurance', '401k', 'Flexible hours'],
      postedAt: new Date('2024-01-15'),
      companyLogo: undefined,
      companySize: '100-500',
      industry: 'Technology',
      experienceLevel: 'senior',
      source: 'usajobs',
      constraints: {},
      tos: { allowed: true, captcha: false, notes: 'Government job - auto-apply allowed' }
    },
    {
      id: '2',
      title: 'Data Analyst',
      company: 'Metropolitan Council',
      location: 'Minneapolis, MN',
      type: 'full-time',
      remote: false,
      salary: { min: 65000, max: 85000, currency: 'USD' },
      description: 'The Metropolitan Council is seeking a Data Analyst to support regional planning and policy development...',
      requirements: ['SQL', 'Excel', 'Data visualization', 'Statistics'],
      niceToHaves: ['Python', 'R', 'Tableau'],
      benefits: ['Pension', 'Health insurance', 'Professional development'],
      postedAt: new Date('2024-01-20'),
      companyLogo: undefined,
      companySize: '500+',
      industry: 'Government',
      experienceLevel: 'mid',
      source: 'usajobs',
      constraints: { workAuth: 'citizen' },
      tos: { allowed: true, captcha: false, notes: 'Government job - auto-apply allowed' }
    },
    {
      id: '3',
      title: 'Project Manager',
      company: 'Metropolitan Council',
      location: 'St. Paul, MN',
      type: 'full-time',
      remote: true,
      salary: { min: 75000, max: 95000, currency: 'USD' },
      description: 'Lead transportation and infrastructure projects for the Metropolitan Council...',
      requirements: ['Project management', 'Communication', 'Budget management', 'PMP certification preferred'],
      niceToHaves: ['Agile', 'Scrum', 'Government experience'],
      benefits: ['Pension', 'Health insurance', 'Flexible schedule'],
      postedAt: new Date('2024-01-18'),
      companyLogo: undefined,
      companySize: '500+',
      industry: 'Government',
      experienceLevel: 'senior',
      source: 'usajobs',
      constraints: { workAuth: 'citizen' },
      tos: { allowed: true, captcha: false, notes: 'Government job - auto-apply allowed' }
    },
    {
      id: '4',
      title: 'Frontend Developer',
      company: 'InnovateTech',
      location: 'Austin, TX',
      type: 'full-time',
      remote: true,
      salary: { min: 90000, max: 130000, currency: 'USD' },
      description: 'Build amazing user experiences with modern web technologies...',
      requirements: ['React', 'TypeScript', 'CSS', '3+ years experience'],
      niceToHaves: ['Next.js', 'Tailwind', 'GraphQL'],
      benefits: ['Health insurance', '401k', 'Stock options'],
      postedAt: new Date('2024-01-12'),
      companyLogo: undefined,
      companySize: '50-200',
      industry: 'Technology',
      experienceLevel: 'mid',
      source: 'linkedin',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'LinkedIn job - requires manual application' }
    },
    {
      id: '5',
      title: 'Marketing Manager',
      company: 'GrowthCorp',
      location: 'New York, NY',
      type: 'full-time',
      remote: false,
      salary: { min: 70000, max: 100000, currency: 'USD' },
      description: 'Drive marketing strategy and campaigns for our growing company...',
      requirements: ['Digital marketing', 'Analytics', 'Content creation', 'Team leadership'],
      niceToHaves: ['SEO', 'Social media', 'Email marketing'],
      benefits: ['Health insurance', '401k', 'Unlimited PTO'],
      postedAt: new Date('2024-01-08'),
      companyLogo: undefined,
      companySize: '100-500',
      industry: 'Marketing',
      experienceLevel: 'senior',
      source: 'indeed',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'Indeed job - requires manual application' }
    },
    {
      id: '6',
      title: 'Full Stack Developer',
      company: 'StartupXYZ',
      location: 'Remote',
      type: 'full-time',
      remote: true,
      salary: { min: 80000, max: 120000, currency: 'USD' },
      description: 'Join our fast-growing startup as a full stack developer...',
      requirements: ['JavaScript', 'Node.js', 'React', 'MongoDB'],
      niceToHaves: ['GraphQL', 'Docker', 'AWS'],
      benefits: ['Equity', 'Remote work', 'Learning budget'],
      postedAt: new Date('2024-01-10'),
      companyLogo: undefined,
      companySize: '10-50',
      industry: 'Technology',
      experienceLevel: 'mid',
      source: 'linkedin',
      constraints: {},
      tos: { allowed: false, captcha: true, notes: 'LinkedIn job - requires manual application' }
    }
  ]

  // Filter mock jobs based on search criteria
  let filteredJobs = mockJobs

  if (query.trim()) {
    const searchLower = query.toLowerCase()
    filteredJobs = filteredJobs.filter(job =>
      job.title.toLowerCase().includes(searchLower) ||
      job.company.toLowerCase().includes(searchLower) ||
      job.location.toLowerCase().includes(searchLower) ||
      job.description.toLowerCase().includes(searchLower) ||
      job.requirements.some(req => req.toLowerCase().includes(searchLower))
    )
  }

  if (location.trim()) {
    const locationLower = location.toLowerCase()
    filteredJobs = filteredJobs.filter(job =>
      job.location.toLowerCase().includes(locationLower)
    )
  }

  if (workType && workType !== 'all') {
    filteredJobs = filteredJobs.filter(job =>
      job.remote === (workType === 'remote')
    )
  }

  return filteredJobs.slice(0, limit)
}

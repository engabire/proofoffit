import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get('q') || ''
    const location = searchParams.get('location') || ''
    const workType = searchParams.get('workType') || ''
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Build search conditions
    const whereConditions: any = {
      // Add any additional filters here
    }

    // Text search across multiple fields
    if (query.trim()) {
      whereConditions.OR = [
        { title: { contains: query, mode: 'insensitive' } },
        { org: { contains: query, mode: 'insensitive' } },
        { location: { contains: query, mode: 'insensitive' } },
        { description: { contains: query, mode: 'insensitive' } }
      ]
    }

    // Location filter
    if (location.trim()) {
      whereConditions.location = { contains: location, mode: 'insensitive' }
    }

    // Work type filter
    if (workType && workType !== 'all') {
      whereConditions.workType = workType
    }

    // Search jobs from database
    const jobs = await prisma.job.findMany({
      where: whereConditions,
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset,
      include: {
        employerIntakes: {
          select: {
            id: true,
            mustHave: true,
            preferred: true,
            weights: true
          }
        }
      }
    })

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
      postedAt: job.fetchedAt,
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
    return NextResponse.json(
      { error: 'Failed to search jobs' },
      { status: 500 }
    )
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

    // Insert jobs into database
    const createdJobs = await Promise.all(
      jobs.map(async (jobData: any) => {
        return await prisma.job.create({
          data: {
            source: jobData.source || 'manual',
            org: jobData.company || jobData.org,
            title: jobData.title,
            location: jobData.location,
            workType: jobData.workType || (jobData.remote ? 'remote' : 'hybrid'),
            pay: jobData.salary ? {
              min: jobData.salary.min,
              max: jobData.salary.max,
              currency: jobData.salary.currency || 'USD'
            } : null,
            description: jobData.description,
            requirements: {
              must_have: jobData.requirements || [],
              preferred: jobData.niceToHaves || []
            },
            constraints: jobData.constraints || {},
            tos: jobData.tos || { allowed: true, captcha: false, notes: 'Manual entry' },
            fetchedAt: new Date()
          }
        })
      })
    )

    return NextResponse.json({
      message: 'Jobs created successfully',
      jobs: createdJobs
    })

  } catch (error) {
    console.error('Error creating jobs:', error)
    return NextResponse.json(
      { error: 'Failed to create jobs' },
      { status: 500 }
    )
  }
}

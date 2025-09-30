import { NextRequest, NextResponse } from 'next/server'
import { aiMatchingEngine } from '@/lib/ai/matching-engine'

export const dynamic = 'force-dynamic'
export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'AI matching not configured' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type') // 'job' or 'candidate'
    const id = searchParams.get('id')
    const limit = parseInt(searchParams.get('limit') || '10')

    if (!type || !id) {
      return NextResponse.json(
        { error: 'Type and ID are required' },
        { status: 400 }
      )
    }

    let matches

    if (type === 'job') {
      matches = await aiMatchingEngine.findBestMatchesForJob(id, limit)
    } else if (type === 'candidate') {
      matches = await aiMatchingEngine.findBestJobsForCandidate(id, limit)
    } else {
      return NextResponse.json(
        { error: 'Invalid type. Must be "job" or "candidate"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      matches,
      total: matches.length,
      type,
      id
    })

  } catch (error: any) {
    console.error('AI matching error:', error)
    return NextResponse.json(
      { error: 'Failed to find matches' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json({ error: 'AI matching not configured' }, { status: 503 })
    }

    const body = await request.json()
    const { candidate, job } = body

    if (!candidate || !job) {
      return NextResponse.json(
        { error: 'Candidate and job data are required' },
        { status: 400 }
      )
    }

    const match = await aiMatchingEngine.calculateFitScore(candidate, job)

    return NextResponse.json({
      match,
      success: true
    })

  } catch (error: any) {
    console.error('AI matching calculation error:', error)
    return NextResponse.json(
      { error: 'Failed to calculate match' },
      { status: 500 }
    )
  }
}

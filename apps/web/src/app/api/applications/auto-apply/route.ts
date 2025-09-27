import { NextRequest, NextResponse } from 'next/server'
import { applicationAutomation } from '@/lib/application-automation/auto-apply'
import { createClient } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Get auto-apply configuration
    const config = await applicationAutomation.getAutoApplyConfig(userId)
    
    if (!config) {
      return NextResponse.json({
        config: null,
        message: 'No auto-apply configuration found'
      })
    }

    // Get application statistics
    const stats = await applicationAutomation.getApplicationStats(userId)

    return NextResponse.json({
      config,
      stats
    })

  } catch (error: any) {
    console.error('Auto-apply GET error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch auto-apply data' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, userId, config, jobId } = body

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    switch (action) {
      case 'update_config':
        if (!config) {
          return NextResponse.json(
            { error: 'Configuration is required' },
            { status: 400 }
          )
        }

        const success = await applicationAutomation.updateAutoApplyConfig(config)
        
        if (!success) {
          return NextResponse.json(
            { error: 'Failed to update configuration' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          message: 'Auto-apply configuration updated successfully'
        })

      case 'apply_to_job':
        if (!jobId) {
          return NextResponse.json(
            { error: 'Job ID is required' },
            { status: 400 }
          )
        }

        // Get user's auto-apply configuration
        const userConfig = await applicationAutomation.getAutoApplyConfig(userId)
        
        if (!userConfig) {
          return NextResponse.json(
            { error: 'Auto-apply configuration not found' },
            { status: 404 }
          )
        }

        // Get job details (this would come from your job search API)
        const jobResponse = await fetch(`${request.nextUrl.origin}/api/jobs/search?q=${jobId}`)
        const jobData = await jobResponse.json()
        
        if (!jobData.jobs || jobData.jobs.length === 0) {
          return NextResponse.json(
            { error: 'Job not found' },
            { status: 404 }
          )
        }

        const job = jobData.jobs[0]

        // Check if job matches auto-apply criteria
        const shouldApply = await applicationAutomation.shouldAutoApply(job, userConfig)
        
        if (!shouldApply) {
          return NextResponse.json({
            success: false,
            message: 'Job does not match auto-apply criteria'
          })
        }

        // Apply to the job
        const application = await applicationAutomation.autoApplyToJob(job, userConfig)
        
        if (!application) {
          return NextResponse.json(
            { error: 'Failed to apply to job' },
            { status: 500 }
          )
        }

        return NextResponse.json({
          success: true,
          application,
          message: 'Successfully applied to job'
        })

      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        )
    }

  } catch (error: any) {
    console.error('Auto-apply POST error:', error)
    return NextResponse.json(
      { error: 'Failed to process auto-apply request' },
      { status: 500 }
    )
  }
}
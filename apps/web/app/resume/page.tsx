'use client'

import { Suspense } from 'react'
import ResumeFormBeauty from '@/components/resume/resume-form-beauty'

// Force dynamic rendering to prevent SSR issues with localStorage
export const dynamic = 'force-dynamic'

export default function ResumePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading resume builder...</p>
        </div>
      </div>
    }>
      <ResumeFormBeauty />
    </Suspense>
  )
}

import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Plus, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'
import { ProfilePhotoCard } from '@/components/candidate/profile-photo-card'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function CandidateProfilePage() {
  // Temporarily disabled for deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Candidate Profile</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

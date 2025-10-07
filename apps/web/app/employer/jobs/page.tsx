import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { 
  Search,
  Filter,
  Plus,
  Eye,
  Edit,
  Trash2,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Clock,
  MapPin,
  Building2,
  DollarSign,
  Calendar
} from 'lucide-react'
import Link from 'next/link'
import { isSupabaseConfigured } from '@/lib/env'

type JobRecord = {
  id: string
  source: string
  org: string
  title: string
  location: string
  workType: string
  pay: { min?: number; max?: number; currency?: string } | null
  description: string
  requirements: { must_have?: string[]; preferred?: string[] } | null
  constraints: Record<string, unknown> | null
  tos: { allowed?: boolean; captcha?: boolean } | null
  createdAt: string
  fetchedAt?: string | null
}

// Force dynamic rendering
export const dynamic = 'force-dynamic'

export default async function JobsPage() {
  // Temporarily disabled for deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Employer Jobs</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { QuickActions } from '@/components/dashboard/quick-actions'
import Link from 'next/link'
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Users, Briefcase, TrendingUp, FileText, Target, Megaphone, Clock3, Sparkles, GraduationCap, HelpingHand } from 'lucide-react'

// Force dynamic rendering to prevent build-time data collection
export const dynamic = 'force-dynamic'

export default async function DashboardPage() {
  // Temporarily disabled for deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

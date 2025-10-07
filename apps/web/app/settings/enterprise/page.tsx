import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Button } from '@proof-of-fit/ui'
import { Switch } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Separator } from '@proof-of-fit/ui'
import { 
  Building2, 
  Shield, 
  Users, 
  Settings, 
  CheckCircle, 
  AlertCircle,
  Key,
  Globe,
  Lock,
  Eye,
  EyeOff
} from 'lucide-react'
import { detectEnterpriseDomain, getEnterpriseBranding } from '@/lib/enterprise-domains'
import { isSupabaseConfigured } from '@/lib/env'

export const dynamic = 'force-dynamic'

export default async function EnterpriseSettingsPage() {
  // Temporarily disabled for deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Enterprise Settings</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

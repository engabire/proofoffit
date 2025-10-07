import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@proof-of-fit/ui'
import { CheckCircle, Gift, Share2, Calendar, Download, ExternalLink, Users, Trophy, Sparkles } from 'lucide-react'
import GiftCodeClipboard from './use-copy'
import { PageNav } from '@/components/system/page-nav'
import ShareGiftButtons from './share-gift'

interface GiftSuccessPageProps {
  searchParams: Promise<{
    code?: string
    months?: string
  }>
}

export default async function GiftSuccessPage({ searchParams }: GiftSuccessPageProps) {
  // Temporarily disable this page to fix deployment
  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      <h1 className="text-3xl font-bold">Gift Success Page</h1>
      <p>This page is temporarily disabled for deployment.</p>
    </div>
  )
}

// Original page code temporarily disabled for deployment
// TODO: Re-enable after fixing displayName issues

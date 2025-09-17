import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button } from '@proof-of-fit/ui'
import { CheckCircle, Gift } from 'lucide-react'
import GiftCodeClipboard from './use-copy'
import { PageNav } from '@/components/system/page-nav'

interface GiftSuccessPageProps {
  searchParams: {
    code?: string
    months?: string
  }
}

export default function GiftSuccessPage({ searchParams }: GiftSuccessPageProps) {
  const code = searchParams.code ?? ''
  const months = Number.parseInt(searchParams.months || '0', 10)

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl flex-col gap-8 px-4 py-16">
      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <CheckCircle className="h-8 w-8 text-emerald-500" />
            <div>
              <CardTitle>Gift checkout complete</CardTitle>
              <CardDescription>We emailed your receipt and gift code. Share it with your candidate when you’re ready.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {code ? (
            <GiftCodeClipboard code={code} months={months} />
          ) : (
            <p className="text-sm text-muted-foreground">We couldn’t detect a gift code in this link, but your email receipt includes it. Reach out if you need support.</p>
          )}

          <div className="rounded-md border border-dashed p-4 text-sm text-muted-foreground">
            <p><strong>No card needed to redeem.</strong> Recipients can unlock their sponsored months from the dashboard without storing payment details.</p>
            <p className="mt-2">We never auto-charge after a gift ends. They can manually renew if they’d like to continue.</p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <Button asChild>
              <Link href="/gift">
                <Gift className="mr-2 h-4 w-4" /> Send another gift
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      <PageNav prev={{ href: '/gift', label: 'Gift' }} next={{ href: '/', label: 'Home' }} />
    </div>
  )
}

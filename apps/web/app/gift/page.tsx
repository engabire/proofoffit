"use client";
import { Metadata } from 'next'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Alert, AlertDescription, AlertTitle } from '@proof-of-fit/ui'
import { Check, Gift, Shield } from 'lucide-react'
import { isStripeConfigured } from '@/lib/env'
import GiftCheckoutForm from './gift-checkout-form'
import { PageNav } from '@/components/system/page-nav'

export const metadata: Metadata = {
  title: 'Sponsor ProofOfFit Pro',
  description: 'Gift months of ProofOfFit Pro to support a job seeker.',
}

const reassuranceCopy = [
  'No card required when redeeming a gift.',
  'Sponsored months include all Pro features.',
  'We’ll never auto-charge when a gift ends—renew manually.',
]

export default function GiftPage() {
  const configured = isStripeConfigured()

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-6 py-10">
      <Card>
        <CardHeader className="flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <Gift className="h-8 w-8 text-primary" />
            <div>
              <CardTitle>Sponsor a month of ProofOfFit Pro</CardTitle>
              <CardDescription>
                Every $12 gift unlocks premium tools for a candidate actively searching.
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-3">
            {reassuranceCopy.map(line => (
              <div key={line} className="flex items-start gap-2 text-sm text-muted-foreground">
                <Shield className="mt-1 h-4 w-4 text-primary" />
                <span>{line}</span>
              </div>
            ))}
          </div>

          {configured ? (
            <GiftCheckoutForm />
          ) : (
            <Alert variant="destructive">
              <AlertTitle>Payments not configured</AlertTitle>
              <AlertDescription>
                Stripe credentials are missing. Once configured, sponsors can purchase gift codes securely.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>How gifting works</CardTitle>
          <CardDescription>Simple steps to share access responsibly.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <ul className="space-y-2">
            <li className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 text-primary" />
              <span>Buy up to six months at $12/month and optionally pre-address the gift.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 text-primary" />
              <span>We email the unique code to you (and the recipient, if provided) after checkout.</span>
            </li>
            <li className="flex items-start gap-2">
              <Check className="mt-1 h-4 w-4 text-primary" />
              <span>Recipients redeem server-side—codes expire after 12 months and can’t be stockpiled.</span>
            </li>
          </ul>
        </CardContent>
      </Card>

      <PageNav
        prev={{ href: '/', label: 'Home' }}
        next={{ href: '/gift/success', label: 'Gift Success' }}
      />
    </div>
  )
}

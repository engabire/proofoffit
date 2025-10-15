import Link from 'next/link'

type RevalidationBannerProps = {
  daysRemaining: number
  organizationName?: string
}

export function RevalidationBanner({ daysRemaining, organizationName }: RevalidationBannerProps) {
  if (daysRemaining > 60) {
    return null
  }

  const severity =
    daysRemaining <= 15
      ? 'border-red-500 bg-red-500/10 text-red-600'
      : 'border-amber-500 bg-amber-500/10 text-amber-700'

  return (
    <div className={`flex flex-col gap-3 rounded-md border p-4 text-sm sm:flex-row sm:items-center sm:justify-between ${severity}`}>
      <div>
        <p className="font-medium">
          {organizationName ? `${organizationName} eligibility revalidation due in ${daysRemaining} days.` : `Nonprofit eligibility revalidation due in ${daysRemaining} days.`}
        </p>
        <p className="text-xs opacity-80">
          Update eligibility documents to keep nonprofit pricing and safeguards active. Missing the deadline will revert to standard rates.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Link
          href="/settings/nonprofit"
          className="inline-flex items-center justify-center rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
        >
          Review status
        </Link>
        <Link
          href="/support"
          className="inline-flex items-center justify-center rounded-md border px-3 py-2 text-xs font-semibold"
        >
          Contact support
        </Link>
      </div>
    </div>
  )
}

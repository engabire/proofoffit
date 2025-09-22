'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

type QuickAction = {
  label: string
  href?: string
  toastMessage?: string
}

type QuickActionsProps = {
  role?: 'candidate' | 'employer'
}

export function QuickActions({ role }: QuickActionsProps) {
  const router = useRouter()

  const actions: QuickAction[] =
    role === 'candidate'
      ? [
          {
            label: 'Review my profile',
            href: '/candidate/profile',
          },
          {
            label: 'View job matches',
            href: '/candidate/matches',
          },
          {
            label: 'Save weekly snapshot',
            toastMessage: 'Weekly snapshot saved and queued for delivery.',
          },
        ]
      : role === 'employer'
      ? [
          {
            label: 'Create job intake',
            href: '/employer/intake',
          },
          {
            label: 'Review candidate slates',
            href: '/employer/slates',
          },
          {
            label: 'Save hiring plan',
            toastMessage: 'Hiring plan saved — your team will see the update in analytics.',
          },
        ]
      : []

  if (!role) {
    return (
      <div className="rounded border border-dashed p-3 text-sm text-muted-foreground">
        Set your workspace role to unlock quick actions.
      </div>
    )
  }

  const handleAction = (action: QuickAction) => {
    if (action.toastMessage) {
      toast.success(action.toastMessage)
    }

    if (action.href) {
      router.push(action.href)
    }
  }

  return (
    <div className="space-y-2">
      {actions.map((action) => (
        <button
          key={action.label}
          type="button"
          onClick={() => handleAction(action)}
          className="w-full rounded px-3 py-2 text-left text-sm transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

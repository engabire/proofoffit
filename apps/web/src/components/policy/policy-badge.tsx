'use client'

import { Badge } from '@proof-of-fit/ui'
import { CheckCircle, XCircle, AlertTriangle, Clock } from 'lucide-react'
import { PolicyDecision } from '@/lib/policy-engine'

interface PolicyBadgeProps {
  decision: PolicyDecision
  size?: 'sm' | 'md' | 'lg'
}

export function PolicyBadge({ decision, size = 'md' }: PolicyBadgeProps) {
  const getBadgeProps = () => {
    switch (decision.action) {
      case 'auto_apply':
        return {
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300',
          icon: <CheckCircle className="h-3 w-3" />,
          text: 'Auto Apply'
        }
      case 'prep_confirm':
        return {
          variant: 'secondary' as const,
          className: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300',
          icon: <Clock className="h-3 w-3" />,
          text: 'Prep & Confirm'
        }
      case 'deny':
        return {
          variant: 'destructive' as const,
          className: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300',
          icon: <XCircle className="h-3 w-3" />,
          text: 'Manual Only'
        }
      default:
        return {
          variant: 'secondary' as const,
          className: 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300',
          icon: <AlertTriangle className="h-3 w-3" />,
          text: 'Unknown'
        }
    }
  }

  const badgeProps = getBadgeProps()
  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-2.5 py-0.5',
    lg: 'text-base px-3 py-1'
  }

  return (
    <Badge 
      variant={badgeProps.variant}
      className={`${badgeProps.className} ${sizeClasses[size]} flex items-center gap-1`}
    >
      {badgeProps.icon}
      {badgeProps.text}
    </Badge>
  )
}
"use client"

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'

export interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
  exact?: boolean
}

interface ActiveLinkProps {
  item: NavItem
  className?: string
  activeClassName?: string
  prefetch?: boolean
  replace?: boolean
  scroll?: boolean
  shallow?: boolean
}

export function ActiveLink({ item, className, activeClassName, prefetch, replace, scroll, shallow }: ActiveLinkProps) {
  const pathname = usePathname()
  const isActive = item.exact
    ? pathname === item.href
    : pathname === item.href || pathname.startsWith(item.href + '/')

  return (
    <Link
      href={item.href}
      aria-current={isActive ? 'page' : undefined}
      className={cn(
        'flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60 focus-visible:ring-offset-2 focus-visible:ring-offset-background',
        'hover:text-foreground hover:bg-muted/60',
        isActive && 'bg-primary/10 text-foreground shadow-inner',
        className,
        isActive && activeClassName
      )}
      prefetch={prefetch}
      replace={replace}
      scroll={scroll}
      shallow={shallow}
    >
      {item.icon && <span className="shrink-0" aria-hidden>{item.icon}</span>}
      <span>{item.label}</span>
    </Link>
  )
}

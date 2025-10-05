"use client"

import React from 'react'
import { ActiveLink, NavItem } from './active-link'
import { usePathname } from 'next/navigation'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Link from 'next/link'

interface SectionNavProps {
  items: NavItem[]
  orientation?: 'horizontal' | 'vertical'
  ariaLabel?: string
  className?: string
  showPrevNext?: boolean
  prevNextAriaLabel?: string
}

export function SectionNav({
  items,
  orientation = 'vertical',
  ariaLabel = 'Section navigation',
  className,
  showPrevNext = false,
  prevNextAriaLabel = 'Section page navigation'
}: SectionNavProps) {
  const pathname = usePathname()
  const currentIndex = items.findIndex(i => pathname === i.href || pathname.startsWith(i.href + '/'))
  const prev = currentIndex > 0 ? items[currentIndex - 1] : undefined
  const next = currentIndex >= 0 && currentIndex < items.length - 1 ? items[currentIndex + 1] : undefined

  return (
    <div className={className}>
      <nav aria-label={ariaLabel} className={orientation === 'horizontal' ? 'flex items-center space-x-4' : 'space-y-1'}>
        {items.map(item => (
          <ActiveLink key={item.href} item={item} />
        ))}
      </nav>
      {showPrevNext && (prev || next) && (
        <nav aria-label={prevNextAriaLabel} className="mt-4 flex items-center justify-between gap-4" data-prev-next>
          <div>
            {prev && (
              <Link
                href={prev.href}
                className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                data-nav-previous
              >
                <ChevronLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" aria-hidden />
                <span className="flex flex-col text-left">
                  <span className="text-xs text-muted-foreground">Previous</span>
                  <span>{prev.label}</span>
                </span>
              </Link>
            )}
          </div>
          <div className="ml-auto">
            {next && (
              <Link
                href={next.href}
                className="group inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm font-medium hover:bg-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60"
                data-nav-next
              >
                <span className="flex flex-col text-right">
                  <span className="text-xs text-muted-foreground">Next</span>
                  <span>{next.label}</span>
                </span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
              </Link>
            )}
          </div>
        </nav>
      )}
    </div>
  )
}

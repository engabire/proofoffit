'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import { ChevronRight, Home } from 'lucide-react'

export interface NavItem {
  href: string
  label: string
  icon?: React.ReactNode
  exact?: boolean
  children?: NavItem[]
  badge?: string | number
  disabled?: boolean
}

interface NavigationProps {
  items: NavItem[]
  orientation?: 'horizontal' | 'vertical'
  className?: string
  itemClassName?: string
  activeClassName?: string
  showIcons?: boolean
  showBadges?: boolean
}

export function Navigation({
  items,
  orientation = 'horizontal',
  className,
  itemClassName,
  activeClassName,
  showIcons = true,
  showBadges = true
}: NavigationProps) {
  const pathname = usePathname()

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  const baseClasses = cn(
    'flex',
    orientation === 'horizontal' ? 'flex-row space-x-1' : 'flex-col space-y-1',
    className
  )

  return (
    <nav className={baseClasses} role="navigation">
      {items.map((item) => {
        const active = isActive(item)
        
        return (
          <Link
            key={item.href}
            href={item.disabled ? '#' : item.href}
            className={cn(
              'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
              'hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
              active && 'bg-primary/10 text-primary shadow-inner',
              item.disabled && 'opacity-50 cursor-not-allowed',
              itemClassName,
              active && activeClassName
            )}
            aria-current={active ? 'page' : undefined}
            aria-disabled={item.disabled}
          >
            {showIcons && item.icon && (
              <span className="shrink-0" aria-hidden="true">
                {item.icon}
              </span>
            )}
            <span>{item.label}</span>
            {showBadges && item.badge && (
              <span className="ml-auto inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                {item.badge}
              </span>
            )}
          </Link>
        )
      })}
    </nav>
  )
}

// Breadcrumb Navigation Component
export interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
}

interface BreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  separator?: React.ReactNode
  showHome?: boolean
}

export function Breadcrumb({
  items,
  className,
  separator = <ChevronRight className="h-4 w-4" />,
  showHome = true
}: BreadcrumbProps) {
  const pathname = usePathname()
  
  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> }, ...items]
    : items

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label="Breadcrumb"
    >
      {allItems.map((item, index) => {
        const isLast = index === allItems.length - 1
        
        return (
          <React.Fragment key={index}>
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="flex items-center space-x-1 hover:text-foreground transition-colors"
              >
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </Link>
            ) : (
              <span className="flex items-center space-x-1 text-foreground">
                {item.icon && <span className="shrink-0">{item.icon}</span>}
                <span>{item.label}</span>
              </span>
            )}
            {!isLast && (
              <span className="shrink-0" aria-hidden="true">
                {separator}
              </span>
            )}
          </React.Fragment>
        )
      })}
    </nav>
  )
}

// Mobile Navigation Component
interface MobileNavProps {
  items: NavItem[]
  isOpen: boolean
  onClose: () => void
  className?: string
}

export function MobileNavigation({
  items,
  isOpen,
  onClose,
  className
}: MobileNavProps) {
  const pathname = usePathname()

  const isActive = (item: NavItem) => {
    if (item.exact) {
      return pathname === item.href
    }
    return pathname === item.href || pathname.startsWith(item.href + '/')
  }

  if (!isOpen) return null

  return (
    <div className={cn('fixed inset-0 z-50 lg:hidden', className)}>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50" 
        onClick={onClose}
        aria-hidden="true"
      />
      
      {/* Navigation Panel */}
      <div className="fixed inset-y-0 left-0 w-64 bg-background border-r shadow-lg">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="text-lg font-semibold">Navigation</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-muted rounded-md"
              aria-label="Close navigation"
            >
              ×
            </button>
          </div>
          
          {/* Navigation Items */}
          <nav className="flex-1 p-4 space-y-2">
            {items.map((item) => {
              const active = isActive(item)
              
              return (
                <Link
                  key={item.href}
                  href={item.disabled ? '#' : item.href}
                  onClick={onClose}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    'hover:bg-muted/60 focus:outline-none focus-visible:ring-2 focus-visible:ring-primary/60',
                    active && 'bg-primary/10 text-primary',
                    item.disabled && 'opacity-50 cursor-not-allowed'
                  )}
                  aria-current={active ? 'page' : undefined}
                  aria-disabled={item.disabled}
                >
                  {item.icon && (
                    <span className="shrink-0" aria-hidden="true">
                      {item.icon}
                    </span>
                  )}
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto inline-flex items-center rounded-full bg-primary/20 px-2 py-0.5 text-xs font-medium text-primary">
                      {item.badge}
                    </span>
                  )}
                </Link>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}

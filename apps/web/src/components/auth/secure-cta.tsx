'use client'

import React from 'react'
import Link from 'next/link'
import { Button } from '@proof-of-fit/ui'
import { useAuth } from '@/components/auth/auth-guard'
import { cn } from '@/lib/utils'

interface SecureCtaProps {
  id?: string
  label: string
  href?: string
  onClick?: (e: React.MouseEvent) => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  iconLeft?: React.ReactNode
  iconRight?: React.ReactNode
  disabled?: boolean
  loading?: boolean
  ariaLabel?: string
  className?: string
  requireAuth?: boolean
  authRedirect?: string
  dataEvt?: string
  dataLane?: string
  prefetch?: boolean
}

export function SecureCta({
  id,
  label,
  href,
  onClick,
  variant = 'secondary',
  size = 'md',
  iconLeft,
  iconRight,
  disabled = false,
  loading = false,
  ariaLabel,
  className,
  requireAuth = false,
  authRedirect = '/auth/signin',
  dataEvt,
  dataLane,
  prefetch = true,
  ...props
}: SecureCtaProps) {
  const { isAuthenticated, isLoading } = useAuth()

  // Handle click with auth check
  const handleClick = (e: React.MouseEvent) => {
    // If auth is required and user is not authenticated, redirect to auth
    if (requireAuth && !isAuthenticated) {
      e.preventDefault()
      window.location.href = authRedirect
      return
    }

    // Track analytics if data attributes are provided
    if (dataEvt || dataLane) {
      try {
        // Emit analytics event
        if (typeof window !== 'undefined' && (window as any).gtag) {
          (window as any).gtag('event', 'cta_click', {
            event_category: 'engagement',
            event_label: label,
            custom_parameter_1: dataEvt,
            custom_parameter_2: dataLane,
            page_path: window.location.pathname
          })
        }
      } catch (error) {
        console.warn('Analytics tracking failed:', error)
      }
    }

    onClick?.(e)
  }

  // Show loading state if auth is being checked
  if (isLoading && requireAuth) {
    return (
      <Button
        id={id}
        variant={variant}
        size={size}
        disabled={true}
        className={cn(className)}
        aria-label={ariaLabel || label}
        {...props}
      >
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        Loading...
      </Button>
    )
  }

  // If href is provided, render as Link
  if (href && !disabled) {
    const finalHref = requireAuth && !isAuthenticated ? authRedirect : href
    
    return (
      <Link
        id={id}
        href={finalHref}
        prefetch={prefetch}
        aria-label={ariaLabel || label}
        className={cn(
          'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background',
          {
            'bg-primary text-primary-foreground hover:bg-primary/90': variant === 'primary',
            'bg-secondary text-secondary-foreground hover:bg-secondary/80': variant === 'secondary',
            'border border-input hover:bg-accent hover:text-accent-foreground': variant === 'outline',
            'hover:bg-accent hover:text-accent-foreground': variant === 'ghost',
            'bg-destructive text-destructive-foreground hover:bg-destructive/90': variant === 'destructive',
            'h-9 px-3': size === 'sm',
            'h-10 py-2 px-4': size === 'md',
            'h-11 px-8': size === 'lg',
          },
          className
        )}
        onClick={handleClick}
        data-cta="true"
        data-evt={dataEvt}
        data-lane={dataLane}
        {...props}
      >
        {loading ? (
          <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
        ) : (
          iconLeft
        )}
        <span>{label}</span>
        {iconRight}
      </Link>
    )
  }

  // Render as button
  return (
    <Button
      id={id}
      type="button"
      variant={variant}
      size={size}
      onClick={handleClick}
      disabled={disabled || loading}
      aria-label={ariaLabel || label}
      aria-busy={loading || undefined}
      className={cn(className)}
      data-cta="true"
      data-evt={dataEvt}
      data-lane={dataLane}
      {...props}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
      ) : (
        iconLeft
      )}
      <span>{label}</span>
      {iconRight}
    </Button>
  )
}

// Enhanced CTA with security features
export function EnhancedCta(props: SecureCtaProps) {
  return <SecureCta {...props} />
}

// CTA specifically for authenticated actions
export function AuthRequiredCta(props: Omit<SecureCtaProps, 'requireAuth'>) {
  return <SecureCta {...props} requireAuth={true} />
}

// CTA for public actions (no auth required)
export function PublicCta(props: Omit<SecureCtaProps, 'requireAuth'>) {
  return <SecureCta {...props} requireAuth={false} />
}

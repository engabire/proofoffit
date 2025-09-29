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
  variant?: SecureCtaVariant
  size?: SecureCtaSize
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

type ButtonVariant = React.ComponentProps<typeof Button>['variant']
type SecureCtaVariant = ButtonVariant | 'primary'
type SecureCtaSize = React.ComponentProps<typeof Button>['size']

export function SecureCta({
  id,
  label,
  href,
  onClick,
  variant = 'default',
  size = 'default',
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
  const resolvedVariant = mapToButtonVariant(variant)
  const renderContent = (showSpinner: boolean) => (
    <span className="flex items-center gap-2">
      {showSpinner ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        iconLeft
      )}
      <span>{label}</span>
      {iconRight}
    </span>
  )

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
        variant={resolvedVariant}
        size={size}
        disabled={true}
        className={cn(className)}
        aria-label={ariaLabel || label}
        {...props}
      >
        {renderContent(true)}
      </Button>
    )
  }

  // If href is provided, render as Link
  if (href && !disabled) {
    const finalHref = requireAuth && !isAuthenticated ? authRedirect : href
    
    return (
      <Button
        id={id}
        variant={resolvedVariant}
        size={size}
        asChild
        className={cn(className)}
        data-cta="true"
        data-evt={dataEvt}
        data-lane={dataLane}
        {...props}
      >
        <Link
          href={finalHref}
          prefetch={prefetch}
          aria-label={ariaLabel || label}
          onClick={handleClick}
        >
          {renderContent(loading)}
        </Link>
      </Button>
    )
  }

  // Render as button
  return (
    <Button
      id={id}
      type="button"
      variant={resolvedVariant}
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
      {renderContent(loading)}
    </Button>
  )
}

function mapToButtonVariant(variant: SecureCtaVariant): ButtonVariant {
  switch (variant) {
    case 'primary':
      return 'default'
    default:
      return (variant ?? 'default') as ButtonVariant
  }
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

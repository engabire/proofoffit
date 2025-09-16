import * as React from "react"
import { Button, ButtonProps } from "./button"
import { cn } from "@/lib/utils"
import { CTATrackingData } from "../types/analytics"

export interface CTAButtonProps extends Omit<ButtonProps, 'variant'> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  href?: string
  external?: boolean
  trackingData?: CTATrackingData
  icon?: React.ReactNode
  iconPosition?: 'left' | 'right'
}

const CTAButton = React.forwardRef<HTMLButtonElement, CTAButtonProps>(
  ({ 
    className,
    variant = 'primary',
    href,
    external = false,
    trackingData = {},
    icon,
    iconPosition = 'right',
    children,
    onClick,
    ...props
  }, ref) => {
    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      // Track CTA interaction
      if (trackingData && Object.keys(trackingData).length > 0) {
        // Send tracking data to analytics
        if (typeof window !== 'undefined' && window.gtag) {
          window.gtag('event', 'cta_click', {
            ...trackingData,
            timestamp: new Date().toISOString()
          })
        }
      }

      if (onClick) {
        onClick(e)
      }

      // Handle navigation
      if (href && !e.defaultPrevented) {
        if (external) {
          window.open(href, '_blank', 'noopener,noreferrer')
        } else {
          window.location.href = href
        }
      }
    }

    const getVariantClass = () => {
      switch (variant) {
        case 'primary':
          return 'cta'
        case 'secondary':
          return 'cta-secondary'
        case 'outline':
          return 'outline'
        case 'ghost':
          return 'ghost'
        default:
          return 'default'
      }
    }

    const buttonContent = (
      <>
        {icon && iconPosition === 'left' && (
          <span className="mr-2" aria-hidden="true">{icon}</span>
        )}
        {children}
        {icon && iconPosition === 'right' && (
          <span className="ml-2" aria-hidden="true">{icon}</span>
        )}
      </>
    )

    const buttonProps = {
      className: cn(className),
      variant: getVariantClass() as any,
      onClick: handleClick,
      ref,
      'data-cta': 'true',
      'aria-label': props['aria-label'] || 
        (typeof children === 'string' ? `${children}${href ? ` - opens ${external ? 'in new tab' : 'page'}` : ''}` : undefined),
      ...trackingData,
      ...props
    }

    if (href) {
      return (
        <Button asChild {...buttonProps}>
          <a 
            href={href}
            target={external ? '_blank' : undefined}
            rel={external ? 'noopener noreferrer' : undefined}
          >
            {buttonContent}
          </a>
        </Button>
      )
    }

    return (
      <Button {...buttonProps}>
        {buttonContent}
      </Button>
    )
  }
)

CTAButton.displayName = "CTAButton"

export { CTAButton }
'use client'

import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Button } from '@proof-of-fit/ui'
import { 
  ChevronLeft, 
  ChevronRight, 
  Home, 
  ArrowLeft,
  RotateCcw,
  CheckCircle,
  Circle
} from 'lucide-react'
import { cn } from '@/lib/utils'

// Enhanced Breadcrumb Component
interface BreadcrumbItem {
  label: string
  href?: string
  icon?: React.ReactNode
  current?: boolean
}

interface EnhancedBreadcrumbProps {
  items: BreadcrumbItem[]
  className?: string
  showHome?: boolean
  separator?: React.ReactNode
}

export function EnhancedBreadcrumb({
  items,
  className,
  showHome = true,
  separator = <ChevronRight className="h-4 w-4" />
}: EnhancedBreadcrumbProps) {
  const allItems = showHome 
    ? [{ label: 'Home', href: '/', icon: <Home className="h-4 w-4" /> }, ...items]
    : items

  return (
    <nav 
      className={cn('flex items-center space-x-1 text-sm text-muted-foreground', className)}
      aria-label="Breadcrumb navigation"
    >
      {allItems.map((item, index) => (
        <React.Fragment key={index}>
          {item.href && !item.current ? (
            <Link
              href={item.href}
              className="flex items-center space-x-1 hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-md px-1 py-0.5"
              aria-label={`Navigate to ${item.label}`}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </Link>
          ) : (
            <span 
              className={cn(
                "flex items-center space-x-1",
                item.current ? "text-foreground font-medium" : "text-muted-foreground"
              )}
              aria-current={item.current ? "page" : undefined}
            >
              {item.icon && <span className="shrink-0">{item.icon}</span>}
              <span>{item.label}</span>
            </span>
          )}
          {index < allItems.length - 1 && (
            <span className="shrink-0 text-muted-foreground" aria-hidden="true">
              {separator}
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  )
}

// Enhanced Back Button Component
interface EnhancedBackButtonProps {
  href?: string
  onClick?: () => void
  variant?: 'default' | 'outline' | 'ghost'
  size?: 'sm' | 'default' | 'lg'
  className?: string
  children?: React.ReactNode
  showIcon?: boolean
}

export function EnhancedBackButton({
  href,
  onClick,
  variant = 'outline',
  size = 'default',
  className,
  children = 'Back',
  showIcon = true
}: EnhancedBackButtonProps) {
  const router = useRouter()

  const handleClick = () => {
    if (onClick) {
      onClick()
    } else if (href) {
      router.push(href)
    } else {
      router.back()
    }
  }

  const buttonContent = (
    <>
      {showIcon && <ArrowLeft className="w-4 h-4 mr-2" />}
      {children}
    </>
  )

  if (href) {
    return (
      <Button
        variant={variant}
        size={size}
        className={className}
        asChild
      >
        <Link href={href}>
          {buttonContent}
        </Link>
      </Button>
    )
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleClick}
    >
      {buttonContent}
    </Button>
  )
}

// Enhanced Progress Indicator Component
interface ProgressStep {
  id: string
  title: string
  description?: string
  completed?: boolean
  current?: boolean
  disabled?: boolean
}

interface EnhancedProgressIndicatorProps {
  steps: ProgressStep[]
  currentStep: number
  className?: string
  showDescriptions?: boolean
  orientation?: 'horizontal' | 'vertical'
}

export function EnhancedProgressIndicator({
  steps,
  currentStep,
  className,
  showDescriptions = false,
  orientation = 'horizontal'
}: EnhancedProgressIndicatorProps) {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div className={cn(
      'w-full',
      isHorizontal ? 'flex items-center justify-between' : 'space-y-4',
      className
    )}>
      {steps.map((step, index) => {
        const stepNumber = index + 1
        const isCompleted = step.completed || stepNumber < currentStep
        const isCurrent = step.current || stepNumber === currentStep
        const isDisabled = step.disabled || stepNumber > currentStep

        return (
          <div
            key={step.id}
            className={cn(
              'flex items-center',
              isHorizontal ? 'flex-col space-y-2' : 'space-x-3'
            )}
          >
            {/* Step Circle */}
            <div className="flex items-center">
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                  isCompleted && 'bg-green-500 border-green-500 text-white',
                  isCurrent && !isCompleted && 'bg-blue-500 border-blue-500 text-white',
                  isDisabled && 'bg-gray-100 border-gray-300 text-gray-400',
                  !isCompleted && !isCurrent && !isDisabled && 'bg-white border-gray-300 text-gray-600'
                )}
              >
                {isCompleted ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <span className="text-sm font-medium">{stepNumber}</span>
                )}
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div
                  className={cn(
                    'transition-colors',
                    isHorizontal 
                      ? 'w-16 h-0.5 ml-2' 
                      : 'w-0.5 h-8 ml-3.5 -mt-4',
                    isCompleted ? 'bg-green-500' : 'bg-gray-300'
                  )}
                />
              )}
            </div>

            {/* Step Content */}
            <div className={cn(
              'text-center',
              isHorizontal ? 'max-w-20' : 'flex-1'
            )}>
              <div
                className={cn(
                  'text-sm font-medium transition-colors',
                  isCurrent && 'text-blue-600',
                  isCompleted && 'text-green-600',
                  isDisabled && 'text-gray-400',
                  !isCurrent && !isCompleted && !isDisabled && 'text-gray-600'
                )}
              >
                {step.title}
              </div>
              {showDescriptions && step.description && (
                <div className="text-xs text-gray-500 mt-1">
                  {step.description}
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

// Enhanced Navigation Buttons Component
interface NavigationButtonsProps {
  onPrevious?: () => void
  onNext?: () => void
  onStartOver?: () => void
  previousLabel?: string
  nextLabel?: string
  startOverLabel?: string
  showPrevious?: boolean
  showNext?: boolean
  showStartOver?: boolean
  isPreviousDisabled?: boolean
  isNextDisabled?: boolean
  isNextLoading?: boolean
  className?: string
  variant?: 'default' | 'compact'
}

export function NavigationButtons({
  onPrevious,
  onNext,
  onStartOver,
  previousLabel = 'Previous',
  nextLabel = 'Next',
  startOverLabel = 'Start Over',
  showPrevious = true,
  showNext = true,
  showStartOver = false,
  isPreviousDisabled = false,
  isNextDisabled = false,
  isNextLoading = false,
  className,
  variant = 'default'
}: NavigationButtonsProps) {
  const isCompact = variant === 'compact'

  return (
    <div className={cn(
      'flex items-center justify-between',
      isCompact ? 'gap-2' : 'gap-4',
      className
    )}>
      {/* Left Side - Previous & Start Over */}
      <div className="flex items-center gap-2">
        {showPrevious && (
          <Button
            variant="outline"
            onClick={onPrevious}
            disabled={isPreviousDisabled}
            className={cn(
              'flex items-center gap-2',
              isCompact && 'px-3 py-1.5 text-sm'
            )}
          >
            <ChevronLeft className="w-4 h-4" />
            {previousLabel}
          </Button>
        )}
        
        {showStartOver && (
          <Button
            variant="ghost"
            onClick={onStartOver}
            className={cn(
              'flex items-center gap-2 text-gray-600 hover:text-gray-800',
              isCompact && 'px-3 py-1.5 text-sm'
            )}
          >
            <RotateCcw className="w-4 h-4" />
            {startOverLabel}
          </Button>
        )}
      </div>

      {/* Right Side - Next */}
      {showNext && (
        <Button
          onClick={onNext}
          disabled={isNextDisabled || isNextLoading}
          className={cn(
            'flex items-center gap-2',
            isCompact && 'px-3 py-1.5 text-sm'
          )}
        >
          {isNextLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Loading...
            </>
          ) : (
            <>
              {nextLabel}
              <ChevronRight className="w-4 h-4" />
            </>
          )}
        </Button>
      )}
    </div>
  )
}

// Enhanced Page Header Component
interface EnhancedPageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  backButton?: {
    href?: string
    onClick?: () => void
    label?: string
  }
  className?: string
}

export function EnhancedPageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  backButton,
  className
}: EnhancedPageHeaderProps) {
  return (
    <div className={cn('border-b bg-background/95 backdrop-blur', className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-start justify-between">
          <div className="space-y-4 flex-1">
            {/* Back Button */}
            {backButton && (
              <EnhancedBackButton
                href={backButton.href}
                onClick={backButton.onClick}
                className="mb-2"
              >
                {backButton.label || 'Back'}
              </EnhancedBackButton>
            )}

            {/* Breadcrumbs */}
            {breadcrumbs.length > 0 && (
              <EnhancedBreadcrumb items={breadcrumbs} />
            )}

            {/* Title and Description */}
            <div className="space-y-2">
              <h1 className="text-3xl font-bold text-foreground">{title}</h1>
              {description && (
                <p className="text-muted-foreground text-lg">{description}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center space-x-2 ml-4">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

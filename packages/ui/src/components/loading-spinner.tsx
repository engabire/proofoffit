import React from 'react'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
  variant?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'error'
}

const sizeClasses = {
  sm: 'h-4 w-4',
  md: 'h-6 w-6',
  lg: 'h-8 w-8',
  xl: 'h-12 w-12'
}

const variantClasses = {
  default: 'text-slate-600 dark:text-slate-400',
  primary: 'text-sky-600 dark:text-sky-400',
  secondary: 'text-slate-500 dark:text-slate-500',
  success: 'text-emerald-600 dark:text-emerald-400',
  warning: 'text-amber-600 dark:text-amber-400',
  error: 'text-red-600 dark:text-red-400'
}

export function LoadingSpinner({ 
  size = 'md', 
  className, 
  variant = 'default' 
}: LoadingSpinnerProps) {
  return (
    <div
      className={cn(
        'animate-spin rounded-full border-2 border-current border-t-transparent',
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label="Loading"
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingDotsProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
  variant?: 'default' | 'primary' | 'secondary'
}

const dotSizeClasses = {
  sm: 'h-1 w-1',
  md: 'h-2 w-2',
  lg: 'h-3 w-3'
}

export function LoadingDots({ 
  size = 'md', 
  className, 
  variant = 'default' 
}: LoadingDotsProps) {
  const dotVariantClasses = {
    default: 'bg-slate-400 dark:bg-slate-500',
    primary: 'bg-sky-500 dark:bg-sky-400',
    secondary: 'bg-slate-500 dark:bg-slate-400'
  }

  return (
    <div className={cn('flex space-x-1', className)} role="status" aria-label="Loading">
      <div
        className={cn(
          'rounded-full animate-bounce',
          dotSizeClasses[size],
          dotVariantClasses[variant]
        )}
        style={{ animationDelay: '0ms' }}
      />
      <div
        className={cn(
          'rounded-full animate-bounce',
          dotSizeClasses[size],
          dotVariantClasses[variant]
        )}
        style={{ animationDelay: '150ms' }}
      />
      <div
        className={cn(
          'rounded-full animate-bounce',
          dotSizeClasses[size],
          dotVariantClasses[variant]
        )}
        style={{ animationDelay: '300ms' }}
      />
      <span className="sr-only">Loading...</span>
    </div>
  )
}

interface LoadingSkeletonProps {
  className?: string
  lines?: number
}

export function LoadingSkeleton({ className, lines = 1 }: LoadingSkeletonProps) {
  return (
    <div className={cn('animate-pulse', className)}>
      {Array.from({ length: lines }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'bg-slate-200 dark:bg-slate-700 rounded',
            i === lines - 1 ? 'w-3/4' : 'w-full',
            lines > 1 && i < lines - 1 ? 'mb-2' : ''
          )}
          style={{ height: '1rem' }}
        />
      ))}
    </div>
  )
}

interface LoadingOverlayProps {
  children: React.ReactNode
  isLoading: boolean
  message?: string
  className?: string
}

export function LoadingOverlay({ 
  children, 
  isLoading, 
  message = 'Loading...', 
  className 
}: LoadingOverlayProps) {
  return (
    <div className={cn('relative', className)}>
      {children}
      {isLoading && (
        <div className="absolute inset-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="flex flex-col items-center gap-3">
            <LoadingSpinner size="lg" variant="primary" />
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {message}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

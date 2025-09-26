import React from 'react'
import { ErrorBoundary } from '@proof-of-fit/ui'
import { DegradedBanner } from '../system/degraded-banner'
import { NotificationCenter, useNotifications } from '@proof-of-fit/ui'
import { PerformanceMonitor } from '@proof-of-fit/ui'

interface EnhancedLayoutProps {
  children: React.ReactNode
  showPerformanceMonitor?: boolean
  showNotifications?: boolean
  className?: string
}

export function EnhancedLayout({
  children,
  showPerformanceMonitor = false,
  showNotifications = true,
  className
}: EnhancedLayoutProps) {
  const { notifications, markAsRead, markAllAsRead, removeNotification, clearAll } = useNotifications()

  return (
    <ErrorBoundary>
      <div className={`min-h-screen bg-slate-50 dark:bg-slate-900 ${className || ''}`}>
        {/* System Status Banner */}
        <DegradedBanner />
        
        {/* Main Content */}
        <main className="relative">
          {children}
        </main>

        {/* Performance Monitor (if enabled) */}
        {showPerformanceMonitor && (
          <div className="fixed bottom-4 right-4 z-40">
            <PerformanceMonitor compact />
          </div>
        )}

        {/* Notification Center */}
        {showNotifications && (
          <div className="fixed top-4 right-4 z-50">
            <NotificationCenter
              notifications={notifications}
              onMarkAsRead={markAsRead}
              onMarkAllAsRead={markAllAsRead}
              onRemove={removeNotification}
              onClearAll={clearAll}
            />
          </div>
        )}

        {/* Skip to content link for accessibility */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] bg-sky-600 text-white px-4 py-2 rounded-lg font-medium shadow-lg"
        >
          Skip to main content
        </a>
      </div>
    </ErrorBoundary>
  )
}

// Enhanced layout with performance monitoring
export function PerformanceLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <EnhancedLayout showPerformanceMonitor={true} className={className}>
      {children}
    </EnhancedLayout>
  )
}

// Enhanced layout with notifications
export function NotificationLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <EnhancedLayout showNotifications={true} className={className}>
      {children}
    </EnhancedLayout>
  )
}

// Full enhanced layout with all features
export function FullEnhancedLayout({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <EnhancedLayout 
      showPerformanceMonitor={true} 
      showNotifications={true} 
      className={className}
    >
      {children}
    </EnhancedLayout>
  )
}

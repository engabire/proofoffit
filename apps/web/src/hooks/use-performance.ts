'use client'

import { useEffect, useState, useCallback } from 'react'

interface PerformanceMetrics {
  loadTime: number
  firstContentfulPaint: number
  largestContentfulPaint: number
  firstInputDelay: number
  cumulativeLayoutShift: number
  timeToInteractive: number
}

interface PerformanceEntry {
  name: string
  value: number
  delta: number
  id: string
  navigationId: string
}

export function usePerformance() {
  const [metrics, setMetrics] = useState<Partial<PerformanceMetrics>>({})
  const [isSupported, setIsSupported] = useState(false)

  useEffect(() => {
    // Check if Performance Observer is supported
    if (typeof window !== 'undefined' && 'PerformanceObserver' in window) {
      setIsSupported(true)
      collectMetrics()
    }
  }, [collectMetrics])

  const collectMetrics = useCallback(() => {
    if (typeof window === 'undefined') return

    const newMetrics: Partial<PerformanceMetrics> = {}

    // Navigation timing
    const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming | undefined
    if (navigation) {
      newMetrics.loadTime = navigation.loadEventEnd - navigation.loadEventStart
      newMetrics.timeToInteractive = navigation.domInteractive - navigation.startTime
    }

    // Paint timing
    const paintEntries = performance.getEntriesByType('paint')
    paintEntries.forEach((entry) => {
      if (entry.name === 'first-contentful-paint') {
        newMetrics.firstContentfulPaint = entry.startTime
      }
    })

    // Web Vitals
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry: any) => {
        switch (entry.entryType) {
          case 'largest-contentful-paint':
            newMetrics.largestContentfulPaint = entry.startTime
            break
          case 'first-input':
            newMetrics.firstInputDelay = entry.processingStart - entry.startTime
            break
          case 'layout-shift':
            if (!entry.hadRecentInput) {
              newMetrics.cumulativeLayoutShift = (newMetrics.cumulativeLayoutShift || 0) + entry.value
            }
            break
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['largest-contentful-paint', 'first-input', 'layout-shift'] })
    } catch (e) {
      console.warn('Performance Observer not fully supported:', e)
    }

    setMetrics(newMetrics)

    return () => {
      observer.disconnect()
    }
  }, [])

  const measureCustomMetric = useCallback((name: string, startMark: string, endMark?: string) => {
    if (typeof window === 'undefined') return

    if (endMark) {
      performance.measure(name, startMark, endMark)
    } else {
      performance.measure(name, startMark)
    }

    const measures = performance.getEntriesByName(name, 'measure')
    return measures[measures.length - 1]?.duration
  }, [])

  const markStart = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-start`)
    }
  }, [])

  const markEnd = useCallback((name: string) => {
    if (typeof window !== 'undefined') {
      performance.mark(`${name}-end`)
    }
  }, [])

  const getMetricScore = useCallback((metric: keyof PerformanceMetrics, value: number) => {
    const thresholds: Record<keyof PerformanceMetrics, { good: number; poor: number }> = {
      loadTime: { good: 2000, poor: 4000 },
      firstContentfulPaint: { good: 1800, poor: 3000 },
      largestContentfulPaint: { good: 2500, poor: 4000 },
      firstInputDelay: { good: 100, poor: 300 },
      cumulativeLayoutShift: { good: 0.1, poor: 0.25 },
      timeToInteractive: { good: 3800, poor: 7300 }
    }

    const threshold = thresholds[metric]
    if (!threshold) return 'unknown'

    if (value <= threshold.good) return 'good'
    if (value <= threshold.poor) return 'needs-improvement'
    return 'poor'
  }, [])

  const reportMetrics = useCallback(() => {
    if (typeof window === 'undefined') return

    // Send metrics to analytics service
    const analyticsData = {
      ...metrics,
      timestamp: Date.now(),
      url: window.location.href,
      userAgent: navigator.userAgent
    }

    // Example: Send to analytics
    const globalWindow = typeof window !== 'undefined' ? (window as typeof window & { gtag?: (...args: any[]) => void }) : undefined
    if (globalWindow?.gtag) {
      globalWindow.gtag('event', 'web_vitals', {
        event_category: 'Performance',
        event_label: 'Web Vitals',
        value: Math.round(metrics.largestContentfulPaint || 0),
        custom_map: {
          metric_1: 'LCP',
          metric_2: 'FID',
          metric_3: 'CLS'
        }
      })
    }

    // eslint-disable-next-line no-console
    console.log('Performance metrics:', analyticsData)
  }, [metrics])

  return {
    metrics,
    isSupported,
    measureCustomMetric,
    markStart,
    markEnd,
    getMetricScore,
    reportMetrics,
    collectMetrics
  }
}

// Hook for monitoring component render performance
export function useRenderPerformance(componentName: string) {
  const { markStart, markEnd, measureCustomMetric } = usePerformance()

  useEffect(() => {
    markStart(`${componentName}-render`)
    
    return () => {
      markEnd(`${componentName}-render`)
      const duration = measureCustomMetric(`${componentName}-render`, `${componentName}-render-start`, `${componentName}-render-end`)
      
      if (duration && duration > 16) { // More than one frame (16ms)
        console.warn(`${componentName} render took ${duration.toFixed(2)}ms`)
      }
    }
  }, [componentName, markStart, markEnd, measureCustomMetric])
}

// Hook for monitoring API call performance
export function useAPIPerformance() {
  const { markStart, markEnd, measureCustomMetric } = usePerformance()

  const measureAPICall = useCallback(async <T>(
    apiCall: () => Promise<T>,
    endpoint: string
  ): Promise<T> => {
    markStart(`api-${endpoint}`)
    
    try {
      const result = await apiCall()
      return result
    } finally {
      markEnd(`api-${endpoint}`)
      const duration = measureCustomMetric(`api-${endpoint}`, `api-${endpoint}-start`, `api-${endpoint}-end`)
      
      if (duration && duration > 1000) { // More than 1 second
        console.warn(`API call to ${endpoint} took ${duration.toFixed(2)}ms`)
      }
    }
  }, [markStart, markEnd, measureCustomMetric])

  return { measureAPICall }
}

// Hook for monitoring bundle size and loading performance
export function useBundlePerformance() {
  const [bundleMetrics, setBundleMetrics] = useState<{
    jsSize: number
    cssSize: number
    totalSize: number
    loadTime: number
  } | null>(null)

  useEffect(() => {
    if (typeof window === 'undefined') return

    const measureBundleSize = () => {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      
      let jsSize = 0
      let cssSize = 0
      let totalSize = 0
      let loadTime = 0

      resources.forEach((resource) => {
        if (resource.name.includes('.js')) {
          jsSize += resource.transferSize || 0
        } else if (resource.name.includes('.css')) {
          cssSize += resource.transferSize || 0
        }
        totalSize += resource.transferSize || 0
        loadTime = Math.max(loadTime, resource.responseEnd - resource.startTime)
      })

      setBundleMetrics({
        jsSize,
        cssSize,
        totalSize,
        loadTime
      })
    }

    // Measure after page load
    if (document.readyState === 'complete') {
      measureBundleSize()
    } else {
      window.addEventListener('load', measureBundleSize)
      return () => window.removeEventListener('load', measureBundleSize)
    }
  }, [])

  return bundleMetrics
}

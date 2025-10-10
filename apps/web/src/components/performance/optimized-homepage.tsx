'use client'

import React, { Suspense, lazy } from 'react'
import { StandardHeader } from '@/components/navigation/standard-header'
import { LazyWrapper, CardSkeletonFallback } from './lazy-wrapper'
import { usePerformance } from '@/hooks/use-performance'

// Lazy load heavy components
const HeroSection = lazy(() => import('./sections/hero-section'))
const FeaturesSection = lazy(() => import('./sections/features-section'))
const TestimonialsSection = lazy(() => import('./sections/testimonials-section'))
const CTASection = lazy(() => import('./sections/cta-section'))
const Footer = lazy(() => import('./sections/footer'))

interface OptimizedHomepageProps {
  locale: string
  translations: any
}

export function OptimizedHomepage({ locale, translations }: OptimizedHomepageProps) {
  const { markStart, markEnd, measureCustomMetric } = usePerformance()

  React.useEffect(() => {
    markStart('homepage-render')
    
    return () => {
      markEnd('homepage-render')
      const duration = measureCustomMetric('homepage-render', 'homepage-render-start', 'homepage-render-end')
      
      if (duration && duration > 100) {
        console.warn(`Homepage render took ${duration.toFixed(2)}ms`)
      }
    }
  }, [markStart, markEnd, measureCustomMetric])

  const navigationItems = [
    { href: '#features', label: 'Features' },
    { href: '#pricing', label: 'Pricing' },
    { href: '#about', label: 'About' },
    { href: '#contact', label: 'Contact' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <StandardHeader
        title="ProofOfFit"
        navigation={navigationItems}
        className="bg-white/80 backdrop-blur-sm"
      />

      <main>
        <LazyWrapper fallback={<CardSkeletonFallback />}>
          <Suspense fallback={<CardSkeletonFallback />}>
            <HeroSection locale={locale} translations={translations} />
          </Suspense>
        </LazyWrapper>

        <LazyWrapper fallback={<CardSkeletonFallback />} delay={100}>
          <Suspense fallback={<CardSkeletonFallback />}>
            <FeaturesSection />
          </Suspense>
        </LazyWrapper>

        <LazyWrapper fallback={<CardSkeletonFallback />} delay={200}>
          <Suspense fallback={<CardSkeletonFallback />}>
            <TestimonialsSection />
          </Suspense>
        </LazyWrapper>

        <LazyWrapper fallback={<CardSkeletonFallback />} delay={300}>
          <Suspense fallback={<CardSkeletonFallback />}>
            <CTASection />
          </Suspense>
        </LazyWrapper>

        <LazyWrapper fallback={<CardSkeletonFallback />} delay={400}>
          <Suspense fallback={<CardSkeletonFallback />}>
            <Footer />
          </Suspense>
        </LazyWrapper>
      </main>
    </div>
  )
}

// Performance monitoring wrapper
export function withPerformanceMonitoring<P extends object>(
  Component: React.ComponentType<P>,
  componentName: string
) {
  return function PerformanceMonitoredComponent(props: P) {
    const { markStart, markEnd, measureCustomMetric } = usePerformance()

    React.useEffect(() => {
      markStart(`${componentName}-mount`)
      
      return () => {
        markEnd(`${componentName}-mount`)
        const duration = measureCustomMetric(`${componentName}-mount`, `${componentName}-mount-start`, `${componentName}-mount-end`)
        
        if (duration && duration > 50) {
          console.warn(`${componentName} mount took ${duration.toFixed(2)}ms`)
        }
      }
    }, [markStart, markEnd, measureCustomMetric])

    return <Component {...props} />
  }
}

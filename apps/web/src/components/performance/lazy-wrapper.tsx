'use client'

import React, { Suspense, lazy, ComponentType } from 'react'
import Image from 'next/image'
import { Loader2 } from 'lucide-react'

interface LazyWrapperProps {
  fallback?: React.ReactNode
  delay?: number
}

// Default loading fallback
const DefaultFallback = () => (
  <div className="flex items-center justify-center p-8">
    <div className="text-center">
      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
      <p className="text-gray-600">Loading...</p>
    </div>
  </div>
)

// Skeleton loading fallback
const SkeletonFallback = () => (
  <div className="animate-pulse">
    <div className="space-y-4">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-5/6"></div>
    </div>
  </div>
)

// Card skeleton fallback
const CardSkeletonFallback = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center space-x-4">
        <div className="h-12 w-12 bg-gray-200 rounded-full"></div>
        <div className="space-y-2 flex-1">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
      <div className="mt-4 space-y-2">
        <div className="h-3 bg-gray-200 rounded"></div>
        <div className="h-3 bg-gray-200 rounded w-5/6"></div>
      </div>
    </div>
  </div>
)

// Table skeleton fallback
const TableSkeletonFallback = () => (
  <div className="animate-pulse">
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b">
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>
      <div className="divide-y">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="px-6 py-4">
            <div className="flex items-center space-x-4">
              <div className="h-8 w-8 bg-gray-200 rounded-full"></div>
              <div className="space-y-2 flex-1">
                <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
)

// Higher-order component for lazy loading
export function withLazyLoading<P extends object>(
  Component: ComponentType<P>,
  fallback?: React.ReactNode,
  delay?: number
) {
  const LazyComponent = lazy(() => {
    if (delay) {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(import(`../components/${Component.name}`))
        }, delay)
      })
    }
    return import(`../components/${Component.name}`)
  })

  return function LazyWrapper(props: P) {
    return (
      <Suspense fallback={fallback || <DefaultFallback />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Lazy loading wrapper component
export function LazyWrapper({ 
  children, 
  fallback = <DefaultFallback />,
  delay 
}: LazyWrapperProps & { children: React.ReactNode }) {
  const [show, setShow] = React.useState(!delay)

  React.useEffect(() => {
    if (delay) {
      const timer = setTimeout(() => setShow(true), delay)
      return () => clearTimeout(timer)
    }
  }, [delay])

  if (!show) {
    return <>{fallback}</>
  }

  return <Suspense fallback={fallback}>{children}</Suspense>
}

// Preload component for critical resources
export function PreloadComponent({ 
  href, 
  as = 'script',
  crossOrigin 
}: { 
  href: string
  as?: 'script' | 'style' | 'image' | 'font'
  crossOrigin?: string
}) {
  React.useEffect(() => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.href = href
    link.as = as
    if (crossOrigin) {
      link.crossOrigin = crossOrigin
    }
    document.head.appendChild(link)

    return () => {
      document.head.removeChild(link)
    }
  }, [href, as, crossOrigin])

  return null
}

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  fallback?: React.ReactNode
  placeholder?: string
}

export function LazyImage({ 
  src, 
  alt, 
  fallback = <div className="bg-gray-200 animate-pulse rounded" />,
  placeholder,
  ...props 
}: LazyImageProps) {
  const [loaded, setLoaded] = React.useState(false)
  const [error, setError] = React.useState(false)
  const [inView, setInView] = React.useState(false)
  const imgRef = React.useRef<HTMLImageElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          observer.disconnect()
        }
      },
      { threshold: 0.1 }
    )

    if (imgRef.current) {
      observer.observe(imgRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLoad = () => {
    setLoaded(true)
  }

  const handleError = () => {
    setError(true)
  }

  if (error) {
    return <div className="bg-gray-200 rounded flex items-center justify-center text-gray-500">Failed to load</div>
  }

  return (
    <div ref={imgRef} className="relative">
      {!loaded && fallback}
      {inView && (
        <Image
          src={src}
          alt={alt}
          onLoad={handleLoad}
          onError={handleError}
          style={{ 
            opacity: loaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
          {...props}
        />
      )}
    </div>
  )
}

// Export fallback components for reuse
export {
  DefaultFallback,
  SkeletonFallback,
  CardSkeletonFallback,
  TableSkeletonFallback
}

"use client"

import React, { useEffect, useState } from 'react'

export function DegradedBanner() {
  const [visible, setVisible] = useState(false)
  const [message, setMessage] = useState('Performance may be degraded. We\'re on it.')

  useEffect(() => {
    const maintenance = process.env.NEXT_PUBLIC_MAINTENANCE_MODE === '1'
    const check = async () => {
      try {
        const res = await fetch('/api/health-simple', { cache: 'no-store' })
        const ct = res.headers.get('content-type') || ''
        if (!res.ok || !ct.includes('application/json')) throw new Error('bad')
        const data = await res.json()
        const isHealthy = data?.status === 'healthy'
        const isDegraded = data?.status === 'degraded'
        setVisible(maintenance || !isHealthy)
        
        if (!isHealthy) {
          if (isDegraded) {
            // Show a more informative message for degraded state
            setMessage('System initializing. Some features may be temporarily unavailable.')
          } else {
            // Provide more specific messaging based on service status
            const services = data?.services || {}
            const unhealthyServices = Object.entries(services)
              .filter(([_, service]: [string, any]) => service.status !== 'healthy')
              .map(([name]) => name)
            
            if (unhealthyServices.length > 0) {
              setMessage(`Service degraded. ${unhealthyServices.join(', ')} ${unhealthyServices.length === 1 ? 'is' : 'are'} experiencing issues.`)
            } else {
              setMessage('Service degraded. Some features may be slow.')
            }
          }
        }
      } catch {
        setVisible(true)
        setMessage('Service degraded. Some features may be unavailable.')
      }
    }
    check()
    const id = setInterval(check, 30000)
    return () => clearInterval(id)
  }, [])

  if (!visible) return null

  return (
    <div role="status" aria-live="polite" className="sticky top-0 z-[60] w-full bg-amber-100 text-amber-900 border-b border-amber-300">
      <div className="mx-auto max-w-7xl px-6 py-2 text-sm">
        {message}
      </div>
    </div>
  )
}

'use client'

import { useEffect } from 'react'
import { setupCtaBridge } from '@/lib/analytics'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { 
    setupCtaBridge(); 
  }, []);

  return (
    <div>
      {children}
    </div>
  )
}
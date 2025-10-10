'use client'

import { useEffect } from 'react'
import { setupCtaBridge } from '@/lib/analytics'
import { AuthProvider } from '@/components/auth/auth-provider'
import { CSRFProvider } from '@/components/security/csrf-provider'

export function Providers({ children }: { children: React.ReactNode }) {
  useEffect(() => { 
    setupCtaBridge(); 
  }, []);

  return (
    <CSRFProvider>
      <AuthProvider>
        {children}
      </AuthProvider>
    </CSRFProvider>
  )
}
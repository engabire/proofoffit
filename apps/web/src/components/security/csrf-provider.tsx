'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'

interface CSRFContextType {
  token: string | null
  loading: boolean
  error: string | null
  refreshToken: () => Promise<void>
}

const CSRFContext = createContext<CSRFContextType | undefined>(undefined)

interface CSRFProviderProps {
  children: React.ReactNode
}

export function CSRFProvider({ children }: CSRFProviderProps) {
  const [token, setToken] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchCSRFToken = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const response = await fetch('/api/csrf-token', {
        method: 'GET',
        credentials: 'include'
      })
      
      if (!response.ok) {
        throw new Error('Failed to fetch CSRF token')
      }
      
      const data = await response.json()
      setToken(data.token)
    } catch (err) {
      console.error('CSRF token fetch error:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch CSRF token')
    } finally {
      setLoading(false)
    }
  }

  const refreshToken = async () => {
    await fetchCSRFToken()
  }

  useEffect(() => {
    fetchCSRFToken()
  }, [])

  return (
    <CSRFContext.Provider value={{ token, loading, error, refreshToken }}>
      {children}
    </CSRFContext.Provider>
  )
}

export function useCSRF() {
  const context = useContext(CSRFContext)
  if (context === undefined) {
    throw new Error('useCSRF must be used within a CSRFProvider')
  }
  return context
}

// Hook to get CSRF headers for API calls
export function useCSRFHeaders() {
  const { token } = useCSRF()
  
  return {
    'Content-Type': 'application/json',
    'X-CSRF-Token': token || ''
  }
}

// Component to include CSRF token in forms
interface CSRFFormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  children: React.ReactNode
}

export function CSRFForm({ children, onSubmit, ...props }: CSRFFormProps) {
  const { token } = useCSRF()
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    
    if (!token) {
      console.error('CSRF token not available')
      return
    }
    
    // Add CSRF token to form data
    const formData = new FormData(e.currentTarget)
    formData.append('_csrf', token)
    
    // Create a new form event with the updated data
    const newEvent = new Event('submit', { bubbles: true, cancelable: true })
    Object.defineProperty(newEvent, 'target', { value: e.currentTarget })
    Object.defineProperty(newEvent, 'currentTarget', { value: e.currentTarget })
    
    if (onSubmit) {
      onSubmit(newEvent as any)
    }
  }
  
  return (
    <form {...props} onSubmit={handleSubmit}>
      {children}
    </form>
  )
}

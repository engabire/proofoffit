import { useState, useCallback, useRef, useEffect } from 'react'
import { ToastProps } from '@/components/ui/toast'

interface Toast extends Omit<ToastProps, 'id'> {
  id: string
}

let toastCount = 0

export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([])
  const timeoutsRef = useRef<Map<string, NodeJS.Timeout>>(new Map())

  const addToast = useCallback((toast: Omit<Toast, 'id'>) => {
    const id = (++toastCount).toString()
    const newToast: Toast = {
      id,
      duration: 5000,
      ...toast
    }

    setToasts(prev => [...prev, newToast])

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      const timeout = setTimeout(() => {
        removeToast(id)
      }, newToast.duration)
      
      timeoutsRef.current.set(id, timeout)
    }

    return id
  }, [])

  const removeToast = useCallback((id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id))
    
    // Clear timeout if it exists
    const timeout = timeoutsRef.current.get(id)
    if (timeout) {
      clearTimeout(timeout)
      timeoutsRef.current.delete(id)
    }
  }, [])

  const clearAllToasts = useCallback(() => {
    setToasts([])
    
    // Clear all timeouts
    timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    timeoutsRef.current.clear()
  }, [])

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(timeout => clearTimeout(timeout))
    }
  }, [])

  // Convenience methods
  const toast = {
    success: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ title, description, variant: 'success', ...options }),
    
    error: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ title, description, variant: 'error', ...options }),
    
    warning: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ title, description, variant: 'warning', ...options }),
    
    info: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ title, description, variant: 'info', ...options }),
    
    default: (title: string, description?: string, options?: Partial<Toast>) =>
      addToast({ title, description, variant: 'default', ...options })
  }

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    toast
  }
}

'use client'

import React, { useState } from 'react'
import { useAuth } from '@/hooks/use-auth'
import { Button } from '@proof-of-fit/ui'
import { LogOut, Loader2 } from 'lucide-react'

interface SecureSignOutButtonProps {
  variant?: 'default' | 'outline' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg'
  className?: string
  children?: React.ReactNode
}

export function SecureSignOutButton({ 
  variant = 'outline',
  size = 'default',
  className,
  children
}: SecureSignOutButtonProps) {
  const { signOut } = useAuth()
  const [isSigningOut, setIsSigningOut] = useState(false)

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true)
      const result = await signOut()
      
      if (!result.success) {
        console.error('Sign out failed:', result.error)
        // You might want to show a toast notification here
      }
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setIsSigningOut(false)
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={handleSignOut}
      disabled={isSigningOut}
    >
      {isSigningOut ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin mr-2" />
          Signing out...
        </>
      ) : (
        <>
          <LogOut className="h-4 w-4 mr-2" />
          {children || 'Sign Out'}
        </>
      )}
    </Button>
  )
}
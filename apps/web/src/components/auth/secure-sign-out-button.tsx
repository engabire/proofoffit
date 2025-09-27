'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@proof-of-fit/ui'
import { LogOut, Shield, AlertTriangle } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

interface SecureSignOutButtonProps {
  variant?: 'ghost' | 'outline' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  showConfirmation?: boolean
  className?: string
}

export function SecureSignOutButton({ 
  variant = 'ghost', 
  size = 'sm', 
  showConfirmation = true,
  className 
}: SecureSignOutButtonProps) {
  const supabase = createClientComponentClient()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)

  async function handleSignOut() {
    if (showConfirmation && !showConfirmDialog) {
      setShowConfirmDialog(true)
      return
    }

    try {
      setIsLoading(true)
      
      // Clear any sensitive data from localStorage/sessionStorage
      if (typeof window !== 'undefined') {
        // Clear any cached user data
        localStorage.removeItem('user_preferences')
        localStorage.removeItem('temp_data')
        sessionStorage.clear()
        
        // Clear any analytics data
        localStorage.removeItem('analytics_events')
        localStorage.removeItem('user_analytics')
      }

      // Sign out from Supabase
      const { error } = await supabase.auth.signOut()
      
      if (error) {
        console.error('Sign out error:', error)
        toast.error('Failed to sign out properly. Please try again.')
        return
      }

      // Log successful sign out for security audit
      try {
        await supabase
          .from('action_log')
          .insert({
            action: 'auth_signout',
            objType: 'user',
            payloadHash: 'signout_success'
          })
      } catch (logError) {
        // Don't fail sign out if logging fails
        console.warn('Failed to log sign out event:', logError)
      }

      toast.success('Signed out successfully')
      
      // Redirect to home page with cache busting
      router.push('/?signed_out=true&t=' + Date.now())
      
    } catch (error) {
      console.error('Unexpected sign out error:', error)
      toast.error('An unexpected error occurred during sign out')
    } finally {
      setIsLoading(false)
      setShowConfirmDialog(false)
    }
  }

  if (showConfirmDialog) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 max-w-md mx-4 shadow-xl">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-orange-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Confirm Sign Out</h3>
              <p className="text-sm text-gray-600">Are you sure you want to sign out?</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Button
              variant="outline"
              onClick={() => setShowConfirmDialog(false)}
              disabled={isLoading}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleSignOut}
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Signing Out...' : 'Sign Out'}
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleSignOut}
      disabled={isLoading}
      className={className}
      aria-label="Sign out of your account"
    >
      <LogOut className="h-4 w-4 mr-2" />
      {isLoading ? 'Signing Out...' : 'Sign Out'}
    </Button>
  )
}

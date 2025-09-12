'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import { Button } from '@proof-of-fit/ui'
import { LogOut } from 'lucide-react'

export function SignOutButton() {
  const supabase = createClientComponentClient()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <Button variant="ghost" size="sm" onClick={handleSignOut}>
      <LogOut className="h-4 w-4 mr-2" />
      Sign Out
    </Button>
  )
}
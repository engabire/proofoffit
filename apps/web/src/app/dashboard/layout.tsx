import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/auth/sign-out-button'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = createServerComponentClient({ cookies })
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/auth/signin')
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-sm">PF</span>
            </div>
            <span className="font-bold text-xl">ProofOfFit</span>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>
      <main className="container py-6">
        {children}
      </main>
    </div>
  )
}
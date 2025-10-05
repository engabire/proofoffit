import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/auth/sign-out-button'
import Link from 'next/link'
import { SectionNav } from '@/components/navigation/section-nav'

export default async function CandidateLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    redirect('/auth/signin')
  }

  const { profile } = userData
  
  if (profile?.role !== 'candidate') {
    redirect('/dashboard')
  }

  const navItems = [
    { href: '/candidate/profile', label: 'Profile', icon: '👤' },
    { href: '/candidate/matches', label: 'Job Matches', icon: '🎯' },
    { href: '/candidate/applications', label: 'Applications', icon: '📄' },
  ]

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">PF</span>
              </div>
              <span className="font-bold text-xl">ProofOfFit</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <SectionNav items={navItems} orientation="horizontal" ariaLabel="Candidate primary" />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{userData.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 space-y-2">
            <SectionNav items={navItems} ariaLabel="Candidate section" showPrevNext />
          </aside>
          
          <main className="flex-1" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
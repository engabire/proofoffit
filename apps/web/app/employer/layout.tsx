import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/auth/sign-out-button'
import Link from 'next/link'
import { SectionNav } from '@/components/navigation/section-nav'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export default async function EmployerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const userData = await getCurrentUserWithProfile()
  
  if (!userData) {
    redirect('/auth/signin')
  }

  const { profile } = userData
  
  if (profile?.role !== 'employer') {
    redirect('/dashboard')
  }

  const navItems = [
    { href: '/employer/dashboard', label: 'Dashboard', icon: '🏠' },
    { href: '/employer/jobs', label: 'Job Management', icon: '💼' },
    { href: '/employer/intake', label: 'Job Intake', icon: '📝' },
    { href: '/employer/slates', label: 'Candidate Slates', icon: '👥' },
    { href: '/employer/analytics', label: 'Analytics', icon: '📊' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50/30 via-teal-50/20 to-cyan-50/10 dark:from-emerald-950/20 dark:via-teal-950/15 dark:to-cyan-950/10">
      <header className="border-b border-emerald-200/50 dark:border-emerald-800/50 bg-white/80 dark:bg-slate-950/80 backdrop-blur">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center space-x-2">
            <Link href="/dashboard" className="flex items-center space-x-2">
              <div className="h-8 w-8 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <span className="text-white font-bold text-sm">PF</span>
              </div>
              <span className="font-bold text-xl text-emerald-900 dark:text-emerald-100">ProofOfFit</span>
            </Link>
          </div>
          
          <div className="hidden md:flex items-center space-x-2">
            <SectionNav items={navItems} orientation="horizontal" ariaLabel="Employer primary" />
          </div>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-emerald-600 dark:text-emerald-400">{userData.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 space-y-2">
            <SectionNav items={navItems} ariaLabel="Employer section" showPrevNext />
          </aside>
          
          <main className="flex-1" id="main-content">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
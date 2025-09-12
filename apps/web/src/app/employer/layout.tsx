import { getCurrentUserWithProfile } from '@/lib/auth-helpers'
import { redirect } from 'next/navigation'
import { SignOutButton } from '@/components/auth/sign-out-button'
import Link from 'next/link'

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
    { href: '/employer/intake', label: 'Job Intake', icon: '📝' },
    { href: '/employer/slates', label: 'Candidate Slates', icon: '👥' },
    { href: '/employer/analytics', label: 'Analytics', icon: '📊' },
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
          
          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex items-center space-x-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-muted-foreground">{userData.user.email}</span>
            <SignOutButton />
          </div>
        </div>
      </header>

      <div className="container py-6">
        <div className="flex flex-col md:flex-row gap-6">
          <aside className="md:w-64 space-y-2">
            <nav className="space-y-1">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center space-x-3 px-3 py-2 rounded-md text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>
          
          <main className="flex-1">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}
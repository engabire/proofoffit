'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, User, Settings, Shield, LogOut } from 'lucide-react'
import { Navigation, MobileNavigation, type NavItem } from './consistent-nav'
import { SecureSignOutButton } from '@/components/auth/secure-sign-out-button'
import { useAuth } from '@/hooks/use-auth'
import { cn } from '@/lib/utils'

interface StandardHeaderProps {
  title?: string
  logo?: React.ReactNode
  navigation?: NavItem[]
  userMenu?: NavItem[]
  className?: string
  showUserMenu?: boolean
  showMobileMenu?: boolean
}

export function StandardHeader({
  title = 'ProofOfFit',
  logo,
  navigation = [],
  userMenu = [],
  className,
  showUserMenu = true,
  showMobileMenu = true
}: StandardHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, isAuthenticated } = useAuth()
  const pathname = usePathname()

  const defaultUserMenu: NavItem[] = [
    { href: '/dashboard', label: 'Dashboard', icon: <User className="h-4 w-4" /> },
    { href: '/settings', label: 'Settings', icon: <Settings className="h-4 w-4" /> },
    { href: '/security', label: 'Security', icon: <Shield className="h-4 w-4" /> },
  ]

  const finalUserMenu = userMenu.length > 0 ? userMenu : defaultUserMenu

  const defaultLogo = (
    <div className="flex items-center space-x-2">
      <div className="h-8 w-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
        <Shield className="h-5 w-5 text-white" />
      </div>
      <span className="text-xl font-bold text-gray-900">{title}</span>
    </div>
  )

  return (
    <header className={cn(
      'sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60',
      className
    )}>
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              {logo || defaultLogo}
            </Link>
          </div>

          {/* Desktop Navigation */}
          {navigation.length > 0 && (
            <div className="hidden md:flex items-center">
              <Navigation 
                items={navigation} 
                orientation="horizontal"
                className="space-x-1"
              />
            </div>
          )}

          {/* User Menu & Actions */}
          <div className="flex items-center space-x-4">
            {isAuthenticated && showUserMenu && (
              <div className="hidden md:flex items-center space-x-2">
                <Navigation 
                  items={finalUserMenu} 
                  orientation="horizontal"
                  className="space-x-1"
                />
                <SecureSignOutButton variant="ghost" size="sm">
                  <LogOut className="h-4 w-4" />
                </SecureSignOutButton>
              </div>
            )}

            {!isAuthenticated && (
              <div className="flex items-center space-x-2">
                <Link
                  href="/auth/signin"
                  className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                >
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 transition-colors"
                >
                  Get Started
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            {showMobileMenu && (navigation.length > 0 || isAuthenticated) && (
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden p-2 hover:bg-muted rounded-md"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="h-5 w-5" />
                ) : (
                  <Menu className="h-5 w-5" />
                )}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {showMobileMenu && (
        <MobileNavigation
          items={isAuthenticated ? [...navigation, ...finalUserMenu] : navigation}
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
      )}
    </header>
  )
}

// Page Header with Breadcrumbs
interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ label: string; href?: string; icon?: React.ReactNode }>
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  breadcrumbs = [],
  actions,
  className
}: PageHeaderProps) {
  return (
    <div className={cn('border-b bg-background', className)}>
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            {breadcrumbs.length > 0 && (
              <nav className="flex items-center space-x-1 text-sm text-muted-foreground">
                {breadcrumbs.map((item, index) => (
                  <React.Fragment key={index}>
                    {item.href ? (
                      <Link
                        href={item.href}
                        className="flex items-center space-x-1 hover:text-foreground transition-colors"
                      >
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </Link>
                    ) : (
                      <span className="flex items-center space-x-1 text-foreground">
                        {item.icon && <span className="shrink-0">{item.icon}</span>}
                        <span>{item.label}</span>
                      </span>
                    )}
                    {index < breadcrumbs.length - 1 && (
                      <span className="shrink-0" aria-hidden="true">
                        <ChevronRight className="h-4 w-4" />
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </nav>
            )}
            <h1 className="text-3xl font-bold text-foreground">{title}</h1>
            {description && (
              <p className="text-muted-foreground">{description}</p>
            )}
          </div>
          {actions && (
            <div className="flex items-center space-x-2">
              {actions}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

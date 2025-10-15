'use client'

import { useRouter } from 'next/navigation'
import { Button, DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@proof-of-fit/ui'
import { Briefcase, Building2, CreditCard, GraduationCap, LineChart, Users, ChevronDown } from 'lucide-react'

const menuSections = [
  {
    title: 'Growth',
    items: [
      {
        label: 'Find New Clients',
        description: 'Surface opportunities matched to your services.',
        icon: Users,
        href: '/targets',
      },
      {
        label: 'Talent Insights',
        description: 'Benchmark hiring funnels and identify gaps.',
        icon: LineChart,
        href: '/analytics',
      },
    ],
  },
  {
    title: 'Operations',
    items: [
      {
        label: 'Manage Billing',
        description: 'Review plan usage and upcoming invoices.',
        icon: CreditCard,
        href: '/settings',
      },
      {
        label: 'Post a Job',
        description: 'Launch a compliant role intake in minutes.',
        icon: Briefcase,
        href: '/employer/intake',
      },
    ],
  },
  {
    title: 'Enablement',
    items: [
      {
        label: 'Services Marketplace',
        description: 'Partner with specialists to accelerate delivery.',
        icon: Building2,
        href: '/contact',
      },
      {
        label: 'Learning',
        description: 'Access playbooks and courses for your team.',
        icon: GraduationCap,
        href: '/fairness',
      },
    ],
  },
]

export function BusinessHubMenu() {
  const router = useRouter()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <span>My Apps</span>
          <ChevronDown className="h-4 w-4" aria-hidden="true" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-700 shadow-lg z-[100]" align="end">
        {menuSections.map((section, sectionIndex) => (
          <div key={section.title}>
            <DropdownMenuLabel className="text-xs uppercase tracking-wide text-muted-foreground">
              {section.title}
            </DropdownMenuLabel>
            {section.items.map((item) => (
              <DropdownMenuItem
                key={item.label}
                className="flex items-start gap-3 py-3"
                onSelect={(event) => {
                  event.preventDefault()
                  router.push(item.href)
                }}
              >
                <item.icon className="mt-0.5 h-4 w-4 text-primary" aria-hidden="true" />
                <div>
                  <p className="text-sm font-medium">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                </div>
              </DropdownMenuItem>
            ))}
            {sectionIndex < menuSections.length - 1 && <DropdownMenuSeparator />}
          </div>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

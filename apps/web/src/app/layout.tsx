import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'ProofOfFit - Compliance-First Hiring OS',
  description: 'A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.',
  keywords: ['hiring', 'recruitment', 'compliance', 'AI', 'candidate matching'],
  authors: [{ name: 'ProofOfFit Team' }],
  openGraph: {
    title: 'ProofOfFit - Compliance-First Hiring OS',
    description: 'A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ProofOfFit - Compliance-First Hiring OS',
    description: 'A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

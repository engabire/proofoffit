import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { DegradedBanner } from '@/components/system/degraded-banner'
import { ReportIssue } from '@/components/system/report-issue'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'),
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
      <body className={`${inter.variable} ${playfair.variable} font-sans`}>
        <Providers>
          <DegradedBanner />
          {children}
          <ReportIssue />
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

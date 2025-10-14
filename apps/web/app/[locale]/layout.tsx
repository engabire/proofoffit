import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { notFound } from 'next/navigation'
import '../globals.css'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { DegradedBanner } from '@/components/system/degraded-banner'
import { ReportIssue } from '@/components/system/report-issue'
import '@/lib/suppress-warnings'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans', display: 'swap' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-serif', display: 'swap' })

const locales = ['en', 'fr', 'rw', 'sw', 'ln']

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params
  
  const titles = {
    en: 'ProofOfFit - Compliance-First Hiring OS',
    fr: 'ProofOfFit - OS de Recrutement Prioritaire à la Conformité',
    rw: 'ProofOfFit - OS ya Gushaka Abakozi Ibanze ku Bwoba',
    sw: 'ProofOfFit - OS ya Kuajiri ya Kwanza ya Kufuata Sheria',
    ln: 'ProofOfFit - OS ya Kosala ya Liboso ya Liboso'
  }

  const descriptions = {
    en: 'A compliance-first, criteria-driven hiring OS. Candidates run a safe autopilot; employers get ranked, explainable slates.',
    fr: 'Un OS de recrutement prioritaire à la conformité et basé sur des critères. Les candidats utilisent un autopilote sécurisé; les employeurs obtiennent des listes classées et explicables.',
    rw: 'OS ya gushaka abakozi ibanze ku bwoba n\'ibisabwa. Abakandida bakoresha autopilote y\'umutekano; abakoresha bafite amashyira y\'ubwoba n\'ubwoba.',
    sw: 'OS ya kuajiri ya kwanza ya kufuata sheria na vigezo. Wagombea wanatumia autopilot ya usalama; waajiri wanapata orodha zilizopangwa na zinazoweza kufafanuliwa.',
    ln: 'OS ya kosala ya liboso ya liboso na liboso. Bakandida basepelaka na autopilot ya bokitani; bakosele bakokoka liboso ya liboso mpe ya liboso.'
  }

  return {
        metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://www.proofoffit.com'),
    title: titles[locale as keyof typeof titles] || titles.en,
    description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    keywords: ['hiring', 'recruitment', 'compliance', 'AI', 'candidate matching'],
    authors: [{ name: 'ProofOfFit Team' }],
    openGraph: {
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
      type: 'website',
      locale: locale === 'en' ? 'en_US' : locale === 'fr' ? 'fr_FR' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: titles[locale as keyof typeof titles] || titles.en,
      description: descriptions[locale as keyof typeof descriptions] || descriptions.en,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.GOOGLE_SITE_VERIFICATION,
    },
  }
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params
  
  // Validate that the incoming `locale` parameter is valid
  if (!locales.includes(locale)) {
    notFound()
  }

  // Providing all messages to the client
  // side is the easiest way to get started
  const messages = await getMessages()

  return (
    <html lang={locale} className={`${inter.variable} ${playfair.variable}`}>
      <body className="min-h-screen bg-background font-sans antialiased">
        <NextIntlClientProvider messages={messages}>
          <Providers>
            <DegradedBanner />
            <main className="relative">
              {children}
            </main>
            <Toaster />
            <ReportIssue />
          </Providers>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}

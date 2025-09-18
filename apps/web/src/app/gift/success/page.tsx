import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from '@proof-of-fit/ui'
import { CheckCircle, Gift, Share2, Calendar, Download, ExternalLink, Users, Trophy, Sparkles } from 'lucide-react'
import GiftCodeClipboard from './use-copy'
import { PageNav } from '@/components/system/page-nav'
import ShareGiftButtons from './share-gift'

interface GiftSuccessPageProps {
  searchParams: {
    code?: string
    months?: string
  }
}

export default function GiftSuccessPage({ searchParams }: GiftSuccessPageProps) {
  const code = searchParams.code ?? ''
  const months = Number.parseInt(searchParams.months || '0', 10)
  const giftValue = months * 29 // Assuming $29/month

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-4xl flex-col gap-8 px-4 py-8 md:py-16">
      {/* Celebration Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 mb-4">
          <Gift className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
          🎉 Gift Sent Successfully!
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Your {months}-month ProofOfFit gift worth <span className="font-semibold text-emerald-600">${giftValue}</span> is ready to share.
        </p>
      </div>

      <Card className="shadow-lg border-emerald-100">
        <CardHeader className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-t-lg">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-8 w-8 text-emerald-500" />
              <div>
                <CardTitle className="text-xl">Gift checkout complete</CardTitle>
                <CardDescription className="text-base mt-1">
                  We emailed your receipt and gift code. Share it with your candidate when you're ready.
                </CardDescription>
              </div>
            </div>
            <Badge variant="outline" className="bg-white border-emerald-200 text-emerald-700">
              <Trophy className="h-3 w-3 mr-1" />
              Premium Gift
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {code ? (
            <GiftCodeClipboard code={code} months={months} />
          ) : (
            <div className="rounded-lg bg-amber-50 border border-amber-200 p-4">
              <p className="text-sm text-amber-800">
                <strong>Gift code not detected:</strong> We couldn't find a gift code in this link, but your email receipt includes it. 
                <Link href="/contact" className="text-amber-600 hover:underline ml-1">
                  Contact support if needed.
                </Link>
              </p>
            </div>
          )}

          {/* Share Gift Section */}
          {code && (
            <div className="space-y-4">
              <div className="border-t pt-4">
                <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                  <Share2 className="h-5 w-5 mr-2 text-emerald-600" />
                  Share Your Gift
                </h3>
                <ShareGiftButtons code={code} months={months} giftValue={giftValue} />
              </div>
            </div>
          )}

          {/* Gift Details */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="flex items-start gap-3">
                <CheckCircle className="h-5 w-5 text-emerald-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-emerald-900">No card required</h4>
                  <p className="text-sm text-emerald-700 mt-1">
                    Recipients can unlock their sponsored months from the dashboard without storing payment details.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
              <div className="flex items-start gap-3">
                <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900">No auto-renewal</h4>
                  <p className="text-sm text-blue-700 mt-1">
                    We never auto-charge after a gift ends. Recipients can manually renew if they'd like to continue.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* What's Included */}
          <div className="rounded-lg bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              What's included in this {months}-month gift
            </h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  AI-powered resume optimization
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Industry-specific templates
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  ATS compatibility scoring
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Bias-free candidate matching
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Interview preparation tools
                </div>
                <div className="flex items-center gap-2 text-sm text-purple-700">
                  <CheckCircle className="h-4 w-4" />
                  Career advancement insights
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button size="lg" asChild className="bg-gradient-to-r from-emerald-600 to-teal-600">
              <Link href="/gift">
                <Gift className="mr-2 h-4 w-4" /> Send another gift
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/app/slate" className="flex items-center">
                <Users className="mr-2 h-4 w-4" />
                Find candidates
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>
      {/* Additional Resources */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-3 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              For Recipients
            </h3>
            <p className="text-blue-700 text-sm mb-4">
              Help your gift recipient get the most out of their ProofOfFit experience.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" asChild className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link href="/help/getting-started">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Getting Started Guide
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full border-blue-300 text-blue-700 hover:bg-blue-100">
                <Link href="/help/gift-redemption">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Gift Redemption Help
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-purple-900 mb-3 flex items-center">
              <Trophy className="h-5 w-5 mr-2" />
              For Employers
            </h3>
            <p className="text-purple-700 text-sm mb-4">
              Discover how ProofOfFit can help you find better candidates faster.
            </p>
            <div className="space-y-2">
              <Button variant="outline" size="sm" asChild className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                <Link href="/app/slate">
                  <Users className="h-4 w-4 mr-2" />
                  Find Candidates
                </Link>
              </Button>
              <Button variant="outline" size="sm" asChild className="w-full border-purple-300 text-purple-700 hover:bg-purple-100">
                <Link href="/about">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Learn About ProofOfFit
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <PageNav prev={{ href: '/gift', label: 'Gift' }} next={{ href: '/', label: 'Home' }} />
    </div>
  )
}

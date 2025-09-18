"use client"

import { useState } from 'react'
import { Button } from '@proof-of-fit/ui'

// Extend the Window interface to include gtag
declare global {
  interface Window {
    gtag?: (
      command: string,
      action: string,
      parameters?: Record<string, any>
    ) => void;
  }
}
import { 
  Mail, 
  MessageSquare, 
  Share2, 
  Copy, 
  CheckCircle, 
  ExternalLink,
  Twitter,
  Linkedin,
  Facebook,
  Download
} from 'lucide-react'

interface ShareGiftButtonsProps {
  code: string
  months: number
  giftValue: number
}

export default function ShareGiftButtons({ code, months, giftValue }: ShareGiftButtonsProps) {
  const [copied, setCopied] = useState(false)

  const giftMessage = `🎁 I've got a gift for you! Here's ${months} month${months > 1 ? 's' : ''} of ProofOfFit Premium (worth $${giftValue}) to help accelerate your career.

Use gift code: ${code}
Redeem at: https://proofoffit.com/gift/redeem

✨ What you'll get:
• AI-powered resume optimization
• Industry-specific templates  
• ATS compatibility scoring
• Bias-free job matching
• Interview preparation tools

No credit card required - just pure career acceleration! 🚀`

  const shareUrl = `https://proofoffit.com/gift/redeem?code=${code}`
  const encodedMessage = encodeURIComponent(giftMessage)
  const encodedUrl = encodeURIComponent(shareUrl)

  const trackEvent = (action: string, medium: string) => {
    // Track gift sharing events for analytics
    if (typeof window !== 'undefined') {
      // Google Analytics 4 event tracking
      window.gtag?.('event', 'share_gift', {
        event_category: 'gift',
        event_label: `${months}_month_gift`,
        value: giftValue,
        custom_parameters: {
          share_method: medium,
          gift_code: code.substring(0, 4) + '***', // Partial code for privacy
          gift_months: months
        }
      })
    }
  }

  const handleCopyMessage = async () => {
    try {
      await navigator.clipboard.writeText(giftMessage)
      setCopied(true)
      setTimeout(() => setCopied(false), 3000)
      trackEvent('copy', 'message')
    } catch (error) {
      console.error('Failed to copy message', error)
    }
  }

  const handleEmail = () => {
    const subject = encodeURIComponent(`🎁 Your ProofOfFit Premium Gift - ${months} Month${months > 1 ? 's' : ''} Free!`)
    window.location.href = `mailto:?subject=${subject}&body=${encodedMessage}`
    trackEvent('share', 'email')
  }

  const handleSMS = () => {
    const smsMessage = `🎁 I got you ${months} month${months > 1 ? 's' : ''} of ProofOfFit Premium! Use code: ${code} at https://proofoffit.com/gift/redeem - No credit card needed!`
    window.location.href = `sms:?body=${encodeURIComponent(smsMessage)}`
    trackEvent('share', 'sms')
  }

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ProofOfFit Premium Gift - ${months} Month${months > 1 ? 's' : ''}`,
          text: giftMessage,
          url: shareUrl
        })
        trackEvent('share', 'native')
      } catch (error) {
        console.error('Error sharing:', error)
      }
    } else {
      handleCopyMessage()
    }
  }

  const handleSocialShare = (platform: 'twitter' | 'linkedin' | 'facebook') => {
    const socialMessage = `🎁 Just got a ${months}-month ProofOfFit Premium gift! AI-powered career acceleration tools - no credit card needed!`
    
    const urls = {
      twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(socialMessage)}&url=${encodedUrl}`,
      linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`
    }
    
    window.open(urls[platform], '_blank', 'width=600,height=400')
    trackEvent('share', platform)
  }

  const generateEmailTemplate = () => {
    const template = `Subject: 🎁 Your ProofOfFit Premium Gift - ${months} Month${months > 1 ? 's' : ''} Free!

Hi [Name],

${giftMessage}

Best regards,
[Your Name]`

    const blob = new Blob([template], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `proofoffit_gift_template_${code}.txt`
    a.click()
    URL.revokeObjectURL(url)
    trackEvent('download', 'email_template')
  }

  return (
    <div className="space-y-4">
      {/* Quick Share Options */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Button 
          variant="outline" 
          onClick={handleEmail}
          className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-blue-50 hover:border-blue-300"
        >
          <Mail className="h-5 w-5 text-blue-600" />
          <span className="text-xs">Email</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleSMS}
          className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-green-50 hover:border-green-300"
        >
          <MessageSquare className="h-5 w-5 text-green-600" />
          <span className="text-xs">SMS</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleNativeShare}
          className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-purple-50 hover:border-purple-300"
        >
          <Share2 className="h-5 w-5 text-purple-600" />
          <span className="text-xs">Share</span>
        </Button>
        
        <Button 
          variant="outline" 
          onClick={handleCopyMessage}
          className="flex flex-col items-center gap-1 h-auto py-3 hover:bg-gray-50 hover:border-gray-300"
        >
          {copied ? (
            <CheckCircle className="h-5 w-5 text-green-600" />
          ) : (
            <Copy className="h-5 w-5 text-gray-600" />
          )}
          <span className="text-xs">{copied ? 'Copied!' : 'Copy'}</span>
        </Button>
      </div>

      {/* Social Media Sharing */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Share on social media</h4>
        <div className="flex gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('twitter')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Twitter className="h-4 w-4 text-blue-500" />
            Twitter
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('linkedin')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Linkedin className="h-4 w-4 text-blue-600" />
            LinkedIn
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleSocialShare('facebook')}
            className="flex items-center gap-2 hover:bg-blue-50 hover:border-blue-300"
          >
            <Facebook className="h-4 w-4 text-blue-700" />
            Facebook
          </Button>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="border-t pt-4">
        <h4 className="text-sm font-medium text-gray-700 mb-3">More options</h4>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={generateEmailTemplate}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <Download className="h-4 w-4" />
            Download email template
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.open(shareUrl, '_blank')}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
          >
            <ExternalLink className="h-4 w-4" />
            Preview redemption page
          </Button>
        </div>
      </div>

      {/* Gift Link */}
      <div className="bg-gray-50 rounded-lg p-4 border">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Direct redemption link</h4>
        <div className="flex items-center gap-2">
          <code className="flex-1 text-xs bg-white p-2 rounded border font-mono overflow-x-auto">
            {shareUrl}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              navigator.clipboard.writeText(shareUrl)
              setCopied(true)
              setTimeout(() => setCopied(false), 3000)
            }}
          >
            <Copy className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  )
}
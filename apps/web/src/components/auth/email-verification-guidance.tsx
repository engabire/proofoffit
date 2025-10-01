import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { 
  Mail, 
  Clock, 
  Shield, 
  CheckCircle, 
  AlertCircle, 
  RefreshCw,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react'
// Simple toast implementation
const toast = {
  success: (message: string) => console.log('Success:', message),
  error: (message: string) => console.error('Error:', message)
}

interface EmailVerificationGuidanceProps {
  email: string
  emailSentType: 'magic' | 'verification'
  onResendEmail: () => void
  isResending?: boolean
  resendCooldown?: number
}

export function EmailVerificationGuidance({ 
  email, 
  emailSentType, 
  onResendEmail, 
  isResending = false,
  resendCooldown = 60
}: EmailVerificationGuidanceProps) {
  const [timeLeft, setTimeLeft] = useState(resendCooldown)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
      return () => clearTimeout(timer)
    }
  }, [timeLeft])

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email)
    setCopied(true)
    toast.success('Email address copied to clipboard')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleResend = () => {
    if (timeLeft > 0) return
    onResendEmail()
    setTimeLeft(resendCooldown)
  }

  return (
    <Card className="border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/30">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3">
          <div className="rounded-full bg-blue-500 p-2">
            <Mail className="h-5 w-5 text-white" />
          </div>
          <div>
            <CardTitle className="text-blue-900 dark:text-blue-100 text-lg">
              {emailSentType === 'magic' ? 'Magic Link Sent!' : 'Verification Email Sent!'}
            </CardTitle>
            <p className="text-sm text-blue-700 dark:text-blue-200 mt-1">
              We've sent {emailSentType === 'magic' ? 'a magic link' : 'a verification link'} to:
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2 mt-3">
          <Badge variant="outline" className="bg-white border-blue-300 text-blue-800">
            {email}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCopyEmail}
            className="h-6 w-6 p-0"
          >
            {copied ? <Check className="h-3 w-3" /> : <Copy className="h-3 w-3" />}
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Step-by-step guidance */}
        <div className="space-y-4">
          <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            Next Steps
          </h4>
          
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="rounded-full bg-blue-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                1
              </div>
              <div>
                <p className="font-medium text-gray-900">Check your email inbox</p>
                <p className="text-sm text-gray-600 mt-1">
                  Look for an email from <strong>ProofOfFit</strong> with the subject line containing "verification" or "magic link"
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="rounded-full bg-blue-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                2
              </div>
              <div>
                <p className="font-medium text-gray-900">Click the verification link</p>
                <p className="text-sm text-gray-600 mt-1">
                  The link will automatically log you in and redirect you to your dashboard
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3 p-3 bg-white rounded-lg border border-blue-200">
              <div className="rounded-full bg-blue-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5">
                3
              </div>
              <div>
                <p className="font-medium text-gray-900">Start using ProofOfFit</p>
                <p className="text-sm text-gray-600 mt-1">
                  You'll be redirected to your personalized dashboard where you can begin your journey
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Security information */}
        <div className="bg-white rounded-lg border border-blue-200 p-4">
          <h4 className="font-semibold text-gray-900 flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-green-600" />
            Security & Privacy
          </h4>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
              Links expire after 1 hour for security
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
              Your email is encrypted and never shared
            </li>
            <li className="flex items-center gap-2">
              <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
              All access is logged for audit purposes
            </li>
          </ul>
        </div>

        {/* Troubleshooting */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <h4 className="font-semibold text-amber-900 flex items-center gap-2 mb-3">
            <AlertCircle className="h-4 w-4" />
            Email Not Arrived?
          </h4>
          <div className="space-y-2 text-sm text-amber-800">
            <p>• Check your spam/junk folder</p>
            <p>• Verify the email address is correct</p>
            <p>• Wait a few minutes for delivery</p>
            <p>• Try resending the email below</p>
          </div>
        </div>

        {/* Resend button */}
        <div className="flex items-center justify-between pt-4 border-t border-blue-200">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-200">
            <Clock className="h-4 w-4" />
            {timeLeft > 0 ? (
              <span>Resend available in {timeLeft}s</span>
            ) : (
              <span>Ready to resend</span>
            )}
          </div>
          
          <Button
            onClick={handleResend}
            disabled={timeLeft > 0 || isResending}
            variant="outline"
            size="sm"
            className="border-blue-300 text-blue-700 hover:bg-blue-100"
          >
            {isResending ? (
              <>
                <RefreshCw className="h-3 w-3 mr-2 animate-spin" />
                Sending...
              </>
            ) : (
              <>
                <RefreshCw className="h-3 w-3 mr-2" />
                Resend Email
              </>
            )}
          </Button>
        </div>

        {/* Support link */}
        <div className="text-center pt-2">
          <p className="text-xs text-blue-600 dark:text-blue-300">
            Still having trouble?{' '}
            <a 
              href="mailto:support@proofoffit.com" 
              className="underline hover:no-underline flex items-center gap-1 justify-center"
            >
              Contact Support
              <ExternalLink className="h-3 w-3" />
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  )
}

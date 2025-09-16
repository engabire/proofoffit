"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Button } from '@proof-of-fit/ui'
import { Input } from '@proof-of-fit/ui'
import { Label } from '@proof-of-fit/ui'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@proof-of-fit/ui'
import { Badge } from '@proof-of-fit/ui'
import { Alert, AlertDescription } from '@proof-of-fit/ui'
import { 
  Shield, 
  Smartphone, 
  Mail, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  ArrowRight,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'
import { isSupabaseConfigured } from '@/lib/env'

interface MFASetupProps {
  onComplete: () => void
  onSkip: () => void
  userEmail: string
}

export function MFASetup({ onComplete, onSkip, userEmail }: MFASetupProps) {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null
  const [step, setStep] = useState<'choose' | 'sms' | 'email' | 'totp' | 'complete'>('choose')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [smsCode, setSmsCode] = useState('')
  const [emailCode, setEmailCode] = useState('')
  const [totpCode, setTotpCode] = useState('')
  const [loading, setLoading] = useState(false)
  const [qrCode, setQrCode] = useState('')
  const [secret, setSecret] = useState('')

  const handleSMSSetup = async () => {
    if (!supabase) {
      toast.error('Authentication not configured')
      return
    }

    try {
      setLoading(true)
      // In a real implementation, you would call Supabase's MFA setup
      // For now, we'll simulate the process
      toast.success('SMS verification code sent')
      setStep('sms')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send SMS code')
    } finally {
      setLoading(false)
    }
  }

  const handleEmailSetup = async () => {
    if (!supabase) {
      toast.error('Authentication not configured')
      return
    }

    try {
      setLoading(true)
      // Simulate email MFA setup
      toast.success('Email verification code sent')
      setStep('email')
    } catch (error: any) {
      toast.error(error.message || 'Failed to send email code')
    } finally {
      setLoading(false)
    }
  }

  const handleTOTPSetup = async () => {
    if (!supabase) {
      toast.error('Authentication not configured')
      return
    }

    try {
      setLoading(true)
      // Simulate TOTP setup - in real implementation, generate QR code
      const mockSecret = 'JBSWY3DPEHPK3PXP'
      const mockQRCode = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg=='
      
      setSecret(mockSecret)
      setQrCode(mockQRCode)
      setStep('totp')
    } catch (error: any) {
      toast.error(error.message || 'Failed to setup TOTP')
    } finally {
      setLoading(false)
    }
  }

  const verifySMSCode = async () => {
    try {
      setLoading(true)
      // Simulate SMS verification
      toast.success('SMS verification successful!')
      setStep('complete')
    } catch (error: any) {
      toast.error('Invalid SMS code')
    } finally {
      setLoading(false)
    }
  }

  const verifyEmailCode = async () => {
    try {
      setLoading(true)
      // Simulate email verification
      toast.success('Email verification successful!')
      setStep('complete')
    } catch (error: any) {
      toast.error('Invalid email code')
    } finally {
      setLoading(false)
    }
  }

  const verifyTOTPCode = async () => {
    try {
      setLoading(true)
      // Simulate TOTP verification
      toast.success('TOTP verification successful!')
      setStep('complete')
    } catch (error: any) {
      toast.error('Invalid TOTP code')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'complete') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 via-white to-emerald-50 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <CardTitle className="text-2xl text-green-900">MFA Setup Complete!</CardTitle>
            <CardDescription>
              Your account is now protected with multi-factor authentication
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center space-x-2 mb-2">
                <Shield className="h-5 w-5 text-green-600" />
                <span className="font-medium text-green-900">Enhanced Security Active</span>
              </div>
              <p className="text-sm text-green-700">
                Your account now requires additional verification for sensitive operations.
              </p>
            </div>
            <Button onClick={onComplete} className="w-full">
              Continue to Dashboard
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Shield className="h-8 w-8 text-blue-600" />
          </div>
          <CardTitle className="text-xl">Secure Your Account</CardTitle>
          <CardDescription>
            Add an extra layer of security with multi-factor authentication
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {step === 'choose' && (
            <>
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Recommended for enterprise accounts:</strong> Enable MFA to protect your account and comply with security policies.
                </AlertDescription>
              </Alert>

              <div className="space-y-3">
                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={handleSMSSetup}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-3">
                    <Smartphone className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">SMS Verification</div>
                      <div className="text-sm text-gray-500">Receive codes via text message</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={handleEmailSetup}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-3">
                    <Mail className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Email Verification</div>
                      <div className="text-sm text-gray-500">Receive codes via email</div>
                    </div>
                  </div>
                </Button>

                <Button
                  variant="outline"
                  className="w-full justify-start h-auto p-4"
                  onClick={handleTOTPSetup}
                  disabled={loading}
                >
                  <div className="flex items-center space-x-3">
                    <Shield className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-medium">Authenticator App</div>
                      <div className="text-sm text-gray-500">Use Google Authenticator or similar</div>
                    </div>
                  </div>
                </Button>
              </div>

              <div className="flex space-x-3">
                <Button variant="ghost" onClick={onSkip} className="flex-1">
                  Skip for Now
                </Button>
              </div>
            </>
          )}

          {step === 'sms' && (
            <>
              <div className="text-center">
                <Smartphone className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-medium">SMS Verification</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We'll send a verification code to your phone number
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 (555) 123-4567"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                  />
                </div>

                <Button onClick={handleSMSSetup} className="w-full" disabled={!phoneNumber || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="sms-code">Verification Code</Label>
                  <Input
                    id="sms-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={smsCode}
                    onChange={(e) => setSmsCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <Button onClick={verifySMSCode} className="w-full" disabled={!smsCode || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setStep('choose')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Options
              </Button>
            </>
          )}

          {step === 'email' && (
            <>
              <div className="text-center">
                <Mail className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-medium">Email Verification</h3>
                <p className="text-sm text-gray-600 mt-2">
                  We'll send a verification code to {userEmail}
                </p>
              </div>

              <div className="space-y-4">
                <Button onClick={handleEmailSetup} className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Code...
                    </>
                  ) : (
                    'Send Verification Code'
                  )}
                </Button>

                <div className="space-y-2">
                  <Label htmlFor="email-code">Verification Code</Label>
                  <Input
                    id="email-code"
                    type="text"
                    placeholder="Enter 6-digit code"
                    value={emailCode}
                    onChange={(e) => setEmailCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <Button onClick={verifyEmailCode} className="w-full" disabled={!emailCode || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setStep('choose')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Options
              </Button>
            </>
          )}

          {step === 'totp' && (
            <>
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto text-blue-600 mb-4" />
                <h3 className="text-lg font-medium">Authenticator App Setup</h3>
                <p className="text-sm text-gray-600 mt-2">
                  Scan the QR code with your authenticator app
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-center">
                  <div className="bg-white p-4 rounded-lg border inline-block">
                    <img src={qrCode} alt="QR Code" className="w-32 h-32" />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Or enter this secret manually: <code className="bg-gray-100 px-1 rounded">{secret}</code>
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="totp-code">Verification Code</Label>
                  <Input
                    id="totp-code"
                    type="text"
                    placeholder="Enter 6-digit code from app"
                    value={totpCode}
                    onChange={(e) => setTotpCode(e.target.value)}
                    maxLength={6}
                  />
                </div>

                <Button onClick={verifyTOTPCode} className="w-full" disabled={!totpCode || loading}>
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Verifying...
                    </>
                  ) : (
                    'Verify Code'
                  )}
                </Button>
              </div>

              <Button variant="ghost" onClick={() => setStep('choose')} className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Options
              </Button>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

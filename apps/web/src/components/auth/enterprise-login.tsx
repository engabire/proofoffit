"use client"

import { useEffect, useMemo, useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import {
  Alert,
  AlertDescription,
  Badge,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  Input,
  Label,
  RadioGroup,
  RadioGroupItem,
  Separator,
} from '@proof-of-fit/ui'
import {
  AlertCircle,
  ArrowRight,
  Building2,
  Check,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Shield,
  Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { toast } from 'sonner'
import { detectEnterpriseDomain, getEnterpriseBranding } from '@/lib/enterprise-domains'
import { isSupabaseConfigured } from '@/lib/env'

interface EnterpriseLoginProps {
  mode?: 'signup' | 'signin'
  onSuccess?: () => void
}

export function EnterpriseLogin({ mode = 'signup', onSuccess }: EnterpriseLoginProps) {
  const supabase = isSupabaseConfigured() ? createClientComponentClient() : null

  const [email, setEmail] = useState('')
  const [role, setRole] = useState<'candidate' | 'employer'>('candidate')
  const [password, setPassword] = useState('')
  const [authMethod, setAuthMethod] = useState<'magic' | 'password' | 'sso'>('magic')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [enterpriseProvider, setEnterpriseProvider] = useState<string | null>(null)

  useEffect(() => {
    if (!email) {
      setEnterpriseProvider(null)
      setAuthMethod('magic')
      return
    }

    const enterprise = detectEnterpriseDomain(email)
    if (enterprise) {
      setEnterpriseProvider(enterprise.domain)
      setAuthMethod('sso')
    } else {
      setEnterpriseProvider(null)
      if (authMethod === 'sso') setAuthMethod('magic')
    }
  }, [email])

  const branding = useMemo(() => (enterpriseProvider ? getEnterpriseBranding(enterpriseProvider) : null), [enterpriseProvider])

  const handleMagicLink = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      const redirectTo = `${window.location.origin}/auth/callback`
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: redirectTo,
          data: { role, authMethod: 'magic' },
        },
      })
      if (error) throw error
      toast.success('Check your email for a magic link')
    } catch (error: any) {
      toast.error(error?.message ?? 'Failed to send magic link')
    } finally {
      setLoading(false)
    }
  }

  const handlePasswordAuth = async () => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      if (mode === 'signup') {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { role, authMethod: 'password' },
          },
        })
        if (error) throw error
        toast.success('Account created! Check your inbox to verify.')
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Signed in successfully!')
        onSuccess?.()
      }
    } catch (error: any) {
      toast.error(error?.message ?? 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleSSO = async (provider: string) => {
    if (!supabase) {
      toast.error('Authentication not configured. Please contact support.')
      return
    }

    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      })
      if (error) throw error
    } catch (error: any) {
      toast.error(error?.message ?? 'SSO authentication failed')
      setLoading(false)
    }
  }

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    if (authMethod === 'magic') handleMagicLink()
    if (authMethod === 'password') handlePasswordAuth()
  }

  const features = [
    'Audit-grade receipts for every action',
    'Bias-aware automations with human approvals',
    'Sponsor-friendly pricing & gift codes',
    'Enterprise SSO + SOC2 patterns ready',
  ]

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-100 via-white to-indigo-100 dark:from-slate-950 dark:via-slate-950 dark:to-slate-900">
      <div aria-hidden className="pointer-events-none absolute inset-x-0 -top-40 mx-auto h-96 max-w-3xl rounded-full bg-gradient-to-r from-sky-200/45 via-indigo-200/30 to-purple-200/25 blur-3xl dark:from-sky-500/20 dark:via-indigo-500/20 dark:to-purple-500/15" />
      <div className="relative z-10 mx-auto flex min-h-screen items-center px-6 py-16 lg:px-12">
        <div className="mx-auto grid w-full max-w-6xl gap-12 lg:grid-cols-[minmax(0,1.3fr),420px]">
          <aside className="space-y-10">
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.45em] text-sky-700 shadow-sm shadow-sky-200/50 dark:bg-sky-900/45 dark:text-sky-200">
              ProofOfFit
            </div>
            <div className="space-y-4">
              <h1 className="font-serif text-4xl tracking-tight text-slate-900 dark:text-white">
                Sign in to the hiring OS that proves every recommendation.
              </h1>
              <p className="max-w-xl text-slate-600 dark:text-slate-300">
                Calm, beautiful software with the rigor of AWS, the approachability of Indeed, and the governance demanded by enterprise talent teams.
              </p>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map((feature) => (
                <div key={feature} className="rounded-2xl border border-white/70 bg-white/85 p-4 text-sm text-slate-600 shadow-sm shadow-slate-200/30 backdrop-blur dark:border-white/10 dark:bg-slate-950/60 dark:text-slate-300">
                  <div className="mb-1 flex items-center gap-2 text-slate-500 dark:text-slate-300"><Sparkles className="h-4 w-4" />Inspiration</div>
                  <p>{feature}</p>
                </div>
              ))}
            </div>
            <div className="rounded-2xl border border-white/70 bg-white/90 p-4 text-sm text-slate-500 shadow shadow-slate-200/40 backdrop-blur dark:border-white/10 dark:bg-slate-950/70 dark:text-slate-300">
              “ProofOfFit feels like if Google’s calm design met AWS’s guardrails—the most beautiful AI workflow in our stack, and the only one with receipts.”
              <p className="mt-2 text-xs font-medium text-slate-400">Head of Talent, Inclusive Hiring Network</p>
            </div>
          </aside>

          <Card className="h-fit border border-white/70 bg-white/90 shadow-xl shadow-slate-200/50 backdrop-blur dark:border-white/10 dark:bg-slate-950/70">
            <CardHeader className="space-y-3 text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r from-sky-500 to-indigo-500 text-white shadow">
                <Shield className="h-6 w-6" />
              </div>
              <CardTitle className="text-2xl font-semibold text-slate-900 dark:text-white">
                {mode === 'signup' ? 'Create your account' : 'Welcome back'}
              </CardTitle>
              <CardDescription className="text-sm text-slate-500 dark:text-slate-300">
                Choose the authentication method that matches your security needs. Magic links, passwords, or enterprise SSO.
              </CardDescription>
              {branding && (
                <Badge variant="secondary" className="mx-auto w-fit gap-1 text-xs">
                  <Building2 className="h-3.5 w-3.5" /> {branding.name} detected
                </Badge>
              )}
            </CardHeader>

            <CardContent className="space-y-6">
              {enterpriseProvider && (
                <Alert className="border-sky-200/70 bg-sky-50/80 text-sky-800 dark:border-sky-900/60 dark:bg-sky-900/30 dark:text-sky-200">
                  <AlertDescription className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    <span>
                      <strong className="font-semibold">Enterprise domain detected.</strong> We recommend signing in with your company SSO below.
                    </span>
                  </AlertDescription>
                </Alert>
              )}

              {!enterpriseProvider && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium text-slate-700 dark:text-slate-200">Authentication method</Label>
                  <RadioGroup value={authMethod} onValueChange={(value: any) => setAuthMethod(value)} className="grid gap-3">
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${authMethod === 'magic' ? 'border-sky-200 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-900/40' : ''}`}>
                      <RadioGroupItem value="magic" id="magic" />
                      <Label htmlFor="magic" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4" /> Magic link (passwordless)
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Secure, time-boxed link sent straight to your inbox.</p>
                      </Label>
                    </div>
                    <div className={`flex items-center gap-3 rounded-xl border px-4 py-3 shadow-sm shadow-slate-200/30 transition hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 ${authMethod === 'password' ? 'border-sky-200 bg-sky-50/70 dark:border-sky-800 dark:bg-sky-900/40' : ''}`}>
                      <RadioGroupItem value="password" id="password" />
                      <Label htmlFor="password" className="flex-1 cursor-pointer text-slate-700 dark:text-slate-200">
                        <div className="flex items-center gap-2">
                          <Lock className="h-4 w-4" /> Email & password
                        </div>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Strong password checks and session protections.</p>
                      </Label>
                    </div>
                  </RadioGroup>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2">
                <Button
                  type="button"
                  variant={role === 'candidate' ? 'default' : 'outline'}
                  className={`h-auto flex-col items-start gap-1 rounded-xl border ${role === 'candidate' ? 'border-sky-200 bg-sky-500 text-white hover:bg-sky-500' : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'}`}
                  onClick={() => setRole('candidate')}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold"><User className="h-4 w-4" /> Candidate</span>
                  <span className="text-left text-xs opacity-80">Tailored Fit Reports, sponsor codes, bias-aware insights.</span>
                </Button>
                <Button
                  type="button"
                  variant={role === 'employer' ? 'default' : 'outline'}
                  className={`h-auto flex-col items-start gap-1 rounded-xl border ${role === 'employer' ? 'border-sky-200 bg-sky-500 text-white hover:bg-sky-500' : 'border-slate-200 text-slate-600 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-900'}`}
                  onClick={() => setRole('employer')}
                >
                  <span className="flex items-center gap-2 text-sm font-semibold"><Building2 className="h-4 w-4" /> Employer</span>
                  <span className="text-left text-xs opacity-80">Explainable slates, governance-ready audit trails.</span>
                </Button>
              </div>

              <form className="space-y-4" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-slate-700 dark:text-slate-200">Email address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@organization.com"
                    required
                  />
                </div>

                {authMethod === 'password' && (
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-slate-700 dark:text-slate-200">Password</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        placeholder="Create a strong password"
                        required
                      />
                      <button
                        type="button"
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        className="absolute inset-y-0 right-3 flex items-center text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300"
                        onClick={() => setShowPassword((prev) => !prev)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                )}

                {enterpriseProvider && (
                  <Alert className="border-slate-200/70 bg-slate-50/70 text-slate-700 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-200">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      Use your SSO provider below. If you need help, contact your workspace administrator.
                    </AlertDescription>
                  </Alert>
                )}

                {authMethod !== 'sso' && (
                  <Button type="submit" className="w-full" disabled={loading}>
                    {loading ? (
                      <span className="flex items-center justify-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" /> Processing
                      </span>
                    ) : (
                      <span className="flex items-center justify-center gap-2">
                        {mode === 'signup' ? 'Send access link' : 'Continue'}
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    )}
                  </Button>
                )}
              </form>

              <div className="space-y-3">
                <Separator>or continue with</Separator>
                <div className="grid gap-2">
                  <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={() => handleSSO('google')}>
                    <span className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-200">
                      <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="h-4 w-4" />
                      Google Workspace
                    </span>
                  </Button>
                  <Button type="button" variant="outline" className="w-full" disabled={loading} onClick={() => handleSSO('github')}>
                    <span className="flex items-center justify-center gap-2 text-slate-600 dark:text-slate-200">
                      <img src="https://www.svgrepo.com/show/512317/github-142.svg" alt="GitHub" className="h-4 w-4" />
                      GitHub
                    </span>
                  </Button>
                </div>
              </div>

              <Separator className="my-6" />

              <div className="text-center text-sm text-slate-500 dark:text-slate-400">
                {mode === 'signup' ? (
                  <>
                    Already have an account?{' '}
                    <Link className="font-semibold text-sky-600 hover:underline dark:text-sky-300" href="/auth/signin">
                      Sign in
                    </Link>
                  </>
                ) : (
                  <>
                    New to ProofOfFit?{' '}
                    <Link className="font-semibold text-sky-600 hover:underline dark:text-sky-300" href="/auth/signup">
                      Create an account
                    </Link>
                  </>
                )}
              </div>

              <Alert className="border-slate-200/70 bg-slate-50/80 text-slate-600 dark:border-slate-800 dark:bg-slate-900/60 dark:text-slate-300">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-xs leading-relaxed">
                  By continuing you agree to our{' '}
                  <Link className="underline" href="/terms">Terms</Link> and{' '}
                  <Link className="underline" href="/privacy">Privacy Policy</Link>. We enforce SOC2-style governance and retain audit logs for 180 days.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
